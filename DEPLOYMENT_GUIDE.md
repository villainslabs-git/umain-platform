# UMAIN Platform — Deployment Guide

> Guia paso a paso para desplegar la plataforma UMAIN en entornos de produccion.
> Ultima actualizacion: Julio 2026

---

## Tabla de Contenidos

1. [Prerrequisitos](#1-prerrequisitos)
2. [Estructura del Despliegue](#2-estructura-del-despliegue)
3. [Despliegue Inicial](#3-despliegue-inicial)
4. [Migraciones de Base de Datos](#4-migraciones-de-base-de-datos)
5. [Configuracion de Proveedores API](#5-configuracion-de-proveedores-api)
6. [Actualizaciones y Redeploys](#6-actualizaciones-y-redeploys)
7. [Rollback](#7-rollback)
8. [Entornos: Desarrollo vs Produccion](#8-entornos-desarrollo-vs-produccion)
9. [Monitoreo y Logs](#9-monitoreo-y-logs)
10. [Seguridad](#10-seguridad)
11. [Solucion de Problemas](#11-solucion-de-problemas)
12. [Checklist Pre-Despliegue](#12-checklist-pre-despliegue)

---

## 1. Prerrequisitos

### 1.1 Cuentas y Servicios

| Servicio | Proposito | Requerido |
|---|---|---|
| Higgsfield AI | Plataforma de generacion de imagenes, video y voz | Si |
| Cloudflare | D1 (base de datos), R2 (storage), Workers (hosting) | Si — provisto por Higgsfield |
| GitHub | Repositorio de codigo (opcional) | Recomendado |

### 1.2 Credenciales Necesarias

- **Token de despliegue Higgsfield** — provisto en el website repo access
- **API Key de Higgsfield** — para generacion de contenido (configurar en `/settings`)
- Opcional: API keys de Flux, ElevenLabs u otros proveedores

### 1.3 Herramientas Locales (para desarrollo)

```bash
# Node.js / Bun
curl -fsSL https://bun.sh/install | bash

# Wrangler CLI (para desarrollo local de Cloudflare Workers)
bun install -g wrangler

# Git
sudo apt-get install git
```

---

## 2. Estructura del Despliegue

La plataforma UMAIN se despliega como un **unico Cloudflare Worker** que maneja tanto el SSR (Server-Side Rendering) como la API interna. La base de datos es D1 (SQLite serverless) y los archivos se almacenan en R2.

```
Arquitectura de Produccion:
                         ┌──────────────┐
                         │   Usuario     │
                         │   (browser)   │
                         └──────┬───────┘
                                │ HTTPS
                                ▼
                   ┌────────────────────────┐
                   │  Cloudflare Worker      │
                   │  (SSR + API)            │
                   │                         │
                   │  • React 19 + TanStack  │
                   │  • Server Functions     │
                   │  • File-based Routing   │
                   └──────┬──────────┬───────┘
                          │          │
                          ▼          ▼
                   ┌──────────┐ ┌──────────┐
                   │   D1     │ │   R2     │
                   │  (SQL)   │ │ (Assets) │
                   └──────────┘ └──────────┘
                          │
                          ▼
                   ┌────────────────────────┐
                   │  Higgsfield API         │
                   │  (generacion externa)   │
                   └────────────────────────┘
```

---

## 3. Despliegue Inicial

### 3.1 Obtener el Codigo

**Op A: Clonar desde Higgsfield (si tenes acceso al token):**

```bash
git clone https://apps-repos.higgsfield.ai/hfu-user/umain-platform.git
cd umain-platform
```

**Op B: Desde el archivo comprimido:**

```bash
tar xzf umain-platform.tar.gz
cd umain-platform
```

### 3.2 Instalar Dependencias

```bash
cd app
bun install
```

Esto instala ~1163 paquetes incluyendo React 19, TanStack Start, Tailwind v4 y las dependencias de Cloudflare.

### 3.3 Configurar Infraestructura

El archivo `app/app.manifest.json` declara los recursos de infraestructura que necesita la plataforma:

```json
{
  "db": true,       // D1 database (SQL)
  "r2": true,       // R2 bucket (storage)
  "kv": false,      // KV no requerido
  "durableObject": null
}
```

**No modificar este archivo manualmente** — los cambios se aplican automaticamente en el proximo deploy.

### 3.4 Realizar el Primer Deploy

El despliegue se hace desde la interfaz de Higgsfield Supercomputer usando:

```
deploy_website(website_id="<ID_DEL_SITIO>")
```

Esto ejecuta automaticamente:

1. `bun install` — instala dependencias
2. `tsc --noEmit` — verifica tipos de TypeScript
3. `vite build` — compila cliente + servidor SSR
4. Aplica migraciones D1 pendientes
5. Despliega el Worker en Cloudflare

**Tiempo estimado:** 2-5 minutos.

### 3.5 Verificar el Despliegue

```bash
# Consultar estado
website_status(website_id="<ID>")
# → { status: "deployed", url: "https://umain-platform.higgsfield.app" }
```

Acceder a la URL provista. Verificar:

- [ ] Login en `/login` funciona
- [ ] Dashboard en `/dashboard` carga
- [ ] La grilla de fondo y los colores UMAIN se renderizan
- [ ] Las rutas `/identities`, `/jobs`, `/settings` Responden 200

---

## 4. Migraciones de Base de Datos

### 4.1 Archivos de Migracion

Las migraciones estan en `app/migrations/` y se ejecutan en orden secuencial numerico:

| Archivo | Contenido |
|---|---|
| `0001_init.sql` | Migracion inicial del template (generada por el scaffold) |
| `0001_umain_schema.sql` | Schema base: 11 tablas, indices, triggers append-only, seed admin |
| `0002_providers.sql` | Tablas providers, generation_requests, system_settings |
| `0003_character_sheets.sql` | Tablas character_sheets, character_assets, character_attributes |
| `0004_seed_template.sql` | Seed data: Sofia Martina Rios (template demo) |

### 4.2 Como se Ejecutan

Las migraciones se ejecutan **automaticamente** durante cada `deploy_website()`. El sistema:

1. Lee el directorio `app/migrations/`
2. Compara con la tabla `d1_migrations` (que registra las ya aplicadas)
3. Ejecuta solo las migraciones nuevas, en orden numerico
4. Cada migracion es atomica: si falla, el deploy se cancela

### 4.3 Agregar una Nueva Migracion

```bash
# Crear el archivo con el numero siguiente
touch app/migrations/0005_nueva_funcionalidad.sql

# Escribir SQL (solo CREATE TABLE / ALTER TABLE / INSERT)
echo "CREATE TABLE IF NOT EXISTS ejemplo (id TEXT PRIMARY KEY);" > app/migrations/0005_nueva_funcionalidad.sql

# Hacer commit + push + deploy
git add app/migrations/0005_nueva_funcionalidad.sql
git commit -m "feat: add ejemplo table"
git push
# → deploy_website ejecuta la migracion automaticamente
```

### 4.4 Reglas Importantes

- **Solo operaciones aditivas:** Preferir `CREATE TABLE IF NOT EXISTS` y `ALTER TABLE ADD COLUMN`
- **No usar DROP TABLE** en migraciones automaticas — requiere aprobacion manual
- **Los datos son produccion:** No hay base de datos de prueba separada. Cada deploy afecta datos reales.
- **AuditLog no se modifica:** Las tablas de derechos tienen triggers que abortan UPDATE/DELETE

### 4.5 Verificar Estado de Migraciones

```sql
-- Consultar que migraciones se aplicaron
SELECT * FROM d1_migrations ORDER BY id;
```

---

## 5. Configuracion de Proveedores API

Despues del deploy inicial, hay que configurar las API keys de generacion desde la interfaz:

### 5.1 Via UI (recomendado)

1. Navegar a `https://<url>/settings`
2. Hacer clic en "+ Agregar API"
3. Seleccionar tipo: `Higgsfield`
4. Ingresar nombre, API key y URL base (`https://api.higgsfield.ai/v1`)
5. Hacer clic en "Validar" para probar la conexion
6. La plataforma ahora puede generar contenido via Higgsfield

### 5.2 Proveedores Soportados

| Tipo | URL Base | API Key |
|---|---|---|
| `higgsfield` | `https://api.higgsfield.ai/v1` | sk-... |
| `flux` | `https://api.bfl.ml/v1` | clave Flux |
| `elevenlabs` | `https://api.elevenlabs.io/v1` | clave ElevenLabs |
| `runway` | `https://api.runwayml.com/v1` | clave Runway |
| `kling` | `https://api.klingai.com/v1` | clave Kling |
| `custom` | (url personalizada) | (key personalizada) |

---

## 6. Actualizaciones y Redeploys

### 6.1 Flujo de Actualizacion Estandar

```bash
# 1. Hacer cambios en el codigo
# 2. Committear
git add -A
git commit -m "descripcion del cambio"

# 3. Pushear al remote
git push origin main

# 4. Desplegar
deploy_website(website_id="<ID>")
# → compila + migra + deploy en ~2-5 min
```

Cada deploy produce una **nueva version en vivo** inmediatamente. No hay etapa de "preview" separada.

### 6.2 Actualizar Solo una Pagina

Para cambios pequenos (texto, estilos, un componente):

```bash
# Editar el archivo
patch app/src/routes/legal/index.tsx

# Commit y deploy
git add -A && git commit -m "fix: actualizar texto en legal"
git push
# → deploy_website
```

### 6.3 Agregar una Nueva Ruta

```bash
# 1. Crear el archivo de ruta
touch app/src/routes/nueva-ruta/index.tsx

# 2. Escribir el componente con createFileRoute
# 3. Actualizar routeTree.gen.ts manualmente
#    (agregar import, route definition y FileRoutesByPath)

# 4. Commit y deploy
git add -A && git commit -m "feat: add nueva-ruta"
git push
# → deploy_website (el build compila todo)
```

**Importante:** `routeTree.gen.ts` se mantiene manualmente. Al agregar una ruta hay que:

1. Agregar el `import` al inicio del archivo
2. Agregar la definicion en el objeto `Routes`
3. Agregar la entrada en `declare module '@tanstack/react-router'` → `interface FileRoutesByPath`

---

## 7. Rollback

### 7.1 Rollback a una Version Anterior

No hay un comando de rollback nativo. El proceso es:

```bash
# 1. Identificar el commit al que volver
git log --oneline -10

# 2. Revertir los cambios (no resetear — mantener historia)
git revert HEAD~3..HEAD  # revierte los ultimos 3 commits

# 3. Pushear y desplegar
git push origin main
deploy_website(website_id="<ID>")
```

### 7.2 Rollback de Base de Datos

D1 no soporta rollback de migraciones. La estrategia es:

- **Siempre usar migraciones aditivas** (CREATE TABLE IF NOT EXISTS, ADD COLUMN)
- Si una migracion introdujo un error, crear una **nueva migracion** que lo corrija
- Nunca ejecutar DROP TABLE en produccion sin respaldo

### 7.3 Restaurar desde Backup (R2)

Los archivos en R2 (Identity Packs, Character Sheets) no tienen versionado automatico. Para respaldos manuales:

```bash
# Descargar todo el bucket de R2
wrangler r2 object list umain-storage --recursive > backup-manifest.txt

# Restaurar archivo especifico
wrangler r2 object get umain-storage/path/to/file
```

---

## 8. Entornos: Desarrollo vs Produccion

### 8.1 Dependencias Higgsfield

El proyecto usa paquetes internos (`@higgsfield/fnf`, `@higgsfield/fnf-react`, `@higgsfield/quanta`)
que **solo estan disponibles dentro del ecosistema Higgsfield**. Se resuelven automaticamente
al deployar desde el Supercomputer.

Para desarrollo local, el codigo UMAIN (rutas, componentes, estilos) **no depende de estos paquetes**.
Ver `SETUP_LOCAL_DEV.md` en la raiz del repositorio para instrucciones de configuracion local.

### 8.2 Caracteristicas

| Aspecto | Desarrollo (local) | Produccion (deploy) |
|---|---|---|
| Comando | `bun run dev` | `deploy_website()` |
| URL | `localhost:3000` | `https://<slug>.higgsfield.app` |
| Base de datos | No disponible local (D1 solo en Workers) | D1 remoto |
| Tipo TypeScript | `tsc --noEmit` opcional | Forzoso (falla si hay errores) |
| Assets | Build normal | Build con `HF_DESIGN_INSPECTOR=1` |
| Migraciones | No se ejecutan | Automaticas en cada deploy |

### 8.2 Desarrollo Local

El entorno local tiene limitaciones porque D1 solo esta disponible dentro del runtime de Cloudflare Workers:

```bash
cd app
bun run dev
# Inicia servidor Vite en localhost:3000
# Las server functions (createServerFn) fallaran porque no hay binding D1
# La UI y el ruteo funcionan normalmente
```

Para desarrollo de UI, las paginas con datos inline (como el avatar template) funcionan completamente en local.

### 8.3 Inspeccion en Produccion

El deploy de produccion incluye automaticamente el **Higgsfield Design Inspector** (habilitado via `HF_DESIGN_INSPECTOR=1`). Esto permite:

- Inspeccionar componentes en vivo
- Editar propiedades desde el navegador
- Ver el arbol de componentes

No requiere configuracion adicional — se activa en cada deploy automaticamente.

---

## 9. Monitoreo y Logs

### 9.1 Logs del Worker

Los logs de ejecucion se pueden consultar via Cloudflare Dashboard o Wrangler:

```bash
# Ver logs en tiempo real
wrangler tail

# Ver logs historicos
wrangler tail --status ok,error
```

### 9.2 Estado del Sitio

```bash
website_status(website_id="<ID>")
# → { status: "deployed" | "failed" | "queued", url: "..." }
```

### 9.3 Auditoria Interna (UMAIN)

La plataforma registra todas las operaciones en el **AuditLog** (tabla `audit_log`), accesible via `/audit-log` en la UI. Cada entrada incluye:

- Tipo de evento (emision, validacion, aprobacion, output, revocacion, supresion)
- Payload JSON con detalles de la operacion
- Hash SHA-256 encadenado al registro anterior
- Firma ed25519 por lote

Para verificar la integridad de la cadena:

```sql
-- Verificar que los hashes sean consistentes
SELECT seq, evento, hash,
       CASE WHEN hash = sha256(hash_prev || payload) THEN 'OK' ELSE 'BROKEN' END as verificado
FROM audit_log ORDER BY seq;
```

---

## 10. Seguridad

### 10.1 Reglas de Seguridad del Worker

- **Sin estado global mutable:** Las variables a nivel de modulo se comparten entre requests en el mismo isolate V8
- **Random criptografico:** Usar `crypto.randomUUID()` y `crypto.getRandomValues()`, nunca `Math.random()` para IDs
- **Sin secretos hardcodeados:** Las API keys se configuran via `website_secrets` y se leen server-side como `bindings().SECRET_NAME`
- **Headers de seguridad en toda respuesta:** `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Strict-Transport-Security`

### 10.2 Proteccion de Datos Biometricos

- Los Identity Packs se cifran con **AES-256 en reposo** antes de almacenarse
- Los packs nunca salen de la infraestructura propia: a los proveedores van solo **derivados minimos** por job
- El descifrado temporal para envio a proveedores se realiza en memoria, sin dejar rastros en disco
- Registro ante AAIP (Agencia de Acceso a la Informacion Publica) requerido para produccion

### 10.3 Roles de Usuario

| Rol | Acceso |
|---|---|
| `admin` | UMAIN ops — acceso completo al sistema |
| `comercial` | Carga campanas, no toca packs biometricos |
| `talento` | Su portal: matriz de consentimiento, aprobaciones, reportes |
| `agencia` | Lectura de su roster + registro de usos |

### 10.4 API Keys de Proveedores

- Se almacenan cifradas en la tabla `providers` (columna `api_key_encrypted`)
- Nunca se exponen al frontend
- La validacion se hace desde el servidor via `validateProvider()`
- Se pueden rotar desde la UI en `/settings`

---

## 11. Solucion de Problemas

### 11.1 Errores Comunes de Deploy

| Error | Causa | Solucion |
|---|---|---|
| `Build failed with N error(s)` | Error de TypeScript en el codigo | Ejecutar `bun run build` local y corregir errores |
| `D1 migration failed` | SQL invalido en migracion | Revisar sintaxis SQL, crear migracion correctiva |
| `Could not resolve "./bindings.server"` | Import incorrecto en queries.ts | Usar `import { env } from "cloudflare:workers"` directo |
| `ERR_MODULE_NOT_FOUND` | Paquete faltante en node_modules | Ejecutar `bun install` |
| `Import denied in client environment` | Archivo `.server.ts` importado desde cliente | Mover logica a un archivo sin sufijo `.server` |

### 11.2 Errores en Tiempo de Ejecucion

| Sintoma | Causa | Solucion |
|---|---|---|
| Pagina en blanco | Error SSR no capturado | Revisar logs del Worker via `wrangler tail` |
| 404 en rutas existentes | Route tree desactualizado | Actualizar `routeTree.gen.ts` con la nueva ruta |
| "Talento no encontrado" | ID incorrecto o identidad no existe | Verificar el UUID en la base de datos |
| Server function no responde | Error en `createServerFn` | Verificar que el metodo (GET/POST) coincida |
| Login no funciona | Password hash incorrecto | Usar credenciales demo: `demo@umain.io` / `demo2026` |

### 11.3 Errores de Higgsfield

| Error | Significado | Accion |
|---|---|---|
| `status 401` | API key invalida | Verificar key en `/settings` y validar conexion |
| `status 429` | Rate limit excedido | Esperar y reintentar |
| `failed` | Generacion fallida | Reintentar con prompt simplificado o cambiar modelo |
| `nsfw` | Contenido detectado como sensible | Remover elementos sugestivos del prompt |
| `ip_detected` | Persona real detectada (Seedance) | Usar elemento verificado o personaje fictional |

---

## 12. Checklist Pre-Despliegue

Antes de cada deploy a produccion, verificar:

- [ ] `bun run build` compila sin errores localmente
- [ ] No hay placeholders en el codigo (`REMOVE_THIS`, `TODO`, `lorem ipsum`)
- [ ] Las migraciones nuevas son aditivas (no DROP)
- [ ] Los cambios en `routeTree.gen.ts` reflejan las rutas nuevas
- [ ] Las API keys de proveedores estan configuradas en `/settings`
- [ ] El template demo (Sofia Martina) carga correctamente en `/identities/template-identity-001/avatar/`
- [ ] Las migraciones se aplicaron correctamente (verificar en `d1_migrations`)
- [ ] El sitio responde HTTPS en la URL de produccion
- [ ] Los formularios de login funcionan con credenciales demo
- [ ] El AuditLog registra eventos al crear operaciones

---

## Apendice: Comandos Rapidos

```bash
# Instalar dependencias
cd app && bun install

# Build local (verifica compilacion)
cd app && bun run build

# Desarrollo local (UI solamente)
cd app && bun run dev

# Ver estado del sitio
website_status(website_id="<ID>")

# Desplegar
deploy_website(website_id="<ID>")

# Ver migraciones aplicadas
SELECT * FROM d1_migrations;

# Ver logs del Worker
wrangler tail
```
