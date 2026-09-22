/**
 * Vercel Function entry for the self-hosted Tina backend (CLAUDE.md decision:
 * backend as Vercel Functions). All logic lives in tina/backend.ts.
 * vercel.json rewrites /api/tina/* to this function (Vercel Functions have no
 * catch-all routing of their own — the pattern from Tina's Vercel Functions doc).
 *
 * !! UNVERIFIED on a real deploy: Vercel's Astro guide says root `api/`
 * functions + vercel.json rewrites are not the supported route with the
 * @astrojs/vercel adapter. First deploy MUST run the smoke test in
 * docs/tina-setup.md section 2 before anything else is trusted.
 */
import handler from "../../tina/backend";

export default handler;
