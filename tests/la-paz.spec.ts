import { test, expect } from "@playwright/test";

/**
 * The La Paz page's wildlife and "Where we go" cards open their photo in a
 * modal. Checks: a card opens the modal with its photo, the close button and
 * Escape close it, and the page is not left scroll-locked.
 */
test.describe("La Paz modal", () => {
  test("clicking a wildlife card opens its photo and closes again", async ({ page }) => {
    await page.goto("/en/la-paz/");
    const card = page.locator('a[href="/assets/img/la-paz/whale-shark.webp"]').first();
    await card.scrollIntoViewIfNeeded();
    await card.click();

    const dialog = page.locator("dialog[open]");
    await expect(dialog).toBeVisible();
    await expect(dialog.locator("img")).toHaveAttribute("src", "/assets/img/la-paz/whale-shark.webp");
    await expect(dialog.getByText("Whale sharks")).toBeVisible();

    await dialog.getByRole("button", { name: "Close" }).click();
    await expect(page.locator("dialog[open]")).toHaveCount(0);
    await expect(page.locator("html")).not.toHaveAttribute("style", /overflow: hidden/);
  });

  test("Escape closes the modal, and a place card opens its photo", async ({ page }) => {
    await page.goto("/en/la-paz/");
    const place = page.locator('a[href="/assets/img/la-paz/balandra.webp"]').first();
    await place.scrollIntoViewIfNeeded();
    await place.click();
    await expect(page.locator("dialog[open]")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("dialog[open]")).toHaveCount(0);
  });

  test("without JavaScript the card is still a link to the photo", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("http://localhost:4321/en/la-paz/");
    await expect(page.locator('a[href="/assets/img/la-paz/manta-ray.webp"]').first()).toHaveAttribute("href", "/assets/img/la-paz/manta-ray.webp");
    await context.close();
  });
});
