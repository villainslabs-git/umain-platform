# UMAIN Platform - Project Specification

> Gestion de avatares digitales con Rights Engine + generacion via Higgsfield.
> v0.2.0 | React 19 + TanStack Start + Cloudflare D1 + Tailwind v4

---

## 1. Stack Tecnologico

| Componente | Tecnologia |
|---|---|
| Framework | React 19 + TanStack Start (SSR en Cloudflare Worker) |
| Lenguaje | TypeScript 5.8+ |
| Estilos | Tailwind v4 + CSS custom (UMAIN Design System) |
| Base de datos | Cloudflare D1 (SQLite serverless) |
| Storage | Cloudflare R2 |
| Ruteo | TanStack Router v1 (file-based en `app/src/routes/`) |
| Server Functions | `createServerFn` de `@tanstack/react-start` |
| Build | Vite 7 + bun |
| Despliegue | Cloudflare Workers (single Worker SSR) |
| Generacion | Higgsfield API via capa de abstraccion interna |

---

## 2. Estructura del Proyecto

```
umain-platform/
├── app/
│   ├── migrations/
│   │   ├── 0001_umain_schema.sql        # Schema base (11 tablas + triggers + seed)
│   │   ├── 0002_providers.sql            # Proveedores + system_settings
│   │   ├── 0003_character_sheets.sql     # Character sheets + assets + atributos
│   │   └── 0004_seed_template.sql        # Seed: Sofia Martina Rios (demo)
│   ├── src/
│   │   ├── components/
│   │   │   └── sidebar.tsx               # Nav sidebar con secciones
│   │   ├── lib/
│   │   │   ├── queries.ts                # Server functions (CRUD + DB)
│   │   │   ├── umain-types.ts            # TypeScript types + constantes (65 IAB, providers)
│   │   │   └── bindings.server.ts        # Cloudflare bindings tipadas
│   │   ├── routes/
│   │   │   ├── __root.tsx                # Root layout + error/404
│   │   │   ├── index.tsx                 # Redirige a /login
│   │   │   ├── login.tsx                 # Autenticacion
│   │   │   ├── dashboard/index.tsx       # Dashboard con stats
│   │   │   ├── identities/
│   │   │   │   ├── index.tsx             # Listado talentos
│   │   │   │   └── $id/
│   │   │   │       ├── index.tsx         # Detalle talento
│   │   │   │       ├── consent-matrix.tsx # 65 categorias IAB
│   │   │   │       └── avatar/index.tsx  # Creacion avatar + Character Sheet
│   │   │   ├── campaigns/index.tsx
│   │   │   ├── licenses/index.tsx
│   │   │   ├── jobs/index.tsx            # Jobs generacion + compuerta consentimiento
│   │   │   ├── audit-log/index.tsx       # AuditLog inmutable
│   │   │   ├── legal/index.tsx           # Biblioteca legal
│   │   │   ├── settings/index.tsx        # Configuracion APIs y proveedores
│   │   │   └── approval/$token.tsx       # Magic link aprobacion talento
│   │   ├── styles.css                    # Design system completo
│   │   ├── routeTree.gen.ts              # Arbol rutas (manual)
│   │   ├── router.tsx                    # Config router
│   │   └── server.ts                     # Entry point Worker
│   ├── app.manifest.json                 # Infra declaration
│   └── package.json
└── UMAIN_PROJECT_SPEC.md
```

---

## 3. Design System (UMAIN Custom CSS)

**Tema:** Oscuro permanente (`color-scheme: dark`). Fondo con grilla matematica 20px. Gradiente rosa suave en esquina superior derecha.

### Paleta

| Token | Hex | Uso |
|---|---|---|
| `--color-umain-bg` | `#0a0e1a` | Fondo |
| `--color-umain-surface` | `#111827` | Cards |
| `--color-umain-accent` | `#7dd4fc` | Cian pastel (primario) |
| `--color-umain-accent-secondary` | `#f4a8c8` | Rosa suave (secundario) |
| `--color-umain-text` | `#e2e8f0` | Texto |
| `--color-umain-border` | `#1e293b` | Bordes |

### Tipografia

- **Titulares:** Geist Bold, letter-spacing: -0.02em
- **Cuerpo:** Geist, system-ui, sans-serif
- **Etiquetas tecnicas:** Geist Mono, monospace (`.formula-text`)

### Componentes CSS

