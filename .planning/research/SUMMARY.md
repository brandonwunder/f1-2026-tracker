# Project Research Summary

**Project:** Brycen's F1 2026 Tracker
**Domain:** Sports Data Dashboard / Personal Fan App
**Researched:** 2026-03-07
**Confidence:** HIGH

## Executive Summary

Brycen's F1 2026 Tracker is a personal-use sports dashboard built for a 13-year-old Formula 1 fan. The expert approach for this type of app is a Next.js server-rendered dashboard consuming free F1 data APIs, with client-side interactivity limited to predictions and countdown timers. The most critical discovery from research is that the Ergast API referenced in the project brief is dead (shut down early 2025). The drop-in replacement is Jolpica F1 API, which uses identical endpoint structures with a different base URL. This must be addressed from line one of development.

The recommended stack is Next.js 14 (App Router) with TypeScript, Tailwind CSS, SWR for client-side data refresh, Zustand for prediction state persistence in localStorage, and Recharts for score visualization. The architecture follows a server-first pattern: Server Components fetch race data from Jolpica with ISR caching, and Client Components handle only predictions and countdown timers. This keeps API calls server-side (avoiding CORS and rate limit issues) and delivers fast page loads. Circuit maps should be hand-crafted SVG React components, not imported via SVGR.

The primary risks are Jolpica's tight rate limits (4 req/sec, 500 req/hr), Next.js default caching causing stale race data, timezone mishandling in race schedules, and scope creep into live timing or multi-user features. All are well-understood and preventable with the patterns documented in research. The prediction game (pick P1/P2/P3 before each race) is the killer differentiator -- it transforms passive data consumption into an engaging personal experience that no commercial app provides in this simple form.

## Key Findings

### Recommended Stack

The stack is well-defined with high confidence across all choices. Every technology was selected for a specific reason tied to this project's constraints: single user, no backend, free hosting, data-heavy reads with no mutations.

**Core technologies:**
- **Next.js 14 (App Router):** Full-stack framework -- SSR for fast loads, ISR for data caching, Server Components keep API calls server-side
- **Jolpica F1 API:** Drop-in Ergast replacement -- race results, standings, schedule, driver data. Rate limited to 4 req/sec, 500 req/hr
- **SWR:** Client-side data fetching -- lighter than TanStack Query (~4KB), sufficient for GET-only reads
- **Zustand + localStorage:** Prediction state persistence -- built-in `persist` middleware handles serialization automatically
- **Recharts:** Prediction score charts -- SVG-based, declarative API, covers line/bar/area chart needs
- **Inline SVG components:** Circuit maps as `.tsx` files -- full Tailwind styling control, no build tool config
- **Tailwind CSS + clsx + tailwind-merge:** Styling foundation with `cn()` utility pattern

**Critical version note:** date-fns 4.x and framer-motion 12.x are MEDIUM confidence -- verify compatibility during setup.

### Expected Features

**Must have (table stakes):**
- Race calendar with 2026 schedule (the app skeleton -- everything links from it)
- Driver and constructor standings (the metric F1 fans check after every race)
- Race results with qualifying data
- Driver profiles as trading card grid
- Dashboard with next race countdown
- Dark theme with F1 broadcast aesthetic and team color accents
- Responsive layout (phone after races, desktop at home)

**Should have (differentiators):**
- Prediction game: P1/P2/P3 podium picks per race with 25/10/5 scoring
- Prediction score tracking: running total, accuracy stats, streak tracking, score-over-time chart
- Circuit SVG maps with DRS zones (can add incrementally, a few tracks at a time)
- Circuit info cards (track length, turns, lap record)

**Defer (v2+):**
- Head-to-head driver comparisons
- Season achievements / gamification badges
- Sprint race support (adds calendar and result complexity)
- Fastest lap tracking with bonus prediction points

**Anti-features (never build):**
- Live timing (requires paid OpenF1 tier, massive complexity, Brycen watches races on TV)
- Multi-user / social features (requires backend, auth, database -- breaks $0 budget)
- Historical seasons (scope creep -- this is a 2026 tracker)
- AI predictions, fantasy team management, push notifications

### Architecture Approach

The architecture is a clean three-layer system: Presentation (Next.js pages), Service (API clients + prediction logic), and Data (Jolpica API + localStorage). Pages are Server Components that fetch data with ISR caching and pass it as props to Client Components for interactivity. The prediction system lives entirely client-side: Zustand store with `persist` middleware wraps localStorage, a pure `scorePrediction()` function compares picks against actual results, and hooks bridge the service layer to React components.

**Major components:**
1. **F1 API Service Layer** (`lib/api/jolpica.ts`, `lib/api/openf1.ts`) -- typed fetch wrappers with response normalization, ISR caching config per endpoint
2. **Prediction System** (`lib/predictions.ts`, `lib/scoring.ts`, Zustand store) -- CRUD for picks, scoring algorithm (25/10/5), stats derivation
3. **Page Layer** (App Router pages) -- async Server Components for data pages, client components for predictions and countdown
4. **UI Component Library** (`components/`) -- domain-grouped (race/, driver/, predictions/, ui/) reusable components

