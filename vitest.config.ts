import { defineConfig } from 'vitest/config';

/**
 * Unit tests only.
 *
 * The repository's other tests are Playwright specs driving a built site
 * (`npm run test:e2e`, `test:a11y`). They share the `.test.ts` suffix and would
 * be collected here, where `page` does not exist — so this narrows collection
 * to the modules under `src/`, which are the ones that can be reasoned about
 * without a browser.
 */
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
