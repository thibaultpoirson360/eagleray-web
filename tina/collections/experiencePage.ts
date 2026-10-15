import type { Collection } from "tinacms";
import { ctaField, localeRouter, seoField, textarea } from "../shared/fields";

/**
 * `/<locale>/the-eagle-ray-experience/` — "The Eagle Ray Experience": a hero,
 * a slider of eight cards ("What every expedition stands on") and two buttons.
 * One document per locale: content/experiencePage/<locale>.json.
 *
 * `hideFromSearch` keeps the page out of Google (and the sitemap) while it is
 * a draft; an editor turns it off to publish.
 */
const experiencePage: Collection = {
  name: "experiencePage",
  label: "The Eagle Ray Experience page",
  path: "content/experiencePage",
  format: "json",
  ui: {
    router: localeRouter("the-eagle-ray-experience/"),
    allowedActions: { delete: false },
  },
  fields: [
    {
      type: "boolean",
      name: "hideFromSearch",
      label: "Draft: hide from Google and the sitemap",
      description: "Leave on while the page is a draft. Turn off when the page is ready to be found in search.",
    },
    { type: "image", name: "heroImage", label: "Hero photo" },
    { type: "string", name: "heroImageAlt", label: "Hero photo alt text" },
    { type: "string", name: "title", label: "Title (h1)", required: true },
    { type: "string", name: "subtitle", label: "Subtitle under the title", ui: textarea },
    { type: "string", name: "supportingLine", label: "Supporting line", ui: textarea },
    { type: "string", name: "sliderTitle", label: "Slider heading (h2)", required: true },
    { type: "string", name: "previousLabel", label: "Slider previous arrow (accessible label)" },
    { type: "string", name: "nextLabel", label: "Slider next arrow (accessible label)" },
    {
      type: "object",
      name: "cards",
      label: "Slider cards (in this order)",
      list: true,
      ui: { itemProps: (item: Record<string, any>) => ({ label: item?.title || "Card" }) },
      fields: [
        { type: "string", name: "title", label: "Title (h3)", required: true },
        {
          type: "string",
          name: "label",
          label: "Label instead of the number (optional)",
          description: 'Cards are numbered 01, 02… by position. Fill this to show a word instead, e.g. "Our fleet".',
        },
        { type: "string", name: "text", label: "Text shown when the card opens", ui: textarea },
        { type: "image", name: "image", label: "Background photo" },
        { type: "string", name: "imageAlt", label: "Photo alt text" },
        { type: "string", name: "imageNote", label: "Text shown while there is no photo", description: 'e.g. "[PENDIENTE]". Not shown once a photo is set.' },
        { type: "string", name: "linkLabel", label: "Link inside the text: words (optional)" },
        { type: "string", name: "linkHref", label: "Link inside the text: address (optional)" },
      ],
    },
    ctaField("primaryCta", "Main button"),
    ctaField("secondaryCta", "Second button"),
    seoField(),
  ],
};

export default experiencePage;
