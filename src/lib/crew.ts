/**
 * Small helpers shared by the crew cards (CrewSummaryCard, CrewFullCard) and
 * the Passionate Sea People page. Kept out of the components so the card
 * logic has one home and the same rules apply on the home slider, in the
 * modal and in the page grid.
 */
import type { CrewConnectionQuery, CrewSectionQuery } from "../../tina/__generated__/types";

export type CrewMember = NonNullable<
  NonNullable<CrewConnectionQuery["crewConnection"]["edges"]>[number]
>["node"];

export type CrewLabels = CrewSectionQuery["crewSection"];

/**
 * The name the "Meet ___ →" button uses. A nickname in double quotes wins
 * (Mohamed “Adly” -> Adly); otherwise the first word (Thibault Poirson ->
 * Thibault).
 */
export function shortName(name: string): string {
  const quoted = name.match(/[“"]([^”"]+)[”"]/);
  return (quoted ? quoted[1] : name.trim().split(/\s+/)[0]).trim();
}

/** A textarea value -> its paragraphs (a blank line starts a new one). */
export function paragraphs(text?: string | null): string[] {
  return (text ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Drops the null/empty entries Tina's generated list types allow. */
export function clean(list?: (string | null)[] | null): string[] {
  return (list ?? []).filter((s): s is string => !!s && s.trim() !== "");
}

/** "5 years in the role" / "1 year in the role", from the section's labels. */
export function yearsText(years: number, labels: CrewLabels): string {
  const unit = years === 1 ? labels.yearLabel : labels.yearsLabel;
  return [years, unit].filter((x) => x !== null && x !== undefined && x !== "").join(" ");
}

/** The role groups on the Passionate Sea People page, in display order. */
export const ROLE_GROUPS = ["founder", "captain", "expeditionLeader", "chef"] as const;
export type RoleGroup = (typeof ROLE_GROUPS)[number] | "other";

/**
 * The group a member is listed under: the first of their roles that matches
 * a group. "Silver Chef" and "Gold Chef" are Chefs, and anyone with no
 * matching role falls into "other", shown last.
 */
export function roleGroup(roles: (string | null)[] | null | undefined): RoleGroup {
  for (const role of clean(roles)) {
    const r = role.toLowerCase();
    if (r.includes("founder")) return "founder";
    if (r.includes("captain")) return "captain";
    if (r.includes("expedition leader")) return "expeditionLeader";
    if (r.includes("chef")) return "chef";
  }
  return "other";
}

/**
 * The member's photos for the image slider: the `images` list when it has
 * entries, otherwise the single `image` field, so existing records keep working.
 */
export function memberPhotos(member: {
  images?: (string | null)[] | null;
  image?: string | null;
  imageAlt?: string | null;
}): { src: string; alt: string }[] {
  const list = clean(member.images);
  const srcs = list.length > 0 ? list : member.image ? [member.image] : [];
  return srcs.map((src) => ({ src, alt: member.imageAlt ?? "" }));
}
