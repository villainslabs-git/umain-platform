-- UMAIN Avatar Engine - Task Queue Schema
-- Arquitectura Híbrida: Task Queue + Smart Router + Quality Gate

-- ============================================================
-- PROVIDER REGISTRY
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_providers (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    tipo TEXT NOT NULL, -- 'higgsfield', 'fal_ai', 'kling', 'gemini', 'elevenlabs', 'flux', 'runway'
    api_url TEXT NOT NULL,
    api_key_encrypted TEXT,
    
    -- Capacidades (JSON)
    capabilities TEXT NOT NULL DEFAULT '{}',
    -- Ejemplo: {
    --   "models": ["gpt_image_2", "nano_banana_pro", "seedream_v5_pro"],
    --   "tasks": ["image_gen", "face_correction", "video_gen", "voice_clone"],
    --   "features": ["multi_reference", "text_rendering", "style_transfer"]
    -- }
    
    -- Rate limits
    rate_limit_rpm INTEGER DEFAULT 60,
    rate_limit_daily INTEGER DEFAULT 1000,
    
    -- Health
    estado TEXT DEFAULT 'activo', -- 'activo', 'degraded', 'offline'
    ultimo_health_check TEXT,
    health_score REAL DEFAULT 1.0, -- 0.0 - 1.0
    
    -- Stats
    total_calls INTEGER DEFAULT 0,
    total_failures INTEGER DEFAULT 0,
    avg_latency_ms INTEGER DEFAULT 0,
    
    -- Metadata
    priority INTEGER DEFAULT 5, -- 1 = más alta prioridad
    activo INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- MODEL ROUTING RULES
-- ============================================================
CREATE TABLE IF NOT EXISTS model_routing (
    id TEXT PRIMARY KEY,
    
    -- Qué tarea
    task_type TEXT NOT NULL,
    -- 'soul_id_train', 'element_register', 'voice_clone',
    -- 'image_gen', 'image_edit', 'face_correction',
    -- 'video_gen', 'video_edit', 'upscale'
    
    -- Qué modelo
    model_id TEXT NOT NULL, -- 'gpt_image_2', 'nano_banana_pro', etc.
    provider_id TEXT NOT NULL REFERENCES ai_providers(id),
    
    -- Condiciones de uso (JSON)
    conditions TEXT DEFAULT '{}',
    -- Ejemplo: {
    --   "needs_references": true,
    --   "needs_text_rendering": false,
    --   "max_batch_size": 10,
    --   "quality_level": "high"
    -- }
    
    -- Prioridad y fallback
    priority INTEGER DEFAULT 5,
    fallback_model_id TEXT,
    fallback_provider_id TEXT,
    
    -- Costo estimado
    credits_per_call REAL DEFAULT 1.0,
    avg_time_seconds INTEGER DEFAULT 30,
    
    -- Estado
    activo INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- TASK QUEUE (Cola de tareas)
-- ============================================================
CREATE TABLE IF NOT EXISTS task_queue (
    id TEXT PRIMARY KEY,
    batch_id TEXT NOT NULL,
    parent_task_id TEXT, -- Para dependencias
    
    -- Tipo de tarea
    task_type TEXT NOT NULL,
    pipeline TEXT NOT NULL, -- 'A', 'B', 'C', 'setup', 'finalize'
    
    -- Routing
    provider_id TEXT REFERENCES ai_providers(id),
    model_id TEXT,
    fallback_provider_id TEXT,
    fallback_model_id TEXT,
    
    -- Parámetros (JSON)
    params TEXT NOT NULL DEFAULT '{}',
    -- Ejemplo para image_gen: {
    --   "prompt": "...",
    --   "references": {"character": "id", "outfit": "id"},
    --   "aspect_ratio": "3:4",
    --   "quality": "high"
    -- }
    
    -- Estado
    status TEXT DEFAULT 'pending',
    -- 'pending', 'queued', 'processing', 'completed', 'failed', 'cancelled'
    
    priority INTEGER DEFAULT 5, -- 1 = más alta
    attempt INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    
    -- Resultado (JSON)
    result TEXT,
    error TEXT,
    
    -- Dependencias
    depends_on TEXT DEFAULT '[]', -- JSON array de task_ids
    
    -- Timestamps
    created_at TEXT DEFAULT (datetime('now')),
    started_at TEXT,
    completed_at TEXT,
    
    -- Metadata
    metadata TEXT DEFAULT '{}',
    
    FOREIGN KEY (batch_id) REFERENCES pipeline_batches(batch_id)
);

-- ============================================================
-- PIPELINE BATCHES
-- ============================================================
CREATE TABLE IF NOT EXISTS pipeline_batches (
    batch_id TEXT PRIMARY KEY,
    identity_id TEXT NOT NULL,
    character_sheet_version INTEGER,
    
    -- Configuración del batch
    config TEXT DEFAULT '{}',
    -- Ejemplo: {
    --   "quality_threshold": 0.85,
    --   "max_credits": 200,
    --   "priority": "normal",
    --   "auto_correct": true
    -- }
    
    -- Estado
    status TEXT DEFAULT 'pending',
    -- 'pending', 'processing', 'quality_review', 'completed', 'failed'
    
    -- Progreso
    total_tasks INTEGER DEFAULT 0,
    completed_tasks INTEGER DEFAULT 0,
    failed_tasks INTEGER DEFAULT 0,
    skipped_tasks INTEGER DEFAULT 0,
    
    -- Costos
    total_credits INTEGER DEFAULT 0,
    
    -- Timestamps
    started_at TEXT DEFAULT (datetime('now')),
    completed_at TEXT,
    
    FOREIGN KEY (identity_id) REFERENCES identities(id)
);

-- ============================================================
-- QUALITY GATE RESULTS
-- ============================================================
CREATE TABLE IF NOT EXISTS quality_results (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL REFERENCES task_queue(id),
    output_id TEXT, -- Referencia al output generado
    
    -- Scores
    face_match_score REAL,
    visual_quality_score REAL,
    reference_adherence_score REAL,
    overall_score REAL,
    
    -- Decision
    decision TEXT NOT NULL, -- 'pass', 'review', 'fail', 'regenerate'
    
    -- Detalles (JSON)
    details TEXT DEFAULT '{}',
    
    -- Timestamps
    checked_at TEXT DEFAULT (datetime('now')),
    
    FOREIGN KEY (task_id) REFERENCES task_queue(id)
);

-- ============================================================
-- PROVIDER HEALTH LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS provider_health_log (
    id TEXT PRIMARY KEY,
    provider_id TEXT NOT NULL REFERENCES ai_providers(id),
    
    -- Resultado del health check
    status TEXT NOT NULL, -- 'healthy', 'degraded', 'offline'
    latency_ms INTEGER,
    error TEXT,
    
    -- Timestamp
    checked_at TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_task_queue_status ON task_queue(status, priority);
CREATE INDEX IF NOT EXISTS idx_task_queue_batch ON task_queue(batch_id);
CREATE INDEX IF NOT EXISTS idx_task_queue_type ON task_queue(task_type);
CREATE INDEX IF NOT EXISTS idx_task_queue_provider ON task_queue(provider_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_batches_identity ON pipeline_batches(identity_id);
CREATE INDEX IF NOT EXISTS idx_quality_results_task ON quality_results(task_id);
CREATE INDEX IF NOT EXISTS idx_routing_task ON model_routing(task_type, priority);
CREATE INDEX IF NOT EXISTS idx_provider_health ON provider_health_log(provider_id, checked_at);

-- ============================================================
-- SEED DATA: Proveedores
-- ============================================================
INSERT OR IGNORE INTO ai_providers (id, nombre, tipo, api_url, capabilities, priority)
VALUES 
    ('higgsfield', 'Higgsfield AI', 'higgsfield', 'https://api.higgsfield.ai/v1',
     '{"models": ["soul_id", "gpt_image_2", "nano_banana_pro", "seedream_v5_pro", "seedance_2_0", "seed_audio", "wan_2_6"],
       "tasks": ["soul_id_train", "image_gen", "face_correction", "video_gen", "voice_clone", "upscale"],
       "features": ["multi_reference", "text_rendering", "style_transfer", "lip_sync"]}',
     1),
    
    ('fal_ai', 'FAL.ai', 'fal_ai', 'https://fal.run',
     '{"models": ["flux-pro", "flux-realism", "stable-diffusion-xl", "kling-video"],
       "tasks": ["image_gen", "video_gen", "upscale"],
       "features": ["multi_reference", "style_transfer"]}',
     2),
    
    ('kling', 'Kling AI', 'kling', 'https://api.klingai.com/v1',
     '{"models": ["kling-1.5", "kling-2.0", "kling-3.0"],
       "tasks": ["video_gen"],
       "features": ["long_form", "physics_aware"]}',
     3),
    
    ('elevenlabs', 'ElevenLabs', 'elevenlabs', 'https://api.elevenlabs.io/v1',
     '{"models": ["eleven_multilingual_v2", "eleven_turbo_v2"],
       "tasks": ["voice_clone", "tts"],
       "features": ["multilingual", "emotion_control"]}',
     2),
    
    ('flux', 'Black Forest Labs (Flux)', 'flux', 'https://api.bfl.ml',
     '{"models": ["flux-1.1-pro", "flux-pro", "flux-kontext"],
       "tasks": ["image_gen", "image_edit"],
       "features": ["high_quality", "fast_generation"]}',
     3);

