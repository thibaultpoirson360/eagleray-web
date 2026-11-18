/**
 * Cookie consent (EU ePrivacy + GDPR): the visitor's choice, and the
 * trackers and embeds that wait for it. Browser-only; run from
 * src/scripts/chrome.ts. The banner is src/components/CookieBanner.astro,
 * the embed placeholder src/components/ConsentEmbed.astro.
 *
 * Rules this follows:
 *   - Nothing optional loads before the visitor says yes: no Google
 *     Analytics, no Meta Pixel, no Mogu/Tally iframe. Not "loaded but
 *     paused": not requested at all.
 *   - Reject is as easy as accept (same banner, same size of button), and
 *     each purpose can be chosen on its own.
 *   - The choice is kept for 12 months, then asked again.
 *   - It can be changed at any time from the footer ("Cookie settings").
 *     Turning something off after it loaded deletes its cookies on our
 *     domain and reloads the page, since a running script can't be unloaded.
 *
 * Adding a tracker or an embed: give it a category below, load it only from
 * `apply()`, and update the banner's description (content/cookieConsent) and
 * the privacy policy (public/privacy.html, section 5).
 */

export const GA_MEASUREMENT_ID = "G-P589SNMK34";
export const META_PIXEL_ID = "1793759511973118";

export type Category = "analytics" | "marketing" | "embeds";
export const CATEGORIES: Category[] = ["analytics", "marketing", "embeds"];

export interface Consent {
  analytics: boolean;
  marketing: boolean;
  embeds: boolean;
  /** When the choice was made (ms since epoch). */
  date: number;
  /** Bump to ask everyone again (e.g. after adding a new tracker). */
  version: number;
}

const STORAGE_KEY = "ere-consent";
const VERSION = 1;
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

/** The saved choice, or null if there is none, it is older than 12 months, or from an older version. */
export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Consent;
    if (c.version !== VERSION || typeof c.date !== "number" || Date.now() - c.date > MAX_AGE_MS) return null;
    return c;
  } catch {
    return null;
  }
}

/**
 * Saves a choice and applies it. Returns true when the page must reload
 * because something that was already running has just been turned off.
 */
export function saveConsent(choice: Record<Category, boolean>): boolean {
  const previous = readConsent();
  const consent: Consent = { ...choice, date: Date.now(), version: VERSION };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    /* storage unavailable: the choice applies to this page only */
  }
  const withdrawn = CATEGORIES.some((c) => previous?.[c] && !choice[c]);
  if (withdrawn) {
    deleteTrackingCookies();
    return true;
  }
  apply(consent);
  return false;
}

/** Loads whatever the choice allows. Safe to call more than once. */
export function apply(consent: Consent | null) {
  if (!consent) return;
  if (consent.analytics) loadGoogleAnalytics();
  if (consent.marketing) loadMetaPixel();
  if (consent.embeds) activateEmbeds();
}

/* ---------- Google Analytics 4 (gtag.js) ---------- */
let gaLoaded = false;
function loadGoogleAnalytics() {
  if (gaLoaded) return;
  gaLoaded = true;
  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    // gtag.js reads the `arguments` object itself, not an array.
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer.push(arguments);
  };
  w.gtag("js", new Date());
  w.gtag("config", GA_MEASUREMENT_ID);
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(s);
}

/* ---------- Meta Pixel (fbevents.js) ---------- */
let pixelLoaded = false;
function loadMetaPixel() {
  if (pixelLoaded) return;
  pixelLoaded = true;
  const w = window as any;
  if (!w.fbq) {
    // Meta's standard base code, unminified: a queue that fbevents.js drains once it loads.
    const fbq: any = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    };
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    w.fbq = fbq;
    w._fbq = w._fbq || fbq;
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(s);
  }
  w.fbq("init", META_PIXEL_ID);
  w.fbq("track", "PageView");
}

/* ---------- Embeds (ConsentEmbed.astro) ---------- */
export function activateEmbeds(scope: ParentNode = document) {
  scope.querySelectorAll<HTMLElement>("[data-consent-embed]").forEach((wrapper) => {
    const frame = wrapper.querySelector<HTMLIFrameElement>("iframe[data-src]");
    if (frame && !frame.src) frame.src = frame.dataset.src!;
    frame?.removeAttribute("hidden");
    wrapper.querySelector("[data-consent-placeholder]")?.setAttribute("hidden", "");
  });
}

/* ---------- Withdrawal ---------- */
/** GA (_ga, _ga_<id>, _gid) and Meta (_fbp, _fbc) first-party cookies, on this host and its parent domain. */
function deleteTrackingCookies() {
  const names = document.cookie
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter((n) => /^(_ga|_gid|_gat|_fbp|_fbc)/.test(n));
  const host = location.hostname;
  const domains = ["", host, `.${host}`, `.${host.replace(/^www\./, "")}`];
  for (const name of names) {
    for (const d of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
    }
  }
}
