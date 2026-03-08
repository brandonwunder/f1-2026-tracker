# Phase 1: Project Foundation - Research

**Researched:** 2026-03-08
**Domain:** Next.js project scaffold, F1 dark theme, team color system, responsive layout, navigation
**Confidence:** HIGH

## Summary

Phase 1 establishes the entire application skeleton: a deployed Next.js project with F1-themed dark design, team color system, responsive layout, and navigation to all sections. This is a foundation phase with no data fetching or business logic -- just the shell that everything else builds on.

The core technologies are well-understood and stable: Next.js with App Router, TypeScript, and Tailwind CSS. The main implementation decisions are around the dark theme color system (CSS custom properties vs Tailwind config), the team color mapping (hardcoded constants for all 11 teams), and the responsive navigation pattern. Since this is a single-user app for Brycen, complexity should be minimal -- no authentication, no theme toggle, just a permanent dark theme.

**Primary recommendation:** Use `create-next-app` with the latest Next.js (the requirements say 14 but 16 is now current -- use 14 as specified via `npx create-next-app@14`), configure Tailwind with F1 theme colors in `tailwind.config.ts`, create a constants file with all 11 team colors, and build a responsive sidebar/top navigation with links to all 5 sections.

**Important version note:** Next.js 16 is the current latest (released October 2025), but INFRA-03 explicitly specifies "Next.js 14 App Router." Use `npx create-next-app@14` to lock to version 14.x as required. This is still fully supported and well-documented.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INFRA-01 | GitHub repository created and code pushed | Standard git init + GitHub remote setup. Can be done via `gh repo create` or manual. |
| INFRA-02 | Vercel project linked to GitHub repo with auto-deploy on push to main | Vercel dashboard import or `vercel link`. Free tier supports this fully. |
| INFRA-03 | Next.js 14 App Router with TypeScript and Tailwind CSS | `npx create-next-app@14` with --typescript --tailwind --app --src-dir flags. |
| INFRA-04 | F1 dark theme applied globally (#15151E background, #E10600 red accent, #1F1F2B card surfaces) | Tailwind config custom colors + globals.css with CSS variables. Apply dark bg to html/body in root layout. |
| INFRA-05 | Team color system for all 10 teams used across driver cards, standings, and results | Constants file with hex codes per team. Tailwind custom colors or inline styles. Note: 2026 grid has 11 teams (Cadillac is new). |
| INFRA-06 | Responsive design -- desktop-first, functional on mobile and tablet | Tailwind responsive breakpoints (lg: desktop-first, md: tablet, sm/default: mobile). |
| INFRA-07 | App navigation with links to all pages (Dashboard, Races, Drivers, Standings, Predictions) | Layout component with sidebar (desktop) / hamburger menu (mobile). Next.js Link components. |
</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 14.x | Full-stack React framework with App Router | Specified in INFRA-03. App Router provides file-system routing, Server Components, ISR caching. |
| TypeScript | 5.x | Type safety | Specified in INFRA-03. Ships with create-next-app. |
| Tailwind CSS | 3.x | Utility-first styling | Specified in INFRA-03. Ships with create-next-app. Perfect for custom theme colors. |
| React | 18.x | UI library | Ships with Next.js 14. |

### Supporting (Phase 1 only)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx | 2.x | Conditional class names | Any component with conditional Tailwind classes |
| tailwind-merge | 2.x | Resolve Tailwind class conflicts | Combined with clsx in a `cn()` utility function |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Next.js 14 | Next.js 16 (current latest) | v16 is newer but INFRA-03 specifies v14. Stick with requirement. |
| Tailwind custom colors | CSS-only variables | Tailwind config gives better DX (autocomplete, responsive variants). Use both: CSS vars for runtime, Tailwind for static. |
| Sidebar navigation | Top-only navbar | Sidebar gives more room for 5 nav items + branding on desktop. Top navbar on mobile. |

**Installation:**
```bash
# Initialize project (use @14 to pin to Next.js 14 as required)
npx create-next-app@14 f1-tracker --typescript --tailwind --app --src-dir --eslint

# Phase 1 supporting deps only
cd f1-tracker
npm install clsx tailwind-merge
```

## Architecture Patterns

### Recommended Project Structure (Phase 1 scope)

```
src/
  app/
    layout.tsx              # Root layout: dark theme, nav, metadata
    page.tsx                # Dashboard placeholder
    calendar/
      page.tsx              # Calendar placeholder
    race/
      [round]/
        page.tsx            # Race detail placeholder
    drivers/
      page.tsx              # Drivers placeholder
    standings/
      page.tsx              # Standings placeholder
    predictions/
      page.tsx              # Predictions placeholder
    globals.css             # Tailwind base + F1 theme CSS variables
  components/
    layout/
      Navigation.tsx        # Main nav component (sidebar + mobile menu)
      Header.tsx            # Top header bar
    ui/
      cn.ts                 # cn() utility (clsx + tailwind-merge)
  lib/
    constants/
      teams.ts              # Team colors, names, IDs
      theme.ts              # Theme color tokens
  types/
    index.ts                # Shared types (Team, etc.)
```

### Pattern 1: Permanent Dark Theme via Root Layout

**What:** Apply dark background and text colors at the `<html>` and `<body>` level in `layout.tsx`. No theme toggle needed -- Brycen's app is always dark.
**When to use:** Always. This is the global foundation.
**Example:**
```typescript
// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/layout/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Brycen's F1 2026 Tracker",
  description: 'Track the 2026 Formula One season',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-f1-dark text-white min-h-screen`}>
        <div className="flex">
          <Navigation />
          <main className="flex-1 p-6 lg:ml-64">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
