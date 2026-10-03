import type { TinaField } from "tinacms";
import { ctaField, textarea } from "./fields";

/**
 * The page-builder "blocks" field (hero, rich text, image gallery, call to
 * action, Mogu trip proposal). Shared by every document that can be built
 * from blocks: landing pages (tina/collections/landingPage.ts) and the nav
 * placeholder pages (tina/collections/navPages.ts), so both offer the same
 * blocks and the same renderers (src/components/landing/).
 */
export const landingBlocksField = (): TinaField => (
  {
    type: "object",
    name: "blocks",
    label: "Page content blocks",
    list: true,
    ui: {
      itemProps: (item: Record<string, any>) => ({
        label: item?.title || item?.tripSlug || "Block",
      }),
    },
    templates: [
      {
        name: "hero",
        label: "Hero banner",
        ui: { defaultItem: { title: "New hero banner" } },
        fields: [
          { type: "string", name: "kicker", label: "Kicker (small label above the title)" },
          { type: "string", name: "title", label: "Title", required: true },
          { type: "string", name: "lede", label: "Lede", ui: textarea },
          { type: "image", name: "image", label: "Background image" },
          { type: "string", name: "imageAlt", label: "Background image alt text" },
          ctaField("cta", "Button"),
        ],
      },
      {
        name: "richText",
        label: "Rich text",
        fields: [{ type: "rich-text", name: "body", label: "Content", required: true }],
      },
      {
        name: "imageGallery",
        label: "Image gallery",
        ui: { defaultItem: { images: [] } },
        fields: [
          {
            type: "object",
            name: "images",
            label: "Images",
            list: true,
            ui: {
              itemProps: (item: Record<string, string>) => ({ label: item?.alt || "Image" }),
            },
            fields: [
              { type: "image", name: "image", label: "Image" },
              { type: "string", name: "alt", label: "Alt text" },
              { type: "string", name: "href", label: "Link (optional)" },
            ],
          },
        ],
      },
      {
        name: "cta",
        label: "Call to action banner",
        ui: { defaultItem: { title: "New call to action" } },
        fields: [
          { type: "string", name: "title", label: "Heading", required: true },
          { type: "string", name: "lede", label: "Supporting line", ui: textarea },
          ctaField("cta", "Button"),
        ],
      },
      {
        name: "moguProposal",
        label: "Trip proposal (Mogu embed)",
        ui: { defaultItem: { height: 600 } },
        fields: [
          {
            type: "string",
            name: "tripSlug",
            label: "Mogu trip slug",
            required: true,
            description:
              'Only the trip code from Mogu\'s link: the part after /trips/ and before any "?". In https://v2.app.moguplatform.com/trips/baja-sailing-7-days?embed=true the code is "baja-sailing-7-days". It becomes https://v2.app.moguplatform.com/trips/<code>?embed=true.',
            // Mogu answers an unknown or mistyped code with HTTP 200 and a
            // "Page not found" screen INSIDE the frame, so nothing else would
            // ever flag a bad code — catch the common mistake while editing.
            validate: (value: string | undefined) => {
              if (value && !/^[A-Za-z0-9-]+$/.test(value.trim())) {
                return 'Paste only the trip code (letters, numbers and hyphens) — the part of the Mogu link after "/trips/" and before any "?".';
              }
            },
          },
          {
            type: "boolean",
            name: "hideLogo",
            label: "Hide Mogu's logo bar",
            description: "Adds &hideLogo=true to the embed.",
          },
          {
            type: "boolean",
            name: "hideTitle",
            label: "Hide the trip title",
            description: "Adds &hideTitle=true to the embed.",
          },
          {
            type: "number",
            name: "height",
            label: "Embed height (px)",
            description: "Defaults to 600 if left blank.",
          },
          {
            type: "string",
            name: "iframeTitle",
            label: "Embed name (accessible label, not visible text)",
            description: 'Read by screen readers to name the embedded proposal. Defaults to "Trip proposal" if left blank.',
          },
        ],
      },
      {
        name: "moguHero",
        label: "Trip proposal, full screen (first block: header floats over it)",
        ui: { defaultItem: { tripSlug: "" } },
        fields: [
          {
            type: "string",
            name: "tripSlug",
            label: "Mogu trip slug",
            required: true,
            description:
              'Only the trip code from Mogu\'s link: the part after /trips/ and before any "?". The frame fills the screen height.',
            validate: (value: string | undefined) => {
              if (value && !/^[A-Za-z0-9-]+$/.test(value.trim())) {
                return 'Paste only the trip code (letters, numbers and hyphens) — the part of the Mogu link after "/trips/" and before any "?".';
              }
            },
          },
          { type: "boolean", name: "hideLogo", label: "Hide Mogu's logo bar" },
          { type: "boolean", name: "hideTitle", label: "Hide the trip title" },
          {
            type: "string",
            name: "iframeTitle",
            label: "Embed name (accessible label, not visible text)",
            description: 'Defaults to "Trip proposal" if left blank.',
          },
        ],
      },
    ],
  }
);
