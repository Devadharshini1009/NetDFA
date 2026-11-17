import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Recreate server's exact CORS setup to verify configuration
const setupAppWithServerCors = () => {
  const app = express();

  const defaultOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
    'http://localhost:3000',
  ];

  const allowedOrigins = process.env.CORS_ORIGIN 
    ? Array.from(new Set([
        ...process.env.CORS_ORIGIN.split(',').map(o => o.trim()),
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5174',
      ]))
    : defaultOrigins;

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy blocked access from origin: ${origin}`));
    },
    credentials: true,
  }));

  app.get('/test-cors', (req, res) => {
    res.json({ success: true, message: 'CORS OK' });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
  });

  return app;
};

let server;
let baseUrl;

test.before(async () => {
  const app = setupAppWithServerCors();
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', () => {
      baseUrl = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

test.after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('CORS: Allows origin http://localhost:5173', async () => {
  const res = await fetch(`${baseUrl}/test-cors`, {
    headers: {
      Origin: 'http://localhost:5173',
    },
  });

  assert.equal(res.status, 200);
  assert.equal(res.headers.get('access-control-allow-origin'), 'http://localhost:5173');
  assert.equal(res.headers.get('access-control-allow-credentials'), 'true');
  const data = await res.json();
  assert.equal(data.success, true);
});

test('CORS: Allows origin http://localhost:5174', async () => {
  const res = await fetch(`${baseUrl}/test-cors`, {
    headers: {
      Origin: 'http://localhost:5174',
    },
  });

  assert.equal(res.status, 200);
  assert.equal(res.headers.get('access-control-allow-origin'), 'http://localhost:5174');
  assert.equal(res.headers.get('access-control-allow-credentials'), 'true');
  const data = await res.json();
  assert.equal(data.success, true);
});

test('CORS: Handles preflight OPTIONS for http://localhost:5174', async () => {
  const res = await fetch(`${baseUrl}/test-cors`, {
    method: 'OPTIONS',
    headers: {
      Origin: 'http://localhost:5174',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'Content-Type',
    },
  });

  assert.equal(res.status, 204);
  assert.equal(res.headers.get('access-control-allow-origin'), 'http://localhost:5174');
  assert.equal(res.headers.get('access-control-allow-credentials'), 'true');
});

test('CORS: Blocks unauthorized origins', async () => {
  const res = await fetch(`${baseUrl}/test-cors`, {
    headers: {
      Origin: 'http://malicious-site.example.com',
    },
  });

  assert.equal(res.status, 500);
  const data = await res.json();
  assert.match(data.error, /CORS policy blocked access from origin/);
});
