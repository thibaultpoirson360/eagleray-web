import type { Collection } from "tinacms";
import { ctaField, depthFields, localeRouter, sectionHeadFields, textarea } from "../shared/fields";

/**
 * Homepage section 4 — `<section id="wildlife">`: heading, lede and the
 * `.wildlife-gallery` grid (image links). One document per locale; gallery
 * items are a list inside it (there is no per-species page yet). If species
 * pages arrive later, promote `gallery` to its own collection.
 *
 * NOTE: main.js still contains initFauna (the old fauna selector). The current
 * markup is a plain gallery, so no species/season fields are modelled here.
 */
const wildlife: Collection = {
  name: "wildlife",
  label: "Home / Wildlife",
  path: "content/wildlife",
  format: "json",
  ui: {
    router: localeRouter("#wildlife"),
    allowedActions: { delete: false },
  },
  fields: [
    ...depthFields(),
    ...sectionHeadFields(),
    { type: "string", name: "lede", label: "Lede paragraph", ui: textarea },
    {
      type: "object",
      name: "gallery",
      label: "Gallery",
      list: true,
      ui: {
        itemProps: (item: Record<string, string>) => ({ label: item?.alt || "Gallery item" }),
      },
      fields: [
        { type: "image", name: "image", label: "Image" },
        { type: "string", name: "alt", label: "Alt text" },
        { type: "string", name: "href", label: "Link (optional)" },
      ],
    },
    ctaField("cta", "Button below the gallery"),
  ],
};

export default wildlife;
