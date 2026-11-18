/**
 * The Cloudinary Admin API calls behind the media manager (config / list /
 * delete), with no auth and no env reading of their own. Two callers:
 *
 *   - tina/media/cloudinary-backend.ts (the deployed Vercel Function): checks
 *     the editor's session first, then calls this with process.env values.
 *   - astro.config.mjs's dev-only middleware (`npm run tina:dev:cloudinary`):
 *     local mode has no login, so it calls this directly with the values
 *     from the local .env. That middleware only exists under `astro dev`;
 *     nothing in a production build can reach this without the session check.
 *
 * Folders: the account uses Cloudinary's DYNAMIC folder mode, where an
 * asset's folder ("asset folder") is separate from its public ID. Moving an
 * image between folders in the Cloudinary console therefore never changes
 * its delivery URL, and so never breaks a page. It also means a folder can't
 * be found by public-ID prefix: files are listed with `by_asset_folder`, and
 * subfolders with the folders API.
 *
 * Tina's "New folder" button doesn't call the store at all; it just opens an
 * empty view for that name. So `list` creates the folder in Cloudinary the
 * first time a missing folder is opened, otherwise it would vanish as soon
 * as the editor navigated away without uploading into it.
 */

// All media lives under this one folder in the Cloudinary account. Editors
// see paths relative to it ("boats", not "eagleray-web/boats").
export const ROOT_FOLDER = "eagleray-web";

export interface CloudinaryEnv {
  cloudName?: string;
  uploadPreset?: string;
  apiKey?: string;
  apiSecret?: string;
}

export interface ActionResult {
  status: number;
  body: unknown;
}

interface ActionRequest {
  action?: string;
  directory?: string;
  limit?: number;
  offset?: string;
  publicId?: string;
}

export function isConfigured(env: CloudinaryEnv): boolean {
  return Boolean(env.cloudName && env.uploadPreset && env.apiKey && env.apiSecret);
}

/** "boats/la paz" -> "eagleray-web/boats/la paz". Rejects `..` so a request can't step outside the root. */
function fullPath(directory?: string): string | null {
  const clean = (directory ?? "").replace(/^\/+|\/+$/g, "");
  if (!clean) return ROOT_FOLDER;
  if (clean.split("/").some((segment) => segment === ".." || segment === ".")) return null;
  return `${ROOT_FOLDER}/${clean}`;
}

/** Folder paths go in the URL path, one encoded segment at a time (names can contain spaces). */
function encodePath(path: string): string {
  return path.split("/").map(encodeURIComponent).join("/");
}

export async function runAction(request: ActionRequest, env: CloudinaryEnv): Promise<ActionResult> {
  const { action, directory, limit, offset, publicId } = request ?? {};
  const api = `https://api.cloudinary.com/v1_1/${env.cloudName}`;
  const headers = {
    Authorization: "Basic " + Buffer.from(`${env.apiKey}:${env.apiSecret}`).toString("base64"),
  };

  if (action === "config") {
    return { status: 200, body: { cloudName: env.cloudName, uploadPreset: env.uploadPreset } };
  }

  if (action === "list") {
    const folder = fullPath(directory);
    if (!folder) return { status: 400, body: { error: "Invalid folder name" } };

    // Subfolders only on the first page: later pages (offset set) are just
    // more files from the same folder.
    let folders: string[] = [];
    if (!offset) {
      const response = await fetch(`${api}/folders/${encodePath(folder)}?max_results=500`, { headers });
      if (response.ok) {
        const data = await response.json();
        folders = (data.folders ?? []).map((f: { name: string }) => f.name);
      } else if (response.status === 404 && folder !== ROOT_FOLDER) {
        // A folder the editor just made with "New folder": create it so it stays.
        const created = await fetch(`${api}/folders/${encodePath(folder)}`, { method: "POST", headers });
        if (!created.ok) return { status: created.status, body: { error: "Cloudinary couldn't create the folder" } };
      } else if (response.status !== 404) {
        return { status: response.status, body: { error: "Cloudinary folder list failed" } };
      }
    }

    const params = new URLSearchParams({ asset_folder: folder, max_results: String(limit ?? 50) });
    if (offset) params.set("next_cursor", String(offset));
    const response = await fetch(`${api}/resources/by_asset_folder?${params}`, { headers });
    if (!response.ok) return { status: response.status, body: { error: "Cloudinary list failed" } };
    const data = await response.json();
    // by_asset_folder returns every resource type; the media manager is images only.
    const resources = (data.resources ?? []).filter((r: { resource_type?: string }) => r.resource_type === "image");
    return { status: 200, body: { folders, resources, nextOffset: data.next_cursor } };
  }

  if (action === "delete") {
    if (!publicId) return { status: 400, body: { error: "Missing publicId" } };
    const params = new URLSearchParams({ "public_ids[]": publicId });
    const response = await fetch(`${api}/resources/image/upload?${params}`, { method: "DELETE", headers });
    if (!response.ok) return { status: response.status, body: { error: "Cloudinary delete failed" } };
    return { status: 200, body: { ok: true } };
  }

  return { status: 400, body: { error: `Unknown action "${action}"` } };
}
