import type { Collection } from "tinacms";
import { textarea } from "../shared/fields";

/**
 * The cookie banner (src/components/CookieBanner.astro) and the placeholder
 * shown in place of a third-party embed until the visitor allows it
 * (src/components/ConsentEmbed.astro). One document per language
 * (content/cookieConsent/en.json).
 *
 * What each category actually loads is code, not copy (src/lib/consent.ts):
 * the descriptions here must stay true to it. If a new tracker or embed is
 * added, update the matching description and the privacy policy.
 */
const category = (name: string, label: string, example: string) => ({
  type: "object" as const,
  name,
  label,
  fields: [
    { type: "string" as const, name: "label", label: "Name", required: true },
    { type: "string" as const, name: "description", label: "What it does", ui: textarea, description: example },
  ],
});

const cookieConsent: Collection = {
  name: "cookieConsent",
  label: "Cookie banner",
  path: "content/cookieConsent",
  format: "json",
  fields: [
    { type: "string", name: "title", label: "Heading", required: true, description: 'Short, e.g. "Cookies".' },
    {
      type: "string",
      name: "text",
      label: "Text",
      ui: textarea,
      required: true,
      description: "What the site would like to use and why. Keep it to two sentences. The privacy policy link follows it.",
    },
    { type: "string", name: "privacyLinkLabel", label: "Privacy policy link text", required: true },
    { type: "string", name: "acceptLabel", label: '"Accept all" button', required: true },
    { type: "string", name: "rejectLabel", label: '"Reject all" button', required: true },
    { type: "string", name: "chooseLabel", label: '"Choose" button', required: true, description: "Opens the list of choices below." },
    { type: "string", name: "saveLabel", label: '"Save my choices" button', required: true },
    {
      type: "object",
      name: "necessary",
      label: "Always on",
      fields: [
        { type: "string", name: "label", label: "Name", required: true },
        {
          type: "string",
          name: "description",
          label: "What it does",
          ui: textarea,
          description: "What the site keeps in the browser without asking: the visitor's cookie choice and the trip form's saved draft.",
        },
        { type: "string", name: "alwaysOnLabel", label: '"Always on" note', description: 'Shown instead of a switch, e.g. "Always on".' },
      ],
    },
    category("analytics", "Analytics", "Google Analytics: which pages are visited, so we can improve the site."),
    category("marketing", "Marketing", "Meta (Facebook, Instagram) Pixel: measuring our ads."),
    category("embeds", "Embedded content", "Trip proposals from Mogu and forms from Tally, which may set their own cookies."),
    {
      type: "object",
      name: "embedPlaceholder",
      label: "Blocked embed placeholder",
      description: "Shown in place of a Mogu trip proposal or a Tally form until the visitor allows embedded content.",
      fields: [
        {
          type: "string",
          name: "text",
          label: "Text",
          ui: textarea,
          description: 'Write {provider} where the service\'s name goes, e.g. "This content is provided by {provider}, which may set cookies."',
        },
        { type: "string", name: "loadLabel", label: '"Load content" button', description: "Allows embedded content on the whole site." },
        { type: "string", name: "openLabel", label: '"Open in a new tab" link', description: "Write {provider} where the service's name goes." },
      ],
    },
  ],
};

export default cookieConsent;
