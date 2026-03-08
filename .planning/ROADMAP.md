# Roadmap: Brycen's F1 2026 Tracker

## Overview

This roadmap takes the project from zero to a fully deployed F1 season tracker in 9 phases. The build order follows data dependencies: foundation and API layer first, then the calendar backbone, then data display pages (race detail, drivers, standings), then the prediction system (core mechanics followed by analytics hub), and finally the dashboard that composes everything together. Each phase delivers a complete, verifiable capability.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Project Foundation** - Next.js scaffold, dark theme, navigation shell, deployment pipeline
- [ ] **Phase 2: Data Layer** - Jolpica/OpenF1 API clients with ISR caching, rate limiting, and error handling
- [ ] **Phase 3: Race Calendar** - Full 2026 season calendar with race cards, visual timeline, and countdown timer
- [ ] **Phase 4: Race Detail and Circuit Maps** - Individual race pages with results, qualifying, circuit SVGs, and track info
- [ ] **Phase 5: Drivers** - Trading card driver grid with headshots, team colors, stats, and sorting
- [ ] **Phase 6: Standings** - Driver and constructor championship standings with auto-updating data
- [ ] **Phase 7: Prediction Core** - P1/P2/P3 prediction picks, lock mechanism, scoring engine, localStorage persistence
- [ ] **Phase 8: Predictions Hub** - Season prediction overview, accuracy stats, streak tracking, score graph
- [ ] **Phase 9: Dashboard** - Compositional hub page with countdown, standings preview, recent results, and prediction score

## Phase Details

