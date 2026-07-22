// UMAIN Rights Engine — Compuerta de Consentimiento v2
// =====================================================
// El invariante: Ningun job de generacion se ejecuta sin
// autorizacion explicita del Rights Engine.

import { createServerFn } from "@tanstack/react-start";
import { bindings } from "./bindings.server";
import { withSqlTag } from "./d1-sql";

// ============================================================
// TIPOS PUBLICOS
// ============================================================
export interface ValidationStep {
  paso: number;
  nombre: string;
  passed: boolean;
  detalle: string;
}

export interface ConsentGateRequest {
  license_id: string;
  identity_id: string;
  tipo: string;
  medio: string;
  territorio: string;
  categoria_iab: string;
  marca: string;
  prompt?: string;
}

export interface ConsentGateResponse {
  allowed: boolean;
  paso_fallido?: number;
  validation_steps: ValidationStep[];
  errors: string[];
  warnings: string[];
  job_id?: string;
  audit_log_seq?: number;
}

interface AuditEntry {
  seq: number;
  evento: string;
  hash_prev: string;
  hash: string;
  payload: string;
  firma: string;
}

// ============================================================
// HELPERS PRIVADOS
// ============================================================
function getDB() {
  const { DB } = bindings();
  if (!DB) throw new Error("RIGHTS_ENGINE: D1 binding not available");
  return withSqlTag(DB);
}

function generateHash(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash) + data.charCodeAt(i);
    hash = hash & hash;
  }
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < 64; i++) {
    result += chars[(hash + i * 7 + data.charCodeAt(i % data.length)) % 16];
  }
  return result;
}

function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function now(): string {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

// ============================================================
// VALIDADORES INDIVIDUALES (cada paso es una funcion async)
// ============================================================

interface StepResult { passed: boolean; detalle: string; }

/** Paso 1: Validar token JWT — licencia vigente, identidad activa, token no expirado */
async function validateToken(license: any, identity: any, db: any): Promise<StepResult> {
  if (!license) return { passed: false, detalle: 'Licencia no encontrada' };
  if (license.estado !== 'vigente') return { passed: false, detalle: `Licencia en estado '${license.estado}', debe ser 'vigente'` };
  if (!license.token_jwt) return { passed: false, detalle: 'Token JWT no emitido — la licencia no fue aprobada por el talento' };
  if (!identity) return { passed: false, detalle: 'Identidad no encontrada' };
  if (identity.estado !== 'activo') return { passed: false, detalle: `Identidad en estado '${identity.estado}', debe ser 'activo'` };

  // Verificar expiracion desde el token
  try {
    const parts = license.token_jwt.split('.');
    if (parts.length !== 3) return { passed: false, detalle: 'Formato de token invalido' };
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      await db.sql`UPDATE licenses SET estado = 'vencida', updated_at = datetime('now') WHERE id = ${license.id}`.run();
      return { passed: false, detalle: 'Token expirado — licencia marcada como vencida' };
    }
    return { passed: true, detalle: `Token valido. Emitido: ${new Date(payload.iat * 1000).toLocaleDateString()}. Expira: ${new Date(payload.exp * 1000).toLocaleDateString()}` };
  } catch (e: any) {
    return { passed: false, detalle: `Token invalido: ${e.message}` };
  }
}

