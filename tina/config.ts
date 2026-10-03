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
import crewPage from "./collections/crewPage";
import wildlife from "./collections/wildlife";
import { boatsSection, boats } from "./collections/boats";
import funnel from "./collections/funnel";
import navPages from "./collections/navPages";
import navigation from "./collections/navigation";
import footer from "./collections/footer";
import contactPage from "./collections/contactPage";
import notFoundPage from "./collections/notFoundPage";
import laPage from "./collections/laPage";
import aboutPage from "./collections/aboutPage";
import { blogSection, blogPost } from "./collections/blog";
import landingPage from "./collections/landingPage";
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

  // Self-hosted Tina has no repo-media API (that is a Tina Cloud service),
  // so the two modes use genuinely different stores, not one config with a
  // flag — see docs/tina-setup.md section 8.
  //   local:    the simple git-backed picker, read-write (no cloud account
  //             needed to develop).
  //   deployed: Cloudinary via media.loadCustomStore, so editors can upload
  //             their own photos from the admin (see
  //             tina/media/cloudinary-media-store.ts for how and why).
  media: isLocal
    ? { tina: { publicFolder: "public", mediaRoot: "assets", static: false } }
    : {
        loadCustomStore: async () => {
          const { default: CloudinaryMediaStore } = await import("./media/cloudinary-media-store");
          return CloudinaryMediaStore;
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
      navigation,
      footer,
      contactPage,
      notFoundPage,
      laPage,
      aboutPage,
      crewPage,
      blogSection,
      blogPost,
      landingPage,
      siteSettings,
      // access list for Google sign-in
      editors,
    ],
  },
});
