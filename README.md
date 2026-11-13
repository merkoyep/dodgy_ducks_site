# Dodgy Ducks 🦆 — Dragon Boat Season Planner

Season planner and public site for the Dodgy Ducks, a recreational dragon boat team in Toronto. React + Tailwind.

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

## Branding

Logos live in `src/assets/brand/`, resized for the web from the team asset folder (`~/Documents/Dodgy Ducks`). The artwork itself is unedited:

- `dodgy-ducks-badge.webp` — round badge, 512×512 (header, constitution)
- `dodgy-ducks-icon.png` — round badge cropped to the circle with a transparent background, 192×192 (favicon)
- `dodgy-ducks-apple-touch.png` — round badge on brand navy, 180×180 (iOS home-screen icon; iOS fills transparency with black)
- `dodgy-ducks-logo.webp` — full-colour rectangular logo, 1600×800 (home, team name page)
- `dodgy-ducks-wordmark-pattern.png` — transparent wordmark, 840×420 (faint background pattern)

To regenerate from new source files, resize the originals to these dimensions (WebP quality ~88).

Theme colours are defined in `tailwind.config.js` (`primary` duck blue, `secondary` navy, `accent` duck yellow, `splash`, `ink`). Big headings use the `font-display` family (Permanent Marker, loaded from Google Fonts in `index.html`); body text uses the system font stack.

## Project structure

```text
src/
├── assets/
│   └── brand/
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
