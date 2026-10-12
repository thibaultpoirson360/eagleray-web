import type { Locale } from "../i18n/config";

/** One scene of "A day on board". */
export interface LabScene {
  time: string;
  title: string;
  body: string;
}

/** Copy for /<locale>/lab/sergio-torres/ (content/labSergioTorres/<locale>.json). Plain files, not an editor collection. */
export interface LabSergioContent {
  seo: { title: string; description: string };
  coords: string;
  tagline: string;
  hero: { chip: string; title: string; lede: string; cta: { label: string; href: string }; image: string; imageAlt: string };
  intro: { lines: string[]; closing: string };
  story: { kicker: string; title: string; progressLabel: string; photo: string; photoAlt: string; scenes: LabScene[] };
  sergio: {
    kicker: string;
    title: string;
    nickname: string;
    intro: string;
    credentials: string[];
    instagram: { label: string; href: string };
    quote: string;
    photos: { image: string; alt: string }[];
  };
  route: {
    kicker: string;
    title: string;
    mapLabel: string;
    note: string;
    places: { name: string; note: string }[];
    activities: { title: string; tag: string; body: string; }[];
  };
  crew: { title: string; body: string; food: string; languagesLabel: string; languages: string[] };
  proposal: {
    title: string;
    lede: string;
    iframeTitle: string;
    tripSlug: string;
    cta: { label: string; href: string };
    whatsappLabel: string;
    whatsappDisplay: string;
  };
}

const files = import.meta.glob<LabSergioContent>("../../content/labSergioTorres/*.json", { eager: true, import: "default" });

export function loadLabSergio(locale: Locale): LabSergioContent | null {
  return files[`../../content/labSergioTorres/${locale}.json`] ?? null;
}

/** Cloudinary delivery URL at a given width (keeps f_auto,q_auto). */
export function cloudinaryAt(url: string, width: number): string {
  return url.replace("/f_auto,q_auto/", `/f_auto,q_auto,w_${width}/`);
}
