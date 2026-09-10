# Legacy Google Sheets CalendarEvents setup

This app no longer requires a `CalendarEvents` sheet or Apps Script deployment.

Calendar data is now handled this way:

- Generated holidays, fees, regattas, and practices are derived by `src/utils/calendarEvents.js`.
- Manual additions/removals are stored in `src/data/plannerData.json` under `calendarRows`.
- Local development saves UI edits to that JSON file through the Vite-only `/api/planner-data` endpoint.
- GitHub Pages production builds are read-only.

Use the current docs instead:

- `docs/APP_CONTEXT.md`
- `docs/GITHUB_PAGES_DEPLOYMENT.md`
