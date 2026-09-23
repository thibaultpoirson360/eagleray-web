import type { Collection } from "tinacms";

/**
 * Page chrome, not a homepage section — the `<nav>` bar (styles.css
 * L437-630) and its mobile overlay (L644-717). Not anticipated by the
 * original schema pass (built for the 6 homepage sections + navPages
 * stubs + siteSettings); added here because CLAUDE.md's ground rule 2
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
 */
const navigation: Collection = {
  name: "navigation",
  label: "Site Navigation",
  path: "content/navigation",
  format: "json",
  match: { include: "index" },
  ui: {
    global: true,
    allowedActions: { create: false, delete: false },
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
        { type: "string", name: "wordmarkAlt", label: "Wordmark alt text" },
      ],
    },
    {
      type: "object",
      name: "links",
      label: "Nav links",
      list: true,
      ui: {
        itemProps: (item: Record<string, string>) => ({ label: item?.label || "Link" }),
        defaultItem: { label: "New link", href: "" },
      },
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
  ],
};

export default navigation;
