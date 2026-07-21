# UMAIN Platform — Handoff: Bugs para corregir

> Documento para abrir en un chat de Supercomputer con un agente mas potente.
> **Fecha:** Julio 2026 | **Proyecto:** UMAIN Platform v0.2.0
> **Stack:** React 19 + TanStack Start + Cloudflare D1 (SQLite) + Tailwind v4

---

## Contexto del proyecto

Plataforma B2B para gestion de avatares digitales con Rights Engine (consentimiento, licencias, trazabilidad legal) y generacion via Higgsfield (Triple Pipeline: Soul ID 2.0 + GPT Image 2/Nano Banana Pro + Seedream V5 Pro).

**Sitio en vivo:** https://umain-platform.higgsfield.app
**Repo:** Acceso via token Higgsfield (ver mas abajo)

---

## Bug 1: D1 Binding no disponible en createServerFn (CRITICO)

### Sintoma
Todas las server functions que usan `db()` devuelven datos vacios o "Error de conexion". Las paginas que dependen de datos (identities list, dashboard, login) muestran estados vacios o errores.

### Causa probable
El archivo `app/src/lib/queries.ts` importa `env` a nivel de modulo via:
```typescript
import { env } from "cloudflare:workers";
```

En el runtime de Cloudflare Workers, esto funciona para codigo que corre dentro del fetch handler. Sin embargo, TanStack Start's `createServerFn` puede ejecutar los handlers en un contexto donde el modulo `cloudflare:workers` no tiene las bindings pobladas.

La evidencia: `website_db` (herramienta de la plataforma) SÍ puede consultar D1 correctamente, pero las server functions definidas por el usuario NO.

### Solucion propuesta
Usar `getCloudflareContext()` de `@tanstack/react-start/server` en lugar del import directo:

```typescript
import { getCloudflareContext } from "@tanstack/react-start/server";

// Dentro del handler de createServerFn:
const { env } = await getCloudflareContext();
const db = env.DB;
```

### Archivos afectados
- **`app/src/lib/queries.ts`** — las 20+ server functions (reemplazar `import { env }` por `getCloudflareContext()` y cambiar `db()` a async)
- **`app/src/lib/bindings.server.ts`** — referencias a `import { env } from "cloudflare:workers"` (reemplazar por `getCloudflareContext()`)
- **`app/src/lib/rights-engine.ts`** — las 6 server functions del Rights Engine

### Datos existentes en D1 (verificados)
```sql
-- identities: 1 row
id = 'template-identity-001', nombre = 'Avatar DEMO ref', tier = 'A', estado = 'activo'

-- users: 2 rows
admin@umain.io / $2a$10$placeholder_hash_change_me
demo@umain.io / demo2026

-- character_sheets: 1 row (template-sheet-001 con assets y atributos)
-- consent_matrices: 1 row (matrix-template-001, 25 categorias configuradas, firmada)
-- exclusivity_locks: 3 rows (Nike/AR, Adidas/WORLD, Coca-Cola/LATAM)
-- campaigns: 1 row (campaign-template-001)
-- licenses: 1 row (template-license-001, vigente, con token JWT emitido)
```

---

## Bug 2: Dropdown de entrenamiento se renderiza DETRAS de otros elementos

### Sintoma
Al hacer clic en "Iniciar entrenamiento ▾", el menu desplegable aparece detras de las cards del layout en lugar de superponerse (ver screenshot adjunta).

### Causa
El main tiene `overflow-y: auto` en `styles.css` (clase `.umain-main`). El dropdown usa `position: absolute` con `z-index: 50`, pero el `overflow: auto` del contenedor padre recorta el overflow visual aunque el z-index sea alto.

### Solucion propuesta

**Op A (recomendada):** En la clase `.umain-main` de `styles.css`, cambiar:
```css
.umain-main { overflow-y: auto; }
```
a:
```css
.umain-main { overflow-y: visible; min-height: 100vh; }
```

**Op B (local):** En el avatar page (`app/src/routes/identities/$id/avatar/index.tsx`), el `<main>` ya tiene `overflow: visible` inline, pero el sidebar tiene su propio contexto de stacking. Verificar que el `z-index` del dropdown sea mayor que el del sidebar.

