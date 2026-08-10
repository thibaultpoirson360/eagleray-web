/**
 * Single source of truth for how our Airtable base is named.
 *
 * Airtable matches field names as exact, case-sensitive strings. Renaming a
 * column in the Airtable UI silently turns every read into `undefined` rather
 * than throwing, so every name the app depends on is declared here — change it
 * in this file only, never inline in a query.
 *
 * These values mirror base `appBul975ladoNceX` as of the initial VIP build.
 * Run `npm run airtable:inspect` to print the real field names of the base and
 * reconcile them here if anything was renamed.
 */

export const TABLES = {
  customerJourneys: "CustomerJourneys",
  people: "People",
  boats: "Boats",
  expeditions: "Expeditions",
} as const;

export const FIELDS = {
  customerJourney: {
    slug: "Slug",
    clientName: "Guest Name",
    hook: "Personalized Message",
    stripeLink: "Stripe Link",
    /**
     * Per-journey overrides. When empty the page falls back to the crew and
     * vessel attached to the linked expedition, so a journey stays renderable
     * with only an expedition set.
     */
    leader: "Leader",
    boat: "Boat",
    expedition: "Linked Expedition",
    status: "Status",
    depositAmountUsd: "Deposit Amount USD",
  },
  person: {
    name: "Name",
    role: "Role",
    bio: "Bio",
    photo: "Photo",
  },
  boat: {
    name: "Boat Name",
    model: "Model",
    lengthMeters: "Length m",
    cabins: "Cabins",
    berths: "Berths",
    heads: "Heads",
    year: "Year",
    amenities: "Amenities",
    photos: "Photos",
    /** Free-text fallback kept from the original base design. */
    specs: "Specs",
  },
  expedition: {
    title: "Title",
    destination: "Destination",
    referencePriceUsd: "Ref Price",
    durationDays: "Duration Days",
    summary: "Summary",
    /** Used only as a fallback when the journey has no direct link. */
    crew: "People (Crew)",
    boats: "Boats",
  },
} as const;

/** Deposit charged to hold dates when a journey record doesn't override it. */
export const DEFAULT_DEPOSIT_USD = 1000;
