/**
 * Domain Name Validation Module
 * 
 * Implements RFC 1034, RFC 1035, and RFC 1123 domain syntax specifications.
 * Theoretical Context: Formal Languages and Automata Theory (Regular Languages / Regular Expressions)
 * 
 * Rules:
 *  1. Non-empty string
 *  2. Total length <= 253 characters (RFC 1035 §2.3.4)
 *  3. Cannot contain whitespace or invalid characters
 *  4. No consecutive dots (..)
 *  5. Cannot begin or end with a dot (after stripping trailing root dot)
 *  6. Minimum of two labels (Domain name + Top-Level Domain)
 *  7. Label length: 1 to 63 characters (RFC 1035 §2.3.4)
 *  8. Label format: Alphanumeric and hyphens only, no leading or trailing hyphens
 *  9. TLD specification: Must contain at least two alphabetic characters (e.g., com, org, in)
 */

export const DOMAIN_REGEX = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.(?!-)[A-Za-z0-9-]{1,63}(?<!-))*\.[A-Za-z]{2,}$/;

export const validateDomain = (rawInput) => {
  if (typeof rawInput !== 'string') {
    return {
      isValid: false,
      normalizedDomain: '',
      error: 'Domain input must be a text string.',
      code: 'ERR_INVALID_TYPE',
    };
  }

  const trimmed = rawInput.trim();

  // Rule 1: Empty input check
  if (!trimmed) {
    return {
      isValid: false,
      normalizedDomain: '',
      error: 'Domain name cannot be empty. Please enter a valid domain (e.g. google.com).',
      code: 'ERR_EMPTY_DOMAIN',
    };
  }

  // Rule 3: Spaces check
  if (/\s/.test(trimmed)) {
    return {
      isValid: false,
      normalizedDomain: trimmed,
      error: 'Domain name must not contain spaces or whitespace characters.',
      code: 'ERR_CONTAINS_SPACES',
    };
  }

  // Normalize: lowercase, strip optional single trailing dot (DNS root)
  let normalized = trimmed.toLowerCase();
  if (normalized.endsWith('.')) {
    normalized = normalized.slice(0, -1);
  }

  // Rule 2: Max length check (253 octets)
  if (normalized.length > 253) {
    return {
      isValid: false,
      normalizedDomain: normalized,
      error: `Domain length (${normalized.length} chars) exceeds maximum allowed RFC limit of 253 characters.`,
      code: 'ERR_LENGTH_EXCEEDED',
    };
  }

  // Rule 4: Consecutive dots
  if (normalized.includes('..')) {
    return {
      isValid: false,
      normalizedDomain: normalized,
      error: 'Domain name cannot contain consecutive dots ("..").',
      code: 'ERR_CONSECUTIVE_DOTS',
    };
  }

  // Rule 5: Leading or trailing dot
  if (normalized.startsWith('.') || normalized.endsWith('.')) {
    return {
      isValid: false,
      normalizedDomain: normalized,
      error: 'Domain name cannot start or end with a dot.',
      code: 'ERR_INVALID_BOUNDARY_DOT',
    };
  }

  // Rule 6: Labels check
  const labels = normalized.split('.');
  if (labels.length < 2) {
    return {
      isValid: false,
      normalizedDomain: normalized,
      error: 'Domain name must consist of at least a domain label and a Top-Level Domain (TLD) (e.g., example.org).',
      code: 'ERR_MISSING_TLD',
    };
  }

  // Check each label
  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];
    const isTld = i === labels.length - 1;

    // Rule 7: Label length (1-63 chars)
    if (label.length === 0) {
      return {
        isValid: false,
        normalizedDomain: normalized,
        error: `Empty label detected at position ${i + 1}.`,
        code: 'ERR_EMPTY_LABEL',
      };
    }

    if (label.length > 63) {
      return {
        isValid: false,
        normalizedDomain: normalized,
        error: `Label "${label}" exceeds maximum allowed length of 63 characters (RFC 1035).`,
        code: 'ERR_LABEL_TOO_LONG',
      };
    }

    // Rule 8: Hyphen positions
    if (label.startsWith('-')) {
      return {
        isValid: false,
        normalizedDomain: normalized,
        error: `Label "${label}" cannot start with a hyphen ("-").`,
        code: 'ERR_HYPHEN_PREFIX',
      };
    }

    if (label.endsWith('-')) {
      return {
        isValid: false,
        normalizedDomain: normalized,
        error: `Label "${label}" cannot end with a hyphen ("-").`,
        code: 'ERR_HYPHEN_SUFFIX',
      };
    }

    // Characters inside label: letters, digits, hyphen
    if (!/^[a-z0-9-]+$/.test(label)) {
      return {
        isValid: false,
        normalizedDomain: normalized,
        error: `Label "${label}" contains invalid characters. Only alphanumeric characters and hyphens are permitted.`,
        code: 'ERR_INVALID_LABEL_CHARS',
      };
    }

    // Rule 9: TLD specific requirements (at least two alphabetic characters)
    if (isTld) {
      if (!/^[a-z]{2,}$/.test(label)) {
        return {
          isValid: false,
          normalizedDomain: normalized,
          error: `Top-Level Domain (TLD) ".${label}" must contain at least two alphabetic characters without digits or hyphens.`,
          code: 'ERR_INVALID_TLD',
        };
      }
    }
  }

  // Regex confirmation check
  if (!DOMAIN_REGEX.test(normalized)) {
    return {
      isValid: false,
      normalizedDomain: normalized,
      error: 'Domain name syntax failed regular expression validation.',
      code: 'ERR_REGEX_MISMATCH',
    };
  }

  return {
    isValid: true,
    normalizedDomain: normalized,
    labels,
    tld: labels[labels.length - 1],
    length: normalized.length,
  };
};