`.wireframe-box`, `.formula-text`, `.umain-card`, `.umain-button-primary/secondary/outline/ghost`, `.umain-status-badge` (con variantes de estado), `.umain-input`, `.umain-table`, `.umain-stat-card`, `.umain-modal`, `.umain-tag`, `.umain-skeleton`.

---

## 4. Base de Datos (D1 SQLite)

### Tablas (16 totales)

| Tabla | Proposito |
|---|---|
| `users` | Autenticacion plataforma (roles: admin, comercial, talento, agencia) |
| `identities` | Talentos (nombre, tier A/B/C, estado activo/suspendido/suprimido) |
| `identity_packs` | Activos biometricos cifrados (AES-256, hash SHA-256) |
| `consent_matrices` | 65 categorias IAB (permitido/caso_por_caso/solo_notificar/prohibido/sin_definir) |
| `campaigns` | Campanas publicitarias |
| `licenses` | Tokens de licencia (alcance, economia, exclusividad, JWT) |
| `generation_jobs` | Solicitudes de generacion (tipo, proveedor, estado, validacion) |
| `outputs` | Assets generados (hash SHA-256, C2PA) |
| `approvals` | Aprobaciones talento (token, hash_material, decision) |
| `audit_log` | Registro inmutable (append-only, SHA-256 chain, firma ed25519) |
| `exclusivity_locks` | Locks de exclusividad (categoria, territorio, vencimiento) |
| `legal_documents` | Biblioteca legal (contratos, certificados) |
| `providers` | Config API keys (higgsfield, flux, elevenlabs, etc.) |
| `character_sheets` | Character sheets para avatares (descripcion, estado) |
| `character_assets` | Assets del character sheet (fotos, video, audio) |
| `character_attributes` | Atributos del personaje (clave/valor, fuente) |
| `system_settings` | Configuracion key-value |

### Reglas Criticas

- AuditLog: triggers que abortan UPDATE/DELETE (append-only)
- Hash chain: `hash = SHA256(hash_prev || payload)` + firma ed25519 por lote
- Borrado logico de identidades: `estado = 'suprimido'`
- FK obligatoria: generation_jobs.license_id → licenses.id (no hay jobs sin token)

---

## 5. Sistema de Rutas

| Ruta | Archivo | Descripcion |
|---|---|---|
| `/` | `index.tsx` | Redirect a `/login` |
| `/login` | `login.tsx` | Autenticacion |
| `/dashboard` | `dashboard/index.tsx` | Dashboard con stats |
| `/identities` | `identities/index.tsx` | Listado talentos |
| `/identities/$id` | `identities/$id/index.tsx` | Detalle talento |
| `/identities/$id/consent-matrix` | `identities/$id/consent-matrix.tsx` | 65 categorias IAB |
| `/identities/$id/avatar` | `identities/$id/avatar/index.tsx` | Character Sheet avatar |
| `/campaigns` | `campaigns/index.tsx` | Campanas |
| `/licenses` | `licenses/index.tsx` | Licencias |
| `/jobs` | `jobs/index.tsx` | Jobs generacion |
| `/audit-log` | `audit-log/index.tsx` | AuditLog |
| `/legal` | `legal/index.tsx` | Biblioteca legal |
| `/settings` | `settings/index.tsx` | Config proveedores |
| `/approval/$token` | `approval/$token.tsx` | Magic link talento |

---

## 6. Server Functions (API Interna)

Definidas en `src/lib/queries.ts`. Usan `createServerFn` de TanStack Start con D1 via `(env as any).DB`.

### Implementadas
- `getDashboardStats`, `getIdentities`, `getIdentity(id)`, `getConsentMatrix(id)`
- `getCampaigns`, `getLicenses`, `getJobs`, `getAuditLog`, `getLegalDocuments`
- `getProviders`, `saveProvider`, `validateProvider`, `deleteProvider`
- `getSettings`, `saveSetting`, `loginUser`
- `getCharacterSheet(identityId)` — sheet + assets + atributos

### Pendientes F1
- CRUD completo identidades (POST/PUT/DELETE)
- CRUD consent_matrix, campanas, licencias
- Endpoint creacion jobs con compuerta de consentimiento
- Magic link real con JWT
- Integracion Higgsfield API

---

## 7. Modulos UI (Resumen)

