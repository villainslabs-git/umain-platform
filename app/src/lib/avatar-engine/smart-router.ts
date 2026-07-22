// UMAIN Avatar Engine - Smart Router
// Selecciona el proveedor y modelo óptimo para cada tarea

import type { D1Database } from "@cloudflare/workers-types";

// ============================================================
// TYPES
// ============================================================

export interface TaskRequest {
  task_type: TaskType;
  identity_id: string;
  batch_id: string;
  
  // Requerimientos
  requirements?: {
    needs_references?: boolean;
    needs_text_rendering?: boolean;
    needs_face_consistency?: boolean;
    max_batch_size?: number;
    quality_level?: 'draft' | 'standard' | 'high' | 'ultra';
    max_credits?: number;
    max_time_seconds?: number;
  };
  
  // Preferencias de proveedor (opcional)
  preferred_provider?: string;
  preferred_model?: string;
  
  // Parámetros específicos de la tarea
  params: Record<string, unknown>;
}

export type TaskType = 
  | 'soul_id_train'
  | 'element_register'
  | 'voice_clone'
  | 'image_gen'
  | 'image_edit'
  | 'face_correction'
  | 'video_gen'
  | 'video_edit'
  | 'upscale';

export interface ProviderSelection {
  provider_id: string;
  provider_name: string;
  model_id: string;
  
  fallback_provider_id?: string;
  fallback_model_id?: string;
  
  estimated_credits: number;
  estimated_time_seconds: number;
  
  reason: string; // Por qué se seleccionó este proveedor
  confidence: number; // 0.0 - 1.0
}

export interface ProviderHealth {
  provider_id: string;
  status: 'healthy' | 'degraded' | 'offline';
  health_score: number; // 0.0 - 1.0
  avg_latency_ms: number;
  success_rate: number; // 0.0 - 1.0
  last_check: string;
}

// ============================================================
// SMART ROUTER CLASS
// ============================================================

export class SmartRouter {
  private db: D1Database;
  
  // Cache de salud de proveedores
  private healthCache: Map<string, ProviderHealth> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos
  
  constructor(db: D1Database) {
    this.db = db;
  }
  
  // ============================================================
  // SELECCIÓN DE PROVEEDOR
  // ============================================================
  
  async selectProvider(request: TaskRequest): Promise<ProviderSelection> {
    // 1. Si el usuario prefiere un proveedor específico, intentar primero
    if (request.preferred_provider) {
      const preferred = await this.tryPreferredProvider(request);
      if (preferred) return preferred;
    }
    
    // 2. Obtener reglas de routing para esta tarea
    const rules = await this.getRoutingRules(request.task_type);
    
    // 3. Filtrar por requisitos
    const eligible = await this.filterByRequirements(rules, request.requirements);
    
    // 4. Ordenar por prioridad y salud del proveedor
    const ranked = await this.rankProviders(eligible);
    
    // 5. Seleccionar el mejor
    if (ranked.length === 0) {
      throw new Error(`No hay proveedores disponibles para ${request.task_type}`);
    }
    
    const selected = ranked[0];
    
    // 6. Seleccionar fallback
    const fallback = ranked.length > 1 ? ranked[1] : null;
    
    return {
      provider_id: selected.provider_id,
      provider_name: selected.provider_name,
      model_id: selected.model_id,
      
      fallback_provider_id: fallback?.provider_id,
      fallback_model_id: fallback?.model_id,
      
      estimated_credits: selected.credits_per_call,
      estimated_time_seconds: selected.avg_time_seconds,
      
      reason: this.buildSelectionReason(selected, request),
      confidence: this.calculateConfidence(selected, request),
    };
  }
  
  // ============================================================
  // SELECCIÓN POR TIPO DE TAREA
  // ============================================================
  
  async selectForSoulIdTraining(photosCount: number): Promise<ProviderSelection> {
    return this.selectProvider({
      task_type: 'soul_id_train',
      identity_id: '',
      batch_id: '',
      requirements: {
        quality_level: 'high',
      },
      params: { photos_count: photosCount },
    });
  }
  
  async selectForImageGeneration(context: {
    needs_references: boolean;
    needs_text: boolean;
    batch_size: number;
    quality: string;
  }): Promise<ProviderSelection> {
    return this.selectProvider({
      task_type: 'image_gen',
      identity_id: '',
      batch_id: '',
      requirements: {
        needs_references: context.needs_references,
        needs_text_rendering: context.needs_text,
        max_batch_size: context.batch_size,
        quality_level: context.quality as any,
      },
      params: {},
    });
  }
  
