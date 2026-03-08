# Feature Research

**Domain:** Formula 1 Season Tracker (personal use, single user)
**Researched:** 2026-03-07
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features that any F1 tracker must have or it feels broken. For a personal tracker built for a 13-year-old fan, "users expect" means "Brycen would be disappointed without."

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| 2026 Race Calendar | Core navigation. Every F1 app/site leads with the schedule. Without it there's no skeleton to hang anything on. | LOW | Static data with ~24 races. Visual timeline with clickable race cards. Can be seeded from Jolpica API or hardcoded JSON. |
| Next Race Countdown | Creates urgency and a reason to open the app between race weekends. Every F1 app has this on the home screen. | LOW | Simple date math. Prominent placement on dashboard. |
| Driver Standings | The fundamental metric F1 fans track all season. This is what Brycen will check after every race. | LOW | Fetch from Jolpica API (`/current/driverStandings.json`). Table with position, driver, team, points. |
| Constructor Standings | Companion to driver standings. F1 fans track both. | LOW | Same API pattern. Can share UI components with driver standings. |
| Race Results | After each race weekend, Brycen needs to see who won, the full finishing order, and qualifying results. | MEDIUM | Fetch from Jolpica API (`/{season}/{round}/results.json`). Need qualifying + race result views per race. |
| Driver Profiles | Knowing the drivers is core to fandom. Name, team, number, nationality, headshot. | LOW | ~20 drivers. Can seed from API + F1 media CDN for headshots. Trading card layout is already planned and is a strong choice. |
| Dark Theme / F1 Aesthetic | A 13-year-old F1 fan wants it to look like the real thing, not a homework project. The dark theme with red accents mirrors official F1 branding. | MEDIUM | Tailwind dark theme with CSS custom properties for team colors. This is a design requirement, not a feature per se, but it's table stakes for engagement. |
| Responsive Layout | Brycen will check this on his phone after races and on desktop at home. Must work on both. | MEDIUM | Desktop-first with mobile breakpoints. Tailwind handles this well. |

### Differentiators (Competitive Advantage)

For a personal project, "differentiator" means "what makes Brycen's tracker feel special compared to just checking F1.com." These are the features that make it *his* app.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Prediction Game (P1/P2/P3 Picks) | **The killer feature.** This transforms passive consumption into active engagement. Brycen picks his predicted podium before each race, then sees how he did. Creates season-long narrative arc. No commercial app gives this exact simple experience without social/monetization overhead. | MEDIUM | Pre-race lock (before qualifying or race start). Scoring: 25pts exact position, 10pts right driver wrong slot, 5pts driver in top 5 but not podium. Store in localStorage. |
| Prediction Score Tracking | Running total, accuracy percentage, streak tracking, and score-over-time graph. Turns individual predictions into a season story. | MEDIUM | Derives from prediction data in localStorage. Chart library needed (recharts or similar). Accuracy stats are simple math. |
| Circuit SVG Maps | Visual circuit layouts with DRS zones, sectors, and start/finish line. Most fan apps don't have custom circuit maps -- they link to F1.com. Having them inline feels premium. | HIGH | Need 24 SVG maps styled to match dark theme. Can source from open-source projects or create simplified versions. This is the highest-effort differentiator. |
| Circuit Info Cards | Track length, number of turns, lap record, location/country, timezone. Adds context before each race weekend. | LOW | Static data, can be hardcoded or sourced from Jolpica API circuit endpoints. |
| Team Color Accents | Each driver card, standing row, and result uses the actual team color. Red Bull blue, Ferrari red, McLaren papaya. Makes the app feel alive and authentic. | LOW | CSS custom properties per team. ~10 teams = ~10 color pairs (primary + accent). |
| Dashboard Hub | Single landing page with: next race countdown, current standings snapshot, recent race result, prediction score summary. Gives a reason to open the app any day. | MEDIUM | Composition of other components. Needs good information hierarchy. |

