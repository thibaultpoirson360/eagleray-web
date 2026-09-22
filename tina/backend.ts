/**
 * tina/backend.ts — builds the self-hosted Tina backend request handler.
 * api/tina/backend.ts (the Vercel Function entry) just re-exports this.
 *
 * Kept here so the same handler can be mounted somewhere else (e.g. an Astro
 * endpoint shim) without touching auth/database wiring — see docs/tina-setup.md
 * section 2 for why that fallback may be needed.
 *
 * Routes served under /api/tina/*:
 *   /gql   GraphQL (auth required, editor must be on the allowlist)
 *   /auth  Auth.js (Google sign-in, callback, session, sign-out)
 *
 * NOTE: the backend must query through the GENERATED client
 * (tina/__generated__/databaseClient), not tina/database.ts directly — the
 * generated client is what carries the schema and the authorize() query.
 */
import { TinaNodeBackend, LocalBackendAuthProvider } from "@tinacms/datalayer";
import { AuthJsBackendAuthProvider } from "tinacms-authjs";
import databaseClient from "./__generated__/databaseClient";
import { authOptions } from "./auth";
import { requestStore } from "./git-provider";

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

function attributedAuthProvider() {
  const base = AuthJsBackendAuthProvider({ authOptions });
  return {
    ...base,
    // After Auth.js authorizes a request it has put the session on req.session.
    // Copy the editor's identity into the per-request store so the git
    // provider can attribute the commit to them.
    isAuthorized: async (req: any, res: any) => {
      const result = await base.isAuthorized(req, res);
      if (result.isAuthorized) {
        const user = req.session?.user;
        const store = requestStore.getStore();
        if (store && user) store.actor = { name: user.name, email: user.email };
      }
      return result;
    },
  };
}

const tinaHandler = TinaNodeBackend({
  authProvider: isLocal ? LocalBackendAuthProvider() : attributedAuthProvider(),
  databaseClient,
});

export default function handler(req: any, res: any) {
  return requestStore.run({}, () => tinaHandler(req, res));
}
