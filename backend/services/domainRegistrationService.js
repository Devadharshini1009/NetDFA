
const RDAP_BOOTSTRAP_URL = 'https://data.iana.org/rdap/dns.json';

const REQUEST_TIMEOUT_MS = 10000;

// Demo-specific blocked domains
const BLOCKED_DOMAINS = new Set([
  'ama.com',
  'deva.com',
]);

let bootstrapCache = null;

const getRdapBootstrap = async () => {
  if (bootstrapCache) {
    return bootstrapCache;
  }

  const response = await fetch(RDAP_BOOTSTRAP_URL, {
    headers: {
      Accept: 'application/json',
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error('RDAP bootstrap service unavailable.');
  }

  const data = await response.json();

  if (!Array.isArray(data.services)) {
    throw new Error('Invalid RDAP bootstrap response.');
  }

  bootstrapCache = data;

  return bootstrapCache;
};

const unavailableResult = (
  message,
  status = 'VERIFICATION_UNAVAILABLE'
) => ({
  verified: false,
  registered: null,
  status,
  message,
});

export const verifyDomainRegistration = async (domain) => {
  try {
    const normalizedDomain = domain.trim().toLowerCase();

    // Reject demo-specific blocked domains
    if (BLOCKED_DOMAINS.has(normalizedDomain)) {
      return {
        verified: true,
        registered: false,
        status: 'NOT_REGISTERED',
        message: 'Invalid domain name.',
      };
    }

    const bootstrap = await getRdapBootstrap();

    const tld = normalizedDomain.split('.').pop();

    const service = bootstrap.services.find(([tlds]) =>
      Array.isArray(tlds) &&
      tlds.some((item) => item.toLowerCase() === tld)
    );

    if (!service || !Array.isArray(service[1]) || !service[1][0]) {
      return unavailableResult(
        `RDAP verification is not available for .${tld}.`,
        'UNSUPPORTED_TLD'
      );
    }

    const rdapBaseUrl = service[1][0].replace(/\/+$/, '');

    const url = `${rdapBaseUrl}/domain/${encodeURIComponent(normalizedDomain)}`;

    const response = await fetch(url, {
      headers: {
        Accept: 'application/rdap+json, application/json',
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (response.status === 404) {
      return {
        verified: true,
        registered: false,
        status: 'NOT_REGISTERED',
        message: 'Domain registration was not found.',
      };
    }

    if (!response.ok) {
      return unavailableResult(
        `RDAP verification failed with status ${response.status}.`
      );
    }

    const data = await response.json();

    const returnedDomain = data.ldhName?.toLowerCase();

    if (
      data.objectClassName !== 'domain' ||
      returnedDomain !== normalizedDomain
    ) {
      return unavailableResult(
        'RDAP returned an invalid or mismatched domain response.'
      );
    }

    return {
      verified: true,
      registered: true,
      status: 'REGISTERED',
      message: 'Domain registration verified successfully.',
      registrarData: data,
    };

  } catch (error) {
    return unavailableResult(
      error.name === 'TimeoutError'
        ? 'Domain registration verification timed out.'
        : 'Unable to verify domain registration. Please try again.'
    );
  }
};
  