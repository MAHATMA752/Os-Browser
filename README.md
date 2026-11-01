# NOVA OS

A browser-based desktop operating system experience inspired by macOS: dark, minimal, and built for the web.

NOVA OS now has a local **Next.js API + SQLite backend**. Settings, notes, virtual files, and calendar events persist across refreshes in `data/nova.db`. The desktop shell still runs entirely in the browser and windows are not persisted.

## Run locally

```bash
npm.cmd install
npm.cmd run dev
```

Open [http://localhost:3000](http://localhost:3000).

> On Windows PowerShell in this environment, the `npm.ps1` shim is blocked by execution policy. Use `npm.cmd` instead of `npm`.
>
> The backend uses the built-in `node:sqlite` module. Use Node.js 24+.

## Verify

```bash
npm.cmd run lint
npm.cmd run build
```

`npm run build` also runs TypeScript checks.

## What is implemented

- Boot screen and desktop shell
- Menu bar, Dock with magnification, desktop icons, context menu
- Window manager: drag, resize, minimize, maximize, close, focus, z-index
- Finder, Browser, Terminal, Notes, Calculator, Calendar, Settings, Trash
- Spotlight search (`Ctrl/Cmd + Space`)
- Control Center
- Fullscreen desktop mode (menu bar button, Control Center, `Ctrl/Cmd + Shift + F`)
- Accent color, wallpaper, Dock size, and menu bar clock preferences in Settings
- SQLite persistence for settings, notes, virtual files, and calendar events
- Finder create/rename/delete and Quick Look editing
- Notes create/edit/delete with debounced saves
- Calendar month fetching and event create/delete

## API

All routes are Next.js Route Handlers under `src/app/api/`.

```text
GET                 /api/health
GET, PATCH          /api/settings
GET, POST           /api/notes
PATCH, DELETE       /api/notes/:id
GET, POST           /api/files
PATCH, DELETE       /api/files/:id
GET                 /api/calendar/events?month=YYYY-MM
POST                /api/calendar/events
DELETE              /api/calendar/events/:id
```

The database is created and seeded on first request. Delete `data/nova.db` to reset local data; the next request recreates it.

## Structure

```text
src/app/                     Next.js app shell, global styles, API routes
src/app/api/                 Route Handlers for settings, notes, files, calendar
src/components/os/           Desktop chrome, window manager, Spotlight, Dock
src/components/apps/         Individual app UIs
src/lib/apps.ts              Central app registry
src/lib/api-client.ts        Typed browser client for the API
src/lib/api-types.ts         Shared API data types
src/lib/server/db.ts         SQLite schema, seed data, and queries
src/lib/server/http.ts       API validation and response helpers
src/store/os-store.ts        Zustand OS state
```

See `AGENTS.md` for agent-oriented project notes and constraints.
