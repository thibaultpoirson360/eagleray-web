import type { Collection } from "tinacms";
import { doNotTranslate, localeRouter } from "../shared/fields";

/**
 * Page chrome, not a homepage section — the `<nav>` bar (styles.css
 * L437-630) and its mobile overlay (L644-717). Not anticipated by the
 * original schema pass (built for the 6 homepage sections + navPages
 * stubs + siteSettings); added here because docs/migration-history.md's ground rule 2
 * ("every component must be editable... no exceptions") applies to Nav
 * too, and nothing here already exists elsewhere:
 *   - `links` is deliberately separate from the `navPages` collection.
 *     navPages is each stub page's own title; these are the nav bar's
 *     own labels + hrefs, which may reasonably differ and need to exist
 *     regardless of whether a linked page exists yet (every href is ""
 *     today, matching source exactly).
 *   - `cta.label`/`cta.mobileLabel` are separate fields for one reason:
 *     the source genuinely shows different text on desktop ("Go
 *     Sailing", data-i18n="nav.customize") vs the mobile menu
 *     ("Customize your expedition", no data-i18n) for the same #customize
 *     target — confirmed against lib/i18n.js's nav.customize/
 *     navm.customize keys, not a copy-paste bug.
 *   - `mobileFoot` duplicates Hero's `metaLine` string rather than
 *     deriving from `siteSettings.coords` — matching source, which
 *     already hardcodes "24°12′37.6″ N · LA PAZ · B.C.S." in both
 *     places independently rather than composing it from `coords`
 *     ("24°12′37.6″ N") + `base` ("La Paz, Baja California Sur"), which
 *     don't even share the same formatting (abbreviated "B.C.S." vs the
 *     spelled-out base).
 *
 * One document per locale (content/navigation/en.json, es.json, fr.json)
 * like every other translated section — the labels, the CTA text and the
 * accessible names all need translating, so a single global document no
 * longer fits. The es/fr documents are drafted from en.json by the
 * translation Action (docs/translation-workflow.md). Internal hrefs in the
 * es/fr documents point at that locale's own pages (the Action rewrites the
 * `/en/` prefix), so a link never bounces a Spanish reader to English.
 */
const navigation: Collection = {
  name: "navigation",
  label: "Site Navigation",
  path: "content/navigation",
  format: "json",
  ui: {
    // A distinct fragment from footer.ts/hero.ts — see the comment on
    // "One document per locale" above: navigation, footer and hero used to
    // all route to the bare `/<locale>/` page. TinaCMS's admin identifies
    // "which document is open" by the URL its router returns, POLLED BACK
    // from the live-preview iframe every 100ms (upstream `PreviewInner`,
    // not something this project's code touches) — three documents sharing
    // one URL is exactly the ambiguity that made the sidebar land on the
    // wrong collection's form. `#site-nav` is a real id on <nav> (Nav.astro),
    // so this also scrolls the preview straight to it.
    router: localeRouter("#site-nav"),
    allowedActions: { delete: false },
  },
  fields: [
    {
      type: "object",
      name: "brand",
      label: "Logo",
      fields: [
        { type: "image", name: "markLight", label: "Mark — light (over the transparent/hero nav)" },
        { type: "image", name: "wordmarkLight", label: "Wordmark — light" },
        { type: "image", name: "markDark", label: "Mark — dark (once the nav has scrolled solid)" },
        { type: "image", name: "wordmarkDark", label: "Wordmark — dark" },
        { type: "string", name: "wordmarkAlt", label: "Wordmark alt text", ui: doNotTranslate },
      ],
    },
    {
      type: "object",
      name: "links",
      label: "Nav links",
      list: true,
      ui: {
        itemProps: (item: Record<string, any>) => ({ label: item?.label || "Link" }),
      },
      // Two shapes per item, not one field with an optional sub-list: a
      // plain link and a dropdown are different enough (a dropdown's
      // "link" has no href of its own, just a trigger label) that one
      // shape with everything optional would let content exist that's
      // neither a valid link nor a valid dropdown. Only About Us and
      // Sail with Us are dropdowns today, per explicit direction.
      templates: [
        {
          name: "link",
          label: "Simple link",
          ui: { defaultItem: { label: "New link", href: "" } },
          fields: [
            { type: "string", name: "label", label: "Label", required: true },
            {
              type: "string",
              name: "href",
              label: "Link",
              required: true,
              description: 'e.g. "#customize", or "/en/about-us" once that page exists. Empty ("") for not-yet-built pages, matching the current site.',
            },
          ],
        },
        {
          name: "dropdown",
          label: "Dropdown (label + sub-links)",
          ui: { defaultItem: { label: "New dropdown", items: [] } },
          fields: [
            { type: "string", name: "label", label: "Label shown in the nav bar", required: true },
            {
              type: "object",
              name: "items",
              label: "Sub-links",
              list: true,
              ui: {
                itemProps: (item: Record<string, any>) => ({ label: item?.label || "Sub-link" }),
                defaultItem: { label: "New link", href: "" },
              },
              fields: [
                { type: "string", name: "label", label: "Label", required: true },
                { type: "string", name: "href", label: "Link", required: true },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "object",
      name: "cta",
      label: '"Go Sailing" button',
      fields: [
        { type: "string", name: "href", label: "Link", required: true },
        { type: "string", name: "label", label: "Desktop label", required: true },
        { type: "string", name: "mobileLabel", label: "Mobile menu label", required: true },
      ],
    },
    {
      type: "string",
      name: "mobileFoot",
      label: "Mobile menu footer line",
      description: 'e.g. "24°12′37.6″ N · LA PAZ · B.C.S."',
    },
    {
      type: "string",
      name: "toggleLabel",
      label: "Menu button (accessible label, not visible text)",
      description: 'e.g. "Toggle menu".',
    },
    {
      type: "string",
      name: "ariaLabel",
      label: "Navigation bar (accessible label, not visible text)",
      description: 'Read by screen readers to name the nav landmark, e.g. "Main".',
    },
    {
      type: "string",
      name: "languageLabel",
      label: "Language switcher (accessible label, not visible text)",
      description: 'e.g. "Language".',
    },
    {
      type: "string",
      name: "skipLabel",
      label: '"Skip to content" link (first thing keyboard users reach)',
      description: 'Invisible until someone presses Tab. e.g. "Skip to main content".',
    },
    {
      type: "string",
      name: "surfaceLabel",
      label: "Depth gauge — label shown at the surface",
      description:
        "The word the side depth gauge shows before the first section, e.g. \"Surface\". Lives here (not in Site Settings) because it is a word, so it needs a version per language.",
    },
  ],
};

export default navigation;