  async selectForFaceCorrection(initialScore: number): Promise<ProviderSelection> {
    return this.selectProvider({
      task_type: 'face_correction',
      identity_id: '',
      batch_id: '',
      requirements: {
        quality_level: 'high',
        needs_face_consistency: true,
      },
      params: { initial_score: initialScore },
    });
  }
  
  async selectForVideoGeneration(context: {
    duration_seconds: number;
    has_audio: boolean;
    camera_control: boolean;
  }): Promise<ProviderSelection> {
    // Si necesita control preciso de cámara → WAN 2.6
    // Si necesita audio nativo → Seedance 2.0
    // Default → Seedance 2.0
    
    return this.selectProvider({
      task_type: 'video_gen',
      identity_id: '',
      batch_id: '',
      requirements: {
        quality_level: 'high',
      },
      params: context,
    });
  }
  
  // ============================================================
  // OBTENER REGLAS DE ROUTING
  // ============================================================
  
  private async getRoutingRules(taskType: string): Promise<any[]> {
    const result = await this.db.prepare(`
      SELECT 
        r.*,
        p.nombre as provider_name,
        p.health_score,
        p.avg_latency_ms,
        p.total_calls,
        p.total_failures
      FROM model_routing r
      JOIN ai_providers p ON r.provider_id = p.id
      WHERE r.task_type = ?
        AND r.activo = 1
        AND p.activo = 1
      ORDER BY r.priority ASC
    `).bind(taskType).all();
    
    return result.results || [];
  }
  
  // ============================================================
  // FILTRAR POR REQUISITOS
  // ============================================================
  
  private async filterByRequirements(
    rules: any[], 
    requirements?: TaskRequest['requirements']
  ): Promise<any[]> {
    if (!requirements) return rules;
    
    return rules.filter(rule => {
      const capabilities = JSON.parse(rule.capabilities || '{}');
      const conditions = JSON.parse(rule.conditions || '{}');
      
      // Verificar si el modelo soporta las características requeridas
      if (requirements.needs_references && !capabilities.features?.includes('multi_reference')) {
        return false;
      }
      
      if (requirements.needs_text_rendering && !capabilities.features?.includes('text_rendering')) {
        return false;
      }
      
      return true;
    });
  }
  
  // ============================================================
  // RANKING DE PROVEEDORES
  // ============================================================
  
  private async rankProviders(rules: any[]): Promise<any[]> {
    // Obtener salud actualizada de proveedores
    const healthScores = await this.getProvidersHealth();
    
    return rules
      .map(rule => {
        const health = healthScores.get(rule.provider_id);
        const healthScore = health?.health_score ?? 0.5;
        const successRate = health?.success_rate ?? 0.5;
        
        // Score compuesto: prioridad + salud + tasa de éxito
        const compositeScore = (
          (1 / rule.priority) * 0.4 +  // Prioridad (mayor = mejor)
          healthScore * 0.35 +           // Salud del proveedor
          successRate * 0.25             // Tasa de éxito histórica
        );
        
        return {
          ...rule,
          composite_score: compositeScore,
          health_score: healthScore,
          success_rate: successRate,
        };
      })
      .sort((a, b) => b.composite_score - a.composite_score);
  }
  
  // ============================================================
  // SALUD DE PROVEEDORES
  // ============================================================
  
  async getProvidersHealth(): Promise<Map<string, ProviderHealth>> {
    const now = Date.now();
    
    // Verificar si el cache es válido
    if (this.healthCache.size > 0 && 
        Array.from(this.cacheExpiry.values()).every(expiry => expiry > now)) {
      return this.healthCache;
    }
    
    // Obtener de la DB
    const providers = await this.db.prepare(`
      SELECT 
        id,
        nombre,
        estado,
        health_score,
        avg_latency_ms,
        total_calls,
        total_failures,
        ultimo_health_check
      FROM ai_providers
      WHERE activo = 1
    `).all();
    
    const healthMap = new Map<string, ProviderHealth>();
    
    for (const row of (providers.results || [])) {
      const p = row as any;
      const successRate = p.total_calls > 0 
        ? 1 - (p.total_failures / p.total_calls)
        : 0.5;
      
      const health: ProviderHealth = {
        provider_id: p.id,
        status: p.estado,
        health_score: p.health_score,
        avg_latency_ms: p.avg_latency_ms,
        success_rate: successRate,
        last_check: p.ultimo_health_check,
      };
      
      healthMap.set(p.id, health);
      
      // Actualizar cache
      this.healthCache.set(p.id, health);
      this.cacheExpiry.set(p.id, now + this.CACHE_TTL_MS);
    }
    
    return healthMap;
  }
  
  // ============================================================
  // HEALTH CHECK DE PROVEEDORES
  // ============================================================
  
