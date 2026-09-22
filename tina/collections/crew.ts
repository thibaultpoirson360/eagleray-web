import type { Collection } from "tinacms";
import { ctaField, depthFields, localeRouter, sectionHeadFields, textarea } from "../shared/fields";

/**
 * Homepage section 3 (`#crew`) is split in two collections:
 *   crewSection — the section's own copy (one document per locale)
 *   crew        — one document per crew member, content/crew/<locale>/<slug>.json
 * Members get their own documents because the "Passionate Sea People" nav
 * page will list the same people.
 */
export const crewSection: Collection = {
  name: "crewSection",
  label: "Home / Crew section",
  path: "content/crewSection",
  format: "json",
  ui: {
    router: localeRouter("#crew"),
    allowedActions: { delete: false },
  },
  fields: [
    ...depthFields(),
    ...sectionHeadFields(),
    { type: "string", name: "intro", label: "Intro paragraph (above the slider)", ui: textarea },
    {
      type: "string",
      name: "rolesIntro",
      label: "Second paragraph (below the slider)",
      ui: textarea,
    },
    ctaField("cta", "Button below the slider"),
  ],
};

export const crew: Collection = {
  name: "crew",
  label: "Crew members",
  path: "content/crew",
  format: "json",
  ui: {
    router: localeRouter("#crew"),
    filename: { slugify: (values) => (values?.name ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-") },
  },
  fields: [
    { type: "string", name: "name", label: "Name", required: true, isTitle: true },
    { type: "string", name: "role", label: "Role", description: 'e.g. "Captain & Expedition Leader"' },
    { type: "string", name: "bio", label: "Bio", ui: textarea },
    { type: "image", name: "photo", label: "Photo" },
    { type: "string", name: "photoAlt", label: "Photo alt text" },
    {
      type: "string",
      name: "cardLabel",
      label: "Label above the name (optional)",
      description: 'Only the founder card uses this, e.g. "Founder".',
    },
    {
      type: "string",
      name: "joiningTag",
      label: "\"Joining\" tag (optional)",
      description: 'Shows the pill on the card, e.g. "Joining Q4 2026". Leave blank for active crew.',
    },
    {
      type: "number",
      name: "order",
      label: "Slider position",
      description: "Lower numbers first. The slider sorts by this, then by name.",
    },
  ],
};
