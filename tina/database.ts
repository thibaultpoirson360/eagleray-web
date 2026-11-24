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
 * Deployed (production, and the branches in REDIS_BRANCHES): GitHub PAT +
 * Upstash Redis (REST). See docs/tina-setup.md.
 *
 * Every other Vercel preview: an in-memory index built from the repo's own
 * files, and editing switched off. Why: upstash-redis-level keeps the whole
 * index in ONE Redis hash ("level:h"), and Upstash caps a single record at
 * 100 MB. A full copy per preview branch filled it in Nov 2026 and every
 * build, production included, failed with "max single record size exceeded".
 * Previews still build the full site; only their /admin editor does not work.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import * as datalayer from "@tinacms/datalayer";
import { MemoryLevel } from "memory-level";
// upstash-redis-level ships a UMD-wrapped CJS build: its `exports.RedisLevel =`
// assignment happens inside a nested factory function, not at the module's
// top level. Node's real ESM loader (confirmed in production:
// "does not provide an export named 'RedisLevel'") statically scans only the
// top level for named CJS exports to synthesize as ESM bindings, so it can't
// see this one and only produces a `default` pointing at the whole
// `module.exports` object. Import the default and destructure instead.
import UpstashRedisLevel from "upstash-redis-level";
import { AttributedGitHubProvider } from "./git-provider.js";

const { RedisLevel } = UpstashRedisLevel;
// FilesystemBridge is exported at run time (the build uses it), but
// @tinacms/datalayer 2.0.29's type definitions don't expose it to tsc
// ("no exported member"), so it is read off the namespace with its shape.
const { createDatabase, createLocalDatabase } = datalayer;
const { FilesystemBridge } = datalayer as unknown as {
  FilesystemBridge: new (rootPath: string) => NonNullable<Parameters<typeof createDatabase>[0]["bridge"]>;
};

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

// The only branches whose index lives in Redis. Keep this list short: each
// entry is a full copy of the content in one 100 MB Redis record.
const REDIS_BRANCHES = ["main", "staging"];
const useRedis =
  process.env.VERCEL_ENV !== "preview" || REDIS_BRANCHES.includes(branch);

/**
 * Preview builds: same content, indexed in memory. `tinacms build` indexes
 * into its own copy (and throws it away); `astro build` is a separate
 * process, so this module indexes the repo files again when it is first
 * imported there. The generated schema files only exist after
 * `tinacms build` has written them, so a missing file just means "not yet"
 * (the CLI's own indexing step) or "not here" (the runtime /api function,
 * where editing is off anyway).
 */
async function createPreviewDatabase() {
  const rootPath = process.cwd();
  const database = createDatabase({
    bridge: new FilesystemBridge(rootPath),
    gitProvider: {
      onPut: async () => {
        throw new Error(`Editing is off on preview builds (branch "${branch}"). Edit on the live site.`);
      },
      onDelete: async () => {
        throw new Error(`Editing is off on preview builds (branch "${branch}"). Edit on the live site.`);
      },
    },
    databaseAdapter: new MemoryLevel<string, Record<string, unknown>>({ valueEncoding: "json" }) as any,
  });
  const generated = path.join(rootPath, "tina", "__generated__");
  let graphQLSchema: unknown;
  let schema: unknown;
  try {
    graphQLSchema = JSON.parse(readFileSync(path.join(generated, "_graphql.json"), "utf8"));
    schema = JSON.parse(readFileSync(path.join(generated, "_schema.json"), "utf8"));
  } catch {
    return database;
  }
  await database.indexContent({ graphQLSchema, tinaSchema: { schema } } as any);
  return database;
}

export default isLocal
  ? createLocalDatabase()
  : !useRedis
  ? await createPreviewDatabase()
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
