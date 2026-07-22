// UMAIN Avatar Engine - DB Manager
// Persistencia de resultados + AuditLog

import type { D1Database } from "@cloudflare/workers-types";

// ============================================================
// TYPES
// ============================================================

export interface AvatarBatchConfig {
  identity_id: string;
  character_sheet_version?: number;
  
  quality_threshold?: number; // 0.0 - 1.0
  max_credits?: number;
  priority?: 'low' | 'normal' | 'high';
  auto_correct?: boolean; // Pipeline C automático
  
  // Referencias
  references?: {
    outfits?: string[];
    environments?: string[];
    props?: string[];
  };
}

export interface TaskResult {
  task_id: string;
  success: boolean;
  
  output_url?: string;
  output_type?: 'image' | 'video' | 'audio';
  
  model_used: string;
  provider_id: string;
  credits_used: number;
  time_ms: number;
  
  metadata?: Record<string, unknown>;
  error?: string;
}

export interface BatchProgress {
  batch_id: string;
  status: string;
  
  total_tasks: number;
  completed: number;
  failed: number;
  skipped: number;
  
  total_credits: number;
  
  started_at: string;
  estimated_completion?: string;
}

// ============================================================
// DB MANAGER CLASS
// ============================================================

export class DBManager {
  private db: D1Database;
  
  constructor(db: D1Database) {
    this.db = db;
  }
  
  // ============================================================
  // BATCH MANAGEMENT
  // ============================================================
  
  async createBatch(config: AvatarBatchConfig): Promise<string> {
    const batchId = crypto.randomUUID();
    
    await this.db.prepare(`
      INSERT INTO pipeline_batches 
        (batch_id, identity_id, character_sheet_version, config, status, started_at)
      VALUES (?, ?, ?, ?, 'pending', datetime('now'))
    `).bind(
      batchId,
      config.identity_id,
      config.character_sheet_version ?? 1,
      JSON.stringify(config)
    ).run();
    
    await this.auditLog('batch_created', {
      batch_id: batchId,
      identity_id: config.identity_id,
      config,
    });
    
    return batchId;
  }
  
  async updateBatchStatus(
    batchId: string, 
    status: string,
    updates?: Partial<BatchProgress>
  ): Promise<void> {
    const sets: string[] = ['status = ?'];
    const values: any[] = [status];
    
    if (updates?.completed !== undefined) {
      sets.push('completed_tasks = ?');
      values.push(updates.completed);
    }
    if (updates?.failed !== undefined) {
      sets.push('failed_tasks = ?');
      values.push(updates.failed);
    }
    if (updates?.total_credits !== undefined) {
      sets.push('total_credits = ?');
      values.push(updates.total_credits);
    }
    if (status === 'completed' || status === 'failed') {
      sets.push('completed_at = datetime(\'now\')');
    }
    
    values.push(batchId);
    
    await this.db.prepare(`
      UPDATE pipeline_batches 
      SET ${sets.join(', ')}
      WHERE batch_id = ?
    `).bind(...values).run();
    
    await this.auditLog('batch_status_changed', {
      batch_id: batchId,
      new_status: status,
      updates,
    });
  }
  
  async getBatch(batchId: string): Promise<any> {
    return this.db.prepare(
      'SELECT * FROM pipeline_batches WHERE batch_id = ?'
    ).bind(batchId).first();
  }
  
  async getBatchProgress(batchId: string): Promise<BatchProgress> {
    const batch = await this.getBatch(batchId) as any;
    
    if (!batch) {
      throw new Error(`Batch ${batchId} no encontrado`);
    }
    
    const tasks = await this.db.prepare(`
      SELECT status, COUNT(*) as count
      FROM task_queue
      WHERE batch_id = ?
      GROUP BY status
    `).bind(batchId).all();
    
    const statusCounts: Record<string, number> = {};
    for (const t of (tasks.results || [])) {
      statusCounts[t.status] = t.count;
    }
    
    return {
      batch_id: batchId,
      status: batch.status,
      total_tasks: batch.total_tasks,
      completed: statusCounts['completed'] || 0,
      failed: statusCounts['failed'] || 0,
      skipped: statusCounts['skipped'] || 0,
      total_credits: batch.total_credits,
      started_at: batch.started_at,
    };
  }
  
  // ============================================================
  // TASK MANAGEMENT
  // ============================================================
  
  async createTask(params: {
    batch_id: string;
    task_type: string;
    pipeline: string;
    provider_id?: string;
    model_id?: string;
    fallback_provider_id?: string;
    fallback_model_id?: string;
    params: Record<string, unknown>;
    priority?: number;
    depends_on?: string[];
  }): Promise<string> {
    const taskId = crypto.randomUUID();
    
    await this.db.prepare(`
      INSERT INTO task_queue 
        (id, batch_id, task_type, pipeline, provider_id, model_id,
         fallback_provider_id, fallback_model_id, params, priority, 
         depends_on, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', datetime('now'))
    `).bind(
      taskId,
      params.batch_id,
      params.task_type,
      params.pipeline,
      params.provider_id || null,
      params.model_id || null,
      params.fallback_provider_id || null,
      params.fallback_model_id || null,
      JSON.stringify(params.params),
      params.priority || 5,
      JSON.stringify(params.depends_on || [])
    ).run();
    
    // Actualizar total_tasks en el batch
    await this.db.prepare(`
      UPDATE pipeline_batches 
      SET total_tasks = total_tasks + 1
      WHERE batch_id = ?
    `).bind(params.batch_id).run();
    
    return taskId;
  }
  
