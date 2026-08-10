import "server-only";

import Airtable from "airtable";
import { cache } from "react";

import {
  DEFAULT_DEPOSIT_USD,
  FIELDS,
  TABLES,
} from "./airtable-schema";

// The SDK ships as `export = Airtable` with a merged namespace, so its types
// are reached through the default import rather than as named exports.
type FieldSet = Airtable.FieldSet;
type AirtableRecord = Airtable.Record<FieldSet>;
type RawAttachment = Airtable.Attachment;

/* -------------------------------------------------------------------------- */
/* Domain types                                                               */
/* -------------------------------------------------------------------------- */

export type AirtableAttachment = {
  readonly url: string;
  readonly width: number | null;
  readonly height: number | null;
  readonly alt: string;
};

export type Person = {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly bio: string;
  readonly photo: AirtableAttachment | null;
};

export type Boat = {
  readonly id: string;
  readonly name: string;
  readonly model: string;
  readonly lengthMeters: number | null;
  readonly cabins: number | null;
  readonly berths: number | null;
  readonly heads: number | null;
  readonly year: number | null;
  readonly amenities: readonly string[];
  readonly photos: readonly AirtableAttachment[];
  /** Free-text description, shown when the structured specs are empty. */
  readonly specs: string;
};

export type Expedition = {
  readonly id: string;
  readonly title: string;
  readonly destination: string;
  readonly referencePriceUsd: number | null;
  readonly durationDays: number | null;
  readonly summary: string;
};

export type CustomerJourney = {
  readonly id: string;
  readonly slug: string;
  readonly clientName: string;
  readonly hook: string;
  readonly stripeLink: string | null;
  readonly depositUsd: number;
  readonly leader: Person | null;
  readonly boat: Boat | null;
  readonly expedition: Expedition | null;
};

/* -------------------------------------------------------------------------- */
/* Client                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Airtable credentials are read lazily rather than at module load so that a
 * missing key breaks only the VIP routes — the static marketing site keeps
 * building and deploying even if the CMS is not configured yet.
 */
function getBase(): Airtable.Base {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!apiKey || !baseId) {
    throw new Error(
      "Airtable is not configured. Set AIRTABLE_API_KEY and AIRTABLE_BASE_ID " +
        "(locally in .env.local, in production under Vercel → Settings → Environment Variables).",
    );
  }

  // AIRTABLE_ENDPOINT_URL is only ever set locally, to point the SDK at the
  // mock server in scripts/mock-airtable.mjs. Unset in production it defaults
  // to api.airtable.com.
  const endpointUrl = process.env.AIRTABLE_ENDPOINT_URL;

  return new Airtable(endpointUrl ? { apiKey, endpointUrl } : { apiKey }).base(baseId);
}

/* -------------------------------------------------------------------------- */
/* Field coercion                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Airtable types every cell as `any`, and an empty cell is simply absent rather
 * than null. These readers keep that looseness from leaking into the app: a
 * missing or wrong-typed cell degrades to a safe empty value instead of
 * rendering "undefined" on a page we are sending to a paying client.
 */
