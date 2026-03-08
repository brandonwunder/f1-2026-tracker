# F1 2026 Tracker — Premium Visual Overhaul

**Style:** F1 TV / Official Broadcast aesthetic
**Date:** 2026-03-08

## Problem

The site looks bland — same dark grey glass-cards everywhere, no visual hierarchy, colors meld together, feels generic rather than premium F1.

## Design Direction

Model after official F1 TV broadcast graphics: high-contrast, bold team colors, carbon fiber textures, crisp data visualization, dramatic gradients. Every element should feel like it belongs on a race-day broadcast.

## Implementation Plan

### Phase 1: Foundation — CSS & Tailwind Overhaul
- **Carbon fiber background texture** on body instead of flat dark color
- **Richer color palette** — deeper darks (#0D0D15), brighter accents, true blacks for contrast
- **Improved glass-card** — more depth, stronger blur, subtle inner glow on hover
- **New gradient-border** that uses team colors dynamically
- **Racing stripe accents** — diagonal red stripes on key elements
- **Better typography scale** — bigger headings, tighter spacing, more weight contrast

### Phase 2: Navigation — Broadcast-Style Sidebar
- Add subtle carbon fiber texture to sidebar background
- F1 logo-style header with red racing stripe
- Active state with bold team-red glow instead of subtle highlight
- Animated race light indicators next to active page

### Phase 3: Driver Cards — Team-Themed Backgrounds
- Each card gets a **gradient background based on team color** (e.g., Ferrari cards have deep red gradient)
- Larger driver headshots with team color halo/glow
- Position badges with metallic gradients (gold/silver/bronze) that pop
- Points displayed in Orbitron font like a scoreboard
- Card hover: team color border glow intensifies

### Phase 4: Race Pages — Broadcast Overlay Feel
- Race header with dramatic full-width gradient using race country flag colors
- Results tables with alternating row shading and team color left border
- Podium section with 3D-style podium blocks when race is complete
- Qualifying grid visualization — starting grid visual with car positions

### Phase 5: Dashboard — Command Center
- Next race widget: larger countdown with animated numbers, track silhouette background
- Standings widgets: horizontal bar charts with team-colored bars
- More visual separation between sections using dividers/borders
- Season progress ring/arc showing how far through the 24-race season

### Phase 6: Predictions & Leaderboard
- Player cards with custom color themes
- Animated score reveals
- Head-to-head comparison with split-screen team battle styling
