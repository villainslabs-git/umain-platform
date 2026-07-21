-- UMAIN Rights Engine v2 — Improvements
-- Migration 0005: consent_gate_log table + exclusivity seed data

-- ============================================================
-- CONSENT GATE LOG — Analytics table for consent gate metrics
-- ============================================================
CREATE TABLE IF NOT EXISTS consent_gate_log (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    identity_id TEXT NOT NULL,
    license_id TEXT,
    job_id TEXT,
    categoria_iab TEXT,
    marca TEXT,
    territorio TEXT,
    paso_fallido INTEGER,
    error TEXT,
    warnings TEXT,
    paso_1_token INTEGER DEFAULT 0,
    paso_2_alcance INTEGER DEFAULT 0,
    paso_3_matriz INTEGER DEFAULT 0,
    paso_4_exclusividad INTEGER DEFAULT 0,
    paso_5_autorizado INTEGER DEFAULT 0,
    duracion_ms INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_consent_gate_log_identity ON consent_gate_log(identity_id);
CREATE INDEX IF NOT EXISTS idx_consent_gate_log_created ON consent_gate_log(created_at);

-- ============================================================
-- SEED DATA — Exclusivity locks (Nike, Adidas, Coca-Cola)
-- Solo si template-identity-001 existe
-- ============================================================
INSERT OR IGNORE INTO exclusivity_locks (id, identity_id, license_id, categoria, territorio, marcas_bloqueadas, vencimiento)
SELECT 'lock-demo-nike', 'template-identity-001', id, 'iab-4', 'AR', '["Nike"]', '2026-12-31'
FROM licenses WHERE identity_id = 'template-identity-001' LIMIT 1;

INSERT OR IGNORE INTO exclusivity_locks (id, identity_id, license_id, categoria, territorio, marcas_bloqueadas, vencimiento)
SELECT 'lock-demo-adidas', 'template-identity-001', id, 'iab-4', 'WORLD', '["Adidas"]', '2026-12-31'
FROM licenses WHERE identity_id = 'template-identity-001' LIMIT 1;

INSERT OR IGNORE INTO exclusivity_locks (id, identity_id, license_id, categoria, territorio, marcas_bloqueadas, vencimiento)
SELECT 'lock-demo-coca', 'template-identity-001', id, 'iab-6', 'LATAM', '["Coca-Cola","Pepsi"]', '2026-12-31'
FROM licenses WHERE identity_id = 'template-identity-001' LIMIT 1;

-- ============================================================
-- SEED DATA — Demo consent matrix for template identity
-- ============================================================
INSERT OR IGNORE INTO consent_matrices (id, identity_id, version, entradas, firma_hash, firma_timestamp, firma_metodo)
VALUES (
    'matrix-template-001',
    'template-identity-001',
    1,
    '{"iab-1":"permitido","iab-2":"permitido","iab-3":"caso_por_caso","iab-4":"permitido","iab-5":"permitido","iab-6":"permitido","iab-7":"permitido","iab-8":"permitido","iab-9":"permitido","iab-10":"permitido","iab-11":"permitido","iab-12":"permitido","iab-13":"solo_notificar","iab-14":"caso_por_caso","iab-15":"prohibido","iab-16":"prohibido","iab-17":"prohibido","iab-18":"prohibido","iab-19":"prohibido","iab-20":"prohibido","iab-21":"permitido","iab-22":"permitido","iab-23":"prohibido","iab-24":"prohibido","iab-25":"prohibido"}',
    'demo-firma-hash-template-identity-001-v1',
    datetime('now'),
    'presencial'
);

-- Seed demo campaign + license if they don't exist
INSERT OR IGNORE INTO campaigns (id, nombre, cliente, descripcion, estado, created_by)
SELECT 'campaign-template-001', 'Campana Demo - Moda Verano', 'Marca Ejemplo S.A.', 'Campana de prueba', 'activa', id
FROM users WHERE email = 'demo@umain.io' LIMIT 1;

INSERT OR IGNORE INTO licenses (id, identity_id, campaign_id, alcance, estado)
SELECT 'template-license-001', 'template-identity-001', 'campaign-template-001',
  '{"medios":["redes_sociales","digital","tv"],"territorios":["AR","LATAM","US"],"categoria_iab":"iab-4","plazo_desde":"2026-07-01","plazo_hasta":"2027-01-31"}',
  'borrador'
WHERE EXISTS (SELECT 1 FROM campaigns WHERE id = 'campaign-template-001');
