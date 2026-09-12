type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitEntry>();

/**
 * Development-safe limiter for the assessment preview endpoint.
 * Replace with a shared Redis/edge limiter before deploying multiple instances.
 */
export function checkRateLimit(key: string, limit = 20, windowMs = 60_000) {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000),
    };
  }

  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}
