/**
 * Narrowed per-block prop types for the landing page's `blocks` templates
 * union (tina/collections/landingPage.ts). Tina's codegen names a stored
 * block's generated GraphQL type `<Collection><Field><Template>` in
 * PascalCase — e.g. the "hero" template on landingPage.blocks becomes
 * `LandingPageBlocksHero`. Confirmed against the generated
 * tina/__generated__/types.ts after `tinacms build` (see
 * LandingPageBlocks.astro's own comment for the full dispatch list).
 * Centralised here so every landing/* block component and the dispatcher
 * import the same narrowed shape instead of each re-deriving its own
 * Extract<...>.
 */
import type { LandingPageQuery } from "../../../tina/__generated__/types";

export type LandingPageBlocks = NonNullable<LandingPageQuery["landingPage"]["blocks"]>;
export type LandingPageBlock = NonNullable<LandingPageBlocks[number]>;

export type HeroBlock = Extract<LandingPageBlock, { __typename: "LandingPageBlocksHero" }>;
export type RichTextBlock = Extract<LandingPageBlock, { __typename: "LandingPageBlocksRichText" }>;
export type ImageGalleryBlock = Extract<LandingPageBlock, { __typename: "LandingPageBlocksImageGallery" }>;
export type CtaBlock = Extract<LandingPageBlock, { __typename: "LandingPageBlocksCta" }>;
export type MoguProposalBlock = Extract<LandingPageBlock, { __typename: "LandingPageBlocksMoguProposal" }>;

/**
 * Shape every block renderer needs from the parent document to build its
 * own `tinaField(landingPage, "blocks", index)` marker — not the full
 * LandingPageQuery type, since block components only ever touch `blocks`.
 * The index signature is required, not incidental: tinaField()'s own
 * signature (@tinacms/bridge/tina-field) only accepts `Record<string,
 * unknown>`-compatible objects, which a plain `{ blocks?: ... }` interface
 * doesn't structurally satisfy without one.
 */
export interface LandingPageBlocksParent {
  blocks?: (LandingPageBlock | null)[] | null;
  [key: string]: unknown;
}
