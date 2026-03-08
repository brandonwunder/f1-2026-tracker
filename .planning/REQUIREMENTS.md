# Requirements: Brycen's F1 2026 Tracker

**Defined:** 2026-03-07
**Core Value:** Brycen can track every race weekend of the 2026 F1 season with live data, circuit maps, and a gamified prediction system — all in one sleek app.

## v1 Requirements

### Data Layer

- [ ] **DATA-01**: App fetches race results, qualifying results, and standings from Jolpica F1 API (Ergast replacement)
- [ ] **DATA-02**: App fetches driver info, constructor info, and season calendar from Jolpica F1 API
- [ ] **DATA-03**: Server-side data fetching with ISR caching (1hr for results/standings, 24hr for calendar/drivers)
- [ ] **DATA-04**: Rate limit protection — max 4 req/sec, 500 req/hr to Jolpica API
- [ ] **DATA-05**: OpenF1 API integration for supplementary data (lap times, pit stops, session info)
- [ ] **DATA-06**: Graceful error handling and loading states for all API calls
- [ ] **DATA-07**: Hardcoded 2026 calendar fallback in case API data is unavailable at season start

### Race Calendar

- [ ] **CAL-01**: User can view full 2026 race calendar as a visual timeline/grid with all ~24 races
- [ ] **CAL-02**: Each race card shows track name, country flag, date, and circuit thumbnail
- [ ] **CAL-03**: User can click any race card to navigate to its Race Detail page
- [ ] **CAL-04**: Calendar visually distinguishes past races (with results), upcoming races, and the next race
- [ ] **CAL-05**: Next race countdown timer displayed prominently on the dashboard

### Race Detail

- [ ] **RACE-01**: Each race has a dedicated detail page with circuit info and session results
- [ ] **RACE-02**: Race detail page shows qualifying results (full grid with positions, times, gaps)
- [ ] **RACE-03**: Race detail page shows race results (finishing order, gaps, fastest lap, DNFs)
- [ ] **RACE-04**: Race detail page shows circuit info card (track length, turns, lap record, location, circuit type, first GP year)
- [ ] **RACE-05**: Race detail page shows static SVG circuit map styled in dark theme with DRS zones and sectors
- [ ] **RACE-06**: Race detail page includes Brycen's prediction panel (pick or view predictions)

### Drivers

- [ ] **DRV-01**: User can view all 20 drivers in a trading card grid layout
- [ ] **DRV-02**: Each driver card shows headshot, name, car number, country flag, team color accent, and championship position
- [ ] **DRV-03**: User can click a driver card to expand and see full season stats (wins, podiums, poles, fastest laps, points)
- [ ] **DRV-04**: User can click a driver card to see career stats (total wins, podiums, championships, career points)
- [ ] **DRV-05**: User can sort driver cards by points, wins, team, or name
- [ ] **DRV-06**: Driver headshots auto-pull from F1 media CDN
- [ ] **DRV-07**: Driver cards use actual team colors as accent borders/highlights

### Standings

- [ ] **STD-01**: User can view full driver championship standings table with position, driver, team, points, wins, podiums
- [ ] **STD-02**: User can view full constructor championship standings table with position, team, points, both drivers' contributions
- [ ] **STD-03**: Standings auto-update from Jolpica API after each race
- [ ] **STD-04**: Standings tables styled with team colors per row

### Predictions

- [ ] **PRED-01**: User can pick P1/P2/P3 podium predictions before each race
- [ ] **PRED-02**: Predictions lock before qualifying begins (cannot be changed after)
- [ ] **PRED-03**: After race completes, predictions are scored: 25pts exact position, 10pts right driver wrong position, 5pts driver finishes top 5
- [ ] **PRED-04**: All prediction data stored in browser localStorage
- [ ] **PRED-05**: User can view predictions hub with season overview of all predictions vs actual results
- [ ] **PRED-06**: Predictions hub shows running score total with points breakdown per race
- [ ] **PRED-07**: Predictions hub shows accuracy stats (% correct picks, best prediction, current streak)
- [ ] **PRED-08**: Predictions hub shows score-over-time graph tracking prediction performance across the season
- [ ] **PRED-09**: Dashboard shows Brycen's current prediction score summary

### Circuit Maps

- [ ] **CIR-01**: Static SVG circuit maps for all 2026 calendar tracks
- [ ] **CIR-02**: Circuit maps styled with dark theme (matching app aesthetic)
- [ ] **CIR-03**: Circuit maps show DRS zones highlighted
- [ ] **CIR-04**: Circuit maps show sector boundaries and start/finish line
- [ ] **CIR-05**: Circuit info cards show track length, number of turns, lap record holder + time, circuit type, key overtaking spots

