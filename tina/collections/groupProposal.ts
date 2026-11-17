import type { Collection, TinaField } from "tinacms";
import { ctaField, textarea } from "../shared/fields";

/**
 * Private group proposals in the "cinematic" style (a full-screen opening
 * photo, wide sections, big photos), for a group that comes through an agency
 * or a single organiser. One document per proposal:
 * content/groupProposal/<locale>/<slug>.json, shown at
 * `/<locale>/proposals/<slug>/`. Private the same way as tripProposal: no menu
 * entry, `noindex`, not in the sitemap. The Mogu-style layout with a route map
 * is the other template (tripProposal.ts).
 *
 * Photo lists keep their empty slots on purpose: an editor fills them in from
 * the editor (the boat gallery, the food photos), and an empty slot shows as a
 * quiet box the editor can click.
 */
const photos = (name: string, label: string, description?: string): TinaField => ({
  type: "object",
  name,
  label,
  description,
  list: true,
  ui: { itemProps: (item: Record<string, string>) => ({ label: item?.alt || item?.image || "Empty photo slot" }), defaultItem: { image: "", alt: "" } },
  fields: [
    { type: "image", name: "image", label: "Photo" },
    { type: "string", name: "alt", label: "Description (alt text)" },
  ],
});

const groupProposal: Collection = {
  name: "groupProposal",
  label: "Private proposals (cinematic)",
  path: "content/groupProposal",
  format: "json",
  ui: {
    router: ({ document }) => {
      const [locale, slug] = document._sys.breadcrumbs;
      return `/${locale}/proposals/${slug}`;
    },
  },
  fields: [
    { type: "string", name: "title", label: "Proposal name (for the team)", required: true, isTitle: true, description: "Browser tab title. Visitors do not see it as a heading." },
    {
      type: "object",
      name: "hero",
      label: "1. Opening photo",
      fields: [
        { type: "image", name: "image", label: "Photo" },
        { type: "string", name: "imageAlt", label: "Photo description (alt text)" },
        { type: "string", name: "note", label: "Small line above the title" },
        { type: "string", name: "title", label: "Title", required: true },
        { type: "string", name: "subtitle", label: "Subtitle", ui: textarea },
        ctaField("button", "Button"),
      ],
    },
    {
      type: "object",
      name: "brief",
      label: "2. Built around the group",
      fields: [
        { type: "string", name: "title", label: "Title", required: true },
        { type: "string", name: "text", label: "Text", ui: textarea, description: "Separate paragraphs with a blank line." },
        {
          type: "object",
          name: "facts",
          label: "Key facts (shown in a row, with an icon)",
          list: true,
          ui: { itemProps: (item: Record<string, string>) => ({ label: item?.text }) },
          fields: [
            {
              type: "string",
              name: "icon",
              label: "Icon",
              options: [
                { value: "calendar", label: "Calendar" },
                { value: "people", label: "People" },
                { value: "pin", label: "Place" },
                { value: "clock", label: "Clock" },
              ],
            },
            { type: "string", name: "text", label: "Text", required: true },
          ],
        },
      ],
    },
    {
      type: "object",
      name: "days",
      label: "3. The days",
      fields: [
        { type: "string", name: "title", label: "Title", required: true },
        { type: "string", name: "text", label: "Text", ui: textarea, description: "Separate paragraphs with a blank line." },
        { type: "string", name: "note", label: "Small note" },
        photos("photos", "Photos"),
      ],
    },
    {
      type: "object",
      name: "boat",
      label: "4. The boat",
      fields: [
        { type: "string", name: "title", label: "Boat name", required: true },
        { type: "string", name: "intro", label: "Intro", ui: textarea },
        photos("gallery", "Boat photos", "The first one is the big photo; the rest sit below it."),
        { type: "string", name: "specs", label: "Specs line" },
        {
          type: "object",
          name: "cabins",
          label: "Cabin plan",
          list: true,
          ui: { itemProps: (item: Record<string, string>) => ({ label: `${item?.who ?? ""}: ${item?.cabin ?? ""}` }) },
          fields: [
            { type: "string", name: "who", label: "Who", required: true },
            { type: "string", name: "cabin", label: "Cabin", required: true },
          ],
        },
        {
          type: "object",
          name: "prices",
          label: "Price box (two columns)",
          list: true,
          ui: { itemProps: (item: Record<string, string>) => ({ label: item?.label }) },
          fields: [
            { type: "string", name: "label", label: "Payment method", required: true },
            { type: "string", name: "total", label: "Total" },
            { type: "string", name: "perPerson", label: "Per person" },
          ],
        },
        { type: "string", name: "priceNote", label: "Line under the price box" },
      ],
    },
    {
      type: "object",
      name: "aboard",
      label: "5. What is aboard",
      fields: [
        { type: "string", name: "title", label: "Title", required: true },
        { type: "string", name: "onTitle", label: "First column: heading" },
        { type: "string", name: "on", label: "First column: list", list: true },
        { type: "string", name: "offTitle", label: "Second column: heading" },
        { type: "string", name: "off", label: "Second column: list", list: true },
      ],
    },
    {
      type: "object",
      name: "crew",
      label: "6. The crew",
      fields: [
        { type: "string", name: "title", label: "Title", required: true },
        { type: "string", name: "text", label: "Text", ui: textarea, description: "Separate paragraphs with a blank line." },
        photos("photos", "Photos"),
      ],
    },
    {
      type: "object",
      name: "book",
      label: "7. How to book",
      fields: [
        { type: "string", name: "title", label: "Title", required: true },
        { type: "string", name: "text", label: "Text", ui: textarea },
        { type: "string", name: "terms", label: "Terms (one per line)", list: true },
      ],
    },
    {
      type: "object",
      name: "closing",
      label: "8. Closing",
      fields: [
        { type: "string", name: "title", label: "Title", required: true },
        { type: "string", name: "text", label: "Text", ui: textarea },
        { type: "string", name: "buttonLabel", label: "WhatsApp button text" },
        { type: "string", name: "message", label: "WhatsApp message", ui: textarea, description: "Written in the chat when the button is pressed. The number is the one in Site settings." },
      ],
    },
    {
      type: "object",
      name: "footer",
      label: "Footer",
      fields: [
        { type: "string", name: "line1", label: "First line" },
        { type: "string", name: "line2", label: "Second line" },
      ],
    },
  ],
};

export default groupProposal;