**Key rendering strategy:**
| Route | Rendering | Revalidation |
|-------|-----------|-------------|
| Dashboard | Dynamic SSR | 1 hour |
| Calendar | Static + ISR | Daily |
| Race detail | Dynamic SSR | 1 hour |
| Drivers | Static + ISR | Daily |
| Standings | Dynamic SSR | 1 hour |
| Predictions | Client-only | N/A (localStorage) |

### Critical Pitfalls

1. **Ergast API is dead** -- Use Jolpica F1 API (`api.jolpi.ca/ergast/f1/`) as a drop-in replacement. Validate API connectivity before building any UI. Any tutorial referencing `ergast.com` is outdated.

2. **Jolpica rate limits are tight (4 req/s, 500 req/hr)** -- Use aggressive ISR caching (`revalidate: 3600` for results, `revalidate: 86400` for schedule). During development, cache responses to local JSON files. Never fetch from client components directly.

3. **Next.js 14 default caching causes stale data** -- Explicitly set `revalidate` on every `fetch()` call. Never rely on defaults. Test in production mode (`next build && next start`), not dev mode which bypasses caching.

4. **Timezone handling breaks countdowns and schedule display** -- Store all times as UTC. Convert at display time only using `Intl.DateTimeFormat`. Countdown must be a client component. Test with multiple system timezones.

5. **CORS blocks client-side API calls** -- All external API calls must go through Server Components or Route Handlers. Never fetch Jolpica/OpenF1 from browser-side code. This is an architectural constraint, not an afterthought.

6. **OpenF1 scope mismatch** -- OpenF1 provides telemetry, not clean race results. Use Jolpica for all core data (results, standings, schedule). OpenF1 is optional enrichment only (weather, tire data).

## Implications for Roadmap

Based on combined research, the natural build order follows data dependencies: API layer first, then read-only data pages, then the interactive prediction system, then the dashboard that composes everything, and finally polish.

### Phase 1: Project Foundation and Data Layer
**Rationale:** Everything depends on the project scaffold and working API integration. Rate limit handling and caching must be correct from day one or every subsequent phase will hit problems.
**Delivers:** Working Next.js project with dark theme, navigation shell, typed Jolpica API client with ISR caching, team color system.
**Addresses:** Dark theme, API data layer, project structure
**Avoids:** Dead Ergast API (use Jolpica from start), rate limit exhaustion (caching built in from day one), CORS (server-side only fetching), Next.js caching staleness (explicit revalidation)

### Phase 2: Race Calendar and Schedule
**Rationale:** The calendar is the app's skeleton -- nearly every other feature links from it. It also introduces timezone handling which must be solved early.
**Delivers:** Race calendar page with 2026 schedule, race detail page structure, next race countdown component, timezone conversion utilities.
**Addresses:** Race calendar, next race countdown, circuit info cards, responsive layout for calendar views
**Avoids:** Timezone display errors (build conversion utilities here), stale countdown (client-side component with proper UTC handling)

### Phase 3: Driver and Standings Pages
**Rationale:** These are the most-visited pages for an F1 fan and depend only on the API layer (Phase 1). Can be built in parallel or immediately after calendar.
**Delivers:** Driver standings table, constructor standings table, driver profile card grid with headshots and team colors.
**Addresses:** Driver standings, constructor standings, driver profiles, team color accents
**Avoids:** OpenF1 scope mismatch (use Jolpica for standings, OpenF1 only for headshot URLs if needed)

### Phase 4: Race Results
**Rationale:** Results pages depend on the race detail page structure from Phase 2 and the data layer from Phase 1. Required before predictions can be scored.
**Delivers:** Race results display (finishing order), qualifying results, results integrated into race detail pages.
**Addresses:** Race results, qualifying results
**Avoids:** Fetching all 24 race results at once (lazy-load past races), missing loading/error states

### Phase 5: Prediction System
**Rationale:** The killer feature, but it requires race calendar (to know which race is next) and race results (to score predictions). Must be built after Phases 2 and 4.
**Delivers:** P1/P2/P3 prediction form with lock mechanism, scoring engine (25/10/5 points), prediction history, score tracking with charts, streak badges.
**Addresses:** Prediction game, prediction score tracking, dashboard score widget
**Avoids:** localStorage overflow (store only predictions, not API data), prediction lock timing (disable after qualifying starts), missing empty states pre-season

### Phase 6: Dashboard and Polish
**Rationale:** The dashboard composes widgets from all other features. Circuit SVG maps and animations are polish that can be added incrementally.
**Delivers:** Dashboard hub page (countdown + standings snapshot + recent result + prediction score), circuit SVG maps (incremental), framer-motion animations, mobile responsive refinements, error boundaries.
**Addresses:** Dashboard hub, circuit SVG maps, animations, edge cases
**Avoids:** Large unoptimized SVGs (run through SVGO, keep under 20KB each), missing error boundaries

### Phase Ordering Rationale