- **Login:** Formulario wireframe con credenciales demo (`demo@umain.io` / `demo2026`)
- **Dashboard:** 6 stat cards + actividad reciente + estado Rights Engine
- **Talentos:** Tabla CRUD con badges de estado (activo/suspendido/suprimido)
- **Matriz Consentimiento:** 65 categorias IAB con selector rapido de estado por fila
- **Character Sheet (Avatar):** 3 columnas: Asset Manager (fotos/video/audio upload) → Preview en vivo del documento (foto + descripcion + atributos) → Editor con auto-generacion de descripcion
- **Jobs:** Panel con informacion de Higgsfield + compuerta de consentimiento (5 pasos)
- **AuditLog:** Tabla inmutable con cadena de hashes SHA-256
- **Settings:** CRUD de proveedores API con validacion de conexion
- **Approval:** Magic link con preview de condiciones + botones aprobar/rechazar

---

## 8. Workflow Generacion Avatares — Triple Pipeline Architecture

> Version 2.1.0 — Aprobado para implementacion.
> Documento completo: `LM_UMAIN_HIGGSFIELD_DUAL_WORKFLOW_v03.md`

### Arquitectura General

```
CHARACTER SHEET (UI)
        │
        ├── 20-30 fotos identidad ───────► PIPELINE A (Soul ID 2.0) ──► Face DNA
        ├── Referencias visuales ────────► PIPELINE B (GPT Image 2     ──► Creative shots
        │   (outfits, entornos, props,         / Nano Banana Pro)          (con referencias)
        │    poses)
        └── Audio voz ───────────────────► Seed Audio ──► Voice clone

                                            PIPELINE B outputs
                                                   │
                                                   ▼
                                          PIPELINE C (Seedream V5 Pro)
                                          Correccion facial adaptativa
                                          contra Soul ID
                                                   │
                                                   ▼
                                         CHARACTER SHEET MASTER
                                         (organizado por categorias)
```

### Pipeline A: Identity — Soul ID 2.0

**Proposito:** Crear el DNA facial inmutable del avatar. Se ejecuta UNA VEZ y se reusa en todas las generaciones futuras.

**Input:** 20-30 fotos del talento con variedad de angulos (frontal, perfil 45°, 3/4), expresiones (neutral, sonrisa, seria, riendo, pensativa) e iluminacion (natural, estudio, contraluz, tungsteno, fluorescente).

**Ejecucion:**
1. `higgsfield_upload(files=[20-30 fotos])` → IDs
2. `higgsfield_soul_id(action="create", name="Nombre - Master Identity", images=[...], variant="soul-2", poll=true)` → `reference_id` (~3-5 min, ~40 creditos)
3. `higgsfield_element(action="create", category="character_ip_verified", ...)` → `element_id` (para Seedance video)
4. Opcional: `higgsfield_audio_generate(type="seed_audio", mode="voice_clone", ...)` → `voice_id`

**Output:** `soul_id`, `element_id`, `voice_id` — reutilizables en TODAS las generaciones futuras.

---

### Pipeline B: Creativity — GPT Image 2 + Nano Banana Pro

**Proposito:** Generar imagenes con control creativo total usando referencias visuales (outfits, entornos, props, poses).

**Jerarquia Nano Banana:**
| Version | Calidad | Uso |
|---|---|---|
| `nano_banana_pro` | Maxima | Pipeline B principal — style transfer, batch, consistency lock |
| `nano_banana_2` | Alta | Fallback si `pro` no esta disponible |
| `nano_banana_2_lite` | Estandar | Drafts / pruebas rapidas |

**Input:**
- Referencia de personaje (foto base del talento o output de Pipeline A)
- Referencias de outfit (1+ foto por outfit)
- Referencias de entorno (1+ foto por locacion)
- Referencias de props (1+ foto por producto)
- Referencias de pose (opcional)
- Creative brief en texto: Sujeto + Accion + Escena + Estilo

**Ejecucion — UMAIN orchesta desde su backend:**
```
async function executeBatch(shotList, concurrency=5):
    results = []
    for i in 0 to shotList.length step concurrency:
        batch = shotList[i..i+concurrency]
        batchResults = await Promise.all(
            batch.map(shot => higgsfield_generate_image(shot))
        )
        results.push(...batchResults)
    return results
```

**Seleccion de modelo por caso:**
| Caso | Modelo | Razon |
|---|---|---|
| Outfit + entorno especifico | GPT Image 2 | Referencias + texto simultaneo |
| Product placement | GPT Image 2 | Edicion quirurgica, texto en empaque |
| Batch de variaciones | Nano Banana Pro | Multi-referencia + consistency lock |
| Style transfer / artistico | Nano Banana Pro | Control de estilo superior |
| Texto en imagen | GPT Image 2 | >95% precision en renderizado de texto |
| Control de pose desde dibujo | Nano Banana Pro | Soporte nativo de pose reference |

