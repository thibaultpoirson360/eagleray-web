/**
 * Populates the `Photos` field of the Airtable `Boats` table from a manifest of
 * image URLs you are licensed to use.
 *
 *   node --env-file=.env.local scripts/sync-boat-photos.mjs            # dry run
 *   node --env-file=.env.local scripts/sync-boat-photos.mjs --apply    # writes
 *
 * WHY A MANIFEST AND NOT AN IMAGE SEARCH
 * --------------------------------------
 * The original plan was to query an image API per model and take the first few
 * hits. Three reasons that does not work here:
 *
 *   1. Licensing. Builder press photos are the builder's copyright, issued for
 *      editorial use. Re-publishing them to sell charters is a commercial use
 *      that needs permission, and Airtable copies each file onto its own
 *      servers — which is the act that matters. Get the assets from the
 *      builder's dealer/press portal (links in BUILDER_PRESS_PORTALS below),
 *      keep the licence email, then list the URLs here.
 *
 *   2. Identification. No image search can confirm a photo is a Lagoon 46 and
 *      not a Lagoon 50 — they are near-identical from the outside. A wrong boat
 *      on a page where someone is about to wire a deposit is a commercial
 *      problem, not a cosmetic one. A human confirms each URL here instead.
 *
 *   3. Availability. Bing Search APIs (including Image Search) were retired on
 *      2025-08-11 and now return HTTP 410. DuckDuckGo has no official image
 *      API. Unsplash carries no model-specific builder photography.
 *
 * Airtable fetches each URL server-side, so the URLs must be publicly readable
 * at the moment this runs. It then re-hosts the file; the source URL is not
 * hot-linked afterwards.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";

/* -------------------------------------------------------------------------- */
/* Where to obtain licensed assets                                            */
/* -------------------------------------------------------------------------- */

export const BUILDER_PRESS_PORTALS = {
  Bali: "https://www.bali-catamarans.com/en/contact — ask for the dealer media kit",
  "Fountaine Pajot": "https://www.fountaine-pajot.com/en/press-area/",
  Lagoon: "https://www.cata-lagoon.com/en/press-kit",
  Jeanneau: "https://www.jeanneau.com/en/press/",
  Beneteau: "https://www.beneteau.com/en/press",
  Dufour: "https://www.dufour-yachts.com/en/contact",
};

/* -------------------------------------------------------------------------- */
/* Manifest                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Fill this in with URLs you hold a licence for. Two to three per boat:
 * one exterior under sail, one cockpit or saloon.
 *
 * `boatName` must match the `Boat Name` cell in Airtable exactly — that is how
 * records are matched. Unmatched names are reported, never silently created.
 *
 * @type {{ boatName: string, credit: string, photos: {url: string, filename: string}[] }[]}
 */
const MANIFEST = [
  // Example of the expected shape — delete once real entries are in.
  // {
  //   boatName: "Bali 4.4",
  //   credit: "© Bali Catamarans — dealer media kit, licence ref. XXXX",
  //   photos: [
  //     { url: "https://…/bali-44-sailing.jpg", filename: "bali-44-sailing.jpg" },
  //     { url: "https://…/bali-44-cockpit.jpg", filename: "bali-44-cockpit.jpg" },
  //   ],
  // },
];

/* -------------------------------------------------------------------------- */

const API_KEY = process.env.AIRTABLE_API_KEY;
const BASE_ID = process.env.AIRTABLE_BASE_ID;
const TABLE = "Boats";
const NAME_FIELD = "Boat Name";
const PHOTOS_FIELD = "Photos";
const CREDIT_FIELD = "Specs"; // no dedicated credit column yet; see notes below

const apply = process.argv.includes("--apply");

if (!API_KEY || !BASE_ID) {
  console.error(
    "Missing credentials. Run with:\n" +
      "  node --env-file=.env.local scripts/sync-boat-photos.mjs\n\n" +
      "Note: writing attachments needs a token with `data.records:write`.\n" +
      "The read-only token described in AIRTABLE_SETUP.md is not enough.",
  );
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
};

async function listBoats() {
  const records = [];
  let offset;
  do {
    const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE)}`);
    url.searchParams.set("pageSize", "100");
    if (offset) url.searchParams.set("offset", offset);

    const res = await fetch(url, { headers });
    if (!res.ok) {
      throw new Error(`Airtable list failed: ${res.status} ${await res.text()}`);
    }
    const body = await res.json();
    records.push(...body.records);
    offset = body.offset;
  } while (offset);
  return records;
}

/** Confirms a URL is reachable and actually an image before handing it to Airtable. */
async function checkUrl(url) {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    if (!res.ok) return `HTTP ${res.status}`;
    const type = res.headers.get("content-type") ?? "";
    if (!type.startsWith("image/")) return `not an image (${type})`;
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : "unreachable";
  }
}

async function main() {
  if (MANIFEST.length === 0) {
    console.error(
      "MANIFEST is empty — nothing to sync.\n\n" +
        "Add entries with URLs you are licensed to use. Builder press/dealer portals:\n" +
        Object.entries(BUILDER_PRESS_PORTALS)
          .map(([builder, url]) => `  ${builder.padEnd(16)} ${url}`)
          .join("\n"),
    );
    process.exit(1);
  }

  const boats = await listBoats();
  const byName = new Map(boats.map((r) => [r.fields[NAME_FIELD], r]));

  console.log(`${boats.length} boat record(s) in Airtable\n`);

  const updates = [];
  for (const entry of MANIFEST) {
    const record = byName.get(entry.boatName);
    if (!record) {
      console.error(`✗ ${entry.boatName.padEnd(22)} no matching "${NAME_FIELD}" in Airtable`);
      continue;
    }

    const good = [];
    for (const photo of entry.photos) {
      const problem = await checkUrl(photo.url);
      if (problem) {
        console.error(`✗ ${entry.boatName.padEnd(22)} ${photo.filename}: ${problem}`);
        continue;
      }
      good.push({ url: photo.url, filename: photo.filename });
    }

    if (good.length === 0) continue;

    console.log(`✓ ${entry.boatName.padEnd(22)} ${good.length} photo(s)  ${entry.credit}`);
    updates.push({ id: record.id, fields: { [PHOTOS_FIELD]: good } });
  }

  if (!apply) {
    console.log(`\nDry run — ${updates.length} record(s) would be updated. Re-run with --apply.`);
    return;
  }

  // Airtable caps writes at 10 records per PATCH.
  for (let i = 0; i < updates.length; i += 10) {
    const batch = updates.slice(i, i + 10);
    const res = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE)}`,
      { method: "PATCH", headers, body: JSON.stringify({ records: batch }) },
    );
    if (!res.ok) {
      throw new Error(`Airtable update failed: ${res.status} ${await res.text()}`);
    }
    console.log(`updated ${batch.length} record(s)`);
  }

  console.log(
    `\nDone. Airtable re-hosts each file, so the source URLs are not hot-linked.\n` +
      `Keep the licence references — ${CREDIT_FIELD} is free text; consider a dedicated ` +
      `"Photo Credit" column if you carry assets from several builders.`,
  );
}

await main();
