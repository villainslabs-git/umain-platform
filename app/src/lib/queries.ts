// UMAIN Database Queries
import { createServerFn } from "@tanstack/react-start";
import { bindings } from "./bindings.server";
import { withSqlTag } from "./d1-sql";
import { 
  Provider, 
  Identity, 
  Campaign, 
  License, 
  GenerationJob, 
  AuditLogEntry, 
  LegalDocument,
  CharacterSheet,
  CharacterAsset,
  CharacterAttribute,
  ConsentMatrix,
  SystemSetting,
  DashboardStats,
  CharacterSheetWithAssets
} from "./types";

function db() {
  const { DB } = bindings();
  if (!DB) throw new Error("D1 binding not configured");
  return withSqlTag(DB);
}

// ============================================================
// PROVIDERS
// ============================================================
export const getProviders = createServerFn({ method: "GET" }).handler(async () => {
  const d = db();
  const result = await d.sql`SELECT * FROM providers ORDER BY created_at ASC`.all();
  return (result.results ?? []) as Provider[];
});

export const saveProvider = createServerFn({ method: "POST" })
  .validator((data: { id?: string; nombre: string; tipo: string; api_key: string; api_url: string }) => data)
  .handler(async ({ data }) => {
    const d = db();
    if (data.id) {
      await d.sql`UPDATE providers SET nombre = ${data.nombre}, tipo = ${data.tipo}, api_key_encrypted = ${data.api_key}, api_url = ${data.api_url}, updated_at = datetime('now') WHERE id = ${data.id}`.run();
      return { success: true, id: data.id };
    } else {
      const id = crypto.randomUUID();
      await d.sql`INSERT INTO providers (id, nombre, tipo, api_key_encrypted, api_url) VALUES (${id}, ${data.nombre}, ${data.tipo}, ${data.api_key}, ${data.api_url})`.run();
      return { success: true, id };
    }
  });

export const validateProvider = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const d = db();
    const provider = (await d.sql`SELECT * FROM providers WHERE id = ${data.id}`.get()) as Provider | undefined;
    if (!provider) return { success: false, error: "Provider no encontrado" };
    const hasKey = provider.api_key_encrypted && provider.api_key_encrypted.length > 0;
    const status = hasKey ? 'valido' : 'error';
    await d.sql`UPDATE providers SET estado_validacion = ${status}, ultima_validacion = datetime('now'), updated_at = datetime('now') WHERE id = ${data.id}`.run();
    return { success: hasKey, estado: status };
  });

export const deleteProvider = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const d = db();
    await d.sql`DELETE FROM providers WHERE id = ${data.id}`.run();
    return { success: true };
  });

// ============================================================
// SYSTEM SETTINGS
// ============================================================
export const getSettings = createServerFn({ method: "GET" }).handler(async () => {
  const d = db();
  const result = await d.sql`SELECT key, value FROM system_settings`.all();
  const settings: Record<string, string> = {};
  const rows = (result.results ?? []) as Array<{ key: string; value: string }>;
  for (const row of rows) settings[row.key] = row.value;
  return settings;
});

export const saveSetting = createServerFn({ method: "POST" })
  .validator((data: { key: string; value: string }) => data)
  .handler(async ({ data }) => {
    const d = db();
    await d.sql`INSERT OR REPLACE INTO system_settings (key, value, updated_at) VALUES (${data.key}, ${data.value}, datetime('now'))`.run();
    return { success: true };
  });

