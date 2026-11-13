import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { writeFile } from 'node:fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const plannerDataPath = resolve(__dirname, 'src/data/plannerData.json');

const MAX_BODY_BYTES = 5 * 1024 * 1024;
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);

function collectRequestBody(req) {
  return new Promise((resolveBody, reject) => {
    let body = '';
    let tooLarge = false;
    req.setEncoding('utf8');
    req.on('data', (chunk) => {
      if (tooLarge) return;
      body += chunk;
      if (body.length > MAX_BODY_BYTES) {
        tooLarge = true;
        body = '';
        reject(Object.assign(new Error('Request body too large.'), { statusCode: 413 }));
      }
    });
    req.on('end', () => resolveBody(body));
    req.on('error', reject);
  });
}

function localPlannerDataApi() {
  return {
    name: 'local-planner-data-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/planner-data', async (req, res, next) => {
        if (req.method !== 'POST') return next();

        // Only accept same-origin JSON from the local app. Requiring application/json forces a
        // CORS preflight for cross-site requests, and the Origin / Sec-Fetch-Site checks stop
        // other websites open in the browser from overwriting plannerData.json while `npm run dev` runs.
        const origin = req.headers.origin;
        const fetchSite = req.headers['sec-fetch-site'];
        const contentType = String(req.headers['content-type'] || '');
        let originIsLocal = !origin;
        if (origin) {
          try {
            const url = new URL(origin);
            originIsLocal = LOCAL_HOSTNAMES.has(url.hostname) && url.host === req.headers.host;
          } catch {
            originIsLocal = false;
          }
        }
        if (!originIsLocal || (fetchSite && fetchSite !== 'same-origin') || !contentType.startsWith('application/json')) {
          res.statusCode = 403;
          res.end('Forbidden: planner data can only be saved from the local app.');
          return;
        }

        try {
          const snapshot = JSON.parse(await collectRequestBody(req));

          if (!Array.isArray(snapshot.dataItems) || !Array.isArray(snapshot.totalsData) || !Array.isArray(snapshot.calendarRows)) {
            res.statusCode = 400;
            res.end('Invalid planner data snapshot. Expected dataItems, totalsData, and calendarRows arrays.');
            return;
          }

          await writeFile(plannerDataPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, path: 'src/data/plannerData.json' }));
        } catch (error) {
          server.config.logger.error(error);
          res.statusCode = error?.statusCode || (error instanceof SyntaxError ? 400 : 500);
          if (res.statusCode === 413) res.setHeader('Connection', 'close');
          res.end(error instanceof Error ? error.message : 'Failed to save planner data.');
        }
      });
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), localPlannerDataApi()],
  server: {
    port: 3000,
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
});
