# Pitfalls Research

**Domain:** F1 Season Tracker Web App (Sports Data Dashboard)
**Researched:** 2026-03-07
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Ergast API Is Dead -- Use Jolpica-F1 Instead

**What goes wrong:**
The project references Ergast API as a primary data source, but Ergast shut down at the beginning of 2025. Any code targeting `ergast.com/api/f1/` will fail with no data returned. This is the single biggest risk to the project -- building against a dead API.

**Why it happens:**
Ergast was the dominant free F1 API for over a decade. Most tutorials, Stack Overflow answers, and blog posts still reference it. Developers find Ergast documentation, build against it, and discover too late that the service is offline.

**How to avoid:**
Use the Jolpica-F1 API (`api.jolpi.ca/ergast/f1/`) which is a drop-in replacement with backwards-compatible endpoints. Simply swap the base URL. Jolpica is maintained by volunteers under the Apache 2.0 license and provides the same data structure Ergast did.

**Warning signs:**
- Any tutorial or code sample referencing `ergast.com` is outdated
- 404 or empty responses from Ergast endpoints
- Data stops at 2024 season

**Phase to address:**
Phase 1 (Project Setup / Data Layer). The very first API integration must target Jolpica, not Ergast. Validate connectivity before building any UI.

---

### Pitfall 2: Jolpica-F1 Rate Limits Are Tight (4 req/s, 500 req/hr)

**What goes wrong:**
Jolpica has a burst limit of 4 requests per second and a sustained limit of 500 requests per hour. A naive implementation that fetches driver standings, constructor standings, race results, and schedule data on every page load will burn through the hourly limit fast -- especially during development with hot reload triggering re-fetches.

**Why it happens:**
Developers treat free APIs like unlimited resources. With 24 races, 20 drivers, multiple endpoints (schedule, results, standings, qualifying), a single dashboard page could fire 10+ API calls. Hot reload during development multiplies this. Jolpica warns these limits will likely decrease further once they implement API tokens.

**How to avoid:**
1. Use Next.js server-side data fetching with aggressive caching via `revalidate` intervals (race data changes at most once per week on Monday after a race weekend)
2. Set `revalidate: 3600` (1 hour) for standings/results, `revalidate: 86400` (1 day) for schedule data
3. During development, cache API responses locally to avoid hitting limits
4. Never fetch from the client side directly -- always go through Next.js Route Handlers or Server Components
5. Implement a simple local JSON cache file for development that stores last-fetched data

**Warning signs:**
- HTTP 429 (Too Many Requests) responses during development
- Intermittent data loading failures
- Empty standings/results on page load

**Phase to address:**
Phase 1 (Data Layer). Build the caching strategy before building any UI. This is foundational infrastructure, not an afterthought.

---

### Pitfall 3: Next.js 14 Default Caching Causes Stale Race Data

**What goes wrong:**
Next.js 14 caches `fetch()` responses indefinitely by default (using `force-cache`). Race results from Saturday qualifying or Sunday races appear stale -- the app shows last week's results even after new results are available. Users see outdated standings that never update.

**Why it happens:**
Next.js 14's aggressive caching is designed for mostly-static content. Sports data is semi-dynamic: it changes infrequently (once per race weekend) but when it changes, users expect to see updates promptly. Developers either forget to configure revalidation or set intervals too long.

**How to avoid:**
1. Explicitly set `next: { revalidate: N }` on every `fetch()` call to external APIs -- never rely on defaults
2. Use time-based revalidation matching race weekend cadence:
   - Schedule data: `revalidate: 86400` (daily) -- rarely changes
   - Race results/standings: `revalidate: 3600` (hourly) -- updates Monday after race weekend
   - Next race countdown: `revalidate: 60` (1 minute) for countdown accuracy
3. Use `cache: 'no-store'` only for truly real-time data (countdown timers should be client-side anyway)
4. Test cache behavior in production mode (`next build && next start`), not just `next dev` which bypasses caching

**Warning signs:**
- Data looks correct in dev mode but stale in production
- Same results showing for multiple weeks
- Standings not updating after race weekends

**Phase to address:**
Phase 1 (Data Layer). Establish fetch patterns with correct revalidation as part of the data service layer.

---

