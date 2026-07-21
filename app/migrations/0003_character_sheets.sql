-- UMAIN - Character Sheets for Avatar Creation
CREATE TABLE IF NOT EXISTS character_sheets (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  identity_id TEXT NOT NULL REFERENCES identities(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL DEFAULT '',
  descripcion TEXT NOT NULL DEFAULT '',
  descripcion_auto TEXT,
  tipo TEXT NOT NULL DEFAULT 'avatar' CHECK(tipo IN ('avatar','voice_clone','full_digital_twin')),
  estado TEXT NOT NULL DEFAULT 'borrador' CHECK(estado IN ('borrador','completado','entrenando','listo')),
  metadata TEXT DEFAULT '{}',
  version INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS character_assets (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  sheet_id TEXT NOT NULL REFERENCES character_sheets(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK(tipo IN ('foto_referencia','video_pose','audio_voz','captura_4k','look_referencia','documento')),
  filename TEXT NOT NULL,
  file_size INTEGER,
  hash_sha256 TEXT,
  storage_url TEXT,
  thumbnail_url TEXT,
  descripcion TEXT,
  orden INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS character_attributes (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  sheet_id TEXT NOT NULL REFERENCES character_sheets(id) ON DELETE CASCADE,
  atributo TEXT NOT NULL,
  valor TEXT NOT NULL,
  fuente TEXT NOT NULL DEFAULT 'manual' CHECK(fuente IN ('manual','auto','ia')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
