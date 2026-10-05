import type { Collection } from "tinacms";
import { landingBlocksField } from "../shared/landingBlocks";

/**
 * Placeholder pages for the navigation entries that have no real page yet:
 * a title (an <h1>) and nothing else. One document per locale and page,
 * content/navPages/<locale>/<slug>.json, served by
 * src/pages/[locale]/[slug].astro at /<locale>/<slug>/:
 *
 *   our-story, the-eagle-ray-experience, our-travelers-experience   (About Us)
 *   recalibration-expedition, active-expedition, ad-hoc-expedition  (Sail with Us)
 *   la-paz, boats
 *
 * The filename (slug) is the URL segment, and it is what the nav links point
 * at. Pages that became real (passionate-sea-people, blog, contact) have their
 * own collection and route and are not listed here. When one of these grows
 * into a real page, give it its own collection + route and delete its
 * document here (a static route wins over [slug], but the placeholder would
 * keep being built).
 */
const navPages: Collection = {
  name: "navPages",
  label: "Pages (nav)",
  path: "content/navPages",
  format: "json",
  ui: {
    router: ({ document }) => {
      const [locale, slug] = document._sys.breadcrumbs;
      return `/${locale}/${slug}`;
    },
    // Slugs are fixed by the nav; editors change titles, not URLs, and a new
    // page needs a nav link and (eventually) its own template anyway.
    filename: { readonly: true },
    allowedActions: { create: false, delete: false },
  },
  fields: [
    { type: "string", name: "title", label: "Page title", required: true, isTitle: true },
    // Empty = the title-only placeholder (noindex). Add blocks to build the
    // page, the same way as a landing page; once it has blocks it is indexed.
    landingBlocksField(),
  ],
};

export default navPages;