function readString(fields: FieldSet, key: string): string {
  const value = fields[key];
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function readNumber(fields: FieldSet, key: string): number | null {
  const value = fields[key];
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function readStringList(fields: FieldSet, key: string): readonly string[] {
  const value = fields[key];
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  // A single-select or comma-separated text field still yields something useful.
  const single = readString(fields, key);
  return single ? single.split(",").map((s) => s.trim()).filter(Boolean) : [];
}

/** Airtable link fields arrive as an array of record ids. */
function readLinkedIds(fields: FieldSet, key: string): readonly string[] {
  const value = fields[key];
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function toAttachment(raw: RawAttachment, alt: string): AirtableAttachment | null {
  if (typeof raw?.url !== "string" || !raw.url) return null;
  // Prefer the `large` thumbnail: Airtable's originals are frequently 4000px
  // wide, which is wasted bytes on a mobile-first page.
  const large = raw.thumbnails?.large;
  const source = large?.url ? large : raw;
  return {
    url: source.url,
    width: "width" in source && typeof source.width === "number" ? source.width : null,
    height: "height" in source && typeof source.height === "number" ? source.height : null,
    alt,
  };
}

function readAttachments(
  fields: FieldSet,
  key: string,
  alt: string,
): readonly AirtableAttachment[] {
  const value = fields[key];
  if (!Array.isArray(value)) return [];
  return (value as readonly RawAttachment[])
    .map((item) => toAttachment(item, alt))
    .filter((item): item is AirtableAttachment => item !== null);
}

/* -------------------------------------------------------------------------- */
/* Formula escaping                                                           */
/* -------------------------------------------------------------------------- */

/**
 * The slug comes straight from the URL, so it is untrusted input that ends up
 * inside an Airtable formula string. Without escaping, a slug containing a
 * quote would let a visitor rewrite the filter and read other clients' records.
 */
export function escapeFormulaValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/* -------------------------------------------------------------------------- */
/* Readers                                                                    */
/* -------------------------------------------------------------------------- */

function mapPerson(record: AirtableRecord): Person {
  const f = record.fields;
  const name = readString(f, FIELDS.person.name);
  return {
    id: record.id,
    name,
    role: readString(f, FIELDS.person.role),
    bio: readString(f, FIELDS.person.bio),
    photo: readAttachments(f, FIELDS.person.photo, name || "Expedition leader")[0] ?? null,
  };
}

function mapBoat(record: AirtableRecord): Boat {
  const f = record.fields;
  const name = readString(f, FIELDS.boat.name);
  return {
    id: record.id,
    name,
    model: readString(f, FIELDS.boat.model),
    lengthMeters: readNumber(f, FIELDS.boat.lengthMeters),
    cabins: readNumber(f, FIELDS.boat.cabins),
    berths: readNumber(f, FIELDS.boat.berths),
    heads: readNumber(f, FIELDS.boat.heads),
    year: readNumber(f, FIELDS.boat.year),
    amenities: readStringList(f, FIELDS.boat.amenities),
    photos: readAttachments(f, FIELDS.boat.photos, name || "Catamaran"),
    specs: readString(f, FIELDS.boat.specs),
  };
}

function mapExpedition(record: AirtableRecord): Expedition {
  const f = record.fields;
  return {
    id: record.id,
    title: readString(f, FIELDS.expedition.title),
    destination: readString(f, FIELDS.expedition.destination),
    referencePriceUsd: readNumber(f, FIELDS.expedition.referencePriceUsd),
    durationDays: readNumber(f, FIELDS.expedition.durationDays),
    summary: readString(f, FIELDS.expedition.summary),
  };
}

/**
 * Fetches one linked record. Returns null instead of throwing when the link is
 * empty or dangling, because a journey with no boat assigned yet should still
 * render its page rather than 500.
 */
async function findLinkedRecord(
  table: string,
  ids: readonly string[],
): Promise<AirtableRecord | null> {
  const id = ids[0];
  if (!id) return null;

  try {
    return await getBase()(table).find(id);
  } catch (error) {
    console.error(`[airtable] could not resolve ${table} record ${id}:`, error);
    return null;
  }
}

async function findLinked<T>(
  table: string,
  ids: readonly string[],
  map: (record: AirtableRecord) => T,
): Promise<T | null> {
  const record = await findLinkedRecord(table, ids);
  return record ? map(record) : null;
}

/**
 * A journey's own link wins; the expedition's supplies the default. This is
 * what lets two guests on the same route see different leaders.
 */
function pickIds(
  override: readonly string[],
  fallback: readonly string[],
): readonly string[] {
  return override.length > 0 ? override : fallback;
}

/**
 * Looks up a VIP journey by its slug.
 *
 * Wrapped in React `cache()` so the page body, `generateMetadata` and the
 * Open Graph image all share a single Airtable round-trip per request instead
 * of issuing three.
 */
export const getCustomerJourneyBySlug = cache(
  async (slug: string): Promise<CustomerJourney | null> => {
    const trimmed = slug.trim();
    if (!trimmed) return null;

    let records: readonly AirtableRecord[];
    try {
      records = await getBase()(TABLES.customerJourneys)
        .select({
          filterByFormula: `{${FIELDS.customerJourney.slug}} = "${escapeFormulaValue(trimmed)}"`,
          maxRecords: 1,
        })
        .firstPage();
    } catch (error) {
      // A CMS outage must not be indistinguishable from "this client has no
      // page" — rethrow so Next renders error.tsx rather than a bogus 404.
      console.error(`[airtable] lookup failed for slug "${trimmed}":`, error);
      throw new Error("Could not reach the Eagle Ray CMS.", { cause: error });
    }

    const record = records[0];
    if (!record) return null;

    const f = record.fields;

    // The expedition is resolved first because it also carries the default crew
    // and vessel, which the journey's own links are allowed to override.
    const expeditionId = readLinkedIds(f, FIELDS.customerJourney.expedition);
    const expeditionRecord = await findLinkedRecord(TABLES.expeditions, expeditionId);
    const expedition = expeditionRecord ? mapExpedition(expeditionRecord) : null;

    const leaderIds = pickIds(
      readLinkedIds(f, FIELDS.customerJourney.leader),
      expeditionRecord
        ? readLinkedIds(expeditionRecord.fields, FIELDS.expedition.crew)
        : [],
    );
    const boatIds = pickIds(
      readLinkedIds(f, FIELDS.customerJourney.boat),
      expeditionRecord
        ? readLinkedIds(expeditionRecord.fields, FIELDS.expedition.boats)
        : [],
    );

    const [leader, boat] = await Promise.all([
      findLinked(TABLES.people, leaderIds, mapPerson),
      findLinked(TABLES.boats, boatIds, mapBoat),
    ]);

    const stripeLink = readString(f, FIELDS.customerJourney.stripeLink);

    return {
      id: record.id,
      slug: readString(f, FIELDS.customerJourney.slug) || trimmed,
      clientName: readString(f, FIELDS.customerJourney.clientName),
      hook: readString(f, FIELDS.customerJourney.hook),
      stripeLink: isSafeExternalUrl(stripeLink) ? stripeLink : null,
      depositUsd:
        readNumber(f, FIELDS.customerJourney.depositAmountUsd) ?? DEFAULT_DEPOSIT_USD,
      leader,
      boat,
      expedition,
    };
  },
);

/**
 * Guards the CTA against a malformed or `javascript:` value typed into the
 * Airtable cell, since that string becomes an href we hand to the client.
 */
export function isSafeExternalUrl(value: string): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}
