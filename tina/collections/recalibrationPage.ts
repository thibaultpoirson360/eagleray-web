import type { Collection } from "tinacms";
import { ctaField, localeRouter, seoField, textarea } from "../shared/fields";

/**
 * `/<locale>/recalibration-expedition/` — the Recalibration Expedition page,
 * from the Claude Design mockup (Recalibration Expedition.dc.html). One
 * document per locale: content/recalibrationPage/<locale>.json.
 *
 * On board and Not on board are rich text (the admin's markdown editor), so
 * the lists can be reworded or reordered without a developer. The Mogu
 * proposal is embedded where the mockup shows it, from the trip code below.
 */
const recalibrationPage: Collection = {
  name: "recalibrationPage",
  label: "Recalibration Expedition page",
  path: "content/recalibrationPage",
  format: "json",
  ui: {
    router: localeRouter("recalibration-expedition/"),
    allowedActions: { delete: false },
  },
  fields: [
    { type: "image", name: "heroImage", label: "Hero photo" },
    { type: "string", name: "heroImageAlt", label: "Hero photo alt text" },
    { type: "string", name: "title", label: "Title over the hero photo (h1)", required: true },
    { type: "string", name: "subtitle", label: "Line under the title", ui: textarea },
    { type: "string", name: "intro", label: "Intro text", ui: textarea, description: "A blank line starts a new paragraph." },
    { type: "image", name: "introImage", label: "Intro photo (the sail)" },
    { type: "string", name: "introImageAlt", label: "Intro photo alt text" },
    { type: "string", name: "durationLabel", label: "Label above the Mogu proposal", description: 'e.g. "Choose the ideal duration"' },
    {
      type: "string",
      name: "moguTripSlug",
      label: "Mogu trip code",
      description: "The trip code from Mogu, e.g. sergio-torres-eagle-ray-expeditions-la-paz-pesca-bienestar. Leave empty to hide the embed.",
    },
    { type: "string", name: "aboardLabel", label: "Label above the on-board sections", description: 'e.g. "What\'s aboard"' },
    { type: "string", name: "onBoardLabel", label: "On board — heading" },
    {
      type: "rich-text",
      name: "onBoard",
      label: "On board — text",
      description: "Use an italic line for each item name and a normal line under it for the detail.",
    },
    { type: "image", name: "onBoardImage", label: "On board photo (diver or snorkeler)" },
    { type: "string", name: "onBoardImageAlt", label: "On board photo alt text" },
    { type: "string", name: "notOnBoardLabel", label: "Not on board — heading" },
    { type: "rich-text", name: "notOnBoard", label: "Not on board — text" },
    { type: "image", name: "notOnBoardImage", label: "Not on board photo (aerial reef or lagoon)" },
    { type: "string", name: "notOnBoardImageAlt", label: "Not on board photo alt text" },
    ctaField("cta", "Closing button"),
    seoField(),
  ],
};

export default recalibrationPage;