-- ============================================================
-- SEED DATA: Routing Rules
-- ============================================================
INSERT OR IGNORE INTO model_routing (id, task_type, model_id, provider_id, priority, credits_per_call)
VALUES
    -- Soul ID Training
    ('route-soul-higgsfield', 'soul_id_train', 'soul_id', 'higgsfield', 1, 40),
    
    -- Image Generation (con referencias)
    ('route-img-gpt-higgsfield', 'image_gen', 'gpt_image_2', 'higgsfield', 1, 3),
    ('route-img-nano-higgsfield', 'image_gen', 'nano_banana_pro', 'higgsfield', 2, 2),
    ('route-img-flux-fal', 'image_gen', 'flux-pro', 'fal_ai', 3, 2),
    ('route-img-flux-direct', 'image_gen', 'flux-1.1-pro', 'flux', 4, 2),
    
    -- Face Correction
    ('route-face-seedream', 'face_correction', 'seedream_v5_pro', 'higgsfield', 1, 3),
    
    -- Video Generation
    ('route-video-seedance', 'video_gen', 'seedance_2_0', 'higgsfield', 1, 8),
    ('route-video-kling-higgsfield', 'video_gen', 'kling3_0', 'higgsfield', 2, 7),
    ('route-video-kling-direct', 'video_gen', 'kling-3.0', 'kling', 3, 7),
    
    -- Voice Clone
    ('route-voice-seed', 'voice_clone', 'seed_audio', 'higgsfield', 1, 8),
    ('route-voice-eleven', 'voice_clone', 'eleven_multilingual_v2', 'elevenlabs', 2, 5);
