/**
 * Build-time content loaders — one per collection, added as each component
 * is built (only `hero` exists so far). Each wraps the generated database
 * client's query in @tinacms/astro's requestWithMetadata(), which stamps
 * every nested object with the _content_source info tinaField() reads to
 * build data-tina-field markers, and registers the query so the on-demand
 * island route (src/pages/tina-island/[name].ts) can re-run the exact same
 * fetch when the admin asks for a live refresh.
 *
 * Reads through tina/__generated__/databaseClient — NOT tina/__generated__/
 * client.ts, which points at the relative /api/tina/gql URL for client-side
 * fetches from inside the admin iframe, not build-time static rendering.
 */
import databaseClient from "../../tina/__generated__/databaseClient.js";
import { requestWithMetadata, type RequestOptions } from "@tinacms/astro/data";
import type { Locale } from "../i18n/config";

/**
 * Page chrome, not a homepage section — fetched once from BaseLayout so
 * every page gets Nav regardless of which sections that page uses. One
 * document per locale (content/navigation/<locale>.json).
 */
export function loadNavigation(locale: Locale, options?: RequestOptions) {
  return requestWithMetadata(databaseClient.queries.navigation({ relativePath: `${locale}.json` }), options);
}

export function loadFooter(locale: Locale, options?: RequestOptions) {
  return requestWithMetadata(databaseClient.queries.footer({ relativePath: `${locale}.json` }), options);
}

/**
 * Not localized (brand facts don't vary by language — see the collection's
 * own comment). Footer.astro reads contact.whatsapp/email/instagram from
 * this for its real hrefs, replacing main.js's initContact() — see
 * tina/collections/footer.ts for why.
 */
export function loadSiteSettings(options?: RequestOptions) {
  return requestWithMetadata(databaseClient.queries.siteSettings({ relativePath: "index.json" }), options);
}

export function loadHero(locale: Locale, options?: RequestOptions) {
  return requestWithMetadata(
    databaseClient.queries.hero({ relativePath: `${locale}.json` }),
    options
  );
}

export function loadDifference(locale: Locale, options?: RequestOptions) {
  return requestWithMetadata(
    databaseClient.queries.difference({ relativePath: `${locale}.json` }),
    options
  );
}

export function loadCrewSection(locale: Locale, options?: RequestOptions) {
  return requestWithMetadata(
    databaseClient.queries.crewSection({ relativePath: `${locale}.json` }),
    options
  );
}

/**
 * `crew` is a real multi-document collection (content/crew/<locale>/<slug>.json),
 * so unlike the single-doc sections above this queries the *Connection list
 * query and does the locale filter + sort in JS: Tina's auto-generated
 * connection filters are keyed on field values, not on the folder-derived
 * locale breadcrumb, and "sorts by order, then by name" (the schema's own
 * field description) isn't something the generated `sort` param expresses
 * either. `members` is added alongside the usual requestWithMetadata()
 * result so the island route's propsFromData can reuse the same shape.
 */
export function loadWildlife(locale: Locale, options?: RequestOptions) {
  return requestWithMetadata(
    databaseClient.queries.wildlife({ relativePath: `${locale}.json` }),
    options
  );
}

export async function loadCrew(locale: Locale, options?: RequestOptions) {
  const result = await requestWithMetadata(databaseClient.queries.crewConnection(), options);
  const members = (result.data.crewConnection?.edges ?? [])
    .map((edge) => edge?.node)
    .filter((node): node is NonNullable<typeof node> => !!node && node._sys.breadcrumbs[0] === locale)
    .sort((a, b) => {
      const orderA = a.order ?? Number.POSITIVE_INFINITY;
      const orderB = b.order ?? Number.POSITIVE_INFINITY;
      return orderA !== orderB ? orderA - orderB : a.name.localeCompare(b.name);
    });
  return { ...result, members };
}

export function loadBoatsSection(locale: Locale, options?: RequestOptions) {
  return requestWithMetadata(
    databaseClient.queries.boatsSection({ relativePath: `${locale}.json` }),
    options
  );
}

/** Same shape as loadCrew — see its comment for why the filter/sort is done in JS. */
export async function loadBoats(locale: Locale, options?: RequestOptions) {
  const result = await requestWithMetadata(databaseClient.queries.boatsConnection(), options);
  const boats = (result.data.boatsConnection?.edges ?? [])
    .map((edge) => edge?.node)
    .filter((node): node is NonNullable<typeof node> => !!node && node._sys.breadcrumbs[0] === locale)
    .sort((a, b) => {
      const orderA = a.order ?? Number.POSITIVE_INFINITY;
      const orderB = b.order ?? Number.POSITIVE_INFINITY;
      return orderA !== orderB ? orderA - orderB : a.name.localeCompare(b.name);
    });
  return { ...result, boats };
}

