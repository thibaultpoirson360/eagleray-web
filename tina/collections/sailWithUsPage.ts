import type { Collection } from "tinacms";
import { localeRouter, seoField, textarea } from "../shared/fields";

/**
 * `/<locale>/sail-with-us/` — the top of the Sail with Us page, from the Claude
 * Design mockup (Sail With Us.dc.html): a hero photo with the title over it,
 * an intro, and the expedition cards. The trip-planning funnel sits below
 * these on the same page (content/funnel/<locale>.json, shared with the
 * homepage). One document per locale: content/sailWithUsPage/<locale>.json.
 */
const sailWithUsPage: Collection = {
  name: "sailWithUsPage",
  label: "Sail with Us page",
  path: "content/sailWithUsPage",
  format: "json",
  ui: {
    router: localeRouter("sail-with-us/"),
    allowedActions: { delete: false },
  },
  fields: [
    { type: "image", name: "heroImage", label: "Hero photo" },
    { type: "string", name: "heroImageAlt", label: "Hero photo alt text" },
    { type: "string", name: "title", label: "Title over the hero photo (h1)", required: true },
    { type: "string", name: "subtitle", label: "Subtitle under the title", ui: textarea },
    { type: "string", name: "intro", label: "Intro text", ui: textarea, description: "A blank line starts a new paragraph." },
    { type: "string", name: "expeditionsLabel", label: "Label above the expedition cards", description: 'e.g. "Choose the expedition"' },
    {
      type: "object",
      name: "expeditions",
      label: "Expedition cards (each links to its page; up to 3 in one row on desktop)",
      list: true,
      ui: { itemProps: (item: Record<string, any>) => ({ label: item?.name || "Expedition" }) },
      fields: [
        { type: "string", name: "name", label: "Name", required: true },
        { type: "image", name: "image", label: "Card photo" },
        { type: "string", name: "imageAlt", label: "Card photo alt text" },
        {
          type: "string",
          name: "href",
          label: "Link to the expedition page (the whole card links here)",
          description: 'e.g. "/en/recalibration-expedition/"',
        },
      ],
    },
    seoField(),
  ],
};

export default sailWithUsPage;
