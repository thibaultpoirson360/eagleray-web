/**
 * Shared, non-secret site constants. Safe to import from client components.
 */

/** Thibault's direct line — mirrors the number used across the marketing site. */
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "525568090942";

/**
 * Absolute origin, required because Open Graph images must be absolute URLs for
 * WhatsApp to fetch them. Vercel injects VERCEL_PROJECT_PRODUCTION_URL, but an
 * explicit NEXT_PUBLIC_SITE_URL wins so preview deploys can be pointed at prod.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}
