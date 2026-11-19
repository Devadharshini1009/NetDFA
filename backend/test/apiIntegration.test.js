
import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import cors from 'cors';
import dnsRoutes from '../routes/dnsRoutes.js';
import { getHealth } from '../controllers/dnsController.js';
import { errorHandler } from '../middleware/errorHandler.js';

// Setup isolated Express test instance
const createTestApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', getHealth);
  app.use('/api/dns', dnsRoutes);
  app.use(errorHandler);

  return app;
};

let server;
let baseUrl;

test.before(async () => {
  const app = createTestApp();

  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  if (server) {
    await new Promise((resolve) => {
      server.close(resolve);
    });
  }
});

// Health Check
test('GET /api/health - Returns healthy status', async () => {
  const res = await fetch(`${baseUrl}/api/health`);

  assert.equal(res.status, 200);

  const data = await res.json();

  assert.equal(data.status, 'OK');
  assert.ok(data.resolver.includes('Node.js'));
});

// Valid registered domain
test('POST /api/dns/lookup - Valid registered domain (google.com)', async () => {
  const res = await fetch(`${baseUrl}/api/dns/lookup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain: 'google.com' }),
  });

  assert.equal(res.status, 200);

  const data = await res.json();

  assert.equal(data.success, true);
  assert.equal(data.domain, 'google.com');
  assert.equal(data.isValidSyntax, true);
  assert.equal(data.isRegistered, true);
  assert.equal(data.registrationStatus, 'REGISTERED');

  assert.ok(['SUCCESS', 'PARTIAL'].includes(data.dnsStatus));
  assert.ok(data.records.A && data.records.A.length > 0);
  assert.ok(typeof data.executionTimeMs === 'number');

  // DFA final accepting state
  assert.ok(Array.isArray(data.dfaTransitions));
  assert.equal(data.currentState.code, 'S4');
  assert.equal(data.currentState.isAccepting, true);
});

// Invalid domain syntax
test('POST /api/dns/lookup - Invalid syntax: google..com', async () => {
  const res = await fetch(`${baseUrl}/api/dns/lookup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain: 'google..com' }),
  });

  assert.equal(res.status, 400);

  const data = await res.json();

  assert.equal(data.success, false);
  assert.equal(data.isValidSyntax, false);
  assert.equal(data.code, 'ERR_CONSECUTIVE_DOTS');
  assert.equal(data.currentState.code, 'S4');
});

// Invalid special character
test('POST /api/dns/lookup - Invalid syntax: google@com', async () => {
  const res = await fetch(`${baseUrl}/api/dns/lookup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain: 'google@com' }),
  });

  assert.equal(res.status, 400);

  const data = await res.json();

  assert.equal(data.success, false);
  assert.equal(data.isValidSyntax, false);
});

// Invalid leading hyphen
test('POST /api/dns/lookup - Invalid syntax: -google.com', async () => {
  const res = await fetch(`${baseUrl}/api/dns/lookup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain: '-google.com' }),
  });

  assert.equal(res.status, 400);

  const data = await res.json();

  assert.equal(data.success, false);
  assert.equal(data.code, 'ERR_HYPHEN_PREFIX');
});

// Invalid trailing hyphen
test('POST /api/dns/lookup - Invalid syntax: google-.com', async () => {
  const res = await fetch(`${baseUrl}/api/dns/lookup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain: 'google-.com' }),
  });

  assert.equal(res.status, 400);

  const data = await res.json();

  assert.equal(data.success, false);
  assert.equal(data.code, 'ERR_HYPHEN_SUFFIX');
});

// Empty domain
test('POST /api/dns/lookup - Empty input', async () => {
  const res = await fetch(`${baseUrl}/api/dns/lookup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain: '' }),
  });

  assert.equal(res.status, 400);

  const data = await res.json();

  assert.equal(data.success, false);
  assert.equal(data.code, 'ERR_EMPTY_DOMAIN');
});

// Valid registered .in domain
test('POST /api/dns/lookup - Valid registered domain (amazon.in)', async () => {
  const res = await fetch(`${baseUrl}/api/dns/lookup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain: 'amazon.in' }),
  });

  assert.equal(res.status, 200);

  const data = await res.json();

  assert.equal(data.success, true);
  assert.equal(data.domain, 'amazon.in');
  assert.equal(data.isValidSyntax, true);
  assert.equal(data.isRegistered, true);
  assert.equal(data.registrationStatus, 'REGISTERED');

  assert.ok(['SUCCESS', 'PARTIAL'].includes(data.dnsStatus));
  assert.equal(data.currentState.code, 'S4');
  assert.equal(data.currentState.isAccepting, true);
});

// Valid registered .org domain
test('POST /api/dns/lookup - Valid registered domain (example.org)', async () => {
  const res = await fetch(`${baseUrl}/api/dns/lookup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain: 'example.org' }),
  });

  assert.equal(res.status, 200);

  const data = await res.json();

  assert.equal(data.success, true);
  assert.equal(data.domain, 'example.org');
  assert.equal(data.isValidSyntax, true);
  assert.equal(data.isRegistered, true);
  assert.equal(data.registrationStatus, 'REGISTERED');

  assert.ok(['SUCCESS', 'PARTIAL'].includes(data.dnsStatus));
  assert.equal(data.currentState.code, 'S4');
  assert.equal(data.currentState.isAccepting, true);
});

// Unsupported TLD registration verification
test('POST /api/dns/lookup - example.invalid (Unsupported TLD)', async () => {
  const res = await fetch(`${baseUrl}/api/dns/lookup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain: 'example.invalid' }),
  });

  assert.equal(res.status, 503);

  const data = await res.json();

  assert.equal(data.success, false);
  assert.equal(data.isValidSyntax, true);
  assert.equal(data.isRegistered, null);
  assert.equal(data.registrationStatus, 'UNSUPPORTED_TLD');
  assert.equal(data.currentState.code, 'S4');
});

// Valid syntax but unregistered domain
test('POST /api/dns/lookup - Unregistered domain', async () => {
  const res = await fetch(`${baseUrl}/api/dns/lookup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      domain: 'test-non-existent-12345-domain.xyz',
    }),
  });

  assert.equal(res.status, 404);

  const data = await res.json();

  assert.equal(data.success, false);
  assert.equal(data.isValidSyntax, true);
  assert.equal(data.isRegistered, false);
  assert.equal(data.registrationStatus, 'NOT_REGISTERED');
  assert.equal(data.currentState.code, 'S4');
});

// MongoDB history availability
test('GET /api/dns/history - Returns clear 503 error if MongoDB is disconnected', async () => {
  const res = await fetch(`${baseUrl}/api/dns/history`);

  if (res.status === 503) {
    const data = await res.json();

    assert.equal(data.success, false);
    assert.equal(data.error, 'Database Unavailable');
  } else {
    assert.equal(res.status, 200);
  }
});
