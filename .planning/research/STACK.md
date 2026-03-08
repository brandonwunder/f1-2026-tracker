# Technology Stack

**Project:** Brycen's F1 2026 Tracker
**Researched:** 2026-03-07

## Critical Data Source Update

**The Ergast API is dead.** It was shut down at the beginning of 2025. The PROJECT.md references Ergast but the project must use **Jolpica F1 API** instead -- it is the community-maintained successor with backwards-compatible Ergast endpoints. This is a drop-in replacement requiring only a base URL change.

| API | Base URL | Purpose | Rate Limits |
|-----|----------|---------|-------------|
| Jolpica F1 | `https://api.jolpi.ca/ergast/f1/` | Results, standings, schedules, qualifying, pit stops | 4 req/sec burst, 500 req/hr sustained |
| OpenF1 | `https://api.openf1.org/v1/` | Driver details, session results, starting grids, weather, pit data | Free, no auth required |

**Confidence: HIGH** -- Verified via Jolpica GitHub docs and OpenF1 official docs.

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Next.js | 14.x (App Router) | Full-stack React framework | Already decided. SSR for SEO, ISR for race data caching, Vercel-native deployment. App Router with Server Components keeps API calls server-side. | HIGH |
| TypeScript | 5.x | Type safety | Already decided. F1 data has complex nested structures (driver standings, race results) -- types prevent bugs. | HIGH |
| Tailwind CSS | 3.x | Styling | Already decided. Utility-first works well for the F1 dark theme. Custom colors for team accents are trivial with config. | HIGH |
| React | 18.x | UI library | Ships with Next.js 14. Server Components are key for this data-heavy app. | HIGH |

### Data Fetching

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| SWR | 2.x | Client-side data fetching & caching | Lighter than TanStack Query (~4KB vs ~13KB). Built by Vercel, integrates seamlessly with Next.js. This app has simple GET-only data needs (no mutations to APIs), so SWR's simpler API is the right fit. TanStack Query's mutation hooks and DevTools are overkill here. | HIGH |
| Native fetch | built-in | Server-side data fetching | Next.js 14 extends native fetch with caching (`revalidate`, `force-cache`). Use in Server Components for initial page loads. No library needed server-side. | HIGH |

**Pattern:** Server Components fetch initial data (standings, calendar, results) at build/request time with ISR. Client Components use SWR for polling/refreshing during race weekends.

### Charting

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Recharts | 3.x | Prediction score graphs, accuracy charts | 13.8M weekly downloads, largest React charting community. Declarative API matches React patterns. Built on D3 + SVG so charts render server-side. Line charts, bar charts, and area charts cover all prediction tracking needs. Simple API for the scope of this project (2-3 chart types max). | HIGH |

**What to chart:** Prediction score over time (line chart), accuracy breakdown per race (bar chart), points distribution (area chart).

### SVG Handling (Circuit Maps)

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Inline SVG as React components | n/a | Circuit map rendering | Circuit maps are static, hand-crafted SVGs. Import them directly as JSX components -- no build tool config needed, full CSS/Tailwind control for dark theme styling, can add hover states on sectors/DRS zones. No SVGR config complexity. | HIGH |

**Approach:** Create each circuit as a `.tsx` file exporting an SVG component. Style with Tailwind classes and CSS custom properties for team colors. Store in `src/components/circuits/`. This gives full control over DRS zones, sectors, and start/finish markers.

**Do NOT use:** `@svgr/webpack` -- adds build config complexity for no benefit when circuits are hand-crafted components. Do NOT use `next/image` for circuit SVGs -- loses ability to style individual paths.

### State Management

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Zustand | 5.x | Prediction state, app preferences | This app stores predictions in localStorage. Zustand has built-in `persist` middleware that handles localStorage serialization/deserialization automatically. ~1KB bundle. No Provider component needed (unlike Jotai). Simple store pattern: `usePredictionStore()`. | HIGH |

**Store design:** One store for predictions (picks per race, scores, streaks). Zustand's `persist` middleware replaces all manual `localStorage.getItem/setItem` calls.