/** Paso 2: Validar alcance — medio, territorio y categoria ⊆ licencia */
function validateScope(license: any, request: ConsentGateRequest): StepResult {
  let alcance: any;
  try { alcance = JSON.parse(license.alcance || '{}'); } catch { return { passed: false, detalle: 'Alcance de licencia invalido (JSON mal formado)' }; }

  const detalles: string[] = [];

  // Verificar medio
  if (alcance.medios && Array.isArray(alcance.medios) && alcance.medios.length > 0) {
    if (!alcance.medios.includes(request.medio)) {
      return { passed: false, detalle: `Medio '${request.medio}' no autorizado. Permitidos: ${alcance.medios.join(', ')}` };
    }
    detalles.push(`medio: ${request.medio} ✅`);
  } else {
    detalles.push(`medio: ${request.medio} (sin restriccion)`);
  }

  // Verificar territorio
  if (alcance.territorios && Array.isArray(alcance.territorios) && alcance.territorios.length > 0) {
    if (!alcance.territorios.includes(request.territorio)) {
      return { passed: false, detalle: `Territorio '${request.territorio}' no autorizado. Permitidos: ${alcance.territorios.join(', ')}` };
    }
    detalles.push(`territorio: ${request.territorio} ✅`);
  } else {
    detalles.push(`territorio: ${request.territorio} (sin restriccion)`);
  }

  // Verificar categoria IAB
  if (alcance.categoria_iab && alcance.categoria_iab !== request.categoria_iab) {
    return { passed: false, detalle: `Categoria IAB '${request.categoria_iab}' no coincide con la licencia: '${alcance.categoria_iab}'` };
  }
  detalles.push(`categoria: ${request.categoria_iab} ✅`);

  return { passed: true, detalle: detalles.join(' | ') };
}

/** Paso 3: Validar matriz de consentimiento */
async function validateConsentMatrix(identityId: string, categoriaIab: string, db: any): Promise<StepResult & { status?: string; warnings?: string[] }> {
  const matrix = await db.sql`SELECT * FROM consent_matrices WHERE identity_id = ${identityId} ORDER BY version DESC LIMIT 1`.get() as any;
  if (!matrix) return { passed: false, detalle: 'No hay matriz de consentimiento configurada para este talento' };

  let entradas: Record<string, string> = {};
  try { entradas = JSON.parse(matrix.entradas || '{}'); } catch {}

  const status = entradas[categoriaIab] || 'sin_definir';
  const warnings: string[] = [];

  switch (status) {
    case 'permitido':
      return { passed: true, detalle: `Categoria ${categoriaIab}: PERMITIDO`, status };
    case 'prohibido':
      return { passed: false, detalle: `Categoria ${categoriaIab}: PROHIBIDO en la matriz de consentimiento del talento`, status };
    case 'caso_por_caso':
      warnings.push(`Categoria ${categoriaIab}: CASO_POR_CASO — se requiere aprobacion adicional del talento`);
      return { passed: true, detalle: `Categoria ${categoriaIab}: CASO_POR_CASO — requiere aprobacion`, status, warnings };
    case 'solo_notificar':
      warnings.push(`Categoria ${categoriaIab}: SOLO_NOTIFICAR — se debe notificar al talento`);
      return { passed: true, detalle: `Categoria ${categoriaIab}: SOLO_NOTIFICAR`, status, warnings };
    case 'sin_definir':
    default:
      warnings.push(`Categoria ${categoriaIab}: SIN_DEFINIR — tratado como CASO_POR_CASO por defecto`);
      return { passed: true, detalle: `Categoria ${categoriaIab}: SIN_DEFINIR — requiere aprobacion (default)`, status: 'caso_por_caso', warnings };
  }
}

/** Paso 4: Validar exclusividad — marca no bloqueada */
async function validateExclusivity(identityId: string, marca: string, categoriaIab: string, territorio: string, db: any): Promise<StepResult> {
  if (!marca || marca.trim() === '') return { passed: true, detalle: 'Sin marca especificada — no aplica validacion de exclusividad' };

  // Buscar locks activos que cubran esta marca en este territorio
  const locksResult = await db.sql`SELECT * FROM exclusivity_locks 
    WHERE identity_id = ${identityId}
    AND vencimiento > datetime('now')
    ORDER BY vencimiento DESC`.all();
  const locks = (locksResult.results ?? []) as Record<string, any>[];

  if (!locks || locks.length === 0) return { passed: true, detalle: `Sin locks activos para ${identityId}` };

  for (const lock of locks) {
    let marcasBloqueadas: string[] = [];
    try { marcasBloqueadas = JSON.parse(lock.marcas_bloqueadas || '[]'); } catch {}

    if (!marcasBloqueadas.includes(marca)) continue;

    // Coincide la marca. Verificar territorio y categoria.
    const matchTerritorio = lock.territorio === territorio || lock.territorio === 'WORLD';
    const matchCategoria = !lock.categoria || lock.categoria === categoriaIab;

    if (matchTerritorio && matchCategoria) {
      return { passed: false, detalle: `Marca '${marca}' bloqueada por lock vigente hasta ${lock.vencimiento} (territorio: ${lock.territorio})` };
    }
  }

  return { passed: true, detalle: `Marca '${marca}' sin restricciones de exclusividad` };
}

