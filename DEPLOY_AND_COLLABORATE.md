# UMAIN — Guía de Deploy y Colaboración

> **Fecha:** Julio 2026  
> **Propósito:** Cómo subir cambios a GitHub y hacer deploy

---

## 1. Estado Actual del Repositorio

```bash
# Ver commits
git log --oneline

# Resultado esperado:
# 85d9ad4 feat(admin): Multi-Provider Settings UI
# 0984e33 feat(avatar-engine): Implement Hybrid Architecture
# 17b0f28 feat(portals): Development B + C
# a66a8ad feat(design): Design System v2
# ...
```

---

## 2. Push a GitHub

### 2.1 Si el repo ya existe en GitHub

```bash
cd /home/user/umain-platform

# Verificar remote
git remote -v

# Si no tiene remote, agregarlo:
git remote add origin https://github.com/villainslabs-git/umain-platform.git

# Push a la rama feature/design-v2
git push origin feature/design-v2

# O merge a main y push
git checkout main
git merge feature/design-v2
git push origin main
```

### 2.2 Si necesitas crear el repo en GitHub

1. Ve a https://github.com/new
2. Nombre: `umain-platform`
3. NO inicializar con README (ya tenemos uno)
4. Crear repositorio
5. Seguir instrucciones de "push an existing repository"

```bash
git remote add origin https://github.com/TU_USUARIO/umain-platform.git
git branch -M main
git push -u origin main
```

---

## 3. Deploy en Higgsfield

### 3.1 Pre-requisitos

- Acceso al Supercomputer de Higgsfield
- Website ID: `dd02a241-61d3-41c0-9151-d8aaf1f81f75`

### 3.2 Deploy Command

```bash
# Desde el Supercomputer:
deploy_website(website_id="dd02a241-61d3-41c0-9151-d8aaf1f81f75")
```

### 3.3 Qué ejecuta automáticamente

1. `bun install` — instala dependencias
2. `tsc --noEmit` — verifica TypeScript
3. `vite build` — compila cliente + servidor SSR
4. D1 migrations — aplica migraciones pendientes
5. Cloudflare Worker deploy

**Tiempo estimado:** 2-5 minutos

### 3.4 Verificar Deploy

```bash
# Ver estado
website_status(website_id="dd02a241-61d3-41c0-9151-d8aaf1f81f75")

# URL resultante:
# https://umain-platform.higgsfield.app
```

---

## 4. Checklist Pre-Deploy

```markdown
- [ ] Todos los cambios commiteados
- [ ] No hay errores de TypeScript (bun run typecheck)
- [ ] No hay placeholders (REMOVE_THIS, TODO)
- [ ] Migraciones nuevas son aditivas (no DROP TABLE)
- [ ] routeTree.gen.ts actualizado con nuevas rutas
- [ ] styles.css es el original (no styles.local.css)
```

---

## 5. Para Colaboradores

### 5.1 Clonar el Repo

```bash
git clone https://github.com/villainslabs-git/umain-platform.git
cd umain-platform
```

### 5.2 Setup Local (sin Higgsfield)

```bash
cd app

# Usar package.json local (sin dependencias Higgsfield)
cp package.local.json package.json
cp styles.local.css src/styles.css

# Instalar
npm install

# Desarrollo
npm run dev
# → http://localhost:5173
```

### 5.3 Limitaciones del Entorno Local

| Funcionalidad | Local | Producción |
|---------------|-------|------------|
| UI / Ruteo | ✅ | ✅ |
| Server Functions | ❌ (requiere D1) | ✅ |
| Higgsfield API | ❌ (requiere API key) | ✅ |
| Login | ❌ | ✅ |

### 5.4 Credenciales Demo

| Rol | Email | Password |
|-----|-------|----------|
| Admin | admin@umain.io | demo2026 |

---

## 6. URLs de Referencia

| Recurso | URL |
|---------|-----|
| Repositorio | https://github.com/villainslabs-git/umain-platform |
| Producción | https://umain-platform.higgsfield.app |
| Login | /login |
| Dashboard | /dashboard |
| Settings (Providers) | /settings/providers |
| Consent Gate | /consent-gate |
| Docs | /docs |

---

## 7. Estructura de Ramas

```
main (producción)
  │
  ├── feature/design-v2 ← Estamos aquí
  │   ├── Design System v2
  │   ├── 3 Portales (Talento, Castinera, Agencia)
  │   ├── Avatar Engine (Hybrid Architecture)
  │   ├── Multi-Provider Settings UI
  │   └── Rights Engine
  │
  └── feature/future
      └── (próximas features)
```

---

## 8. Archivos Clave del Proyecto

```
umain-platform/
├── UMAIN_PROJECT_SPEC.md           ← Especificación completa
├── UMAIN_PROJECT_CONTEXT.md        ← Contexto del proyecto
├── UMAIN_SYSTEM_FLOW.md            ← Flujo end-to-end
├── UMAIN_MULTI_PROVIDER_ARCHITECTURE.md ← Arquitectura multi-provider
├── AVATAR_ENGINE_ARCHITECTURE.md   ← Avatar Engine docs
├── UMAIN_HIGGSFIELD_DUAL_WORKFLOW.md ← Triple Pipeline
├── DEPLOYMENT_GUIDE.md             ← Guía de despliegue
├── SETUP_LOCAL_DEV.md              ← Setup local
│
├── app/
│   ├── src/
│   │   ├── lib/
│   │   │   ├── avatar-engine/      ← Avatar Engine (5 archivos)
│   │   │   ├── rights-engine.ts    ← Rights Engine
│   │   │   └── queries.ts          ← Server functions
│   │   │
│   │   ├── routes/                 ← 20+ rutas
│   │   │   ├── settings/providers.tsx ← NUEVO: Multi-provider UI
│   │   │   ├── casting/            ← Portal Castinera
│   │   │   ├── agency/             ← Portal Agencia
│   │   │   └── ...
│   │   │
│   │   └── styles.css              ← Design System v2
│   │
│   └── migrations/                 ← 7 migraciones SQL
│       └── 0007_avatar_engine.sql  ← NUEVO: Multi-provider schema
│
└── preview_v06.html                ← Preview estático (4 talentos)
```

---

## 9. Comandos Útiles

```bash
# Ver estado
git status

# Ver commits
git log --oneline -10

# Ver diferencias
git diff

# Ver archivos modificados
git diff --stat

# Stash cambios temporales
git stash
git stash pop

# Ver remote
git remote -v

# Fetch últimos cambios
git fetch origin

# Pull cambios
git pull origin main
```

---

*Documento generado: Julio 2026*
