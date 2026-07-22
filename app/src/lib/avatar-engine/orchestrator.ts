// UMAIN Avatar Engine - Orchestrator
// Integra Smart Router + Quality Gate + DB Manager

import type { D1Database } from "@cloudflare/workers-types";
import { SmartRouter, createSmartRouter } from "./smart-router";
import { QualityGate, createQualityGate } from "./quality-gate";
import { DBManager, createDBManager } from "./db-manager";

// ============================================================
// TYPES
// ============================================================

export interface AvatarGenerationRequest {
  identity_id: string;
  
  // Photos for Soul ID training
  photos: {
    url: string;
    tipo: 'foto';
  }[];
  
  // Videos for Character Element
  videos?: {
    url: string;
    tipo: 'video';
  }[];
  
  // Audio for Voice Clone
  audio?: {
    url: string;
    tipo: 'audio';
  }[];
  
  // References for Pipeline B
  references: {
    outfits?: { id: string; url: string; prompt: string }[];
    environments?: { id: string; url: string; prompt: string }[];
    props?: { id: string; url: string }[];
    poses?: { id: string; url: string }[];
  };
  
  // Configuration
  config?: {
    quality_threshold?: number;
    max_credits?: number;
    priority?: 'low' | 'normal' | 'high';
    auto_correct?: boolean;
    skip_voice?: boolean;
  };
}

export interface AvatarGenerationResult {
  batch_id: string;
  status: 'completed' | 'failed' | 'partial';
  
  // Outputs
  soul_id?: string;
  element_id?: string;
  voice_id?: string;
  
  // Character Sheet Master
  character_sheet?: {
    version: number;
    total_assets: number;
    r2_path: string;
  };
  
  // Stats
  total_tasks: number;
  completed_tasks: number;
  failed_tasks: number;
  total_credits: number;
  total_time_ms: number;
  
  // Errors
  errors: string[];
}

// ============================================================
// ORCHESTRATOR CLASS
// ============================================================

export class AvatarOrchestrator {
  private router: SmartRouter;
  private qualityGate: QualityGate;
  private dbManager: DBManager;
  private db: D1Database;
  
  constructor(db: D1Database) {
    this.db = db;
    this.router = createSmartRouter(db);
    this.qualityGate = createQualityGate(db);
    this.dbManager = createDBManager(db);
  }
  
  // ============================================================
  // GENERAR AVATAR COMPLETO
  // ============================================================
  
  async generateAvatar(
    request: AvatarGenerationRequest
  ): Promise<AvatarGenerationResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    
    // ─────────────────────────────────────────────────
    // STEP 1: Crear batch
    // ─────────────────────────────────────────────────
    const batchId = await this.dbManager.createBatch({
      identity_id: request.identity_id,
      quality_threshold: request.config?.quality_threshold || 0.85,
      max_credits: request.config?.max_credits || 200,
      priority: request.config?.priority || 'normal',
      auto_correct: request.config?.auto_correct !== false,
      references: {
        outfits: request.references.outfits?.map(o => o.id) || [],
        environments: request.references.environments?.map(e => e.id) || [],
        props: request.references.props?.map(p => p.id) || [],
      },
    });
    
    console.log(`[ORCHESTRATOR] Batch ${batchId} creado para ${request.identity_id}`);
    
    // ─────────────────────────────────────────────────
    // STEP 2: Pipeline A - Identity Training
    // ─────────────────────────────────────────────────
    let soulId: string | undefined;
    let elementId: string | undefined;
    let voiceId: string | undefined;
    