**Do NOT use:** Redux (massive overkill), Jotai (atomic model adds complexity for simple prediction state), or raw `useState` + `localStorage` (Zustand's persist middleware is cleaner).

### UI Utilities

| Library | Version | Purpose | Why | Confidence |
|---------|---------|---------|-----|------------|
| clsx | 2.x | Conditional class names | Industry standard for conditional Tailwind classes. ~0.2KB. | HIGH |
| tailwind-merge | 2.x | Resolve Tailwind class conflicts | Prevents `bg-red-500 bg-blue-500` conflicts in component composition. Combined with clsx in a `cn()` utility. | HIGH |
| date-fns | 4.x | Date formatting & countdown | Tree-shakeable, works with native Date objects. Import only `format`, `formatDistanceToNow`, `differenceInDays` for countdown timer and race date formatting. Faster than dayjs, smaller effective bundle with tree-shaking. | MEDIUM |
| framer-motion | 12.x | Animations | Page transitions, card hover effects, score reveals. 17.8M weekly downloads. The "trading card" driver grid and prediction reveals benefit from spring animations. | MEDIUM |

### Developer Tools

| Tool | Version | Purpose | Why | Confidence |
|------|---------|---------|-----|------------|
| ESLint | 9.x | Linting | Ships with `create-next-app`. | HIGH |
| Prettier | 3.x | Code formatting | Consistent formatting across the project. | HIGH |
| prettier-plugin-tailwindcss | 0.6.x | Tailwind class sorting | Auto-sorts Tailwind classes in consistent order. Reduces noise in diffs. | HIGH |

### Infrastructure

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Vercel | n/a | Hosting & deployment | Already decided. Free tier handles this app easily. Auto-deploy from GitHub, built-in ISR support, edge network. | HIGH |
| GitHub | n/a | Source control & CI/CD | Already decided. Push-to-deploy with Vercel. | HIGH |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Data fetching | SWR | TanStack Query | TanStack Query is more powerful but this app only does GET requests. SWR's simpler API and smaller bundle are better fits. No mutations, no optimistic updates, no DevTools needed. |
| Data fetching | SWR | axios | SWR handles caching, revalidation, and deduplication. axios is just an HTTP client with no cache layer. Native fetch + SWR covers everything. |
| Charting | Recharts | Nivo | Nivo has more chart types but is heavier. Recharts covers line/bar/area which is all this project needs. Larger community, more examples. |
| Charting | Recharts | Chart.js (react-chartjs-2) | Chart.js uses Canvas, not SVG. SVG charts are easier to style with the F1 dark theme and integrate with React's component model. |
| State | Zustand | Jotai | Jotai's atomic model is better for complex interdependent state. Predictions are a simple flat store -- Zustand's centralized approach is cleaner. |
| State | Zustand | Redux Toolkit | Massive overkill. This is a single-user app with one store. Redux adds boilerplate and bundle size for zero benefit. |
| Dates | date-fns | dayjs | dayjs is 2KB upfront but date-fns tree-shakes better. We only need 3-4 functions, so effective bundle is smaller with date-fns. |
| Dates | date-fns | Temporal API | Not yet widely supported in all browsers. date-fns is the safe choice. |
| Animation | framer-motion | CSS animations | CSS can handle simple transitions but framer-motion's spring physics and layout animations make the trading card grid and prediction reveals feel polished. Worth the bundle cost for this visual-first app. |
| SVG | Inline components | SVGR | SVGR requires webpack config in next.config.js. Hand-crafted circuit components give more control and avoid build tool complexity. |
| F1 Data | Jolpica F1 | Ergast | Ergast is shut down as of early 2025. Jolpica is its direct replacement. |

## API Integration Details

### Jolpica F1 API (replaces Ergast)

```
Base: https://api.jolpi.ca/ergast/f1/

Key endpoints:
GET /2026/races.json              -- Season calendar
GET /2026/{round}/results.json    -- Race results
GET /2026/{round}/qualifying.json -- Qualifying results
GET /2026/driverStandings.json    -- Driver championship
GET /2026/constructorStandings.json -- Constructor championship
GET /2026/drivers.json            -- Driver list
GET /2026/{round}/pitstops.json   -- Pit stop data

Rate limits: 4 req/sec, 500 req/hr
Response format: JSON (same schema as Ergast)
```

### OpenF1 API

```
Base: https://api.openf1.org/v1/

Key endpoints:
GET /drivers?session_key=latest        -- Driver info with headshot URLs
GET /sessions?year=2026                -- Session schedule
GET /session_result?session_key={key}  -- Final results
GET /starting_grid?session_key={key}   -- Grid positions
GET /weather?session_key={key}         -- Track conditions
GET /stints?session_key={key}          -- Tire strategy data

No rate limits documented. No auth required.
Response format: JSON
```

### Data Strategy

| Data Type | Source | Fetch Method | Cache Strategy |
|-----------|--------|-------------|----------------|
| Season calendar | Jolpica | Server Component, ISR (24hr) | Rarely changes, long cache |
| Race results | Jolpica | Server Component, ISR (1hr post-race) | Updates once after race |
| Standings | Jolpica | Server Component, ISR (1hr) | Updates after each race |
| Driver photos | OpenF1 `/drivers` | Server Component, ISR (7 days) | Rarely changes |
| Qualifying results | Jolpica | Server Component, ISR (1hr) | Updates once after quali |
| Weather | OpenF1 `/weather` | Client SWR (30s polling) | Changes during sessions |
| Predictions | Zustand + localStorage | Client-side only | Persisted locally |

## Installation

```bash
# Initialize project
npx create-next-app@14 f1-tracker --typescript --tailwind --app --src-dir --eslint

# Core dependencies
npm install swr recharts zustand date-fns clsx tailwind-merge framer-motion

# Dev dependencies
npm install -D prettier prettier-plugin-tailwindcss @types/node
```

## Project Structure (Recommended)

```
src/
  app/
    layout.tsx              -- Root layout with dark theme
    page.tsx                -- Dashboard
    calendar/page.tsx       -- Race calendar
    race/[round]/page.tsx   -- Race detail
    drivers/page.tsx        -- Driver grid
    standings/page.tsx      -- Championships
    predictions/page.tsx    -- Prediction hub
  components/
    circuits/               -- SVG circuit components (one per track)
    ui/                     -- Reusable UI components
    charts/                 -- Recharts wrappers
  lib/
    api/
      jolpica.ts            -- Jolpica API client
      openf1.ts             -- OpenF1 API client
    stores/
      predictions.ts        -- Zustand prediction store
    utils.ts                -- cn() helper, date formatters
  types/
    f1.ts                   -- F1 data type definitions
```

## Sources

- [Jolpica F1 API - GitHub](https://github.com/jolpica/jolpica-f1) -- Ergast replacement, backwards compatible (HIGH confidence)
- [Jolpica Rate Limits](https://github.com/jolpica/jolpica-f1/blob/main/docs/rate_limits.md) -- 4 req/sec, 500 req/hr (HIGH confidence)
- [OpenF1 API Documentation](https://openf1.org/docs/) -- 18 endpoints, no auth (HIGH confidence)
- [Ergast Deprecation Discussion](https://github.com/theOehrly/Fast-F1/discussions/445) -- Confirmed shutdown early 2025 (HIGH confidence)
- [Next.js 14 Data Fetching Patterns](https://nextjs.org/docs/14/app/building-your-application/data-fetching/patterns) -- Server-first approach (HIGH confidence)
- [Recharts npm](https://www.npmjs.com/package/recharts) -- v3.8.0, 13.8M weekly downloads (HIGH confidence)
- [framer-motion npm](https://www.npmjs.com/package/framer-motion) -- v12.35.1, 17.8M weekly downloads (HIGH confidence)
- [LogRocket: Best React Chart Libraries 2025](https://blog.logrocket.com/best-react-chart-libraries-2025/) -- Recharts recommended for simplicity (MEDIUM confidence)
- [LogRocket: Import SVGs in Next.js 2025](https://blog.logrocket.com/import-svgs-next-js-apps/) -- Inline SVG approach (MEDIUM confidence)
- [State Management in 2025](https://dev.to/hijazi313/state-management-in-2025-when-to-use-context-redux-zustand-or-jotai-2d2k) -- Zustand for centralized stores (MEDIUM confidence)
- [SWR vs TanStack Query](https://dev.to/rigalpatel001/react-query-or-swr-which-is-best-in-2025-2oa3) -- SWR for simpler GET-only apps (MEDIUM confidence)
