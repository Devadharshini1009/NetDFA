/**
 * In-memory sliding window rate limiter
 * Protects DNS resolver from denial-of-service / query exhaustion
 */

const ipRequestMap = new Map();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60; // 60 requests per minute

// Periodically clean up stale IPs
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of ipRequestMap.entries()) {
    if (now - data.windowStart > WINDOW_MS * 2) {
      ipRequestMap.delete(ip);
    }
  }
}, WINDOW_MS);

export const rateLimiter = (req, res, next) => {
  // Skip rate limiting for health check
  if (req.path === '/api/health') {
    return next();
  }

  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip';
  const now = Date.now();

  let clientData = ipRequestMap.get(clientIp);

  if (!clientData || (now - clientData.windowStart) > WINDOW_MS) {
    clientData = {
      windowStart: now,
      count: 1,
    };
    ipRequestMap.set(clientIp, clientData);
    return next();
  }

  clientData.count += 1;

  if (clientData.count > MAX_REQUESTS_PER_WINDOW) {
    const retryAfter = Math.ceil((clientData.windowStart + WINDOW_MS - now) / 1000);
    res.setHeader('Retry-After', retryAfter);
    return res.status(429).json({
      success: false,
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Maximum ${MAX_REQUESTS_PER_WINDOW} requests per minute allowed. Please wait ${retryAfter} seconds.`,
      retryAfter,
    });
  }

  next();
};
