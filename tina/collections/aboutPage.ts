import type { Collection } from "tinacms";
import { localeRouter, seoField, textarea } from "../shared/fields";

/**
 * `/<locale>/about-us/` — the "Our story" page, built from the Claude Design
 * mockup ("About Us.dc.html"). One document per locale (content/aboutPage/<locale>.json).
 *
 * Long text fields: a blank line starts a new paragraph.
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
    { type: "string", name: "storyKicker", label: "Story — small label" },
    { type: "string", name: "storyTitle", label: "Story — heading", ui: textarea },
    { type: "string", name: "storyBody", label: "Story — text", ui: textarea },
    { type: "image", name: "founderImage", label: "Founder photo" },
    { type: "string", name: "founderImageAlt", label: "Founder photo alt text" },
    { type: "string", name: "quote", label: "Pull quote", ui: textarea },
    { type: "string", name: "afterQuote", label: "Text after the pull quote", ui: textarea },
    { type: "string", name: "approachKicker", label: "How we work — small label" },
    { type: "string", name: "approachBody", label: "How we work — text", ui: textarea },
    { type: "string", name: "closingLine", label: "Closing line", ui: textarea },
    { type: "string", name: "closingLabel", label: "Closing button text" },
    { type: "string", name: "closingHref", label: "Closing button link", description: 'e.g. "/en/#crew"' },
    seoField(),
  ],
};

export default aboutPage;
