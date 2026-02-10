import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf-8')) as { version: string };

export default defineConfig({
  root: '.',
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
  },
});
