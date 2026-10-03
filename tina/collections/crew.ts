import type { Collection } from "tinacms";
import { ctaField, depthFields, doNotTranslate, localeRouter, sectionHeadFields, tags, textarea } from "../shared/fields";

/**
 * Homepage section 3 (`#crew`) is split in two collections:
 *   crewSection — the section's own copy (one document per locale)
 *   crew        — one document per crew member, content/crew/<locale>/<slug>.json
 * Members get their own documents because the "Passionate Sea People" page
 * (tina/collections/crewPage.ts, /<locale>/passionate-sea-people/) lists the
 * same people.
 *
 * Each member is one "complete" record. Two cards render from it:
 *   - the home slider's summary card: photo, quote, name, first role, and a
 *     button that opens the complete card in a modal;
 *   - the complete card (modal on home, grid on the Passionate Sea People
 *     page): everything below.
 * The small labels both cards print ("Meet", "Close", "years in the role"...)
 * are crewSection fields so they translate with the rest of the section.
 */
export const crewSection: Collection = {
  name: "crewSection",
  label: "Home / Crew section",
  path: "content/crewSection",
  format: "json",
  ui: {
    router: localeRouter("#crew"),
    allowedActions: { delete: false },
  },
  fields: [
    ...depthFields(),
    ...sectionHeadFields(),
    { type: "string", name: "intro", label: "Intro paragraph (above the slider)", ui: textarea },
    {
      type: "string",
      name: "rolesIntro",
      label: "Second paragraph (below the slider)",
      ui: textarea,
    },
    ctaField("cta", "Button below the slider"),
    {
      type: "string",
      name: "dotsLabel",
      label: "Slider dots (accessible label, not visible text)",
      description: 'Read out before each dot\'s number, e.g. "Go to crew member" -> "Go to crew member 2".',
    },
    // Labels printed by the summary + complete crew cards (see the crew
    // collection below). Kept here, not on each member, so there is one
    // version per language.
    {
      type: "string",
      name: "meetLabel",
      label: "Card button — text before the name",
      description: 'The button reads "<this> <first name> →", e.g. "Meet" -> "Meet Adly →". (A name written like Mohamed “Adly” uses the part in quotes.)',
    },
    { type: "string", name: "closeLabel", label: "Close button (accessible label, not visible text)", description: 'e.g. "Close".' },
    { type: "string", name: "yearsLabel", label: "Years of experience, plural", description: 'Printed after the number, e.g. "years in the role".' },
    { type: "string", name: "yearLabel", label: "Years of experience, singular (1)", description: 'e.g. "year in the role".' },
    { type: "string", name: "readMoreLabel", label: "\"Keep reading\" link (opens History and Why)", description: 'e.g. "Keep reading →".' },
    { type: "string", name: "historyLabel", label: "Heading above the History text", description: 'e.g. "History".' },
    { type: "string", name: "whyLabel", label: "Heading above the Why text", description: 'e.g. "Why I do this".' },
  ],
};

export const crew: Collection = {
  name: "crew",
  label: "Crew members",
  path: "content/crew",
  format: "json",
  ui: {
    // Every member used to route to the SAME `/<locale>/#crew` (the
    // homepage's crew slider), which is a shared URL across all 11
    // documents — TinaCMS's admin can't tell them apart from that alone
    // (see the comment in navigation.ts for the underlying mechanism),
    // which is why clicking any crew member could land on some other
    // member's, or even another collection's, form. Each member now routes
    // to their OWN full card on the Passionate Sea People page
    // (CrewPage.astro gives each one id={member._sys.filename}), which is
    // also the richer of the two places a crew member appears — every
    // field (skills, languages, history, why...) is click-to-edit there,
    // not just the homepage's summary card.
    router: ({ document }) => {
      const [locale, slug] = document._sys.breadcrumbs;
      return `/${locale}/passionate-sea-people/#${slug}`;
    },
    filename: { slugify: (values) => (values?.name ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-") },
  },
  fields: [
    {
      type: "string",
      name: "name",
      label: "Name",
      required: true,
      isTitle: true,
      ui: doNotTranslate,
      description:
        'A proper noun — the translation Action copies it through untouched. To use a nickname on the buttons, put it in quotes: Mohamed “Adly” gives "Meet Adly →".',
    },
    {
      type: "string",
      name: "roles",
      label: "Roles (tags)",
      list: true,
      ui: tags,
      description: 'e.g. "Expedition Leader", "Captain". The FIRST role is the headline role shown on the home card.',
    },
    {
      type: "string",
      name: "skills",
      label: "Skills (tags)",
      list: true,
      ui: tags,
      description: 'e.g. "Diving", "Kite", "Freediving".',
    },
    {
      type: "object",
      name: "languages",
      label: "Languages",
      list: true,
      ui: { itemProps: (item: Record<string, any>) => ({ label: item?.language || "Language" }) },
      fields: [
        { type: "string", name: "language", label: "Language", required: true, description: 'e.g. "Arabic".' },
        { type: "string", name: "level", label: "Level (optional)", description: 'e.g. "native", "fluent", "intermediate".' },
        {
          type: "string",
          name: "flag",
          label: "Flag emoji (optional)",
          ui: doNotTranslate,
          description: "Paste the flag emoji shown before the language.",
        },
      ],
    },
    {
      type: "string",
      name: "certificates",
      label: "Certificates (tags)",
      list: true,
      ui: tags,
      description: 'e.g. "PADI OWSI", "IKO Instructor", "STCW".',
    },
    { type: "number", name: "yearsOfExperience", label: "Years of experience", description: 'Shown as "<number> years in the role".' },
    { type: "string", name: "quote", label: "Quote", ui: textarea, description: "One line, shown on the photo. Leave the quote marks out." },
    { type: "string", name: "about", label: "About me", ui: textarea, description: "A blank line starts a new paragraph." },
    { type: "string", name: "history", label: "History", ui: textarea, description: "Shown after \"Keep reading\". A blank line starts a new paragraph." },
    { type: "string", name: "why", label: "Why", ui: textarea, description: "Shown after \"Keep reading\". A blank line starts a new paragraph." },
    { type: "image", name: "image", label: "Photo" },
    { type: "string", name: "imageAlt", label: "Photo alt text" },
    {
      type: "string",
      name: "joiningTag",
      label: "\"Joining\" tag (optional)",
      description: 'Shows a pill on the photo, e.g. "Joining Q4 2026". Leave blank for active crew.',
    },
    {
      type: "number",
      name: "order",
      label: "Position",
      description: "Lower numbers first, on the home slider and the Passionate Sea People page. Sorted by this, then by name.",
    },
  ],
};
