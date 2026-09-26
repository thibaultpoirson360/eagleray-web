/**
 * On-demand island-refresh endpoint for TinaCMS visual editing. The
 * bridge script (loaded only inside the admin's preview iframe — see
 * @tinacms/astro/TinaIsland.astro) POSTs here whenever the editor changes
 * a field, to re-render just that island with the live draft data.
 *
 * `prerender = false` is required: this must run per-request (it reads
 * the editor's in-progress overlay), not be baked into the static build.
 * One entry per collection whose component has visual editing wired;
 * add to `islands` as each later component gets its own <TinaIsland>.
 *
 * Uses lib/tina-island-route's `createIslandRoute`, not
 * @tinacms/astro/experimental's `experimental_createIslandRoute` — see
 * that file's header comment for why (the library's version can't render
 * an island that hydrates a Preact child, which is Crew/Boats/Funnel).
 */
export const prerender = false;

import { createIslandRoute } from "../../lib/tina-island-route";
import Hero from "../../components/Hero.astro";
import Difference from "../../components/Difference.astro";
import Crew from "../../components/Crew.astro";
import CrewPage from "../../components/CrewPage.astro";
import NavPageView from "../../components/NavPageView.astro";
import NotFoundView from "../../components/NotFoundView.astro";
import Wildlife from "../../components/Wildlife.astro";
import Boats from "../../components/Boats.astro";
import Nav from "../../components/Nav.astro";
import Footer from "../../components/Footer.astro";
import Funnel from "../../components/Funnel.astro";
import ContactPage from "../../components/ContactPage.astro";
import BlogListing from "../../components/BlogListing.astro";
import BlogPostView from "../../components/BlogPostView.astro";
import LandingPageView from "../../components/LandingPageView.astro";
import {
  loadHero,
  loadDifference,
  loadCrewSection,
  loadCrew,
  loadCrewPage,
  loadNavPage,
  loadNotFoundPage,
  loadWildlife,
  loadBoatsSection,
  loadBoats,
  loadNavigation,
  loadFooter,
  loadSiteSettings,
  loadFunnel,
  loadContactPage,
  loadBlogSection,
  loadBlogPosts,
  loadBlogPost,
  loadLandingPage,
} from "../../lib/content";
import { defaultLocale, isLocale, type Locale } from "../../i18n/config";

function localeFromParams(params: URLSearchParams): Locale {
  const raw = params.get("locale");
  return isLocale(raw) ? raw : defaultLocale;
}