  async checkProviderHealth(providerId: string): Promise<ProviderHealth> {
    const provider = await this.db.prepare(
      'SELECT * FROM ai_providers WHERE id = ?'
    ).bind(providerId).first() as any;
    
    if (!provider) {
      throw new Error(`Provider ${providerId} no encontrado`);
    }
    
    // TODO: Implementar health check real contra la API del proveedor
    // Por ahora, usar datos históricos
    
    const successRate = provider.total_calls > 0
      ? 1 - (provider.total_failures / provider.total_calls)
      : 0.5;
    
    const health: ProviderHealth = {
      provider_id: providerId,
      status: provider.estado,
      health_score: provider.health_score,
      avg_latency_ms: provider.avg_latency_ms,
      success_rate: successRate,
      last_check: provider.ultimo_health_check,
    };
    
    // Registrar en log
    await this.db.prepare(`
      INSERT INTO provider_health_log (id, provider_id, status, latency_ms, checked_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `).bind(
      crypto.randomUUID(),
      providerId,
      health.status,
      health.avg_latency_ms
    ).run();
    
    return health;
  }
  
  // ============================================================
  // ACTUALIZAR ESTADÍSTICAS
  // ============================================================
  
  async recordProviderCall(
    providerId: string,
    success: boolean,
    latencyMs: number,
    creditsUsed: number
  ): Promise<void> {
    const provider = await this.db.prepare(
      'SELECT total_calls, total_failures, avg_latency_ms FROM ai_providers WHERE id = ?'
    ).bind(providerId).first() as any;
    
    if (!provider) return;
    
    const newTotalCalls = provider.total_calls + 1;
    const newTotalFailures = provider.total_failures + (success ? 0 : 1);
    const newAvgLatency = Math.round(
      (provider.avg_latency_ms * provider.total_calls + latencyMs) / newTotalCalls
    );
    
    const newHealthScore = success 
      ? Math.min(1.0, provider.health_score + 0.01)
      : Math.max(0.0, provider.health_score - 0.05);
    
    await this.db.prepare(`
      UPDATE ai_providers 
      SET total_calls = ?,
          total_failures = ?,
          avg_latency_ms = ?,
          health_score = ?,
          updated_at = datetime('now')
      WHERE id = ?
    `).bind(
      newTotalCalls,
      newTotalFailures,
      newAvgLatency,
      newHealthScore,
      providerId
    ).run();
    
    // Invalidar cache
    this.healthCache.delete(providerId);
    this.cacheExpiry.delete(providerId);
  }
  
  // ============================================================
  // HELPERS
  // ============================================================
  
  private async tryPreferredProvider(request: TaskRequest): Promise<ProviderSelection | null> {
    if (!request.preferred_provider) return null;
    
    const rules = await this.db.prepare(`
      SELECT r.*, p.nombre as provider_name
      FROM model_routing r
      JOIN ai_providers p ON r.provider_id = p.id
      WHERE r.task_type = ?
        AND r.provider_id = ?
        AND r.activo = 1
        AND p.activo = 1
      ORDER BY r.priority ASC
      LIMIT 1
    `).bind(request.task_type, request.preferred_provider).first() as any;
    
    if (!rules) return null;
    
    const health = await this.checkProviderHealth(request.preferred_provider);
    
    if (health.status === 'offline') return null;
    
    return {
      provider_id: rules.provider_id,
      provider_name: rules.provider_name,
      model_id: rules.model_id,
      estimated_credits: rules.credits_per_call,
      estimated_time_seconds: rules.avg_time_seconds,
      reason: `Proveedor preferido: ${rules.provider_name}`,
      confidence: health.health_score,
    };
  }
  
  private buildSelectionReason(rule: any, request: TaskRequest): string {
    const reasons: string[] = [];
    
    reasons.push(`${rule.provider_name} (${rule.model_id})`);
    reasons.push(`Prioridad: ${rule.priority}`);
    reasons.push(`Salud: ${Math.round(rule.health_score * 100)}%`);
    reasons.push(`Éxito histórico: ${Math.round(rule.success_rate * 100)}%`);
    
    if (request.requirements?.needs_references) {
      reasons.push('Soporta multi-referencia');
    }
    
    return reasons.join(' | ');
  }
  
  private calculateConfidence(rule: any, request: TaskRequest): number {
    let confidence = 0.5; // Base
    
    // Aumentar por salud del proveedor
    confidence += rule.health_score * 0.25;
    
    // Aumentar por tasa de éxito
    confidence += rule.success_rate * 0.15;
    
    // Aumentar si el proveedor es prioritario
    if (rule.priority === 1) confidence += 0.1;
    
    return Math.min(1.0, confidence);
  }
}

// ============================================================
// HELPER: Crear instancia del router
// ============================================================

export function createSmartRouter(db: D1Database): SmartRouter {
  return new SmartRouter(db);
}