    try {
      // 2a. Soul ID Training
      const soulIdTask = await this.dbManager.createTask({
        batch_id: batchId,
        task_type: 'soul_id_train',
        pipeline: 'A',
        params: {
          photos: request.photos,
          identity_name: request.identity_id,
        },
        priority: 1,
        depends_on: [],
      });
      
      // Ejecutar inmediatamente (Pipeline A es secuencial)
      const soulIdResult = await this.executeSoulIdTraining(soulIdTask, request);
      
      if (soulIdResult.success) {
        soulId = soulIdResult.output_url; // El reference_id
        await this.dbManager.updateTaskStatus(soulIdTask, 'completed', soulIdResult);
      } else {
        throw new Error(`Soul ID training failed: ${(soulIdResult as any).error || 'unknown 	error'}`);
      }
      
      // 2b. Character Element (para video)
      if (request.videos && request.videos.length > 0) {
        const elementTask = await this.dbManager.createTask({
          batch_id: batchId,
          task_type: 'element_register',
          pipeline: 'A',
          params: {
            videos: request.videos,
            soul_id: soulId,
          },
          priority: 2,
          depends_on: [soulIdTask],
        });
        
        const elementResult = await this.executeElementRegistration(elementTask, request, soulId!);
        
        if (elementResult.success) {
          elementId = elementResult.output_url;
          await this.dbManager.updateTaskStatus(elementTask, 'completed', elementResult);
        }
      }
      
      // 2c. Voice Clone (opcional)
      if (request.audio && request.audio.length > 0 && !request.config?.skip_voice) {
        const voiceTask = await this.dbManager.createTask({
          batch_id: batchId,
          task_type: 'voice_clone',
          pipeline: 'A',
          params: {
            audio: request.audio,
          },
          priority: 2,
          depends_on: [soulIdTask],
        });
        
        const voiceResult = await this.executeVoiceClone(voiceTask, request);
        
        if (voiceResult.success) {
          voiceId = voiceResult.output_url;
          await this.dbManager.updateTaskStatus(voiceTask, 'completed', voiceResult);
        }
      }
      
    } catch (error: any) {
      errors.push(`Pipeline A failed: ${error.message}`);
      await this.dbManager.updateBatchStatus(batchId, 'failed', { failed: 1 });
      return this.buildResult(batchId, errors, startTime);
    }
    
    // ─────────────────────────────────────────────────
    // STEP 3: Pipeline B - Creative Generation (PARALELO)
    // ─────────────────────────────────────────────────
    const pipelineBTasks: string[] = [];
    
    // Crear tasks para cada combinación outfit × environment
    for (const outfit of request.references.outfits || []) {
      for (const env of request.references.environments || []) {
        const task = await this.dbManager.createTask({
          batch_id: batchId,
          task_type: 'image_gen',
          pipeline: 'B',
          params: {
            character_ref: soulId,
            outfit_ref: outfit.id,
            outfit_url: outfit.url,
            environment_ref: env.id,
            environment_url: env.url,
            prompt: `${outfit.prompt} ${env.prompt}`,
          },
          priority: 5,
          depends_on: [], // Pipeline A completado
        });
        
        pipelineBTasks.push(task);
      }
    }
    
    // Ejecutar Pipeline B en paralelo (5 concurrentes)
    console.log(`[ORCHESTRATOR] Pipeline B: ${pipelineBTasks.length} tasks`);
    
    const pipelineBResults = await this.executeParallel(
      pipelineBTasks,
      5, // concurrency
      async (taskId) => {
        const task = await this.dbManager.getTask(taskId) as any;
        const selection = await this.router.selectProvider({
          task_type: 'image_gen',
          identity_id: request.identity_id,
          batch_id: batchId,
          requirements: {
            needs_references: true,
            quality_level: 'high',
          },
          params: JSON.parse(task.params),
        });
        
        // Ejecutar generación
        const result = await this.executeImageGeneration(taskId, task, selection);
        
        // Quality Gate
        const qualityResult = await this.qualityGate.check({
          task_id: taskId,
          output_url: result.output_url!,
          output_type: 'image',
          soul_id_ref: soulId,
          pipeline: 'B',
          model_used: selection.model_id,
        });
        
        if (qualityResult.decision === 'fail') {
          // Re-intentar con otro proveedor
          return await this.retryWithFallback(taskId, task, selection);
        }
        
        return result;
      }
    );
    
    // ─────────────────────────────────────────────────
    // STEP 4: Pipeline C - Face Correction (ADAPTATIVO)
    // ─────────────────────────────────────────────────
    const pipelineCTasks: string[] = [];
    
