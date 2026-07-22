-- UMAIN Avatar Engine - Migration 0007
-- Arquitectura Híbrida: Task Queue + Smart Router + Quality Gate

-- ============================================================
-- AI PROVIDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_providers (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    tipo TEXT NOT NULL,
    api_url TEXT NOT NULL,
    api_key_encrypted TEXT,
    capabilities TEXT NOT NULL DEFAULT '{}',
    rate_limit_rpm INTEGER DEFAULT 60,
    rate_limit_daily INTEGER DEFAULT 1000,
    estado TEXT DEFAULT 'activo',
    ultimo_health_check TEXT,
    health_score REAL DEFAULT 1.0,
    total_calls INTEGER DEFAULT 0,
    total_failures INTEGER DEFAULT 0,
    avg_latency_ms INTEGER DEFAULT 0,
    priority INTEGER DEFAULT 5,
    activo INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- MODEL ROUTING RULES
-- ============================================================
CREATE TABLE IF NOT EXISTS model_routing (
    id TEXT PRIMARY KEY,
    task_type TEXT NOT NULL,
    model_id TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    conditions TEXT DEFAULT '{}',
    priority INTEGER DEFAULT 5,
    fallback_model_id TEXT,
    fallback_provider_id TEXT,
    credits_per_call REAL DEFAULT 1.0,
    avg_time_seconds INTEGER DEFAULT 30,
    activo INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (provider_id) REFERENCES ai_providers(id)
);

-- ============================================================
-- TASK QUEUE
-- ============================================================
CREATE TABLE IF NOT EXISTS task_queue (
    id TEXT PRIMARY KEY,
    batch_id TEXT NOT NULL,
    parent_task_id TEXT,
    task_type TEXT NOT NULL,
    pipeline TEXT NOT NULL,
    provider_id TEXT,
    model_id TEXT,
    fallback_provider_id TEXT,
    fallback_model_id TEXT,
    params TEXT NOT NULL DEFAULT '{}',
    status TEXT DEFAULT 'pending',
    priority INTEGER DEFAULT 5,
    attempt INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    result TEXT,
    error TEXT,
    depends_on TEXT DEFAULT '[]',
    created_at TEXT DEFAULT (datetime('now')),
    started_at TEXT,
    completed_at TEXT,
    metadata TEXT DEFAULT '{}',
    FOREIGN KEY (batch_id) REFERENCES pipeline_batches(batch_id)
);

-- ============================================================
-- PIPELINE BATCHES (ya existe, agregar columnas)
-- ============================================================
ALTER TABLE pipeline_batches ADD COLUMN config TEXT DEFAULT '{}';

-- ============================================================
-- QUALITY RESULTS
-- ============================================================
CREATE TABLE IF NOT EXISTS quality_results (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL,
    output_id TEXT,
    face_match_score REAL,
    visual_quality_score REAL,
    reference_adherence_score REAL,
    overall_score REAL,
    decision TEXT NOT NULL,
    details TEXT DEFAULT '{}',
    checked_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (task_id) REFERENCES task_queue(id)
);

-- ============================================================
-- PROVIDER HEALTH LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS provider_health_log (
    id TEXT PRIMARY KEY,
    provider_id TEXT NOT NULL,
    status TEXT NOT NULL,
    latency_ms INTEGER,
    error TEXT,
    checked_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (provider_id) REFERENCES ai_providers(id)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_task_queue_status ON task_queue(status, priority);
CREATE INDEX IF NOT EXISTS idx_task_queue_batch ON task_queue(batch_id);
CREATE INDEX IF NOT EXISTS idx_task_queue_type ON task_queue(task_type);
CREATE INDEX IF NOT EXISTS idx_routing_task ON model_routing(task_type, priority);
CREATE INDEX IF NOT EXISTS idx_quality_results_task ON quality_results(task_id);
CREATE INDEX IF NOT EXISTS idx_provider_health ON provider_health_log(provider_id, checked_at);

-- ============================================================
-- SEED DATA: Proveedores
-- ============================================================
INSERT OR IGNORE INTO ai_providers (id, nombre, tipo, api_url, capabilities, priority)
VALUES 
    ('higgsfield', 'Higgsfield AI', 'higgsfield', 'https://api.higgsfield.ai/v1',
     '{"models": ["soul_id", "gpt_image_2", "nano_banana_pro", "seedream_v5_pro", "seedance_2_0", "seed_audio"],
       "tasks": ["soul_id_train", "image_gen", "face_correction", "video_gen", "voice_clone"],
       "features": ["multi_reference", "text_rendering", "style_transfer", "lip_sync"]}',
     1),
    
    ('fal_ai', 'FAL.ai', 'fal_ai', 'https://fal.run',
     '{"models": ["flux-pro", "flux-realism", "stable-diffusion-xl"],
       "tasks": ["image_gen", "video_gen", "upscale"],
       "features": ["multi_reference", "style_transfer"]}',
     2),
    
    ('kling', 'Kling AI', 'kling', 'https://api.klingai.com/v1',
     '{"models": ["kling-1.5", "kling-2.0", "kling-3.0"],
       "tasks": ["video_gen"],
       "features": ["long_form", "physics_aware"]}',
     3),
    
    ('elevenlabs', 'ElevenLabs', 'elevenlabs', 'https://api.elevenlabs.io/v1',
     '{"models": ["eleven_multilingual_v2"],
       "tasks": ["voice_clone", "tts"],
       "features": ["multilingual", "emotion_control"]}',
     2),
    
    ('flux', 'Black Forest Labs', 'flux', 'https://api.bfl.ml',
     '{"models": ["flux-1.1-pro", "flux-kontext"],
       "tasks": ["image_gen", "image_edit"],
       "features": ["high_quality", "fast_generation"]}',
     3);

-- ============================================================
-- SEED DATA: Routing Rules
-- ============================================================
INSERT OR IGNORE INTO model_routing (id, task_type, model_id, provider_id, priority, credits_per_call)
VALUES
    ('route-soul-higgsfield', 'soul_id_train', 'soul_id', 'higgsfield', 1, 40),
    ('route-img-gpt-higgsfield', 'image_gen', 'gpt_image_2', 'higgsfield', 1, 3),
    ('route-img-nano-higgsfield', 'image_gen', 'nano_banana_pro', 'higgsfield', 2, 2),
    ('route-img-flux-fal', 'image_gen', 'flux-pro', 'fal_ai', 3, 2),
    ('route-face-seedream', 'face_correction', 'seedream_v5_pro', 'higgsfield', 1, 3),
    ('route-video-seedance', 'video_gen', 'seedance_2_0', 'higgsfield', 1, 8),
    ('route-video-kling', 'video_gen', 'kling3_0', 'higgsfield', 2, 7),
    ('route-voice-seed', 'voice_clone', 'seed_audio', 'higgsfield', 1, 8),
    ('route-voice-eleven', 'voice_clone', 'eleven_multilingual_v2', 'elevenlabs', 2, 5);
