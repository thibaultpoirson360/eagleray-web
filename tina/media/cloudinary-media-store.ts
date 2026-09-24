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
 * `process.env.*` here (not `import.meta.env`) matches how the rest of
 * tina/config.ts reads env vars — TinaCMS's CLI (Vite under the hood)
 * statically replaces these at build time, the same way it already does
 * for TINA_PUBLIC_IS_LOCAL elsewhere in this config.
 */
import type { Media, MediaList, MediaListOptions, MediaStore, MediaUploadOptions } from "tinacms";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME ?? "";
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET ?? "";

// All uploads live under one folder in the Cloudinary account, separate
// from anything else that might land in the same account later.
const ROOT_FOLDER = "eagleray-web";

interface CloudinaryResource {
  public_id: string;
  format: string;
  folder?: string;
}

function deliveryUrl(publicId: string, format: string): string {
  // f_auto/q_auto pick the best format (WebP/AVIF) and compression per
  // visitor at request time — deliberately not baked in at upload time,
  // since the "best" format differs per browser.
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/${publicId}.${format}`;
}

function toMedia(resource: CloudinaryResource): Media {
  const filename = resource.public_id.split("/").pop() ?? resource.public_id;
  return {
    type: "file",
    id: resource.public_id,
    filename: `${filename}.${resource.format}`,
    directory: resource.folder ?? "",
    src: deliveryUrl(resource.public_id, resource.format),
  };
}

export default class CloudinaryMediaStore implements MediaStore {
  accept = "image/*";
  // Cloudinary's free-plan unsigned uploads cap around here — adjust if
  // the account's plan/limits change.
  maxSize = 10 * 1024 * 1024;

  async persist(files: MediaUploadOptions[]): Promise<Media[]> {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error(
        "Cloudinary isn't configured on this deployment — see docs/tina-setup.md section 8."
      );
    }
    return Promise.all(
      files.map(async ({ directory, file }) => {
        const body = new FormData();
        body.append("file", file);
        body.append("upload_preset", UPLOAD_PRESET);
        body.append("folder", directory ? `${ROOT_FOLDER}/${directory}` : ROOT_FOLDER);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
          method: "POST",
          body,
        });
        if (!response.ok) {
          throw new Error(`Cloudinary upload failed (HTTP ${response.status}).`);
        }
        return toMedia(await response.json());
      })
    );
  }

  async list(options?: MediaListOptions): Promise<MediaList> {
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
    return { items: resources.map(toMedia), nextOffset: data.nextOffset };
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
