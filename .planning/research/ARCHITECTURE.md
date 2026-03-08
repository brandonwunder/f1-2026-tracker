# Architecture Research

**Domain:** F1 Season Tracker Web App
**Researched:** 2026-03-07
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
+---------------------------------------------------------------+
|                     PRESENTATION LAYER                         |
|  +----------+  +---------+  +----------+  +----------------+  |
|  | Dashboard |  | Calendar|  | Race     |  | Predictions    |  |
|  | Page      |  | Page    |  | Detail   |  | Hub            |  |
|  +-----+-----+  +----+----+  +----+-----+  +-------+--------+  |
|        |             |            |                 |           |
+--------+-------------+------------+-----------------+-----------+
|                     COMPONENT LAYER                             |
|  +-------------+  +-----------+  +----------+  +------------+  |
|  | StandingsUI |  | DriverCard|  | CircuitMap|  | Countdown  |  |
|  | RaceResult  |  | PredictUI |  | ScoreGraph|  | StreakBadge |  |
|  +------+------+  +-----+-----+  +-----+----+  +-----+------+  |
|         |               |              |              |         |
+---------+---------------+--------------+--------------+---------+
|                     SERVICE LAYER                               |
|  +------------------+  +------------------+  +--------------+  |
|  | F1 API Service   |  | Prediction       |  | Image        |  |
|  | (Jolpica+OpenF1) |  | Service (local)  |  | Service      |  |
|  +--------+---------+  +--------+---------+  +------+-------+  |
|           |                     |                    |          |
+-----------+---------------------+--------------------+----------+
|                     DATA LAYER                                  |
|  +------------------+  +------------------+  +--------------+  |
|  | Jolpica API      |  | localStorage     |  | F1 Media CDN |  |
|  | (results/stands) |  | (predictions)    |  | (images)     |  |
|  +------------------+  +------------------+  +--------------+  |
|  +------------------+                                           |
|  | OpenF1 API       |                                           |
|  | (session detail) |                                           |
|  +------------------+                                           |
+---------------------------------------------------------------+
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Pages (Server) | Route handling, data fetching, SEO metadata | Next.js App Router `page.tsx` files as async Server Components |
| Layouts | Persistent UI shell, navigation, theme | `layout.tsx` with shared nav, dark theme wrapper |
| F1 API Service | Fetch and normalize data from Jolpica and OpenF1 | `lib/api/` module with typed fetch wrappers |
| Prediction Service | CRUD for predictions in localStorage | `lib/predictions.ts` client-side module |
| UI Components | Reusable visual building blocks | `components/` folder, mix of Server and Client Components |
| Image Service | Resolve driver headshots, team logos, flags | Utility mapping driver/team IDs to CDN URLs |

## Recommended Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout: dark theme, nav, fonts
│   ├── page.tsx                # Dashboard (home)
│   ├── calendar/
│   │   └── page.tsx            # Race calendar timeline
│   ├── race/
│   │   └── [round]/
│   │       └── page.tsx        # Race detail (circuit, results, predict)
│   ├── drivers/
│   │   └── page.tsx            # Driver card grid
│   ├── standings/
│   │   ├── drivers/
│   │   │   └── page.tsx        # Driver championship standings
│   │   └── constructors/
│   │       └── page.tsx        # Constructor standings
│   ├── predictions/
│   │   └── page.tsx            # Prediction hub (scores, stats)
│   └── globals.css             # Tailwind base + F1 theme variables
├── components/                 # Reusable UI components
│   ├── ui/                     # Generic primitives (Card, Badge, etc.)
│   ├── race/                   # RaceCard, RaceResult, CircuitMap
│   ├── driver/                 # DriverCard, DriverProfile
│   ├── standings/              # StandingsTable, ConstructorRow
│   ├── predictions/            # PredictionForm, ScoreGraph, StreakBadge
│   └── layout/                 # Nav, Countdown, Footer
├── lib/                        # Business logic and services
│   ├── api/                    # API service layer
│   │   ├── jolpica.ts          # Jolpica (Ergast-compatible) client
│   │   ├── openf1.ts           # OpenF1 client
│   │   └── types.ts            # Shared API response types
│   ├── predictions.ts          # localStorage prediction CRUD
│   ├── scoring.ts              # Prediction scoring logic (25/10/5)
│   ├── images.ts               # CDN URL resolvers for headshots/logos
│   └── constants.ts            # Season config, team colors, scoring rules
├── hooks/                      # Custom React hooks
│   ├── use-predictions.ts      # Hook wrapping prediction service
│   └── use-countdown.ts        # Race countdown timer hook
├── types/                      # TypeScript type definitions
│   ├── race.ts                 # Race, Circuit, Result types
│   ├── driver.ts               # Driver, Constructor types
│   └── prediction.ts           # Prediction, Score types
└── data/                       # Static data files
    ├── circuits/               # SVG circuit maps
    └── 2026-calendar.ts        # Hardcoded race calendar as fallback
