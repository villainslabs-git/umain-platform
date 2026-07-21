// UMAIN Platform - TypeScript Types
// Based on Rights Engine Specification v1

export type UserRole = 'admin' | 'comercial' | 'talento' | 'agencia';

export interface User {
  id: string;
  email: string;
  nombre: string;
  rol: UserRole;
  activo: boolean;
  ultimo_acceso: string | null;
  created_at: string;
}

export type IdentityStatus = 'activo' | 'suspendido' | 'suprimido';
export type IdentityTier = 'A' | 'B' | 'C';

export interface Identity {
  id: string;
  nombre: string;
  tier: IdentityTier;
  agencia_id: string | null;
  contrato_ref: string | null;
  estado: IdentityStatus;
  contacto_aprobacion: string | null;
  metadata: string | null;
  created_at: string;
}

export type PackStatus = 'vigente' | 'reentrenamiento' | 'suprimido';

export interface IdentityPack {
  id: string;
  identity_id: string;
  version: number;
  artefactos: string;
  hash_sha256: string;
  cifrado_metadata: string;
  estado: PackStatus;
  certificado_supresion: string | null;
  created_at: string;
}

export type ConsentStatus = 'permitido' | 'caso_por_caso' | 'solo_notificar' | 'prohibido' | 'sin_definir';

export interface ConsentMatrixEntry {
  categoria: string;
  nombre: string;
  estado: ConsentStatus;
  notas?: string;
}

export interface ConsentMatrix {
  id: string;
  identity_id: string;
  version: number;
  entradas: Record<string, ConsentStatus>;
  notas: Record<string, string>;
  firma_hash: string | null;
  firma_timestamp: string | null;
  created_at: string;
}

export type CampaignStatus = 'borrador' | 'activa' | 'pausada' | 'completada' | 'cancelada';

export interface Campaign {
  id: string;
  nombre: string;
  cliente: string;
  descripcion: string | null;
  estado: CampaignStatus;
  created_by: string;
  created_at: string;
}

export type LicenseStatus = 'borrador' | 'pendiente_aprobacion' | 'vigente' | 'vencida' | 'revocada';

export interface License {
  id: string;
  identity_id: string;
  campaign_id: string;
  alcance: string;
  exclusividad: string | null;
  economia: string | null;
  token_jwt: string | null;
  estado: LicenseStatus;
  created_at: string;
}

export type JobStatus = 'creado' | 'validado' | 'generando' | 'pendiente_qa' | 'pendiente_talento' | 'entregado' | 'rechazado' | 'fallido';
export type JobType = 'imagen' | 'video' | 'voz' | 'lipsync' | 'upscale';

export interface GenerationJob {
  id: string;
  license_id: string;
  identity_id: string;
  tipo: JobType;
  proveedor: string | null;
  params: string;
  token_validado_en: string | null;
  estado: JobStatus;
  error: string | null;
  created_at: string;
}

export interface Output {
  id: string;
  job_id: string;
  tipo: string;
  url: string | null;
  hash_sha256: string;
  created_at: string;
}

export type ApprovalType = 'licencia' | 'material';
export type ApprovalMethod = 'link_firmado' | 'presencial';
export type ApprovalDecision = 'aprobado' | 'rechazado' | 'cambios_solicitados';

export interface Approval {
  id: string;
  license_id: string | null;
  output_id: string | null;
  identity_id: string;
  tipo: ApprovalType;
  metodo: ApprovalMethod;
  token: string | null;
  hash_material: string | null;
  decision: ApprovalDecision | null;
  motivo: string | null;
  expiracion: string | null;
  created_at: string;
}

export interface AuditLogEntry {
  seq: number;
  evento: string;
  payload: string;
  identity_id: string | null;
  license_id: string | null;
  hash_prev: string | null;
  hash: string;
  firma: string | null;
  created_at: string;
}

export type DocumentType = 'contrato' | 'certificado_supresion' | 'consentimiento' | 'otro';

export interface LegalDocument {
  id: string;
  identity_id: string | null;
  tipo: DocumentType;
  titulo: string;
  archivo_url: string | null;
  hash_sha256: string | null;
  created_at: string;
}

// ============================================================
// PROVIDER CONFIGURATION
// ============================================================
export type ProviderType = 'higgsfield' | 'flux' | 'midjourney' | 'runway' | 'kling' | 'elevenlabs' | 'custom';

export interface ProviderConfig {
  id: string;
  nombre: string;
  tipo: ProviderType;
  api_key: string;
  api_url: string;
  activo: boolean;
  ultima_validacion: string | null;
  estado_validacion: 'no_verificado' | 'valido' | 'error';
  created_at: string;
}

export const PROVIDER_TYPES: { value: ProviderType; label: string; icon: string; desc: string }[] = [
  { value: 'higgsfield', label: 'Higgsfield', icon: '◈', desc: 'Generacion de imagenes, video y voz via API Higgsfield' },
  { value: 'flux', label: 'Flux (BFL)', icon: '◈', desc: 'Imagenes still - modelo Flux.1 Pro' },
  { value: 'midjourney', label: 'Midjourney', icon: '◈', desc: 'Imagenes still via API Midjourney' },
  { value: 'runway', label: 'Runway', icon: '▶', desc: 'Video generativo via Runway Gen' },
  { value: 'kling', label: 'Kling', icon: '▶', desc: 'Video generativo via Kling API' },
  { value: 'elevenlabs', label: 'ElevenLabs', icon: '♢', desc: 'Clonacion de voz' },
  { value: 'custom', label: 'API Personalizada', icon: '◈', desc: 'Endpoint compatible con OpenAI spec' },
];

