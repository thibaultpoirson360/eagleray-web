/**
 * Self-hosted TinaCMS has no built-in production media store (`media.tina`
 * needs a Tina Cloud media API) — see docs/tina-setup.md section 8. This
 * plugs in Cloudinary instead, so editors can upload their own photos from
 * the admin, with size/format normalized by an unsigned upload preset
 * configured in the Cloudinary dashboard (docs/tina-setup.md has the steps).
 *
 * Wired in via `media.loadCustomStore` in tina/config.ts (deployed builds
 * only — local dev keeps the simpler git-backed `media.tina` store).
 *
 * `persist` (upload) talks to Cloudinary directly from the browser using an
 * UNSIGNED preset — no API secret in this bundle, and no Vercel Function
 * body-size ceiling in the way of a phone photo. `list` and `delete` need
 * Cloudinary's authenticated Admin API, which has no unsigned form, so
 * those two go through /api/media/cloudinary (tina/media/cloudinary-backend.ts),
 * gated by the same editor-session check the Tina GraphQL backend itself
 * uses.
 *
 * The cloud name and upload preset name come from that same endpoint
 * (action: "config"), fetched once and cached, NOT read via
 * `process.env` in this file. TinaCMS's admin bundle only ever gets real
 * values for two specific env vars (TINA_PUBLIC_IS_LOCAL, NODE_ENV —
 * confirmed by inspecting the actual built bundle); every other
 * `process.env.*` reference here silently resolves to undefined in the
 * browser regardless of what's set in Vercel, regardless of where in this
 * file (or tina/config.ts) it's read from. Neither value is secret — the
 * cloud name is part of every public delivery URL, and an unsigned
 * preset's name is meant to be client-visible — so fetching them at
 * runtime costs nothing security-wise, just one small request before the
 * first upload/list/delete.
 */
import type { Media, MediaList, MediaListOptions, MediaStore, MediaUploadOptions } from "tinacms";

// All uploads live under one folder in the Cloudinary account, separate
// from anything else that might land in the same account later.
const ROOT_FOLDER = "eagleray-web";

interface CloudinaryResource {
  public_id: string;
  format: string;
  folder?: string;
}

interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

let configPromise: Promise<CloudinaryConfig> | null = null;

async function getConfig(): Promise<CloudinaryConfig> {
  configPromise ??= fetch("/api/media/cloudinary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ action: "config" }),
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(`Couldn't load Cloudinary config (HTTP ${response.status}).`);
    }
    return response.json();
  });
  return configPromise;
}

function deliveryUrl(cloudName: string, publicId: string, format: string): string {
  // f_auto/q_auto pick the best format (WebP/AVIF) and compression per
  // visitor at request time — deliberately not baked in at upload time,
  // since the "best" format differs per browser.
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${publicId}.${format}`;
}

function toMedia(cloudName: string, resource: CloudinaryResource): Media {
  const filename = resource.public_id.split("/").pop() ?? resource.public_id;
  return {
    type: "file",
    id: resource.public_id,
    filename: `${filename}.${resource.format}`,
    directory: resource.folder ?? "",
    src: deliveryUrl(cloudName, resource.public_id, resource.format),
  };
}

export default class CloudinaryMediaStore implements MediaStore {
  accept = "image/*";
  // Cloudinary's free-plan unsigned uploads cap around here — adjust if
  // the account's plan/limits change.
  maxSize = 10 * 1024 * 1024;

  async persist(files: MediaUploadOptions[]): Promise<Media[]> {
    const { cloudName, uploadPreset } = await getConfig();
    return Promise.all(
      files.map(async ({ directory, file }) => {
        const body = new FormData();
        body.append("file", file);
        body.append("upload_preset", uploadPreset);
        body.append("folder", directory ? `${ROOT_FOLDER}/${directory}` : ROOT_FOLDER);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body,
        });
        if (!response.ok) {
          throw new Error(`Cloudinary upload failed (HTTP ${response.status}).`);
        }
        return toMedia(cloudName, await response.json());
      })
    );
  }

  async list(options?: MediaListOptions): Promise<MediaList> {
    const { cloudName } = await getConfig();
    const response = await fetch("/api/media/cloudinary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        action: "list",
        directory: options?.directory,
        limit: options?.limit,
        offset: options?.offset,
      }),
    });
    if (!response.ok) {
      throw new Error(`Couldn't list Cloudinary media (HTTP ${response.status}).`);
    }
    const data = await response.json();
    const resources: CloudinaryResource[] = data.resources ?? [];
    return { items: resources.map((r) => toMedia(cloudName, r)), nextOffset: data.nextOffset };
  }

  async delete(media: Media): Promise<void> {
    const response = await fetch("/api/media/cloudinary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ action: "delete", publicId: media.id }),
    });
    if (!response.ok) {
      throw new Error(`Couldn't delete from Cloudinary (HTTP ${response.status}).`);
    }
  }
}
