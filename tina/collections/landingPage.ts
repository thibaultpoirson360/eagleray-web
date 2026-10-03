import type { Collection } from "tinacms";
import { ctaField, seoField, textarea } from "../shared/fields";
import { landingBlocksField } from "../shared/landingBlocks";

/**
 * Free-form marketing/landing pages composed entirely from an editor-picked
 * block list — distinct from navPages (fixed nav slugs, title-only stub
 * pages, tina/collections/navPages.ts) and from every homepage section
 * (fixed single-purpose shape, one doc per locale). One document per page:
 * content/landingPage/<locale>/<slug>.json — same multi-doc-per-locale
 * layout as blogPost (tina/collections/blog.ts).
 *
 * URL scheme (judgment call): `/en/landing/<slug>/` — see
 * src/pages/en/landing/[slug].astro. A namespace of its own rather than a
 * bare `/en/<slug>/`, which would risk colliding with navPages' fixed slugs
 * (about-us, sail-with-us, la-paz, boats, blog, passionate-sea-people,
 * contact) or the two pages already built directly under /en/ (contact,
 * blog). A landing page's slug is editor-chosen and unpredictable (campaign
 * names, etc.), so it needs a namespace that can never collide with either
 * fixed set, rather than a per-slug uniqueness check at creation time.
 *
 * Block set (judgment call — five templates below, a reasonable starter
 * set per the brief, not an exhaustive spec):
 *   - hero: kicker/title/lede/image/CTA — a simpler, block-scoped sibling
 *     of the homepage's own Hero (tina/collections/hero.ts). No video
 *     field: a landing page's hero is one block among several an editor
 *     can place anywhere in the list, not guaranteed full-viewport
 *     top-of-page chrome the way the homepage hero is.
 *   - richText: reuses blogPost's exact `body` rich-text field name and
 *     shape, and its render-time override components
 *     (src/components/richtext/*.astro), rather than duplicating either —
 *     see src/components/landing/LandingRichText.astro.
 *   - imageGallery: `images` mirrors wildlife.ts's `gallery` list shape
 *     field-for-field (image/alt/href) on purpose — same content shape,
 *     same field NAMES, per fields.ts's own "every collection uses
 *     identical field names" rule.
 *   - cta: title/lede + one ctaField() — a centered banner. The existing
 *     `cta` fields elsewhere (difference/wildlife/boats/crew) are a plain
 *     trailing button under a section that already has its own heading;
 *     this block has no host section, so it carries its own heading.
 *   - moguProposal: tripSlug/height, rendered through the standalone
 *     src/components/MoguProposal.astro (also directly reusable outside
 *     this block system — e.g. a future boat/route detail page).
 */
const landingPage: Collection = {
  name: "landingPage",
  label: "Landing pages",
  path: "content/landingPage",
  format: "json",
  ui: {
    router: ({ document }) => {
      const [locale, slug] = document._sys.breadcrumbs;
      return `/${locale}/landing/${slug}`;
    },
    filename: {
      slugify: (values) => (values?.title ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    },
  },
  fields: [
    {
      type: "string",
      name: "title",
      label: "Page title",
      required: true,
      isTitle: true,
      description: "Browser tab title, and the page's own visible heading shown above the block list.",
    },
    landingBlocksField(),
    seoField(),
  ],
};

export default landingPage;