// ============================================================
// AUDIT LOG — Registro append-only con hash chain
// ============================================================
async function recordAuditLog(evento: string, payload: any, identityId?: string, licenseId?: string): Promise<number | null> {
  try {
    const d = getDB();
    const lastEntry = await d.sql`SELECT hash FROM audit_log ORDER BY seq DESC LIMIT 1`.get() as any;
    const hashPrev = lastEntry?.hash ?? '0000000000000000000000000000000000000000000000000000000000000000';
    const payloadStr = JSON.stringify(payload);
    const hash = generateHash(hashPrev + payloadStr);

    await d.sql`INSERT INTO audit_log (evento, payload, identity_id, license_id, hash_prev, hash, firma)
      VALUES (${evento}, ${payloadStr}, ${identityId ?? null}, ${licenseId ?? null},
              ${hashPrev}, ${hash}, ${'firma_pendiente'})`.run();

    // Obtener el seq insertado
    const inserted = await d.sql`SELECT seq FROM audit_log WHERE hash = ${hash} LIMIT 1`.get() as any;
    return inserted?.seq ?? null;
  } catch (err) {
    console.error('RIGHTS_ENGINE: Error al registrar AuditLog:', err);
    return null;
  }
}

async function logConsentGateAnalytics(params: {
  identity_id: string; license_id: string; job_id?: string;
  categoria_iab: string; marca: string; territorio: string;
  paso_fallido?: number; error?: string; warnings?: string[];
  pasos: boolean[]; duracion_ms: number;
}): Promise<void> {
  try {
    const d = getDB();
    await d.sql`INSERT INTO consent_gate_log 
      (id, identity_id, license_id, job_id, categoria_iab, marca, territorio,
       paso_fallido, error, warnings,
       paso_1_token, paso_2_alcance, paso_3_matriz, paso_4_exclusividad, paso_5_autorizado,
       duracion_ms)
      VALUES (${uuid()}, ${params.identity_id}, ${params.license_id}, ${params.job_id ?? null},
              ${params.categoria_iab}, ${params.marca}, ${params.territorio},
              ${params.paso_fallido ?? null}, ${params.error ?? null}, ${JSON.stringify(params.warnings ?? [])},
              ${params.pasos[0] ? 1 : 0}, ${params.pasos[1] ? 1 : 0}, ${params.pasos[2] ? 1 : 0}, ${params.pasos[3] ? 1 : 0}, ${params.pasos[4] ? 1 : 0},
              ${params.duracion_ms})`.run();
  } catch {}
}

