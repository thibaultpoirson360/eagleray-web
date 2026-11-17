import type { Collection, TinaField } from "tinacms";
import { ctaField, textarea } from "../shared/fields";

/**
 * THE template for private proposals ("cinematic" style: a full-screen opening
 * photo, wide sections, big photos, one font). One document per proposal, in
 * the client's language: content/groupProposal/<locale>/<slug>.json, shown at
 * `/<locale>/proposals/<slug>/`. Private: no menu entry, `noindex`, not in the
 * sitemap, and a long random file name as the only key. Every section is
 * optional: leave a section empty and it does not appear. One boat shows as a
 * single panel; two or more show as tabs, the first one tagged (for example
 * "Recommended").
 *
 * Photo lists keep their empty slots on purpose: an editor fills them in from
 * the editor, and an empty slot shows as a quiet box the editor can click.
 */
const photos = (name: string, label: string, description?: string): TinaField => ({
  type: "object",
  name,
  label,
  description,
  list: true,
  ui: { itemProps: (item: Record<string, string>) => ({ label: item?.caption || item?.alt || item?.image || "Empty photo slot" }), defaultItem: { image: "", alt: "", caption: "" } },
  fields: [
    { type: "image", name: "image", label: "Photo" },
    { type: "string", name: "alt", label: "Description (alt text)" },
    { type: "string", name: "caption", label: "Caption under the photo", description: "Optional. Shown under the photo, also while the slot is still empty." },
  ],
});