    for (const bResult of pipelineBResults) {
      if (bResult.success && bResult.output_url) {
        // Medir face match inicial
        const faceScore = await this.measureFaceMatch(bResult.output_url, soulId!);
        
        if (faceScore < 0.90) {
          // Necesita corrección
          const task = await this.dbManager.createTask({
            batch_id: batchId,
            task_type: 'face_correction',
            pipeline: 'C',
            params: {
              source_url: bResult.output_url,
              soul_id_ref: soulId,
              initial_score: faceScore,
            },
            priority: 3,
            depends_on: [],
          });
          
          pipelineCTasks.push(task);
        } else {
          // Face match >= 0.90, skip Pipeline C
          await this.dbManager.updateTaskStatus(
            bResult.task_id, 
            'skipped',
            { ...bResult, metadata: { skip_reason: 'face_match_excellent', score: faceScore } }
          );
        }
      }
    }
    
    // Ejecutar Pipeline C en paralelo
    if (pipelineCTasks.length > 0) {
      console.log(`[ORCHESTRATOR] Pipeline C: ${pipelineCTasks.length} corrections needed`);
      
      await this.executeParallel(
        pipelineCTasks,
        5,
        async (taskId) => {
          const task = await this.dbManager.getTask(taskId) as any;
          const params = JSON.parse(task.params);
          
          // Calcular strength adaptativo
          const strength = this.qualityGate.calculateCorrectionStrength(params.initial_score);
          
          const selection = await this.router.selectForFaceCorrection(params.initial_score);
          
          return await this.executeFaceCorrection(taskId, task, selection, strength);
        }
      );
    }
    
    // ─────────────────────────────────────────────────
    // STEP 5: Consolidar en Character Sheet Master
    // ─────────────────────────────────────────────────
    const allTasks = await this.dbManager.getTasksByBatch(batchId);
    const completedTasks = allTasks.filter(t => t.status === 'completed');
    
    const masterAssets = completedTasks
      .filter(t => t.result && JSON.parse(t.result).output_url)
      .map(t => {
        const result = JSON.parse(t.result);
        return {
          category: this.inferCategory(t.task_type, t.pipeline),
          r2_key: result.output_url,
          model_used: result.model_used || 'unknown',
          pipeline: t.pipeline,
          quality_score: result.quality_score || 0.85,
          face_match_score: result.face_match_score,
          credits_used: result.credits_used || 0,
        };
      });
    
    if (masterAssets.length > 0) {
      await this.dbManager.saveToCharacterSheetMaster({
        identity_id: request.identity_id,
        batch_id: batchId,
        assets: masterAssets,
      });
    }
    
    // ─────────────────────────────────────────────────
    // STEP 6: Finalizar batch
    // ─────────────────────────────────────────────────
    const totalCredits = completedTasks.reduce((sum, t) => {
      const result = t.result ? JSON.parse(t.result) : {};
      return sum + (result.credits_used || 0);
    }, 0);
    
    const finalStatus = errors.length === 0 ? 'completed' : 'partial';
    
    await this.dbManager.updateBatchStatus(batchId, finalStatus, {
      completed: completedTasks.length,
      failed: allTasks.filter(t => t.status === 'failed').length,
      total_credits: totalCredits,
    });
    
