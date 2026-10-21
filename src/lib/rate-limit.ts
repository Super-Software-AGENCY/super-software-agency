/**
 * Tiny in-memory rate limiter.
 *
 * Entries are pruned lazily on every call so the map cannot grow without
 * bound (a long-running server would otherwise leak memory under abuse).
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 5;

function prune(now: number) {
  for (const [key, record] of buckets) {
    if (now > record.resetAt) buckets.delete(key);
  }
}

export function checkRateLimit(identifier: string, now = Date.now(), max = MAX_REQUESTS): boolean {
  prune(now);

  const record = buckets.get(identifier);
  if (!record) {
    buckets.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (record.count >= max) return false;

  record.count += 1;
  return true;
}

/**
 * Failure budgets for password and key guessing.
 *
 * Two ceilings per surface, both counting *failed* attempts only:
 *
 *  - per client, which stops a casual attacker quickly;
 *  - one for the whole surface, which is what actually matters, because the
 *    per-client key comes from `x-forwarded-for` and a direct client can set it
 *    to anything.
 *
 * Counting failures rather than attempts matters: if successes were counted, the
 * real admin would lock themselves out by signing in a few times, and an
 * attacker could lock them out deliberately.
 *
 * The per-client number is deliberately generous. A legitimate operator signs in
 * from one address, so five typos across a whole afternoon should not cost them
 * an hour. The global ceiling is what bounds real guessing, and it is the only
 * number an attacker cannot raise by forging a header.
 */
const GLOBAL_LOGIN_FAILURES_MAX = 60;
const PER_IP_LOGIN_FAILURES_MAX = 20;

function failuresRemaining(key: string, max: number, now: number): number {
  const record = buckets.get(key);
  if (!record || now > record.resetAt) return max;
  return Math.max(0, max - record.count);
}

function addFailure(key: string, now: number): void {
  const record = buckets.get(key);
  if (!record || now > record.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  record.count += 1;
}

const GLOBAL_FAIL_KEY = '__login_failures_global__';

/**
 * `scope` keeps the surfaces independent: a worker who fat-fingers their key
 * must not spend the budget that protects the admin password, and vice versa.
 */
function globalKey(scope: string) {
  return `${GLOBAL_FAIL_KEY}${scope}`;
}

/** True when this client, or this whole surface, has spent its failure budget. */
export function loginBlocked(scope: string, identifier: string, now = Date.now()): boolean {
  if (failuresRemaining(globalKey(scope), GLOBAL_LOGIN_FAILURES_MAX, now) <= 0) return true;
  return failuresRemaining(`__login_failures__${scope}:${identifier}`, PER_IP_LOGIN_FAILURES_MAX, now) <= 0;
}

/** Called only after a wrong password or key. */
export function recordLoginFailure(scope: string, identifier: string, now = Date.now()): void {
  addFailure(`__login_failures__${scope}:${identifier}`, now);
  addFailure(globalKey(scope), now);
}
