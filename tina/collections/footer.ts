import type { Collection } from "tinacms";
import { textarea } from "../shared/fields";

/**
 * Page chrome, not a homepage section — `<footer class="footer">`
 * (index.html L607-654), CSS at styles.css "20. FOOTER" (L2609-2752).
 * Same situation as Nav (tina/collections/navigation.ts): not
 * anticipated by the original schema pass, added because CLAUDE.md's
 * "every component must be editable" rule applies here too.
 *
 * `base.lines` / `coords.lines` are each a list of strings, not a single
 * freeform field with embedded <br>s — the source really is a heading
 * plus N literal lines ("Marina de La Paz<br>La Paz, Baja California
 * Sur<br>Mexico"; "24°12′37.6″ N<br>110°19′ W"), and a list makes that
 * structure explicit for editors instead of asking them to manage
 * meaningful newlines inside a paragraph field.
 *
 * Deliberately NOT duplicated from siteSettings: the "Follow" links'
 * hrefs come from siteSettings.contact (whatsapp/email/instagram) —
 * one source of truth for where they actually go, replacing main.js's
 * initContact(), which patched these same three hrefs at runtime from
 * window.__BRAND__ (build-time Tina data does the same job, better: no
 * flash of the wrong number, works with no JS). Their labels
 * ("Instagram", "WhatsApp", "Email") are hardcoded in Footer.astro, not
 * schema fields — they're platform names, not copy anyone's likely to
 * reword.
 *
 * The two big contact links (phone, email) keep their OWN display-text
 * fields here rather than formatting siteSettings.contact.whatsapp's
 * raw digits into "+52 55 6809 0942" — that assumes a fixed phone
 * format. Their hrefs still derive from siteSettings.contact, so only
 * the *display* text can drift from the number they actually dial;
 * that's the same small, already-accepted tradeoff as Hero's metaLine /
 * Nav's mobileFoot duplicating (not deriving from) siteSettings.coords.
 */
const footer: Collection = {
  name: "footer",
  label: "Site Footer",
  path: "content/footer",
  format: "json",
  match: { include: "index" },
  ui: {
    global: true,
    allowedActions: { create: false, delete: false },
  },
  fields: [
    { type: "string", name: "claim", label: "Claim", required: true },
    {
      type: "string",
      name: "claimEmphasis",
      label: "Claim, italic second line",
      description: "Rendered on its own line inside <em>. Leave blank for a one-line claim.",
    },
    {
      type: "object",
      name: "contactDisplay",
      label: "Contact links (large, top of footer)",
      description: "Display text only — where these actually link to comes from Site Settings > Contact.",
      fields: [
        { type: "string", name: "phone", label: "Phone, formatted for display", description: 'e.g. "+52 55 6809 0942".' },
        { type: "string", name: "email", label: "Email, formatted for display" },
      ],
    },
    {
      type: "object",
      name: "base",
      label: "\"Base\" column",
      fields: [
        { type: "string", name: "heading", label: "Heading", required: true },
        { type: "string", name: "lines", label: "Address lines", list: true },
      ],
    },
    {
      type: "object",
      name: "coords",
      label: "\"Coordinates\" column",
      fields: [
        { type: "string", name: "heading", label: "Heading", required: true },
        { type: "string", name: "lines", label: "Lines", list: true },
      ],
    },
    { type: "string", name: "followHeading", label: "\"Follow\" column heading", required: true },
    {
      type: "object",
      name: "legal",
      label: "Legal line",
      fields: [
        { type: "string", name: "rights", label: "Rights text", description: 'e.g. "All rights reserved".' },
        { type: "string", name: "creditsText", label: "Credits intro text", ui: textarea },
        { type: "string", name: "creditsLabel", label: "Credits link label" },
        { type: "string", name: "termsLabel", label: "Terms link label" },
        { type: "string", name: "privacyLabel", label: "Privacy link label" },
      ],
    },
  ],
};

export default footer;
