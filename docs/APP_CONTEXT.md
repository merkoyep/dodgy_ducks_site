# App context

## Goal

The planner is now a static, GitHub Pages-friendly React app. Production reads from a committed local JSON snapshot and does not write to any external service.

## Data source

- Canonical production data: `src/data/plannerData.json`
- The JSON contains:
  - `dataItems`: planner rows for regattas, practices, travel, jerseys, and season-plan inclusion flags
  - `totalsData`: season-plan labels and legacy summary fields used for display metadata
  - `calendarRows`: only manual calendar overrides (`manual` and `removed` rows); generated calendar rows are derived in code

Generated calendar events remain in `src/utils/calendarEvents.js`, so the committed JSON only stores the data that needs to be edited or preserved.

To refresh the JSON once from the original sheet, run `npm run data:pull`. Ongoing edits should normally happen through local edit mode so they are saved directly to `src/data/plannerData.json`.

## Runtime modes

### Local development (`npm run dev`)

- Edit mode is enabled.
- UI changes are kept in React state until you click **Save Changes**.
- Saving posts the full data snapshot to the Vite-only endpoint `/api/planner-data`.
- The Vite dev middleware writes the snapshot back to `src/data/plannerData.json`.
- After saving, commit `src/data/plannerData.json` so the next deployment includes the changes.

### Production / GitHub Pages (`npm run build`)

- `import.meta.env.DEV` is false, so the header shows **Read-only**.
- Edit controls are not rendered.
- The local save endpoint does not exist in the static build.
- The app only reads bundled JSON data.

## Important files

- `src/App.jsx` - app state, edit-mode gating, save flow
- `src/data/plannerData.json` - committed planner data snapshot
- `src/utils/dataFetcher.js` - local JSON loader, option processing, snapshot builder, dev-save client
- `src/utils/calendarEvents.js` - generated calendar logic
- `src/utils/costCalculator.js` - dynamic practice and team-cost calculations
- `vite.config.js` - GitHub Pages relative base plus local dev JSON save API
- `.github/workflows/deploy.yml` - tests, builds, and deploys to GitHub Pages
