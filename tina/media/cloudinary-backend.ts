/**
 * Backend half of the Cloudinary media store (see cloudinary-media-store.ts
 * for why this split exists). Listing and deleting existing uploads need
 * Cloudinary's authenticated Admin API — there's no unsigned equivalent, so
 * the API key/secret must stay server-side, unlike the upload itself.
 *
 * api/media/cloudinary.ts (the Vercel Function entry) re-exports this,
 * mirroring the api/tina/backend.ts -> tina/backend.ts split.
 *
 * Authorization reuses the exact same check the Tina GraphQL backend uses
 * (tina/backend.ts) — an editor must be signed in via Auth.js, not a new
 * auth mechanism for this one endpoint.
 */
import { AuthJsBackendAuthProvider } from "tinacms-authjs";
import { authOptions } from "../auth.js";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;
const ROOT_FOLDER = "eagleray-web";

function basicAuthHeader(): string {
  return "Basic " + Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64");
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    res.status(500).json({ error: "Cloudinary isn't configured on this deployment." });
    return;
  }

  const { isAuthorized } = AuthJsBackendAuthProvider({ authOptions });
  const auth = await isAuthorized(req, res);
  if (!auth.isAuthorized) {
    res.status(403).json({ error: "Not signed in as an editor." });
    return;
  }

  const { action, directory, limit, offset, publicId } = req.body ?? {};

  if (action === "list") {
    const prefix = directory ? `${ROOT_FOLDER}/${directory}` : ROOT_FOLDER;
    const params = new URLSearchParams({
      type: "upload",
      prefix,
      max_results: String(limit ?? 50),
    });
    if (offset) params.set("next_cursor", String(offset));

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image?${params}`, {
      headers: { Authorization: basicAuthHeader() },
    });
    if (!response.ok) {
      res.status(response.status).json({ error: "Cloudinary list failed" });
      return;
    }
    const data = await response.json();
    res.status(200).json({ resources: data.resources, nextOffset: data.next_cursor });
    return;
  }

  if (action === "delete") {
    if (!publicId) {
      res.status(400).json({ error: "Missing publicId" });
      return;
    }
    const params = new URLSearchParams({ "public_ids[]": publicId });
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image/upload?${params}`,
      { method: "DELETE", headers: { Authorization: basicAuthHeader() } }
    );
    if (!response.ok) {
      res.status(response.status).json({ error: "Cloudinary delete failed" });
      return;
    }
    res.status(200).json({ ok: true });
    return;
  }

  res.status(400).json({ error: `Unknown action "${action}"` });
}
