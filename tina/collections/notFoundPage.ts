import type { Collection } from "tinacms";

/**
 * The "Page not found" (404) page, `src/pages/404.astro`. A single document
 * (content/notFoundPage/index.json), NOT one per locale: the host serves one
 * static /404.html for every unknown URL and can't pick a language for it, so
 * the page is built in the default locale. Because it isn't a per-locale
 * `<locale>.json` document, the translation Action leaves it alone — if a
 * language-aware 404 is wanted later, convert this to per-locale documents.
 *
 * Just a hero with the title and a button back to the home page. The
 * button's destination is a routing fact (the default locale's home), not
 * copy, so only its label is a field.
 */
const notFoundPage: Collection = {
  name: "notFoundPage",
  label: "404 page (Page not found)",
  path: "content/notFoundPage",
  format: "json",
  match: { include: "index" },
  ui: {
    router: () => "/404",
    allowedActions: { create: false, delete: false },
  },
  fields: [
    { type: "string", name: "title", label: "Title", required: true, isTitle: true },
    { type: "string", name: "buttonLabel", label: "Button text", description: 'The button goes back to the home page, e.g. "Back to home".' },
    { type: "image", name: "image", label: "Background photo" },
    { type: "string", name: "imageAlt", label: "Photo alt text" },
  ],
};

export default notFoundPage;
