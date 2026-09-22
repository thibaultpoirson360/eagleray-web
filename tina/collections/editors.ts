import type { Collection } from "tinacms";

/**
 * Editor allowlist for the Auth.js + Google OAuth setup (see tina/auth.ts).
 *
 * Google proves WHO someone is; this document decides WHETHER they may edit.
 * On sign-in, tinacms-authjs looks up the Google account's email (uidProp:
 * "email") in `users[].email`; a match means role "user" (allowed), no match
 * means "guest" (HTTP 403 from the backend).
 *
 * Tina requirements for an auth collection (verified in @tinacms/graphql):
 *   - `isAuthCollection: true` (only one per schema)
 *   - a single document at <path>/index.json
 *   - one list-of-objects field containing exactly one `uid: true` field
 *
 * Not `isDetached`: the list lives in git (content/editors/index.json), so
 * additions/removals are git commits and `tinacms build` re-syncs the database
 * from git. A password field is deliberately absent — OAuth only.
 *
 * Any signed-in editor can change this list from the admin (Tina OSS has no
 * per-collection permissions). See docs/tina-setup.md "Adding and removing
 * editors" for how to lock it to git-only changes if that is preferred.
 */
const editors: Collection = {
  name: "editors",
  label: "Editors (who can sign in)",
  path: "content/editors",
  format: "json",
  isAuthCollection: true,
  match: { include: "index" },
  ui: {
    global: true,
    allowedActions: { create: false, delete: false },
  },
  fields: [
    {
      type: "object",
      name: "users",
      label: "Editors",
      list: true,
      ui: {
        itemProps: (item: Record<string, string>) => ({ label: item?.email || "New editor" }),
        defaultItem: { email: "", name: "" },
      },
      fields: [
        {
          type: "string",
          name: "email",
          label: "Google account email",
          uid: true,
          required: true,
          description: "Lowercase. Must be the exact address of the Google account they sign in with.",
        },
        { type: "string", name: "name", label: "Name" },
      ],
    },
  ],
};

export default editors;
