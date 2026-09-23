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
 * every page gets Nav regardless of which sections that page uses.
 */
export function loadNavigation(options?: RequestOptions) {
  return requestWithMetadata(databaseClient.queries.navigation({ relativePath: "index.json" }), options);
}

export function loadFooter(options?: RequestOptions) {
  return requestWithMetadata(databaseClient.queries.footer({ relativePath: "index.json" }), options);
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
