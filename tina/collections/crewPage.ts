import type { Collection } from "tinacms";
import { localeRouter, seoField, textarea } from "../shared/fields";

/**
 * `/<locale>/passionate-sea-people/` — the page that shows every crew member
 * as a complete card. One document per locale (content/crewPage/en.json), the
 * same pattern as contactPage / blogSection.
 *
 * Page shape, top to bottom: a hero, an intro text, a "Meet our people"
 * title, then the grid of complete cards. The cards themselves are NOT
 * authored here — they come from the `crew` collection (the same records
 * the home slider uses), and the small labels they print come from
 * crewSection. Only the page's own copy lives in this document.
 */
const crewPage: Collection = {
  name: "crewPage",
  label: "Passionate Sea People page",
  path: "content/crewPage",
  format: "json",
  ui: {
    router: localeRouter("passionate-sea-people/"),
    allowedActions: { delete: false },
  },
  fields: [
    {
      type: "object",
      name: "hero",
      label: "Hero banner",
      fields: [
        { type: "string", name: "kicker", label: "Kicker (small label above the title)" },
        { type: "string", name: "title", label: "Title", required: true },
        { type: "string", name: "lede", label: "Sub-headline", ui: textarea },
        { type: "image", name: "image", label: "Background photo" },
        { type: "string", name: "imageAlt", label: "Photo alt text" },
      ],
    },
    {
      type: "string",
      name: "intro",
      label: "Intro text",
      ui: textarea,
      description: "Shown under the hero. A blank line starts a new paragraph.",
    },
    { type: "string", name: "gridTitle", label: "Title above the crew grid", description: 'e.g. "Meet our people".' },
    {
      type: "object",
      name: "roleLabels",
      label: "Group headings above the crew grid",
      description: "Each group appears in this order: Founder, Captain, Expedition Leader, Chef. Members with no matching role appear last.",
      fields: [
        { type: "string", name: "founder", label: "Founder heading" },
        { type: "string", name: "captain", label: "Captain heading" },
        { type: "string", name: "expeditionLeader", label: "Expedition Leader heading" },
        { type: "string", name: "chef", label: "Chef heading" },
        { type: "string", name: "other", label: "Other roles heading" },
      ],
    },
    seoField(),
  ],
};

export default crewPage;