### Phase 1: Project Foundation
**Goal**: The app skeleton exists -- a deployed Next.js project with F1 dark theme, team color system, responsive layout, and navigation to all sections
**Depends on**: Nothing (first phase)
**Requirements**: INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-05, INFRA-06, INFRA-07
**Success Criteria** (what must be TRUE):
  1. User can visit a live Vercel URL and see the app with F1 dark theme (#15151E background, #E10600 red accents)
  2. User can navigate between all sections (Dashboard, Races, Drivers, Standings, Predictions) via persistent navigation
  3. App renders properly on desktop and is functional on mobile/tablet screens
  4. Pushing code to GitHub main branch triggers automatic deployment to Vercel
  5. Team color constants for all 10 F1 teams are available and render correctly in test components
**Plans**: TBD

Plans:
- [ ] 01-01: TBD
- [ ] 01-02: TBD

### Phase 2: Data Layer
**Goal**: The app can fetch, cache, and serve all F1 data from Jolpica and OpenF1 APIs with proper rate limiting and error handling
**Depends on**: Phase 1
**Requirements**: DATA-01, DATA-02, DATA-03, DATA-04, DATA-05, DATA-06, DATA-07
**Success Criteria** (what must be TRUE):
  1. App fetches race results, qualifying results, standings, driver info, constructor info, and season calendar from Jolpica API with correct TypeScript types
  2. ISR caching is configured per endpoint (1hr for results/standings, 24hr for calendar/drivers) and serves cached data on subsequent requests
  3. Rate limiter prevents exceeding 4 req/sec and 500 req/hr to Jolpica API
  4. When API calls fail, user sees graceful loading states and error messages instead of blank pages or crashes
  5. If Jolpica 2026 calendar data is unavailable, app falls back to hardcoded 2026 calendar JSON
**Plans**: TBD

Plans:
- [ ] 02-01: TBD
- [ ] 02-02: TBD

### Phase 3: Race Calendar
**Goal**: User can browse the full 2026 F1 season schedule, identify past/upcoming/next races at a glance, and see a live countdown to the next race
**Depends on**: Phase 2
**Requirements**: CAL-01, CAL-02, CAL-03, CAL-04, CAL-05
**Success Criteria** (what must be TRUE):
  1. User can view all ~24 races of the 2026 season in a visual timeline/grid layout
  2. Each race card displays track name, country flag, date, and circuit thumbnail
  3. User can visually distinguish past races (with results available), upcoming races, and the next race on the calendar
  4. User can click any race card to navigate to its dedicated Race Detail page
  5. Next race countdown timer is displayed prominently and counts down in real time
**Plans**: TBD

Plans:
- [ ] 03-01: TBD

### Phase 4: Race Detail and Circuit Maps
**Goal**: Each race has a rich detail page showing session results, circuit information, and a styled SVG track map
**Depends on**: Phase 3
**Requirements**: RACE-01, RACE-02, RACE-03, RACE-04, RACE-05, CIR-01, CIR-02, CIR-03, CIR-04, CIR-05
**Success Criteria** (what must be TRUE):
  1. User can view a dedicated detail page for any race showing qualifying results (full grid with positions, times, gaps) and race results (finishing order, gaps, fastest lap, DNFs)
  2. Each race detail page shows a circuit info card with track length, turns, lap record, location, circuit type, and key overtaking spots
  3. Each race detail page displays a dark-themed SVG circuit map with DRS zones highlighted and sector boundaries marked
  4. Race detail page includes a prediction panel placeholder (ready for Phase 7 integration)
  5. Circuit maps render cleanly on both desktop and mobile without layout issues
**Plans**: TBD

Plans:
- [ ] 04-01: TBD
- [ ] 04-02: TBD

### Phase 5: Drivers
**Goal**: User can browse all 20 F1 drivers in a visually striking trading card layout with team colors, headshots, and expandable stats
**Depends on**: Phase 2
**Requirements**: DRV-01, DRV-02, DRV-03, DRV-04, DRV-05, DRV-06, DRV-07
**Success Criteria** (what must be TRUE):
  1. User can view all 20 drivers displayed as trading cards in a grid layout
  2. Each driver card shows headshot (from F1 media CDN), name, car number, country flag, team color accent border, and championship position
  3. User can click a driver card to expand and see full season stats (wins, podiums, poles, fastest laps, points) and career stats (total wins, podiums, championships, career points)
  4. User can sort driver cards by points, wins, team, or name
  5. Driver cards use actual 2026 team colors as accent borders and highlights
**Plans**: TBD

Plans:
- [ ] 05-01: TBD

### Phase 6: Standings
**Goal**: User can view current championship standings for both drivers and constructors, auto-updated after each race
**Depends on**: Phase 2
**Requirements**: STD-01, STD-02, STD-03, STD-04
**Success Criteria** (what must be TRUE):
  1. User can view full driver championship standings table with position, driver, team, points, wins, and podiums
  2. User can view full constructor championship standings table with position, team, points, and both drivers' point contributions
  3. Standings data auto-updates from Jolpica API (no manual refresh needed)
  4. Standings rows are styled with each team's color for visual distinction
**Plans**: TBD

Plans:
- [ ] 06-01: TBD

### Phase 7: Prediction Core
**Goal**: User can make P1/P2/P3 podium predictions before each race, have them scored automatically after results come in, and all data persists in the browser
**Depends on**: Phase 4
**Requirements**: PRED-01, PRED-02, PRED-03, PRED-04, RACE-06
**Success Criteria** (what must be TRUE):
  1. User can select P1, P2, and P3 podium predictions from a driver list before any upcoming race
  2. Predictions lock before qualifying begins and cannot be changed after that point
  3. After a race completes, predictions are automatically scored: 25pts for exact position match, 10pts for right driver wrong position, 5pts for driver finishing top 5
  4. All prediction data (picks and scores) persists in browser localStorage and survives page reloads
  5. Prediction panel is integrated into the Race Detail page (pick before race, view results after)
**Plans**: TBD

Plans:
- [ ] 07-01: TBD

### Phase 8: Predictions Hub
**Goal**: User can view a comprehensive predictions hub with season-long performance tracking, accuracy analytics, and a score-over-time visualization
**Depends on**: Phase 7
**Requirements**: PRED-05, PRED-06, PRED-07, PRED-08, PRED-09
**Success Criteria** (what must be TRUE):
  1. User can view a predictions hub page showing all predictions made across the season alongside actual race results
  2. Predictions hub displays running score total with a per-race points breakdown
  3. Predictions hub shows accuracy stats: percentage of correct picks, best prediction, and current streak
  4. Predictions hub includes a score-over-time graph tracking prediction performance across the season
  5. Dashboard prediction score summary reflects the current total from the predictions hub
**Plans**: TBD

Plans:
- [ ] 08-01: TBD

### Phase 9: Dashboard
**Goal**: User lands on a polished dashboard hub that surfaces the most important information from every section of the app
**Depends on**: Phase 3, Phase 6, Phase 8
**Requirements**: DASH-01, DASH-02, DASH-03, DASH-04, DASH-05, DASH-06
**Success Criteria** (what must be TRUE):
  1. Dashboard shows next race countdown with track name, date, and time
  2. Dashboard shows current top 5 driver standings and top 5 constructor standings
  3. Dashboard shows the most recent race podium result
  4. Dashboard shows Brycen's prediction score running total
  5. Dashboard provides quick navigation links to all app sections (Races, Drivers, Standings, Predictions)
**Plans**: TBD

Plans:
- [ ] 09-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9
Note: Phases 5 and 6 depend only on Phase 2 and can execute in parallel with Phases 3-4.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Project Foundation | 0/? | Not started | - |
| 2. Data Layer | 0/? | Not started | - |
| 3. Race Calendar | 0/? | Not started | - |
| 4. Race Detail and Circuit Maps | 0/? | Not started | - |
| 5. Drivers | 0/? | Not started | - |
| 6. Standings | 0/? | Not started | - |
| 7. Prediction Core | 0/? | Not started | - |
| 8. Predictions Hub | 0/? | Not started | - |
| 9. Dashboard | 0/? | Not started | - |
