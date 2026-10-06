import type { Collection, TinaField } from "tinacms";
import { depthFields, localeRouter, optionsField, sectionHeadFields, textarea } from "../shared/fields";

/**
 * Homepage section 6 — `<section id="customize">`: the 4-step "customize your
 * expedition" funnel wizard. This collection holds ALL of its copy (headings,
 * every question and option, button labels, errors, the WhatsApp message
 * template) so the Preact funnel island renders from content and nothing is
 * hardcoded.
 *
 * FIELD NAMES follow the docs/migration-history.md rename table. Each question is keyed by
 * its new English name; those same names are the form input `name`s, the
 * localStorage draft keys and the lead-payload keys:
 *   dias -> tripDuration        quien -> travelingAs      invitados -> guestCount
 *   foco -> routeFocus          prioridad -> topPriority  desde/hasta -> dateFrom/dateTo
 *   fechas_libres -> flexibleDates   barco -> boatPreference
 *   nombre -> fullName          contacto -> whatsappNumber   extra -> notes
 * (`email` was already English.)
 *
 * Behaviour that must NOT move into content (docs/migration-history.md rule 5): partial-lead
 * capture (blur + sendBeacon), localStorage draft autosave/restore, WhatsApp
 * message assembly. Those live in the funnel component; only their strings are here.
 */

const question = (name: string, label: string): TinaField => ({
  type: "object",
  name,
  label,
  fields: [
    { type: "string", name: "question", label: "Question" },
    optionsField("options", "Options"),
  ],
});

const inputField = (name: string, label: string, extra: TinaField[] = []): TinaField => ({
  type: "object",
  name,
  label,
  fields: [
    { type: "string", name: "label", label: "Field label" },
    { type: "string", name: "placeholder", label: "Placeholder" },
    ...extra,
  ],
});

const funnel: Collection = {
  name: "funnel",
  label: "Home / Customize funnel",
  path: "content/funnel",
  format: "json",
  ui: {
    router: localeRouter("#customize"),
    allowedActions: { delete: false },
  },
  fields: [
    ...depthFields(),
    ...sectionHeadFields(),
    { type: "string", name: "lede", label: "Lede paragraph", ui: textarea },
    {
      type: "string",
      name: "escapeText",
      label: "\"Skip the form\" WhatsApp link text",
      description: "The link target is built from Site Settings > contact.whatsapp.",
    },

    // ---- step 1 -----------------------------------------------------------
    {
      type: "object",
      name: "step1",
      label: "Step 1 — Trip basics",
      fields: [
        { type: "string", name: "legend", label: "Step title" },
        question("tripDuration", "How many days (tripDuration)"),
        question("travelingAs", "Who is it for (travelingAs)"),
        {
          type: "object",
          name: "guestCount",
          label: "How many guests (guestCount)",
          fields: [
            { type: "string", name: "question", label: "Question" },
            { type: "number", name: "min", label: "Minimum" },
            { type: "number", name: "max", label: "Maximum" },
            { type: "number", name: "defaultValue", label: "Default" },
            { type: "string", name: "hint", label: "Hint under the stepper", ui: textarea },
            { type: "string", name: "fewerLabel", label: "Minus button accessible label" },
            { type: "string", name: "moreLabel", label: "Plus button accessible label" },
          ],
        },
      ],
    },

    // ---- step 2 -----------------------------------------------------------
    {
      type: "object",
      name: "step2",
      label: "Step 2 — Route & priorities",
      fields: [
        { type: "string", name: "legend", label: "Step title" },
        question("routeFocus", "Which focus (routeFocus)"),
        question("topPriority", "One thing to ask for (topPriority)"),
      ],
    },

    // ---- step 3 -----------------------------------------------------------
    {
      type: "object",
      name: "step3",
      label: "Step 3 — Dates & boat",
      fields: [
        { type: "string", name: "legend", label: "Step title" },
        { type: "string", name: "dateFromLabel", label: "\"From\" label (dateFrom)" },
        { type: "string", name: "dateToLabel", label: "\"To\" label (dateTo)" },
        inputField("flexibleDates", "Free-text dates (flexibleDates)"),
        question("boatPreference", "Boat preference (boatPreference)"),
      ],
    },

    // ---- step 4 -----------------------------------------------------------
    {
      type: "object",
      name: "step4",
      label: "Step 4 — Contact",
      fields: [
        { type: "string", name: "legend", label: "Step title" },
        inputField("fullName", "Name (fullName)", [
          { type: "string", name: "error", label: "Validation error" },
        ]),
        inputField("email", "Email", [
          { type: "string", name: "error", label: "Validation error" },
        ]),
        inputField("whatsappNumber", "WhatsApp number (whatsappNumber)", [
          { type: "string", name: "optionalHint", label: "\"(optional...)\" hint" },
        ]),
        inputField("notes", "Anything else (notes)"),
        { type: "string", name: "privacy", label: "Privacy note" },
      ],
    },

    // ---- wizard chrome ------------------------------------------------------
    {
      type: "object",
      name: "ui",
      label: "Buttons, progress and status text",
      fields: [
        {
          type: "string",
          name: "stepCounter",
          label: "Step counter",
          description: 'Use {n} and {total}, e.g. "Step {n} of {total}".',
        },
        { type: "string", name: "autosaveRestored", label: "Draft restored badge" },
        { type: "string", name: "autosaveSaved", label: "Draft saved badge" },
        { type: "string", name: "back", label: "Back button" },
        { type: "string", name: "continue", label: "Continue button" },
        { type: "string", name: "submit", label: "Submit button" },
        { type: "string", name: "sending", label: "Submit button while sending" },
        { type: "string", name: "submitError", label: "Submit error message", ui: textarea },
        { type: "string", name: "recapTitle", label: "Recap title (step 4)" },
      ],
    },
    {
      type: "object",
      name: "success",
      label: "Success screen",
      fields: [
        { type: "string", name: "title", label: "Title", description: 'The guest\'s name is appended, e.g. "Received — thank you".' },
        { type: "string", name: "body", label: "Body", ui: textarea },
        { type: "string", name: "whatsappButton", label: "WhatsApp button" },
      ],
    },

    // ---- generated WhatsApp message -------------------------------------------
    {
      type: "object",
      name: "whatsappMessage",
      label: "WhatsApp message template",
      description:
        "Strings used to assemble the pre-filled WhatsApp message. Order and formatting stay in code.",
      fields: [
        { type: "string", name: "intro", label: "Opening line", ui: textarea },
        { type: "string", name: "tripDurationLabel", label: "Label: tripDuration" },
        { type: "string", name: "travelingAsLabel", label: "Label: travelingAs" },
        { type: "string", name: "guestCountLabel", label: "Label: guestCount" },
        { type: "string", name: "routeFocusLabel", label: "Label: routeFocus" },
        { type: "string", name: "topPriorityLabel", label: "Label: topPriority" },
        { type: "string", name: "datesLabel", label: "Label: dates" },
        { type: "string", name: "datesFrom", label: "Word: \"from\"" },
        { type: "string", name: "datesToBeConfirmed", label: "Phrase: \"to be confirmed\"" },
        { type: "string", name: "boatPreferenceLabel", label: "Label: boatPreference" },
        { type: "string", name: "fullNameLabel", label: "Label: fullName" },
        { type: "string", name: "emailLabel", label: "Label: email" },
        { type: "string", name: "whatsappNumberLabel", label: "Label: whatsappNumber" },
        { type: "string", name: "notesLabel", label: "Label: notes" },
      ],
    },
  ],
};

export default funnel;
