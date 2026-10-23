import type { Collection } from "tinacms";
import { ctaField, localeRouter, seoField, textarea } from "../shared/fields";

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
    ctaField("heroCta", "Button on the hero photo (optional)"),
    { type: "string", name: "intro", label: "Intro text", ui: textarea, description: "A blank line starts a new paragraph." },
    { type: "string", name: "expeditionsLabel", label: "Label above the expedition cards", description: 'e.g. "Choose the expedition"' },
    {
      type: "object",
      name: "expeditions",
      label: "Expedition cards (each links to its page; the first two are shown wide, the rest smaller below)",
      list: true,
      ui: { itemProps: (item: Record<string, any>) => ({ label: item?.name || "Expedition" }) },
      fields: [
        { type: "string", name: "name", label: "Name", required: true },
        { type: "image", name: "image", label: "Card photo" },
        { type: "string", name: "imageAlt", label: "Card photo alt text" },
        { type: "string", name: "badge", label: "Small badge on the photo (optional)", description: 'e.g. "Limited dates · Nov 22 to 29". Use it for what is time-limited or special.' },
        { type: "string", name: "facts", label: "Quick facts line (optional)", description: 'e.g. "2 departures · 3 nights each". Only what is true for this expedition.' },
        { type: "string", name: "priceNote", label: "Price line (optional)", description: 'e.g. "From 4,000 USD". Leave empty when there is no set price.' },
        {
          type: "string",
          name: "description",
          label: "Short description under the card (2-3 lines)",
          description: "Explains in a few words what this expedition is. Leave empty for no text.",
          ui: textarea,
        },
        {
          type: "boolean",
          name: "hideOnHome",
          label: "Show only on the Sail with Us page",
          description: "Turn on to keep this card off the homepage's \"Your expedition\" section.",
        },
        {
          type: "string",
          name: "href",
          label: "Link to the expedition page (the whole card links here)",
          description: 'e.g. "/en/recalibration-expedition/"',
        },
      ],
    },
    {
      type: "string",
      name: "activitiesTitle",
      label: "Activities section: heading",
      description: 'The section below the expedition cards. Its address ends in "#activities".',
    },
    { type: "string", name: "activitiesSubtitle", label: "Activities section: text under the heading", ui: textarea },
    { type: "string", name: "activitiesButtonLabel", label: "Activities section: button on each card", description: 'e.g. "More info". It opens the contact form with the message below already written.' },
    {
      type: "object",
      name: "activities",
      label: "Activity cards (in this order)",
      list: true,
      ui: { itemProps: (item: Record<string, any>) => ({ label: item?.name || "Activity" }) },
      fields: [
        { type: "string", name: "name", label: "Name", required: true },
        {
          type: "boolean",
          name: "featured",
          label: "Large card (main activity)",
          description: "Large cards sit first, two per row, bigger than the rest. The others follow three per row.",
        },
        { type: "string", name: "text", label: "1 or 2 sentences", ui: textarea },
        { type: "image", name: "image", label: "Photo" },
        { type: "string", name: "imageAlt", label: "Photo alt text" },
        { type: "string", name: "imageNote", label: "Text shown while there is no photo", description: 'e.g. "[PENDIENTE]". Not shown once a photo is set.' },
        { type: "string", name: "priceNote", label: "Small price note (optional)", description: 'e.g. "from $360 USD per person per day". Leave empty for no price.' },
        {
          type: "string",
          name: "contactMessage",
          label: "Message already written in the contact form",
          description: "What visitors see in the message box when they press the button.",
          ui: textarea,
        },
      ],
    },
    { type: "string", name: "howTitle", label: "How it works: heading (optional)" },
    {
      type: "object",
      name: "howSteps",
      label: "How it works: steps (in order)",
      list: true,
      ui: { itemProps: (item: Record<string, any>) => ({ label: item?.title || "Step" }) },
      fields: [
        { type: "string", name: "title", label: "Step title", required: true },
        { type: "string", name: "text", label: "Step text", ui: textarea },
      ],
    },
    { type: "string", name: "closingTitle", label: "Closing banner: heading (optional)" },
    { type: "string", name: "closingText", label: "Closing banner: text", ui: textarea },
    ctaField("closingPrimaryCta", "Closing banner: main button"),
    ctaField("closingSecondaryCta", "Closing banner: second button"),
    seoField(),
  ],
};

export default sailWithUsPage;
