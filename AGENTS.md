# AGENTS.md

## Repository state

- NOVA OS is a browser-based simulated desktop OS with a macOS-inspired dark UI. It is not a real kernel.
- The desktop UI and a local **Next.js Route Handler + SQLite backend** are implemented. Settings, notes, virtual files, and calendar events persist in `data/nova.db`; open windows and other transient OS state reset on refresh.
- `prd.md` is the product source of truth. It is mostly Indonesian and contains scraped external links/ads; ignore those and use its headings, tables, and code blocks.
- There is no auth and no multi-user support. This is a single-user local desktop experience.

## Commands

- Use `npm.cmd`, not `npm`: PowerShell execution policy blocks the `npm.ps1` shim on this machine.
- `npm.cmd install` — install dependencies.
- `npm.cmd run dev` — start Next.js at http://localhost:3000.
- `npm.cmd run lint` — ESLint.
- `npm.cmd run build` — production build and TypeScript check. Run lint first, then build.
- No test script or test framework exists yet. If adding one, document the single-test command here.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript.
- Tailwind CSS v4 (`@import "tailwindcss"` in `src/app/globals.css`; no `tailwind.config`).
- Zustand for OS state, Framer Motion for UI motion, Lucide React for icons.
- SQLite through the built-in `node:sqlite` module (requires Node.js 24+); Zod validates API request bodies.
- npm with `package-lock.json`; do not introduce another package manager without updating the lockfile.

## Structure

- `src/app/` — Next.js shell and global styles.
- `src/app/api/` — Route Handlers: health, settings, notes, files, calendar events.
- `src/components/os/` — desktop chrome: MenuBar, Dock, Wallpaper, WindowFrame, Spotlight, ControlCenter, boot screen.
- `src/components/apps/` — app UIs rendered inside windows.
- `src/lib/apps.ts` — central app registry (id, name, icon, gradient, default/min window sizes).
- `src/lib/api-client.ts` — typed browser fetch client for the API.
- `src/lib/api-types.ts` — shared API data types.
- `src/lib/server/db.ts` — SQLite singleton, schema, seed data, and queries.
- `src/lib/server/http.ts` — JSON parsing, Zod validation, and API error helpers.
- `src/store/os-store.ts` — Zustand store for windows, focus/z-index, Spotlight/Control Center, accent, wallpaper, Dock and menu-bar preferences.

## Architectural rules

- Apps open as windows inside the single desktop shell. Never create separate routes/pages for individual apps.
- Add apps to `APP_LIST`/`APPS` in `src/lib/apps.ts` and map the id in `src/components/apps/AppContent.tsx`; keep Dock, desktop icons, Spotlight, and registry in sync through that registry.
- Keep global OS/window state in Zustand. Do not duplicate window or app state locally per app.
- Window layout uses absolute inline styles plus z-index from the store. The mobile CSS in `globals.css` forces `.os-window` full-screen under 768px.
- The accent color is the CSS variable `--accent` (set by `NovaOS` from the store). Style accent-aware UI with `var(--accent)` / `var(--accent-soft)` instead of hardcoding blue.
- New preference controls in Settings should be wired to the store when they affect the desktop; avoid dead toggles.

## Backend rules

- Keep server-only code under `src/lib/server/`. Do not import `node:sqlite`, `node:fs`, or other server modules into client components.
- Route Handlers are dynamic by default. With `cacheComponents: true`, do **not** add `export const dynamic = "force-dynamic"`; Next rejects that route segment config.
- Use the `getDb()` singleton in `src/lib/server/db.ts`; do not open a new SQLite connection per request.
- Validate request bodies with the Zod schemas in the route files. Return `400` for invalid input and `404` for missing records.
- The database is seeded automatically when `data/nova.db` is first created. `data/` is gitignored. Delete the database file to reset local data.
- Files are soft-deleted with `deleted_at`; notes and calendar events are hard-deleted.

## Persistence and app behavior

- Browser app: only iframe content that allows embedding. Sites that block iframes must open in the main browser tab.
- Terminal is a simulation, never a shell. Commands: `help`, `clear`, `date`, `time`, `whoami`, `ls`, `pwd`, `echo`, `neofetch`.
- Settings, notes, virtual files, and calendar events are persisted through the API. Calculator state and window layout remain in-memory only.
- Settings are loaded in `NovaOS` on mount and saved with a short debounce when desktop preferences change.
- Notes saves are debounced per note; Finder changes save immediately; calendar fetches events per visible month.
- Fullscreen uses the browser Fullscreen API on `document.documentElement` through the store's `toggleFullscreen`. `NovaOS` listens to `fullscreenchange` and keeps `fullscreen` in sync; the menu bar, Control Center, and `Ctrl/Cmd + Shift + F` share that action.

## Next.js 16 / React gotchas

- `next.config.ts` enables `cacheComponents: true`. The build fails if a Client Component reads unstable values like `new Date()` during prerender. Initialize clocks/calendars with stable values or update them inside an effect timer (see `MenuBar` and `CalendarApp`).
- ESLint enforces `react-hooks/set-state-in-effect`: do not call `setState` synchronously in an effect body. Use event handlers or a `setTimeout`/subscription callback instead.
- `npm run build` is the typecheck; there is no separate `typecheck` script.
- The desktop page shell is pre-rendered as a static route; keep browser-only APIs inside effects or event handlers. API routes are server-rendered on demand.
- `cacheComponents` is incompatible with `export const dynamic` / `export const revalidate` route segment configs. Omit them.
- SQLite access uses `node:sqlite`, so API routes must stay on the Node.js runtime (the default).

## Product constraints

- Desktop-first; tablet responsive; mobile is a limited mode.
- Design principle: "Less UI, More Experience." Keep the dark palette, rounded windows, subtle blur, smooth transitions, and consistent components.
- Window controls: red close, yellow minimize, green maximize. Single click selects, double click opens, right click opens a context menu, `ESC` closes dialogs/menus, `Ctrl/Cmd + Space` opens Spotlight.
