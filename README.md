# Marco's Hostile Takeover Scheme 🐉

Dragonboat Team Season Planner - React + Tailwind Edition.

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Data model

The app now uses local JSON instead of live Google Sheets:

- `src/data/plannerData.json` is the committed data snapshot.
- Local development can enter edit mode and save UI changes back to that JSON file.
- Production/GitHub Pages is read-only and only reads the bundled JSON.

See:

- [`docs/APP_CONTEXT.md`](docs/APP_CONTEXT.md)
- [`docs/GITHUB_PAGES_DEPLOYMENT.md`](docs/GITHUB_PAGES_DEPLOYMENT.md)

## Local editing

```bash
npm run dev
```

Then click **Enable Editing**, make changes, and click **Save Changes**. The dev server writes the updated snapshot to `src/data/plannerData.json`. Commit that file before deploying.

To refresh the local JSON once from the original Google Sheet snapshot source:

```bash
npm run data:pull
```

## Tests

```bash
npm test
```

## Build for production

```bash
npm run build
npm run preview
```

Production builds are public and read-only.

## Features

- ✅ Clean React component architecture
- ✅ Tailwind CSS styling
- ✅ Modal overlays that don't break layout
- ✅ Add/remove items from each section in local development
- ✅ Calendar with day-by-day practice editing in local development
- ✅ Responsive design
- ✅ Local JSON data snapshot
- ✅ GitHub Pages deployment workflow
- ✅ Unit tests for calendar, cost calculation, local data processing, and production header behavior

## Project structure

```text
src/
├── components/
├── data/
│   └── plannerData.json
├── test/
│   └── setup.js
├── utils/
│   ├── calendarEvents.js
│   ├── costCalculator.js
│   └── dataFetcher.js
├── App.jsx
├── main.jsx
└── index.css
```