// IAB Categories (65)
export const IAB_CATEGORIES: { id: string; nombre: string; desc?: string }[] = [
  { id: 'iab-1', nombre: 'Identificadores de dispositivo' },
  { id: 'iab-2', nombre: 'Direccion IP' },
  { id: 'iab-3', nombre: 'Datos de geolocalizacion precisa' },
  { id: 'iab-4', nombre: 'Datos de navegacion web' },
  { id: 'iab-5', nombre: 'Datos de busqueda' },
  { id: 'iab-6', nombre: 'Datos de consumo de contenido' },
  { id: 'iab-7', nombre: 'Datos de interaccion con publicidad' },
  { id: 'iab-8', nombre: 'Datos de uso de aplicaciones' },
  { id: 'iab-9', nombre: 'Datos de redes sociales' },
  { id: 'iab-10', nombre: 'Datos demograficos' },
  { id: 'iab-11', nombre: 'Datos de ubicacion no precisa' },
  { id: 'iab-12', nombre: 'Datos del dispositivo' },
  { id: 'iab-13', nombre: 'Datos de audio (voz del usuario)' },
  { id: 'iab-14', nombre: 'Datos biometricos faciales' },
  { id: 'iab-15', nombre: 'Datos de salud' },
  { id: 'iab-16', nombre: 'Datos financieros' },
  { id: 'iab-17', nombre: 'Datos de pago' },
  { id: 'iab-18', nombre: 'Credenciales de autenticacion' },
  { id: 'iab-19', nombre: 'Datos de contactos' },
  { id: 'iab-20', nombre: 'Datos de calendario' },
  { id: 'iab-21', nombre: 'Datos de fotos' },
  { id: 'iab-22', nombre: 'Datos de video' },
  { id: 'iab-23', nombre: 'Datos de mensajes' },
  { id: 'iab-24', nombre: 'Datos de llamadas' },
  { id: 'iab-25', nombre: 'Datos de archivos del dispositivo' },
  { id: 'iab-26', nombre: 'Datos del sistema operativo' },
  { id: 'iab-27', nombre: 'Datos de idioma' },
  { id: 'iab-28', nombre: 'Datos de accesibilidad' },
  { id: 'iab-29', nombre: 'Preferencias de personalizacion' },
  { id: 'iab-30', nombre: 'Historial de compras' },
  { id: 'iab-31', nombre: 'Datos de suscripciones' },
  { id: 'iab-32', nombre: 'Datos de suscripcion a newsletters' },
  { id: 'iab-33', nombre: 'Datos de programas de fidelidad' },
  { id: 'iab-34', nombre: 'Datos de resenas y valoraciones' },
  { id: 'iab-35', nombre: 'Datos de preferencias de contenido' },
  { id: 'iab-36', nombre: 'Datos de tiempo de uso' },
  { id: 'iab-37', nombre: 'Datos de rendimiento del dispositivo' },
  { id: 'iab-38', nombre: 'Datos de diagnostico' },
  { id: 'iab-39', nombre: 'Datos de crash reporting' },
  { id: 'iab-40', nombre: 'Datos de seguridad del dispositivo' },
  { id: 'iab-41', nombre: 'Datos de red' },
  { id: 'iab-42', nombre: 'Datos de Bluetooth' },
  { id: 'iab-43', nombre: 'Datos de WiFi' },
  { id: 'iab-44', nombre: 'Datos de sensores' },
  { id: 'iab-45', nombre: 'Datos de movimiento' },
  { id: 'iab-46', nombre: 'Datos de NFC' },
  { id: 'iab-47', nombre: 'Datos de camara' },
  { id: 'iab-48', nombre: 'Datos de microfono' },
  { id: 'iab-49', nombre: 'Datos de realidad aumentada' },
  { id: 'iab-50', nombre: 'Datos de VR/XR' },
  { id: 'iab-51', nombre: 'Datos de gaming' },
  { id: 'iab-52', nombre: 'Datos de fitness' },
  { id: 'iab-53', nombre: 'Datos de sueno' },
  { id: 'iab-54', nombre: 'Datos de nutricion' },
  { id: 'iab-55', nombre: 'Datos de entorno' },
  { id: 'iab-56', nombre: 'Datos de viajes' },
  { id: 'iab-57', nombre: 'Datos de transporte' },
  { id: 'iab-58', nombre: 'Datos de eventos' },
  { id: 'iab-59', nombre: 'Datos de educacion' },
  { id: 'iab-60', nombre: 'Datos de trabajo' },
  { id: 'iab-61', nombre: 'Datos de productividad' },
  { id: 'iab-62', nombre: 'Datos de comunicacion' },
  { id: 'iab-63', nombre: 'Datos de entretenimiento' },
  { id: 'iab-64', nombre: 'Datos de noticias' },
  { id: 'iab-65', nombre: 'Datos de compras in-app' },
];

// Dashboard summary
export interface DashboardStats {
  total_identidades: number;
  identidades_activas: number;
  identidades_suspendidas: number;
  total_campanias: number;
  campanias_activas: number;
  licencias_vigentes: number;
  jobs_en_curso: number;
  jobs_completados: number;
  aprobaciones_pendientes: number;
  alertas: number;
}
