import type { Collection } from "tinacms";
import { depthFields, localeRouter, sectionHeadFields, textarea } from "../shared/fields";

/**
 * Homepage section 2 — `<section id="difference">`: heading + lede, the
 * "us vs charter" two-column comparison, and the founder quote.
 */
const difference: Collection = {
  name: "difference",
  label: "Home / Difference",
  path: "content/difference",
  format: "json",
  ui: {
    router: localeRouter("#difference"),
    allowedActions: { delete: false },
  },
  fields: [
    ...depthFields(),
    ...sectionHeadFields(),
    { type: "string", name: "lede", label: "Lede paragraph", ui: textarea },
    { type: "image", name: "image", label: "Photo", description: "Shown beside the title and intro paragraph." },
    { type: "string", name: "imageAlt", label: "Photo description", description: "Describe the photo for people who can't see it." },
    {
      type: "object",
      name: "comparison",
      label: "Comparison columns (no longer shown on the site)",
      fields: [
        { type: "string", name: "usTitle", label: "Left column title (us)" },
        { type: "string", name: "usPoints", label: "Left column points", list: true },
        { type: "string", name: "axisLabel", label: "Divider label", description: 'e.g. "vs"' },
        { type: "string", name: "themTitle", label: "Right column title (charter trips)" },
        { type: "string", name: "themPoints", label: "Right column points", list: true },
      ],
    },
    {
      type: "object",
      name: "founderQuote",
      label: "Founder quote",
      fields: [
        {
          type: "string",
          name: "kicker",
          label: "Kicker",
          ui: textarea,
          description: "A line break in this field becomes a <br>.",
        },
        { type: "string", name: "quote", label: "Quote", ui: textarea },
        { type: "string", name: "cite", label: "Attribution" },
      ],
    },
  ],
};

export default difference;
