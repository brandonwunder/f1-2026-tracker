# Brycen's F1 2026 Tracker

## What This Is

A Formula 1 season tracker web app built for Brycen (age 13) to follow the entire 2026 F1 season. It pulls live driver stats, qualifying and race results, and provides circuit maps — all wrapped in a gamified prediction system where Brycen picks podium finishers and earns points for accuracy. The app looks and feels like official F1 broadcast graphics with a dark theme and red accents.

## Core Value

Brycen can track every race weekend of the 2026 F1 season — see results, study drivers, explore circuits, and test his predictions — all in one place that feels like a real F1 data platform.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Dashboard with next race countdown, standings preview, recent results, and prediction score
- [ ] Full 2026 race calendar with visual timeline and clickable race cards
- [ ] Race detail pages with circuit SVG maps, qualifying results, race results, and track info
- [ ] Prediction system: pre-race P1/P2/P3 picks with gamified scoring (25/10/5 points)
- [ ] Driver card grid with headshots, team colors, stats, and expandable profiles
- [ ] Driver standings and constructor standings pages with auto-updating data
- [ ] Predictions hub with running score, accuracy stats, streak tracking, and score graph
- [ ] Live data pulling from Ergast API (results, standings) and OpenF1 API (live session data)
- [ ] Driver headshots and team logos from F1 media CDN
- [ ] Predictions stored in browser localStorage (no backend needed)
- [ ] GitHub repo creation and Vercel deployment with auto-deploy on push
- [ ] F1 official dark theme (#15151E background, #E10600 red accent, team color accents)
- [ ] Responsive design (desktop-first, mobile-friendly)

### Out of Scope

- User authentication / accounts — single user (Brycen), no login needed
- Backend / database — localStorage is sufficient for predictions
- Real-time live timing during races — too complex for v1, OpenF1 for post-session data
- Historical seasons — 2026 only
- Multi-user predictions / leaderboards — solo experience for now
- Mobile native app — web-only, responsive design covers mobile use

## Context

- **User:** Brycen, 13 years old, F1 fan. Appreciates professional/sleek design over kiddie aesthetics
- **Builder:** His uncle, wants to gift him a complete F1 tracking ecosystem
- **2026 Season:** ~24 races on the calendar
- **Data sources:** Ergast API (free, reliable for results/standings), OpenF1 API (free, real-time session data), F1 Media CDN (headshots, logos)
- **Circuit maps:** Static SVGs styled to match dark theme, showing DRS zones, sectors, start/finish
- **Prediction scoring:** Exact position = 25pts, right driver wrong position = 10pts, driver in top 5 but not podium = 5pts
- **Design reference:** Official F1.com broadcast graphics aesthetic

## Constraints

- **Tech stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS — decided during brainstorming
- **Hosting:** Vercel with GitHub auto-deploy — decided during brainstorming
- **No backend:** All prediction data in localStorage — keeps deployment simple and free
- **Free APIs only:** Ergast and OpenF1 are both free, no API keys for basic usage
- **Budget:** $0 — all free tier services

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js 14 + TypeScript | Best for React apps with SSR, strong typing, Vercel-native | — Pending |
| Tailwind CSS | Rapid styling, easy dark theme, utility-first matches component approach | — Pending |
| Ergast + OpenF1 combined | Most complete data coverage — Ergast for results, OpenF1 for live data | — Pending |
| localStorage for predictions | No backend complexity, free, Brycen is sole user | — Pending |
| F1 dark theme | Professional look, matches official F1 branding, appeals to 13-year-old | — Pending |
| Trading card driver grid | Visually striking, fun to browse, team colors as accents | — Pending |
| Gamified prediction scoring (25/10/5) | Keeps engagement high across the season, mirrors F1's own points system | — Pending |
| Static SVG circuit maps | Clean, fast-loading, professional look — matches F1 broadcast style | — Pending |
| GitHub + Vercel auto-deploy | Seamless CI/CD, free tier sufficient | — Pending |

---
*Last updated: 2026-03-07 after initialization*
