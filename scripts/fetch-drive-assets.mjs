/**
 * Downloads the curated marketing visuals from the shared Google Drive folder
 * "Eagle Ray Pictures - Marketing" into ./assets/.
 *
 *   node scripts/fetch-drive-assets.mjs
 *
 * Why not gdown: the folder is shared publicly, so each file is reachable at
 * `drive.google.com/uc?export=download&id=...` with a plain HTTP GET. That
 * avoids an extra Python dependency, an OAuth flow, and gdown's flaky
 * folder-recursion. Verified against Drive's reported file sizes below.
 *
 * Scope: the root folder only. The four subfolders are either videos, or
 * pilot footage from BVI and Croatia that has nothing to do with the Baja
 * product — pulling them would mean hundreds of megabytes of irrelevant media.
 *
 * Files are renamed to something meaningful on the way in; Drive's own names
 * ("WhatsApp Image 2026-05-29 at 15.50.07 (11).jpeg") are useless downstream.
 */
import { mkdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "assets");

/** @type {{id: string, name: string, bytes: number, group: string}[]} */
const FILES = [
  // ---- Boats -------------------------------------------------------------
  { id: "1XfdVpnaGvWdwG-b1WZfrNqFaVx6uPiJt", name: "boat-bali-bbq.jpeg", bytes: 114762, group: "boats" },
  { id: "1Yj25glDwzSY9aUUKjuCjtbxAJq0_-CgM", name: "boat-bali-couple.jpeg", bytes: 84957, group: "boats" },

  // ---- Crew: Alexis ------------------------------------------------------
  { id: "1RDMntJywC_Xo1JbW16iyC5dYogDKPcKO", name: "crew-alexis-1.jpeg", bytes: 84729, group: "crew" },
  { id: "140F4HYptSXO8dC9OSo9JbPykOOixfijO", name: "crew-alexis-2.jpeg", bytes: 261159, group: "crew" },
  { id: "1PQ7Cq_WC39sKLdyuZJUBtPlkm7BZeHOQ", name: "crew-alexis-4.jpeg", bytes: 53345, group: "crew" },
  { id: "18AbKgrLhWO-Elh4gvWmjKhZqakjz4gZ4", name: "crew-alexis-5.jpeg", bytes: 121339, group: "crew" },

  // ---- Crew: Adly --------------------------------------------------------
  { id: "1zsL0pncBS-NaFLF1eUlWMNchcyvns23b", name: "crew-adly-4.jpeg", bytes: 540510, group: "crew" },
  { id: "1FbYCWG3tQgQbZ3RwT0c391vFdU2svjSP", name: "crew-adly-5.jpeg", bytes: 124523, group: "crew" },

  // ---- Crew: Javier & Flavia --------------------------------------------
  { id: "1Deu72YmkxJNMITpmFsUzFfy7IB_JSfwF", name: "crew-javier.jpeg", bytes: 54784, group: "crew" },
  { id: "1xqycCFLZaeU2xwR-4YWVpJbOam78W1pu", name: "crew-flavia.jpeg", bytes: 80844, group: "crew" },

  // ---- Crew: Thibault (founder) -----------------------------------------
  { id: "14-YntJuma51PABzNfZvXPyPF2ZCgiFWZ", name: "crew-thibault-1.jpeg", bytes: 266239, group: "crew" },
  { id: "1d49rjZ3ig3qkzXvQa6MrIRCD7zPW1L_h", name: "crew-thibault-2.jpeg", bytes: 161469, group: "crew" },
  { id: "19JsaUF9rdToVW87EtAejwBsnT6x7HQ7z", name: "crew-thibault-3.jpeg", bytes: 198518, group: "crew" },
  { id: "1XG40n472vUWhU6Fz9m23HEsWXn2_nrCj", name: "crew-thibault-founder.jpeg", bytes: 118368, group: "crew" },
  { id: "15bR75c8ZRKPGU_nJPWrkKVpR6aXbmnGe", name: "crew-thibault-sailing-1.jpeg", bytes: 134506, group: "crew" },

  // ---- Crew not currently in the People table (kept for reference) -------
  { id: "1qtylp8qG9nq07LesdLhGCy-dgUO-kakH", name: "crew-malo-1.jpeg", bytes: 56525, group: "crew-unlinked" },
  { id: "1HdQp38_xLw5l5RvGZHhCQuPJlMIklIVH", name: "crew-malo-5.jpeg", bytes: 109872, group: "crew-unlinked" },
  { id: "1_5tvBbeN8eZSxqi2qQYzVuE75xyqJ7mB", name: "crew-guillaume-2.jpeg", bytes: 210077, group: "crew-unlinked" },
  { id: "1D1ogMBRK1JB5DIqnLeFaY9vgsfIudvDD", name: "crew-guillaume-4.jpeg", bytes: 244496, group: "crew-unlinked" },
  { id: "1UUXgTzEa0D1v4L06KK4NhGR62Qwd8Emz", name: "crew-lou-1.jpeg", bytes: 151698, group: "crew-unlinked" },

  // ---- Expedition / lifestyle illustration ------------------------------
  { id: "1pB9OV2tCOxLn_5QZdlBrFtRebjD_d9kP", name: "expedition-1.jpeg", bytes: 272977, group: "expedition" },
  { id: "1tCUfsAnBUT9lKsBGjTF1xF3co0boyDwh", name: "expedition-2.jpeg", bytes: 123569, group: "expedition" },
  { id: "1AmIGdDMd6fisdnCkPGQ2OLOYc5oGg3Y3", name: "expedition-3.jpeg", bytes: 114057, group: "expedition" },
  { id: "1lN05wxLIpdgRSXA44cK2nFZfRnApN7X5", name: "expedition-4.jpeg", bytes: 108878, group: "expedition" },
  { id: "1Sl7s8YPn1Vqyuy9L7Tnw7boGCfLYu1mZ", name: "expedition-5.jpeg", bytes: 131308, group: "expedition" },
  { id: "1SeAlcF-zz1mFpQ6iGm7d3T6ilOazx8ks", name: "expedition-scuba.jpeg", bytes: 125959, group: "expedition" },
];

