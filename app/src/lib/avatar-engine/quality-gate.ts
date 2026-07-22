// UMAIN Avatar Engine - Quality Gate
// Validación post-generación para asegurar calidad

import type { D1Database } from "@cloudflare/workers-types";

// ============================================================
// TYPES
// ============================================================

export interface QualityCheckRequest {
  task_id: string;
  output_url: string;
  output_type: 'image' | 'video' | 'audio';
  
  // Referencias para comparación
  soul_id_ref?: string; // Referencia del Soul ID para face match
  outfit_ref?: string;  // Referencia del outfit para adherence
  environment_ref?: string;
  
  // Contexto
  pipeline: 'A' | 'B' | 'C';
  model_used: string;
}

export interface QualityCheckResult {
  task_id: string;
  
  // Scores
  face_match_score?: number;      // 0.0 - 1.0
  visual_quality_score: number;   // 0.0 - 1.0
  reference_adherence_score?: number; // 0.0 - 1.0
  overall_score: number;          // Weighted average
  
  // Decisión
  decision: 'pass' | 'review' | 'fail' | 'regenerate';
  
  // Detalles
  details: {
    checks_passed: string[];
    checks_failed: string[];
    warnings: string[];
    suggestions: string[];
  };
  
  // Para Pipeline C (corrección adaptativa)
  correction_needed: boolean;
  correction_strength?: number; // 0.0 - 1.0
  initial_face_score?: number;
}

export interface QualityThresholds {
  face_match: {
    pass: number;     // >= 0.85
    review: number;   // 0.70 - 0.84
    // < 0.70 = fail
  };
  visual_quality: {
    pass: number;     // >= 0.80
    review: number;   // 0.65 - 0.79
  };
  reference_adherence: {
    pass: number;     // >= 0.75
    review: number;   // 0.60 - 0.74
  };
}

// Thresholds por defecto
const DEFAULT_THRESHOLDS: QualityThresholds = {
  face_match: { pass: 0.85, review: 0.70 },
  visual_quality: { pass: 0.80, review: 0.65 },
  reference_adherence: { pass: 0.75, review: 0.60 },
};

// ============================================================
// QUALITY GATE CLASS
// ============================================================

export class QualityGate {
  private db: D1Database;
  private thresholds: QualityThresholds;
  private faceComparator?: FaceComparator;
  
  constructor(db: D1Database, thresholds?: Partial<QualityThresholds>) {
    this.db = db;
    this.thresholds = { ...DEFAULT_THRESHOLDS, ...thresholds };
    this.faceComparator = new FaceComparator();
  }
  
  // ============================================================
  // CHECK PRINCIPAL
  // ============================================================
  
  async check(request: QualityCheckRequest): Promise<QualityCheckResult> {
    const checks_passed: string[] = [];
    const checks_failed: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
    
    let face_match_score: number | undefined;
    let visual_quality_score: number;
    let reference_adherence_score: number | undefined;
    
    // ─────────────────────────────────────────────────
    // CHECK 1: Face Match (si hay Soul ID reference)
    // ─────────────────────────────────────────────────
    if (request.soul_id_ref) {
      try {
        face_match_score = await this.checkFaceMatch(
          request.output_url,
          request.soul_id_ref
        );
        
        if (face_match_score >= this.thresholds.face_match.pass) {
          checks_passed.push(`Face match: ${this.formatScore(face_match_score)} ✓`);
        } else if (face_match_score >= this.thresholds.face_match.review) {
          checks_failed.push(`Face match bajo: ${this.formatScore(face_match_score)}`);
          warnings.push('Requiere corrección facial (Pipeline C)');
        } else {
          checks_failed.push(`Face match muy bajo: ${this.formatScore(face_match_score)}`);
          suggestions.push('Regenerar desde Pipeline B');
        }
      } catch (error) {
        warnings.push(`No se pudo verificar face match: ${error}`);
        face_match_score = undefined;
      }
    } else {
      warnings.push('Sin Soul ID reference - face match no verificado');
    }
    
    // ─────────────────────────────────────────────────
    // CHECK 2: Visual Quality
    // ─────────────────────────────────────────────────
    visual_quality_score = await this.checkVisualQuality(
      request.output_url,
      request.output_type
    );
    
    if (visual_quality_score >= this.thresholds.visual_quality.pass) {
      checks_passed.push(`Calidad visual: ${this.formatScore(visual_quality_score)} ✓`);
    } else if (visual_quality_score >= this.thresholds.visual_quality.review) {
      checks_failed.push(`Calidad visual baja: ${this.formatScore(visual_quality_score)}`);
    } else {
      checks_failed.push(`Calidad visual muy baja: ${this.formatScore(visual_quality_score)}`);
      suggestions.push('Regenerar con configuración de mayor calidad');
    }
    
    // ─────────────────────────────────────────────────
    // CHECK 3: Reference Adherence (Pipeline B)
    // ─────────────────────────────────────────────────
    if (request.pipeline === 'B' && (request.outfit_ref || request.environment_ref)) {
      reference_adherence_score = await this.checkReferenceAdherence(
        request.output_url,
        {
          outfit: request.outfit_ref,
          environment: request.environment_ref,
        }
      );
      
      if (reference_adherence_score >= this.thresholds.reference_adherence.pass) {
        checks_passed.push(`Adherencia a referencias: ${this.formatScore(reference_adherence_score)} ✓`);
      } else if (reference_adherence_score >= this.thresholds.reference_adherence.review) {
        checks_failed.push(`Adherencia baja: ${this.formatScore(reference_adherence_score)}`);
      } else {
        checks_failed.push(`Adherencia muy baja: ${this.formatScore(reference_adherence_score)}`);
        suggestions.push('Verificar referencias y regenerar');
      }
    }
    
    // ─────────────────────────────────────────────────
    // CALCULAR SCORE GENERAL
    // ─────────────────────────────────────────────────
    const scores: number[] = [visual_quality_score];
    const weights: number[] = [0.4];
    
    if (face_match_score !== undefined) {
      scores.push(face_match_score);
      weights.push(0.4);
    }
    
    if (reference_adherence_score !== undefined) {
      scores.push(reference_adherence_score);
      weights.push(0.2);
    }
    
    const overall_score = scores.reduce((sum, score, i) => sum + score * weights[i], 0) /
                          weights.reduce((sum, w) => sum + w, 0);
    
    // ─────────────────────────────────────────────────
    // DECISIÓN
    // ─────────────────────────────────────────────────
    let decision: QualityCheckResult['decision'];
    
    if (checks_failed.length === 0) {
      decision = 'pass';
    } else if (overall_score >= 0.75) {
      decision = 'review'; // Necesita revisión manual
    } else if (face_match_score !== undefined && face_match_score < 0.70) {
      decision = 'regenerate'; // Re-generar desde Pipeline B
    } else {
      decision = 'fail';
    }
    
    // ─────────────────────────────────────────────────
    // PIPELINE C: Corrección Adaptativa
    // ─────────────────────────────────────────────────
    let correction_needed = false;
    let correction_strength: number | undefined;
    
    if (request.pipeline === 'B' && face_match_score !== undefined) {
      if (face_match_score < 0.90) {
        correction_needed = true;
        correction_strength = this.calculateCorrectionStrength(face_match_score);
        suggestions.push(`Aplicar Pipeline C con strength ${correction_strength}`);
      }
    }
    
    // ─────────────────────────────────────────────────
    // REGISTRAR EN DB
    // ─────────────────────────────────────────────────
    const result: QualityCheckResult = {
      task_id: request.task_id,
      face_match_score,
      visual_quality_score,
      reference_adherence_score,
      overall_score,
      decision,
      details: {
        checks_passed,
        checks_failed,
        warnings,
        suggestions,
      },
      correction_needed,
      correction_strength,
      initial_face_score: face_match_score,
    };
    
    await this.saveResult(result);
    
    return result;
  }
  
