import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleApiNode } from './server/api.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function localApi() {
  return {
    name: 'dsavation-local-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next();
        return handleApiNode(req, res).catch(next);
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
  return {
    root: path.resolve(__dirname, 'client'),
    publicDir: path.resolve(__dirname, 'client/public'),
    build: {
      outDir: path.resolve(__dirname, 'dist'),
      emptyOutDir: true,
    },
    plugins: [react(), localApi()],
  };
});
