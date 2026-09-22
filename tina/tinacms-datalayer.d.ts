/**
 * Module augmentation for `@tinacms/datalayer`.
 *
 * The package's real, runtime-exported members `TinaNodeBackend`,
 * `LocalBackendAuthProvider`, `createDatabase` and `createLocalDatabase`
 * live in submodules that its root `dist/index.d.ts` re-exports via
 * extensionless specifiers (`export * from './backend'`, and
 * `export { ... } from './database'` inside the `@tinacms/graphql`
 * dependency it re-exports from) — no file extension on either. Under
 * plain "Bundler" resolution (Astro's own tsconfig) that's fine, but
 * Vercel's build type-checks api/ functions under stricter Node16/NodeNext
 * resolution, which requires extensions on relative specifiers even inside
 * a dependency's own .d.ts. TypeScript can't resolve those re-exports
 * there, so it reports "has no exported member" for symbols that are
 * genuinely present at runtime (confirmed via
 * `node -e "console.log(Object.keys(require('@tinacms/datalayer')))"`).
 *
 * This augments the existing ambient module with the real declarations,
 * copied from `@tinacms/datalayer/dist/backend/index.d.ts` and
 * `@tinacms/graphql/dist/database/index.d.ts`, so consumers
 * (tina/backend.ts, tina/database.ts) type-check under either resolution
 * mode without a fragile deep import into either package's dist/ internals.
 * Delete this file if a future release fixes the re-export paths.
 */
declare module "@tinacms/datalayer" {
  import type { IncomingMessage, ServerResponse } from "node:http";

  // ---- from @tinacms/graphql's database module (createDatabase family) ----
  export interface Level {
    [key: string]: any;
  }
  export interface GitProvider {
    onPut: (key: string, value: string) => Promise<void>;
    onDelete: (key: string) => Promise<void>;
  }
  export interface DatabaseArgs {
    bridge?: unknown;
    level: Level;
    onPut?: (key: string, value: any) => Promise<void>;
    onDelete?: (key: string) => Promise<void>;
    tinaDirectory?: string;
    version?: boolean;
    namespace?: string;
    levelBatchSize?: number;
  }
  export type CreateDatabase = Omit<DatabaseArgs, "level" | "onPut" | "onDelete"> & {
    databaseAdapter: Level;
    gitProvider: GitProvider;
  };
  export type CreateLocalDatabaseArgs = Omit<DatabaseArgs, "level"> & {
    port?: number;
  };
  export class Database {
    [key: string]: any;
  }
  export function createDatabase(config: CreateDatabase): Database;
  export function createLocalDatabase(config?: CreateLocalDatabaseArgs): Database;

  // ---- from @tinacms/datalayer's own backend module ----
  export interface BackendAuthProvider {
    initialize?: () => Promise<void>;
    isAuthorized: (
      req: IncomingMessage,
      res: ServerResponse
    ) => Promise<
      | { isAuthorized: true }
      | { isAuthorized: false; errorMessage: string; errorCode: number }
    >;
    extraRoutes?: {
      [key: string]: {
        secure?: boolean;
        handler: (
          req: IncomingMessage,
          res: ServerResponse,
          opts: { basePath?: string }
        ) => Promise<void>;
      };
    };
  }

  export type NodeApiHandler = (
    req: IncomingMessage,
    res: ServerResponse
  ) => Promise<void>;

  export interface TinaBackendOptions {
    databaseClient: any;
    authProvider: BackendAuthProvider;
    options?: { basePath?: string };
  }

  export function LocalBackendAuthProvider(): BackendAuthProvider;
  export function TinaNodeBackend(options: TinaBackendOptions): NodeApiHandler;
}
