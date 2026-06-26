# FitTrack — Personal Wellness & Fitness Tracker

A PWA-ready fitness tracking app built with **React + TypeScript + Vite**. All data is stored locally in the browser via **IndexedDB (Dexie.js)** — no backend required.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript 6 |
| Build Tool | Vite 8 |
| Routing | React Router DOM 7 |
| Database | Dexie.js 4 (IndexedDB) |
| Charts | Recharts 3 |
| HTTP Client | Axios |
| PWA | vite-plugin-pwa |

## Getting Started

**Prerequisites:** Node.js 18+, npm 9+

```bash
git clone https://github.com/vipusrihar/Personal_Wellness-Fitness_Tracker.git
cd Personal_Wellness-Fitness_Tracker
npm install
npm run dev          # → http://localhost:5173
```

Other commands: `npm run build` · `npm run preview` · `npm run lint`

## Browser Compatibility

Tested and working in **Chrome 120+**, **Firefox 121+**, and **Safari 17+**.  
IndexedDB and PWA service workers require a modern browser; IE is not supported.  
For the evaluation demo, use **Chrome DevTools → Device Toolbar** to simulate mobile viewports.

## Key Features

- **Dashboard** — daily calorie, hydration & workout rings + motivational quote (API + offline fallback)
- **Calorie Tracker** — log, edit, delete meals by category; progress toward custom daily goal
- **Hydration Tracker** — quick-add buttons + custom input; SVG ring visualisation
- **Workout Logger** — exercise library search (API-backed), stopwatch/countdown timer, **view detail modal**
- **Progress Charts** — weight trend (line) + calorie & workout history (bar) via Recharts
- **Achievements** — 9 auto-unlocked badges stored in IndexedDB
- **User Profile** — age, weight, height, BMI, custom calorie/water goals
- **Settings** — JSON data export, full data reset, dark/light theme toggle
- **PWA / Offline-first** — `vite-plugin-pwa` service worker; all data persists in IndexedDB with a sync queue for future server integration

## Project Structure

```
src/
├── components/   # Header, Layout, Sidebar, Timers, ProgressBar, ProgressiveRing, Toast
├── constants/    # badges.ts
├── contexts/     # Auth, Theme, Toast, Achievement, UserProfile, App (root provider)
├── database/     # db.ts — Dexie schema (users, profile, calories, hydration,
│                 #         workouts, measurements, achievements, streaks, syncQueue)
├── pages/        # Auth, Dashboard, Calories, Hydration, Workouts, Progress,
│                 # Profile, Settings, Home
├── services/     # apiService, calorieService, workoutService, hydrationService,
│                 # measurementService, profileService, userService, streakService,
│                 # achievementService, dataService, SyncQueueService
├── styles/       # Component-scoped CSS files
└── types/        # Achievement, Badge, Calorie, Profile, Toast, User, Workout
```