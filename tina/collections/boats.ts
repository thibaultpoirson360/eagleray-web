import type { Collection } from "tinacms";
import { ctaField, depthFields, doNotTranslate, localeRouter, sectionHeadFields, textarea } from "../shared/fields";

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
  fields: [...depthFields(), ...sectionHeadFields(), ctaField("cta", "Button below the cards")],
};

export const boats: Collection = {
  name: "boats",
  label: "Boats",
  path: "content/boats",
  format: "json",
  ui: {
    router: localeRouter("#boats"),
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
    { type: "string", name: "description", label: "Description", ui: textarea },
    { type: "image", name: "photo", label: "Photo" },
    { type: "string", name: "photoAlt", label: "Photo alt text" },
    {
      type: "number",
      name: "order",
      label: "Card position",
      description: "Lower numbers first.",
    },
  ],
};