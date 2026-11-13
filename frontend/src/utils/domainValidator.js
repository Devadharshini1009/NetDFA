/**
 * Client-Side Domain Name Validation Utility
 * Compliant with RFC 1034, RFC 1035, and RFC 1123
 */

export const DOMAIN_REGEX = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.(?!-)[A-Za-z0-9-]{1,63}(?<!-))*\.[A-Za-z]{2,}$/;

export const validateClientDomain = (rawInput) => {
  if (!rawInput || typeof rawInput !== 'string') {
    return {
      isValid: false,
      error: 'Domain name is required.',
      code: 'ERR_EMPTY_DOMAIN',
    };
  }

  const trimmed = rawInput.trim();
  if (!trimmed) {
    return {
      isValid: false,
      error: 'Domain name cannot be empty. Enter a domain such as google.com.',
      code: 'ERR_EMPTY_DOMAIN',
    };
  }

  if (/\s/.test(trimmed)) {
    return {
      isValid: false,
      error: 'Domain name cannot contain spaces or whitespace.',
      code: 'ERR_CONTAINS_SPACES',
    };
  }

  let normalized = trimmed.toLowerCase();
  if (normalized.endsWith('.')) {
    normalized = normalized.slice(0, -1);
  }

  if (normalized.length > 253) {
    return {
      isValid: false,
      error: `Domain length (${normalized.length} chars) exceeds maximum allowed RFC limit of 253 characters.`,
      code: 'ERR_LENGTH_EXCEEDED',
    };
  }

  if (normalized.includes('..')) {
    return {
      isValid: false,
      error: 'Domain name cannot contain consecutive dots ("..").',
      code: 'ERR_CONSECUTIVE_DOTS',
    };
  }

  if (normalized.startsWith('.') || normalized.endsWith('.')) {
    return {
      isValid: false,
      error: 'Domain name cannot begin or end with a dot.',
      code: 'ERR_INVALID_BOUNDARY_DOT',
    };
  }

  const labels = normalized.split('.');
  if (labels.length < 2) {
    return {
      isValid: false,
      error: 'Domain must include a Top-Level Domain (e.g., domain.com).',
      code: 'ERR_MISSING_TLD',
    };
  }

  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];
    const isTld = i === labels.length - 1;

    if (label.length === 0) {
      return {
        isValid: false,
        error: `Empty label detected at segment ${i + 1}.`,
        code: 'ERR_EMPTY_LABEL',
      };
    }

    if (label.length > 63) {
      return {
        isValid: false,
        error: `Label "${label}" exceeds 63 characters (RFC 1035).`,
        code: 'ERR_LABEL_TOO_LONG',
      };
    }

    if (label.startsWith('-')) {
      return {
        isValid: false,
        error: `Label "${label}" cannot start with a hyphen.`,
        code: 'ERR_HYPHEN_PREFIX',
      };
    }

    if (label.endsWith('-')) {
      return {
        isValid: false,
        error: `Label "${label}" cannot end with a hyphen.`,
        code: 'ERR_HYPHEN_SUFFIX',
      };
    }

    if (!/^[a-z0-9-]+$/.test(label)) {
      return {
        isValid: false,
        error: `Label "${label}" contains invalid characters. Only letters, numbers, and hyphens are allowed.`,
        code: 'ERR_INVALID_LABEL_CHARS',
      };
    }

    if (isTld && !/^[a-z]{2,}$/.test(label)) {
      return {
        isValid: false,
        error: `Top-Level Domain ".${label}" must contain at least 2 alphabetic characters.`,
        code: 'ERR_INVALID_TLD',
      };
    }
  }

  if (!DOMAIN_REGEX.test(normalized)) {
    return {
      isValid: false,
      error: 'Domain failed regular expression validation.',
      code: 'ERR_REGEX_MISMATCH',
    };
  }

  return {
    isValid: true,
    normalizedDomain: normalized,
    error: null,
  };
};
