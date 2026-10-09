import type { Collection } from "tinacms";
import { ctaField, depthFields, doNotTranslate, localeRouter, seoField, sectionHeadFields, textarea } from "../shared/fields";

/**
 * Homepage section 5 (`#boats`) is split in two collections:
 *   boatsSection — the section's own copy + button (one document per locale)
 *   boats        — one document per boat card, content/boats/<locale>/<slug>.json
 * Boats are separate documents because the "Boats" nav page will reuse them.
 */
export const boatsSection: Collection = {
  name: "boatsSection",
  label: "Home / Boats section",
  path: "content/boatsSection",
  format: "json",
  ui: {
    router: localeRouter("#boats"),
    allowedActions: { delete: false },
  },
  fields: [
    ...depthFields(),
    ...sectionHeadFields(),
    ctaField("cta", "Button below the cards"),
    {
      type: "string",
      name: "dotsLabel",
      label: "Slider dots (accessible label, not visible text)",
      description: 'Read out before each dot\'s number, e.g. "Go to boat" -> "Go to boat 2".',
    },
    {
      type: "object",
      name: "modal",
      label: "Boat pop-up (opens when a boat card is clicked)",
      description: "The small texts in the pop-up that shows a boat's photos, description and details.",
      fields: [
        { type: "string", name: "close", label: "Close button (accessible label)" },
        { type: "string", name: "previous", label: "Previous photo arrow (accessible label)" },
        { type: "string", name: "next", label: "Next photo arrow (accessible label)" },
        { type: "string", name: "photo", label: "Photo dots (accessible label)", description: 'Read out before each dot\'s number, e.g. "Photo" -> "Photo 2".' },
        { type: "string", name: "length", label: "Length heading" },
        { type: "string", name: "cabins", label: "Cabins heading" },
        { type: "string", name: "bathrooms", label: "Bathrooms heading" },
        { type: "string", name: "guests", label: "Guests heading" },
        ctaField("cta", "Button at the bottom of the pop-up"),
      ],
    },
  ],
};

export const boats: Collection = {
  name: "boats",
  label: "Boats",
  path: "content/boats",
  format: "json",
  ui: {
    // Same fix as crew.ts: all 3 boats used to share the one `/<locale>/#boats`
    // URL, which is ambiguous to TinaCMS's admin. Each boat now has its own
    // id on its card (Boats.astro) and its own URL.
    router: ({ document }) => {
      const [locale, slug] = document._sys.breadcrumbs;
      return `/${locale}/#${slug}`;
    },
    filename: { slugify: (values) => (values?.name ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-") },
  },
  fields: [
    {
      type: "string",
      name: "name",
      label: "Boat name",
      required: true,
      isTitle: true,
      ui: doNotTranslate,
      description: "A proper noun (boat model name) — the translation Action copies this through untouched instead of sending it to DeepL.",
    },
    {
      type: "string",
      name: "tagline",
      label: "Tagline (optional)",
      description: 'Currently commented out in the markup, e.g. "Icon Charter — Lagoon 450F".',
    },
    { type: "string", name: "description", label: "Short description (shown on the card)", ui: textarea },
    {
      type: "string",
      name: "details",
      label: "Full description (shown when the card is opened)",
      ui: textarea,
      description: "A blank line starts a new paragraph.",
    },
    {
      type: "string",
      name: "features",
      label: "Highlights (shown when the card is opened)",
      list: true,
      description: "One line per highlight, e.g. \"Starlink wifi on board\".",
    },
    { type: "image", name: "photo", label: "Photo" },
    { type: "string", name: "photoAlt", label: "Photo alt text" },
    {
      type: "object",
      name: "photos",
      label: "Photos (Boats page: add, remove or reorder; the first one is the card photo there)",
      list: true,
      ui: { itemProps: (item: Record<string, any>) => ({ label: item?.alt || "Photo" }) },
      fields: [
        { type: "image", name: "image", label: "Photo", required: true },
        { type: "string", name: "alt", label: "Alt text" },
      ],
    },
    { type: "string", name: "length", label: "Length (e.g. 13.72 m)" },
    { type: "string", name: "cabins", label: "Cabins (e.g. 4 double)" },
    { type: "string", name: "bathrooms", label: "Bathrooms (e.g. 4 private)" },
    { type: "string", name: "guests", label: "Guests (e.g. up to 8)" },
    {
      type: "number",
      name: "order",
      label: "Card position",
      description: "Lower numbers first.",
    },
  ],
};

/**
 * `/<locale>/boats/` — the Boats page text (the boat cards come from `boats`
 * above, the same list the homepage shows). One document per locale.
 */
export const boatsPage: Collection = {
  name: "boatsPage",
  label: "Boats page",
  path: "content/boatsPage",
  format: "json",
  ui: {
    router: localeRouter("boats/"),
    allowedActions: { delete: false },
  },
  fields: [
    { type: "string", name: "kicker", label: "Small label above the headline", description: 'e.g. "Your expedition"' },
    { type: "string", name: "title", label: "Headline (h1)", required: true, ui: textarea },
    { type: "string", name: "lede", label: "Intro paragraph", ui: textarea },
    { type: "string", name: "includedHeading", label: "Included list — heading" },
    {
      type: "string",
      name: "included",
      label: "Included list — items",
      list: true,
      description: "One line per item.",
    },
    { type: "string", name: "notIncludedHeading", label: "Not included list — heading" },
    {
      type: "string",
      name: "notIncluded",
      label: "Not included list — items",
      list: true,
      description: "One line per item.",
    },
    ctaField("cta", "Closing button"),
    seoField(),
  ],
};