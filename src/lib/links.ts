/**
 * Link helpers shared by components that print hrefs an editor typed.
 */
import { localePath, type Locale } from "../i18n/config";

/**
 * Makes a homepage anchor work from any page. An editor writes `#customize`
 * (the trip-planner form on the homepage); on the homepage that scrolls, but
 * on every other page there is no such element and the link does nothing. So
 * an href that is only an anchor becomes `/<locale>/#customize`. A bare `#`,
 * a path, or a full URL passes through untouched.
 *
 * Only use this where the page is NOT the homepage (or where a full path to
 * the homepage is harmless): navigation, landing pages.
 */
export function homeAnchor(locale: Locale, href: string | null | undefined): string {
  if (!href) return "";
  return href.startsWith("#") && href.length > 1 ? `${localePath(locale, "")}${href}` : href;
}