const groupProposal: Collection = {
  name: "groupProposal",
  label: "Private proposals",
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
      name: "notice",
      label: "Notice under the opening photo (optional)",
      description: "A thin bar for urgency: limited places, the date the proposal expires.",
      fields: [
        { type: "string", name: "availability", label: "Availability" },
        { type: "string", name: "expires", label: "Expiry" },
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
        photos("photos", "Photos (optional)"),
      ],
    },
    {
      type: "object",
      name: "about",
      label: "Who we are (optional)",
      fields: [
        { type: "string", name: "eyebrow", label: "Small label" },
        { type: "string", name: "title", label: "Title", required: true },
        { type: "string", name: "text", label: "Text", ui: textarea },
        { type: "string", name: "quote", label: "Highlighted sentence" },
        { type: "image", name: "image", label: "Wide photo under the text" },
        { type: "string", name: "imageAlt", label: "Photo description (alt text)" },
      ],
    },
    {
      type: "object",
      name: "scenes",
      label: "A day on board, full screen (optional)",
      description: "A pinned full-screen scene whose photo, time, title and text change as the visitor scrolls.",
      fields: [
        { type: "string", name: "eyebrow", label: "Small label" },
        { type: "string", name: "title", label: "Title" },
        { type: "string", name: "note", label: "Note" },
        {
          type: "object",
          name: "items",
          label: "Moments",
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
      name: "days",
      label: "3. The days",
      fields: [
        { type: "string", name: "title", label: "Title", required: true },
        { type: "string", name: "text", label: "Text", ui: textarea, description: "Separate paragraphs with a blank line." },
        { type: "string", name: "note", label: "Small note" },
        photos("photos", "Photos"),
        photos("gallery", "Gallery under the photos", "Empty slots with a caption, to fill in."),
      ],
    },
    {
      type: "object",
      name: "itinerary",
      label: "Day by day (optional)",
      fields: [
        { type: "string", name: "eyebrow", label: "Small label" },
        { type: "string", name: "title", label: "Title", required: true },
        { type: "string", name: "intro", label: "Text under the title", ui: textarea },
        {
          type: "object",
          name: "days",
          label: "Days",
          list: true,
          ui: { itemProps: (item: Record<string, string>) => ({ label: `${item?.label ?? ""} · ${item?.title ?? ""}` }) },
          fields: [
            { type: "string", name: "label", label: "Day label", required: true },
            { type: "string", name: "title", label: "Day title", required: true },
            {
              type: "object",
              name: "moments",
              label: "Moments",
              list: true,
              ui: { itemProps: (item: Record<string, string>) => ({ label: item?.time }) },
              fields: [
                { type: "string", name: "time", label: "Time of day", required: true },
                { type: "string", name: "text", label: "Text", ui: textarea },
              ],
            },
            photos("photos", "Photos"),
          ],
        },
      ],
    },
    {
      type: "object",
      name: "route",
      label: "Route and map (optional)",
      description: "The map of La Paz and Espíritu Santo with the stops drawn on it.",
      fields: [
        { type: "string", name: "eyebrow", label: "Small label" },
        { type: "string", name: "title", label: "Title", required: true },
        { type: "string", name: "dates", label: "Dates line" },
        {
          type: "object",
          name: "stops",
          label: "Stops, in order",
          description: "The map draws the route up to the farthest stop.",
          list: true,
          ui: { itemProps: (item: Record<string, string>) => ({ label: item?.name }) },
          fields: [
            { type: "string", name: "name", label: "Place", required: true },
            { type: "string", name: "sub", label: "Detail" },
            { type: "number", name: "lat", label: "Latitude", description: "e.g. 24.296. Fill in latitude and longitude for every stop to draw the map of La Paz and Espíritu Santo. Leave both empty for a trip outside that area: the stops show as a list and you add the map as a photo." },
            { type: "number", name: "lon", label: "Longitude", description: "e.g. -110.335" },
          ],
        },
        { type: "string", name: "facts", label: "Highlights", list: true },
        { type: "string", name: "note", label: "Note under the route", ui: textarea },
        { type: "string", name: "mapLabel", label: "Map description (for screen readers)" },
        { type: "string", name: "credit", label: "Map credit", description: "Keep the OpenStreetMap credit." },
        photos("photos", "Photos under the map", "For a trip outside the drawn area, put the route map here as a photo: it is shown whole, not cropped."),
      ],
    },
    {
      type: "object",
      name: "dive",
      label: "Extra activities (optional)",
      fields: [
        { type: "string", name: "title", label: "Title", required: true },
        { type: "string", name: "text", label: "Text", ui: textarea },
        {
          type: "string",
          name: "activities",
          label: "Extra activity cards (names from Sail with Us)",
          list: true,
          description: "Type the activity names exactly as on the Sail with Us page, e.g. 'Scuba diving', 'Kite', 'Wine selection'. The cards, photos and texts come from that page, so they are edited there.",
        },
      ],
    },
    {
      type: "object",
      name: "boats",
      label: "4. The boat, price and how to book",
      description: "One boat shows as a single panel. Two or more show as tabs, the first one first.",
      fields: [
        { type: "string", name: "title", label: "Title above the tabs", description: "Only shown when there are two or more boats." },
        { type: "string", name: "choose", label: "Label above the tabs" },
        ctaField("button", "Booking button (shown in each price box)"),
        {
          type: "object",
          name: "options",
          label: "Boats",
          list: true,
          ui: { itemProps: (item: Record<string, string>) => ({ label: item?.name }) },
          fields: [
            { type: "string", name: "tag", label: "Tag", description: "e.g. 'Recommended'. Shown above the boat's name." },
            { type: "string", name: "name", label: "Boat name", required: true },
            { type: "string", name: "intro", label: "Intro", ui: textarea },
            photos("gallery", "Boat photos", "The first one is the big photo; the rest sit below it."),
            { type: "string", name: "specs", label: "Specs line" },
            { type: "string", name: "features", label: "Features", list: true },
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
              label: "Price box",
              list: true,
              ui: { itemProps: (item: Record<string, string>) => ({ label: item?.label }) },
              fields: [
                { type: "string", name: "label", label: "Payment method or label", required: true },
                { type: "string", name: "total", label: "Total" },
                { type: "string", name: "perPerson", label: "Per person" },
              ],
            },
            { type: "string", name: "priceNote", label: "Line under the price box", ui: textarea },
            { type: "string", name: "note", label: "Small note", description: "e.g. 'or a similar boat'." },
          ],
        },
        { type: "string", name: "note", label: "Note under the boats", ui: textarea },
      ],
    },
    {
      type: "object",
      name: "book",
      label: "How to book (shown under the price)",
      fields: [
        { type: "string", name: "title", label: "Title", required: true },
        { type: "string", name: "text", label: "Text", ui: textarea },
        { type: "string", name: "terms", label: "Terms (one per line)", list: true, description: "Write 'Label: details'. The label is the dropdown's title, the details open under it. A line with no colon is shown as plain text." },
      ],
    },
    {
      type: "object",
      name: "food",
      label: "Food on board (optional)",
      fields: [
        { type: "string", name: "title", label: "Title", required: true },
        { type: "string", name: "text", label: "Text", ui: textarea },
        photos("photos", "Food photos"),
      ],
    },
    {
      type: "object",
      name: "aboard",
      label: "5. What is aboard",
      fields: [
        { type: "string", name: "title", label: "Title", required: true },
        { type: "string", name: "text", label: "Text under the title", ui: textarea },
        { type: "string", name: "onTitle", label: "First column: heading" },
        { type: "string", name: "onBoard", label: "First column: list", list: true },
        { type: "string", name: "offTitle", label: "Second column: heading" },
        { type: "string", name: "notOnBoard", label: "Second column: list", list: true },
        photos("photos", "Photos under the lists"),
      ],
    },
    {
      type: "object",
      name: "crew",
      label: "6. The crew",
      fields: [
        { type: "string", name: "title", label: "Title", required: true },
        { type: "string", name: "text", label: "Text", ui: textarea, description: "Separate paragraphs with a blank line." },
        {
          type: "object",
          name: "leader",
          label: "Expedition Leader profile (optional)",
          fields: [
            { type: "string", name: "member", label: "Crew profile (file name in Crew)", description: "e.g. 'alexis'. Clicking the portrait opens this person's profile, as on Passionate Sea People. With no portrait uploaded here, their photo from Crew is shown." },
            { type: "image", name: "image", label: "Portrait" },
            { type: "string", name: "imageAlt", label: "Portrait description (alt text)" },
            { type: "string", name: "name", label: "Name" },
            { type: "string", name: "role", label: "Role" },
            { type: "string", name: "facts", label: "Facts (shown in a row)", list: true },
            { type: "string", name: "text", label: "Text", ui: textarea },
          ],
        },
        { type: "string", name: "members", label: "Crew cards (file names in Crew, optional)", list: true, description: "e.g. benji, lou. Shown as a slider of cards, each opening the full profile." },
        { type: "string", name: "note", label: "Note under the cards", ui: textarea },
        photos("photos", "Photos"),
      ],
    },
    {
      type: "object",
      name: "practical",
      label: "Good to know (optional)",
      fields: [
        { type: "string", name: "eyebrow", label: "Small label" },
        { type: "string", name: "title", label: "Title", required: true },
        {
          type: "object",
          name: "items",
          label: "Topics",
          list: true,
          ui: { itemProps: (item: Record<string, string>) => ({ label: item?.title }) },
          fields: [
            { type: "string", name: "title", label: "Topic", required: true },
            { type: "string", name: "text", label: "Text", ui: textarea },
            photos("photos", "Photos"),
          ],
        },
      ],
    },
    {
      type: "object",
      name: "faq",
      label: "Questions and answers (optional)",
      fields: [
        { type: "string", name: "eyebrow", label: "Small label" },
        { type: "string", name: "title", label: "Title", required: true },
        {
          type: "object",
          name: "items",
          label: "Questions",
          list: true,
          ui: { itemProps: (item: Record<string, string>) => ({ label: item?.question }) },
          fields: [
            { type: "string", name: "question", label: "Question", required: true },
            { type: "string", name: "answer", label: "Answer", ui: textarea },
          ],
        },
      ],
    },
    {
      type: "object",
      name: "closing",
      label: "8. Closing and booking button",
      fields: [
        { type: "string", name: "title", label: "Title", required: true },
        { type: "string", name: "text", label: "Text", ui: textarea },
        { type: "image", name: "image", label: "Background photo (optional)", description: "With a photo the section is dark, over the photo." },
        { type: "string", name: "buttonLabel", label: "Button text" },
        { type: "string", name: "href", label: "Button link (optional)", description: "For example the Mogu booking page. Leave empty to open WhatsApp instead." },
        { type: "string", name: "message", label: "WhatsApp message", ui: textarea, description: "Written in the chat when the button opens WhatsApp. The number is the one in Site settings." },
        { type: "string", name: "note", label: "Small print under the button", ui: textarea },
        { type: "string", name: "agentLine", label: "Your Eagle Ray contact", description: "e.g. 'Your agent: Angela Idini'." },
        {
          type: "object",
          name: "contacts",
          label: "Contact links",
          list: true,
          ui: { itemProps: (item: Record<string, string>) => ({ label: item?.label }) },
          fields: [
            { type: "string", name: "label", label: "Name", required: true },
            { type: "string", name: "value", label: "Shown as", required: true },
            { type: "string", name: "href", label: "Link", required: true },
          ],
        },
      ],
    },
    { type: "string", name: "legal", label: "Small print at the very bottom", ui: textarea },
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