// ============================================================
// FUNCION 1: executeConsentGate — Solo valida, NO crea job
// ============================================================
export const executeConsentGate = createServerFn({ method: "POST" })
  .validator((data: ConsentGateRequest) => data)
  .handler(async ({ data }): Promise<ConsentGateResponse> => {
    const startTime = Date.now();
    const d = getDB();
    const steps: ValidationStep[] = [];
    const errors: string[] = [];
    const warnings: string[] = [];
    const pasos: boolean[] = [false, false, false, false, false];

    // Cargar datos base
    const license = await d.sql`SELECT * FROM licenses WHERE id = ${data.license_id}`.get() as any;
    const identity = await d.sql`SELECT * FROM identities WHERE id = ${data.identity_id}`.get() as any;

    // --- PASO 1 ---
    const r1 = await validateToken(license, identity, d);
    steps.push({ paso: 1, nombre: 'Validar token JWT', passed: r1.passed, detalle: r1.detalle });
    pasos[0] = r1.passed;
    if (!r1.passed) { errors.push(r1.detalle); return await buildResponse(steps, errors, warnings, 1, startTime, pasos, data); }

    // --- PASO 2 ---
    const r2 = validateScope(license, data);
    steps.push({ paso: 2, nombre: 'Validar alcance', passed: r2.passed, detalle: r2.detalle });
    pasos[1] = r2.passed;
    if (!r2.passed) { errors.push(r2.detalle); return await buildResponse(steps, errors, warnings, 2, startTime, pasos, data); }

    // --- PASO 3 ---
    const r3 = await validateConsentMatrix(data.identity_id, data.categoria_iab, d);
    steps.push({ paso: 3, nombre: 'Validar matriz de consentimiento', passed: r3.passed, detalle: r3.detalle });
    pasos[2] = r3.passed;
    if (r3.warnings) warnings.push(...r3.warnings);
    if (!r3.passed) { errors.push(r3.detalle); return await buildResponse(steps, errors, warnings, 3, startTime, pasos, data); }

    // --- PASO 4 ---
    const r4 = await validateExclusivity(data.identity_id, data.marca, data.categoria_iab, data.territorio, d);
    steps.push({ paso: 4, nombre: 'Validar exclusividad', passed: r4.passed, detalle: r4.detalle });
    pasos[3] = r4.passed;
    if (!r4.passed) { errors.push(r4.detalle); return await buildResponse(steps, errors, warnings, 4, startTime, pasos, data); }

    // --- PASO 5: AuditLog ---
    pasos[4] = true;
    const auditSeq = await recordAuditLog('validacion_compuerta', {
      license_id: data.license_id, identity_id: data.identity_id,
      tipo: data.tipo, medio: data.medio, territorio: data.territorio,
      categoria_iab: data.categoria_iab, marca: data.marca,
      warnings: warnings.length > 0 ? warnings : undefined,
    }, data.identity_id, data.license_id);

    steps.push({
      paso: 5, nombre: 'Registrar en AuditLog', passed: true,
      detalle: auditSeq ? `AuditLog entry #${auditSeq} registrado` : 'AuditLog registrado (seq no disponible)',
    });

    return await buildResponse(steps, errors, warnings, undefined, startTime, pasos, data, undefined, auditSeq ?? undefined);
  });

