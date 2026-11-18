/**
 * Backend half of the Cloudinary media store (see cloudinary-media-store.ts
 * for why this split exists). Listing and deleting existing uploads need
 * Cloudinary's authenticated Admin API — there's no unsigned equivalent, so
 * the API key/secret must stay server-side, unlike the upload itself.
 *
 * Also serves the `config` action: TinaCMS's admin bundle only ever gets
 * real values for two specific env vars (TINA_PUBLIC_IS_LOCAL, NODE_ENV —
 * confirmed by inspecting the actual built bundle); every other
 * `process.env.*` reference anywhere in code that ends up in that bundle,
 * cloudinary-media-store.ts included, silently resolves to undefined in
 * the browser no matter what's set in Vercel. CLOUDINARY_CLOUD_NAME and
 * CLOUDINARY_UPLOAD_PRESET aren't secrets (the cloud name is part of every
 * public delivery URL; an unsigned preset's name is meant to be
 * client-visible), so the fix is simpler than it sounds: the browser just
 * asks this endpoint for them at runtime instead of expecting them baked
 * into the bundle at build time.
 *
 * api/media/cloudinary.ts (the Vercel Function entry) re-exports this,
 * mirroring the api/tina/backend.ts -> tina/backend.ts split. The Cloudinary
 * calls themselves live in cloudinary-actions.ts, shared with the local
 * dev route in astro.config.mjs.
 *
 * Authorization reuses the exact same check the Tina GraphQL backend uses
 * (tina/backend.ts) — an editor must be signed in via Auth.js, not a new
 * auth mechanism for this one endpoint. `config` doesn't strictly need the
 * gate (nothing sensitive in it), but by the time the admin ever calls
 * this the editor is already signed in anyway (media only loads after
 * TinaAdmin mounts, which only happens post-login) — no reason for a
 * second, ungated code path.
 */
import { AuthJsBackendAuthProvider } from "tinacms-authjs";
import { authOptions } from "../auth.js";
import { isConfigured, runAction, type CloudinaryEnv } from "./cloudinary-actions.js";

const env: CloudinaryEnv = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  if (!isConfigured(env)) {
    res.status(500).json({ error: "Cloudinary isn't configured on this deployment." });
    return;
  }

  const { isAuthorized } = AuthJsBackendAuthProvider({ authOptions });
  const auth = await isAuthorized(req, res);
  if (!auth.isAuthorized) {
    res.status(403).json({ error: "Not signed in as an editor." });
    return;
  }

  const result = await runAction(req.body ?? {}, env);
  res.status(result.status).json(result.body);
}
