// Server-only access to this app's Cloudflare bindings. Each is present ONLY if
// opted into via app.manifest.json (D1 `DB`, R2 `STORAGE`, KV `KV`, and the
// container `CONTAINER`) — so the accessors are optional; guard before use.
//
// IMPORTANT: TanStack Start's createServerFn handlers run in an async context
// where the `cloudflare:workers` module's `env` global is NOT reliably
// populated. Instead, server.ts captures `env` from the Worker fetch handler
// (where it IS available) and passes it here via setEnv(). This is safe because
// `env` is the same object for every request in a Worker isolate — it is Worker
// configuration, not per-request data.
import type {
  D1Database,
  DurableObjectNamespace,
  KVNamespace,
  R2Bucket,
} from "@cloudflare/workers-types";

type AppEnv = {
  DB?: D1Database;
  STORAGE?: R2Bucket;
  KV?: KVNamespace;
  // The container's Durable Object — present only when "container" is set in
  // the manifest. Reach an instance with env.CONTAINER.getByName(id), then
  // .fetch(). See skills/containers.md.
  CONTAINER?: DurableObjectNamespace;
  HF_ENV?: string;
  APP_SLUG?: string;
};

// Module-level store — set once per Worker isolate by server.ts.
// Safe: env is Worker-scoped configuration, identical across all requests.
let _env: AppEnv | null = null;

/**
 * Called from server.ts fetch() to capture the Cloudflare env.
 * Must run before any createServerFn handler executes.
 */
export function setEnv(env: unknown): void {
  _env = env as AppEnv;
}

/**
 * Returns the Cloudflare bindings (DB, STORAGE, KV, etc.).
 * Throws if setEnv() has not been called yet.
 */
export function bindings(): AppEnv {
  if (_env) return _env;
  throw new Error(
    "Cloudflare bindings not initialized. setEnv() must be called from server.ts before any server function runs."
  );
}