export function loadFunnel(locale: Locale, options?: RequestOptions) {
  return requestWithMetadata(
    databaseClient.queries.funnel({ relativePath: `${locale}.json` }),
    options
  );
}

export function loadCrewPage(locale: Locale, options?: RequestOptions) {
  return requestWithMetadata(
    databaseClient.queries.crewPage({ relativePath: `${locale}.json` }),
    options
  );
}

/** Every placeholder nav page in a locale — same shape as loadBlogPosts (see loadCrew for why the filter is in JS). */
export async function loadNavPages(locale: Locale, options?: RequestOptions) {
  const result = await requestWithMetadata(databaseClient.queries.navPagesConnection(), options);
  const pages = (result.data.navPagesConnection?.edges ?? [])
    .map((edge) => edge?.node)
    .filter((node): node is NonNullable<typeof node> => !!node && node._sys.breadcrumbs[0] === locale);
  return { ...result, pages };
}

export function loadNavPage(locale: Locale, slug: string, options?: RequestOptions) {
  return requestWithMetadata(
    databaseClient.queries.navPages({ relativePath: `${locale}/${slug}.json` }),
    options
  );
}

/** The 404 page — a single document, not per locale (see tina/collections/notFoundPage.ts). */
export function loadNotFoundPage(options?: RequestOptions) {
  return requestWithMetadata(databaseClient.queries.notFoundPage({ relativePath: "index.json" }), options);
}

export function loadContactPage(locale: Locale, options?: RequestOptions) {
  return requestWithMetadata(
    databaseClient.queries.contactPage({ relativePath: `${locale}.json` }),
    options
  );
}

export function loadBlogSection(locale: Locale, options?: RequestOptions) {
  return requestWithMetadata(
    databaseClient.queries.blogSection({ relativePath: `${locale}.json` }),
    options
  );
}

/** Same shape as loadCrew/loadBoats — see loadCrew's comment for why the
 *  filter/sort is done in JS. Newest first, matching a blog's natural order
 *  (no manual `order` field needed the way crew/boats have one). */
export async function loadBlogPosts(locale: Locale, options?: RequestOptions) {
  const result = await requestWithMetadata(databaseClient.queries.blogPostConnection(), options);
  const posts = (result.data.blogPostConnection?.edges ?? [])
    .map((edge) => edge?.node)
    .filter((node): node is NonNullable<typeof node> => !!node && node._sys.breadcrumbs[0] === locale)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return { ...result, posts };
}

/** The mockup always shows whichever post is first in an unordered array as
 *  "featured" — no real editorial control. Here an editor can mark one via
 *  `featured`; this falls back to the newest post (posts[0], already
 *  sorted) if none is marked, or several are. */
export function featuredPost<T extends { featured?: boolean | null }>(posts: T[]): T {
  return posts.find((p) => p.featured) ?? posts[0];
}

export function loadBlogPost(locale: Locale, slug: string, options?: RequestOptions) {
  return requestWithMetadata(
    databaseClient.queries.blogPost({ relativePath: `${locale}/${slug}.json` }),
    options
  );
}

/** Same shape as loadCrew/loadBoats/loadBlogPosts — see loadCrew's comment
 *  for why the locale filter is done in JS, not in the generated query. */
export async function loadLandingPages(locale: Locale, options?: RequestOptions) {
  const result = await requestWithMetadata(databaseClient.queries.landingPageConnection(), options);
  const pages = (result.data.landingPageConnection?.edges ?? [])
    .map((edge) => edge?.node)
    .filter((node): node is NonNullable<typeof node> => !!node && node._sys.breadcrumbs[0] === locale);
  return { ...result, pages };
}

export function loadLandingPage(locale: Locale, slug: string, options?: RequestOptions) {
  return requestWithMetadata(
    databaseClient.queries.landingPage({ relativePath: `${locale}/${slug}.json` }),
    options
  );
}

/** The La Paz page (content/laPage/<locale>.json). */
export function loadLaPage(locale: Locale, options?: RequestOptions) {
  return requestWithMetadata(databaseClient.queries.laPage({ relativePath: `${locale}.json` }), options);
}

/** The About Us ("Our story") page (content/aboutPage/<locale>.json). */
export function loadAboutPage(locale: Locale, options?: RequestOptions) {
  return requestWithMetadata(databaseClient.queries.aboutPage({ relativePath: `${locale}.json` }), options);
}
