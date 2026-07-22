// Adaptador: tagged template `sql` sobre la API oficial de D1 (prepare/bind).
//
// queries.ts y rights-engine.ts fueron escritos contra una API `db.sql`...``
// que D1 no expone (la API real es prepare().bind()). Este wrapper conserva
// esa ergonomia y compila cada template a un statement parametrizado:
//
//   d.sql`SELECT * FROM t WHERE id = ${id}`.get()
//   -> DB.prepare("SELECT * FROM t WHERE id = ?").bind(id).first()
//
// Mapeos: .all() -> .all() (devuelve { results }), .get() -> .first(),
// .run() -> .run(). Los valores SIEMPRE viajan como parametros bind:
// interpolar strings en el SQL queda prohibido (el wrapper lo rechaza).
import type { D1Database } from "@cloudflare/workers-types";

export interface SqlStatement {
  all(): Promise<{ results: unknown[] }>;
  get(): Promise<unknown>;
  run(): Promise<unknown>;
}

export interface SqlDb {
  sql(strings: TemplateStringsArray, ...values: unknown[]): SqlStatement;
  /** Acceso directo a D1 para casos que necesitan SQL dinamico (armar con placeholders y bind). */
  raw: D1Database;
}

export function withSqlTag(db: D1Database): SqlDb {
  return {
    raw: db,
    sql(strings: TemplateStringsArray, ...values: unknown[]): SqlStatement {
      if (!Array.isArray(strings) || !("raw" in strings)) {
        throw new Error(
          "d.sql debe usarse como tagged template (d.sql`...`), nunca como funcion con un string interpolado: eso permite SQL injection. Para SQL dinamico usar d.raw.prepare() con placeholders."
        );
      }
      const query = strings.join("?");
      const stmt = db.prepare(query).bind(...values);
      return {
        all: async () => (await stmt.all()) as { results: unknown[] },
        get: () => stmt.first(),
        run: () => stmt.run(),
      };
    },
  };
}
