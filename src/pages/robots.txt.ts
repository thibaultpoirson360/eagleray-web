/**
 * /robots.txt — lets crawlers in, keeps them out of the editor and the API,
 * and points them at the sitemap. Generated (not a static file) so the
 * Sitemap line always uses the site's real address (`site` in
 * astro.config.mjs) instead of a hard-coded one that could go stale.
 */
import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL("https://eaglerayexpeditions.com");
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /api/",
    "Disallow: /tina-island/",
    "",
    `Sitemap: ${new URL("/sitemap.xml", origin).href}`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
