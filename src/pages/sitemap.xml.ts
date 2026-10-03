/**
 * /sitemap.xml — every indexable page in every LIVE language, each with its
 * language alternates (`xhtml:link hreflang`), built at deploy time from the
 * same content the pages are built from, so it can't drift from the site.
 *
 * Included: the home page, contact, blog list, Passionate Sea People, every
 * blog post and every landing page. Left out on purpose: the title-only menu
 * placeholder pages (`noindex`, see [locale]/[slug].astro), the 404, the
 * Tina admin, and the API/island routes. `x-default` is the default-language
 * page. A blog post or landing page lists alternates only for the languages
 * that actually have that slug, so no entry ever points at a page that
 * doesn't exist.
 */
import type { APIRoute } from "astro";
import { defaultLocale, liveLocales, localeHref, type Locale } from "../i18n/config";
import { loadBlogPosts, loadLandingPages } from "../lib/content";

interface Entry {
  /** Path after the language prefix, e.g. "blog/" ("" = home). */
  path: string;
  /** Languages this page exists in. */
  locales: Locale[];
  lastmod?: string;
}

const escapeXml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const GET: APIRoute = async ({ site }) => {
  const origin = site ?? new URL("https://eaglerayexpeditions.com");

  // Pages that exist in every live language.
  const entries: Entry[] = ["", "contact/", "blog/", "passionate-sea-people/"].map((path) => ({
    path,
    locales: [...liveLocales],
  }));

  // Blog posts and landing pages exist per language; collect which languages have each slug.
  const bySlug = new Map<string, Entry>();
  const add = (prefix: string, slug: string, locale: Locale, lastmod?: string) => {
    const path = `${prefix}${slug}/`;
    const entry = bySlug.get(path) ?? { path, locales: [], lastmod };
    entry.locales.push(locale);
    if (lastmod && (!entry.lastmod || lastmod > entry.lastmod)) entry.lastmod = lastmod;
    bySlug.set(path, entry);
  };
  for (const locale of liveLocales) {
    const { posts } = await loadBlogPosts(locale);
    for (const post of posts) add("blog/", post._sys.filename, locale, post.date ? String(post.date).slice(0, 10) : undefined);
    const { pages } = await loadLandingPages(locale);
    for (const page of pages) add("landing/", page._sys.filename, locale);
  }
  entries.push(...bySlug.values());

  const urls = entries.flatMap((entry) =>
    entry.locales.map((locale) => {
      const alternates = entry.locales
        .map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${escapeXml(localeHref(l, entry.path, origin))}"/>`)
        .join("\n");
      const xDefault = entry.locales.includes(defaultLocale)
        ? `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(localeHref(defaultLocale, entry.path, origin))}"/>`
        : "";
      const lastmod = entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : "";
      return `  <url>\n    <loc>${escapeXml(localeHref(locale, entry.path, origin))}</loc>${lastmod}\n${alternates}${xDefault}\n  </url>`;
    })
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
