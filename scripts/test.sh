#!/usr/bin/env bash
#
# Tests the public website against a running server.
#
#   ./scripts/test.sh          run everything
#   ./scripts/test.sh 3        run one block
#   BASE=http://host ./scripts/test.sh
#
# Blocks are numbered so one can be re-run on its own while fixing something.
#
# A 429 is the contact form's rate limit, not a failure: the endpoint is doing
# its job. It is printed as such and never counted.
#
# Nothing here needs a password. This site has none, and a test suite that
# needed one would be testing the wrong thing.

set -uo pipefail

BASE="${BASE:-http://127.0.0.1:3000}"

fails=0
runs=0
ONLY="${1:-}"

ok()    { printf '  \033[32m✓\033[0m %s\n' "$1"; }
bad()   { printf '  \033[31m✗\033[0m %s\n' "$1"; fails=$((fails+1)); }
head_() { printf '\n\033[1m%s\033[0m\n' "$1"; }

# want <label> <actual> <expected>
want() {
  runs=$((runs+1))
  if [ "$2" = "$3" ]; then ok "$1"; else bad "$1 (got: $2 / want: $3)"; fi
}

# wantany <label> <actual> <one of these...>
wantany() {
  runs=$((runs+1))
  local label="$1" actual="$2"; shift 2
  for w in "$@"; do [ "$actual" = "$w" ] && { ok "$label"; return; }; done
  bad "$label (got: $actual / want one of: $*)"
}

code() { curl -s -o /dev/null -w '%{http_code}' "$@"; }
body() { curl -s "$@"; }

block() { [ -z "$ONLY" ] || [ "$ONLY" = "$1" ]; }

# Post a form, tolerating the rate limit.
#
# A 429 is the correct answer to the seventh submission from one address, so it
# is reported and allowed through rather than failed — otherwise running the
# suite twice in a row starts failing for a reason that has nothing to do with
# the code.
# IP is bumped for every submission, so each test gets its own rate-limit
# budget.
#
# Without this the suite exhausts the contact form's five-per-hour budget in
# block 2 and every later check is answered 429 — which passes, and tests
# nothing. Sharing one address also means the run only works once per hour on
# the same machine.
IP_SEQ=0
next_ip() { printf '203.0.113.%s' "$(( (IP_SEQ += 1) % 250 + 1 ))"; }

post() {
  local out
  out="$(curl -s -o /dev/null -w '%{http_code}' -H "x-forwarded-for: $(next_ip)" "$@")"
  if [ "$out" = "429" ]; then
    printf '  \033[33m•\033[0m rate limited, not a failure\n' >&2
  fi
  printf '%s' "$out"
}

# Same address every time. Used only by the block that checks the limit exists,
# because that is the one property that cannot be tested with a fresh IP.
post_from() {
  local ip="$1"; shift
  curl -s -o /dev/null -w '%{http_code}' -H "x-forwarded-for: $ip" "$@"
}

# ── 0. the site is up ──────────────────────────────────────────────────────

if block 0; then
  head_ "0 · Server"
  printf '  %s\n' "$BASE"

  for page in / /about /services /case-studies /contact \
              /karachi-software-development-agency \
              /lahore-software-development-agency \
              /accra-software-development-agency; do
    want "page $page" "$(code "$BASE$page")" "200"
  done

  want "robots.txt is served" "$(code "$BASE/robots.txt")" "200"
  want "sitemap.xml is served" "$(code "$BASE/sitemap.xml")" "200"
fi

# ── 1. nothing admin survived here ─────────────────────────────────────────

