import test from 'node:test';
import assert from 'node:assert/strict';
import { validateDomain } from '../utils/domainValidator.js';

test('Domain Validation - Valid domains', () => {
  const validDomains = [
    'google.com',
    'amazon.in',
    'example.org',
    'sub.domain.example.com',
    'my-domain-123.net',
    'a.co',
    'x.org',
  ];

  for (const domain of validDomains) {
    const res = validateDomain(domain);
    assert.equal(res.isValid, true, `Domain "${domain}" should be valid, but got: ${res.error}`);
    assert.equal(res.normalizedDomain, domain.toLowerCase());
  }
});

test('Domain Validation - Invalid syntax cases from test requirements', () => {
  // Empty input
  const emptyRes = validateDomain('');
  assert.equal(emptyRes.isValid, false);
  assert.equal(emptyRes.code, 'ERR_EMPTY_DOMAIN');

  // Consecutive dots: google..com
  const consecutiveDots = validateDomain('google..com');
  assert.equal(consecutiveDots.isValid, false);
  assert.equal(consecutiveDots.code, 'ERR_CONSECUTIVE_DOTS');

  // Invalid special char: google@com
  const specialChar = validateDomain('google@com');
  assert.equal(specialChar.isValid, false);
  // Might fail on missing TLD or invalid label char
  assert.ok(specialChar.code === 'ERR_MISSING_TLD' || specialChar.code === 'ERR_INVALID_LABEL_CHARS');

  // Leading hyphen: -google.com
  const leadingHyphen = validateDomain('-google.com');
  assert.equal(leadingHyphen.isValid, false);
  assert.equal(leadingHyphen.code, 'ERR_HYPHEN_PREFIX');

  // Trailing hyphen in label: google-.com
  const trailingHyphen = validateDomain('google-.com');
  assert.equal(trailingHyphen.isValid, false);
  assert.equal(trailingHyphen.code, 'ERR_HYPHEN_SUFFIX');

  // TLD with single character: google.c
  const singleCharTld = validateDomain('google.c');
  assert.equal(singleCharTld.isValid, false);
  assert.equal(singleCharTld.code, 'ERR_INVALID_TLD');

  // Domain with spaces
  const spaces = validateDomain('google .com');
  assert.equal(spaces.isValid, false);
  assert.equal(spaces.code, 'ERR_CONTAINS_SPACES');
});

test('Domain Validation - Max length constraints (RFC 1035)', () => {
  // Label exceeding 63 characters
  const longLabel = 'a'.repeat(64) + '.com';
  const labelRes = validateDomain(longLabel);
  assert.equal(labelRes.isValid, false);
  assert.equal(labelRes.code, 'ERR_LABEL_TOO_LONG');

  // Domain exceeding 253 characters
  const longDomain = ('a'.repeat(60) + '.').repeat(4) + 'a'.repeat(20) + '.com'; // > 253 chars
  const domainRes = validateDomain(longDomain);
  assert.equal(domainRes.isValid, false);
  assert.equal(domainRes.code, 'ERR_LENGTH_EXCEEDED');
});
