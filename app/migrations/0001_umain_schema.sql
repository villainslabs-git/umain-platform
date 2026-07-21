-- UMAIN Rights Engine - Database Schema
-- Based on Rights Engine Specification v1

-- ============================================================
-- USERS (auth for the platform itself - extends Identity)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nombre TEXT NOT NULL,
  rol TEXT NOT NULL CHECK(rol IN ('admin','comercial','talento','agencia')) DEFAULT 'talento',
  activo INTEGER NOT NULL DEFAULT 1,
  ultimo_acceso TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================
-- IDENTITY - the talent (persona digital)
-- ============================================================
CREATE TABLE IF NOT EXISTS identities (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  nombre TEXT NOT NULL,
  tier TEXT NOT NULL CHECK(tier IN ('A','B','C')) DEFAULT 'B',
  agencia_id TEXT REFERENCES identities(id),
  contrato_ref TEXT,
  estado TEXT NOT NULL CHECK(estado IN ('activo','suspendido','suprimido')) DEFAULT 'activo',
  contacto_aprobacion TEXT, -- JSON: teléfono/canal
  metadata TEXT, -- JSON libre
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================
-- IDENTITY PACK - activo biométrico cifrado
-- ============================================================
CREATE TABLE IF NOT EXISTS identity_packs (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  identity_id TEXT NOT NULL REFERENCES identities(id) ON DELETE CASCADE,
  version INTEGER NOT NULL DEFAULT 1,
  artefactos TEXT NOT NULL DEFAULT '{}', -- JSON: LoRA(s), voice_id, refs
  hash_sha256 TEXT NOT NULL,
  cifrado_metadata TEXT DEFAULT '{}', -- JSON: AES-256 metadata
  estado TEXT NOT NULL CHECK(estado IN ('vigente','reentrenamiento','suprimido')) DEFAULT 'vigente',
  certificado_supresion TEXT, -- JSON: PDF ref + timestamp
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(identity_id, version)
);

-- ============================================================
-- CONSENT MATRIX - 65 IAB categories
-- ============================================================
CREATE TABLE IF NOT EXISTS consent_matrices (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  identity_id TEXT NOT NULL REFERENCES identities(id) ON DELETE CASCADE,
  version INTEGER NOT NULL DEFAULT 1,
  entradas TEXT NOT NULL DEFAULT '{}', -- JSON: { "iab-1": "permitido", "iab-2": "caso_por_caso", ... }
  notas TEXT, -- JSON: notas adicionales por categoría
  firma_hash TEXT, -- hash del documento firmado
  firma_timestamp TEXT,
  firma_metodo TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(identity_id, version)
);

-- ============================================================
-- CAMPAIGNS
-- ============================================================
CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  nombre TEXT NOT NULL,
  cliente TEXT NOT NULL,
  descripcion TEXT,
  estado TEXT NOT NULL CHECK(estado IN ('borrador','activa','pausada','completada','cancelada')) DEFAULT 'borrador',
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================
-- LICENSES - the token
-- ============================================================
CREATE TABLE IF NOT EXISTS licenses (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  identity_id TEXT NOT NULL REFERENCES identities(id),
  campaign_id TEXT NOT NULL REFERENCES campaigns(id),
  alcance TEXT NOT NULL DEFAULT '{}', -- JSON: uso, medio, territorios[], plazo, categoria_iab
  exclusividad TEXT, -- JSON: lock info
  economia TEXT, -- JSON: fee, split, originador
  token_jwt TEXT, -- JWT emitido al pasar a vigente
  estado TEXT NOT NULL CHECK(estado IN ('borrador','pendiente_aprobacion','vigente','vencida','revocada')) DEFAULT 'borrador',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================
-- GENERATION JOBS
-- ============================================================
CREATE TABLE IF NOT EXISTS generation_jobs (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  license_id TEXT NOT NULL REFERENCES licenses(id),
  identity_id TEXT NOT NULL REFERENCES identities(id),
  tipo TEXT NOT NULL CHECK(tipo IN ('imagen','video','voz','lipsync','upscale')),
  proveedor TEXT,
  params TEXT DEFAULT '{}', -- JSON: prompt, parámetros
  token_validado_en TEXT, -- timestamp de validación de compuerta
  estado TEXT NOT NULL CHECK(estado IN ('creado','validado','generando','pendiente_qa','pendiente_talento','entregado','rechazado','fallido')) DEFAULT 'creado',
  error TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================
-- OUTPUTS (generated assets)
-- ============================================================
CREATE TABLE IF NOT EXISTS outputs (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  job_id TEXT NOT NULL REFERENCES generation_jobs(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  url TEXT,
  hash_sha256 TEXT NOT NULL,
  c2pa_metadata TEXT,
  watermark TEXT,
  estado TEXT NOT NULL DEFAULT 'generado',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================
-- APPROVALS (talent signature)
-- ============================================================
CREATE TABLE IF NOT EXISTS approvals (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  license_id TEXT REFERENCES licenses(id),
  output_id TEXT REFERENCES outputs(id),
  identity_id TEXT NOT NULL REFERENCES identities(id),
  tipo TEXT NOT NULL CHECK(tipo IN ('licencia','material')),
  metodo TEXT NOT NULL CHECK(metodo IN ('link_firmado','presencial')) DEFAULT 'link_firmado',
  token TEXT UNIQUE, -- magic link token
  hash_material TEXT, -- hash de lo que el talento vio
  decision TEXT CHECK(decision IN ('aprobado','rechazado','cambios_solicitados')),
  motivo TEXT,
  expiracion TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================
-- AUDIT LOG - append-only, cryptographically chained
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_log (
  seq INTEGER PRIMARY KEY AUTOINCREMENT,
  evento TEXT NOT NULL,
  payload TEXT NOT NULL DEFAULT '{}',
  identity_id TEXT,
  license_id TEXT,
  hash_prev TEXT,
  hash TEXT NOT NULL,
  firma TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================
-- EXCLUSIVITY LOCKS
-- ============================================================
CREATE TABLE IF NOT EXISTS exclusivity_locks (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  identity_id TEXT NOT NULL REFERENCES identities(id),
  license_id TEXT NOT NULL REFERENCES licenses(id),
  categoria TEXT NOT NULL,
  territorio TEXT NOT NULL,
  marcas_bloqueadas TEXT DEFAULT '[]', -- JSON array
  vencimiento TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================
-- LEGAL LIBRARY
-- ============================================================
CREATE TABLE IF NOT EXISTS legal_documents (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  identity_id TEXT REFERENCES identities(id),
  tipo TEXT NOT NULL CHECK(tipo IN ('contrato','certificado_supresion','consentimiento','otro')),
  titulo TEXT NOT NULL,
  archivo_url TEXT,
  hash_sha256 TEXT,
  metadata TEXT DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_identity_packs_identity ON identity_packs(identity_id);
CREATE INDEX IF NOT EXISTS idx_consent_matrices_identity ON consent_matrices(identity_id);
CREATE INDEX IF NOT EXISTS idx_licenses_identity ON licenses(identity_id);
CREATE INDEX IF NOT EXISTS idx_licenses_campaign ON licenses(campaign_id);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_license ON generation_jobs(license_id);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_identity ON generation_jobs(identity_id);
CREATE INDEX IF NOT EXISTS idx_approvals_identity ON approvals(identity_id);
CREATE INDEX IF NOT EXISTS idx_approvals_token ON approvals(token);
CREATE INDEX IF NOT EXISTS idx_audit_log_evento ON audit_log(evento);
CREATE INDEX IF NOT EXISTS idx_audit_log_identity ON audit_log(identity_id);
CREATE INDEX IF NOT EXISTS idx_legal_documents_identity ON legal_documents(identity_id);
CREATE INDEX IF NOT EXISTS idx_exclusivity_locks_identity ON exclusivity_locks(identity_id);

-- ============================================================
-- TRIGGER: prevent UPDATE/DELETE on audit_log (append-only)
-- ============================================================
CREATE TRIGGER IF NOT EXISTS trg_audit_log_prevent_update
BEFORE UPDATE ON audit_log
BEGIN
  SELECT RAISE(ABORT, 'AUDIT_LOG_APPEND_ONLY: updates are forbidden on audit_log');
END;

CREATE TRIGGER IF NOT EXISTS trg_audit_log_prevent_delete
BEFORE DELETE ON audit_log
BEGIN
  SELECT RAISE(ABORT, 'AUDIT_LOG_APPEND_ONLY: deletes are forbidden on audit_log');
END;

-- ============================================================
-- SEED DATA: default admin user (password: umain2026!)
-- ============================================================
INSERT OR IGNORE INTO users (id, email, password_hash, nombre, rol)
VALUES ('admin-001', 'admin@umain.io', '$2a$10$placeholder_hash_change_me', 'Admin UMAIN', 'admin');
