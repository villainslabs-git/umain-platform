# UMAIN Platform

> Plataforma de gestion de avatares digitales con Rights Engine + generacion via Higgsfield.
> **Triple Pipeline Architecture** v2.1.0 — React 19 + TanStack Start + Cloudflare D1 + Tailwind v4

[![Deployed](https://img.shields.io/badge/status-live-7dd4fc?style=flat-square)](https://umain-platform.higgsfield.app)
[![Version](https://img.shields.io/badge/version-0.2.0-f4a8c8?style=flat-square)]()
[![License](https://img.shields.io/badge/license-proprietary-1e293b?style=flat-square)]()

---

## Tabla de Contenidos

1. [Descripcion General](#1-descripcion-general)
2. [Stack Tecnologico](#2-stack-tecnologico)
3. [Estructura del Proyecto](#3-estructura-del-proyecto)
4. [Configuracion Local](#4-configuracion-local)
5. [Scripts Disponibles](#5-scripts-disponibles)
6. [Arquitectura de Generacion: Triple Pipeline](#6-arquitectura-de-generacion-triple-pipeline)
7. [Roadmap F1](#7-roadmap-f1)
8. [Despliegue en Produccion](#8-despliegue-en-produccion)
9. [Documentacion Adicional](#9-documentacion-adicional)
10. [Credenciales Demo](#10-credenciales-demo)

---

## 1. Descripcion General

UMAIN es una plataforma B2B para la creacion, gestion y licenciamiento de avatares digitales (gemelos digitales). Combina un **Rights Engine** propio (gestion de consentimiento, licencias y trazabilidad legal) con un motor de generacion basado en **Higgsfield** para la creacion de contenido digital consistente.

### Pilares del Proyecto

| Pilar | Descripcion |
|---|---|
| **Capture Protocol** | Sesion de 45 min con video 4K multi-angulo, fotografia guiada (40-80 tomas) y captura de voz (10-15 min). Identity Pack cifrado AES-256 en el set. |
| **Rights Engine** | Software propio (~70% del esfuerzo de desarrollo): base de datos de identidades, compuerta de consentimiento, workflow de aprobacion del talento, AuditLog inmutable con cadena de hashes SHA-256 y firma ed25519. |
| **Generation Layer** | Triple Pipeline sobre Higgsfield: Pipeline A (Soul ID 2.0) + Pipeline B (GPT Image 2 / Nano Banana Pro) + Pipeline C (Seedream V5 Pro adaptativo). |

### Enlaces Rapidos

| Recurso | URL |
|---|---|
| Sitio en produccion | [https://umain-platform.higgsfield.app](https://umain-platform.higgsfield.app) |
| Login | `/login` |
| Dashboard | `/dashboard` |
| Template Avatar Demo | `/identities/template-identity-001/avatar/` |
| Documentacion tecnica | `/docs` |
| Configuracion APIs | `/settings` |

---

## 2. Stack Tecnologico

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
| Generacion | Higgsfield API (Soul ID 2.0, GPT Image 2, Nano Banana Pro, Seedream V5 Pro, Seedance 2.0, Seed Audio) |

---

## 3. Estructura del Proyecto

```
umain-platform/
├── README.md                          ← Este archivo (documentacion central)
├── UMAIN_PROJECT_SPEC.md              ← Especificacion tecnica completa
├── DEPLOYMENT_GUIDE.md                ← Guia de despliegue en produccion
├── SETUP_LOCAL_DEV.md                 ← Configuracion para desarrollo local
│
├── app/
│   ├── migrations/                    ← Migraciones D1 (orden secuencial)
│   │   ├── 0001_umain_schema.sql      ← Schema base (11 tablas + triggers)
│   │   ├── 0002_providers.sql          ← Proveedores + system_settings
│   │   ├── 0003_character_sheets.sql   ← Character sheets + assets + atributos
│   │   └── 0004_seed_template.sql      ← Seed: Sofia Martina Rios (demo)
│   │
│   ├── src/
│   │   ├── components/
│   │   │   └── sidebar.tsx            ← Nav sidebar con secciones
│   │   │
│   │   ├── lib/
│   │   │   ├── queries.ts             ← 17 server functions (CRUD + DB)
│   │   │   ├── umain-types.ts         ← Types TypeScript + constantes
│   │   │   └── bindings.server.ts     ← Cloudflare bindings tipadas
│   │   │
│   │   ├── routes/                    ← 14 rutas file-based
│   │   │   ├── __root.tsx             ← Root layout + error/404
│   │   │   ├── index.tsx              ← Redirige a /login
│   │   │   ├── login.tsx              ← Autenticacion
│   │   │   ├── dashboard/index.tsx    ← Dashboard con stats
│   │   │   ├── identities/
│   │   │   │   ├── index.tsx          ← Listado talentos
│   │   │   │   └── $id/
│   │   │   │       ├── index.tsx      ← Detalle talento
│   │   │   │       ├── consent-matrix.tsx ← 65 categorias IAB
│   │   │   │       └── avatar/index.tsx  ← Character Sheet + creacion avatar
│   │   │   ├── campaigns/index.tsx
│   │   │   ├── licenses/index.tsx
│   │   │   ├── jobs/index.tsx         ← Jobs + compuerta consentimiento
│   │   │   ├── audit-log/index.tsx    ← AuditLog inmutable
│   │   │   ├── legal/index.tsx        ← Biblioteca legal
│   │   │   ├── settings/index.tsx     ← Config proveedores API
│   │   │   ├── approval/$token.tsx    ← Magic link aprobacion talento
│   │   │   └── docs/index.tsx         ← Documentacion tecnica
│   │   │
│   │   ├── styles.css                 ← Design system UMAIN (con Higgsfield)
│   │   ├── styles.local.css           ← Design system UMAIN (SIN Higgsfield)
│   │   ├── routeTree.gen.ts           ← Arbol de rutas
│   │   ├── router.tsx                 ← Config router
│   │   └── server.ts                  ← Entry point Cloudflare Worker
│   │
│   ├── styles.local.css               ← Version local sin dependencias Higgsfield
│   ├── package.local.json             ← Package minimo para desarrollo local
│   ├── package.json                   ← Package completo (con Higgsfield)
│   └── app.manifest.json              ← Declaracion de infraestructura
│
└── .gitignore
```

---

## 4. Configuracion Local

### Dependencias Higgsfield

El proyecto usa paquetes internos (`@higgsfield/fnf`, `@higgsfield/fnf-react`, `@higgsfield/quanta`)
que **solo estan disponibles dentro del ecosistema Higgsfield**. Se resuelven automaticamente
al deployar desde el Supercomputer.

Nuestro codigo UMAIN (`src/routes/`, `src/components/sidebar.tsx`, `src/lib/queries.ts`,
`src/lib/umain-types.ts`) **no importa ninguno de estos paquetes**. Las unicas referencias
estan en archivos del template scaffold que no se ejecutan (`src/layouts/`, `src/components/ui/`).

### Paso a Paso

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd umain-platform

# 2. Usar package.json local (sin Higgsfield)
cp app/package.local.json app/package.json

# 3. Usar estilos locales (sin Quanta)
cp app/styles.local.css app/src/styles.css

# 4. Instalar dependencias
cd app
bun install

# 5. Iniciar servidor de desarrollo
bun run dev
# → http://localhost:3000
```

### Limitaciones del entorno local

| Funcionalidad | Local | Produccion |
|---|---|---|
| UI / Ruteo | ✅ Completo | ✅ Completo |
| Template Avatar (datos inline) | ✅ Carga completa | ✅ Carga completa |
| Estilos UMAIN | ✅ (con `styles.local.css`) | ✅ |
| Server Functions (DB) | ❌ (requiere D1) | ✅ |
| Higgsfield Generacion | ❌ (requiere API key) | ✅ |

### Restaurar para Deploy

```bash
git checkout app/src/styles.css
```

Para mas detalles, ver [`SETUP_LOCAL_DEV.md`](./SETUP_LOCAL_DEV.md).

---

## 5. Scripts Disponibles

```bash
# Desarrollo local (UI sola)
cd app && bun run dev

# Build local (verifica compilacion)
cd app && bun run build

# TypeScript check
cd app && bun run typecheck

# Preview del build
cd app && bun run preview
```

---

## 6. Arquitectura de Generacion: Triple Pipeline

```
CHARACTER SHEET (UI)
    │
    ├── 20-30 fotos ─────► PIPELINE A (Soul ID 2.0) ──► Face DNA (reusable)
    ├── Referencias ─────► PIPELINE B (GPT Image 2     ──► Creative shots
    │   (outfits,               / Nano Banana Pro)          (con referencias)
    │    entornos,
    │    props, poses)
    └── Audio ───────────► Seed Audio ──► Voice clone

PIPELINE B outputs
    │
    ▼
PIPELINE C (Seedream V5 Pro)
Correccion facial ADAPTATIVA contra Soul ID
    │
    ▼
CHARACTER SHEET MASTER (organizado por categorias)
```

| Pipeline | Proposito | Modelos | Consistencia Facial |
|---|---|---|---|
| **A — Identity** | DNA facial inmutable (una vez, reusable) | Soul ID 2.0 | ~98% |
| **B — Creativity** | Control creativo con referencias visuales | GPT Image 2 / Nano Banana Pro | ~70-80% (sin C) |
| **C — Correction** | Correccion facial post-generacion adaptativa | Seedream V5 Pro | ~95%+ (con C) |

### Pipeline C: Algoritmo Adaptativo

```
1. Medir initial_score contra Soul ID
2. Si >= 0.90 → SALTAR (ahorra creditos)
3. Elegir correction_strength segun score:
   >= 0.85 → 0.70 (ligero)
   >= 0.80 → 0.80 (medio)
   >= 0.75 → 0.85 (fuerte)
   < 0.75  → 0.90 (maximo)
4. Aplicar Seedream V5 Pro (preserva: outfit, entorno, pose, props, lighting)
5. Si final_score < 0.85 → escalar +0.05 (max 1 vez)
```

### Compuerta de Consentimiento (Rights Engine)

Cada generacion pasa por 5 validaciones antes de tocar Higgsfield:

1. **Validar token JWT** — firma valida, licencia vigente, identidad activa
2. **Validar alcance** — medio, territorio, categoria ⊆ alcance del token
3. **Validar matriz** — categoria IAB no prohibida en ConsentMatrix vigente
4. **Validar exclusividad** — marca del job no bloqueada por lock vigente
5. **Montar derivados minimos → llamar Higgsfield → AuditLog**

### Costos Estimados

| Concepto | Creditos |
|---|---|
| Setup por avatar (~25 assets, incluye entrenamiento Soul ID) | ~130-170 creditos |
| Por campana (1 imagen + 1 video) | ~7-15 creditos |
| Soul ID Training (one-time) | ~40 creditos |

Para la matriz completa de modelos y costos, ver [`UMAIN_PROJECT_SPEC.md`](./UMAIN_PROJECT_SPEC.md).

---

## 7. Roadmap F1

- [ ] Autenticacion real con bcrypt y sesiones HTTP-only
- [ ] CRUD completo via mutations POST/PUT/DELETE
- [ ] Implementacion de la compuerta de consentimiento (5 validaciones)
- [ ] Integracion real con API de Higgsfield (Triple Pipeline)
- [ ] Magic link con tokens JWT firmados
- [ ] Upload real de Identity Packs a R2
- [ ] Versionado de Character Sheets con persistencia en D1
- [ ] Cola de jobs con estado en tiempo real
- [ ] Verificacion automatizada de la cadena de AuditLog
- [ ] Portal self-serve para talento (aprobaciones, reportes)

---

## 8. Despliegue en Produccion

### Prerrequisitos

- Acceso al ecosistema Higgsfield (Supercomputer)
- Token de deploy (obtenido via `website_repo_access`)
- API key de Higgsfield (configurar post-deploy en `/settings`)

### Flujo de Despliegue

```bash
# 1. Asegurar que styles.css sea el original (con Higgsfield)
git checkout app/src/styles.css

# 2. Commit y push
git add -A && git commit -m "descripcion de los cambios"
git push origin main

# 3. Desplegar desde Higgsfield Supercomputer
deploy_website(website_id="dd02a241-61d3-41c0-9151-d8aaf1f81f75")
```

Esto ejecuta automaticamente:
1. `bun install` → instala las 1163 dependencias (incluyendo Higgsfield)
2. `tsc --noEmit` → verifica tipos TypeScript
3. `vite build` → compila cliente SSR + servidor
4. `D1 migrations` → aplica migraciones pendientes
5. → **Cloudflare Worker deployed** (2-5 min)

### Migraciones

Las migraciones estan en `app/migrations/` y se ejecutan automaticamente en cada deploy,
solo las no aplicadas previamente.

**Reglas:**
- Solo operaciones aditivas (`CREATE TABLE IF NOT EXISTS`, `ADD COLUMN`)
- No usar `DROP TABLE` en migraciones automaticas
- Los datos son produccion — no hay DB de prueba separada
- AuditLog tiene triggers que abortan UPDATE/DELETE (append-only)

### Rollback

No hay comando de rollback nativo. Usar `git revert` para deshacer commits, luego deployar
la version revertida. D1 no soporta rollback de migraciones — siempre usar cambios aditivos.

### Checklist Pre-Deploy

- [ ] `bun run build` compila sin errores
- [ ] No hay placeholders (`REMOVE_THIS`, `TODO`, `lorem ipsum`)
- [ ] Migraciones nuevas son aditivas (no DROP)
- [ ] `routeTree.gen.ts` refleja las rutas nuevas
- [ ] Template demo carga en `/identities/template-identity-001/avatar/`
- [ ] `styles.css` es el original (con Higgsfield), no `styles.local.css`

Para la guia completa, ver [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md).

---

## 9. Documentacion Adicional

| Archivo | Contenido |
|---|---|
| [`UMAIN_PROJECT_SPEC.md`](./UMAIN_PROJECT_SPEC.md) | Especificacion tecnica completa: DB, rutas, modulos UI, modelos, costos |
| [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) | Guia de despliegue: migraciones, config, troubleshooting, seguridad |
| [`SETUP_LOCAL_DEV.md`](./SETUP_LOCAL_DEV.md) | Configuracion de entorno de desarrollo local |
| `app/src/routes/docs/index.tsx` | Documentacion interactiva en `/docs` dentro de la plataforma |
| `app/migrations/*.sql` | Schema DDL completo de la base de datos |

---

## 10. Credenciales Demo

| Rol | Email | Password |
|---|---|---|
| Admin | `demo@umain.io` | `demo2026` |

---

## Design System

Tema oscuro permanente con:

- **Fondo:** Grilla matematica 20px + gradiente rosa suave
- **Colores:** Cian pastel (`#7dd4fc`) como accent primario, rosa suave (`#f4a8c8`) como secundario
- **Tipografia:** Geist Bold (titulares) + Geist Mono (etiquetas tecnicas)
- **Componentes:** `wireframe-box`, `formula-text`, `umain-card`, `umain-button-*`, `umain-status-badge`, `umain-input`, `umain-table`

Los estilos UMAIN son completamente independientes de Higgsfield Quanta. Ver `app/styles.css` (produccion) y `app/styles.local.css` (desarrollo local).

---

## Licencia

**Uso interno.** Proyecto UMAIN — Todos los derechos reservados.
