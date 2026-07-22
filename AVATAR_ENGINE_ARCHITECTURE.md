# UMAIN Avatar Engine - Arquitectura Híbrida
## Task Queue + Smart Router + Quality Gate

> **Versión:** 1.0.0  
> **Fecha:** Julio 2026  
> **Estado:** Implementado

---

## Resumen

El Avatar Engine es el corazón de UMAIN para la generación de avatares digitales. Implementa una **arquitectura híbrida** que combina:

1. **Task Queue** (D1) - Persistencia y escalabilidad
2. **Smart Router** - Selección inteligente de proveedores
3. **Quality Gate** - Validación post-generación
4. **DB Manager** - Persistencia + AuditLog
5. **Orchestrator** - Coordina todo el flujo

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                    AVATAR ORCHESTRATOR                           │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Smart Router │  │ Quality Gate │  │  DB Manager  │          │
│  │              │  │              │  │              │          │
│  │ • Routing    │  │ • Face Match │  │ • Tasks      │          │
│  │ • Fallback   │  │ • Quality    │  │ • Batches    │          │
│  │ • Health     │  │ • Adherence  │  │ • AuditLog   │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                 │                   │
│         └─────────────────┼─────────────────┘                   │
│                           │                                     │
│                           ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    TASK QUEUE (D1)                       │    │
│  │                                                         │    │
│  │  Pipeline A    Pipeline B    Pipeline C                 │    │
│  │  (Identity)    (Creative)    (Correction)               │    │
│  │      │              │              │                    │    │
│  │      ▼              ▼              ▼                    │    │
│  │  ┌────────┐   ┌────────┐   ┌────────┐                  │    │
│  │  │Soul ID │   │GPT     │   │Seedream│                  │    │
│  │  │Element │   │Nano    │   │V5 Pro  │                  │    │
│  │  │Voice   │   │Flux    │   │        │                  │    │
│  │  └────────┘   └────────┘   └────────┘                  │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
      ┌──────────┐   ┌──────────┐   ┌──────────┐
      │Higgsfield│   │ FAL.ai   │   │  Kling   │
      │(Primary) │   │(Fallback)│   │(Fallback)│
      └──────────┘   └──────────┘   └──────────┘
```

---

## Componentes

### 1. Smart Router (`smart-router.ts`)

**Responsabilidad:** Seleccionar el proveedor y modelo óptimo para cada tarea.

**Características:**
- Routing basado en reglas (no agente)
- Health check de proveedores
- Cache de salud (5 min TTL)
- Scoring compuesto: prioridad + salud + éxito histórico
- Fallback automático

**Ejemplo de uso:**
```typescript
const router = createSmartRouter(db);

const selection = await router.selectProvider({
  task_type: 'image_gen',
  requirements: {
    needs_references: true,
    quality_level: 'high'
  }
});

// Resultado:
// {
//   provider_id: 'higgsfield',
//   model_id: 'gpt_image_2',
//   fallback_provider_id: 'fal_ai',
//   estimated_credits: 3,
//   reason: 'Higgsfield (gpt_image_2) | Prioridad: 1 | Salud: 95%'
// }
```

---

### 2. Quality Gate (`quality-gate.ts`)

**Responsabilidad:** Validar calidad de outputs post-generación.

**Checks:**
1. **Face Match Score** (vs Soul ID) - ≥0.85 PASS
2. **Visual Quality Score** - ≥0.80 PASS
3. **Reference Adherence** - ≥0.75 PASS

**Algoritmo Adaptativo (Pipeline C):**
```
Face Score  → Correction Strength
≥ 0.90      → SKIP (ahorra créditos)
0.85-0.89   → 0.70 (ligero)
0.80-0.84   → 0.80 (medio)
0.75-0.79   → 0.85 (fuerte)
< 0.75      → 0.90 (máximo)
```

**Ejemplo:**
```typescript
const gate = createQualityGate(db);

const result = await gate.check({
  task_id: 'task-001',
  output_url: 'https://r2.umain.io/outputs/img.jpg',
  output_type: 'image',
  soul_id_ref: 'soul-abc123',
  pipeline: 'B',
  model_used: 'gpt_image_2'
});

// result.decision: 'pass' | 'review' | 'fail' | 'regenerate'
// result.correction_needed: true
// result.correction_strength: 0.80
```

---

### 3. DB Manager (`db-manager.ts`)

**Responsabilidad:** Persistencia de datos + AuditLog.

**Funciones principales:**
- `createBatch()` - Crear batch de generación
- `createTask()` - Crear tarea en cola
- `updateTaskStatus()` - Actualizar estado
- `saveOutput()` - Guardar output en R2
- `saveToCharacterSheetMaster()` - Consolidar assets
- `auditLog()` - Registrar en AuditLog (hash chain)

**Ejemplo:**
```typescript
const db = createDBManager(d1);