### Anti-Features (Deliberately NOT Building)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Real-time Live Timing | Exciting during races, every serious F1 tool has it | Requires WebSocket connections to OpenF1 live endpoints (paid tier at 9.90 EUR/month), complex state management, only useful during ~2 hours per race weekend. Massive complexity for minimal use. | Post-session results from Jolpica API. Brycen watches the race live on TV -- he doesn't need a second screen live timer. |
| Multi-user / Social Features | Prediction leaderboards with friends, shared leagues | Requires authentication, a backend/database, user management. Gridlock and F1 Predict already do this well. Adds massive scope for a personal project. | Solo prediction tracking. If Brycen wants to compare with friends, he can screenshot his scores. |
| Historical Season Data | Browse 2024, 2023, etc. results | Scope creep. Every additional season multiplies data, UI states, and edge cases. The app is "2026 tracker" not "F1 encyclopedia." | Focus exclusively on 2026. If Brycen wants history, F1.com and Wikipedia exist. |
| Fantasy Team Management | Budget caps, driver market values, team building like F1 Fantasy | Full fantasy games are complex products (GridRival, F1 Fantasy have teams of developers). Budget logic, market values, transfers -- way too much scope. | Simple P1/P2/P3 podium prediction is the right scope. It's fun without being overwhelming. |
| Push Notifications | Race start reminders, result alerts | Requires service workers, notification permissions, a notification service. Web push is unreliable and annoying. | Calendar page shows upcoming races clearly. Brycen knows when F1 is on. |
| Telemetry / Data Visualization | Speed traces, throttle maps, tire degradation curves | Fascinating for engineers but overwhelming for a 13-year-old fan. Also requires OpenF1 telemetry endpoints and complex charting. | Keep stats simple: positions, points, podiums. |
| User Accounts / Login | "Save my data across devices" | No backend means no sync. Adding auth + database breaks the $0 budget and simple deployment. | localStorage is fine for a single user on their primary device. |
| AI Predictions | Machine learning race outcome predictions | Gimmick. Unreliable. Adds complexity (API calls to ML services). Gridlock's "Gridbrain" exists for fans who want this. | Brycen's own predictions are the point -- his judgment, his score. |

## Feature Dependencies

```
[Race Calendar]
    └──requires──> [Race Detail Pages]
                       └──requires──> [Race Results Display]
                       └──requires──> [Circuit Info / SVG Maps]

[Driver Standings]
    └──requires──> [Driver Profiles] (links from standings to profiles)

[Prediction Game]
    └──requires──> [Race Calendar] (need to know which race is next)
    └──requires──> [Race Results] (need results to score predictions)
    └──enhances──> [Dashboard] (score summary on dashboard)

[Prediction Score Tracking]
    └──requires──> [Prediction Game] (no scores without predictions)

[Dashboard]
    └──enhanced-by──> [Race Calendar] (next race countdown)
    └──enhanced-by──> [Driver Standings] (standings snapshot)
    └──enhanced-by──> [Race Results] (recent result)
    └──enhanced-by──> [Prediction Score Tracking] (score summary)

[API Data Layer]
    └──required-by──> [Driver Standings]
    └──required-by──> [Constructor Standings]
    └──required-by──> [Race Results]
    └──required-by──> [Driver Profiles]
```

### Dependency Notes