```

### Structure Rationale

- **app/:** File-system routing with Next.js App Router. Each route segment gets its own `page.tsx`. Dynamic `[round]` segment for race detail pages. Keeps routing flat and predictable.
- **components/:** Domain-grouped rather than type-grouped. `race/`, `driver/`, `predictions/` mirrors the mental model of the app. `ui/` holds generic primitives shared across domains.
- **lib/:** All non-UI logic lives here. API clients, prediction storage, scoring math. This is the service layer that pages and components import. No React in this folder.
- **hooks/:** Client-side React hooks that bridge `lib/` services to components. Thin wrappers that handle state and effects.
- **data/:** Static assets and fallback data. Circuit SVGs and a hardcoded calendar prevent the app from being blank if APIs are slow or down.

## Architectural Patterns

### Pattern 1: Server Components for Data Fetching, Client Components for Interaction

**What:** Pages and data-display components are Server Components by default. Only components needing browser APIs (localStorage, click handlers, timers) use `"use client"`.
**When to use:** Always -- this is the foundational pattern for the entire app.
**Trade-offs:** Excellent performance and smaller client bundles, but requires thinking about the Server/Client boundary carefully.

**Example:**
```typescript
// app/standings/drivers/page.tsx (Server Component - no "use client")
import { getDriverStandings } from '@/lib/api/jolpica';
import { StandingsTable } from '@/components/standings/StandingsTable';

export default async function DriverStandingsPage() {
  const standings = await getDriverStandings(2026);
  return <StandingsTable standings={standings} />;
}

// components/predictions/PredictionForm.tsx (Client Component)
'use client';
import { usePredictions } from '@/hooks/use-predictions';

export function PredictionForm({ round, drivers }: Props) {
  const { savePrediction } = usePredictions();
  // ... interactive form with localStorage writes
}
```

### Pattern 2: API Service Layer with Response Normalization

**What:** A thin service layer in `lib/api/` that wraps both Jolpica and OpenF1 APIs, normalizes their different response shapes into unified TypeScript types, and handles errors.
**When to use:** Every API call goes through this layer -- components never call `fetch()` directly.
**Trade-offs:** Small upfront cost to define types, but prevents API shape changes from rippling through the UI.

**Example:**
```typescript
// lib/api/jolpica.ts
const BASE_URL = 'https://api.jolpi.ca/ergast/f1';

export async function getRaceResults(season: number, round: number): Promise<RaceResult[]> {
  const res = await fetch(
    `${BASE_URL}/${season}/${round}/results.json`,
    { next: { revalidate: 3600 } } // Cache for 1 hour
  );
  const data = await res.json();
  const results = data.MRData.RaceTable.Races[0]?.Results ?? [];
  return results.map(normalizeResult);
}

// lib/api/openf1.ts
const BASE_URL = 'https://api.openf1.org/v1';