  async updateTaskStatus(
    taskId: string,
    status: string,
    result?: TaskResult
  ): Promise<void> {
    const sets: string[] = ['status = ?'];
    const values: any[] = [status];
    
    if (status === 'processing') {
      sets.push('started_at = datetime(\'now\')');
      sets.push('attempt = attempt + 1');
    }
    
    if (result) {
      sets.push('result = ?');
      values.push(JSON.stringify(result));
      
      if (result.credits_used) {
        sets.push('metadata = json_set(COALESCE(metadata, \'{}\'), \'$.credits_used\', ?)');
        values.push(result.credits_used);
      }
    }
    
    if (status === 'completed' || status === 'failed') {
      sets.push('completed_at = datetime(\'now\')');
    }
    
    if (status === 'failed' && result?.error) {
      sets.push('error = ?');
      values.push(result.error);
    }
    
    values.push(taskId);
    
    await this.db.prepare(`
      UPDATE task_queue 
      SET ${sets.join(', ')}
      WHERE id = ?
    `).bind(...values).run();
    
    // Actualizar contadores en el batch
    const task = await this.db.prepare(
      'SELECT batch_id FROM task_queue WHERE id = ?'
    ).bind(taskId).first() as any;
    
    if (task) {
      if (status === 'completed') {
        await this.db.prepare(`
          UPDATE pipeline_batches 
          SET completed_tasks = completed_tasks + 1
          WHERE batch_id = ?
        `).bind(task.batch_id).run();
      } else if (status === 'failed') {
        await this.db.prepare(`
          UPDATE pipeline_batches 
          SET failed_tasks = failed_tasks + 1
          WHERE batch_id = ?
        `).bind(task.batch_id).run();
      }
    }
  }
  
  async getTask(taskId: string): Promise<any> {
    return this.db.prepare(
      'SELECT * FROM task_queue WHERE id = ?'
    ).bind(taskId).first();
  }
  
  async getPendingTasks(batchId?: string): Promise<any[]> {
    let query = `
      SELECT * FROM task_queue 
      WHERE status = 'pending'
    `;
    const params: any[] = [];
    
    if (batchId) {
      query += ' AND batch_id = ?';
      params.push(batchId);
    }
    
    query += ' ORDER BY priority ASC, created_at ASC';
    
    const result = await this.db.prepare(query).bind(...params).all();
    return result.results || [];
  }
  
  async getTasksByBatch(batchId: string): Promise<any[]> {
    const result = await this.db.prepare(`
      SELECT * FROM task_queue 
      WHERE batch_id = ?
      ORDER BY priority ASC, created_at ASC
    `).bind(batchId).all();
    
    return result.results || [];
  }
  
  // ============================================================
  // OUTPUT MANAGEMENT
  // ============================================================
  
