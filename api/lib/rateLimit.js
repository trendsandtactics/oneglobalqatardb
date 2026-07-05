// In-memory rate limiter, keyed per warm process instance.
// Good enough to slow down casual brute-forcing; not a substitute for a
// shared store (Redis, etc.) if this ever needs to hold under real load.
const buckets = new Map();

export function checkRateLimit(key, maxAttempts, windowMs) {
  const now = Date.now();
  const entry = buckets.get(key);
  if (!entry || now - entry.start > windowMs) {
    buckets.set(key, { count: 1, start: now });
    return true;
  }
  entry.count += 1;
  return entry.count <= maxAttempts;
}

export function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (fwd) return fwd.toString().split(',')[0].trim();
  return req.socket?.remoteAddress || req.ip || 'unknown';
}