```

### Pattern 2: Tailwind Config with F1 Theme Colors

**What:** Extend Tailwind's color palette with F1 brand colors and team colors in `tailwind.config.ts`.
**When to use:** All styling across the app references these tokens.
**Example:**
```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        f1: {
          dark: '#15151E',       // Main background
          surface: '#1F1F2B',    // Card surfaces
          red: '#E10600',        // F1 red accent
          'surface-hover': '#2A2A3A', // Hover state
          border: '#2E2E3E',     // Subtle borders
          muted: '#8B8B9E',      // Muted text
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

### Pattern 3: Team Color System as Constants

**What:** A constants file mapping team IDs to hex colors, used programmatically via inline styles (since Tailwind can't use dynamic class names).
**When to use:** Anywhere team colors appear (driver cards, standings rows, results).
**Example:**
```typescript
// src/lib/constants/teams.ts
export interface Team {
  id: string;
  name: string;
  color: string;        // Primary hex color
  secondaryColor?: string;
}

export const TEAMS: Record<string, Team> = {
  red_bull:      { id: 'red_bull',      name: 'Red Bull Racing',    color: '#3671C6' },
  ferrari:       { id: 'ferrari',       name: 'Scuderia Ferrari',   color: '#E80020' },
  mercedes:      { id: 'mercedes',      name: 'Mercedes-AMG',       color: '#27F4D2' },
  mclaren:       { id: 'mclaren',       name: 'McLaren',            color: '#FF8000' },
  aston_martin:  { id: 'aston_martin',  name: 'Aston Martin',       color: '#229971' },
  alpine:        { id: 'alpine',        name: 'Alpine',             color: '#FF87BC' },
  williams:      { id: 'williams',      name: 'Williams',           color: '#64C4FF' },
  racing_bulls:  { id: 'racing_bulls',  name: 'Racing Bulls',       color: '#6692FF' },
  haas:          { id: 'haas',          name: 'Haas F1 Team',       color: '#B6BABD' },
  audi:          { id: 'audi',          name: 'Audi',               color: '#C0C0C0' },
  cadillac:      { id: 'cadillac',      name: 'Cadillac F1 Team',   color: '#FFD700' },
};

// Helper to get team color for inline styles
export function getTeamStyle(teamId: string) {
  const team = TEAMS[teamId];
  return team ? { borderColor: team.color, '--team-color': team.color } as React.CSSProperties : {};
}
```

### Pattern 4: Responsive Desktop-First Navigation

**What:** Sidebar navigation on desktop (fixed left), collapsible hamburger menu on mobile/tablet.
**When to use:** Root layout -- persistent across all pages.
**Example:**
```typescript
// src/components/layout/Navigation.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/components/ui/cn';

const NAV_ITEMS = [
  { href: '/',            label: 'Dashboard',   icon: '...' },
  { href: '/calendar',    label: 'Races',       icon: '...' },
  { href: '/drivers',     label: 'Drivers',     icon: '...' },
  { href: '/standings',   label: 'Standings',   icon: '...' },
  { href: '/predictions', label: 'Predictions', icon: '...' },
];

export function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-f1-surface border-r border-f1-border">
        <div className="p-6">
          <h1 className="text-xl font-bold text-f1-red">F1 2026</h1>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                pathname === item.href
                  ? 'bg-f1-red/10 text-f1-red'
                  : 'text-f1-muted hover:text-white hover:bg-f1-surface-hover'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile top bar + hamburger */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-50 bg-f1-surface border-b border-f1-border">
        {/* ... hamburger button, mobile slide-out nav ... */}
      </div>
    </>
  );
}
```

### Anti-Patterns to Avoid

- **Dynamic Tailwind class names with team colors:** `bg-${teamColor}` does NOT work -- Tailwind purges unused classes at build time. Use inline `style={{ backgroundColor: team.color }}` for dynamic team colors.
- **Installing next-themes for a dark-only app:** next-themes adds complexity for theme toggling. This app is permanently dark -- just set classes on `<html>` and `<body>`.
- **Putting all pages in a flat `app/` folder:** Use nested route segments (`calendar/`, `race/[round]/`, etc.) for clean URL structure and layout nesting.
- **Using `<a>` tags instead of `next/link`:** Loses client-side navigation and prefetching benefits.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Class name merging | Manual string concatenation | `cn()` from clsx + tailwind-merge | Handles conditional classes and Tailwind specificity conflicts |
| Project scaffold | Manual file creation | `create-next-app@14` | Configures TypeScript, Tailwind, ESLint, App Router correctly |
| Font loading | Manual `@font-face` | `next/font` (built into Next.js) | Automatic font optimization, no layout shift |
| Responsive breakpoints | Custom media queries | Tailwind responsive prefixes (`lg:`, `md:`) | Consistent, maintainable, well-documented |

## Common Pitfalls

### Pitfall 1: Dynamic Tailwind Classes for Team Colors
**What goes wrong:** Writing `className={`bg-[${team.color}]`}` or `className={`border-${teamName}`}` expecting Tailwind to generate those classes.
**Why it happens:** Tailwind scans source code at build time for class names. Dynamically constructed class names are invisible to the scanner.
**How to avoid:** Use inline `style` attributes for any color that comes from runtime data (team colors). Reserve Tailwind classes for static theme colors (f1-dark, f1-red, f1-surface).
**Warning signs:** Team-colored elements appear unstyled or with no color.

### Pitfall 2: Forgetting "use client" on Interactive Components
**What goes wrong:** Navigation with `useState` for mobile menu toggle fails because Server Components can't use React hooks.
**Why it happens:** Next.js App Router defaults all components to Server Components.
**How to avoid:** Add `'use client'` directive at the top of any component that uses hooks, event handlers, or browser APIs.
**Warning signs:** Runtime error: "useState is not a function" or "Event handlers cannot be passed to Client Component props."

### Pitfall 3: Wrong create-next-app Version
**What goes wrong:** Running `npx create-next-app@latest` installs Next.js 16 instead of the required Next.js 14.
**Why it happens:** `@latest` always pulls the newest version.
**How to avoid:** Explicitly use `npx create-next-app@14` to pin to version 14.x.
**Warning signs:** `package.json` shows `"next": "^16.0.0"` instead of `"^14.x.x"`.

### Pitfall 4: Vercel Deployment Fails on First Push
**What goes wrong:** Vercel auto-deploy fails because the project wasn't imported correctly or environment variables are missing.
**Why it happens:** Need to import the GitHub repo in Vercel dashboard before pushes trigger builds.
**How to avoid:** 1) Push code to GitHub first. 2) Import repo in Vercel dashboard. 3) Verify first deploy succeeds. Only then is auto-deploy active.
**Warning signs:** No deployment triggered after push, or build errors in Vercel dashboard.