    return {
      batch_id: batchId,
      status: finalStatus,
      soul_id: soulId,
      element_id: elementId,
      voice_id: voiceId,
      character_sheet: {
        version: 1,
        total_assets: masterAssets.length,
        r2_path: `character_sheet_master/${request.identity_id}/`,
      },
      total_tasks: allTasks.length,
      completed_tasks: completedTasks.length,
      failed_tasks: allTasks.filter(t => t.status === 'failed').length,
      total_credits: totalCredits,
      total_time_ms: Date.now() - startTime,
      errors,
    };
  }
  
  // ============================================================
  // EJECUCIÓN DE TAREAS INDIVIDUALES
  // ============================================================
  
  private async executeSoulIdTraining(taskId: string, request: AvatarGenerationRequest) {
    // TODO: Conectar con API real de Higgsfield
    console.log(`[TASK ${taskId}] Soul ID Training iniciado`);
    
    // Simular entrenamiento
    await this.delay(5000);
    
    return {
      success: true,
      task_id: taskId,
      output_url: `soul-${Date.now()}`, // reference_id
      model_used: 'soul_id',
      provider_id: 'higgsfield',
      credits_used: 40,
      time_ms: 5000,
    };
  }
  
  private async executeElementRegistration(taskId: string, request: AvatarGenerationRequest, soulId: string) {
    console.log(`[TASK ${taskId}] Element Registration iniciado`);
    
    await this.delay(2000);
    
    return {
      success: true,
      task_id: taskId,
      output_url: `elem-${Date.now()}`,
      model_used: 'element',
      provider_id: 'higgsfield',
      credits_used: 5,
      time_ms: 2000,
    };
  }
  
  private async executeVoiceClone(taskId: string, request: AvatarGenerationRequest) {
    console.log(`[TASK ${taskId}] Voice Clone iniciado`);
    
    await this.delay(3000);
    
    return {
      success: true,
      task_id: taskId,
      output_url: `voice-${Date.now()}`,
      model_used: 'seed_audio',
      provider_id: 'higgsfield',
      credits_used: 8,
      time_ms: 3000,
    };
  }
  
  private async executeImageGeneration(taskId: string, task: any, selection: any) {
    console.log(`[TASK ${taskId}] Image Generation: ${selection.provider_id}/${selection.model_id}`);
    
    await this.delay(4000);
    
    return {
      success: true,
      task_id: taskId,
      output_url: `https://r2.umain.io/outputs/${taskId}.jpg`,
      output_type: 'image' as const,
      model_used: selection.model_id,
      provider_id: selection.provider_id,
      credits_used: selection.estimated_credits,
      time_ms: 4000,
    };
  }
  
  private async executeFaceCorrection(taskId: string, task: any, selection: any, strength: number) {
    console.log(`[TASK ${taskId}] Face Correction: strength=${strength}`);
    
    await this.delay(3000);
    
    return {
      success: true,
      task_id: taskId,
      output_url: `https://r2.umain.io/outputs/${taskId}-corrected.jpg`,
      output_type: 'image' as const,
      model_used: selection.model_id,
      provider_id: selection.provider_id,
      credits_used: selection.estimated_credits,
      time_ms: 3000,
      metadata: { correction_strength: strength },
    };
  }
  
  // ============================================================
  // UTILIDADES
  // ============================================================
  
  private async executeParallel(
    taskIds: string[],
    concurrency: number,
    executor: (taskId: string) => Promise<any>
  ): Promise<any[]> {
    const results: any[] = [];
    
    for (let i = 0; i < taskIds.length; i += concurrency) {
      const batch = taskIds.slice(i, i + concurrency);
      const batchResults = await Promise.all(
        batch.map(id => executor(id).catch(err => ({
          success: false,
          task_id: id,
          error: err.message,
        })))
      );
      results.push(...batchResults);
    }
    
    return results;
  }
  
  private async retryWithFallback(taskId: string, task: any, originalSelection: any) {
    // Intentar con fallback
    if (originalSelection.fallback_provider_id) {
      console.log(`[TASK ${taskId}] Retrying with fallback: ${originalSelection.fallback_provider_id}`);
      
      const fallbackSelection = {
        ...originalSelection,
        provider_id: originalSelection.fallback_provider_id,
        model_id: originalSelection.fallback_model_id,
      };
      
      return await this.executeImageGeneration(taskId, task, fallbackSelection);
    }
    
    return { success: false, task_id: taskId, error: 'No fallback available' };
  }
  
  private async measureFaceMatch(imageUrl: string, soulIdRef: string): Promise<number> {
    // TODO: Implementar con API real
    // Por ahora, simular
    return 0.82 + Math.random() * 0.15; // 0.82 - 0.97
  }
  
  private inferCategory(taskType: string, pipeline: string): string {
    const mapping: Record<string, string> = {
      'soul_id_train': 'identity',
      'element_register': 'identity',
      'voice_clone': 'identity',
      'image_gen': 'outfit',
      'face_correction': 'outfit',
      'video_gen': 'video',
    };
    return mapping[taskType] || 'other';
  }
  
  private buildResult(batchId: string, errors: string[], startTime: number): AvatarGenerationResult {
    return {
      batch_id: batchId,
      status: 'failed',
      total_tasks: 0,
      completed_tasks: 0,
      failed_tasks: 0,
      total_credits: 0,
      total_time_ms: Date.now() - startTime,
      errors,
    };
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ============================================================
// HELPER: Crear instancia
// ============================================================

export function createAvatarOrchestrator(db: D1Database): AvatarOrchestrator {
  return new AvatarOrchestrator(db);
}