export async function getQualifyingLaps(
  sessionKey: number, driverNumber: number
): Promise<LapData[]> {
  const res = await fetch(
    `${BASE_URL}/laps?session_key=${sessionKey}&driver_number=${driverNumber}`,
    { next: { revalidate: 3600 } }
  );
  return res.json();
}
```

### Pattern 3: Hybrid Rendering Strategy (Static Shell + Dynamic Data)

**What:** Use static generation for page shells and layouts (nav, structure, circuit maps) and fetch dynamic data (results, standings) with time-based revalidation. Predictions pages are fully client-rendered since they depend on localStorage.
**When to use:** For every page that mixes stable structure with changing data.
**Trade-offs:** Fast initial loads from static shells, with ISR keeping data fresh without rebuilds.

**Rendering strategy per route:**

| Route | Rendering | Revalidation | Rationale |
|-------|-----------|-------------|-----------|
| `/` (Dashboard) | Dynamic SSR | `revalidate: 3600` (1hr) | Countdown needs current time, standings change weekly |
| `/calendar` | Static + ISR | `revalidate: 86400` (daily) | Calendar rarely changes |
| `/race/[round]` | Dynamic SSR | `revalidate: 3600` (1hr) | Results update after race weekends |
| `/drivers` | Static + ISR | `revalidate: 86400` (daily) | Driver roster stable through season |
| `/standings/*` | Dynamic SSR | `revalidate: 3600` (1hr) | Changes after each race |
| `/predictions` | Client-only | N/A | Reads from localStorage, no server data |

### Pattern 4: Prediction State in localStorage with a Hook Abstraction

**What:** A custom hook (`usePredictions`) wraps all localStorage access for predictions. The hook provides a clean API (`getPrediction`, `savePrediction`, `getScore`, `getStats`) and handles serialization, validation, and the scoring algorithm.
**When to use:** Any component that reads or writes prediction data.
**Trade-offs:** localStorage has a ~5MB limit (more than enough for 24 race predictions) and is synchronous, but it means zero backend cost and zero authentication complexity.

**Example:**
```typescript
// lib/predictions.ts
interface Prediction {
  round: number;
  p1: string;  // driverId
  p2: string;
  p3: string;
  timestamp: number;
  locked: boolean;  // true after race starts
}

const STORAGE_KEY = 'f1-predictions-2026';

export function savePrediction(pred: Prediction): void {
  const all = getAllPredictions();
  all[pred.round] = { ...pred, timestamp: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function scorePrediction(pred: Prediction, actualPodium: string[]): number {
  let score = 0;
  const picks = [pred.p1, pred.p2, pred.p3];
  picks.forEach((pick, i) => {
    if (pick === actualPodium[i]) score += 25;       // Exact position
    else if (actualPodium.includes(pick)) score += 10; // Right driver, wrong spot
    else if (actualTop5.includes(pick)) score += 5;    // In top 5 but not podium
  });
  return score;
}
```

## Data Flow

### Request Flow (Server-Rendered Pages)

```
[Browser Request]
    |
    v
[Next.js App Router] --> [page.tsx (Server Component)]
    |
    v
[lib/api/jolpica.ts or openf1.ts] --> [External API]
    |                                       |
    v                                       v
[Normalize Response]               [JSON Response]
    |
    v
[Render Server Component HTML] --> [Stream to Browser]
    |
    v
[Hydrate Client Components (predictions, countdown)]
```

### Prediction Flow (Client-Side)

```
[User selects P1/P2/P3 drivers]
    |
    v
[PredictionForm Component] --> [usePredictions hook]
    |                               |
    v                               v
[Validate picks]            [lib/predictions.ts]
    |                               |
    v                               v
[Show confirmation]         [localStorage.setItem()]

--- After race results are available ---

[Race results from Jolpica API (server-fetched)]
    |
    v
[Passed as props to ScoreCard (client component)]
    |
    v
[scorePrediction() compares picks vs actual]
    |
    v
[Display score, update stats, streak tracking]
```

### Key Data Flows

1. **Race Data Flow:** Jolpica API -> Server Component fetch (cached 1hr via ISR) -> normalize to TypeScript types -> render in Server Components -> stream HTML to browser. No client-side fetching needed for read-only data.

2. **Prediction Flow:** User interaction in Client Component -> localStorage write via hook -> on race completion, server-fetched results passed as props to client scoring component -> score calculated client-side -> stats updated in localStorage.

3. **Image Flow:** Driver/team ID -> utility function maps to F1 Media CDN URL -> Next.js `<Image>` component handles optimization and caching. No API calls needed, just deterministic URL construction.

4. **Countdown Flow:** Next race date from calendar data (static or API) -> passed to client `Countdown` component -> `useEffect` with `setInterval` for live countdown display.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 1 user (Brycen) | Current architecture is perfect. localStorage, free API tiers, Vercel free plan. No changes needed. |
| 10-100 users | Move predictions to a database (Supabase/PlanetScale) if multi-user is desired. Add auth. Same rendering approach works. |
| 1000+ users | Add server-side caching layer (Redis via Upstash) to avoid hammering F1 APIs. Consider API route for aggregating predictions. Rate limits become a real concern. |

### Scaling Priorities

1. **First bottleneck:** Jolpica API rate limit (200 requests/hour). Mitigate with aggressive ISR caching on Vercel -- once cached, subsequent users hit the CDN, not the API.
2. **Second bottleneck:** OpenF1 API response times can be slow for telemetry data. Mitigate by only fetching summary data (session results, laps) not raw telemetry.

## Anti-Patterns

### Anti-Pattern 1: Fetching F1 Data in Client Components

**What people do:** Use `useEffect` + `fetch` in client components to call the F1 APIs directly from the browser.
**Why it's wrong:** Exposes API URLs to the client, loses ISR caching benefits, causes loading spinners instead of instant server-rendered content, and every user makes separate API calls (multiplying rate limit pressure).
**Do this instead:** Fetch in Server Components or Route Handlers. Pass data as props to Client Components that need interactivity.

### Anti-Pattern 2: One Giant API Service File

**What people do:** Put all Jolpica and OpenF1 calls in a single `api.ts` file that grows to 500+ lines.
**Why it's wrong:** Hard to maintain, impossible to tree-shake, and mixes two different API response shapes.
**Do this instead:** Separate files per API source (`jolpica.ts`, `openf1.ts`) with a shared types file. Each file stays focused and testable.

### Anti-Pattern 3: Storing Raw API Responses in localStorage

**What people do:** Cache full API responses in localStorage to avoid re-fetching.
**Why it's wrong:** localStorage has a 5MB limit, raw F1 API responses are verbose (nested JSON with redundant fields), and Next.js ISR already handles caching server-side.
**Do this instead:** Only store user-generated data (predictions) in localStorage. Let ISR handle API response caching.

### Anti-Pattern 4: Making Prediction Components Server Components

**What people do:** Try to render prediction forms as Server Components to "keep everything server-side."
**Why it's wrong:** Predictions require localStorage (browser API), click handlers, and form state -- all of which require Client Components.
**Do this instead:** Accept the `"use client"` boundary. Fetch race/driver data in the parent Server Component page, then pass it as props to the Client Component prediction form.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Jolpica API (`api.jolpi.ca/ergast/f1/`) | Server-side fetch with ISR caching | Drop-in Ergast replacement. 200 req/hr rate limit. Data updates Monday after race weekends. JSON format, `MRData` wrapper. |
| OpenF1 API (`api.openf1.org/v1/`) | Server-side fetch with ISR caching | Free for historical data. 18 endpoints. Use for session results, laps, pit stops. Avoid raw telemetry (too large). 2023+ data available. |
| F1 Media CDN | Direct URL construction in `<Image>` tags | No API needed. URLs are predictable based on driver/team identifiers. Use Next.js Image optimization. |
| Vercel | Deployment platform | Auto-deploy from GitHub. Free tier includes ISR, Edge Network CDN, analytics. Perfect match for Next.js. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Pages <-> API Service | Direct import, async function calls | Server Components call `lib/api/*` functions directly. No REST layer needed internally. |
| Pages <-> Client Components | Props | Server Components pass fetched data as serializable props to Client Components. |
| Client Components <-> Prediction Service | Hook (`usePredictions`) | All localStorage access goes through the hook. Components never call `localStorage` directly. |
| Prediction Service <-> Scoring Engine | Direct function call | `scorePrediction()` is a pure function: takes prediction + actual results, returns score. No side effects. |

## Build Order (Dependencies)

The architecture implies this build sequence:

1. **Foundation:** Project scaffold, theme, layout, navigation. Everything else depends on having the shell.
2. **API Service Layer:** `lib/api/jolpica.ts` and types. Must exist before any data-driven page.
3. **Data Pages (read-only):** Calendar, drivers, standings, race detail. These only need the API service layer and UI components.
4. **Prediction System:** Requires race detail pages to exist (predictions attach to specific rounds). Needs localStorage service, scoring engine, and Client Components.
5. **Dashboard:** Aggregates data from all other features (next race countdown, standings preview, prediction score). Build last since it depends on everything else.
6. **Polish:** Circuit SVG maps, animations, responsive tweaks, edge cases.

## Sources

- [Jolpica F1 API (Ergast replacement)](https://github.com/jolpica/jolpica-f1) -- HIGH confidence, verified with live API call
- [OpenF1 API Documentation](https://openf1.org/docs/) -- HIGH confidence, official docs
- [Next.js App Router Documentation](https://nextjs.org/docs/app) -- HIGH confidence, official docs
- [Next.js Caching and Revalidation Guide](https://nextjs.org/docs/app/getting-started/caching-and-revalidating) -- HIGH confidence, official docs
- [Next.js Project Structure](https://nextjs.org/docs/app/getting-started/project-structure) -- HIGH confidence, official docs
- [Ergast API Deprecation Discussion](https://github.com/theOehrly/Fast-F1/discussions/445) -- MEDIUM confidence, community source

---
*Architecture research for: F1 Season Tracker Web App*
*Researched: 2026-03-07*
