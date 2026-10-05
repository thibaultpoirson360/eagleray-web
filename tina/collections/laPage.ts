import type { Collection } from "tinacms";
import { localeRouter, seoField, textarea } from "../shared/fields";

/**
 * `/<locale>/la-paz/` — the La Paz page, built from the Claude Design mockup
 * ("La Paz.dc.html"). One document per locale (content/laPage/<locale>.json).
 *
 * Editable in the admin form only: no visual-editing wrapper on this page,
 * so there is no click-on-the-page editing for it. Every word and photo is a
 * field here.
 */
const laPage: Collection = {
  name: "laPage",
  label: "La Paz page",
  path: "content/laPage",
  format: "json",
  ui: {
    router: localeRouter("la-paz/"),
    allowedActions: { delete: false },
  },
  fields: [
    { type: "string", name: "title", label: "Headline (h1)", required: true, ui: textarea },
    { type: "string", name: "metaLine", label: "Coordinates line (above the headline)", description: 'e.g. "24°12′37.6″ N · LA PAZ · B.C.S."' },
    { type: "string", name: "lede", label: "Intro paragraph under the headline", ui: textarea },
    { type: "image", name: "heroImage", label: "Hero photo" },
    { type: "string", name: "heroImageAlt", label: "Hero photo alt text" },
    {
      type: "object",
      name: "facts",
      label: "Quick facts (strip under the hero)",
      list: true,
      ui: { itemProps: (item: Record<string, any>) => ({ label: item?.label || "Fact" }) },
      fields: [
        { type: "string", name: "label", label: "Label", required: true },
        { type: "string", name: "value", label: "Value", required: true },
      ],
    },
    { type: "string", name: "wildlifeKicker", label: "Wildlife — small label" },
    { type: "string", name: "wildlifeTitle", label: "Wildlife — heading" },
    { type: "string", name: "wildlifeIntro", label: "Wildlife — intro", ui: textarea },
    {
      type: "object",
      name: "species",
      label: "Animals (cards; click one to see the photo larger)",
      list: true,
      ui: { itemProps: (item: Record<string, any>) => ({ label: item?.name || "Animal" }) },
      fields: [
        { type: "string", name: "name", label: "Name", required: true },
        { type: "string", name: "season", label: "Season", description: 'e.g. "Oct — Apr" or "Year-round"' },
        { type: "string", name: "place", label: "Where" },
        { type: "string", name: "note", label: "Description", ui: textarea },
        { type: "image", name: "image", label: "Photo" },
        { type: "string", name: "imageAlt", label: "Photo alt text" },
      ],
    },
    { type: "string", name: "wildlifeFootnote", label: "Wildlife — note under the cards", ui: textarea },
    { type: "string", name: "destinationsKicker", label: "Where we go — small label" },
    { type: "string", name: "destinationsTitle", label: "Where we go — heading" },
    {
      type: "object",
      name: "destinations",
      label: "Places (cards; click one to see the photo larger)",
      list: true,
      ui: { itemProps: (item: Record<string, any>) => ({ label: item?.name || "Place" }) },
      fields: [
        { type: "string", name: "name", label: "Name", required: true },
        { type: "string", name: "description", label: "Description", ui: textarea },
        { type: "image", name: "image", label: "Photo" },
        { type: "string", name: "imageAlt", label: "Photo alt text" },
      ],
    },
    { type: "string", name: "ctaTitle", label: "Closing heading", ui: textarea },
    { type: "string", name: "ctaLabel", label: "Closing button text" },
    { type: "string", name: "ctaHref", label: "Closing button link", description: 'e.g. "/en/#customize"' },
    seoField(),
  ],
};

export default laPage;
