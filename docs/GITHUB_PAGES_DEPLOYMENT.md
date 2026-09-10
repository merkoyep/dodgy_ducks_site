# GitHub Pages deployment

## One-time repository setup

1. Push this app to a GitHub repository.
2. In GitHub, go to **Settings → Pages**.
3. Set **Build and deployment → Source** to **GitHub Actions**.
4. Ensure your default branch is `main`, or edit `.github/workflows/deploy.yml` to match your branch.

## Production passcode setup

Local development is never prompted for a passcode. Production builds are prompted and fail closed unless these GitHub Actions secrets exist.

Important: GitHub Pages is static hosting, so this passcode gate protects against casual access but is not equivalent to server-side authentication. For sensitive data, put the site behind a host-level control such as Cloudflare Access, Netlify/Vercel password protection, or another server-side auth layer.

1. Run:
   ```bash
   npm run auth:hash
   ```
2. In GitHub, go to **Settings → Secrets and variables → Actions → New repository secret**.
3. Add the printed values:
   - `VITE_SITE_PASSCODE_SALT`
   - `VITE_SITE_PASSCODE_HASH`
   - `VITE_SITE_PASSCODE_ITERATIONS`

## Deploy

Every push to `main` runs the GitHub Pages workflow at the repository root (`.github/workflows/deploy.yml`):

1. `npm ci`
2. `npm test`
3. `npm run build`
4. Deploys `dist/` to GitHub Pages

The production build is passcode-gated and read-only because Vite builds with `import.meta.env.DEV === false`.

## Local editing workflow

```bash
npm install
npm run dev
```

1. Open the local Vite URL, usually `http://localhost:3000`.
2. Click **Enable Editing**.
3. Make planner changes in the UI.
4. Click **Save Changes**.
5. Confirm `src/data/plannerData.json` changed.
6. Run tests:
   ```bash
   npm test
   ```
7. Commit the JSON and code changes:
   ```bash
   git add src/data/plannerData.json
   git commit -m "Update planner data"
   git push origin main
   ```

GitHub Pages will then serve the updated data as a static read-only app.

## Manual build preview

```bash
npm run build
npm run preview
```

The preview uses the production build, so it should show the passcode gate and no edit controls.
