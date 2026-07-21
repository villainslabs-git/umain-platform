# UMAIN Platform — Configuracion de Desarrollo Local

> El proyecto depende de paquetes internos de Higgsfield (`@higgsfield/fnf`, `@higgsfield/quanta`)
> que **solo estan disponibles en el ecosistema Higgsfield** y se resuelven al desplegar
> desde el Supercomputer. Para desarrollo local, segui estos pasos.

---

## Paso 1: Instalar dependencias (excluyendo Higgsfield)

```bash
cd app

# Instalar todo (los paquetes Higgsfield fallaran pero el resto funciona)
bun install --ignore-scripts 2>&1 | grep -v "404\|@higgsfield\|not found"

# Alternativa: instalar solo las dependencias que necesitamos
bun add react react-dom @tanstack/react-query @tanstack/react-router @tanstack/react-start
bun add -D typescript @types/react @types/react-dom vite @tailwindcss/vite
```

## Paso 2: Reemplazar el archivo de estilos

El `src/styles.css` original importa `@higgsfield/quanta/tailwind.css`.  
Usar la version local que no tiene esa dependencia:

```bash
cp styles.local.css src/styles.css
```

Para volver al original antes de deployar:

```bash
git checkout src/styles.css
```

## Paso 3: Opcional — Limpiar archivos del template no utilizados

Nuestro codigo (rutas en `src/routes/`) **no importa ningun paquete Higgsfield**.
Los archivos que si importan son del template scaffold y no se ejecutan:

```
src/layouts/          → Layouts pre-armados (no los usamos)
src/components/ui/    → Componentes shadcn legacy
src/lib/quanta-material-icons.ts
src/lib/higgsfield-generation-results.ts
```

Se pueden ignorar o eliminar:

```bash
# Opcional: eliminar archivos no utilizados
rm -rf src/layouts/
rm -rf src/components/ui/
rm src/lib/quanta-material-icons.ts
rm src/lib/higgsfield-generation-results.ts
```

## Paso 4: Iniciar servidor de desarrollo

```bash
bun run dev
# -> http://localhost:3000
```

**Limitaciones del entorno local:**

| Funcionalidad | Local | Produccion |
|---|---|---|
| UI / Ruteo | ✅ Completo | ✅ Completo |
| Template Avatar (datos inline) | ✅ Carga completa | ✅ Carga completa |
| Estilos UMAIN | ✅ (con styles.local.css) | ✅ |
| Server Functions (`createServerFn`) | ❌ (requiere D1) | ✅ Conexion real |
| Login / Auth | ❌ (requiere D1) | ✅ |
| Higgsfield Generacion | ❌ (requiere API key) | ✅ |
| Migraciones D1 | ❌ | ✅ Automaticas |

## Paso 5: Para deployar

```bash
# Restaurar styles.css original
git checkout src/styles.css

# Commit, push y deploy desde Supercomputer
git add -A && git commit -m "cambios"
git push origin main
# → deploy_website(website_id="<ID>")
```

---

## Troubleshooting Local

### Error: `Cannot find module '@higgsfield/quanta/...'`

**Causa:** Algún archivo del template importa Quanta.
**Solucion:** Verificar que no haya imports de Higgsfield en los archivos que se estan ejecutando:

```bash
grep -r "@higgsfield" src/routes/ src/components/sidebar.tsx src/lib/queries.ts src/lib/umain-types.ts
```

Ninguno de nuestros archivos deberia tener imports Higgsfield. Si aparece, reemplazar con codigo UMAIN nativo.

### Error: `Could not resolve "cloudflare:workers"`

**Causa:** Las server functions importan `cloudflare:workers` que solo existe en Workers runtime.
**Solucion:** Normal. El desarrollo local solo permite UI y ruteo. Las server functions fallan en local.

### Error: `The `@tailwindcss/vite` plugin is not set up`

**Solucion:**

```bash
bun add -D @tailwindcss/vite
```

Verificar que `vite.config.ts` incluya el plugin.

---

## Arquitectura de Archivos

```
src/
├── routes/           → 14 paginas (SIN imports Higgsfield)
│   ├── login.tsx
│   ├── dashboard/
│   ├── identities/
│   ├── jobs/
│   ├── settings/
│   ├── docs/
│   └── ...
├── components/
│   ├── sidebar.tsx   → Nav sidebar (SIN imports Higgsfield)
│   └── ui/           → Template scaffold (NO USAR)
├── lib/
│   ├── queries.ts    → Server functions (SIN imports Higgsfield)
│   └── umain-types.ts → Types (SIN imports Higgsfield)
├── layouts/          → Template scaffold (NO USAR)
└── styles.css        → Original (importa Quanta — reemplazar para local)
```

**Regla:** Todo archivo en `src/routes/`, `src/components/sidebar.tsx`, `src/lib/queries.ts` y `src/lib/umain-types.ts` debe poder importarse sin dependencias Higgsfield. Si alguno falla, reportarlo.
