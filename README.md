# Royal

Royal is a responsive React + Vite single-page app for Royal Caribbean trip planning. Version 1 includes two pricing tools, a packing list generator, and a browser-saved trip planner.

## Run locally

1. Install dependencies with `npm install`
2. Start the dev server with `npm run dev`
3. Build for production with `npm run build`
4. Preview the production build with `npm run preview`

## Deploy to GitHub Pages

This project is configured for a GitHub repository named `Royal`.

- Vite uses `base: '/Royal/'` so asset URLs resolve correctly on GitHub Pages.
- Routing uses `HashRouter`, so page refreshes and deep links work without custom server rewrites.
- Deployment uses GitHub Actions to build the app and publish `dist` to GitHub Pages from the `main` branch.
- Expected live URL: `https://tjhiggy.github.io/Royal/`

### One-time setup

1. Create or confirm the GitHub repository is named `Royal`
2. Install dependencies with `npm install`
3. Commit your changes to the `main` branch
4. Push `main` to GitHub
5. In GitHub, open `Settings` for the repository
6. Go to `Pages`
7. Set the source to `GitHub Actions`
8. Save if GitHub asks you to confirm the source

### Deploy

1. Push a commit to `main`
2. GitHub Actions will run `.github/workflows/deploy.yml`
3. Wait for the Pages deployment to finish in the `Actions` tab
4. Open `https://tjhiggy.github.io/Royal/`

If you update the site later, just push to `main` again. Nice and boring, which is exactly how deployment should behave.

## Project structure

- `src/App.jsx`: Router setup for the site routes
- `src/components/`: Shared layout and reusable UI pieces
- `src/pages/`: Route-level pages
- `src/data/`: Static content and defaults
- `src/utils/`: Calculation and storage helpers
- `src/styles.css`: Global styles and responsive layout rules

## Notes

- Routing uses `HashRouter` so the app can deploy cleanly to GitHub Pages without extra server config.
- The production asset base path is set for the `Royal` repository.
- GitHub Pages deployment is handled by GitHub Actions with Node 22.
- Planner data is stored in `localStorage` under the `royal-planner-v1` key.
- Calculation logic lives in utility files to keep page components easier to follow.
- Future tools and guides can slot into `src/pages/`, `src/data/`, and `src/utils/` without rebuilding the whole app like a maniac.
