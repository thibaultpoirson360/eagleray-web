import type { Collection } from "tinacms";
import { textarea } from "../shared/fields";

/**
 * `/en/contact` — the "Talk with us" page. Built from a wireframe, not
 * source: index.html/styles.css/main.js have no contact-page markup or
 * form logic at all (grepped for "contact"/"whatsapp"/"how did you find"
 * — nothing beyond the funnel's own WhatsApp step and footer links).
 * Same per-locale-single-doc pattern as hero/difference (content/contactPage/en.json).
 *
 * The WhatsApp card's link is deliberately NOT a stored field here — it's
 * computed from siteSettings.contact.whatsapp at render time, same single
 * source of truth Footer.astro already uses, so there's only ever one
 * WhatsApp number to keep in sync. Same reasoning for the Expedition
 * Builder card linking to the homepage's #customize funnel: that's a
 * routing fact, not editorial copy.
 */
const contactPage: Collection = {
  name: "contactPage",
  label: "Contact page",
  path: "content/contactPage",
  format: "json",
  fields: [
    { type: "string", name: "title", label: "Heading", required: true },
    { type: "string", name: "lede", label: "Lede", ui: textarea },
    { type: "image", name: "photo", label: "Photo" },
    { type: "string", name: "photoAlt", label: "Photo alt text" },
    {
      type: "object",
      name: "form",
      label: "Contact form",
      fields: [
        { type: "string", name: "namePlaceholder", label: "\"Name\" field placeholder", required: true },
        { type: "string", name: "emailPlaceholder", label: "\"Email\" field placeholder", required: true },
        {
          type: "string",
          name: "howFoundPlaceholder",
          label: "\"How did you find us?\" field placeholder",
          required: true,
        },
        { type: "string", name: "messagePlaceholder", label: "\"Message\" field placeholder", required: true },
        { type: "string", name: "submitLabel", label: "Submit button label", required: true },
        { type: "string", name: "sendingLabel", label: "Submit button label while sending", required: true },
        { type: "string", name: "successMessage", label: "Message shown after a successful send", ui: textarea },
        {
          type: "string",
          name: "errorMessage",
          label: "Message shown if sending fails",
          ui: textarea,
        },
      ],
    },
    {
      type: "object",
      name: "whatsappCard",
      label: "\"Direct WhatsApp\" card",
      fields: [
        { type: "string", name: "label", label: "Label", required: true },
        { type: "string", name: "description", label: "Description", ui: textarea },
      ],
    },
    {
      type: "object",
      name: "expeditionCard",
      label: "\"Expedition Builder\" card",
      fields: [
        { type: "string", name: "label", label: "Label", required: true },
        { type: "string", name: "description", label: "Description", ui: textarea },
      ],
    },
  ],
};

export default contactPage;