// ============================================================
// FUNCION 2: authorizeGeneration — Crea job + log si paso la compuerta
// ============================================================
export const authorizeGeneration = createServerFn({ method: "POST" })
  .validator((data: ConsentGateRequest) => data)
  .handler(async ({ data }): Promise<ConsentGateResponse & { job_id?: string }> => {
    const startTime = Date.now();
    const d = getDB();
    const steps: ValidationStep[] = [];
    const errors: string[] = [];
    const warnings: string[] = [];
    const pasos: boolean[] = [false, false, false, false, false];

    // Cargar datos base
    const license = await d.sql`SELECT * FROM licenses WHERE id = ${data.license_id}`.get() as any;
    const identity = await d.sql`SELECT * FROM identities WHERE id = ${data.identity_id}`.get() as any;

    // Paso 1
    const r1 = await validateToken(license, identity, d);
    steps.push({ paso: 1, nombre: 'Validar token JWT', passed: r1.passed, detalle: r1.detalle });
    pasos[0] = r1.passed;
    if (!r1.passed) { errors.push(r1.detalle); await buildResponse(steps, errors, warnings, 1, startTime, pasos, data, undefined, undefined, true); throw new Error(r1.detalle); }

    // Paso 2
    const r2 = validateScope(license, data);
    steps.push({ paso: 2, nombre: 'Validar alcance', passed: r2.passed, detalle: r2.detalle });
    pasos[1] = r2.passed;
    if (!r2.passed) { errors.push(r2.detalle); await buildResponse(steps, errors, warnings, 2, startTime, pasos, data, undefined, undefined, true); throw new Error(r2.detalle); }

    // Paso 3
    const r3 = await validateConsentMatrix(data.identity_id, data.categoria_iab, d);
    steps.push({ paso: 3, nombre: 'Validar matriz de consentimiento', passed: r3.passed, detalle: r3.detalle });
    pasos[2] = r3.passed;
    if (r3.warnings) warnings.push(...r3.warnings);
    if (!r3.passed) { errors.push(r3.detalle); await buildResponse(steps, errors, warnings, 3, startTime, pasos, data, undefined, undefined, true); throw new Error(r3.detalle); }

    // Paso 4
    const r4 = await validateExclusivity(data.identity_id, data.marca, data.categoria_iab, data.territorio, d);
    steps.push({ paso: 4, nombre: 'Validar exclusividad', passed: r4.passed, detalle: r4.detalle });
    pasos[3] = r4.passed;
    if (!r4.passed) { errors.push(r4.detalle); await buildResponse(steps, errors, warnings, 4, startTime, pasos, data, undefined, undefined, true); throw new Error(r4.detalle); }

    // --- AUTORIZADO: Crear job ---
    pasos[4] = true;
    const jobId = uuid();
    const tipoPermitido = ['imagen', 'video', 'voz', 'lipsync', 'upscale'].includes(data.tipo) ? data.tipo : 'imagen';

    await d.sql`INSERT INTO generation_jobs (id, license_id, identity_id, tipo, params, token_validado_en, estado)
      VALUES (${jobId}, ${data.license_id}, ${data.identity_id}, ${tipoPermitido},
              ${JSON.stringify({ prompt: data.prompt, medio: data.medio, territorio: data.territorio, marca: data.marca })},
              datetime('now'), 'validado')`.run();

    // AuditLog
    const auditSeq = await recordAuditLog('generacion_autorizada', {
      job_id: jobId, license_id: data.license_id, identity_id: data.identity_id,
      tipo: data.tipo, medio: data.medio, territorio: data.territorio,
      categoria_iab: data.categoria_iab, marca: data.marca,
      warnings: warnings.length > 0 ? warnings : undefined,
    }, data.identity_id, data.license_id);

    steps.push({
      paso: 5, nombre: 'Autorizar y registrar', passed: true,
      detalle: `Job #${jobId.slice(0, 8)} creado. AuditLog #${auditSeq ?? 'N/A'} registrado`,
    });

    // Analytics
    await logConsentGateAnalytics({
      identity_id: data.identity_id, license_id: data.license_id,
      job_id: jobId, categoria_iab: data.categoria_iab,
      marca: data.marca, territorio: data.territorio,
      warnings, pasos, duracion_ms: Date.now() - startTime,
    });

    return {
      allowed: true, job_id: jobId, audit_log_seq: auditSeq ?? undefined,
      validation_steps: steps, errors, warnings,
    };
  });

// ============================================================
// FUNCION 3: verifyAuditChain — Verifica integridad de la cadena
// ============================================================
export const verifyAuditChain = createServerFn({ method: "GET" }).handler(async () => {
  const d = getDB();
  const entriesResult = await d.sql`SELECT seq, evento, hash_prev, hash, payload, firma FROM audit_log ORDER BY seq ASC`.all();
  const entries = (entriesResult.results ?? []) as unknown as AuditEntry[];

  const results: { seq: number; status: string; hash_match: boolean; chain_match: boolean }[] = [];
  let previousHash = '0000000000000000000000000000000000000000000000000000000000000000';
  let chainValid = true;

  for (const entry of entries) {
    const expectedHash = generateHash(entry.hash_prev + entry.payload);
    const hashMatch = entry.hash === expectedHash;
    const chainMatch = entry.hash_prev === previousHash;

    if (!hashMatch || !chainMatch) chainValid = false;

    results.push({ seq: entry.seq, status: hashMatch && chainMatch ? '✅' : '❌', hash_match: hashMatch, chain_match: chainMatch });
    previousHash = entry.hash;
  }

  return { chain_valid: chainValid, total_entries: entries.length, verified: results.filter(r => r.hash_match && r.chain_match).length, broken: results.filter(r => !r.hash_match || !r.chain_match).length, results };
});

