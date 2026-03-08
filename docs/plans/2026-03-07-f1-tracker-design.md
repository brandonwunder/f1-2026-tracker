# Brycen's F1 2026 Season Tracker - Design Document

## Overview

A Formula 1 stat tracking web app built for Brycen (age 13) to follow the 2026 F1 season. Includes live driver/race data, qualifying and race results, circuit maps, driver profiles, and a gamified prediction system.

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS with custom F1 dark theme
- **Hosting:** Vercel (auto-deploy from GitHub)
- **Version Control:** GitHub (repo created via CLI)
- **Data Sources:**
  - Ergast API - Race results, qualifying, standings, driver/constructor info
  - OpenF1 API - Live session data, real-time telemetry
  - F1 Media CDN - Driver headshots, team logos
- **Local Storage:** Browser localStorage for Brycen's predictions (no backend)

## Color Palette

| Token          | Value     | Usage                    |
|----------------|-----------|--------------------------|
| bg-primary     | #15151E   | Page backgrounds         |
| bg-surface     | #1F1F2B   | Cards, panels            |
| accent         | #E10600   | F1 red, buttons, highlights |
| text-primary   | #FFFFFF   | Headings, primary text   |
| text-secondary | #A0A0A0   | Body text, labels        |
| Per-team colors| Various   | Driver card accents      |

## Pages

### 1. Dashboard (Home - `/`)

- Next race countdown (track name, date, time)
- Current driver & constructor standings (top 5 preview)
- Most recent race podium result
- Brycen's prediction score running total
- Quick navigation links to all sections

### 2. Race Calendar (`/races`)

- Full 2026 season calendar as visual timeline/grid
- Each race card: track name, country flag, date, circuit thumbnail SVG
- Click any race to open Race Detail page

### 3. Race Detail (`/races/[id]`)

- **Circuit SVG map** with track stats (length, laps, corners, DRS zones, lap record)
- **Qualifying results** - full grid pulled from Ergast API
- **Race results** - finishing order, gaps, fastest lap, DNFs
- **Brycen's Predictions panel:**
  - Pre-race: pick P1/P2/P3 podium predictions
  - Post-race: shows picks vs actual with points scored
- **Track info** - location, circuit type, first GP year, overtaking spots

### 4. Drivers (`/drivers`)

- Card grid layout (trading card aesthetic)
- Each card displays:
  - Official headshot (from F1 media)
  - Driver name, car number, country flag
  - Team color accent border
  - Current championship position
- Click to expand full stats:
  - Season: wins, podiums, poles, fastest laps, points
  - Career: total wins, podiums, championships, career points
- Sortable by: points, wins, team, name
- Filterable by team

### 5. Standings (`/standings`)

- **Driver Championship** - full table with points, wins, podiums, position changes
- **Constructor Championship** - team standings showing both drivers' contributions
- Auto-updates after each race from Ergast API

### 6. Predictions Hub (`/predictions`)

- Season overview: all predictions vs actual results per race
- Running score with points breakdown
- Accuracy stats: % correct, best prediction, current streak
- Score graph tracking prediction performance across the season

## Prediction Scoring System

| Outcome                              | Points |
|--------------------------------------|--------|
| Exact podium position correct        | 25     |
| Right driver, wrong podium position  | 10     |
| Driver finishes top 5 (not podium)   | 5      |

Additional tracking:
- Running season total
- Prediction streak (consecutive races with at least 1 correct podium pick)
- Accuracy percentage

## Data Flow

1. **Ergast API** → Race results, qualifying, standings, driver info (polled on page load, cached)
2. **OpenF1 API** → Live session data during race weekends (real-time when available)
3. **F1 Media CDN** → Static assets: headshots, team logos, helmet images
4. **localStorage** → Brycen's predictions (read/write client-side)

## Infrastructure Setup

- **GitHub:** Create repo `f1-tracker-brycen` via `gh` CLI
- **Vercel:** Create project linked to GitHub repo via Vercel CLI, auto-deploy on push to main

## Circuit SVG Maps

Static SVG illustrations for all 2026 calendar tracks, styled to match the dark theme. Each map includes:
- Track layout outline
- DRS zones highlighted
- Sector boundaries
- Start/finish line marker

## Responsive Design

- Desktop-first but fully responsive
- Mobile layout: single column cards, collapsible sections
- Tablet: 2-column grid for driver cards and race cards
