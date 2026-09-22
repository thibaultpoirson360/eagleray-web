import type { Collection } from "tinacms";

/**
 * The 7 blank navigation pages (CLAUDE.md "New pages"): About Us, Passionate
 * Sea People, Sail with Us, La Paz, Boats, Blog, Contact. Title only for now.
 *
 *   content/navPages/en/about-us.json                 -> /en/about-us
 *   content/navPages/en/passionate-sea-people.json    -> /en/passionate-sea-people
 *   content/navPages/en/sail-with-us.json             -> /en/sail-with-us
 *   content/navPages/en/la-paz.json                   -> /en/la-paz
 *   content/navPages/en/boats.json                    -> /en/boats
 *   content/navPages/en/blog.json                     -> /en/blog
 *   content/navPages/en/contact.json                  -> /en/contact
 *
 * The filename (slug) is the URL segment. `blog` is a placeholder page only —
 * a Blog content type is NOT modelled (out of scope, flagged for a scope
 * conversation).
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
    // Slugs are fixed by the nav; editors change titles, not URLs.
    filename: { readonly: true },
  },
  fields: [{ type: "string", name: "title", label: "Page title", required: true, isTitle: true }],
};

export default navPages;