### Pitfall 4: Timezone Handling Breaks Race Countdowns and Schedule Display

**What goes wrong:**
F1 races happen across 20+ time zones worldwide. A race in Japan at 14:00 JST displays as 14:00 to a user in EST, making them think it starts at 2 PM their time when it actually starts at 1 AM. Countdown timers count down to the wrong time. Users miss races because displayed times are in the wrong timezone.

**Why it happens:**
API data returns race times in UTC or local track time. Developers display these times directly without converting to the user's local timezone. JavaScript `Date` objects behave inconsistently across browsers. Server-rendered times reflect the server's timezone (UTC on Vercel), not the user's timezone.

**How to avoid:**
1. Store all times internally as UTC
2. Convert to user's local timezone only at display time using `Intl.DateTimeFormat` with the user's timezone
3. For countdown timers, calculate against UTC timestamps (not local time strings) -- countdowns must be client-side components since they depend on the user's clock
4. Use `new Date(utcString).toLocaleString()` for display, never manual timezone offset math
5. Mark countdown/schedule components with `'use client'` -- server-rendered times will show UTC (Vercel's timezone), not the user's local time
6. Test with different system timezones during development

**Warning signs:**
- Countdown shows negative time or hours off from expected
- Race times that look wrong compared to official F1 schedule
- Hydration mismatches between server (UTC) and client (local timezone) rendered times

**Phase to address:**
Phase 2 (Calendar/Schedule). Build timezone conversion utilities before any schedule UI. The countdown component on the dashboard also depends on this.

---

### Pitfall 5: CORS Blocks Client-Side API Calls

**What goes wrong:**
Fetching from Jolpica or OpenF1 directly in client-side React components (browser `fetch()`) may fail with CORS errors. The browser blocks cross-origin requests unless the API server explicitly allows it with `Access-Control-Allow-Origin` headers. Neither API has confirmed guaranteed CORS support for browser origins.

**Why it happens:**
Developers test API calls in Postman or `curl` (which ignore CORS) and assume browser calls will work the same way. They build client components that fetch directly, deploy, and discover CORS blocks in production.

**How to avoid:**
1. Always fetch external APIs from Next.js Server Components or Route Handlers (`/api/` routes) -- server-side requests are not subject to CORS restrictions
2. Use Next.js Route Handlers as a proxy: client components call `/api/standings` which internally fetches from Jolpica
3. This also centralizes rate limit management and caching
4. Never use `mode: 'no-cors'` as a workaround -- it silently returns opaque responses with no usable data

**Warning signs:**
- "Access-Control-Allow-Origin" errors in browser console
- Data works in Postman but not in the browser
- API calls succeed during SSR but fail after hydration in client components

**Phase to address:**
Phase 1 (Data Layer). This is an architectural decision that must be made upfront. All API calls go through server-side code.

---

### Pitfall 6: OpenF1 Data Scope Mismatch -- It Does Not Provide What You Think

**What goes wrong:**
OpenF1 provides telemetry, car data, lap times, and session timing -- but it does NOT provide clean race results, final standings, or calendar schedule data in the way Ergast/Jolpica does. Developers assume OpenF1 is a complete replacement for Ergast and try to build results pages from telemetry data, which is extremely complex.

**Why it happens:**
The project plan lists OpenF1 for "live session data" but developers may try to use it for everything. OpenF1's strength is granular telemetry (car speed, tire compounds, gap intervals at ~4 second resolution). It is not designed to return "who finished P1, P2, P3" in a clean format.

**How to avoid:**
1. Use Jolpica-F1 for: race calendar, race results, qualifying results, driver standings, constructor standings
2. Use OpenF1 for: optional enrichment data only (tire strategies, lap times, weather during sessions)
3. Do NOT depend on OpenF1 for core functionality in v1 -- treat it as a "nice to have" data enrichment layer
4. OpenF1 historical data is free from 2023 onwards; real-time streaming requires paid authentication

**Warning signs:**
- Spending hours trying to derive race results from OpenF1 position/lap data
- Missing data fields that Jolpica provides directly
- Needing to merge multiple OpenF1 endpoints to get what one Jolpica endpoint returns

**Phase to address:**
Phase 1 (Data Layer planning). Define which API serves which data need before writing any fetch code.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcoding 2026 race calendar as JSON | No API dependency for schedule | Must update if races are added/cancelled/rescheduled (Japan GP moved, etc.) | MVP only -- switch to API-fetched schedule before mid-season |
| Storing full API responses in localStorage | Fast offline-like reads | Bloats storage, 5MB limit hit faster, stale data served | Never -- only store user-generated data (predictions) |
| Inline SVG circuit maps in components | Simple, no external dependencies | Bundle size grows with each circuit (~50-200KB per SVG), slows page loads | Acceptable if SVGs are optimized (<20KB each) and loaded per-route |
| Skipping error boundaries for API failures | Faster development | Blank pages or crashes when APIs are down | Never -- add error states from the start |
| Using `any` types for API responses | Faster initial coding | Runtime crashes from unexpected API data shapes, no IDE help | Never -- type API responses immediately |

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Jolpica-F1 API | Fetching on every page navigation without caching | Use Next.js ISR with `revalidate` -- data changes at most weekly |
| Jolpica-F1 API | Not handling 429 rate limit responses | Implement exponential backoff and show cached/fallback data |
| OpenF1 API | Expecting consistent data types across responses | Validate and normalize all response data -- timestamps may be ISO strings or Unix microseconds |
| F1 Media CDN (headshots) | Hotlinking images directly from `media.formula1.com` | Download and serve from `/public` or use Next.js `<Image>` with configured remote patterns -- CDN may block hotlinks or change URLs between seasons |
| F1 Media CDN (team logos) | Hardcoding image URLs that change yearly | Build a driver/team mapping file that can be updated when 2026 team liveries and driver lineups are confirmed |
| Vercel Deployment | Not configuring `images.remotePatterns` in `next.config.js` | Whitelist all external image domains or requests will fail in production |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Fetching all 24 race results on calendar page load | Slow initial load, API rate limit hit | Fetch only current/next race eagerly, lazy-load past races | Immediately -- 24 API calls on one page |
| Large unoptimized SVG circuit maps | Page takes 3-5 seconds to render on mobile | Run SVGs through SVGO optimizer, lazy-load off-screen circuits | With 5+ circuit pages visited |
| Re-rendering entire standings table on every state change | Janky scrolling, input lag | Memoize components, use `React.memo` for table rows | Not a practical concern for single user, but good practice |
| localStorage reads on every render cycle | Blocking main thread, stuttery UI | Read once on mount, store in React state/context | When prediction history grows to 20+ races |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Exposing API keys in client-side code | API quota abuse, key revocation | Both Jolpica and OpenF1 free tiers need no keys -- do not add keys to client code if upgrading later. Use environment variables and server-side Route Handlers. |
| Not validating prediction input | localStorage corruption, XSS if displayed | Validate driver IDs against known list, sanitize before storing |
| Trusting localStorage data integrity | Tampered predictions (cheating scores) | For a single-user app this is low risk, but validate data shape on read with a schema |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Showing race times without timezone context | User misses races, loses trust in the app | Always display "(your local time)" label next to converted times |
| No loading states for API data | Blank page feels broken | Skeleton loaders matching final layout for standings, results, calendar |
| Prediction form available after race starts | Unfair scoring, confusion | Disable predictions with clear "Predictions locked" message once qualifying starts (use race weekend schedule) |
| No empty states for pre-season | App looks broken before first race | Show "Season starts [date]" messaging, preview content, countdown |
| Circuit maps with no context | SVG alone is meaningless | Include track length, number of turns, lap record, DRS zones as overlay or sidebar info |
| Stale countdown after race completes | Timer shows negative or zero indefinitely | Auto-transition to results view or "Race completed" state after race end time |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Race Calendar:** Often missing timezone conversion -- verify times display correctly in user's local timezone, not UTC or track-local time
- [ ] **Countdown Timer:** Often breaks across DST changes -- verify countdown accounts for daylight saving time transitions (March/November in the US)
- [ ] **Standings Pages:** Often missing "after round X" context -- verify standings show which race they are current through
- [ ] **Prediction System:** Often missing lock mechanism -- verify predictions cannot be submitted or changed after qualifying starts
- [ ] **Driver Cards:** Often missing handling for mid-season driver changes -- verify data model can handle a driver swap (e.g., reserve driver replacing main driver)
- [ ] **Results Page:** Often missing sprint race results -- verify sprint weekends show both sprint and main race results
- [ ] **Error Handling:** Often missing API-down fallback -- verify the app shows meaningful content (cached data + "last updated" timestamp) when APIs are unreachable
- [ ] **Mobile Layout:** Often broken for standings tables -- verify wide tables scroll horizontally or stack on mobile viewports

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Built against Ergast (dead API) | LOW | Find-and-replace base URL from `ergast.com/api/f1/` to `api.jolpi.ca/ergast/f1/` -- endpoints are backwards compatible |
| Hit Jolpica rate limits in production | LOW | Add `revalidate` to all fetch calls, implement server-side caching layer, reduce API call frequency |
| Timezone bugs in schedule | MEDIUM | Refactor to store UTC everywhere, convert at display time only, add timezone test suite |
| localStorage quota exceeded | MEDIUM | Migrate to only storing prediction data (not cached API responses), implement data cleanup for completed races |
| CORS failures in production | MEDIUM | Move all API calls from client components to Next.js Route Handlers or Server Components -- requires refactoring fetch patterns |
| Stale cached data showing old results | LOW | Add `revalidatePath()` or `revalidateTag()` calls, reduce `revalidate` intervals |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Dead Ergast API | Phase 1 (Setup/Data) | Verify `api.jolpi.ca` returns 2026 data successfully |
| Rate limit exhaustion | Phase 1 (Setup/Data) | Run app for 10 minutes of active dev without hitting 429 |
| Next.js caching staleness | Phase 1 (Setup/Data) | Deploy to Vercel preview, verify data updates within revalidation window |
| Timezone display errors | Phase 2 (Calendar/Schedule) | Test countdown and schedule times with system clock set to UTC, EST, and JST |
| CORS failures | Phase 1 (Setup/Data) | All API fetches work in production Vercel deployment, not just localhost |
| OpenF1 scope mismatch | Phase 1 (Planning) | Document which endpoints serve which features before coding |
| localStorage overflow | Phase 3 (Predictions) | Estimate storage per prediction, multiply by 24 races, verify under 1MB |
| Missing loading/error states | Every phase | Each page has skeleton loader and error fallback before marking complete |
| Prediction lock timing | Phase 3 (Predictions) | Verify form disabled when current UTC time is past qualifying start time |
| Mobile layout breakage | Every phase | Test every page at 375px width before marking complete |

## Sources

- [Ergast API Deprecation Discussion (Fast-F1)](https://github.com/theOehrly/Fast-F1/discussions/445) -- confirms Ergast shutdown end of 2024
- [Jolpica-F1 GitHub Repository](https://github.com/jolpica/jolpica-f1) -- Ergast successor, backwards compatible
- [Jolpica Rate Limits Documentation](https://github.com/jolpica/jolpica-f1/blob/main/docs/rate_limits.md) -- 4 req/s burst, 500 req/hr sustained
- [Jolpica Rate Limit Discussion](https://github.com/jolpica/jolpica-f1/discussions/80) -- community guidance on avoiding 429s
- [OpenF1 API Documentation](https://openf1.org/docs/) -- endpoints, data scope, authentication tiers
- [OpenF1 GitHub Repository](https://github.com/br-g/openf1) -- source and known issues
- [Next.js 14 Caching Documentation](https://nextjs.org/docs/14/app/building-your-application/data-fetching/fetching-caching-and-revalidating) -- fetch caching defaults
- [Next.js Caching Pitfalls (TrackJS)](https://trackjs.com/blog/common-errors-in-nextjs-caching/) -- common caching mistakes
- [Vercel CORS Configuration](https://vercel.com/kb/guide/how-to-enable-cors) -- enabling CORS on Vercel
- [Vercel Hobby Plan Limits](https://vercel.com/docs/plans/hobby) -- 150K function invocations, 100GB bandwidth
- [MDN localStorage Quotas](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria) -- 5-10MB browser limits
- [F1 Track SVG Vectors](https://github.com/f1laps/f1-track-vectors) -- community SVG circuit map resource

---
*Pitfalls research for: Brycen's F1 2026 Tracker*
*Researched: 2026-03-07*
