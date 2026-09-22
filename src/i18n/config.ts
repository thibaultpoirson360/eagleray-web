export const locales = ['en', 'es', 'fr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

// Locales that actually have content. hreflang only lists these, so search
// engines are never pointed at a URL that doesn't exist. Add 'es' / 'fr' here
// when their pages and Tina content ship.
export const liveLocales: readonly Locale[] = ['en'];

export const ogLocale: Record<Locale, string> = { en: 'en_US', es: 'es_MX', fr: 'fr_FR' };
