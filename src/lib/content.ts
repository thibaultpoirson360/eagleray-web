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
import { defaultLocale, type Locale } from "../i18n/config";
import { roleGroup, type CrewMember } from "./crew";

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
  const all = (result.data.crewConnection?.edges ?? [])
    .map((edge) => edge?.node)
    .filter((node): node is NonNullable<typeof node> => !!node);
  // A member marked "Hide from the website" stays out of every crew list.
  const english = all.filter((n) => n._sys.breadcrumbs[0] === defaultLocale && !n.hidden);
  // Same people, same order, same photos in every language. The English
  // document decides who is on the team and everything that is not text
  // (order, name, photos, numbers); another language only supplies the
  // translated words, and falls back to the English ones where it has none.
  const members = english
    .map((en) => {
      if (locale === defaultLocale) return en;
      const own = all.find((n) => n._sys.breadcrumbs[0] === locale && n._sys.filename === en._sys.filename);
      return own ? alignWithEnglish(own, en) : en;
    })
    .sort((a, b) => {
      const orderA = a.order ?? Number.POSITIVE_INFINITY;
      const orderB = b.order ?? Number.POSITIVE_INFINITY;
      return orderA !== orderB ? orderA - orderB : a.name.localeCompare(b.name);
    });
  return { ...result, members };
}

/** A translated crew document with the structure of the English one (see loadCrew). */
function alignWithEnglish(own: NonNullable<CrewMember>, en: NonNullable<CrewMember>): NonNullable<CrewMember> {
  const text = (mine?: string | null, theirs?: string | null) => (mine && mine.trim() ? mine : theirs);
  const list = <T,>(mine?: T[] | null, theirs?: T[] | null) => (mine && theirs && mine.length === theirs.length ? mine : theirs);
  return {
    ...own,
    name: en.name,
    order: en.order,
    image: en.image,
    images: en.images,
    yearsOfExperience: en.yearsOfExperience,
    roles: list(own.roles, en.roles),
    skills: list(own.skills, en.skills),
    languages: list(own.languages, en.languages),
    certificates: list(own.certificates, en.certificates),
    about: text(own.about, en.about),
    quote: text(own.quote, en.quote),
    history: text(own.history, en.history),
    why: text(own.why, en.why),
    joiningTag: text(own.joiningTag, en.joiningTag),
    imageAlt: text(own.imageAlt, en.imageAlt),
    // The Passionate Sea People page groups people by role using the English
    // roles, whatever the language ("Capitán" would not match "captain").
    roleGroupKey: roleGroup(en.roles),
  } as NonNullable<CrewMember>;
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

export async function loadCrewPage(locale: Locale, options?: RequestOptions) {
  const result = await requestWithMetadata(databaseClient.queries.crewPage({ relativePath: `${locale}.json` }), options);
  if (locale !== defaultLocale) {
    // A language still missing a role heading shows the English one, so the
    // page keeps the same groups as the English page.
    const en = await requestWithMetadata(databaseClient.queries.crewPage({ relativePath: `${defaultLocale}.json` }), options);
    const labels = result.data.crewPage.roleLabels;
    const english = en.data.crewPage.roleLabels;
    if (english) {
      result.data.crewPage.roleLabels = {
        ...english,
        ...Object.fromEntries(Object.entries(labels ?? {}).filter(([, v]) => typeof v === "string" && v.trim())),
      } as typeof english;
    }
  }
  return result;
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

/** The Boats page text (content/boatsPage/<locale>.json). */
export function loadBoatsPage(locale: Locale, options?: RequestOptions) {
  return requestWithMetadata(databaseClient.queries.boatsPage({ relativePath: `${locale}.json` }), options);
}

/** The Sail with Us page text (content/sailWithUsPage/<locale>.json). */
export function loadSailWithUsPage(locale: Locale, options?: RequestOptions) {
  return requestWithMetadata(databaseClient.queries.sailWithUsPage({ relativePath: `${locale}.json` }), options);
}

/** The "Your expedition" homepage section's own text (content/expeditionsSection/<locale>.json). */
export function loadExpeditionsSection(locale: Locale, options?: RequestOptions) {
  return requestWithMetadata(databaseClient.queries.expeditionsSection({ relativePath: `${locale}.json` }), options);
}

/**
 * The Sail with Us page for `locale`, or the English one (links pointed at
 * `locale`) when that language has no document yet. The homepage reads its
 * expedition cards from here.
 */
export async function loadSailWithUsOrEnglish(locale: Locale, options?: RequestOptions) {
  try {
    return await loadSailWithUsPage(locale, options);
  } catch {
    const result = await loadSailWithUsPage("en", options);
    for (const card of result.data.sailWithUsPage.expeditions ?? []) {
      if (card?.href?.startsWith("/en/")) card.href = `/${locale}/${card.href.slice(4)}`;
    }
    return result;
  }
}

/** The Eagle Ray Experience page (content/experiencePage/<locale>.json). */
export function loadExperiencePage(locale: Locale, options?: RequestOptions) {
  return requestWithMetadata(databaseClient.queries.experiencePage({ relativePath: `${locale}.json` }), options);
}

/** The Recalibration Expedition page (content/recalibrationPage/<locale>.json). */
export function loadRecalibrationPage(locale: Locale, options?: RequestOptions) {
  return requestWithMetadata(databaseClient.queries.recalibrationPage({ relativePath: `${locale}.json` }), options);
}

/**
 * The Guest Stories page (content/guestStoriesPage/<locale>.json), or the
 * English one (with its links pointed at `locale`) when that language has no
 * document yet, so the menu link never leads to a missing page.
 */
export async function loadGuestStoriesPage(locale: Locale, options?: RequestOptions) {
  // A missing document does not always throw: the query can come back with no
  // data, so check for the page itself before trusting the result.
  const own = await requestWithMetadata(databaseClient.queries.guestStoriesPage({ relativePath: `${locale}.json` }), options).catch(() => null);
  if (own?.data?.guestStoriesPage) return own;
  const result = await requestWithMetadata(databaseClient.queries.guestStoriesPage({ relativePath: "en.json" }), options);
  const button = result.data.guestStoriesPage.cta?.button;
  if (button?.href?.startsWith("/en/")) button.href = `/${locale}/${button.href.slice(4)}`;
  return result;
}

/** The About Us ("Our story") page (content/aboutPage/<locale>.json). */
export function loadAboutPage(locale: Locale, options?: RequestOptions) {
  return requestWithMetadata(databaseClient.queries.aboutPage({ relativePath: `${locale}.json` }), options);
}

/** Every About Us document, filtered to one locale (same pattern as loadLaPages/loadBlogPosts). */
export async function loadAboutPages(locale: Locale, options?: RequestOptions) {
  const result = await requestWithMetadata(databaseClient.queries.aboutPageConnection(), options);
  const pages = (result.data.aboutPageConnection?.edges ?? [])
    .map((edge) => edge?.node)
    .filter((node): node is NonNullable<typeof node> => !!node && node._sys.breadcrumbs[0] === locale);
  return { ...result, pages };
}
