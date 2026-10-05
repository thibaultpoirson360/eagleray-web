import type { Collection } from "tinacms";
import { localeRouter, seoField, textarea } from "../shared/fields";

/**
 * `/<locale>/about-us/` — the "Our story" page, built from the Claude Design
 * mockup ("About Us.dc.html"). One document per locale (content/aboutPage/<locale>.json).
 *
 * Everything below the hero is one rich-text body, so the structure can change
 * without a developer.
 * Edited in the admin form only (no visual-editing wrapper on this page).
 */
const aboutPage: Collection = {
  name: "aboutPage",
  label: "About Us page",
  path: "content/aboutPage",
  format: "json",
  ui: {
    router: localeRouter("about-us/"),
    allowedActions: { delete: false },
  },
  fields: [
    { type: "string", name: "kicker", label: "Hero — small label", description: 'e.g. "Our story".' },
    { type: "string", name: "title", label: "Hero — headline (h1)", required: true, ui: textarea },
    { type: "string", name: "lede", label: "Hero — sub-headline", ui: textarea },
    { type: "image", name: "heroImage", label: "Hero photo" },
    { type: "string", name: "heroImageAlt", label: "Hero photo alt text" },
    {
      type: "rich-text",
      name: "body",
      label: "Page body (everything below the hero)",
      description: "Write the story, pictures and quotes in any order. Use a heading for each section, a quote block for pull quotes, and an image where you want a photo.",
    },
    seoField(),
  ],
};

export default aboutPage;
