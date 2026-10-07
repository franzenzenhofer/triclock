import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    // Node's own Web Storage (localStorage) needs a backing file.
    poolOptions: {
      forks: { execArgv: ['--localstorage-file=node_modules/.vitest-localstorage.json'] },
    },
  },
});