const route = createIslandRoute({
  hero: {
    fetch: async (_request: Request, params: URLSearchParams) =>
      loadHero(localeFromParams(params), { priority: "primary" }),
    component: Hero,
    wrapper: { tag: "div" },
    propsFromData: (result: unknown) => ({
      hero: (result as Awaited<ReturnType<typeof loadHero>>).data.hero,
    }),
  },
  difference: {
    fetch: async (_request: Request, params: URLSearchParams) => loadDifference(localeFromParams(params)),
    component: Difference,
    wrapper: { tag: "div" },
    propsFromData: (result: unknown) => ({
      difference: (result as Awaited<ReturnType<typeof loadDifference>>).data.difference,
    }),
  },
  crew: {
    fetch: async (_request: Request, params: URLSearchParams) => {
      const locale = localeFromParams(params);
      const [section, crew] = await Promise.all([loadCrewSection(locale), loadCrew(locale)]);
      return { section, crew };
    },
    component: Crew,
    wrapper: { tag: "div" },
    propsFromData: (result: unknown, params: URLSearchParams) => {
      const { section, crew } = result as {
        section: Awaited<ReturnType<typeof loadCrewSection>>;
        crew: Awaited<ReturnType<typeof loadCrew>>;
      };
      return { crewSection: section.data.crewSection, members: crew.members, locale: localeFromParams(params) };
    },
  },
  // The Passionate Sea People page: its own copy plus the same crew records
  // and labels the home slider uses.
  crewPage: {
    fetch: async (_request: Request, params: URLSearchParams) => {
      const locale = localeFromParams(params);
      const [page, section, crew] = await Promise.all([loadCrewPage(locale), loadCrewSection(locale), loadCrew(locale)]);
      return { page, section, crew };
    },
    component: CrewPage,
    wrapper: { tag: "div" },
    propsFromData: (result: unknown) => {
      const { page, section, crew } = result as {
        page: Awaited<ReturnType<typeof loadCrewPage>>;
        section: Awaited<ReturnType<typeof loadCrewSection>>;
        crew: Awaited<ReturnType<typeof loadCrew>>;
      };
      return { crewPage: page.data.crewPage, crewSection: section.data.crewSection, members: crew.members };
    },
  },
  wildlife: {
    fetch: async (_request: Request, params: URLSearchParams) => loadWildlife(localeFromParams(params)),
    component: Wildlife,
    wrapper: { tag: "div" },
    propsFromData: (result: unknown) => ({
      wildlife: (result as Awaited<ReturnType<typeof loadWildlife>>).data.wildlife,
    }),
  },
  boats: {
    fetch: async (_request: Request, params: URLSearchParams) => {
      const locale = localeFromParams(params);
      const [section, boats] = await Promise.all([loadBoatsSection(locale), loadBoats(locale)]);
      return { section, boats };
    },
    component: Boats,
    wrapper: { tag: "div" },
    propsFromData: (result: unknown) => {
      const { section, boats } = result as {
        section: Awaited<ReturnType<typeof loadBoatsSection>>;
        boats: Awaited<ReturnType<typeof loadBoats>>;
      };
      return { boatsSection: section.data.boatsSection, boats: boats.boats };
    },
  },
  navigation: {
    fetch: async (_request: Request, params: URLSearchParams) => loadNavigation(localeFromParams(params)),
    component: Nav,
    wrapper: { tag: "div" },
    // Nav also renders the language switcher and the transparent/solid nav
    // state, both of which need to know which page it's on — same
    // path/transparentNav params BaseLayout passes it normally (locale
    // is also what picks the navigation document).
    propsFromData: (result: unknown, params: URLSearchParams) => ({
      navigation: (result as Awaited<ReturnType<typeof loadNavigation>>).data.navigation,
      locale: localeFromParams(params),
      path: params.get("path") ?? "",
      transparentNav: params.get("transparentNav") !== "false",
    }),
  },
  footer: {
    fetch: async (_request: Request, params: URLSearchParams) => {
      const [footer, siteSettings] = await Promise.all([loadFooter(localeFromParams(params)), loadSiteSettings()]);
      return { footer, siteSettings };
    },
    component: Footer,
    wrapper: { tag: "div" },
    propsFromData: (result: unknown) => {
      const { footer, siteSettings } = result as {
        footer: Awaited<ReturnType<typeof loadFooter>>;
        siteSettings: Awaited<ReturnType<typeof loadSiteSettings>>;
      };
      return { footer: footer.data.footer, siteSettings: siteSettings.data.siteSettings };
    },
  },
  funnel: {
    fetch: async (_request: Request, params: URLSearchParams) => {
      const locale = localeFromParams(params);
      const [funnel, siteSettings] = await Promise.all([loadFunnel(locale), loadSiteSettings()]);
      return { funnel, siteSettings };
    },
    component: Funnel,
    wrapper: { tag: "div" },
    propsFromData: (result: unknown) => {
      const { funnel, siteSettings } = result as {
        funnel: Awaited<ReturnType<typeof loadFunnel>>;
        siteSettings: Awaited<ReturnType<typeof loadSiteSettings>>;
      };
      return { funnel: funnel.data.funnel, siteSettings: siteSettings.data.siteSettings };
    },
  },
  contactPage: {
    fetch: async (_request: Request, params: URLSearchParams) => {
      const locale = localeFromParams(params);
      const [contactPage, siteSettings] = await Promise.all([loadContactPage(locale), loadSiteSettings()]);
      return { contactPage, siteSettings };
    },
    component: ContactPage,
    wrapper: { tag: "div" },
    propsFromData: (result: unknown, params: URLSearchParams) => {
      const { contactPage, siteSettings } = result as {
        contactPage: Awaited<ReturnType<typeof loadContactPage>>;
        siteSettings: Awaited<ReturnType<typeof loadSiteSettings>>;
      };
      return {
        contactPage: contactPage.data.contactPage,
        siteSettings: siteSettings.data.siteSettings,
        locale: localeFromParams(params),
      };
    },
  },
  blogSection: {
    fetch: async (_request: Request, params: URLSearchParams) => {
      const locale = localeFromParams(params);
      const [blogSection, posts] = await Promise.all([loadBlogSection(locale), loadBlogPosts(locale)]);
      return { blogSection, posts };
    },
    component: BlogListing,
    wrapper: { tag: "div" },
    propsFromData: (result: unknown, params: URLSearchParams) => {
      const { blogSection, posts } = result as {
        blogSection: Awaited<ReturnType<typeof loadBlogSection>>;
        posts: Awaited<ReturnType<typeof loadBlogPosts>>;
      };
      return { blogSection: blogSection.data.blogSection, posts: posts.posts, locale: localeFromParams(params) };
    },
  },
  // Individual posts are separate pages (unlike every other island, which
  // is one section on a shared page) — the on-demand refresh route still
  // keys by a fixed island name, so which specific post to load comes from
  // a `slug` param, same idea as navigation's locale/path params.
  blogPost: {
    fetch: async (_request: Request, params: URLSearchParams) => {
      const locale = localeFromParams(params);
      const slug = params.get("slug") ?? "";
      const [post, allPosts, blogSection] = await Promise.all([
        loadBlogPost(locale, slug),
        loadBlogPosts(locale),
        loadBlogSection(locale),
      ]);
      return { post, allPosts, blogSection, slug };
    },
    component: BlogPostView,
    wrapper: { tag: "div" },
    propsFromData: (result: unknown, params: URLSearchParams) => {
      const { post, allPosts, blogSection, slug } = result as {
        post: Awaited<ReturnType<typeof loadBlogPost>>;
        allPosts: Awaited<ReturnType<typeof loadBlogPosts>>;
        blogSection: Awaited<ReturnType<typeof loadBlogSection>>;
        slug: string;
      };
      const related = allPosts.posts.filter((p) => p._sys.filename !== slug).slice(0, 2);
      return {
        post: post.data.blogPost,
        related,
        blogSection: blogSection.data.blogSection,
        locale: localeFromParams(params),
      };
    },
  },
  // The 404 page: a single document, no params.
  notFound: {
    fetch: async () => loadNotFoundPage(),
    component: NotFoundView,
    wrapper: { tag: "div" },
    propsFromData: (result: unknown) => ({
      notFound: (result as Awaited<ReturnType<typeof loadNotFoundPage>>).data.notFoundPage,
    }),
  },
  // Placeholder nav pages: one page per document, slug in params (as above).
  navPage: {
    fetch: async (_request: Request, params: URLSearchParams) => {
      return loadNavPage(localeFromParams(params), params.get("slug") ?? "");
    },
    component: NavPageView,
    wrapper: { tag: "div" },
    propsFromData: (result: unknown) => ({
      navPage: (result as Awaited<ReturnType<typeof loadNavPage>>).data.navPages,
    }),
  },
  // Same "one page per document, slug in params" shape as blogPost above.
  landingPage: {
    fetch: async (_request: Request, params: URLSearchParams) => {
      const locale = localeFromParams(params);
      const slug = params.get("slug") ?? "";
      return loadLandingPage(locale, slug);
    },
    component: LandingPageView,
    wrapper: { tag: "div" },
    propsFromData: (result: unknown) => ({
      landingPage: (result as Awaited<ReturnType<typeof loadLandingPage>>).data.landingPage,
    }),
  },
});

export const POST = route;
