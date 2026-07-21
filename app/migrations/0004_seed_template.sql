-- UMAIN - Seed Data: Template Character for Avatar Demo
-- Creates a sample identity + complete character sheet for preview
-- Name displayed as "Avatar DEMO ref" in the Avatares/Clones list

-- Template identity
INSERT OR IGNORE INTO identities (id, nombre, tier, contrato_ref, estado, contacto_aprobacion)
VALUES ('template-identity-001', 'Avatar DEMO ref', 'A', 'CONT-2026-001', 'activo', '{"telefono":"+54 11 5555-0123","email":"sofia@example.com"}');

-- Template user (for demo login)
INSERT OR IGNORE INTO users (id, email, password_hash, nombre, rol)
VALUES ('demo-user-002', 'demo@umain.io', 'demo2026', 'Demo UMAIN', 'admin');

-- Character sheet
INSERT OR IGNORE INTO character_sheets (id, identity_id, nombre, descripcion, descripcion_auto, tipo, estado)
VALUES (
  'template-sheet-001',
  'template-identity-001',
  'Avatar Digital - Sofia Martina',
  'Joven actriz y modelo argentina de 27 anios. Rostro de forma ovalada con facciones armonicas y simetricas. Piel triguena uniforme, ojos marrones expresivos de forma almendrada, y una sonrisa natural que transmite calidez y confianza. Cabello oscuro ondulado de longitud media que enmarca el rostro con naturalidad.

Su mirada es versatil: puede transmitir desde autoridad corporativa hasta cercania juvenil. La estructura facial presenta buena definicion de pomulos y mandibula suave, ideal para captura 3D y recreacion digital con alta fidelidad.

La voz es clara y modulada, con diccion perfecta del espanol rioplatense. Rango vocal amplio que permite desde tonos serenos hasta expresivos.

Perfil optimo para campanas de moda, belleza, lifestyle y contenido corporativo. Versatilidad estilistica comprobada: desde look ejecutivo hasta estetica casual-contemporanea.',
  'Talento femenino de 27 anios, complexion media. Rasgos faciales armoniosos con alta simetria. Mirada expresiva y natural frente a camara. Piel de tono trigueno uniforme. Versatilidad para distintos estilos de iluminacion y angulos de captura. Voz clara con buena proyeccion. Presencia escenica natural y gestualidad fluida. Ideal para generacion de avatar digital con aplicaciones en publicidad, entretenimiento y marca personal.',
  'avatar',
  'listo'
);

-- Character assets
INSERT OR IGNORE INTO character_assets (id, sheet_id, tipo, filename, descripcion, storage_url, orden)
VALUES 
  ('template-asset-001', 'template-sheet-001', 'foto_referencia', 'sofia_portrait_frontal.jpg', 'Retrato frontal con iluminacion natural - toma principal', 'https://d2ol7oe51mr4n9.cloudfront.net/user_2wOQxQla9e2kHVmC1Pv6AhkGTRv/db3f86ea-97a6-4e17-977d-c6a29edec680.png', 1),
  ('template-asset-002', 'template-sheet-001', 'foto_referencia', 'sofia_portrait_perfil.jpg', 'Perfil 3/4 con luz lateral - variacion de angulo', 'https://d2ol7oe51mr4n9.cloudfront.net/user_2wOQxQla9e2kHVmC1Pv6AhkGTRv/f363b50e-f6a4-4be1-8a5b-04b6f8dca775.png', 2),
  ('template-asset-003', 'template-sheet-001', 'look_referencia', 'sofia_look_casual.jpg', 'Look casual - estilo lifestyle para campanas de moda', '', 3),
  ('template-asset-004', 'template-sheet-001', 'audio_voz', 'sofia_grabacion_voz.mp3', 'Grabacion de voz: guion fonetico espanol rioplatense, 3 min', '', 4);

-- Character attributes
INSERT OR IGNORE INTO character_attributes (id, sheet_id, atributo, valor, fuente)
VALUES
  ('template-attr-001', 'template-sheet-001', 'Edad aparente', '25-30 anios', 'auto'),
  ('template-attr-002', 'template-sheet-001', 'Genero', 'Femenino', 'auto'),
  ('template-attr-003', 'template-sheet-001', 'Tono de voz', 'Claro, modulado, espanol rioplatense', 'manual'),
  ('template-attr-004', 'template-sheet-001', 'Estilo', 'Versatil: ejecutivo, casual, fashion', 'manual'),
  ('template-attr-005', 'template-sheet-001', 'Contexto de uso', 'Publicidad, campanas digitales, contenido corporativo', 'manual'),
  ('template-attr-006', 'template-sheet-001', 'Tipo de rostro', 'Ovalado, alta simetria', 'auto'),
  ('template-attr-007', 'template-sheet-001', 'Color de ojos', 'Marrones expresivos', 'auto'),
  ('template-attr-008', 'template-sheet-001', 'Tipo de cabello', 'Oscuro, ondulado, medio', 'auto');
