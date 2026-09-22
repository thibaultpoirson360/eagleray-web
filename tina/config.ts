/**
 * tina/config.ts — self-hosted TinaCMS config (no Tina Cloud: no clientId/token).
 *
 * See docs/tina-setup.md for the architecture and the places where the current
 * docs/packages differ from the original plan.
 */
import { defineConfig, LocalAuthProvider } from "tinacms";
import { DefaultAuthJSProvider } from "tinacms-authjs/dist/tinacms";

import siteSettings from "./collections/siteSettings";
import hero from "./collections/hero";
import difference from "./collections/difference";
import { crewSection, crew } from "./collections/crew";
import wildlife from "./collections/wildlife";
import { boatsSection, boats } from "./collections/boats";
import funnel from "./collections/funnel";
import navPages from "./collections/navPages";
import editors from "./collections/editors";

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Deployed: admin + generated client talk to OUR backend (api/tina/backend.ts),
  // not app.tina.io. Local: unset, so `tinacms dev` serves GraphQL itself on
  // :4001 — plain `astro dev` does not serve root /api functions.
  ...(isLocal ? {} : { contentApiUrlOverride: "/api/tina/gql" }),

  // Local: no login. Deployed: Google OAuth through Auth.js. `name` is the
  // Auth.js provider id used by signIn("google").
  authProvider: isLocal
    ? new LocalAuthProvider()
    : new DefaultAuthJSProvider({ name: "google", callbackUrl: "/admin/index.html" }),

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  // Self-hosted Tina has no repo-media API (that is a Tina Cloud service): the
  // admin refuses `media.tina` uploads on a custom backend. `static: true` gives
  // a read-only picker over files already committed under public/<mediaRoot>.
  // Uploads work locally only; in production add images to git (or wire an
  // external store with media.loadCustomStore — see docs/tina-setup.md).
  media: {
    tina: {
      publicFolder: "public",
      mediaRoot: "assets",
      static: !isLocal,
    },
  },

  schema: {
    collections: [
      // homepage sections, in page order
      hero,
      difference,
      crewSection,
      crew,
      wildlife,
      boatsSection,
      boats,
      funnel,
      // pages + globals
      navPages,
      siteSettings,
      // access list for Google sign-in
      editors,
    ],
  },
});
