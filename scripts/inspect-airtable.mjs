/**
 * Prints the tables and field names your Airtable base actually exposes, so
 * they can be reconciled with lib/airtable-schema.ts.
 *
 *   npm run airtable:inspect
 *
 * Airtable matches field names as exact strings and returns `undefined` for a
 * name that doesn't exist rather than erroring, so a typo shows up as a blank
 * page instead of a stack trace. This script is the fastest way to find that.
 *
 * Requires .env.local with AIRTABLE_API_KEY and AIRTABLE_BASE_ID. The key needs
 * `schema.bases:read` in addition to `data.records:read`; if it doesn't have
 * it, the script falls back to inferring fields from the first record of each
 * table it can reach.
 */

const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;

if (!apiKey || !baseId) {
  console.error(
    "Missing credentials. Create .env.local with:\n" +
      "  AIRTABLE_API_KEY=pat...\n" +
      "  AIRTABLE_BASE_ID=app...",
  );
  process.exit(1);
}

const headers = { Authorization: `Bearer ${apiKey}` };

async function viaMetadataApi() {
  const res = await fetch(
    `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
    { headers },
  );
  if (!res.ok) return null;
  const body = await res.json();
  return body.tables ?? null;
}

async function viaFirstRecord(tableName) {
  const res = await fetch(
    `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?maxRecords=1`,
    { headers },
  );
  if (!res.ok) return { error: `${res.status} ${res.statusText}` };
  const body = await res.json();
  const record = body.records?.[0];
  if (!record) return { fields: [], note: "table reachable but empty" };
  return { fields: Object.keys(record.fields) };
}

const tables = await viaMetadataApi();

if (tables) {
  console.log(`Base ${baseId} — ${tables.length} table(s)\n`);
  for (const table of tables) {
    console.log(`■ ${table.name}`);
    for (const field of table.fields) {
      console.log(`    ${field.name}  (${field.type})`);
    }
    console.log("");
  }
} else {
  console.log(
    "Metadata API unavailable (token likely lacks schema.bases:read).\n" +
      "Falling back to reading one record per expected table.\n",
  );
  for (const name of ["CustomerJourneys", "People", "Boats", "Expeditions"]) {
    const result = await viaFirstRecord(name);
    console.log(`■ ${name}`);
    if (result.error) {
      console.log(`    unreachable: ${result.error}`);
    } else if (result.note) {
      console.log(`    ${result.note}`);
    } else {
      for (const field of result.fields) console.log(`    ${field}`);
    }
    console.log("");
  }
}

console.log(
  "Compare the above with lib/airtable-schema.ts — every name used by the app is declared there.",
);
