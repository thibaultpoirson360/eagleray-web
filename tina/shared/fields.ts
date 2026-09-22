/**
 * Small field/router helpers shared by the collections so the same shapes
 * (CTA button, section heading, select option) are declared once and every
 * collection uses identical field NAMES. content-migrator and the Astro
 * components rely on these names — do not rename without updating both.
 */
import type { TinaField } from "tinacms";

/**
 * Content is stored per locale: content/<collection>/<locale>/... (item
 * collections) or content/<collection>/<locale>.json (one-document-per-locale
 * sections). In both layouts the first breadcrumb is the locale, so this one
 * router serves every collection. Clicking a document in the admin opens the
 * matching page in the visual-editing iframe.
 *
 * Only `en` is populated today; es/fr are added by dropping files in later.
 */
export const localeRouter =
  (suffix = "") =>
  ({ document }: { document: { _sys: { breadcrumbs: string[] } } }) =>
    `/${document._sys.breadcrumbs[0] ?? "en"}/${suffix}`;

/** A button/link: `<a class="btn ..." href>label</a>`. */
export const ctaField = (name: string, label: string): TinaField => ({
  type: "object",
  name,
  label,
  fields: [
    { type: "string", name: "label", label: "Button text", required: true },
    {
      type: "string",
      name: "href",
      label: "Link",
      required: true,
      description: 'Anchor ("#customize"), internal path ("/en/boats") or full URL.',
    },
  ],
});

/**
 * A section's heading block: `<p class="kicker"><span class="num">01</span>
 * kicker</p><h2>title<br><em>titleEmphasis</em></h2>`. The <br> + <em> split
 * is modelled as two fields so no HTML lives in content.
 */
export const sectionHeadFields = (): TinaField[] => [
  {
    type: "string",
    name: "kickerNumber",
    label: "Kicker number",
    description: 'The small mono numeral before the kicker, e.g. "01".',
  },
  { type: "string", name: "kicker", label: "Kicker (small label above the title)" },
  { type: "string", name: "title", label: "Title", required: true },
  {
    type: "string",
    name: "titleEmphasis",
    label: "Title, italic second line",
    description: "Rendered on its own line inside <em>. Leave blank for a one-line title.",
  },
];

/**
 * Sounder (depth gauge) stop for the section: data-depth-stop / data-depth-name.
 */
export const depthFields = (): TinaField[] => [
  {
    type: "object",
    name: "depth",
    label: "Depth gauge stop",
    description: "What the side depth-gauge reads while this section is on screen.",
    fields: [
      { type: "number", name: "meters", label: "Depth (m)" },
      { type: "string", name: "name", label: "Stop name" },
    ],
  },
];

/** `{ label, value }` pair used by every funnel radio option list. */
export const optionsField = (name: string, label: string): TinaField => ({
  type: "object",
  name,
  label,
  list: true,
  ui: {
    itemProps: (item: Record<string, string>) => ({ label: item?.label }),
    defaultItem: { label: "New option", value: "New option" },
  },
  fields: [
    { type: "string", name: "label", label: "Label shown on the button", required: true },
    {
      type: "string",
      name: "value",
      label: "Value sent in the lead / WhatsApp message",
      required: true,
    },
  ],
});

export const textarea = { component: "textarea" } as const;
