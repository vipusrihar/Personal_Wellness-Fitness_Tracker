# FitTrack - Personal Wellness & Fitness Tracker

A fully offline-capable, PWA-ready personal wellness and fitness tracking application built with React, TypeScript, and Vite. FitTrack Pro helps users monitor workouts, nutrition, hydration, body measurements, and daily streaks - all stored locally in the browser using IndexedDB via Dexie.js.



## Features

- **User Authentication** - Local registration and login with form validation; sessions persist via IndexedDB
- **Dashboard** - Daily overview of calories, hydration, active streak, and a motivational quote fetched from an external API (with local fallback)
- **Calorie Tracker** - Log meals by category (Breakfast, Lunch, Dinner, Snack), edit or delete entries, and track progress toward a custom daily calorie goal
- **Hydration Tracker** - Log water intake in configurable increments and visualize daily progress toward a personal water goal
- **Workout Logger** - Search exercises by name, log sets/reps/duration, and maintain a complete history
- **Progress Tracker** - Record body measurements (weight, height, BMI) over time and view trends with interactive Recharts graphs
- **Achievement System** - Unlock badges automatically as milestones are reached (first workout, hydration goal met, streak milestones, etc.)
- **Streak Tracking** - Daily login/activity streaks with automatic calculation and badge rewards at 3, 7, and 30-day marks
- **User Profile** - Set personal details (age, gender, weight, height, fitness goal) and customise calorie and water goals
- **Settings** - Export all personal data as JSON, reset data, and toggle app preferences
- **Dark / Light Theme** - System-aware theme toggle persisted across sessions
- **Responsive Layout** - Sidebar navigation on desktop, bottom tab bar on mobile
- **PWA Support** - Installable as a progressive web app via `vite-plugin-pwa`
- **Offline First** - All data lives in the browser's IndexedDB; no backend required
- **Sync Queue** - Infrastructure for future server sync (queued operations stored locally)


## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript 6 |
| Build Tool | Vite 8 |
| Routing | React Router DOM 7 |
| Local Database | Dexie.js 4 (IndexedDB wrapper) |
| Charts | Recharts 3 |
| HTTP Client | Axios |
| Icons | React Icons 5 |
| PWA | vite-plugin-pwa |
| Linting | ESLint 10 + TypeScript ESLint |


## Project Structure

```
Personal_Wellness-Fitness_Tracker/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Header.tsx      # Page header with theme toggle
│   │   ├── Layout.tsx      # Root layout (sidebar + header + outlet)
│   │   ├── ProgressBar.tsx # Reusable linear progress bar
│   │   ├── ProgressiveRing.tsx # SVG circular progress ring
│   │   ├── Sidebar.tsx     # Desktop sidebar navigation
│   │   ├── Timers.tsx      # Stopwatch & countdown timer widget
│   │   └── Toast.tsx       # Toast notification renderer
│   ├── constants/
│   │   └── badges.ts       # Badge definitions (id, label, icon, desc)
│   ├── contexts/           # React Contexts (atomic state management)
│   │   ├── AchievementContext.tsx
│   │   ├── AppContext.tsx   # Root provider that composes all contexts
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   ├── ToastContext.tsx
│   │   └── UserProfileContext.tsx
│   ├── database/
│   │   └── db.ts           # Dexie database schema & singleton instance
│   ├── pages/              # Route-level page components
│   │   ├── Auth.tsx        # Login & Registration page
│   │   ├── Calories.tsx    # Calorie tracking page
│   │   ├── Dashboard.tsx   # Main dashboard / home after login
│   │   ├── Home.tsx        # Public landing page
│   │   ├── Hydration.tsx   # Water intake tracking page
│   │   ├── Profile.tsx     # User profile editor
│   │   ├── Progress.tsx    # Body measurements & charts
│   │   ├── Settings.tsx    # App settings, data export & reset
│   │   └── Workouts.tsx    # Workout logging page
│   ├── services/           # Data access & business logic layer
│   │   ├── achievementService.ts
│   │   ├── apiService.ts   # External API calls (quotes, exercises)
│   │   ├── calorieService.ts
│   │   ├── dataService.ts  # Export & reset orchestration
│   │   ├── hydrationService.ts
│   │   ├── measurement.ts
│   │   ├── profileService.ts
│   │   ├── streakService.ts
│   │   ├── SyncQueueService.ts
│   │   ├── userService.ts
│   │   └── workoutService.ts
│   ├── styles/             # Component-scoped CSS files
│   ├── types/              # TypeScript interfaces
│   │   ├── Achievement.ts
│   │   ├── Badge.ts
│   │   ├── Calorie.ts
│   │   ├── Profile.ts
│   │   ├── Toast.ts
│   │   ├── User.ts
│   │   └── Workout.ts
│   ├── App.tsx             # Root app component
│   ├── AppRoutes.tsx       # Route definitions & route guards
│   └── main.tsx            # React entry point
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── eslint.config.js
```


## Getting Started

### Prerequisites

