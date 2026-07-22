// UMAIN Avatar Engine
// Arquitectura Híbrida: Task Queue + Smart Router + Quality Gate

export { SmartRouter, createSmartRouter } from './smart-router';
export { QualityGate, createQualityGate } from './quality-gate';
export { DBManager, createDBManager } from './db-manager';
export { AvatarOrchestrator, createAvatarOrchestrator } from './orchestrator';

// Types
export type { 
  TaskRequest, 
  TaskType, 
  ProviderSelection, 
  ProviderHealth 
} from './smart-router';

export type { 
  QualityCheckRequest, 
  QualityCheckResult, 
  QualityThresholds 
} from './quality-gate';

export type { 
  AvatarBatchConfig, 
  TaskResult, 
  BatchProgress 
} from './db-manager';

export type { 
  AvatarGenerationRequest, 
  AvatarGenerationResult 
} from './orchestrator';