### Pitfall 5: 2026 Grid Has 11 Teams, Not 10
**What goes wrong:** Only defining colors for 10 teams and missing Cadillac (the 11th team joining in 2026).
**Why it happens:** INFRA-05 says "10 teams" based on historical precedent, but 2026 adds Cadillac as the 11th entry.
**How to avoid:** Include all 11 teams in the constants file. Also note Sauber has been replaced by Audi for 2026.
**Warning signs:** Missing team color when Cadillac data appears from the API.

## Code Examples

### cn() Utility Function
```typescript
// src/components/ui/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### globals.css with F1 Theme
```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --f1-dark: #15151E;
    --f1-surface: #1F1F2B;
    --f1-red: #E10600;
    --f1-border: #2E2E3E;
    --f1-muted: #8B8B9E;
  }

  body {
    @apply bg-f1-dark text-white antialiased;
  }
}

/* Smooth scrollbar styling for dark theme */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: var(--f1-dark);
}
::-webkit-scrollbar-thumb {
  background: var(--f1-border);
  border-radius: 4px;
}
```

### Placeholder Page Pattern
```typescript
// src/app/calendar/page.tsx
export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Race Calendar</h1>
      <p className="text-f1-muted">Coming soon in Phase 3</p>
    </div>
  );
}
```

## Team Color Reference (2026 Grid)

These are the primary broadcast/brand colors used by F1 official graphics. Colors may shift slightly as 2026 liveries are finalized.

| Team | Hex Color | Confidence | Notes |
|------|-----------|------------|-------|
| Red Bull Racing | `#3671C6` | HIGH | Consistent blue across seasons |
| Scuderia Ferrari | `#E80020` | HIGH | Classic Ferrari red |
| Mercedes-AMG | `#27F4D2` | MEDIUM | Teal/green used since 2022 rebrand |
| McLaren | `#FF8000` | HIGH | Papaya orange, signature color |
| Aston Martin | `#229971` | HIGH | British racing green variant |
| Alpine | `#FF87BC` | MEDIUM | Pink introduced 2024, may change |
| Williams | `#64C4FF` | MEDIUM | Light blue, used in recent seasons |
| Racing Bulls | `#6692FF` | MEDIUM | Blue accent, rebrand from AlphaTauri |
| Haas F1 Team | `#B6BABD` | MEDIUM | Silver/gray, minimal branding |
| Audi | `#C0C0C0` | LOW | New team for 2026 (replaces Sauber). Silver livery revealed but exact broadcast hex unconfirmed. |
| Cadillac F1 Team | `#FFD700` | LOW | New 11th team for 2026. Black/white livery revealed but F1 broadcast color unconfirmed. Gold used as placeholder. |