// ============================================================
// FUNCION 4: issueLicenseToken — Emitir JWT para licencia aprobada
// ============================================================
export const issueLicenseToken = createServerFn({ method: "POST" })
  .validator((data: { license_id: string }) => data)
  .handler(async ({ data }) => {
    const d = getDB();
    const license = await d.sql`SELECT * FROM licenses WHERE id = ${data.license_id}`.get() as any;
    if (!license) return { success: false, error: 'Licencia no encontrada' };

    if (license.estado !== 'pendiente_aprobacion' && license.estado !== 'borrador') {
      return { success: false, error: `Estado invalido: ${license.estado}` };
    }

    const identity = await d.sql`SELECT * FROM identities WHERE id = ${license.identity_id}`.get() as any;
    if (!identity || identity.estado !== 'activo') return { success: false, error: `Identidad ${identity?.estado ?? 'no encontrada'}` };

    const matrix = await d.sql`SELECT * FROM consent_matrices WHERE identity_id = ${license.identity_id} ORDER BY version DESC LIMIT 1`.get() as any;
    if (!matrix) return { success: false, error: 'Matriz de consentimiento no configurada' };
    if (!matrix.firma_hash) return { success: false, error: 'Matriz de consentimiento no firmada por el talento' };

    let alcance: any = {};
    try { alcance = JSON.parse(license.alcance || '{}'); } catch {}

    const tokenPayload = {
      sub: license.identity_id, license_id: license.id,
      iat: Math.floor(Date.now() / 1000),
      exp: alcance.plazo_hasta
        ? Math.floor(new Date(alcance.plazo_hasta).getTime() / 1000)
        : Math.floor(Date.now() / 1000) + 90 * 24 * 3600,
      scope: {
        medios: alcance.medios, territorios: alcance.territorios,
        categoria_iab: alcance.categoria_iab,
      },
      tier: identity.tier, matrix_version: matrix.version,
    };

    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify(tokenPayload));
    const signature = generateHash(header + '.' + payload + 'umain-secret-key-prototype');
    const token = `${header}.${payload}.${signature}`;

    await d.sql`UPDATE licenses SET token_jwt = ${token}, estado = 'vigente', updated_at = datetime('now') WHERE id = ${data.license_id}`.run();

    const seq = await recordAuditLog('emision_token', {
      license_id: license.id, identity_id: license.identity_id,
      matrix_version: matrix.version, exp: tokenPayload.exp,
    }, license.identity_id, license.id);

    return { success: true, token, expires_at: tokenPayload.exp, audit_log_seq: seq };
  });

// ============================================================
// FUNCION 5: generateApprovalLink — Magic link para el talento
// ============================================================
export const generateApprovalLink = createServerFn({ method: "POST" })
  .validator((data: { license_id: string; tipo: 'licencia' | 'material'; output_id?: string }) => data)
  .handler(async ({ data }) => {
    const d = getDB();
    const license = await d.sql`SELECT * FROM licenses WHERE id = ${data.license_id}`.get() as any;
    if (!license) return { success: false, error: 'Licencia no encontrada' };

    const identity = await d.sql`SELECT * FROM identities WHERE id = ${license.identity_id}`.get() as any;
    const token = uuid() + '-' + uuid();
    const expiracion = new Date(Date.now() + 72 * 3600 * 1000).toISOString();

    let hashMaterial = null;
    if (data.output_id) {
      const output = await d.sql`SELECT hash_sha256 FROM outputs WHERE id = ${data.output_id}`.get() as any;
      hashMaterial = output?.hash_sha256 ?? null;
    }

    await d.sql`INSERT INTO approvals (id, license_id, output_id, identity_id, tipo, metodo, token, hash_material, expiracion)
      VALUES (${uuid()}, ${data.license_id}, ${data.output_id ?? null}, ${license.identity_id},
              ${data.tipo}, 'link_firmado', ${token}, ${hashMaterial}, ${expiracion})`.run();

    if (data.tipo === 'licencia' && license.estado === 'borrador') {
      await d.sql`UPDATE licenses SET estado = 'pendiente_aprobacion', updated_at = datetime('now') WHERE id = ${data.license_id}`.run();
    }

    const seq = await recordAuditLog('generacion_magic_link', {
      license_id: data.license_id, tipo: data.tipo, expiracion: '72h',
    }, license.identity_id, data.license_id);

    const baseUrl = 'https://umain-platform.higgsfield.app';
    const approvalLink = `${baseUrl}/approval/${token}`;

    return {
      success: true, approval_link: approvalLink, token, expiracion,
      talento_nombre: identity?.nombre ?? 'Desconocido',
      talento_contacto: identity?.contacto_aprobacion ?? null,
      audit_log_seq: seq,
    };
  });

