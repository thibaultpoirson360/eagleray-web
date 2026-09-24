export const locales = ['en', 'es', 'fr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

// Locales that actually have content. hreflang only lists these, so search
// engines are never pointed at a URL that doesn't exist. Add 'es' / 'fr' here
// when their pages and Tina content ship.
export const liveLocales: readonly Locale[] = ['en'];

export const ogLocale: Record<Locale, string> = { en: 'en_US', es: 'es_MX', fr: 'fr_FR' };

/** Full display name per locale, for the language switcher's menu/labels. */
export const localeLabel: Record<Locale, string> = { en: 'English', es: 'Español', fr: 'Français' };

/** Root-relative path for a locale — e.g. `localePath('es', '')` -> `/es/`.
 *  Use this for actual clickable nav links (logo, language switcher):
 *  it always resolves against whatever host the page is currently on
 *  (localhost in dev, the real domain in prod). */
export function localePath(locale: Locale, path: string): string {
  return `/${locale}/${path}`;
}

/** Absolute URL for a locale, against `site` — e.g. `localeHref('es', '', site)`
 *  -> `<site>/es/`. Only for things that must be fully-qualified regardless
 *  of environment (canonical/hreflang <link> tags) — NOT for clickable nav
 *  links, which should use `localePath` instead so local dev doesn't send
 *  you to the real production domain. */
export function localeHref(locale: Locale, path: string, origin: string | URL): string {
  return new URL(localePath(locale, path), origin).href;
}