// ============================================================
// DASHBOARD STATS
// ============================================================
export const getDashboardStats = createServerFn({ method: "GET" }).handler(async () => {
  const d = db();

  const identidades = (await d.sql`SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN estado = 'activo' THEN 1 ELSE 0 END) as activas,
    SUM(CASE WHEN estado = 'suspendido' THEN 1 ELSE 0 END) as suspendidas
  FROM identities`.get()) as Record<string, any> | undefined;

  const campanias = (await d.sql`SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN estado = 'activa' THEN 1 ELSE 0 END) as activas
  FROM campaigns`.get()) as Record<string, any> | undefined;

  const licencias = (await d.sql`SELECT COUNT(*) as vigentes FROM licenses WHERE estado = 'vigente'`.get()) as Record<string, any> | undefined;
  
  const jobs = (await d.sql`SELECT 
    SUM(CASE WHEN estado IN ('generando','pendiente_qa') THEN 1 ELSE 0 END) as en_curso,
    SUM(CASE WHEN estado = 'entregado' THEN 1 ELSE 0 END) as completados
  FROM generation_jobs`.get()) as Record<string, any> | undefined;

  const aprobaciones = (await d.sql`SELECT COUNT(*) as pendientes FROM approvals WHERE decision IS NULL`.get()) as Record<string, any> | undefined;
  const proveedores = (await d.sql`SELECT COUNT(*) as total FROM providers WHERE activo = 1`.get()) as Record<string, any> | undefined;

  return {
    total_identidades: Number(identidades?.total ?? 0),
    identidades_activas: Number(identidades?.activas ?? 0),
    identidades_suspendidas: Number(identidades?.suspendidas ?? 0),
    total_campanias: Number(campanias?.total ?? 0),
    campanias_activas: Number(campanias?.activas ?? 0),
    licencias_vigentes: Number(licencias?.vigentes ?? 0),
    jobs_en_curso: Number(jobs?.en_curso ?? 0),
    jobs_completados: Number(jobs?.completados ?? 0),
    aprobaciones_pendientes: Number(aprobaciones?.pendientes ?? 0),
    alertas: 0,
    proveedores_conectados: Number(proveedores?.total ?? 0),
  };
});

// ============================================================
// IDENTITIES (Avatares/Clones CRUD)
// ============================================================
export const getIdentities = createServerFn({ method: "GET" }).handler(async () => {
  const d = db();
  const result = await d.sql`SELECT * FROM identities ORDER BY created_at DESC`.all();
  return (result.results ?? []) as Identity[];
});

export const getIdentity = createServerFn({ method: "GET" })
  .validator((data: string) => data)
  .handler(async ({ data: id }) => {
    const d = db();
    const result = await d.sql`SELECT * FROM identities WHERE id = ${id}`.get();
    return (result ?? null) as Identity | null;
  });

export const createIdentity = createServerFn({ method: "POST" })
  .validator((data: { nombre: string; tier: string; agencia_id?: string; contrato_ref?: string; contacto_aprobacion?: string }) => data)
  .handler(async ({ data }) => {
    const d = db();
    const id = crypto.randomUUID();
    await d.sql`INSERT INTO identities (id, nombre, tier, agencia_id, contrato_ref, contacto_aprobacion)
      VALUES (${id}, ${data.nombre}, ${data.tier}, ${data.agencia_id || null}, ${data.contrato_ref || null}, ${data.contacto_aprobacion || null})`.run();
    return { success: true, id };
  });

export const updateIdentityStatus = createServerFn({ method: "POST" })
  .validator((data: { id: string; estado: string }) => data)
  .handler(async ({ data }) => {
    const d = db();
    await d.sql`UPDATE identities SET estado = ${data.estado}, updated_at = datetime('now') WHERE id = ${data.id}`.run();
    return { success: true };
  });

export const deleteIdentity = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const d = db();
    await d.sql`UPDATE identities SET estado = 'suprimido', updated_at = datetime('now') WHERE id = ${data.id}`.run();
    return { success: true };
  });

export const updateIdentity = createServerFn({ method: "POST" })
  .validator((data: { id: string; nombre?: string; tier?: string; agencia_id?: string; contrato_ref?: string; contacto_aprobacion?: string }) => data)
  .handler(async ({ data }) => {
    const d = db();
    const sets: string[] = [];
    const params: unknown[] = [];
    const campos: Array<[string, string | undefined]> = [
      ['nombre', data.nombre],
      ['tier', data.tier],
      ['agencia_id', data.agencia_id],
      ['contrato_ref', data.contrato_ref],
      ['contacto_aprobacion', data.contacto_aprobacion],
    ];
    for (const [campo, valor] of campos) {
      if (valor !== undefined) {
        sets.push(`${campo} = ?`);
        params.push(valor === '' ? null : valor);
      }
    }
    if (sets.length === 0) return { success: false, error: 'Sin campos para actualizar' };
    params.push(data.id);
    await d.raw
      .prepare(`UPDATE identities SET ${sets.join(', ')}, updated_at = datetime('now') WHERE id = ?`)
      .bind(...params)
      .run();
    return { success: true };
  });