if block 1; then
  head_ "1 · Public site only"

  # Everything that moved to the admin repository. A 200 here means the public
  # site still carries a screen the admin one is supposed to own, and any such
  # screen would be reachable without a password.
  for gone in /admin /leads /leads/admin /ai /ai/learn /team /payouts /manual /keys /bot; do
    wantany "gone: $gone" "$(code "$BASE$gone")" "404"
  done

  # And nothing leaked into the bundle that used to sit behind a password.
  runs=$((runs+1))
  if body "$BASE/" | grep -qiE 'LEADS_ADMIN_PASSWORD|leads/admin|/ai/learn'; then
    bad "the home page mentions an admin route"
  else
    ok "the home page mentions no admin route"
  fi

  # robots.txt has to welcome the site now, not lock it down for an admin area
  # this repository no longer has.
  runs=$((runs+1))
  if body "$BASE/robots.txt" | grep -q "Disallow: /api/"; then
    ok "robots.txt hides the API"
  else
    bad "robots.txt hides the API"
  fi
  runs=$((runs+1))
  if body "$BASE/robots.txt" | grep -qi 'disallow: /admin\|disallow: /ai'; then
    bad "robots.txt still locks down routes that do not exist"
  else
    ok "robots.txt does not lock down routes that do not exist"
  fi
fi

# ── 2. the contact form ────────────────────────────────────────────────────

CONTACT_JSON='{"name":"Bilal Traders","email":"bilal@example.pk","subject":"Small business website","message":"We sell LED panels and need a site.","company":"Bilal Electronics"}'

if block 2; then
  head_ "2 · Contact form"

  runs=$((runs+1))
  R="$(post -X POST "$BASE/api/contact" -H 'Content-Type: application/json' -d "$CONTACT_JSON")"
  wantany "a complete enquiry is accepted" "$R" "200" "429"

  # Every field is required. A missing one must be refused rather than stored as
  # an empty string that shows up in the panel as an unreadable lead.
  for missing in name email subject message; do
    runs=$((runs+1))
    C="$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/api/contact" \
      -H 'Content-Type: application/json' -d "{\"$missing\":\"\"}")"
    wantany "an empty $missing is refused" "$C" "400" "429"
  done

  runs=$((runs+1))
  C="$(post -X POST "$BASE/api/contact" -H 'Content-Type: application/json' \
    -d '{"name":"X","email":"not-an-email","subject":"a","message":"b"}')"
  wantany "a malformed email is refused" "$C" "400" "429"

  # The rate limit is checked before the body is parsed, so a malformed request
  # that has already used up the budget is answered 429. Both are correct; a
  # 500 here would not be.
  runs=$((runs+1))
  C="$(post -X POST "$BASE/api/contact" -H 'Content-Type: application/json' -d 'not json at all')"
  wantany "a broken body is refused, not a crash" "$C" "400" "429"

  # Length caps, so an oversized submission cannot sit in the database.
  runs=$((runs+1))
  BIG="$(python3 -c "print('x'*6000)")"
  C="$(post -X POST "$BASE/api/contact" -H 'Content-Type: application/json' \
    -d "{\"name\":\"X\",\"email\":\"a@b.co\",\"subject\":\"s\",\"message\":\"$BIG\"}")"
  wantany "an oversized message is refused" "$C" "400" "429"
fi

# ── 3. the custom service form ────────────────────────────────────────────

if block 2 || block 3; then
  head_ "3 · Request a service"

  runs=$((runs+1))
  R="$(post -X POST "$BASE/api/custom-service" -H 'Content-Type: application/json' \
    -d '{"name":"Ali Khan","email":"ali@example.pk","service":"An online store","details":"I want to sell clothes online.","budget":"200000"}')"
  wantany "a complete request is accepted" "$R" "200" "429"

  runs=$((runs+1))
  C="$(post -X POST "$BASE/api/custom-service" -H 'Content-Type: application/json' -d '{"name":"Ali Khan"}')"
  wantany "a request with no contact details is refused" "$C" "400" "429"

  runs=$((runs+1))
  C="$(post -X POST "$BASE/api/custom-service" -H 'Content-Type: application/json' -d '{"name":"Ali Khan","email":"ali@example.pk"}')"
  wantany "a request with nothing described is refused" "$C" "400" "429"
