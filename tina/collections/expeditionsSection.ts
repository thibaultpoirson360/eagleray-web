import type { Collection } from "tinacms";
import { depthFields, localeRouter, sectionHeadFields } from "../shared/fields";

/**
 * Homepage section "Your expedition" — the expedition cards (Recalibration,
 * Thanksgiving with Sergio Torres, Ad-hoc…). This collection holds only the
 * section's own words; the cards themselves are the ones edited under
 * "Sail with us" (Expedition cards), so they are changed in one place and
 * show on both pages. One document per locale.
 */
const expeditionsSection: Collection = {
  name: "expeditionsSection",
  label: "Home / Your expedition section",
  path: "content/expeditionsSection",
  format: "json",
  ui: {
    router: localeRouter("#expeditions"),
    allowedActions: { delete: false },
  },
  fields: [
    ...depthFields(),
    ...sectionHeadFields(),
    {
      type: "string",
      name: "cardLabel",
      label: "Button text on each card",
      description: 'e.g. "Learn more". To change the cards themselves (names, photos, links), edit "Sail with us" > Expedition cards.',
    },
  ],
};

export default expeditionsSection;