// ============================================================
// CONSENT MATRIX
// ============================================================
export const getConsentMatrix = createServerFn({ method: "GET" })
  .validator((data: string) => data)
  .handler(async ({ data: identityId }) => {
    const d = db();
    const result = await d.sql`SELECT * FROM consent_matrices WHERE identity_id = ${identityId} ORDER BY version DESC LIMIT 1`.get();
    return (result ?? null) as ConsentMatrix | null;
  });

// ============================================================
// CAMPAIGNS
// ============================================================
export const getCampaigns = createServerFn({ method: "GET" }).handler(async () => {
  const d = db();
  const result = await d.sql`SELECT * FROM campaigns ORDER BY created_at DESC`.all();
  return (result.results ?? []) as Campaign[];
});

// ============================================================
// LICENSES
// ============================================================
export const getLicenses = createServerFn({ method: "GET" }).handler(async () => {
  const d = db();
  const result = await d.sql`SELECT l.*, i.nombre as talento_nombre, c.nombre as campania_nombre 
    FROM licenses l 
    LEFT JOIN identities i ON l.identity_id = i.id 
    LEFT JOIN campaigns c ON l.campaign_id = c.id 
    ORDER BY l.created_at DESC`.all();
  return (result.results ?? []) as License[];
});

// ============================================================
// GENERATION JOBS
// ============================================================
export const getJobs = createServerFn({ method: "GET" }).handler(async () => {
  const d = db();
  const result = await d.sql`SELECT j.*, i.nombre as talento_nombre, p.nombre as proveedor_nombre
    FROM generation_jobs j 
    LEFT JOIN identities i ON j.identity_id = i.id
    LEFT JOIN providers p ON j.proveedor = p.id
    ORDER BY j.created_at DESC`.all();
  return (result.results ?? []) as GenerationJob[];
});

export const createGenerationJob = createServerFn({ method: "POST" })
  .validator((data: { license_id: string; identity_id: string; tipo: string; prompt: string; proveedor_id?: string; params?: string }) => data)
  .handler(async ({ data }) => {
    const d = db();
    const id = crypto.randomUUID();
    await d.sql`INSERT INTO generation_jobs (id, license_id, identity_id, tipo, proveedor, params, estado) 
      VALUES (${id}, ${data.license_id}, ${data.identity_id}, ${data.tipo}, NULL, ${data.params ?? '{}'}, 'creado')`.run();
    return { success: true, job_id: id };
  });

// ============================================================
// AUDIT LOG
// ============================================================
export const getAuditLog = createServerFn({ method: "GET" }).handler(async () => {
  const d = db();
  const result = await d.sql`SELECT * FROM audit_log ORDER BY seq DESC LIMIT 100`.all();
  return (result.results ?? []) as AuditLogEntry[];
});

// ============================================================
// LEGAL DOCUMENTS
// ============================================================
export const getLegalDocuments = createServerFn({ method: "GET" }).handler(async () => {
  const d = db();
  const result = await d.sql`SELECT * FROM legal_documents ORDER BY created_at DESC`.all();
  return (result.results ?? []) as LegalDocument[];
});

// ============================================================
// CHARACTER SHEETS
// ============================================================
export const getCharacterSheet = createServerFn({ method: "GET" })
  .validator((data: string) => data)
  .handler(async ({ data: identityId }) => {
    const d = db();
    const sheet = (await d.sql`SELECT * FROM character_sheets WHERE identity_id = ${identityId} ORDER BY version DESC LIMIT 1`.get()) as CharacterSheet | undefined;
    if (!sheet) return null;
    const assetsResult = await d.sql`SELECT * FROM character_assets WHERE sheet_id = ${sheet.id} ORDER BY orden ASC`.all();
    const attrsResult = await d.sql`SELECT * FROM character_attributes WHERE sheet_id = ${sheet.id} ORDER BY created_at ASC`.all();
    return { 
      ...sheet, 
      assets: (assetsResult.results ?? []) as CharacterAsset[], 
      attributes: (attrsResult.results ?? []) as CharacterAttribute[] 
    };
  });

