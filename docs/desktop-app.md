# Windows Desktop App

## Architecture Decision

Cruise Decision Engine uses Tauri for the Windows desktop app.

Tauri is the right fit because the existing product is already a React/Vite app with browser-local persistence and hash routing. Tauri can package that same frontend inside a native Windows shell using WebView2, so the calculator logic, theme, routes, localStorage-backed trips, Snapshot, Brief, Compare, Dining Package, and Should I Book flows stay in one codebase.

Electron was considered and rejected for this phase. It would bundle Chromium, increase installer size, and add a heavier desktop runtime without solving a problem the app currently has. There is no backend, native filesystem workflow, or multi-process requirement that justifies that extra weight.

This is not a PWA. The desktop build is a native Tauri application with a Windows window, taskbar presence, app icon, and Windows installer output.

## Build Model

The web and desktop builds intentionally coexist:

- GitHub Pages build: `npm run build`
- Desktop frontend build: `npm run build:desktop`
- Desktop installer build: `npm run tauri:build`

`vite.config.js` keeps the public site on `/Royal/` while the desktop build uses relative assets:

- web mode base: `/Royal/`
- desktop mode base: `./`

The app already uses `HashRouter`, so the same routes work in both targets without server rewrites.

## Native Shell

The native shell lives in `src-tauri/`:

- `tauri.conf.json` configures the app name, version, window defaults, frontend build command, bundle targets, Windows WebView2 bootstrapper mode, and icons.
- `Cargo.toml` declares the Rust/Tauri app package.
- `src/main.rs` and `src/lib.rs` start the Tauri app.
- `capabilities/default.json` keeps permissions narrow, using Tauri core defaults and opener permissions only.
- `icons/` contains the generated Windows icon assets.

## Prerequisites

Windows desktop builds require:

- Node.js and npm
- Rust toolchain from `rustup`
- Microsoft C++ Build Tools with the Desktop development workload
- Microsoft Edge WebView2 runtime

This repository now includes the Tauri npm CLI and API packages. Rust is a machine-level prerequisite, not a repository dependency.

## Release Steps

1. Install prerequisites on the Windows build machine.
2. Run `npm install`.
3. Run `npm run build` to validate the GitHub Pages web build.
4. Run `npm run build:desktop` to validate the relative-asset desktop frontend build.
5. Run `npm run tauri:build` to build the native Windows app and installers.
6. Validate the generated desktop app launches.
7. Smoke test these routes in the desktop app:
   - `#/`
   - `#/snapshot`
   - `#/brief`
   - `#/compare`
   - `#/tools/dining-package`
   - `#/should-i-book`
8. Confirm recent sessions and saved local trip state persist after closing and reopening the desktop app.

## Installer Output

Tauri writes Windows installer artifacts under:

```text
src-tauri/target/release/bundle/
```

Expected Windows outputs:

- NSIS setup executable under `src-tauri/target/release/bundle/nsis/`
- MSI package under `src-tauri/target/release/bundle/msi/`

The exact filenames include the product name and version.

## Validation Notes

The desktop build must not replace or weaken the GitHub Pages deployment. Keep `npm run build` green before every desktop release.

The desktop app relies on the same browser storage model as the web app. Local saved trips and recent sessions remain intentionally local to the installed desktop app profile.