- **Node.js** 18 or later
- **npm** 9 or later (or yarn / pnpm)

### Installation

```bash
# Clone the repository
git clone https://github.com/vipusrihar/Personal_Wellness-Fitness_Tracker.git
cd Personal_Wellness-Fitness_Tracker

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

The app will start at `http://localhost:5173` (default Vite port).

### Production Build

```bash
npm run build
```

The compiled output is placed in the `dist/` directory and is ready to deploy to any static hosting service (Vercel, Netlify, GitHub Pages, etc.).

### Preview the Build

```bash
npm run preview
```

## Pages & Modules

### Public Routes

| Route | Component | Description |
|---|---|---|
| `/` | `Home.tsx` | Landing page for unauthenticated users |
| `/login` | `Auth.tsx` | Sign-in form |
| `/register` | `Auth.tsx` | Account creation form |

### Protected Routes (require login)

| Route | Component | Description |
|---|---|---|
| `/dashboard` | `Dashboard.tsx` | Daily summary, streak, motivational quote |
| `/calories` | `Calories.tsx` | Log and manage meal entries |
| `/hydration` | `Hydration.tsx` | Track daily water intake |
| `/workouts` | `Workouts.tsx` | Search exercises and log workout sessions |
| `/progress` | `Progress.tsx` | Record body measurements and view charts |
| `/profile` | `Profile.tsx` | Edit personal details and goals |
| `/settings` | `Settings.tsx` | Export data, reset data, app preferences |

Route guards are implemented via `ProtectedRoute` and `PublicRoute` wrappers in `AppRoutes.tsx`. Unauthenticated users are redirected to `/login`; authenticated users are redirected away from auth pages to `/dashboard`.

## Data Architecture

All data is stored client-side using **Dexie.js** (an IndexedDB wrapper). The database is named `FitTrackProDb` and contains the following tables:

| Table | Primary Key | Indexed Fields | Description |
|---|---|---|---|
| `users` | `++id` | `username`, `email`, `createdAt` | Registered user accounts |
| `profile` | `++id` | `&userId` (unique) | Personal profile & goals per user |
| `calories` | `++id` | `userId`, `timestamp` | Individual meal log entries |
| `hydration` | `++id` | `userId`, `timestamp` | Water intake log entries |
| `workouts` | `++id` | `userId`, `timestamp` | Workout session records |
| `measurements` | `++id` | `userId`, `timestamp` | Body measurement records |
| `achievements` | `++id` | `userId`, `badgeId` | Unlocked achievement badges |
| `streaks` | `++id` | `userId`, `date` | Daily activity streak records |
| `syncQueue` | `++id` | `userId`, `timestamp` | Pending sync operations queue |

No network backend is required. All CRUD operations are performed directly against the browser's IndexedDB through the service layer.


## Services

The service layer (`src/services/`) provides a clean abstraction over the database and external APIs:

- **`userService`** - Create accounts, find by username/email, validate credentials
- **`profileService`** - Create, read, and update the user's profile and goal settings
- **`calorieService`** - Add, read today's entries, read all entries, update, and delete calorie logs
- **`hydrationService`** - Add, read today's hydration entries, and delete entries
- **`workoutService`** - Add, read all workout records, and delete entries
- **`measurementService`** - Add, read all body measurements, and delete entries
- **`achievementService`** - Read unlocked achievements and unlock new ones (idempotent)
- **`streakService`** - Calculate and update daily streaks; retrieve the current streak count
- **`dataService`** - Orchestrate full data export (all tables) and full data reset
- **`syncQueueService`** - Add, read, and remove queued sync operations for future backend integration
- **`apiService`** - Fetch motivational quotes from `dummyjson.com` (cached for 24 hours) and provide a searchable exercise library (cached for 7 days); both fall back to local data on network failure


## Achievements & Badges

Badges are defined in `src/constants/badges.ts` and unlocked automatically by the `AchievementContext` when conditions are met in the relevant pages.

| Badge ID | Label | Trigger |
|---|---|---|
| `first_login` | First Steps | Logged in for the first time |
| `first_workout` | Iron Will | Completed first workout |
| `first_meal` | Fuel Up | Logged first meal |
| `hydration_goal` | Hydrated | Met daily water goal |
| `streak_3` | On Fire | Maintained a 3-day streak |
| `streak_7` | Week Warrior | Maintained a 7-day streak |
| `streak_30` | Legend | Maintained a 30-day streak |
| `weight_loss` | Slimmer | Logged weight loss progress |
| `calorie_goal` | Disciplined | Hit calorie goal 3 times |

Badge unlocks are displayed as toast notifications and permanently stored in IndexedDB.


## Theming

The app supports **dark** and **light** themes managed by `ThemeContext`. The theme preference is persisted in `localStorage` and applied via CSS custom properties defined in `src/styles/global.css`. Users can toggle the theme at any time via the sun/moon button in the header.


## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot module replacement |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across all TypeScript files |


## License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

Copyright © 2026 Vipusa Sriharan