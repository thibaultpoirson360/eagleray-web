import type { TinaField } from "tinacms";
import { ctaField, doNotTranslate, textarea } from "./fields";

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
          {
            type: "boolean",
            name: "calm",
            label: "Calm style: full screen, text centered",
            description: "For invitations and events. Leave off for the usual banner with the text at the bottom left.",
          },
          {
            type: "boolean",
            name: "ctaOnThisPage",
            label: 'Button goes to a section of this page (link like "#confirm")',
            description: "Turn on when the button link starts with # and points to a section of this same page.",
          },
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
              { type: "boolean", name: "featured", label: "Large card (shown first, across the full width, photo beside the text)", description: "Use it for the main option. With no large card and three options, the cards sit side by side." },
              { type: "string", name: "dates", label: "Dates", description: 'e.g. "Sunday, November 22 → Wednesday, November 25 · 3 nights"' },
              { type: "string", name: "boatLine", label: "Boat line", description: 'e.g. "Lagoon 450F catamaran · 3 guest cabins · up to 6 guests"' },
              { type: "string", name: "description", label: "Short description (2 sentences)", ui: textarea },
              { type: "string", name: "deadline", label: "Booking deadline line (optional)", description: 'e.g. "Book by November 5". Shown under the price.' },
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
                  { type: "image", name: "video", label: "Video (optional, MP4)", description: "Short, silent, a few MB. It plays in the slider in place of this photo; the photo shows while it loads." },
                ],
              },
              { type: "image", name: "image", label: "Photo (old single photo; use the list above)" },
              { type: "string", name: "imageAlt", label: "Photo alt text (old single photo)" },
              { type: "string", name: "imageNote", label: "Text shown while there are no photos", description: 'e.g. "[PENDIENTE]". Not shown once a photo is set.' },
              { type: "string", name: "bookLabel", label: "Main button: words", description: 'e.g. "Book now"' },
              { type: "string", name: "bookHref", label: "Main button: link", description: "The trip's page on Mogu, where booking and payment happen." },
              { type: "string", name: "reserveLabel", label: "Reserve button: words (optional)", description: 'e.g. "Reserve now". Goes to the trip\'s online booking page.' },
              { type: "string", name: "reserveHref", label: "Reserve button: link", description: "The trip's booking page, where payment happens." },
              { type: "string", name: "infoLabel", label: "Second button: words", description: 'e.g. "Contact us for more info"' },
              { type: "string", name: "infoMessage", label: "Second button: message already written in the contact form", ui: textarea },
            ],
          },
          { type: "boolean", name: "fillPhotos", label: "Photos fill the whole frame (centred, edges may be cropped)", description: "Off: the whole photo is shown with a white border when it does not fit." },
          { type: "string", name: "boatLinkLabel", label: "Link under the boat line to the boats section (optional)", description: 'e.g. "See the boat". Needs a "The boats of the trip" block on the page.' },
          { type: "string", name: "includesLinkLabel", label: 'Link next to the boat link, to "What is included" (optional)', description: 'e.g. "See what is included". Needs a "What is included" block on the page.' },
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
              { type: "image", name: "video", label: "Video (optional, MP4)", description: "Short, silent, a few MB. It plays in the slider in place of this photo; the photo shows while it loads." },
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
          { type: "string", name: "tag", label: "Small tag beside the heading (optional)", description: 'e.g. "Price on request · approx. 360 USD per person per day"' },
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
              { type: "image", name: "video", label: "Video (optional, MP4)", description: "Short, silent, a few MB. It plays in the slider in place of this photo; the photo shows while it loads." },
            ],
          },
          { type: "string", name: "photoNote", label: "Text shown while there are no photos", description: 'e.g. "[PENDIENTE]". Not shown once a photo is set.' },
          { type: "string", name: "moreLabel", label: "Words on the line that opens the details", description: 'e.g. "More about spearfishing"' },
          { type: "rich-text", name: "more", label: "Details (closed until the visitor opens them)" },
          { type: "string", name: "buttonLabel", label: "Button inside the details: words (optional)", description: 'e.g. "Ask about the price". Opens the contact form.' },
          { type: "string", name: "buttonMessage", label: "Button inside the details: message already written in the contact form", ui: textarea },
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
          {
            type: "object",
            name: "photos",
            label: "Photos in the slider instead of crew cards (optional)",
            list: true,
            description: "When photos are added, the slider shows them and the crew cards are not shown.",
            ui: { itemProps: (item: Record<string, any>) => ({ label: item?.alt || "Photo" }) },
            fields: [
              { type: "image", name: "image", label: "Photo" },
              { type: "string", name: "alt", label: "Alt text (describe the photo)" },
              { type: "image", name: "video", label: "Video (optional, MP4)", description: "Short, silent, a few MB. It plays in the slider in place of this photo; the photo shows while it loads." },
            ],
          },
          { type: "string", name: "photoNote", label: "Text shown while there are no photos", description: 'e.g. "[PENDIENTE]". Not shown once a photo is set.' },
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
        name: "tripBoats",
        label: "The boats of the trip (big photos, specs and features)",
        fields: [
          { type: "string", name: "title", label: "Heading", required: true },
          { type: "string", name: "intro", label: "Text under the heading", ui: textarea },
          { type: "string", name: "detailsLabel", label: "Button that opens the full boat details", description: 'e.g. "See full details"' },
          {
            type: "object",
            name: "boatItems",
            label: "Boats (one panel each, in this order)",
            list: true,
            ui: { itemProps: (item: Record<string, any>) => ({ label: item?.boat || "Boat" }) },
            fields: [
              { type: "string", name: "boat", label: "Boat (file name in Boats)", required: true, description: 'e.g. "bay-dreamer" (the Lagoon 450F) or "beneteau-sense-55". Its photos, specs and features come from the Boats collection.' },
              { type: "string", name: "tag", label: "Which departure it is for", description: 'e.g. "Open Cabins · Nov 22 to 25"' },
              { type: "string", name: "tripNote", label: "What applies on this trip (optional)", description: 'e.g. "On this departure: 3 guest cabins · up to 6 guests"' },
              { type: "image", name: "banner", label: "Big wide photo shown first (optional)", description: "A landscape photo across the full width. When set, the slider with all the photos and the information sit below it." },
              { type: "string", name: "bannerAlt", label: "Big wide photo alt text" },
              { type: "string", name: "displayName", label: "Name shown (optional)", description: "Leave empty to use the boat's own name." },
              { type: "string", name: "subtitle", label: "Small line under the name (optional)", description: 'e.g. "Catamaran"' },
              { type: "string", name: "about", label: "Description for this trip (optional)", ui: textarea, description: "Leave empty to use the boat's own description." },
              {
                type: "object",
                name: "specs",
                label: "Specs for this trip (optional)",
                list: true,
                description: "When filled, these replace the boat's own specs. Use them when the trip differs from the boat's data sheet.",
                ui: { itemProps: (item: Record<string, any>) => ({ label: item?.label || "Spec" }) },
                fields: [
                  { type: "string", name: "label", label: "Label", required: true },
                  { type: "string", name: "value", label: "Value", required: true },
                ],
              },
              { type: "string", name: "featureList", label: "Features for this trip (optional)", list: true, description: "When filled, these replace the boat's own features." },
              { type: "string", name: "similarNote", label: "Note under the specs (optional)", description: 'e.g. "Or a similar boat with equal or greater characteristics."' },
            ],
          },
        ],
      },
      {
        name: "cinematicRoute",
        label: "Route with a map (full-screen photos that change as you scroll)",
        fields: [
          { type: "string", name: "title", label: "Heading", required: true },
          { type: "string", name: "intro", label: "Text under the heading", ui: textarea },
          {
            type: "object",
            name: "places",
            label: "Places on the map",
            list: true,
            description: "Each place has a latitude and longitude. The route is drawn through the water between them.",
            ui: { itemProps: (item: Record<string, any>) => ({ label: item?.name || "Place" }) },
            fields: [
              { type: "string", name: "key", label: "Short code (no spaces)", required: true, description: 'e.g. "lapaz". The steps below use it.' },
              { type: "string", name: "name", label: "Name", required: true },
              { type: "string", name: "sub", label: "Small line under the name", description: 'e.g. "Start and finish"' },
              { type: "number", name: "lat", label: "Latitude", required: true, description: "e.g. 24.158" },
              { type: "number", name: "lon", label: "Longitude", required: true, description: "e.g. -110.3245 (negative)" },
            ],
          },
          {
            type: "object",
            name: "trips",
            label: "Trips (one tab each)",
            list: true,
            ui: { itemProps: (item: Record<string, any>) => ({ label: item?.tab || "Trip" }) },
            fields: [
              { type: "string", name: "tab", label: "Tab name", required: true, description: 'e.g. "Dive Day"' },
              {
                type: "object",
                name: "beats",
                label: "Steps (one full-screen scene each, in order)",
                list: true,
                ui: { itemProps: (item: Record<string, any>) => ({ label: item?.title || "Step" }) },
                fields: [
                  { type: "string", name: "label", label: "Small line above the title", description: 'e.g. "Dive Day · November 23"' },
                  { type: "string", name: "title", label: "Title", required: true },
                  { type: "string", name: "text", label: "Text", ui: textarea },
                  { type: "string", name: "night", label: "Night line (optional)", description: 'e.g. "Night at anchor · south of Espíritu Santo"' },
                  { type: "string", name: "from", label: "Starts at (place code)", required: true },
                  { type: "string", name: "via", label: "Passes by (place codes, in order, optional)", list: true },
                  { type: "string", name: "to", label: "Ends at (place code)", required: true },
                  { type: "image", name: "image", label: "Full-screen photo" },
                  { type: "string", name: "imageAlt", label: "Photo alt text" },
                  { type: "string", name: "imageNote", label: "Text shown while there is no photo", description: 'e.g. "[PENDIENTE]". Not shown once a photo is set.' },
                ],
              },
            ],
          },
          { type: "string", name: "mapNote", label: "Note under the map", description: 'e.g. "Proposed route and anchorages. Final plan depends on weather."' },
          { type: "string", name: "footnote", label: "Note under the section", ui: textarea },
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
            type: "boolean",
            name: "collapseAbout",
            label: 'Short version: show only the text above, and put everything else inside "Keep reading"',
            description: "Off: the member's own about text is shown, and \"Keep reading\" opens their history and reasons. On: only your short text is shown.",
          },
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
        name: "eventIntro",
        label: "Event: about us (small label, centered text, closing line)",
        fields: [
          { type: "string", name: "label", label: "Small label above the text" },
          { type: "string", name: "text", label: "Text", ui: textarea },
          { type: "string", name: "closing", label: "Last line, slightly larger, on its own", ui: textarea },
        ],
      },
      {
        name: "eventEvening",
        label: "Event: the evening (text on the left, photos on the right)",
        fields: [
          { type: "string", name: "lines", label: "Lines (one under the other)", list: true },
          { type: "string", name: "note", label: "Smaller line in italics under them", ui: textarea },
          { type: "string", name: "address", label: "Small address line under the text (optional)", ui: textarea },
          { type: "string", name: "linkLabel", label: "Address line: map link words (optional)" },
          { type: "string", name: "linkHref", label: "Address line: map link address (optional)" },
          {
            type: "object",
            name: "photos",
            label: "Photos on the right (the place, the dishes, the wine)",
            list: true,
            description: "Up to 3. The first one is shown larger.",
            ui: { itemProps: (item: Record<string, any>) => ({ label: item?.alt || "Photo" }) },
            fields: [
              { type: "image", name: "image", label: "Photo" },
              { type: "string", name: "alt", label: "Alt text (describe the photo)" },
            ],
          },
        ],
      },
      {
        name: "eventPhotoStrip",
        label: "Event: three photos side by side, with a title and text",
        fields: [
          {
            type: "object",
            name: "photos",
            label: "Photos (three, edge to edge)",
            list: true,
            ui: { itemProps: (item: Record<string, any>) => ({ label: item?.alt || "Photo" }) },
            fields: [
              { type: "image", name: "image", label: "Photo" },
              { type: "string", name: "alt", label: "Alt text (describe the photo)" },
            ],
          },
          { type: "string", name: "title", label: "Title", required: true },
          { type: "string", name: "text", label: "Text (2 or 3 lines)", ui: textarea },
        ],
      },
      {
        name: "eventPeople",
        label: "Event: people slider (photo, first name, role; text and quote over the photo)",
        fields: [
          { type: "string", name: "title", label: "Title", required: true },
          { type: "string", name: "text", label: "Text under the title (2 to 4 lines)", ui: textarea },
          {
            type: "object",
            name: "people",
            label: "People",
            list: true,
            ui: { itemProps: (item: Record<string, any>) => ({ label: item?.name || "Person" }) },
            fields: [
              { type: "image", name: "image", label: "Portrait photo" },
              { type: "string", name: "alt", label: "Alt text (describe the photo)" },
              { type: "string", name: "name", label: "First name", required: true, ui: doNotTranslate },
              { type: "string", name: "role", label: "Role" },
              { type: "string", name: "text", label: "Text shown over the photo (hover or tap)", ui: textarea },
              { type: "string", name: "quote", label: "Quote shown over the photo (hover or tap)", ui: textarea },
            ],
          },
        ],
      },
      {
        name: "eventCards",
        label: "Event: two large image cards with a button",
        fields: [
          {
            type: "object",
            name: "cards",
            label: "Cards (two)",
            list: true,
            ui: { itemProps: (item: Record<string, any>) => ({ label: item?.title || "Card" }) },
            fields: [
              { type: "image", name: "image", label: "Photo" },
              { type: "string", name: "alt", label: "Alt text (describe the photo)" },
              { type: "string", name: "title", label: "Title", required: true },
              ctaField("cta", "Button"),
            ],
          },
        ],
      },
      {
        name: "eventRsvp",
        label: "Event: confirm your place (Tally form)",
        fields: [
          { type: "string", name: "anchor", label: "Section name used by the hero button", description: 'Without the #. If the hero button links to "#confirm", write "confirm".' },
          { type: "string", name: "title", label: "Title", required: true },
          { type: "string", name: "line", label: "Line under the title" },
          {
            type: "string",
            name: "tallyUrl",
            label: "Tally form link",
            description: "The share link of the form in Tally (tally.so/r/...). Answers go to the spreadsheet connected to that form. Nothing shows until a link is set.",
            validate: (value: string | undefined) => {
              if (value && !/^https:\/\/tally\.so\/(r|embed)\/[A-Za-z0-9]+/.test(value.trim())) {
                return "Paste the Tally link, which starts with https://tally.so/r/";
              }
            },
          },
          { type: "string", name: "formTitle", label: "Form name (read by screen readers)" },
          { type: "number", name: "height", label: "Form height (px)", description: "Defaults to 1100. Make it taller if the form is cut off." },
        ],
      },
      {
        name: "eventPlace",
        label: "Event: the place (full-width photo, address and map link)",
        fields: [
          { type: "image", name: "image", label: "Photo" },
          { type: "string", name: "alt", label: "Alt text (describe the photo)" },
          { type: "string", name: "label", label: "Small label" },
          { type: "string", name: "name", label: "Name of the place" },
          { type: "string", name: "address", label: "Address", ui: textarea },
          { type: "string", name: "linkLabel", label: "Map link: words" },
          { type: "string", name: "linkHref", label: "Map link: address" },
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
