/**
 * Vercel Function entry for the Cloudinary media backend (list/delete).
 * Mirrors api/tina/backend.ts -> tina/backend.ts. No vercel.json rewrite
 * needed — this only ever needs to match its own literal path, unlike
 * /api/tina/* which fans out to sub-routes on one function.
 */
import handler from "../../tina/media/cloudinary-backend.js";

export default handler;
