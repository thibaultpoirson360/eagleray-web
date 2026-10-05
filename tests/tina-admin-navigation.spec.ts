import { test, expect } from "@playwright/test";

/**
 * Regression test for the admin-sidebar-navigation bug: clicking a document
 * in the Tina admin (Site Navigation, Site Footer, a crew member) would
 * sometimes open the WRONG collection's edit form, because several
 * documents' `router()` all computed the exact same preview URL
 * (`/<locale>/`, or `/<locale>/#crew` for every crew member alike) —
 * TinaCMS's admin identifies "which document is open" by that URL, polled
 * back from the live-preview iframe every 100ms, so identical URLs across
 * documents are genuinely ambiguous to it, not just visually confusing.
 * Fixed in tina/collections/{navigation,footer,crew,boats}.ts by giving
 * each of those documents its own distinct URL.
 *
 * Chromium-only: local-mode Tina's "Enter Edit Mode" flow and admin bundle
 * were only exercised here on Chromium; running this on the `webkit` /
 * `mobile-safari` projects too is possible but not done yet.
 */
test.use({ browserName: "chromium" });

async function enterLocalEditMode(page: import("@playwright/test").Page) {
  await page.goto("/admin/index.html");
  // Local-mode's one-time "changes save to the local filesystem" dialog —
  // click it if present, but don't fail the test when a later run of the
  // same suite has already dismissed it (Tina remembers via localStorage).
  await page
    .getByRole("button", { name: "Enter Edit Mode" })
    .click({ timeout: 5_000 })
    .catch(() => {});
  await expect(page.locator("iframe").first()).toBeVisible({ timeout: 15_000 });
}

/** Rows in Tina's file browser are one <a> whose accessible name concatenates
 *  the title and the file path shown under it — never an exact match, so
 *  every row link is found by a unique substring instead. */
function fileRow(page: import("@playwright/test").Page, pathSubstring: string) {
  return page.locator("a").filter({ hasText: pathSubstring });
}

test("clicking Site Navigation opens the navigation form, not another collection's", async ({ page }) => {
  await enterLocalEditMode(page);
  await page.goto("/admin/index.html#/collections/navigation/~");
  await fileRow(page, "content/navigation/en.json").click();
  await expect(page.getByRole("heading", { name: "Site Navigation" })).toBeVisible();
  await expect(page.getByText('"Go Sailing" button')).toBeVisible();
});

test("clicking Site Footer opens the footer form", async ({ page }) => {
  await enterLocalEditMode(page);
  await page.goto("/admin/index.html#/collections/footer/~");
  await fileRow(page, "content/footer/en.json").click();
  await expect(page.getByRole("heading", { name: "Site Footer" })).toBeVisible();
  await expect(page.getByText("Claim", { exact: true })).toBeVisible();
});

test("clicking a specific crew member opens THAT member's form, not a different one", async ({ page }) => {
  await enterLocalEditMode(page);
  await page.goto("/admin/index.html#/collections/crew/~/en");
  await fileRow(page, "content/crew/en/adly.json").click();
  // The right document: its own name field, not "Thibault" or another member's.
  await expect(page.getByLabel("Name")).toHaveValue("Mohamed “Adly”");
  await expect(page.locator("iframe").first()).toHaveAttribute("src", /passionate-sea-people\/#adly/);
});