---

### Pipeline C: Facial Correction — Seedream V5 Pro (ADAPTATIVO)

**Proposito:** Corregir inconsistencias faciales de Pipeline B para que coincidan con el Soul ID. Sin este paso, GPT Image 2 y Nano Banana 2 producen ~70-80% de coincidencia facial.

**Por que es necesario:**
- GPT Image 2: ~70-80% match facial sin correccion
- Nano Banana Pro: ~75-85% match facial sin correccion
- Con Pipeline C: ~95%+ match facial

**Algoritmo Adaptive Correction Strength:**

```
async function adaptiveFaceCorrection(pipelineBOutput, soulIdRef):
    initialScore = compareFaces(pipelineBOutput, soulIdRef)

    // Saltar si ya esta bien
    if initialScore >= 0.90:
        return { image: pipelineBOutput, corrections: 0 }

    // Determinar fuerza inicial
    if initialScore >= 0.85: strength = 0.70  // correccion ligera
    elif initialScore >= 0.80: strength = 0.80 // correccion media
    elif initialScore >= 0.75: strength = 0.85 // correccion fuerte
    else: strength = 0.90                      // correccion maxima

    // Aplicar correccion
    corrected = seedreamV5Pro(
        source: pipelineBOutput,
        faceRef: soulIdRef,
        correction_strength: strength,
        preserve: [outfit, environment, pose, props, lighting]
    )

    finalScore = compareFaces(corrected, soulIdRef)
    corrections = 1

    // Escalar si es necesario (max 1 vez)
    if finalScore < 0.85 && strength < 0.90:
        strength = min(strength + 0.05, 0.90)
        corrected = seedreamV5Pro(...)  // re-ejecutar
        finalScore = compareFaces(corrected, soulIdRef)
        corrections = 2

    return { image: corrected, score: finalScore, corrections }
```

**Beneficios del enfoque adaptativo:**
- Saltos de correccion cuando ya hay buen match (~20-30% de los casos)
- Preservacion de expresiones naturales (fuerzas bajas)
- Evita sobre-correccion (rostros "plasticos")
- Maximo 1 escalada — no hay loops infinitos
- Trail de auditoria: initial_score, final_score, strength, escalations

**Cuando saltar Pipeline C:**
- Outputs directos de Pipeline A (Soul ID) → ya tienen ~98% match
- Estilos artisticos / no realistas → no aplica
- Costo prohibitivo en batches de 50+ → evaluar caso por caso

---

### Fase 3: Compuerta de Consentimiento (Rights Engine)

Cada generacion (de cualquier pipeline) pasa por 5 validaciones:

1. **Validar token JWT** — firma valida, licencia vigente, identidad activa
2. **Validar alcance** — medio, territorio, categoria ⊆ alcance del token
3. **Validar matriz** — categoria IAB no esta en "prohibido" en la ConsentMatrix vigente
4. **Validar exclusividad** — marca del job no bloqueada por lock vigente
5. **Montar derivados minimos → llamar Higgsfield → registrar en AuditLog**

---

### Fase 4: Aprobacion Talento

1. Job completado → preview via magic link al talento
2. Talento ve condiciones + material final
3. Decision: aprobar → se entrega / rechazar o cambios → vuelve a edicion
4. Hash del material visto queda registrado (defensa legal)

---

### Fase 5: Character Sheet Master

Estructura de salida en R2 tras pasar Quality Gates:

```
character_sheet_master/{identity_id}/
    metadata.json
    identity/       → soul_id_reference.jpg, character_element.mp4, voice_clone.mp3
    headshots/      → Pipeline A outputs (Soul ID directo)
    outfits/        → Pipeline B + C (con correccion facial)
    environments/   → Pipeline B + C
    poses/          → Pipeline B + C
    props/          → Pipeline B + C (con producto)
    variations/     → Estilos alternativos
```

### Quality Gate System

Cada asset generado pasa por validacion automatica:

| Check | Threshold | Accion si falla |
|---|---|---|
| Face match score | >= 0.85 PASS, 0.70-0.84 REVIEW, < 0.70 FAIL | Regenerar (max 3 intentos) |
| Visual quality | >= 0.80 PASS, 0.65-0.79 REVIEW, < 0.65 FAIL | Regenerar con parametros ajustados |
| Reference adherence | >= 0.75 PASS, 0.60-0.74 REVIEW, < 0.60 FAIL | Solo Pipeline B — verificar referencias |

---

