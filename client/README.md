# FlyTrainer (FlyTrainerApp)

Flight School Management System built with **Angular 21** and an optional **Electron** desktop wrapper.

## What’s in this repo

- **Angular SPA** (PrimeNG + PrimeIcons, FontAwesome, LESS)
- **Electron shell** (`electron_main.js`) for running the built app as a desktop app
- **Dev proxy** for API calls (`src/proxy.conf.js` + `src/environments/proxy-config.json`)
- Utilities like **XLSX** import/export (`xlsx`)

Key feature areas are implemented as lazy-loaded Angular modules:

- `admin` (role-protected)
- `dashboard`
- `schedule`
- `instructors`
- `aircrafts`
- `billing`
- `reports`

Routing is defined in `src/app/app.module.ts`.

---

## Prerequisites

- **Node.js**: 20.x or newer recommended (matches `@types/node` 20.x)
- **npm** (or pnpm/yarn if you prefer, but npm is assumed in scripts)
- Optional for local Angular dev: `@angular/cli` (installed via devDependencies, so `npx ng …` works)

---

## Install

```bash
npm install
```

---

## Run (Web / Angular dev server)

```bash
npm start
```

This runs:

- `ng serve --open --proxy-config src/proxy.conf.js`

### How API calls are handled in dev

- `src/proxy.conf.js` merges:
  - `src/environments/proxy-config.json` (explicit proxy routes)
  - a catch-all `"**"` rule that proxies to `endpoint` from `src/environments/environment.json`
- Browser navigation requests that accept HTML are bypassed back to `/index.html` so Angular routing works.

If your backend API isn’t at `http://localhost:8080`, update it here:

- `src/environments/environment.json` → `"endpoint"`

---

## Build (Web)

```bash
npm run build
```

Production build:

```bash
npm run build:prod
```

Build output goes to `dist/` per `angular.json`.

---

## Run (Electron)

### Build Angular for Electron and launch locally

```bash
npm run electron:local
```

What it does:

1. Builds Angular with the `electron` configuration:
   - `ng build -c electron --base-href ./index.html`
2. Launches Electron using `electron_main.js`.

### Package a Windows installer (NSIS)

```bash
npm run electron:build
```

Electron Builder settings live in `package.json` under `"build"`.

Output directory (note the current spelling):

- `../electorn-release`

---

## Configuration

### Environment flags (Angular)

Angular uses a shared base config:

- `src/environments/base-environment.ts` loads JSON config and merges flags:
  - `production: false/true`
  - `native: false/true` (Electron build sets `native: true`)

Environment files:

- `src/environments/environment.ts` (default)
- `src/environments/environment.prod.ts` (production)
- `src/environments/environment.electron.ts` (Electron build)

### Runtime JSON config

- `src/environments/environment.json`
  - `endpoint` (API base)
  - `timezone`, `homeAirport`, links, feature flags, etc.
- `src/environments/proxy-config.json`
  - additional proxy routes (e.g., aviationweather.gov, worldtimeapi.org)

> Tip: If you need per-developer overrides, consider introducing an `environment.local.json` that is gitignored and loaded instead of committing local endpoints.

---

## Useful scripts

| Command | What it does |
|---|---|
| `npm start` | Angular dev server + proxy |
| `npm run build` | Standard Angular build |
| `npm run build:prod` | Production Angular build |
| `npm run build:electron` | Electron-targeted Angular build |
| `npm run electron:local` | Build for Electron + launch |
| `npm run electron:build` | Build for Electron + package |
| `npm run cleancss` | Runs `grunt purifycss` |
| `npm run lint` | Runs the configured Angular lint target |

---

## Notes from a quick code review (high-impact items)

### Electron security hardening (recommended)
`electron_main.js` currently sets:

- `webPreferences: { nodeIntegration: true }`

For a production desktop app, it’s safer to use:

- `nodeIntegration: false`
- `contextIsolation: true`
- a **preload script** exposing only what you need (via `contextBridge`)
- Electron’s `setWindowOpenHandler` instead of the deprecated `new-window` event

If you rely on Node APIs in the renderer today, migrating to a preload-based approach is worth doing early.

### Lint configuration mismatch
`angular.json` uses the old TSLint builder (`@angular-devkit/build-angular:tslint`), while `package.json` includes Angular ESLint packages. Consider switching the project lint target to Angular ESLint and removing TSLint configuration if it’s no longer used.

### Minor packaging typo
Electron Builder output directory is set to:

- `../electorn-release`

If that’s unintentional, rename to `../electron-release`.

---

## Project structure

```text
src/
  app/                 Angular feature modules (admin, schedule, reports, …)
  assets/              Static assets + LESS entrypoints
  environments/        TS environment files + JSON runtime config
  modules/data/        Packaged data assets included in build
electron_main.js       Electron main process entrypoint
```

---

## Troubleshooting

- **API calls failing in dev:** confirm `src/environments/environment.json -> endpoint` and that the backend is reachable.
- **CORS issues:** use the provided dev proxy instead of calling the API directly.
- **Electron XHR routing:** Electron intercepts `file://` XHR requests and redirects them to either a configured proxy target or `env.endpoint`.

---

## License

Add a license statement here (MIT, proprietary, etc.).