### Dashboard

- [ ] **DASH-01**: Dashboard shows next race countdown with track name, date, and time
- [ ] **DASH-02**: Dashboard shows current driver standings (top 5 preview)
- [ ] **DASH-03**: Dashboard shows current constructor standings (top 5 preview)
- [ ] **DASH-04**: Dashboard shows most recent race podium result
- [ ] **DASH-05**: Dashboard shows Brycen's prediction score running total
- [ ] **DASH-06**: Dashboard provides quick navigation links to all sections

### Infrastructure

- [ ] **INFRA-01**: GitHub repository created and code pushed
- [ ] **INFRA-02**: Vercel project linked to GitHub repo with auto-deploy on push to main
- [ ] **INFRA-03**: Next.js 14 App Router with TypeScript and Tailwind CSS
- [ ] **INFRA-04**: F1 dark theme applied globally (#15151E background, #E10600 red accent, #1F1F2B card surfaces)
- [ ] **INFRA-05**: Team color system for all 10 teams used across driver cards, standings, and results
- [ ] **INFRA-06**: Responsive design — desktop-first, functional on mobile and tablet
- [ ] **INFRA-07**: App navigation with links to all pages (Dashboard, Races, Drivers, Standings, Predictions)

## Out of Scope

| Feature | Reason |
|---------|--------|
| User authentication / accounts | Single user (Brycen), no login needed |
| Backend / database | localStorage sufficient for predictions, no server state |
| Real-time live timing | Too complex, OpenF1 live data requires paid tier, Brycen watches races on TV |
| Historical seasons | 2026 only — keeps scope focused |
| Multi-user predictions / leaderboards | Solo experience, no social overhead |
| Mobile native app | Web-only, responsive design covers mobile use |
| Fantasy team management | Too complex (budget caps, transfers, market values) |
| Push notifications | Requires service workers, unreliable, unnecessary |
| Telemetry / speed traces | Overwhelming for target user, requires paid OpenF1 tier |
| AI predictions | Gimmick, the point is Brycen's own judgment |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DATA-01 | — | Pending |
| DATA-02 | — | Pending |
| DATA-03 | — | Pending |
| DATA-04 | — | Pending |
| DATA-05 | — | Pending |
| DATA-06 | — | Pending |
| DATA-07 | — | Pending |
| CAL-01 | — | Pending |
| CAL-02 | — | Pending |
| CAL-03 | — | Pending |
| CAL-04 | — | Pending |
| CAL-05 | — | Pending |
| RACE-01 | — | Pending |
| RACE-02 | — | Pending |
| RACE-03 | — | Pending |
| RACE-04 | — | Pending |
| RACE-05 | — | Pending |
| RACE-06 | — | Pending |
| DRV-01 | — | Pending |
| DRV-02 | — | Pending |
| DRV-03 | — | Pending |
| DRV-04 | — | Pending |
| DRV-05 | — | Pending |
| DRV-06 | — | Pending |
| DRV-07 | — | Pending |
| STD-01 | — | Pending |
| STD-02 | — | Pending |
| STD-03 | — | Pending |
| STD-04 | — | Pending |
| PRED-01 | — | Pending |
| PRED-02 | — | Pending |
| PRED-03 | — | Pending |
| PRED-04 | — | Pending |
| PRED-05 | — | Pending |
| PRED-06 | — | Pending |
| PRED-07 | — | Pending |
| PRED-08 | — | Pending |
| PRED-09 | — | Pending |
| CIR-01 | — | Pending |
| CIR-02 | — | Pending |
| CIR-03 | — | Pending |
| CIR-04 | — | Pending |
| CIR-05 | — | Pending |
| DASH-01 | — | Pending |
| DASH-02 | — | Pending |
| DASH-03 | — | Pending |
| DASH-04 | — | Pending |
| DASH-05 | — | Pending |
| DASH-06 | — | Pending |
| INFRA-01 | — | Pending |
| INFRA-02 | — | Pending |
| INFRA-03 | — | Pending |
| INFRA-04 | — | Pending |
| INFRA-05 | — | Pending |
| INFRA-06 | — | Pending |
| INFRA-07 | — | Pending |

**Coverage:**
- v1 requirements: 51 total
- Mapped to phases: 0
- Unmapped: 51 (roadmap pending)

---
*Requirements defined: 2026-03-07*
*Last updated: 2026-03-07 after initial definition*
