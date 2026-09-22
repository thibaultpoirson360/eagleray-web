import type { Collection } from "tinacms";
import { textarea } from "../shared/fields";

/**
 * Singleton mirroring `window.__BRAND__` (lib/manifest.js), one document:
 * content/settings/index.json. Key names match __BRAND__ 1:1 so the eventual
 * `window.__BRAND__` builder in the Astro layout is a straight passthrough.
 *
 * Not localized (brand facts don't vary by language). `ui.global: true` makes
 * it available from the editor's global sidebar on every page; creating or
 * deleting it from the admin is disabled.
 */
const siteSettings: Collection = {
  name: "siteSettings",
  label: "Site Settings",
  path: "content/settings",
  format: "json",
  match: { include: "index" },
  ui: {
    global: true,
    allowedActions: { create: false, delete: false },
  },
  fields: [
    { type: "string", name: "name", label: "Brand name", required: true },
    { type: "string", name: "base", label: "Home base", description: 'e.g. "La Paz, Baja California Sur"' },
    { type: "string", name: "coords", label: "Coordinates", description: 'e.g. "24°12′37.6″ N"' },
    {
      type: "object",
      name: "contact",
      label: "Contact",
      fields: [
        {
          type: "string",
          name: "whatsapp",
          label: "WhatsApp number",
          description: 'Digits only with country code, no "+" or spaces, e.g. "525568090942".',
        },
        { type: "string", name: "email", label: "Contact email" },
        { type: "string", name: "instagram", label: "Instagram URL" },
      ],
    },
    {
      type: "object",
      name: "sounder",
      label: "Depth gauge (sounder)",
      fields: [
        { type: "number", name: "maxDepth", label: "Max depth (m)" },
        { type: "string", name: "surfaceLabel", label: "Label at the surface" },
      ],
    },
    {
      type: "string",
      name: "funnelIntro",
      label: "Funnel WhatsApp intro (fallback)",
      description:
        "Mirrors __BRAND__.funnelIntro. The per-language opening line lives in Home / Customize funnel > WhatsApp message template; this is the fallback.",
      ui: textarea,
    },
    {
      type: "string",
      name: "leadEndpoint",
      label: "Lead-capture endpoint (Formspree)",
      description:
        "Not part of __BRAND__: main.js hardcodes FORMSPREE_ENDPOINT and its own comment says the real form is still pending. Moved here so it is editable; confirm the real endpoint before launch.",
    },
  ],
};

export default siteSettings;