const driveUrl = (id) => `https://drive.google.com/uc?export=download&id=${id}`;

async function alreadyDownloaded(dest, expectedBytes) {
  try {
    const info = await stat(dest);
    return info.size === expectedBytes;
  } catch {
    return false;
  }
}

async function download(file) {
  const dest = path.join(OUT_DIR, file.name);

  if (await alreadyDownloaded(dest, file.bytes)) {
    return { ...file, status: "cached" };
  }

  const res = await fetch(driveUrl(file.id), { redirect: "follow" });
  if (!res.ok) {
    return { ...file, status: `HTTP ${res.status}` };
  }

  const buffer = Buffer.from(await res.arrayBuffer());

  // A folder that stopped being public returns Google's HTML sign-in page with
  // a 200, so trust the payload rather than the status code.
  if (buffer.subarray(0, 15).toString("utf8").toLowerCase().includes("<!doctype")) {
    return { ...file, status: "NOT PUBLIC (got an HTML page)" };
  }
  if (buffer.length !== file.bytes) {
    return { ...file, status: `size mismatch: got ${buffer.length}, expected ${file.bytes}` };
  }

  await writeFile(dest, buffer);
  return { ...file, status: "ok", written: buffer.length };
}

await mkdir(OUT_DIR, { recursive: true });

const results = [];
for (const file of FILES) {
  const result = await download(file);
  results.push(result);
  const mark = result.status === "ok" || result.status === "cached" ? "✓" : "✗";
  console.log(`${mark} ${file.group.padEnd(14)} ${file.name.padEnd(32)} ${result.status}`);
}

const failed = results.filter((r) => r.status !== "ok" && r.status !== "cached");
console.log(
  `\n${results.length - failed.length}/${results.length} files in ${path.relative(process.cwd(), OUT_DIR)}/`,
);
if (failed.length > 0) {
  console.error(`\n${failed.length} failed:`);
  for (const f of failed) console.error(`  ${f.name}: ${f.status}`);
  process.exitCode = 1;
}
