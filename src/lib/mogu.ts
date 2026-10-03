/**
 * Mogu trip embed URL, shared by the inline trip proposal (MoguProposal.astro)
 * and the full-screen one (MoguProposalHero.astro).
 */
export interface MoguEmbedOptions {
  hideLogo?: boolean;
  hideTitle?: boolean;
}

/**
 * Builds https://v2.app.moguplatform.com/trips/<code>?embed=true[&hideLogo=true][&hideTitle=true].
 * Keeps only the trip code: an editor once pasted
 * "code?embed=true&hideLogo=true" into the slug field, which would otherwise
 * produce a second "?" in the URL. The code ends at the first character that
 * can't be part of it (query, fragment, path, quote or space).
 */
export function moguEmbedSrc(tripSlug: string, { hideLogo = false, hideTitle = false }: MoguEmbedOptions = {}): string {
  const slug = tripSlug.trim().split(/[?&#/"'\s]/)[0];
  const params = ["embed=true", hideLogo && "hideLogo=true", hideTitle && "hideTitle=true"].filter(Boolean).join("&");
  return `https://v2.app.moguplatform.com/trips/${slug}?${params}`;
}

/** True when the first block has its own <h1> (a hero banner): the page then needs no separate visible title heading. */
export function firstBlockHasHeading(blocks: ({ __typename: string } | null | undefined)[] | null | undefined): boolean {
  return (blocks?.[0]?.__typename ?? "").endsWith("BlocksHero");
}

/** True when a landing/nav document's first block is a hero banner, so the header floats over it. The full-screen Mogu block keeps the regular solid header. */
export function startsWithHero(blocks: ({ __typename: string } | null | undefined)[] | null | undefined): boolean {
  return (blocks?.[0]?.__typename ?? "").endsWith("BlocksHero");
}