  async saveOutput(params: {
    task_id: string;
    job_id?: string;
    tipo: string;
    url: string;
    hash_sha256: string;
    c2pa_metadata?: string;
    watermark?: string;
  }): Promise<string> {
    const outputId = crypto.randomUUID();
    
    await this.db.prepare(`
      INSERT INTO outputs 
        (id, job_id, tipo, url, hash_sha256, c2pa_metadata, watermark, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(
      outputId,
      params.job_id || null,
      params.tipo,
      params.url,
      params.hash_sha256,
      params.c2pa_metadata || null,
      params.watermark || null
    ).run();
    
    await this.auditLog('output_created', {
      output_id: outputId,
      task_id: params.task_id,
      tipo: params.tipo,
      hash: params.hash_sha256,
    });
    
    return outputId;
  }
  
  // ============================================================
  // CHARACTER SHEET MASTER
  // ============================================================
  
  async saveToCharacterSheetMaster(params: {
    identity_id: string;
    batch_id: string;
    assets: {
      category: string; // 'headshot', 'outfit', 'environment', 'pose', 'prop'
      r2_key: string;
      model_used: string;
      pipeline: string;
      quality_score: number;
      face_match_score?: number;
      credits_used: number;
    }[];
  }): Promise<void> {
    // Obtener versión actual del character sheet
    const sheet = await this.db.prepare(`
      SELECT id, version FROM character_sheets 
      WHERE identity_id = ? 
      ORDER BY version DESC LIMIT 1
    `).bind(params.identity_id).first() as any;
    
    const sheetId = sheet?.id || crypto.randomUUID();
    const version = (sheet?.version || 0) + 1;
    
    // Crear nueva versión del sheet si no existe
    if (!sheet) {
      await this.db.prepare(`
        INSERT INTO character_sheets (id, identity_id, nombre, tipo, estado, version)
        VALUES (?, ?, 'Character Sheet Master', 'avatar', 'master_complete', 1)
      `).bind(sheetId, params.identity_id).run();
    }
    
    // Guardar cada asset
    for (const asset of params.assets) {
      await this.db.prepare(`
        INSERT INTO character_master_assets 
          (id, identity_id, character_sheet_version, asset_category,
           r2_key, model_used, pipeline, quality_score, face_match_score, 
           credits_used, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `).bind(
        crypto.randomUUID(),
        params.identity_id,
        version,
        asset.category,
        asset.r2_key,
        asset.model_used,
        asset.pipeline,
        asset.quality_score,
        asset.face_match_score || null,
        asset.credits_used
      ).run();
    }
    
    // Actualizar metadata del sheet
    await this.db.prepare(`
      UPDATE character_sheets 
      SET master_version = ?,
          master_total_assets = ?,
          master_status = 'master_complete',
          updated_at = datetime('now')
      WHERE id = ?
    `).bind(
      version,
      params.assets.length,
      sheetId
    ).run();
    
    await this.auditLog('character_sheet_master_updated', {
      identity_id: params.identity_id,
      version,
      total_assets: params.assets.length,
      batch_id: params.batch_id,
    });
  }
  
  // ============================================================
  // AUDIT LOG
  // ============================================================
  
  async auditLog(
    evento: string,
    payload: Record<string, unknown>,
    identityId?: string,
    licenseId?: string
  ): Promise<number> {
    // Obtener último hash
    const lastEntry = await this.db.prepare(
      'SELECT hash FROM audit_log ORDER BY seq DESC LIMIT 1'
    ).first() as any;
    
    const hashPrev = lastEntry?.hash || '0'.repeat(64);
    const payloadStr = JSON.stringify(payload);
    
    // Calcular hash SHA-256
    const hash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(hashPrev + payloadStr)
    );
    const hashHex = Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // Insertar
    const result = await this.db.prepare(`
      INSERT INTO audit_log (evento, payload, identity_id, license_id, hash_prev, hash, firma)
      VALUES (?, ?, ?, ?, ?, ?, 'auto')
      RETURNING seq
    `).bind(
      evento,
      payloadStr,
      identityId || null,
      licenseId || null,
      hashPrev,
      hashHex
    ).first() as any;
    
    return result?.seq || 0;
  }
  
  // ============================================================
  // PROVIDER STATS
  // ============================================================
  
  async recordProviderUsage(
    providerId: string,
    success: boolean,
    latencyMs: number,
    creditsUsed: number
  ): Promise<void> {
    const provider = await this.db.prepare(
      'SELECT total_calls, total_failures FROM ai_providers WHERE id = ?'
    ).bind(providerId).first() as any;
    
    if (!provider) return;
    
    const newCalls = provider.total_calls + 1;
    const newFailures = provider.total_failures + (success ? 0 : 1);
    
    await this.db.prepare(`
      UPDATE ai_providers 
      SET total_calls = ?,
          total_failures = ?,
          avg_latency_ms = (avg_latency_ms * total_calls + ?) / ?,
          health_score = CASE 
            WHEN ? THEN MIN(1.0, health_score + 0.01)
            ELSE MAX(0.0, health_score - 0.05)
          END,
          updated_at = datetime('now')
      WHERE id = ?
    `).bind(
      newCalls,
      newFailures,
      latencyMs,
      newCalls,
      success ? 1 : 0,
      providerId
    ).run();
  }
  
  // ============================================================
  // QUERIES DE CONSULTA
  // ============================================================
  
  async getIdentityBatches(identityId: string): Promise<any[]> {
    const result = await this.db.prepare(`
      SELECT * FROM pipeline_batches 
      WHERE identity_id = ?
      ORDER BY started_at DESC
    `).bind(identityId).all();
    
    return result.results || [];
  }
  
  async getCharacterSheetMaster(identityId: string): Promise<any> {
    const sheet = await this.db.prepare(`
      SELECT * FROM character_sheets 
      WHERE identity_id = ? AND master_status = 'master_complete'
      ORDER BY master_version DESC LIMIT 1
    `).bind(identityId).first() as any;
    
    if (!sheet) return null;
    
    const assets = await this.db.prepare(`
      SELECT * FROM character_master_assets 
      WHERE identity_id = ? AND character_sheet_version = ?
      ORDER BY asset_category, created_at
    `).bind(identityId, sheet.master_version).all();
    
    return {
      ...sheet,
      assets: assets.results || [],
    };
  }
  
  async getAuditLogForIdentity(identityId: string, limit = 50): Promise<any[]> {
    const result = await this.db.prepare(`
      SELECT * FROM audit_log 
      WHERE identity_id = ?
      ORDER BY seq DESC
      LIMIT ?
    `).bind(identityId, limit).all();
    
    return result.results || [];
  }
}

// ============================================================
// HELPER: Crear instancia
// ============================================================

export function createDBManager(db: D1Database): DBManager {
  return new DBManager(db);
}