const batchId = await db.createBatch({
  identity_id: 'manu-jantus',
  max_credits: 200,
  priority: 'normal'
});

const taskId = await db.createTask({
  batch_id: batchId,
  task_type: 'image_gen',
  pipeline: 'B',
  provider_id: 'higgsfield',
  model_id: 'gpt_image_2',
  params: { prompt: "...", references: {...} }
});
```

---

### 4. Orchestrator (`orchestrator.ts`)

**Responsabilidad:** Coordinar todo el flujo de generación.

**Flujo:**
```
1. Crear batch
2. Pipeline A (secuencial):
   - Soul ID Training (~40 créd)
   - Character Element (para video)
   - Voice Clone (opcional)
3. Pipeline B (paralelo, 5 concurrentes):
   - Smart Router selecciona proveedor
   - Genera imágenes con referencias
   - Quality Gate valida cada output
   - Reintenta con fallback si falla
4. Pipeline C (adaptativo):
   - Mide face match inicial
   - Si < 0.90 → corrección con Seedream V5 Pro
   - Si ≥ 0.90 → SKIP (ahorra créditos)
5. Consolidar en Character Sheet Master
6. Registrar en AuditLog
```

**Ejemplo:**
```typescript
const orchestrator = createAvatarOrchestrator(db);

const result = await orchestrator.generateAvatar({
  identity_id: 'manu-jantus',
  photos: [...25 fotos...],
  videos: [...3 videos...],
  audio: [...5 min audio...],
  references: {
    outfits: [
      { id: 'outfit-1', url: '...', prompt: 'navy business suit' },
      { id: 'outfit-2', url: '...', prompt: 'casual jeans + blazer' }
    ],
    environments: [
      { id: 'env-1', url: '...', prompt: 'modern office' },
      { id: 'env-2', url: '...', prompt: 'boutique cafe' }
    ]
  },
  config: {
    quality_threshold: 0.85,
    max_credits: 200,
    auto_correct: true
  }
});

// result.status: 'completed' | 'failed' | 'partial'
// result.soul_id: 'soul-abc123'
// result.total_credits: 156
// result.character_sheet.total_assets: 12
```

---

## Base de Datos

### Nuevas Tablas

| Tabla | Propósito |
|-------|-----------|
| `ai_providers` | Registro de proveedores (Higgsfield, FAL.ai, etc.) |
| `model_routing` | Reglas de routing por tarea |
| `task_queue` | Cola de tareas pendientes |
| `quality_results` | Resultados de Quality Gate |
| `provider_health_log` | Log de health checks |

### Seed Data

- **5 proveedores:** Higgsfield, FAL.ai, Kling, ElevenLabs, Flux
- **9 reglas de routing:** Para cada tipo de tarea

---

## Multi-Provider Support

| Proveedor | Modelos | Tareas | Prioridad |
|-----------|---------|--------|-----------|
| **Higgsfield** | Soul ID, GPT Image 2, Nano Banana, Seedream, Seedance | Todas | 1 (Primary) |
| **FAL.ai** | Flux Pro, SDXL | image_gen, video_gen | 2 |
| **Kling** | Kling 1.5, 2.0, 3.0 | video_gen | 3 |
| **ElevenLabs** | Multilingual v2 | voice_clone, tts | 2 |
| **Flux (BFL)** | Flux 1.1 Pro, Kontext | image_gen | 3 |

---

## Costos Estimados

| Tarea | Proveedor Primary | Costo |
|-------|------------------|-------|
| Soul ID Training | Higgsfield | ~40 créd |
| Image Gen (con ref) | Higgsfield (GPT Image 2) | ~3 créd |
| Image Gen (batch) | Higgsfield (Nano Banana) | ~2 créd |
| Face Correction | Higgsfield (Seedream) | ~3 créd |
| Video Gen | Higgsfield (Seedance) | ~8 créd |
| Voice Clone | Higgsfield (Seed Audio) | ~8 créd |

**Total por Avatar (25 assets):** ~140-190 créditos

---

## Archivos Implementados

```
app/src/lib/avatar-engine/
├── index.ts              ← Exportaciones
├── smart-router.ts       ← Selección de proveedores
├── quality-gate.ts       ← Validación post-generación
├── db-manager.ts         ← Persistencia + AuditLog
└── orchestrator.ts       ← Orquestación principal

app/migrations/
└── 0007_avatar_engine.sql ← Schema + Seed data
```

---

## Próximos Pasos

- [ ] Conectar Smart Router con APIs reales de proveedores
- [ ] Implementar health checks contra APIs
- [ ] Integrar con Higgsfield API para generación real
- [ ] Implementar face comparison real (no simulado)
- [ ] Crear UI para monitoreo de batches
- [ ] Dashboard de proveedores (uso, costos, salud)
- [ ] Admin: Configuración de proveedores desde UI
- [ ] Admin: Entrenamiento real de avatares

---

*Documento generado: Julio 2026*
