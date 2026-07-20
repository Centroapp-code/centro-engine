import { logger } from "@/lib/logger";

type Bucket = { count: number; resetAt: number };

/**
 * In-memory fixed-window rate limiter. Deliberately simple: no Redis, no
 * external service — state lives in each serverless instance's own memory.
 * That means limits are enforced per warm Vercel instance, not globally
 * across every concurrent instance (see the callers' comments and the
 * "Remaining limitations" note wherever this is used). It's still real
 * protection against a direct flood on these public, signature-verified
 * webhook endpoints — just not a hard global guarantee at high concurrency.
 */
const buckets = new Map<string, Bucket>();

// Opportunistic eviction of expired buckets once the map gets large, so a
// long-lived warm instance doesn't grow this unboundedly over many distinct
// IPs — no background timer, just a sweep on the next write past the cap.
const MAX_TRACKED_KEYS = 5000;

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

export function rateLimit({
  key,
  limit,
  windowMs,
}: {
  key: string;
  limit: number;
  windowMs: number;
}): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    if (buckets.size >= MAX_TRACKED_KEYS) {
      for (const [trackedKey, bucket] of buckets) {
        if (bucket.resetAt <= now) {
          buckets.delete(trackedKey);
        }
      }
    }
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { allowed: true, remaining: limit - existing.count, resetAt: existing.resetAt };
}

/** Best-effort client IP from Vercel's `x-forwarded-for` header. */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]!.trim();
  }
  return "unknown";
}

/**
 * Applies a rate limit keyed on route + client IP, logging when it
 * triggers. Only the route name and IP are logged — never request bodies,
 * headers, phone numbers, or other request content.
 */
export function checkRateLimit({
  route,
  request,
  limit,
  windowMs,
}: {
  route: string;
  request: Request;
  limit: number;
  windowMs: number;
}): boolean {
  const ip = getClientIp(request);
  const result = rateLimit({ key: `${route}:${ip}`, limit, windowMs });

  if (!result.allowed) {
    logger.warn("rate_limit.exceeded", { route, ip, limit, windowMs });
  }

  return result.allowed;
}