**Op C (definitiva):** Renderizar el dropdown con `position: fixed` en lugar de `position: absolute`, calculando la posicion via `getBoundingClientRect()`.

### Archivos afectados
- `app/src/styles.css` — clase `.umain-main`
- `app/src/routes/identities/$id/avatar/index.tsx` — componente del dropdown

---

## Bug 3: "Guardar perfil sin entrenar" no persiste datos

### Sintoma
El boton "Guardar perfil sin entrenar" cambia el estado visual a "guardado" pero los datos del character sheet (assets, descripcion, atributos) no se persisten en D1. Al recargar la pagina, todo vuelve al estado inicial.

### Causa
El handler `handleSaveProfile()` en `app/src/routes/identities/$id/avatar/index.tsx` solo hace `setSaved(true)` sin llamar a ninguna server function que persista los datos.

### Solucion propuesta
Implementar `saveCharacterSheet` en queries.ts que haga INSERT o UPDATE en las tablas `character_sheets`, `character_assets` y `character_attributes`. Luego conectar el boton "Guardar perfil sin entrenar" a esta funcion.

### Archivos afectados
- `app/src/routes/identities/$id/avatar/index.tsx` — funcion `handleSaveProfile()` (linea ~97)
- `app/src/lib/queries.ts` — agregar `saveCharacterSheet()` server function

---

## Bug 4: Template "Avatar DEMO ref" no aparece en lista

### Sintoma
La pagina `/identities` muestra "No hay Avatares/Clones registrados" aunque la DB tiene el registro `template-identity-001`.

### Causa
**Misma causa que Bug 1.** `getIdentities()` no puede acceder a D1 porque `env.DB` no esta disponible via `import { env } from "cloudflare:workers"`. Al resolver el Bug 1, este bug se resuelve automaticamente.

### Archivos afectados
- `app/src/lib/queries.ts` — funcion `getIdentities()` (linea ~115)
- `app/src/routes/identities/index.tsx` — loader que llama a `getIdentities()`

---

## Archivos clave del proyecto

```
umain-platform/
├── app/
│   ├── src/
│   │   ├── lib/
│   │   │   ├── queries.ts           ← SERVER FUNCTIONS (bug #1)
│   │   │   ├── rights-engine.ts     ← SERVER FUNCTIONS (bug #1)
│   │   │   ├── bindings.server.ts   ← BINDINGS (bug #1)
│   │   │   ├── umain-types.ts       ← TYPES (sin errores)
│   │   ├── routes/
│   │   │   ├── login.tsx            ← LOGIN (bug #1)
│   │   │   ├── identities/
│   │   │   │   ├── index.tsx        ← LISTA (bug #4)
│   │   │   │   └── $id/
│   │   │   │       └── avatar/
│   │   │   │           └── index.tsx ← AVATAR PAGE (bugs #2 y #3)
│   │   ├── styles.css               ← ESTILOS (bug #2)
│   ├── migrations/                  ← 6 migraciones D1
│   ├── package.json
│   └── app.manifest.json
├── UMAIN_PROJECT_SPEC.md            ← Especificacion completa
└── DEPLOYMENT_GUIDE.md              ← Guia de despliegue
```

## Como obtener el codigo

```bash
# Clonar desde Higgsfield (token necesario)
git clone https://apps-repos.higgsfield.ai/hfu-user2wOQxQla9e2kHVmC1Pv6AhkGTRv/umain-platform-dd02a241-61d3-41c0-9151-d8aaf1f81f75.git

# O descargar tarball:
curl -L -o umain-platform.tar.gz https://d2ol7oe51mr4n9.cloudfront.net/user_2wOQxQla9e2kHVmC1Pv6AhkGTRv/babe24b3-7b98-416a-b7e0-5db65200b11f.gz

# Descomprimir y arrancar:
cd umain-platform && cp app/package.local.json app/package.json && cp app/styles.local.css app/src/styles.css
cd app && bun install && bun run dev
```

## Despliegue

```bash
git checkout app/src/styles.css  # restaurar version con Higgsfield
git add -A && git commit -m "fix: ..." && git push origin main
# → deploy_website(website_id="dd02a241-61d3-41c0-9151-d8aaf1f81f75")
```
