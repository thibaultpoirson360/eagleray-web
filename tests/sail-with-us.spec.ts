import { test, expect } from "@playwright/test";

/**
 * "Sail with Us" shows the same trip-planning funnel as the homepage. Checks
 * that it hydrates in the browser and moves from step 1 to step 2.
 */
test("the funnel hydrates and moves to step 2", async ({ page }) => {
  await page.goto("/en/sail-with-us/");
  const form = page.locator("[data-funnel]").first();
  await expect(form).toBeVisible();
  await page.waitForFunction(() => document.querySelector("astro-island[component-url*='FunnelForm']")?.hasAttribute("ssr") === false, null, { timeout: 15_000 });
  await expect(page.getByText(/STEP 1 OF 4|STEP 1 OF 4|1 OF 4/i).first()).toBeVisible();
  await page.getByRole("button", { name: /continue/i }).first().click();
  await expect(page.getByText(/2 OF 4/i).first()).toBeVisible();
});
