import type { Collection } from "tinacms";
import { ctaField, textarea } from "../shared/fields";

/**
 * Private trip proposals: one page per client, reached only by a long link
 * that Eagle Ray sends by email (`/<locale>/proposal/<slug>/`). Not in the
 * menu, not in the sitemap, `noindex`. One document per proposal:
 * content/tripProposal/<locale>/<slug>.json — the same multi-document layout
 * as landingPage. The slug is the secret: make it long and random
 * (e.g. antoine-hurel-diciembre-2026-k7f3q9x2m4).
 *
 * The map is not a field: its land outlines are fixed (src/lib/espiritu-santo-map.ts)
 * and the editor only chooses the stops, by latitude and longitude.
 */
const tripProposal: Collection = {
  name: "tripProposal",
  label: "Private proposals",
  path: "content/tripProposal",
  format: "json",
  ui: {
    router: ({ document }) => {
      const [locale, slug] = document._sys.breadcrumbs;
      return `/${locale}/proposal/${slug}`;
    },
  },
  fields: [
    {
      type: "string",
      name: "title",
      label: "Proposal name (for the team)",
      required: true,
      isTitle: true,
      description: "Used as the browser tab title, e.g. 'Propuesta para Antoine Hurel'. Visitors do not see it as a heading.",
    },
    {
      type: "object",
      name: "hero",
      label: "Opening photo",
      fields: [
        { type: "string", name: "kicker", label: "Small line above the title", description: "e.g. place and month." },
        { type: "string", name: "title", label: "Title", required: true },
        { type: "string", name: "lede", label: "Sentence under the title", ui: textarea },
        { type: "string", name: "dates", label: "Dates line", description: "e.g. '3 noches · 11 al 14 de diciembre de 2026'." },
        { type: "image", name: "image", label: "Photo" },
        { type: "string", name: "imageAlt", label: "Photo description (alt text)" },
        { type: "string", name: "buttonLabel", label: "Button text", description: "The button goes to the booking page set at the bottom." },
      ],
    },
    {
      type: "object",
      name: "welcome",
      label: "Personal welcome",
      fields: [
        { type: "string", name: "eyebrow", label: "Small label" },
        { type: "string", name: "title", label: "Title", required: true },
        { type: "string", name: "text", label: "Text", ui: textarea, description: "Separate paragraphs with a blank line." },
        { type: "string", name: "signature", label: "Signature" },
      ],
    },
    {
      type: "object",
      name: "day",
      label: "A day on board",
      fields: [
        { type: "string", name: "eyebrow", label: "Small label" },
        { type: "string", name: "title", label: "Title" },
        { type: "string", name: "note", label: "Note under the title" },
        {
          type: "object",
          name: "scenes",
          label: "Moments of the day",
          list: true,
          ui: { itemProps: (item: Record<string, string>) => ({ label: `${item?.time ?? ""} · ${item?.title ?? ""}` }) },
          fields: [
            { type: "string", name: "time", label: "Time of day", required: true },
            { type: "string", name: "title", label: "Title", required: true },
            { type: "string", name: "text", label: "Text", ui: textarea },
            { type: "image", name: "image", label: "Photo" },
            { type: "string", name: "imageAlt", label: "Photo description (alt text)" },
          ],
        },
      ],
    },
    {
      type: "object",
      name: "route",
      label: "Route and map",
      fields: [
        { type: "string", name: "eyebrow", label: "Small label" },
        { type: "string", name: "title", label: "Title", required: true },
        { type: "string", name: "dates", label: "Dates line" },
        {
          type: "object",
          name: "stops",
          label: "Stops, in order",
          description: "The map draws the route up to the last stop.",
          list: true,
          ui: { itemProps: (item: Record<string, string>) => ({ label: item?.name }) },
          fields: [
            { type: "string", name: "name", label: "Place", required: true },
            { type: "string", name: "sub", label: "Detail", description: "e.g. 'Or Pichilingue'." },
            { type: "number", name: "lat", label: "Latitude", required: true, description: "e.g. 24.296" },
            { type: "number", name: "lon", label: "Longitude", required: true, description: "e.g. -110.335" },
          ],
        },
        { type: "string", name: "facts", label: "Highlights", list: true },
        { type: "string", name: "note", label: "Note under the route", ui: textarea },
        { type: "string", name: "mapLabel", label: "Map description (for screen readers)" },
        { type: "string", name: "mapCredit", label: "Map credit", description: "Keep the OpenStreetMap credit." },
      ],
    },
    {
      type: "object",
      name: "boat",
      label: "Boat options and price",
      fields: [
        { type: "string", name: "eyebrow", label: "Small label" },
        { type: "string", name: "title", label: "Title", required: true },
        { type: "string", name: "choose", label: "Text above the options", description: "e.g. 'Elige tu barco'." },
        { type: "string", name: "priceLabel", label: "Label above the price", description: "e.g. 'Barco completo'." },
        {
          type: "object",
          name: "options",
          label: "Boats",
          list: true,
          ui: { itemProps: (item: Record<string, string>) => ({ label: item?.name }) },
          fields: [
            { type: "string", name: "name", label: "Name", required: true },
            { type: "string", name: "type", label: "Type", description: "e.g. 'Catamarán de 46 pies · Lagoon 450F o similar'." },
            { type: "string", name: "guests", label: "Guests", description: "e.g. 'Hasta 8 invitados'. Leave empty if not confirmed." },
            { type: "string", name: "dates", label: "Dates", description: "e.g. '11 al 14 de diciembre'." },
            { type: "string", name: "price", label: "Price", required: true, description: "As written, e.g. '$23,625 USD'." },
            { type: "string", name: "priceNote", label: "Under the price", description: "e.g. 'Todo el barco, tripulación incluida'." },
            { type: "string", name: "tag", label: "Small tag above the name", description: "e.g. 'Opcional'." },
            { type: "string", name: "boatSlug", label: "Boat (file name in Boats)", description: "Its photos come from the Boats page, e.g. 'bay-dreamer'. Leave empty and add photos below if the boat is not there." },
            { type: "image", name: "banner", label: "Big photo at the top", description: "The wide photo that opens this boat. Empty uses the first photo." },
            { type: "string", name: "bannerAlt", label: "Big photo description (alt text)" },
            { type: "string", name: "about", label: "About this boat", ui: textarea },
            {
              type: "object",
              name: "specs",
              label: "Key facts",
              list: true,
              ui: { itemProps: (item: Record<string, string>) => ({ label: `${item?.label ?? ""}: ${item?.value ?? ""}` }) },
              fields: [
                { type: "string", name: "label", label: "Label", required: true },
                { type: "string", name: "value", label: "Value", required: true },
              ],
            },
            { type: "string", name: "featureList", label: "Features", list: true },
            { type: "string", name: "similarNote", label: "'Or similar' note" },
            {
              type: "object",
              name: "photos",
              label: "Own photos (optional)",
              description: "Only if the boat has no photos in Boats, or to show different ones.",
              list: true,
              ui: { itemProps: (item: Record<string, string>) => ({ label: item?.label }) },
              fields: [
                { type: "image", name: "image", label: "Photo" },
                { type: "string", name: "label", label: "Description (alt text)" },
              ],
            },
          ],
        },
        { type: "string", name: "note", label: "Note under the boats", ui: textarea },
      ],
    },
    {
      type: "object",
      name: "crew",
      label: "Meet the crew",
      fields: [
        { type: "string", name: "title", label: "Title", required: true },
        { type: "string", name: "titleEmphasis", label: "Title, second line" },
        { type: "string", name: "blurb", label: "Text", ui: textarea },
        { type: "string", name: "linkLabel", label: "Link text" },
        { type: "string", name: "linkHref", label: "Link" },
        { type: "string", name: "members", label: "Crew members (file names in Crew)", list: true, description: "e.g. benji, lou, roberto. Shown as cards in this order." },
        { type: "string", name: "note", label: "Note under the cards", ui: textarea },
      ],
    },
    {
      type: "object",
      name: "offer",
      label: "What is included",
      fields: [
        { type: "string", name: "eyebrow", label: "Small label" },
        { type: "string", name: "title", label: "Title", required: true },
        { type: "string", name: "crew", label: "Crew line" },
        { type: "string", name: "includedTitle", label: "Included: heading" },
        { type: "string", name: "included", label: "Included: list", list: true },
        { type: "string", name: "alsoTitle", label: "Also on board: heading" },
        { type: "string", name: "also", label: "Also on board: list", list: true },
        { type: "string", name: "excludedTitle", label: "Not included: heading" },
        { type: "string", name: "excluded", label: "Not included: list", list: true },
        {
          type: "object",
          name: "terms",
          label: "Terms",
          list: true,
          ui: { itemProps: (item: Record<string, string>) => ({ label: item?.label }) },
          fields: [
            { type: "string", name: "label", label: "Label", required: true },
            { type: "string", name: "text", label: "Text", ui: textarea },
          ],
        },
      ],
    },
    {
      type: "object",
      name: "reserve",
      label: "Reserve",
      fields: [
        { type: "string", name: "title", label: "Title", required: true },
        { type: "string", name: "lede", label: "Text", ui: textarea },
        { type: "image", name: "image", label: "Background photo" },
        ctaField("button", "Reserve button"),
        { type: "string", name: "note", label: "Small print under the button", ui: textarea },
        { type: "string", name: "contactLabel", label: "Text before the email", description: "e.g. 'Dudas: escríbenos a'." },
      ],
    },
  ],
};

export default tripProposal;
