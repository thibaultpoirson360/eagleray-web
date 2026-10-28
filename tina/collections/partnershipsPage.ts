import type { Collection } from "tinacms";
import { doNotTranslate, localeRouter, seoField, textarea } from "../shared/fields";

/**
 * `/<locale>/partnerships` — for travel advisors, concierges and Expedition
 * Leaders. One document per language (content/partnershipsPage/en.json).
 * Not in the main navigation: linked from the footer and the Contact page.
 */
const photo = (label: string) => [
  { type: "image", name: "image", label: `${label}: photo`, description: "Real photos of crew and trips only. Never show a boat's name." },
  { type: "string", name: "imageAlt", label: `${label}: photo description (alt text)` },
];

const partnershipsPage: Collection = {
  name: "partnershipsPage",
  label: "Partnerships page",
  path: "content/partnershipsPage",
  format: "json",
  ui: { router: localeRouter("partnerships/"), allowedActions: { delete: false } },
  fields: [
    { type: "string", name: "title", label: "Main heading", required: true },
    { type: "string", name: "subtitle", label: "Text under the heading", ui: textarea },
    ...photo("Top banner"),
    { type: "string", name: "primaryLabel", label: "Main button label (scrolls to the form)" },
    { type: "string", name: "secondaryLabel", label: "Email link text (links to the site's email address)" },

    { type: "string", name: "whoTitle", label: "Who we work with: section title" },
    {
      type: "object",
      name: "whoCards",
      label: "Who we work with: cards",
      list: true,
      ui: { itemProps: (item) => ({ label: item?.title }) },
      fields: [
        { type: "string", name: "title", label: "Card title" },
        { type: "string", name: "text", label: "Card text", ui: textarea },
        ...photo("Card"),
      ],
    },

    { type: "string", name: "aboardTitle", label: "What your clients find aboard: section title" },
    { type: "string", name: "aboardPoints", label: "What your clients find aboard: points", list: true },
    {
      type: "object",
      name: "formats",
      label: "Expedition formats",
      list: true,
      ui: { itemProps: (item) => ({ label: item?.name }) },
      fields: [
        { type: "string", name: "name", label: "Format name" },
        { type: "string", name: "text", label: "One-line description", ui: textarea },
      ],
    },
    { type: "string", name: "seeAllLabel", label: "\"See all expeditions\" link label" },
    { type: "string", name: "seeAllHref", label: "\"See all expeditions\" link address", ui: doNotTranslate },

    { type: "string", name: "howTitle", label: "How it works: section title" },
    { type: "string", name: "steps", label: "How it works: steps (in order)", list: true },

    { type: "string", name: "getTitle", label: "What you get: section title" },
    { type: "string", name: "benefits", label: "What you get: points", list: true },
    {
      type: "object",
      name: "limitedOffer",
      label: "Limited-time offer (shown under \"What you get\")",
      description: "Disappears by itself after the \"last day\" below once the site is next published. Or clear the text to remove it now.",
      fields: [
        { type: "string", name: "text", label: "Offer text", ui: textarea },
        { type: "string", name: "lastDay", label: "Last day (YYYY-MM-DD)", description: "e.g. 2026-12-31. The offer shows through the end of this day.", ui: doNotTranslate },
      ],
    },

    { type: "string", name: "proofTitle", label: "Proof: section title" },
    {
      type: "object",
      name: "proofLinks",
      label: "Proof: link cards",
      list: true,
      ui: { itemProps: (item) => ({ label: item?.label }) },
      fields: [
        { type: "string", name: "label", label: "Card title" },
        { type: "string", name: "href", label: "Link address", ui: doNotTranslate },
        ...photo("Card"),
      ],
    },

    { type: "string", name: "formTitle", label: "Form: section title" },
    {
      type: "object",
      name: "form",
      label: "Form",
      fields: [
        { type: "string", name: "name", label: "Full name label" },
        { type: "string", name: "company", label: "Company, hotel or Instagram handle label" },
        { type: "string", name: "role", label: "\"I am a...\" label" },
        { type: "string", name: "roleOptions", label: "\"I am a...\" options", list: true },
        { type: "string", name: "location", label: "City and country label" },
        { type: "string", name: "email", label: "Email label" },
        { type: "string", name: "whatsapp", label: "WhatsApp label (optional field)" },
        { type: "string", name: "audience", label: "\"Who are your clients or your community?\" label" },
        { type: "string", name: "source", label: "\"How did you hear about us?\" label" },
        { type: "string", name: "sourceOptions", label: "\"How did you hear about us?\" options", list: true },
        { type: "string", name: "selectPlaceholder", label: "Menu first line (before choosing)" },
        { type: "string", name: "submitLabel", label: "Button label" },
        { type: "string", name: "sendingLabel", label: "Button label while sending" },
        { type: "string", name: "successMessage", label: "Message after a successful send", ui: textarea },
        { type: "string", name: "errorMessage", label: "Message if sending fails", ui: textarea },
      ],
    },
    seoField(),
  ],
};

export default partnershipsPage;