- **Race Calendar is the skeleton:** Nearly everything links from or to the calendar. Build it first.
- **API data layer must exist before any dynamic content:** Standings, results, and driver data all come from Jolpica/OpenF1. The data fetching and caching layer is a foundational dependency.
- **Prediction Game requires both Calendar and Results:** Can't predict without knowing the next race, can't score without results. But the prediction UI can be built before scoring works (just can't verify yet).
- **Dashboard is a composition:** It assembles widgets from other features. Build it last or iteratively as components become available.
- **Circuit SVG Maps are independent:** They don't depend on the API layer. Can be built in parallel or deferred without blocking anything.

## MVP Definition

### Launch With (v1)

Minimum viable product -- what makes this usable for the first race weekend.

- [ ] **Race Calendar** -- The app's skeleton. List of 2026 races with dates, clickable to detail pages.
- [ ] **Race Detail Pages** -- Each race gets a page with circuit info (static data) and results (when available).
- [ ] **Driver Standings** -- Fetched from Jolpica API, displayed in a styled table with team colors.
- [ ] **Constructor Standings** -- Same pattern as driver standings.
- [ ] **Driver Profiles** -- Grid of driver cards with headshots, team, number, nationality.
- [ ] **Dashboard** -- Next race countdown + standings snapshot + recent result summary.
- [ ] **Dark Theme** -- F1 aesthetic with team color accents throughout.
- [ ] **API Data Layer** -- Jolpica API integration for standings and results, with caching.

### Add After Core Works (v1.x)

Features to add once the foundation is solid, ideally before a few races into the season.

- [ ] **Prediction Game** -- P1/P2/P3 picks with localStorage persistence. Add when race calendar and results are working so predictions can be scored.
- [ ] **Prediction Score Tracking** -- Running score, accuracy stats, streak tracking. Add after prediction game proves fun.
- [ ] **Circuit SVG Maps** -- Inline track layouts on race detail pages. Can be added incrementally (a few tracks at a time).
- [ ] **Race Results (Qualifying)** -- Qualifying grid alongside race results. Secondary to race finish order.

### Future Consideration (v2+)

Features to consider only if Brycen is actively using the app and wants more.

- [ ] **Head-to-Head Driver Comparisons** -- Pick two drivers, see stats side by side. Fun but not essential.
- [ ] **Season Awards / Achievements** -- "Best prediction streak," "Most accurate for wet races," etc. Gamification layer on top of predictions.
- [ ] **Fastest Lap Tracking** -- Who got fastest lap each race, bonus points in predictions for calling it.
- [ ] **Sprint Race Support** -- Sprint weekends have different schedules and results. Adds complexity to calendar and results.

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Race Calendar | HIGH | LOW | P1 |
| Dashboard (Next Race Countdown) | HIGH | LOW | P1 |
| Driver Standings | HIGH | LOW | P1 |
| Constructor Standings | HIGH | LOW | P1 |
| Race Results | HIGH | MEDIUM | P1 |
| Driver Profiles (Card Grid) | HIGH | LOW | P1 |
| Dark Theme / F1 Aesthetic | HIGH | MEDIUM | P1 |
| API Data Layer (Jolpica) | HIGH | MEDIUM | P1 |
| Prediction Game (P1/P2/P3) | HIGH | MEDIUM | P1 |
| Prediction Score Tracking | MEDIUM | MEDIUM | P2 |
| Circuit SVG Maps | MEDIUM | HIGH | P2 |
| Circuit Info Cards | MEDIUM | LOW | P2 |
| Team Color Accents | MEDIUM | LOW | P1 |
| Qualifying Results | LOW | LOW | P2 |
| Sprint Race Support | LOW | MEDIUM | P3 |
| Head-to-Head Comparisons | LOW | MEDIUM | P3 |
| Season Achievements | LOW | MEDIUM | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add in early season
- P3: Nice to have, build if Brycen asks for it

## Competitor Feature Analysis

| Feature | F1.com / Official App | Gridlock | F1 Predict | Brycen's Tracker (Our Approach) |
|---------|----------------------|----------|------------|-------------------------------|
| Race Calendar | Full calendar with session times, timezone support | Race-focused, prediction deadlines | Race list for predictions | Visual timeline with clickable cards, simpler but cleaner |
| Standings | Full standings, sortable, with gap calculations | Not primary focus | Not primary focus | Clean styled tables with team colors, auto-updating |
| Race Results | Complete with gaps, pit stops, tire strategy | Shows results for scoring | Shows results for scoring | Qualifying + race finish order, styled with team colors |
| Driver Profiles | Extensive bios, career stats, social links | Minimal | Minimal | Trading card style grid with headshots, focused on 2026 |
| Circuit Maps | Interactive 3D track maps | None | None | Static SVG maps, dark-themed, DRS zones marked |
| Predictions | F1 Predict (separate product) | Top 10 predictions, leagues, Quali Boost | Top 3 + constructor picks | Simple P1/P2/P3, solo scoring, no social overhead |
| Scoring System | Complex multi-element fantasy scoring | Points per position accuracy + bonuses | Variable point values by likelihood | Simple 25/10/5 mirroring F1 points feel |
| Social / Leagues | Global leaderboards | Private leagues, friend competition | Global rankings | None (intentionally). Solo experience. |
| Design | Official branding, polished but busy | Clean mobile-first | Functional, official-adjacent | F1 broadcast aesthetic, dark theme, premium feel |

## Important API Note

**Ergast API is deprecated (shut down early 2025).** The PROJECT.md references Ergast, but it no longer exists. Use **Jolpica F1 API** (`https://api.jolpi.ca/ergast/f1/`) instead -- it's a drop-in replacement with backwards-compatible endpoints. Same URL patterns, just different base URL. Rate limit: 200 requests/hour (sufficient for a single-user app).

**OpenF1** (`https://openf1.org/`) is useful for supplementary data (car telemetry, lap times, weather) but its live data requires a paid tier (9.90 EUR/month). Historical data from 2023+ is free. For Brycen's app, Jolpica handles the core needs (standings, results, schedule, driver/constructor info). OpenF1 is optional and only needed if adding telemetry features later.

## Sources

- [OpenF1 API](https://openf1.org/) -- API documentation and endpoint reference (HIGH confidence)
- [Jolpica F1 API (Ergast successor)](https://github.com/jolpica/jolpica-f1) -- Drop-in Ergast replacement (HIGH confidence)
- [F1 Predict](https://f1predict.formula1.com/) -- Official F1 prediction game (HIGH confidence)
- [Gridlock App](https://apps.apple.com/us/app/gridlock-race-predictions-app/id6736937071) -- Competitor prediction app with leagues and AI features (MEDIUM confidence)
- [F1 Predictions 2026](https://play.google.com/store/apps/details?id=com.dpfernandez10.formula_friends&hl=en_US) -- Android prediction app (MEDIUM confidence)
- [Superbru F1 Predictor](https://www.superbru.com/news/new-and-improved-f1-predictor-now-live-for-the-2026-season) -- Prediction platform with sprint picks (MEDIUM confidence)
- [Ultimate F1 Dashboard](https://formula1dashboard.com/dashboard/) -- Open source F1 dashboard (MEDIUM confidence)
- [F1 Dashboards](https://f1dashboards.com/) -- Community dashboard projects (LOW confidence)
- [Apple Sports F1 integration](https://www.apple.com/newsroom/2026/03/formula-1-begins-this-weekend-exclusively-on-apple-tv-in-the-us/) -- Apple TV/Sports F1 features (HIGH confidence)

---
*Feature research for: Brycen's F1 2026 Tracker*
*Researched: 2026-03-07*
