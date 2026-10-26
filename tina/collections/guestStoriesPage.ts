import type { Collection } from "tinacms";
import { ctaField, doNotTranslate, localeRouter, seoField, textarea } from "../shared/fields";

/**
 * `/<locale>/about-us/guest-stories/` — real guests, their photos, their words.
 * One document per locale (content/guestStoriesPage/<locale>.json).
 *
 * Each story is a full-width photo with a short quote over it, then the full
 * quote next to a photo slider. Square brackets in the English file, like
 * "[GROUP]", mark details still to be filled in by an editor.
 */
const guestStoriesPage: Collection = {
  name: "guestStoriesPage",
  label: "Guest Stories page",
  path: "content/guestStoriesPage",
  format: "json",
  ui: {
    router: localeRouter("about-us/guest-stories/"),
    allowedActions: { delete: false },
  },
  fields: [
    { type: "string", name: "title", label: "Heading (h1)", required: true },
    { type: "string", name: "lede", label: "Introduction text", ui: textarea },
    { type: "image", name: "heroImage", label: "Hero photo (behind the heading at the top of the page)" },
    { type: "string", name: "heroImageAlt", label: "Hero photo alt text", description: "Describe the photo for someone who cannot see it." },
    {
      type: "object",
      name: "stories",
      label: "Stories",
      description: "One block per guest story, shown in this order.",
      list: true,
      ui: {
        itemProps: (item: Record<string, string>) => ({ label: item?.name || "New story" }),
      },
      fields: [
        { type: "image", name: "heroImage", label: "Hero photo (full width, top of the story)" },
        { type: "string", name: "heroImageAlt", label: "Hero photo alt text", description: "Describe the photo for someone who cannot see it." },
        { type: "string", name: "shortQuote", label: "Short quote (over the big photo)", required: true, ui: textarea },
        {
          type: "string",
          name: "name",
          label: "Guest first name",
          description: "First name only, no surname.",
          required: true,
          ui: { ...doNotTranslate },
        },
        { type: "string", name: "group", label: "Group", description: 'e.g. "Friends", "Family".' },
        { type: "string", name: "place", label: "Place" },
        { type: "string", name: "nights", label: "Nights", description: 'e.g. "7 nights".' },
        { type: "string", name: "monthYear", label: "Month and year", description: 'e.g. "July 2026".' },
        { type: "string", name: "fullQuote", label: "Full quote", required: true, ui: textarea },
        {
          type: "object",
          name: "photos",
          label: "Slider photos",
          description: "4 to 6 photos, all in the same 3:2 shape (landscape).",
          list: true,
          ui: {
            itemProps: (item: Record<string, string>) => ({ label: item?.alt || (item?.image ? "Photo" : "Empty slot — add a photo") }),
            defaultItem: { image: "", alt: "" },
          },
          fields: [
            { type: "image", name: "image", label: "Photo" },
            { type: "string", name: "alt", label: "Alt text", description: "Describe the photo for someone who cannot see it." },
          ],
        },
      ],
    },
    {
      type: "object",
      name: "controls",
      label: "Slider button labels",
      description: "Read aloud by screen readers. Not shown on the page.",
      fields: [
        { type: "string", name: "previousLabel", label: "Previous photo" },
        { type: "string", name: "nextLabel", label: "Next photo" },
        { type: "string", name: "dotLabel", label: "Photo number", description: 'Followed by the number, e.g. "Photo" becomes "Photo 2".' },
      ],
    },
    {
      type: "object",
      name: "cta",
      label: "Closing banner",
      fields: [
        { type: "string", name: "title", label: "Heading", required: true },
        { type: "string", name: "text", label: "Text", ui: textarea },
        ctaField("button", "Button"),
      ],
    },
    seoField(),
  ],
};

export default guestStoriesPage;
