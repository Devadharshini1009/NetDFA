import dns from 'node:dns';
import dnsPromises from 'node:dns/promises';
import { performance } from 'node:perf_hooks';

/**
 * Computer Networks - Native DNS Resolver Service
 * 
 * Uses Node.js native `node:dns/promises`.
 * Queries 6 core Resource Record (RR) types in parallel using Promise.allSettled().
 * 
 * Auto-configures upstream resolvers if local resolver (127.0.0.1) is unreachable.
 * 
 * Accurately disambiguates:
 *  - NXDOMAIN / ENOTFOUND: The domain does not exist in authoritative DNS.
 *  - ENODATA / NODATA: The domain exists, but the queried record type does not.
 *  - SERVFAIL / TIMEOUT: Network or DNS server transmission failure.
 */

// Initialize DNS server configuration
try {
  const currentServers = dns.getServers();
  // If only loopback is configured or explicitly set in env, configure public fallback resolvers
  if (process.env.DNS_SERVERS) {
    const custom = process.env.DNS_SERVERS.split(',').map(s => s.trim());
    dns.setServers(custom);
    console.log('[DNS Resolver] Custom DNS servers configured:', custom);
  } else if (!currentServers || currentServers.length === 0 || (currentServers.length === 1 && currentServers[0] === '127.0.0.1')) {
    // 127.0.0.1 without a local DNS daemon causes ECONNREFUSED on Windows; add standard upstream resolvers
    dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
    console.log('[DNS Resolver] Configured standard upstream fallback resolvers: 8.8.8.8, 1.1.1.1');
  }
} catch (initErr) {
  console.warn('[DNS Resolver] Could not adjust DNS servers:', initErr.message);
}

export const RECORD_TYPES = ['A', 'AAAA', 'MX', 'NS', 'CNAME', 'TXT'];

export const queryDnsRecords = async (domain) => {
  const startTime = performance.now();

  // Define individual promises for each of the 6 record types
  const queries = {
    A: dnsPromises.resolve4(domain),
    AAAA: dnsPromises.resolve6(domain),
    MX: dnsPromises.resolveMx(domain),
    NS: dnsPromises.resolveNs(domain),
    CNAME: dnsPromises.resolveCname(domain),
    TXT: dnsPromises.resolveTxt(domain),
  };

  // Concurrently execute all queries using Promise.allSettled
  const results = await Promise.allSettled([
    queries.A.then(data => ({ type: 'A', data })),
    queries.AAAA.then(data => ({ type: 'AAAA', data })),
    queries.MX.then(data => ({ type: 'MX', data })),
    queries.NS.then(data => ({ type: 'NS', data })),
    queries.CNAME.then(data => ({ type: 'CNAME', data })),
    queries.TXT.then(data => ({ type: 'TXT', data: data.map(chunks => chunks.join('')) })),
  ]);

  const endTime = performance.now();
  const executionTimeMs = parseFloat((endTime - startTime).toFixed(2));

  const availableRecords = {};
  const unavailableRecords = [];
  const errors = {};

  let hasSuccessfulRecord = false;
  let allNotFound = true;
  let anyServerFailOrTimeout = false;

  RECORD_TYPES.forEach((type, index) => {
    const outcome = results[index];

    if (outcome.status === 'fulfilled') {
      const { data } = outcome.value;
      availableRecords[type] = data;
      hasSuccessfulRecord = true;
      allNotFound = false;
    } else {
      const err = outcome.reason;
      const errorCode = err.code || 'UNKNOWN';
      const errorMessage = err.message || 'Lookup failed';

      errors[type] = {
        code: errorCode,
        message: errorMessage,
      };

      if (errorCode === 'ENOTFOUND' || errorCode === 'NXDOMAIN') {
        unavailableRecords.push({
          type,
          code: errorCode,
          reason: 'Domain name not found / NXDOMAIN in authoritative DNS.',
        });
      } else if (errorCode === 'ENODATA' || errorCode === 'NODATA') {
        // ENODATA means domain DOES exist, but has no record of this specific type
        allNotFound = false;
        unavailableRecords.push({
          type,
          code: errorCode,
          reason: `Domain exists, but no ${type} record is published (ENODATA).`,
        });
      } else if (errorCode === 'ETIMEOUT' || errorCode === 'TIMEOUT') {
        allNotFound = false;
        anyServerFailOrTimeout = true;
        unavailableRecords.push({
          type,
          code: errorCode,
          reason: 'DNS resolver timed out while attempting to resolve record.',
        });
      } else if (errorCode === 'ESERVFAIL' || errorCode === 'SERVFAIL') {
        allNotFound = false;
        anyServerFailOrTimeout = true;
        unavailableRecords.push({
          type,
          code: errorCode,
          reason: 'Authoritative server returned SERVFAIL (temporary server error).',
        });
      } else {
        allNotFound = false;
        unavailableRecords.push({
          type,
          code: errorCode,
          reason: errorMessage,
        });
      }
    }
  });

  // Determine overall status
  let status = 'UNRESOLVED';
  let statusMessage = '';

  if (hasSuccessfulRecord) {
    if (unavailableRecords.length === 0) {
      status = 'SUCCESS';
      statusMessage = 'All requested DNS record types were successfully resolved.';
    } else {
      status = 'PARTIAL';
      statusMessage = `Successfully resolved ${Object.keys(availableRecords).length} record types. ${unavailableRecords.length} record types are not published for this domain.`;
    }
  } else if (allNotFound) {
    status = 'NXDOMAIN';
    statusMessage = `Non-Existent Domain (NXDOMAIN / ENOTFOUND). The domain "${domain}" is not registered or has no authoritative DNS records.`;
  } else if (anyServerFailOrTimeout) {
    status = 'ERROR';
    statusMessage = 'DNS query encountered resolver timeout or nameserver failure.';
  } else {
    // Domain may exist (e.g. all returned ENODATA or connection issues)
    status = 'NO_DATA';
    statusMessage = 'Domain exists, but none of the standard query record types (A, AAAA, MX, NS, CNAME, TXT) were returned.';
  }

  return {
    domain,
    status,
    statusMessage,
    executionTimeMs,
    records: availableRecords,
    unavailableRecords,
    errors,
    resolver: `Operating System resolver via Node.js dns/promises [${dns.getServers().join(', ')}]`,
    queriedAt: new Date().toISOString(),
  };
};