**Note on Audi and Cadillac colors:** These are new entries for 2026. The hex codes above are best estimates based on revealed livery imagery. Update these once F1 official broadcast colors are confirmed at season start.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Pages Router (`pages/`) | App Router (`app/`) | Next.js 13+ (2023) | File-system routing, Server Components, layouts |
| `getStaticProps` / `getServerSideProps` | `async` Server Components + `fetch` with `revalidate` | Next.js 13+ | Simpler data fetching, co-located with components |
| CSS Modules or styled-components | Tailwind CSS utility classes | Industry shift 2022-2024 | Faster development, smaller CSS bundles |
| next-themes for all dark mode | Direct class application for permanent dark | Always available | No library needed for single-theme apps |

## Open Questions

1. **Audi and Cadillac team color hex codes**
   - What we know: Liveries revealed (Audi silver, Cadillac black/white). General color families known.
   - What's unclear: Exact hex codes F1 will use in official broadcast graphics for 2026.
   - Recommendation: Use placeholder colors now, update when F1 2026 season officially starts and broadcast colors are locked.

2. **Next.js 14 vs current latest**
   - What we know: INFRA-03 specifies "Next.js 14." Current latest is Next.js 16.
   - What's unclear: Whether the user intended "14" specifically or just "modern Next.js."
   - Recommendation: Follow the requirement literally -- use `create-next-app@14`. It's stable and well-supported. Can upgrade later if desired.

3. **Font choice**
   - What we know: F1 uses a custom "F1" font family that is not freely available.
   - What's unclear: Whether to use Inter, Outfit, or another clean sans-serif.
   - Recommendation: Use Inter (Next.js default) or Outfit for a modern racing feel. Both work well with dark themes.

## Sources

### Primary (HIGH confidence)
- [Next.js Installation Docs](https://nextjs.org/docs/app/getting-started/installation) - create-next-app setup, App Router defaults
- [Next.js App Router Docs](https://nextjs.org/docs/app/getting-started) - Server Components, layouts, routing
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode) - Class-based dark mode strategy
- [Next.js create-next-app CLI](https://nextjs.org/docs/app/api-reference/cli/create-next-app) - CLI flags and options

### Secondary (MEDIUM confidence)
- [TeamColorCodes.com](https://teamcolorcodes.com/formula-1/) - F1 team color hex codes
- [SportColorCodes.com](https://sportcolorcodes.com/racing/formula-1/) - Additional F1 color references
- [FastF1 Plotting Colors](https://docs.fastf1.dev/plotting.html) - Official F1 broadcast team colors
- [Formula1.com 2026 Teams](https://www.formula1.com/en/teams) - 2026 grid confirmation including Cadillac as 11th team

### Tertiary (LOW confidence)
- Audi and Cadillac hex colors - Estimated from livery imagery, not confirmed by F1 broadcast

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Next.js 14, TypeScript, Tailwind CSS are all specified in requirements and well-documented
- Architecture: HIGH - Standard Next.js App Router patterns, well-established conventions
- Theme colors: HIGH for F1 brand (#15151E, #E10600, #1F1F2B specified in requirements), MEDIUM for team colors (established teams), LOW for Audi/Cadillac
- Pitfalls: HIGH - Common Next.js App Router issues are well-documented

**Research date:** 2026-03-08
**Valid until:** 2026-04-08 (30 days - stable technologies, team colors may update at season start)
