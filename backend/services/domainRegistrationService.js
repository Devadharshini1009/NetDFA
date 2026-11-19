
const RDAP_BOOTSTRAP_URL = 'https://data.iana.org/rdap/dns.json';

let bootstrapCache = null;

const getRdapBootstrap = async () => {
  if (bootstrapCache) return bootstrapCache;

  const response = await fetch(RDAP_BOOTSTRAP_URL, {
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error('RDAP bootstrap service unavailable.');
  }

  bootstrapCache = await response.json();
  return bootstrapCache;
};

export const verifyDomainRegistration = async (domain) => {
  try {
    const bootstrap = await getRdapBootstrap();

    const tld = domain.split('.').pop().toLowerCase();

    const service = bootstrap.services.find(([tlds]) =>
      tlds.includes(tld)
    );

    if (!service) {
      return {
        verified: false,
        registered: null,
        status: 'UNSUPPORTED_TLD',
        message: `RDAP verification is not available for .${tld}.`,
      };
    }

    const rdapBaseUrl = service[1][0].replace(/\/+$/, '');
    const url = `${rdapBaseUrl}/domain/${encodeURIComponent(domain)}`;

    const response = await fetch(url, {
      headers: { Accept: 'application/rdap+json' },
      signal: AbortSignal.timeout(10000),
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
      return {
        verified: false,
        registered: null,
        status: 'VERIFICATION_UNAVAILABLE',
        message: `RDAP verification failed with status ${response.status}.`,
      };
    }

    const data = await response.json();

    return {
      verified: true,
      registered: true,
      status: 'REGISTERED',
      message: 'Domain registration verified successfully.',
      registrarData: data,
    };
  } catch (error) {
    return {
      verified: false,
      registered: null,
      status: 'VERIFICATION_UNAVAILABLE',
      message: error.name === 'TimeoutError'
        ? 'Domain registration verification timed out.'
        : 'Unable to verify domain registration. Please try again.',
    };
  }
};