  // ============================================================
  // CHECKS INDIVIDUALES
  // ============================================================
  
  private async checkFaceMatch(
    outputUrl: string, 
    soulIdRef: string
  ): Promise<number> {
    if (!this.faceComparator) {
      // Fallback: usar score simulado para testing
      return 0.82;
    }
    
    return this.faceComparator.compare(outputUrl, soulIdRef);
  }
  
  private async checkVisualQuality(
    outputUrl: string,
    outputType: string
  ): Promise<number> {
    // TODO: Implementar con modelo de análisis de calidad
    // Por ahora, heurísticas básicas
    
    // Verificar que la URL es accesible
    try {
      const response = await fetch(outputUrl, { method: 'HEAD' });
      if (!response.ok) return 0.3;
    } catch {
      return 0.0;
    }
    
    // Score base (será reemplazado por análisis real)
    return 0.85;
  }
  
  private async checkReferenceAdherence(
    outputUrl: string,
    references: { outfit?: string; environment?: string }
  ): Promise<number> {
    // TODO: Implementar con CLIP o similar
    // Por ahora, score base
    return 0.80;
  }
  
  // ============================================================
  // CORRECCIÓN ADAPTATIVA
  // ============================================================
  
  calculateCorrectionStrength(faceScore: number): number {
    // Algoritmo adaptativo (documentado en Triple Pipeline v2.1.0)
    if (faceScore >= 0.90) return 0; // Skip
    if (faceScore >= 0.85) return 0.70; // Ligero
    if (faceScore >= 0.80) return 0.80; // Medio
    if (faceScore >= 0.75) return 0.85; // Fuerte
    return 0.90; // Máximo
  }
  
  // ============================================================
  // PERSISTENCIA
  // ============================================================
  
  private async saveResult(result: QualityCheckResult): Promise<void> {
    await this.db.prepare(`
      INSERT INTO quality_results 
        (id, task_id, face_match_score, visual_quality_score, 
         reference_adherence_score, overall_score, decision, details, checked_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(
      crypto.randomUUID(),
      result.task_id,
      result.face_match_score ?? null,
      result.visual_quality_score,
      result.reference_adherence_score ?? null,
      result.overall_score,
      result.decision,
      JSON.stringify(result.details)
    ).run();
  }
  
  // ============================================================
  // HELPERS
  // ============================================================
  
  private formatScore(score: number): string {
    return `${Math.round(score * 100)}%`;
  }
}

// ============================================================
// FACE COMPARATOR (Placeholder - reemplazar con API real)
// ============================================================

class FaceComparator {
  async compare(imageUrl: string, referenceUrl: string): Promise<number> {
    // TODO: Implementar con:
    // - Higgsfield face comparison API
    // - FAL.ai face analysis
    // - Modelo local (InsightFace, etc.)
    
    // Placeholder: retornar score simulado
    return 0.82 + Math.random() * 0.15; // 0.82 - 0.97
  }
}

// ============================================================
// HELPER: Crear instancia
// ============================================================

export function createQualityGate(
  db: D1Database, 
  thresholds?: Partial<QualityThresholds>
): QualityGate {
  return new QualityGate(db, thresholds);
}
