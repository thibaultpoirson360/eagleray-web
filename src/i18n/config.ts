export const locales = ['en', 'es', 'fr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export function isLocale(value: unknown): value is Locale {
  return (locales as readonly string[]).includes(value as string);
}

// Locales that actually have content. hreflang, the language switcher and
// the `[locale]` routes' getStaticPaths only use these, so search engines
// (and visitors) are never pointed at a URL that doesn't exist.
//
// Driven by PUBLIC_LIVE_LOCALES (comma-separated, e.g. "en,es,fr") rather
// than a hardcoded list, so a locale can be reviewed on a Vercel preview
// (the `staging` branch, where the translation PR lands — see
// docs/translation-workflow.md) BEFORE it goes live on production: set the
// variable per Vercel environment. Defaults to just the default locale so a
// build with no variable can never try to render a locale that has no
// content yet. The default locale is always live.
function parseLiveLocales(raw: string | undefined): readonly Locale[] {
  const requested = (raw ?? '').split(',').map((l) => l.trim()).filter(isLocale);
  return locales.filter((l) => l === defaultLocale || requested.includes(l));
}

export const liveLocales: readonly Locale[] = parseLiveLocales(import.meta.env.PUBLIC_LIVE_LOCALES);

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
