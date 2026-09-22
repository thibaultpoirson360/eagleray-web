/**
 * tina/database.ts — self-hosted Tina's two required server-side pieces:
 *
 *   Git provider      writes content changes to GitHub (source of truth)
 *   Database adapter  a key-value INDEX Tina's GraphQL layer queries; it is
 *                     required by createDatabase() — not optional. Content
 *                     itself is never stored only here; `tinacms build`
 *                     re-indexes it from git.
 *
 * Local (`TINA_PUBLIC_IS_LOCAL=true`): createLocalDatabase() — filesystem +
 * in-memory index, no GitHub, no Redis.
 *
 * Deployed: GitHub PAT + Upstash Redis (REST). See docs/tina-setup.md.
 */
import { createDatabase, createLocalDatabase } from "@tinacms/datalayer";
import { RedisLevel } from "upstash-redis-level";
import { AttributedGitHubProvider } from "./git-provider.js";

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

// Which branch editors read/write. On Vercel this resolves per deployment:
// production -> main, a preview of branch X -> X (each branch gets its own
// index namespace below). Leave GITHUB_BRANCH unset on Vercel unless you want
// to force one branch everywhere.
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default isLocal
  ? createLocalDatabase()
  : createDatabase({
      gitProvider: new AttributedGitHubProvider({
        branch,
        owner: process.env.GITHUB_OWNER!,
        repo: process.env.GITHUB_REPO!,
        token: process.env.GITHUB_PERSONAL_ACCESS_TOKEN!,
      }),
      // `as any`: upstash-redis-level types its keys as string only while
      // @tinacms/graphql's non-exported `Level` type also allows Buffer.
      // Structural typing mismatch between the two packages, not a runtime one.
      databaseAdapter: new RedisLevel({
        redis: {
          url: process.env.KV_REST_API_URL!,
          token: process.env.KV_REST_API_TOKEN!,
        },
        debug: process.env.TINA_DEBUG === "true",
      }) as any,
      // Separate index per branch so previews never overwrite production's.
      namespace: branch,
    });
