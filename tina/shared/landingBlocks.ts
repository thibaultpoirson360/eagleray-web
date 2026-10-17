import type { TinaField } from "tinacms";
import { ctaField, textarea } from "./fields";

/**
 * The page-builder "blocks" field (hero, rich text, image gallery, call to
 * action, Mogu trip proposal). Shared by every document that can be built
 * from blocks: landing pages (tina/collections/landingPage.ts) and the nav
 * placeholder pages (tina/collections/navPages.ts), so both offer the same
 * blocks and the same renderers (src/components/landing/).
 */
export const landingBlocksField = (): TinaField => (
  {
    type: "object",
    name: "blocks",
    label: "Page content blocks",
    list: true,
    ui: {
      itemProps: (item: Record<string, any>) => ({
        label: item?.title || item?.tripSlug || item?.heading || item?.primaryLabel || (item?._template === "funnel" ? "Trip planning form" : "Block"),
      }),
    },
    templates: [
      {
        name: "hero",
        label: "Hero banner",
        ui: { defaultItem: { title: "New hero banner" } },
        fields: [
          { type: "string", name: "kicker", label: "Kicker (small label above the title)" },
          { type: "string", name: "title", label: "Title", required: true },
          { type: "string", name: "lede", label: "Lede", ui: textarea },
          { type: "image", name: "image", label: "Background image" },
          { type: "string", name: "imageAlt", label: "Background image alt text" },
          ctaField("cta", "Button"),
        ],
      },
      {
        name: "richText",
        label: "Rich text",
        fields: [{ type: "rich-text", name: "body", label: "Content", required: true }],
      },
      {
        name: "imageGallery",
        label: "Image gallery",
        ui: { defaultItem: { images: [] } },
        fields: [
          {
            type: "object",
            name: "images",
            label: "Images",
            list: true,
            ui: {
              itemProps: (item: Record<string, string>) => ({ label: item?.alt || "Image" }),
            },
            fields: [
              { type: "image", name: "image", label: "Image" },
              { type: "string", name: "alt", label: "Alt text" },
              { type: "string", name: "href", label: "Link (optional)" },
            ],
          },
        ],
      },
      {
        name: "cta",
        label: "Call to action banner",
        ui: { defaultItem: { title: "New call to action" } },
        fields: [
          { type: "string", name: "title", label: "Heading", required: true },
          { type: "string", name: "lede", label: "Supporting line", ui: textarea },
          ctaField("cta", "Button"),
        ],
      },
      {
        name: "departures",
        label: "Trip options (cards with dates, boat, price and buttons)",
        fields: [
          { type: "string", name: "title", label: "Heading", required: true },
          { type: "string", name: "intro", label: "Text under the heading", ui: textarea },
          {
            type: "object",
            name: "options",
            label: "Options (one card each)",
            list: true,
            ui: { itemProps: (item: Record<string, any>) => ({ label: item?.name || "Option" }) },
            fields: [
              { type: "string", name: "name", label: "Name", required: true },
              { type: "string", name: "dates", label: "Dates", description: 'e.g. "Sunday, November 22 → Wednesday, November 25 · 3 nights"' },
              { type: "string", name: "boatLine", label: "Boat line", description: 'e.g. "Lagoon 450F catamaran · 3 guest cabins · up to 6 guests"' },
              { type: "string", name: "description", label: "Short description (2 sentences)", ui: textarea },
              { type: "string", name: "priceSummary", label: "Price shown on the card", description: 'e.g. "From 4,000 USD, solo cabin"' },
              { type: "string", name: "detailsLabel", label: "Words on the opening line", description: 'e.g. "Prices and how it works"' },
              {
                type: "object",
                name: "priceRows",
                label: "Price lines (shown when the card opens)",
                list: true,
                ui: { itemProps: (item: Record<string, any>) => ({ label: item?.label || "Price" }) },
                fields: [
                  { type: "string", name: "label", label: "What", required: true },
                  { type: "string", name: "amount", label: "Price", required: true },
                ],
              },
              { type: "string", name: "detailsText", label: "How this option works (shown when the card opens)", ui: textarea },
              {
                type: "object",
                name: "images",
                label: "Photos (several make a slider)",
                list: true,
                ui: { itemProps: (item: Record<string, any>) => ({ label: item?.alt || "Photo" }) },
                fields: [
                  { type: "image", name: "image", label: "Photo" },
                  { type: "string", name: "alt", label: "Alt text (describe the photo)" },
                ],
              },
              { type: "image", name: "image", label: "Photo (old single photo; use the list above)" },
              { type: "string", name: "imageAlt", label: "Photo alt text (old single photo)" },
              { type: "string", name: "imageNote", label: "Text shown while there are no photos", description: 'e.g. "[PENDIENTE]". Not shown once a photo is set.' },
              { type: "string", name: "bookLabel", label: "Main button: words", description: 'e.g. "Book now"' },
              { type: "string", name: "bookHref", label: "Main button: link", description: "The trip's page on Mogu, where booking and payment happen." },
              { type: "string", name: "infoLabel", label: "Second button: words", description: 'e.g. "Contact us for more info"' },
              { type: "string", name: "infoMessage", label: "Second button: message already written in the contact form", ui: textarea },
            ],
          },
          { type: "string", name: "bookingLabel", label: "Booking information: words on the opening line", description: 'e.g. "Info on booking"' },
          { type: "rich-text", name: "bookingInfo", label: "Booking information (deposit, payment dates, cancellation)" },
        ],
      },
      {
        name: "includes",
        label: "What is included / not included (two columns)",
        fields: [
          { type: "string", name: "title", label: "Heading", required: true },
          { type: "string", name: "includedTitle", label: "Left column heading", description: 'e.g. "Included"' },
          { type: "rich-text", name: "included", label: "Left column: included" },
          { type: "string", name: "notIncludedTitle", label: "Right column heading", description: 'e.g. "Not included"' },
          { type: "rich-text", name: "notIncluded", label: "Right column: not included" },
          {
            type: "object",
            name: "gallery",
            label: "Photos under the right column (desktop only, a slider)",
            list: true,
            ui: { itemProps: (item: Record<string, any>) => ({ label: item?.alt || "Photo" }) },
            fields: [
              { type: "image", name: "image", label: "Photo" },
              { type: "string", name: "alt", label: "Alt text (describe the photo)" },
            ],
          },
          { type: "string", name: "galleryNote", label: "Text shown while there are no photos", description: 'e.g. "[PENDIENTE]". Not shown once a photo is set.' },
        ],
      },
      {
        name: "timeline",
        label: "Steps or timeline (route, a day on board…)",
        fields: [
          { type: "string", name: "title", label: "Heading", required: true },
          { type: "string", name: "intro", label: "Text under the heading", ui: textarea },
          {
            type: "object",
            name: "steps",
            label: "Steps (in order)",
            list: true,
            ui: { itemProps: (item: Record<string, any>) => ({ label: item?.stepTitle || "Step" }) },
            fields: [
              { type: "string", name: "stepLabel", label: "Small label (e.g. time of day, or day)" },
              { type: "string", name: "stepTitle", label: "Title", required: true },
              { type: "string", name: "stepText", label: "Text", ui: textarea },
              { type: "image", name: "stepImage", label: "Photo (shown beside the step on desktop)" },
              { type: "string", name: "stepImageAlt", label: "Photo alt text" },
              { type: "string", name: "stepImageNote", label: "Text shown while there is no photo", description: 'e.g. "[PENDIENTE]". Not shown once a photo is set.' },
            ],
          },
          { type: "string", name: "footnote", label: "Note under the steps", ui: textarea },
        ],
      },
      {
        name: "feature",
        label: "Activity with a big photo and a \"more about it\" that opens",
        fields: [
          { type: "string", name: "title", label: "Heading", required: true },
          { type: "string", name: "lede", label: "Short line under the heading (e.g. a tagline)" },
          { type: "string", name: "blurb", label: "Text (2 or 3 sentences)", ui: textarea },
          {
            type: "object",
            name: "photos",
            label: "Big photo (several make a slider)",
            list: true,
            ui: { itemProps: (item: Record<string, any>) => ({ label: item?.alt || "Photo" }) },
            fields: [
              { type: "image", name: "image", label: "Photo" },
              { type: "string", name: "alt", label: "Alt text (describe the photo)" },
            ],
          },
          { type: "string", name: "photoNote", label: "Text shown while there are no photos", description: 'e.g. "[PENDIENTE]". Not shown once a photo is set.' },
          { type: "string", name: "moreLabel", label: "Words on the line that opens the details", description: 'e.g. "More about spearfishing"' },
          { type: "rich-text", name: "more", label: "Details (closed until the visitor opens them)" },
        ],
      },
      {
        name: "crewShowcase",
        label: "Crew: big heading with a slider of crew cards",
        fields: [
          { type: "string", name: "title", label: "Heading", required: true },
          { type: "string", name: "titleEmphasis", label: "Second line of the heading" },
          { type: "string", name: "blurb", label: "Text next to the heading", ui: textarea },
          { type: "string", name: "linkLabel", label: "Link under the text: words (optional)" },
          { type: "string", name: "linkHref", label: "Link under the text: address (optional)" },
          {
            type: "string",
            name: "members",
            label: "Crew members in the slider (file names, in order)",
            list: true,
            description: 'Each one is the member\'s file name in Crew, e.g. "benji", "antoine", "sergio-torres-canei".',
          },
          { type: "string", name: "note", label: "Note under the slider", ui: textarea },
        ],
      },
      {
        name: "actions",
        label: "Two buttons (a main one and a \"more info\" one)",
        fields: [
          { type: "string", name: "heading", label: "Short line above the buttons (optional)" },
          { type: "string", name: "primaryLabel", label: "Main button: words", description: 'e.g. "Book now"' },
          { type: "string", name: "primaryHref", label: "Main button: link" },
          { type: "string", name: "secondaryLabel", label: "Second button: words", description: 'e.g. "Contact us for more info"' },
          { type: "string", name: "secondaryMessage", label: "Second button: message already written in the contact form", ui: textarea, description: "The second button opens the contact form with this message." },
        ],
      },
      {
        name: "faq",
        label: "Questions and answers (open and close)",
        fields: [
          { type: "string", name: "title", label: "Heading", required: true },
          {
            type: "object",
            name: "questions",
            label: "Questions",
            list: true,
            ui: { itemProps: (item: Record<string, any>) => ({ label: item?.question || "Question" }) },
            fields: [
              { type: "string", name: "question", label: "Question", required: true },
              { type: "string", name: "answer", label: "Answer", ui: textarea },
            ],
          },
        ],
      },
      {
        name: "memberProfile",
        label: "Team member profile (text on the left, crew card on the right)",
        fields: [
          {
            type: "string",
            name: "member",
            label: "Crew member (file name)",
            required: true,
            description: 'The member\'s file name in Crew, e.g. "monique", "sergio-torres-canei", "lou". Their photos, quote and tags show on the right; their "about" text follows your text on the left.',
          },
          { type: "rich-text", name: "body", label: "Text on the left", required: true },
          {
            type: "rich-text",
            name: "moreText",
            label: 'Extra text at the end of "Keep reading" (optional)',
            description: "Closed until the visitor opens \"Keep reading\", after the member's own history and reasons. Good for a short list.",
          },
        ],
      },
      {
        name: "funnel",
        label: "Trip planning form (the \"Build your expedition\" form)",
        fields: [
          {
            type: "string",
            name: "note",
            label: "Note for editors (not shown on the page)",
            description:
              'This block shows the same form as the homepage. Its texts are edited once, under "Home / Customize funnel".',
            ui: textarea,
          },
        ],
      },
      {
        name: "moguProposal",
        label: "Trip proposal (Mogu embed)",
        ui: { defaultItem: { height: 600 } },
        fields: [
          {
            type: "string",
            name: "tripSlug",
            label: "Mogu trip slug",
            required: true,
            description:
              'Only the trip code from Mogu\'s link: the part after /trips/ and before any "?". In https://v2.app.moguplatform.com/trips/baja-sailing-7-days?embed=true the code is "baja-sailing-7-days". It becomes https://v2.app.moguplatform.com/trips/<code>?embed=true.',
            // Mogu answers an unknown or mistyped code with HTTP 200 and a
            // "Page not found" screen INSIDE the frame, so nothing else would
            // ever flag a bad code — catch the common mistake while editing.
            validate: (value: string | undefined) => {
              if (value && !/^[A-Za-z0-9-]+$/.test(value.trim())) {
                return 'Paste only the trip code (letters, numbers and hyphens) — the part of the Mogu link after "/trips/" and before any "?".';
              }
            },
          },
          {
            type: "boolean",
            name: "hideLogo",
            label: "Hide Mogu's logo bar",
            description: "Adds &hideLogo=true to the embed.",
          },
          {
            type: "boolean",
            name: "hideTitle",
            label: "Hide the trip title",
            description: "Adds &hideTitle=true to the embed.",
          },
          {
            type: "number",
            name: "height",
            label: "Embed height (px)",
            description: "Defaults to 600 if left blank.",
          },
          {
            type: "string",
            name: "iframeTitle",
            label: "Embed name (accessible label, not visible text)",
            description: 'Read by screen readers to name the embedded proposal. Defaults to "Trip proposal" if left blank.',
          },
        ],
      },
      {
        name: "moguHero",
        label: "Trip proposal, full screen (first block: header floats over it)",
        ui: { defaultItem: { tripSlug: "" } },
        fields: [
          {
            type: "string",
            name: "tripSlug",
            label: "Mogu trip slug",
            required: true,
            description:
              'Only the trip code from Mogu\'s link: the part after /trips/ and before any "?". The frame fills the screen height.',
            validate: (value: string | undefined) => {
              if (value && !/^[A-Za-z0-9-]+$/.test(value.trim())) {
                return 'Paste only the trip code (letters, numbers and hyphens) — the part of the Mogu link after "/trips/" and before any "?".';
              }
            },
          },
          { type: "boolean", name: "hideLogo", label: "Hide Mogu's logo bar" },
          { type: "boolean", name: "hideTitle", label: "Hide the trip title" },
          {
            type: "string",
            name: "iframeTitle",
            label: "Embed name (accessible label, not visible text)",
            description: 'Defaults to "Trip proposal" if left blank.',
          },
        ],
      },
    ],
  }
);