export const saveCharacterSheet = createServerFn({ method: "POST" })
  .validator((data: {
    identity_id: string;
    nombre: string;
    descripcion: string;
    descripcion_auto?: string;
    assets: { tipo: string; filename: string; storage_url: string; descripcion: string; orden: number }[];
    attributes: { atributo: string; valor: string; fuente: string }[];
  }) => data)
  .handler(async ({ data }) => {
    const d = db();

    // Check if a sheet already exists for this identity
    const existing = (await d.sql`SELECT id, version FROM character_sheets WHERE identity_id = ${data.identity_id} ORDER BY version DESC LIMIT 1`.get()) as Record<string, any> | undefined;

    if (existing) {
      // Update existing sheet
      const sheetId = existing.id;
      const newVersion = (existing.version ?? 1) + 1;

      // Create new version of the sheet
      const newSheetId = crypto.randomUUID();
      await d.sql`INSERT INTO character_sheets (id, identity_id, nombre, tipo, estado, version, descripcion, descripcion_auto)
        VALUES (${newSheetId}, ${data.identity_id}, ${data.nombre}, 'avatar', 'borrador', ${newVersion}, ${data.descripcion}, ${data.descripcion_auto ?? ''})`.run();

      // Insert assets
      for (const asset of data.assets) {
        const assetId = crypto.randomUUID();
        await d.sql`INSERT INTO character_assets (id, sheet_id, tipo, filename, storage_url, descripcion, orden)
          VALUES (${assetId}, ${newSheetId}, ${asset.tipo}, ${asset.filename}, ${asset.storage_url}, ${asset.descripcion}, ${asset.orden})`.run();
      }

      // Insert attributes
      for (const attr of data.attributes) {
        const attrId = crypto.randomUUID();
        await d.sql`INSERT INTO character_attributes (id, sheet_id, atributo, valor, fuente)
          VALUES (${attrId}, ${newSheetId}, ${attr.atributo}, ${attr.valor}, ${attr.fuente})`.run();
      }

      return { success: true, sheet_id: newSheetId, version: newVersion };
    } else {
      // Create new sheet
      const sheetId = crypto.randomUUID();
      await d.sql`INSERT INTO character_sheets (id, identity_id, nombre, tipo, estado, version, descripcion, descripcion_auto)
        VALUES (${sheetId}, ${data.identity_id}, ${data.nombre}, 'avatar', 'borrador', 1, ${data.descripcion}, ${data.descripcion_auto ?? ''})`.run();

      // Insert assets
      for (const asset of data.assets) {
        const assetId = crypto.randomUUID();
        await d.sql`INSERT INTO character_assets (id, sheet_id, tipo, filename, storage_url, descripcion, orden)
          VALUES (${assetId}, ${sheetId}, ${asset.tipo}, ${asset.filename}, ${asset.storage_url}, ${asset.descripcion}, ${asset.orden})`.run();
      }

      // Insert attributes
      for (const attr of data.attributes) {
        const attrId = crypto.randomUUID();
        await d.sql`INSERT INTO character_attributes (id, sheet_id, atributo, valor, fuente)
          VALUES (${attrId}, ${sheetId}, ${attr.atributo}, ${attr.valor}, ${attr.fuente})`.run();
      }

      return { success: true, sheet_id: sheetId, version: 1 };
    }
  });

// ============================================================
// LOGIN
// ============================================================
export const loginUser = createServerFn({ method: "POST" })
  .validator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const d = db();
    const user = (await d.sql`SELECT * FROM users WHERE email = ${data.email} AND activo = 1`.get()) as Record<string, any> | undefined;
    if (!user) return { error: "Credenciales invalidas" };
    if (user.password_hash !== data.password) return { error: "Credenciales invalidas" };
    return { user: { id: user.id as string, email: user.email as string, nombre: user.nombre as string, rol: user.rol as string } };
  });
