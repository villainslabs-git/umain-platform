-- UMAIN - Provider Configuration & Generation Queue
-- Add this migration after 0001_umain_schema.sql

-- ============================================================
-- PROVIDERS - API connections for generation
-- ============================================================
CREATE TABLE IF NOT EXISTS providers (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK(tipo IN ('higgsfield','flux','midjourney','runway','kling','elevenlabs','custom')),
  api_key_encrypted TEXT NOT NULL DEFAULT '',
  api_url TEXT NOT NULL DEFAULT '',
  activo INTEGER NOT NULL DEFAULT 1,
  ultima_validacion TEXT,
  estado_validacion TEXT NOT NULL DEFAULT 'no_verificado' CHECK(estado_validacion IN ('no_verificado','valido','error')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================
-- GENERATION REQUESTS (extended from generation_jobs)
-- ============================================================
CREATE TABLE IF NOT EXISTS generation_requests (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  job_id TEXT NOT NULL REFERENCES generation_jobs(id) ON DELETE CASCADE,
  proveedor_id TEXT REFERENCES providers(id),
  prompt TEXT NOT NULL DEFAULT '',
  params TEXT NOT NULL DEFAULT '{}',
  higgsfield_model TEXT,
  higgsfield_job_id TEXT,
  resultado_url TEXT,
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK(estado IN ('pendiente','enviado','generando','completado','fallido')),
  error_log TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================
-- IDENTITY PACK FILES (upload tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS identity_pack_files (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  pack_id TEXT NOT NULL REFERENCES identity_packs(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK(tipo IN ('video_4k','foto','audio_voz','documento')),
  filename TEXT NOT NULL,
  file_size INTEGER,
  hash_sha256 TEXT NOT NULL,
  storage_url TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================
-- SYSTEM SETTINGS (key-value store)
-- ============================================================
CREATE TABLE IF NOT EXISTS system_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  encrypted INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Seed: default providers (disabled until configured)
INSERT OR IGNORE INTO providers (id, nombre, tipo, api_url, activo)
VALUES 
  ('prov-higgsfield', 'Higgsfield API', 'higgsfield', 'https://api.higgsfield.ai/v1', 0),
  ('prov-flux', 'Flux Pro (BFL)', 'flux', 'https://api.bfl.ml/v1', 0),
  ('prov-elevenlabs', 'ElevenLabs', 'elevenlabs', 'https://api.elevenlabs.io/v1', 0);

-- Seed: default system settings
INSERT OR IGNORE INTO system_settings (key, value) VALUES ('generation_provider_default', 'higgsfield');
INSERT OR IGNORE INTO system_settings (key, value) VALUES ('compuerta_consentimiento_activa', 'true');
INSERT OR IGNORE INTO system_settings (key, value) VALUES ('audit_log_verificacion_automatica', 'true');
