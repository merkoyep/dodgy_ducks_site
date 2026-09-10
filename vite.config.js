import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { writeFile } from 'node:fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const plannerDataPath = resolve(__dirname, 'src/data/plannerData.json');

function collectRequestBody(req) {
  return new Promise((resolveBody, reject) => {
    let body = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => {
      body += chunk;
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
          res.statusCode = 500;
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