## 9. Modelos Higgsfield — Matriz de Decision Definitiva

| Tarea | Modelo Primario | Fallback | Costo (creditos) |
|---|---|---|---|
| Entrenamiento identidad | Soul ID 2.0 | — | ~40 (one-time) |
| Headshots corporativos | `text2image_soul_v2` (+ soul_id) | — | 1-2 |
| Outfit + entorno especifico | `gpt_image_2` | `nano_banana_pro` | 2-3 |
| Product placement | `gpt_image_2` | — | 2-3 |
| Batch variaciones outfit | `nano_banana_pro` | `nano_banana_2` | 2-3 |
| Style transfer / artistico | `nano_banana_pro` | — | 2-3 |
| Correccion facial post-gen | `seedream_v5_pro` | — | 2-3 |
| Video avatar | `seedance_2_0` (+ <<<element_id>>>) | `kling3_0` | 5-10 |
| Clonacion voz | `seed_audio` | ElevenLabs | 5-10 |
| Texto en imagen | `gpt_image_2` | — | 2-3 |
| Control de pose via dibujo | `nano_banana_pro` | — | 2-3 |

### Costo Estimado por Avatar Setup (25 assets)

| Componente | Creditos |
|---|---|
| Soul ID Training | ~40 |
| Pipeline A headshots (3) | ~3-6 |
| Pipeline B GPT Image 2 (12 shots) | ~24-36 |
| Pipeline B Nano Banana Pro (10 shots) | ~20-30 |
| Pipeline C correcciones (22 shots × ~2.5) | ~50-60 |
| Voice clone | ~5-10 |
| **Total estimado** | **~130-170 creditos** |
| **Por campana (1 img + 1 video)** | **~7-15 creditos** |

---

## 10. Credenciales Demo

| Rol | Email | Password |
|---|---|---|
| Admin | `demo@umain.io` | `demo2026` |

---

## 11. URLs

- **Sitio:** `https://umain-platform.higgsfield.app`
- **Template Avatar:** `/identities/template-identity-001/avatar/`
- **Login:** `/login`
- **Dashboard:** `/dashboard`
- **Config APIs:** `/settings`
- **Documentacion:** `/docs`

---

## 12. Guia de Despliegue

> Documento completo: `DEPLOYMENT_GUIDE.md` en la raiz del repositorio.

### 12.1 Flujo de Despliegue

Cada deploy se realiza desde Higgsfield Supercomputer:

```
deploy_website(website_id="<ID>")
```

Esto ejecuta automaticamente:
1. `bun install` — instala dependencias
2. `tsc --noEmit` — verifica tipos TypeScript
3. `vite build` — compila cliente + servidor SSR
4. Aplica migraciones D1 pendientes (en orden numerico)
5. Despliega el Worker en Cloudflare

**Tiempo estimado:** 2-5 minutos.

### 12.2 Migraciones

Las migraciones estan en `app/migrations/` (actualmente 4 archivos: 0001-0004). Se ejecutan automaticamente en cada deploy, solo las no aplicadas previamente.

**Reglas:**
- Solo operaciones aditivas (CREATE TABLE IF NOT EXISTS, ADD COLUMN)
- No usar DROP TABLE en migraciones automaticas
- Los datos son produccion — no hay base de datos de prueba separada
- AuditLog tiene triggers que abortan UPDATE/DELETE (append-only)

### 12.3 Actualizaciones

```
git add -A && git commit -m "descripcion"
git push origin main
deploy_website(website_id="<ID>")
```

Cada deploy produce una nueva version en vivo inmediatamente. No hay etapa de preview separada.

### 12.4 Rollback

No hay comando de rollback nativo. Usar `git revert` para deshacer commits, luego deployar la version revertida. D1 no soporta rollback de migraciones — siempre usar cambios aditivos.

### 12.5 Checklist Pre-Deploy

- [ ] `bun run build` compila sin errores
- [ ] No hay placeholders (REMOVE_THIS, TODO)
- [ ] Migraciones nuevas son aditivas
- [ ] routeTree.gen.ts refleja rutas nuevas
- [ ] Template demo carga correctamente

### 12.6 Solucion de Problemas Comunes

| Error | Solucion |
|---|---|
| Build failed — error TS | Corregir errores de TypeScript localmente |
| D1 migration failed | SQL invalido — crear migracion correctiva |
| Import denied in client | Archivo .server.ts importado desde cliente |
| 404 en rutas | routeTree.gen.ts desactualizado |
| Higgsfield 401 | API key invalida — verificar en /settings |
