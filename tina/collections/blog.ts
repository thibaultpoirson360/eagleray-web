import type { Collection } from "tinacms";
import { doNotTranslate, textarea } from "../shared/fields";

/**
 * `/en/blog` (listing) + `/en/blog/<slug>` (post). No source markup for
 * either — built from a design mockup ("Wayfarer Journal.dc.html", pasted
 * directly since /design-login couldn't run in this session), same
 * situation as the Contact page.
 *
 * Split in two collections, same shape as crewSection/crew and
 * boatsSection/boats: blogSection is the listing page's own header copy
 * (one per locale); blogPost is one document per post,
 * content/blogPost/<locale>/<slug>.json.
 *
 * The mockup's demo content hard-codes every post as exactly 4 paragraphs
 * + 1 pull-quote + 1 mid-article image — clearly just prototype filler,
 * not a rule real posts should be forced into. `body` is real Tina
 * rich-text instead (confirmed direction): editors write however many
 * paragraphs a post needs, a blockquote becomes the pull-quote treatment,
 * and Tina's rich-text image nodes already carry an optional caption, so
 * a captioned mid-article image is just an inline image — no separate
 * "midImage" field needed.
 *
 * `featured` is a deliberate addition beyond the mockup: it always shows
 * `posts[0]` (whichever post happens to be first in an unordered array)
 * as the featured story, with no real editorial control over which post
 * that is. A real listing page should let an editor choose; the loader
 * (src/lib/content.ts) falls back to the newest post if none is marked.
 */
export const blogSection: Collection = {
  name: "blogSection",
  label: "Home / Blog listing page",
  path: "content/blogSection",
  format: "json",
  fields: [
    {
      type: "string",
      name: "metaLine",
      label: "Coordinates line (small kicker above the title)",
      description: 'e.g. "24°12′37.6″ N · LA PAZ · B.C.S." — matches Hero/Footer/Nav\'s own copies of this line; not derived from them, same as those.',
    },
    { type: "string", name: "title", label: "Heading", required: true },
    { type: "string", name: "lede", label: "Lede", ui: textarea },
  ],
};

export const blogPost: Collection = {
  name: "blogPost",
  label: "Blog posts",
  path: "content/blogPost",
  format: "json",
  ui: {
    router: ({ document }) => {
      const [locale, slug] = document._sys.breadcrumbs;
      return `/${locale}/blog/${slug}`;
    },
    filename: { slugify: (values) => (values?.title ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-") },
  },
  fields: [
    { type: "string", name: "title", label: "Title", required: true, isTitle: true },
    {
      type: "string",
      name: "category",
      label: "Category",
      description: 'e.g. "Wildlife", "Life Aboard", "Travel" — freeform, not a fixed list.',
      required: true,
    },
    { type: "datetime", name: "date", label: "Publish date", required: true },
    { type: "string", name: "readTime", label: "Read time", description: 'e.g. "6 min read"' },
    {
      type: "boolean",
      name: "featured",
      label: "Show as the featured story on the listing page",
      description: "Only one post should be featured at a time — if several are marked, the most recent wins.",
    },
    { type: "image", name: "coverImage", label: "Cover photo" },
    { type: "string", name: "coverImageAlt", label: "Cover photo alt text" },
    {
      type: "string",
      name: "excerpt",
      label: "Excerpt (listing card + featured summary)",
      ui: textarea,
      required: true,
    },
    {
      type: "string",
      name: "subtitle",
      label: "Subtitle (shown under the title on the post page)",
      ui: textarea,
    },
    {
      type: "string",
      name: "author",
      label: "Author name",
      required: true,
      ui: doNotTranslate,
      description: "A proper noun — the translation Action copies this through untouched instead of sending it to DeepL.",
    },
    { type: "string", name: "authorRole", label: "Author role", description: 'e.g. "Naturalist Guide"' },
    { type: "image", name: "authorAvatar", label: "Author photo" },
    { type: "rich-text", name: "body", label: "Body", required: true },
  ],
};