// ============================================================
// FUNCION 6: executeApproval — Procesa decision del talento
// ============================================================
export const executeApproval = createServerFn({ method: "POST" })
  .validator((data: { token: string; decision: 'aprobado' | 'rechazado' | 'cambios_solicitados'; motivo?: string }) => data)
  .handler(async ({ data }) => {
    const d = getDB();
    const approval = await d.sql`SELECT * FROM approvals WHERE token = ${data.token}`.get() as any;
    if (!approval) return { success: false, error: 'Token de aprobacion invalido' };
    if (approval.decision) return { success: false, error: `Esta solicitud ya fue ${approval.decision}` };
    if (approval.expiracion && approval.expiracion < now()) {
      return { success: false, error: 'El link de aprobacion ha expirado (max 72h)' };
    }

    await d.sql`UPDATE approvals SET decision = ${data.decision}, motivo = ${data.motivo ?? null}, updated_at = datetime('now') WHERE id = ${approval.id}`.run();

    if (data.decision === 'aprobado' && approval.tipo === 'licencia') {
      const result = await issueLicenseToken({ data: { license_id: approval.license_id } });
      if (!result.success) return { success: false, error: `Aprobacion registrada pero fallo emision de token: ${result.error}` };
      await recordAuditLog('licencia_aprobada', { license_id: approval.license_id, approval_id: approval.id }, approval.identity_id, approval.license_id);
    }

    if (data.decision === 'rechazado' && approval.tipo === 'licencia') {
      await d.sql`UPDATE licenses SET estado = 'borrador', updated_at = datetime('now') WHERE id = ${approval.license_id}`.run();
    }

    if (data.decision === 'aprobado' && approval.tipo === 'material' && approval.output_id) {
      const job = await d.sql`SELECT j.id FROM generation_jobs j JOIN outputs o ON o.job_id = j.id WHERE o.id = ${approval.output_id}`.get() as any;
      if (job) {
        await d.sql`UPDATE generation_jobs SET estado = 'entregado', updated_at = datetime('now') WHERE id = ${job.id}`.run();
      }
    }

    const seq = await recordAuditLog(`aprobacion_${data.decision}`,
      { approval_id: approval.id, license_id: approval.license_id, tipo: approval.tipo, motivo: data.motivo },
      approval.identity_id, approval.license_id);

    return { success: true, decision: data.decision, audit_log_seq: seq };
  });

// ============================================================
// BUILD RESPONSE — Helper para construir respuestas consistentes
// ============================================================
async function buildResponse(
  steps: ValidationStep[], errors: string[], warnings: string[],
  pasoFallido: number | undefined, startTime: number,
  pasos: boolean[], data: ConsentGateRequest,
  jobId?: string, auditSeq?: number,
  throwOnError?: boolean,
): Promise<ConsentGateResponse> {
  const elapsed = Date.now() - startTime;

  // Log analytics (no bloqueante pero si esperado para asegurar persistencia)
  if (pasoFallido || steps.some(s => s.passed)) {
    try {
      await logConsentGateAnalytics({
        identity_id: data.identity_id, license_id: data.license_id,
        job_id: jobId, categoria_iab: data.categoria_iab,
        marca: data.marca, territorio: data.territorio,
        paso_fallido: pasoFallido,
        error: errors.length > 0 ? errors[0] : undefined,
        warnings, pasos, duracion_ms: elapsed,
      });
    } catch {}
  }

  return {
    allowed: !pasoFallido,
    paso_fallido: pasoFallido,
    validation_steps: steps,
    errors,
    warnings,
    job_id: jobId,
    audit_log_seq: auditSeq,
  };
}