- **Data layer first:** Every data-driven page depends on the Jolpica API client and caching strategy. Getting this wrong propagates bugs everywhere.
- **Calendar before results/predictions:** The calendar is the navigation backbone. Race detail pages provide the structure that results and predictions attach to.
- **Standings can parallel calendar:** Standings pages are independent of the calendar -- they only need the API layer. Can be built simultaneously with Phase 2.
- **Predictions after results:** The scoring engine needs actual race results to compare against. The prediction UI can be built before scoring works, but the full feature requires results.
- **Dashboard last:** It is purely compositional -- it pulls widgets from every other feature. Building it last means all the pieces exist.
- **Circuit SVGs are independent:** They have no API dependency and can be built at any time. Deferring to Phase 6 keeps early phases focused on functionality.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1:** Jolpica API integration needs hands-on validation (confirm 2026 data availability, test rate limit behavior, verify response shapes match expected types)
- **Phase 5:** Prediction lock timing logic needs research -- when exactly does qualifying start for each race weekend? Sprint weekends have different schedules.
- **Phase 6:** Circuit SVG sourcing -- the community resource (f1laps/f1-track-vectors) needs evaluation for 2026 track list compatibility

Phases with standard patterns (skip research-phase):
- **Phase 2:** Next.js App Router page structure and ISR patterns are well-documented
- **Phase 3:** Standings tables and driver card grids follow standard React component patterns
- **Phase 4:** Race results display is straightforward data rendering

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All technologies verified against official docs and npm. Jolpica confirmed as Ergast replacement. Only date-fns and framer-motion at MEDIUM (verify version compat). |
| Features | HIGH | Feature set well-scoped with clear anti-features. Prediction game scoring model is simple and validated against competitor apps. |
| Architecture | HIGH | Server Component + ISR pattern is the canonical Next.js 14 approach. Prediction-in-localStorage is appropriate for single-user scope. |
| Pitfalls | HIGH | All critical pitfalls sourced from official docs, GitHub issues, and community discussions. Ergast shutdown is a verified fact. Rate limits are documented. |

**Overall confidence:** HIGH

### Gaps to Address

- **2026 season data availability on Jolpica:** Unclear if 2026 race calendar and driver data is populated yet (season may not have started). Need a hardcoded calendar JSON as fallback.
- **F1 Media CDN image URLs for 2026:** Driver headshot and team logo URLs may change with new season liveries. Need a mapping file that can be updated.
- **OpenF1 2026 data:** OpenF1 has historical data from 2023+. Unclear if 2026 live/historical data is available yet. Treat OpenF1 as optional enrichment.
- **Jolpica rate limit changes:** Jolpica has warned limits may decrease when API tokens are introduced. Monitor their GitHub for updates.
- **Sprint race weekend schedule for 2026:** Which races are sprint weekends affects prediction lock timing and results display.

## Sources

### Primary (HIGH confidence)
- [Jolpica F1 API - GitHub](https://github.com/jolpica/jolpica-f1) -- Ergast replacement, API endpoints, rate limits
- [Jolpica Rate Limits](https://github.com/jolpica/jolpica-f1/blob/main/docs/rate_limits.md) -- 4 req/sec, 500 req/hr
- [OpenF1 API Documentation](https://openf1.org/docs/) -- 18 endpoints, data scope, auth tiers
- [Next.js 14 App Router Docs](https://nextjs.org/docs/app) -- Server Components, ISR, caching
- [Next.js Caching and Revalidation](https://nextjs.org/docs/app/getting-started/caching-and-revalidating) -- fetch defaults, revalidation
- [Ergast Deprecation Discussion](https://github.com/theOehrly/Fast-F1/discussions/445) -- confirmed shutdown early 2025
- [Recharts npm](https://www.npmjs.com/package/recharts) -- v3.8.0, 13.8M weekly downloads
- [framer-motion npm](https://www.npmjs.com/package/framer-motion) -- v12.35.1, 17.8M weekly downloads

### Secondary (MEDIUM confidence)
- [LogRocket: Best React Chart Libraries 2025](https://blog.logrocket.com/best-react-chart-libraries-2025/) -- Recharts recommended
- [LogRocket: Import SVGs in Next.js](https://blog.logrocket.com/import-svgs-next-js-apps/) -- inline SVG approach
- [State Management in 2025](https://dev.to/hijazi313/state-management-in-2025-when-to-use-context-redux-zustand-or-jotai-2d2k) -- Zustand for centralized stores
- [SWR vs TanStack Query](https://dev.to/rigalpatel001/react-query-or-swr-which-is-best-in-2025-2oa3) -- SWR for GET-only apps
- [Gridlock App](https://apps.apple.com/us/app/gridlock-race-predictions-app/id6736937071) -- competitor prediction features
- [F1 Track SVG Vectors](https://github.com/f1laps/f1-track-vectors) -- community circuit map resource

### Tertiary (LOW confidence)
- [F1 Dashboards](https://f1dashboards.com/) -- community dashboard projects for inspiration

---
*Research completed: 2026-03-07*
*Ready for roadmap: yes*
