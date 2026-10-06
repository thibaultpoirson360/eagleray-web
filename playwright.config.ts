import { defineConfig, devices } from "@playwright/test";

/**
 * Scoped to local, manual verification against `npm run tina:dev` — NOT
 * wired into CI or a `test` npm script yet. Two servers must already be
 * running (Tina's datalayer needs its own process; see docs/tina-setup.md
 * section 9):
 *   TINA_PUBLIC_IS_LOCAL=true npx tinacms dev   # datalayer :9000, admin :4001
 *   TINA_PUBLIC_IS_LOCAL=true npx astro dev --port 4321
 * Then: npx playwright test
 *
 * webServer is deliberately NOT configured to auto-start these — Tina's own
 * dev tooling (not Playwright) owns that process pair, and getting the
 * startup order/health-check right for two coupled dev servers is more
 * fragile than just documenting the two commands above.
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  fullyParallel: false,
  use: {
    baseURL: "http://localhost:4321",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "mobile-safari", use: { ...devices["iPhone 14"] } },
  ],
});
