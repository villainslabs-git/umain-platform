// src/lib/types.ts

export interface Provider {
  id: string;
  nombre: string;
  tipo: string;
  api_key_encrypted?: string;
  api_url: string;
  activo?: boolean;
  estado_validacion?: 'valido' | 'error';
  ultima_validacion?: string;
  created_at: string;
}

export interface Identity {
  id: string;
  nombre: string;
  tier: string;
  agencia_id?: string;
  contrato_ref?: string;
  contacto_aprobacion?: string;
  estado?: 'activo' | 'suspendido' | 'suprimido';
  created_at: string;
}

export interface Campaign {
  id: string;
  nombre: string;
  descripcion?: string;
  estado?: 'activa' | 'inactiva';
  created_at: string;
}

export interface License {
  id: string;
  identity_id: string;
  campaign_id?: string;
  talento_nombre?: string;
  campania_nombre?: string;
  created_at: string;
}

export interface GenerationJob {
  id: string;
  license_id: string;
  identity_id: string;
  tipo: string;
  proveedor?: string;
  params: string;
  estado: 'creado' | 'pendiente_qa' | 'generando' | 'entregado';
  created_at: string;
}

export interface AuditLogEntry {
  id: string;
  seq: number;
  action: string;
  entity_type?: string;
  entity_id?: string;
  user_id?: string;
  details?: Record<string, any>; // ← CAMBIO: Usar 'any' en lugar de 'unknown'
  timestamp: string;
}

export interface LegalDocument {
  id: string;
  nombre: string;
  tipo: 'policy' | 'agreement' | 'contract';
  version: number;
  effective_date: string;
  created_at: string;
}

export interface CharacterSheet {
  id: string;
  identity_id: string;
  nombre: string;
  tipo?: string;
  estado?: 'borrador' | 'publicado';
  version: number;
  descripcion?: string;
  descripcion_auto?: string;
}

export interface CharacterAsset {
  id: string;
  sheet_id: string;
  tipo: string;
  filename: string;
  storage_url: string;
  descripcion: string;
  orden: number;
}

export interface CharacterAttribute {
  id: string;
  sheet_id: string;
  atributo: string;
  valor: string;
  fuente: string;
  created_at: string;
}

export interface ConsentMatrix {
  id: string;
  identity_id: string;
  version: number;
  // ... campos adicionales según tu DB
}

export interface SystemSetting {
  key: string;
  value: string;
  updated_at?: string;
}

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
  proveedores_conectados: number;
}

export interface CharacterSheetWithAssets {
  sheet: CharacterSheet;
  assets: CharacterAsset[];
  attributes: CharacterAttribute[];
}
