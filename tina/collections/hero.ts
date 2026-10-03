import type { Collection } from "tinacms";
import { ctaField, localeRouter, seoField, textarea } from "../shared/fields";

/**
 * Homepage section 1 — `<section class="hero" id="top">`.
 * One document per locale: content/hero/en.json (es.json / fr.json later).
 */
const hero: Collection = {
  name: "hero",
  label: "Home / Hero",
  path: "content/hero",
  format: "json",
  ui: {
    router: localeRouter(),
    allowedActions: { delete: false },
  },
  fields: [
    {
      type: "string",
      name: "metaLine",
      label: "Coordinates line (above the title)",
      description: 'e.g. "24°12′37.6″ N · LA PAZ · B.C.S."',
    },
    { type: "string", name: "title", label: "Headline (h1)", required: true, ui: textarea },
    { type: "string", name: "subtitle", label: "Sub-headline" },
    ctaField("primaryCta", "Primary button"),
    ctaField("secondaryCta", "Secondary (ghost) button"),
    {
      type: "object",
      name: "background",
      label: "Background media",
      fields: [
        {
          type: "string",
          name: "videoSrc",
          label: "Loop video path",
          description:
            'Path under /public, e.g. "/assets/video/hero-loop.mp4". Videos are placed in the repo, not uploaded through Tina.',
        },
        { type: "image", name: "image", label: "Poster / fallback image" },
        { type: "string", name: "imageAlt", label: "Image alt text" },
      ],
    },
    { type: "string", name: "scrollCueLabel", label: "Scroll-cue accessible label" },
    // The HOME page's search/share text (this document is the homepage).
    seoField(),
  ],
};

export default hero;