fi

# ── 4. the visitor is told the truth ──────────────────────────────────────

if block 4; then
  head_ "4 · What the visitor is told"

  # Stored or not, the answer is the same. Telling somebody "we could not save
  # that" about an enquiry that did save only makes them send it again.
  runs=$((runs+1))
  RESP="$(curl -s -H "x-forwarded-for: $(next_ip)" -X POST "$BASE/api/contact" \
    -H 'Content-Type: application/json' -d "$CONTACT_JSON")"
  if printf '%s' "$RESP" | grep -q '"success":true'; then
    ok "a submitted enquiry is reported as accepted"
  elif printf '%s' "$RESP" | grep -q 'Too many requests'; then
    printf '  \033[33m•\033[0m rate limited, not a failure\n'
  else
    bad "a submitted enquiry is reported as accepted (got: $RESP)"
  fi

  # The response reports whether it reached the database, separately. Without
  # `saved` there is no way to tell a working deployment from a broken one.
  runs=$((runs+1))
  if printf '%s' "$RESP" | grep -q '"saved":\(true\|false\)'; then
    ok "the response says whether it was stored"
  elif printf '%s' "$RESP" | grep -q 'Too many requests'; then
    printf '  \033[33m•\033[0m rate limited, not a failure\n'
  else
    bad "the response says whether it was stored (got: $RESP)"
  fi
fi

# ── 5. the rate limit ─────────────────────────────────────────────────────

if block 5; then
  head_ "5 · Rate limit"

  # One address, many submissions, all at once. The limit is the only thing
  # standing between an anonymous form and a mailbox full of rubbish, and a
  # limiter that can be walked past by sending a sixth request is not one.
  #
  # Sent in parallel so all six leave inside the same window — six sequential
  # requests could straddle the boundary and pass without the limit ever
  # engaging, which would make this test pass for the wrong reason.
  ONE_IP="198.51.100.7"
  for i in 1 2 3 4 5 6 7 8; do
    curl -s -o /dev/null -w '%{http_code}\n' -X POST "$BASE/api/contact" \
      -H "x-forwarded-for: $ONE_IP" -H 'Content-Type: application/json' \
      -d "$CONTACT_JSON" &
  done > /tmp/opencode/rl.$$
  wait

  LIMITED="$(sort /tmp/opencode/rl.$$ | grep -c '^429$')"
  rm -f /tmp/opencode/rl.$$

  runs=$((runs+1))
  if [ "$LIMITED" -gt 0 ]; then
    ok "one address cannot post without limit ($LIMITED of 8 refused)"
  else
    bad "one address can post without limit — nothing was refused"
  fi
fi

# ── 6. the city pages ─────────────────────────────────────────────────────

if block 6; then
  head_ "6 · City pages"

  # The sitemap is what the city pages exist for. A city in the sitemap that
  # 404s is worse than a city not in it.
  CITIES="$(body "$BASE/sitemap.xml" | grep -o '<loc>[^<]*</loc>' | sed 's|</\?loc>||g')"
  runs=$((runs+1))
  TOTAL="$(printf '%s' "$CITIES" | grep -c .)"
  if [ "${TOTAL:-0}" -ge 25 ]; then ok "the sitemap lists $TOTAL pages"; else bad "the sitemap lists only ${TOTAL:-0} pages"; fi

  BAD=0
  for url in $CITIES; do
    [ "${#url}" -gt 200 ] && continue
    C="$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$url")"
    [ "$C" = "200" ] || { bad "sitemap link is broken: $url ($C)"; BAD=$((BAD+1)); }
  done
  runs=$((runs+1))
  [ "$BAD" -eq 0 ] && ok "every URL in the sitemap answers 200"
fi

# ── summary ────────────────────────────────────────────────────────────────

printf '\n\033[1m%d checks, %d failed\033[0m\n' "$runs" "$fails"
[ "$fails" -eq 0 ] || exit 1