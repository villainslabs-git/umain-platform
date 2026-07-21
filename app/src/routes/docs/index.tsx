import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "../../components/sidebar";
import { useState } from "react";

export const Route = createFileRoute("/docs/")({
  component: DocsPage,
});

// ============================================================
// TABLE OF CONTENTS
// ============================================================
const SECTIONS = [
  { id: "stack", title: "Stack Tecnologico" },
  { id: "estructura", title: "Estructura del Proyecto" },
  { id: "design-system", title: "Design System" },
  { id: "database", title: "Base de Datos" },
  { id: "routes", title: "Sistema de Rutas" },
  { id: "server-functions", title: "Server Functions" },
  { id: "modules", title: "Modulos UI" },
  { id: "workflow", title: "Workflow Generacion — Triple Pipeline" },
  { id: "pipeline-a", title: "  Pipeline A: Identity (Soul ID 2.0)" },
  { id: "pipeline-b", title: "  Pipeline B: Creativity (GPT Image 2 + Nano Banana Pro)" },
  { id: "pipeline-c", title: "  Pipeline C: Facial Correction (Seedream V5 Pro)" },
  { id: "rights-engine", title: "  Compuerta de Consentimiento" },
  { id: "approval", title: "  Aprobacion Talento" },
  { id: "master", title: "  Character Sheet Master" },
  { id: "quality-gate", title: "  Quality Gate System" },
  { id: "models", title: "Modelos Higgsfield — Matriz Definitiva" },
  { id: "costos", title: "Costos Estimados" },
  { id: "deployment", title: "Guia de Despliegue" },
  { id: "credentials", title: "Credenciales Demo" },
  { id: "urls", title: "URLs de Referencia" },
  { id: "next", title: "Proximos Pasos (F1)" },
];

const DOC_VERSION = "v0.2.0 — Triple Pipeline v2.1.0";
const LAST_UPDATED = "Julio 15, 2026";

function DocsPage() {
  const [activeSection, setActiveSection] = useState("stack");

  return (
    <div className="umain-layout">
      <Sidebar />
      <main className="umain-main" style={{maxWidth:'1200px'}}>
        {/* Header */}
        <div className="umain-page-header" style={{marginBottom:'1.5rem'}}>
          <div>
            <h1 style={{fontSize:'1.75rem'}}>Documentacion Tecnica</h1>
            <p className="formula-text mt-1">
              <span className="formula-text--accent">UMAIN Platform</span> — {DOC_VERSION}
            </p>
            <p className="formula-text" style={{fontSize:'0.7rem', color:'var(--color-umain-text-dim)', marginTop:'0.25rem'}}>
              Ultima actualizacion: {LAST_UPDATED}
            </p>
          </div>
          <div className="umain-page-header__actions">
            <a href="/docs/raw" className="umain-button-outline" style={{fontSize:'0.75rem'}}>
              Ver raw .md
            </a>
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'260px 1fr', gap:'2rem'}}>
          {/* Sidebar de navegacion */}
          <div className="umain-card" style={{position:'sticky', top:'1rem', alignSelf:'flex-start', maxHeight:'calc(100vh - 6rem)', overflowY:'auto'}}>
            <div className="umain-card__header">
              <span className="formula-text formula-text--accent" style={{fontSize:'0.65rem', textTransform:'uppercase'}}>
                SECCIONES
              </span>
            </div>
            <div style={{padding:'0.5rem'}}>
              {SECTIONS.map(s => (
                <button key={s.id} onClick={() => {
                  setActiveSection(s.id);
                  document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                  style={{
                    display:'block', width:'100%', textAlign:'left', padding:'0.3rem 0.5rem',
                    fontSize: s.id.startsWith('pipeline') || s.id === 'rights-engine' || s.id === 'approval' || s.id === 'master' || s.id === 'quality-gate' ? '0.65rem' : '0.75rem',
                    fontFamily: s.id.startsWith('pipeline') || s.id === 'rights-engine' || s.id === 'approval' || s.id === 'master' || s.id === 'quality-gate' ? "'Geist Mono', monospace" : "'Geist', sans-serif",
                    color: activeSection === s.id ? 'var(--color-umain-accent)' : 'var(--color-umain-text-secondary)',
                    background: activeSection === s.id ? 'var(--color-umain-accent-dim)' : 'transparent',
                    border: 'none', borderRadius: '0.25rem', cursor: 'pointer',
                    borderLeft: activeSection === s.id ? '2px solid var(--color-umain-accent)' : '2px solid transparent',
                    paddingLeft: activeSection === s.id ? '0.5rem' : '0.65rem',
                    transition: 'all 0.15s',
                  }}>
                  {s.title}
                </button>
              ))}
            </div>
          </div>

          {/* Contenido */}
          <div style={{minWidth:0}}>
            {/* 1. STACK */}
            <DocSection id="stack" title="1. Stack Tecnologico">
              <table className="umain-table">
                <thead><tr><th>Componente</th><th>Tecnologia</th></tr></thead>
                <tbody>
                  <tr><td>Framework</td><td>React 19 + TanStack Start (SSR en Cloudflare Worker)</td></tr>
                  <tr><td>Lenguaje</td><td>TypeScript 5.8+</td></tr>
                  <tr><td>Estilos</td><td>Tailwind v4 + CSS custom (UMAIN Design System)</td></tr>
                  <tr><td>Base de datos</td><td>Cloudflare D1 (SQLite serverless)</td></tr>
                  <tr><td>Storage</td><td>Cloudflare R2</td></tr>
                  <tr><td>Ruteo</td><td>TanStack Router v1 (file-based en routes/)</td></tr>
                  <tr><td>Server Functions</td><td>createServerFn de @tanstack/react-start</td></tr>
                  <tr><td>Build</td><td>Vite 7 + bun</td></tr>
                  <tr><td>Despliegue</td><td>Cloudflare Workers (single Worker SSR)</td></tr>
                  <tr><td>Generacion</td><td>Higgsfield API via capa de abstraccion interna</td></tr>
                </tbody>
              </table>
            </DocSection>

            {/* 2. ESTRUCTURA */}
            <DocSection id="estructura" title="2. Estructura del Proyecto">
              <div className="wireframe-box" style={{padding:'1.25rem', fontFamily:"'Geist Mono', monospace", fontSize:'0.75rem', lineHeight:'1.6', whiteSpace:'pre'}}>
{`umain-platform/
├── app/
│   ├── migrations/          # DDL secuencial (4 migraciones)
│   ├── src/
│   │   ├── components/
│   │   │   └── sidebar.tsx
│   │   ├── lib/
│   │   │   ├── queries.ts        # 17 server functions
│   │   │   ├── umain-types.ts    # Types + constantes
│   │   │   └── bindings.server.ts
│   │   ├── routes/               # 14 rutas file-based
│   │   │   ├── __root.tsx
│   │   │   ├── login.tsx
│   │   │   ├── dashboard/
│   │   │   ├── identities/
│   │   │   ├── campaigns/
│   │   │   ├── licenses/
│   │   │   ├── jobs/
│   │   │   ├── audit-log/
│   │   │   ├── legal/
│   │   │   ├── settings/
│   │   │   ├── approval/
│   │   │   └── docs/
│   │   ├── styles.css           # Design system completo
│   │   └── routeTree.gen.ts     # Arbol de rutas
│   ├── app.manifest.json
│   └── package.json
└── UMAIN_PROJECT_SPEC.md`}
              </div>
            </DocSection>

            {/* 3. DESIGN SYSTEM */}
            <DocSection id="design-system" title="3. Design System (UMAIN Custom CSS)">
              <p className="mb-4" style={{color:'var(--color-umain-text-secondary)', lineHeight:'1.6'}}>
                Tema oscuro permanente con grilla matematica de fondo (20px), gradiente rosa suave en esquina superior derecha.
                Tipografia Geist (titulares bold) + Geist Mono (etiquetas tecnicas).
              </p>
              <h4 className="formula-text formula-text--accent mb-2" style={{fontSize:'0.75rem', textTransform:'uppercase'}}>Paleta de Colores</h4>
              <table className="umain-table mb-4">
                <thead><tr><th>Token</th><th>Hex</th><th>Uso</th></tr></thead>
                <tbody>
                  <tr><td>--color-umain-bg</td><td><code>#0a0e1a</code></td><td>Fondo principal</td></tr>
                  <tr><td>--color-umain-surface</td><td><code>#111827</code></td><td>Superficie de cards</td></tr>
                  <tr><td>--color-umain-accent</td><td><span style={{color:'#7dd4fc'}}>#7dd4fc</span></td><td>Cian pastel (primario)</td></tr>
                  <tr><td>--color-umain-accent-secondary</td><td><span style={{color:'#f4a8c8'}}>#f4a8c8</span></td><td>Rosa suave (secundario)</td></tr>
                  <tr><td>--color-umain-text</td><td><code>#e2e8f0</code></td><td>Texto principal</td></tr>
                  <tr><td>--color-umain-border</td><td><code>#1e293b</code></td><td>Bordes</td></tr>
                </tbody>
              </table>
              <h4 className="formula-text formula-text--accent mb-2" style={{fontSize:'0.75rem', textTransform:'uppercase'}}>Componentes Disponibles</h4>
              <div style={{display:'flex', gap:'0.5rem', flexWrap:'wrap'}}>
                {['wireframe-box','formula-text','umain-card','umain-button-primary','umain-button-secondary','umain-button-outline','umain-button-ghost','umain-status-badge','umain-input','umain-table','umain-stat-card','umain-modal','umain-tag','umain-skeleton'].map(c => (
                  <span key={c} className="umain-tag" style={{fontSize:'0.65rem'}}>{c}</span>
                ))}
              </div>
            </DocSection>

            {/* 4. DATABASE */}
            <DocSection id="database" title="4. Base de Datos (D1 SQLite)">
              <p className="mb-3" style={{color:'var(--color-umain-text-secondary)', lineHeight:'1.6'}}>
                16 tablas. Reglas criticas: AuditLog append-only con triggers que abortan UPDATE/DELETE,
                hash chain SHA-256 con firma ed25519, borrado logico de identidades, FK obligatoria jobs→licenses.
              </p>
              <table className="umain-table">
                <thead><tr><th>Tabla</th><th>Proposito</th></tr></thead>
                <tbody>
                  <tr><td>users</td><td>Autenticacion (roles: admin, comercial, talento, agencia)</td></tr>
                  <tr><td>identities</td><td>Talentos (tier A/B/C, estado activo/suspendido/suprimido)</td></tr>
                  <tr><td>identity_packs</td><td>Activos biometricos cifrados AES-256</td></tr>
                  <tr><td>consent_matrices</td><td>65 categorias IAB con estados por talento</td></tr>
                  <tr><td>campaigns</td><td>Campanas publicitarias</td></tr>
                  <tr><td>licenses</td><td>Tokens de licencia con JWT y alcance</td></tr>
                  <tr><td>generation_jobs</td><td>Solicitudes de generacion (tipo, proveedor, estado)</td></tr>
                  <tr><td>audit_log</td><td>Registro inmutable encadenado (append-only)</td></tr>
                  <tr><td>providers</td><td>Configuracion de APIs (Higgsfield, Flux, etc.)</td></tr>
                  <tr><td>character_sheets</td><td>Fichas de personaje para avatares</td></tr>
                  <tr><td>character_assets</td><td>Assets del character sheet (fotos, video, audio)</td></tr>
                  <tr><td>character_attributes</td><td>Atributos del personaje (clave/valor/fuente)</td></tr>
                </tbody>
              </table>
            </DocSection>

            {/* 5. ROUTES */}
            <DocSection id="routes" title="5. Sistema de Rutas">
              <table className="umain-table">
                <thead><tr><th>Ruta</th><th>Descripcion</th></tr></thead>
                <tbody>
                  <tr><td><code>/login</code></td><td>Autenticacion (demo@umain.io / demo2026)</td></tr>
                  <tr><td><code>/dashboard</code></td><td>Dashboard con stats del sistema</td></tr>
                  <tr><td><code>/identities</code></td><td>Listado de talentos</td></tr>
                  <tr><td><code>/identities/$id</code></td><td>Detalle del talento + acciones</td></tr>
                  <tr><td><code>/identities/$id/consent-matrix</code></td><td>Editor 65 categorias IAB</td></tr>
                  <tr><td><code>/identities/$id/avatar</code></td><td>Character Sheet + creacion avatar</td></tr>
                  <tr><td><code>/campaigns</code></td><td>Campanas publicitarias</td></tr>
                  <tr><td><code>/licenses</code></td><td>Licencias y tokens</td></tr>
                  <tr><td><code>/jobs</code></td><td>Jobs de generacion + compuerta consentimiento</td></tr>
                  <tr><td><code>/audit-log</code></td><td>AuditLog inmutable</td></tr>
                  <tr><td><code>/legal</code></td><td>Biblioteca legal</td></tr>
                  <tr><td><code>/settings</code></td><td>Configuracion de proveedores API</td></tr>
                  <tr><td><code>/approval/$token</code></td><td>Magic link aprobacion talento</td></tr>
                  <tr><td><code>/docs</code></td><td>Documentacion tecnica (esta pagina)</td></tr>
                </tbody>
              </table>
            </DocSection>

            {/* 6. SERVER FUNCTIONS */}
            <DocSection id="server-functions" title="6. Server Functions">
              <p className="mb-3" style={{color:'var(--color-umain-text-secondary)', lineHeight:'1.6'}}>
                17 funciones implementadas via createServerFn en <code>src/lib/queries.ts</code>.
                Se conectan a D1 mediante Cloudflare Workers binding.
              </p>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem'}}>
                {[
                  'getDashboardStats', 'getIdentities', 'getIdentity(id)', 'getConsentMatrix(id)',
                  'getCampaigns', 'getLicenses', 'getJobs', 'getAuditLog', 'getLegalDocuments',
                  'getProviders', 'saveProvider', 'validateProvider', 'deleteProvider',
                  'getSettings', 'saveSetting', 'loginUser', 'getCharacterSheet(id)'
                ].map(fn => (
                  <div key={fn} className="formula-text" style={{fontSize:'0.7rem', padding:'0.375rem 0.5rem', background:'var(--color-umain-surface-alt)', borderRadius:'0.25rem', border:'1px solid var(--color-umain-border)'}}>
                    {fn}
                  </div>
                ))}
              </div>
            </DocSection>

            {/* 7. MODULOS UI */}
            <DocSection id="modules" title="7. Modulos UI">
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem'}}>
                {[
                  { name: 'Login', desc: 'Formulario wireframe con credenciales demo', route: '/login' },
                  { name: 'Dashboard', desc: '6 stat cards + actividad reciente + estado Rights Engine', route: '/dashboard' },
                  { name: 'Talentos', desc: 'Tabla CRUD con badges de estado', route: '/identities' },
                  { name: 'Matriz Consentimiento', desc: '65 categorias IAB con selector rapido de estado', route: '/identities/$id/consent-matrix' },
                  { name: 'Character Sheet', desc: '3 columnas: Assets → Preview → Editor con auto-generacion', route: '/identities/$id/avatar' },
                  { name: 'Jobs', desc: 'Panel Higgsfield + compuerta de consentimiento (5 pasos)', route: '/jobs' },
                  { name: 'AuditLog', desc: 'Tabla inmutable con cadena SHA-256', route: '/audit-log' },
                  { name: 'Settings', desc: 'CRUD proveedores API con validacion', route: '/settings' },
                  { name: 'Approval', desc: 'Magic link con preview + aprobar/rechazar', route: '/approval/$token' },
                  { name: 'Docs', desc: 'Documentacion tecnica del proyecto', route: '/docs' },
                ].map(m => (
                  <div key={m.name} className="wireframe-box" style={{padding:'0.75rem'}}>
                    <div className="formula-text formula-text--accent" style={{fontSize:'0.7rem'}}>{m.name}</div>
                    <p className="formula-text" style={{fontSize:'0.7rem', color:'var(--color-umain-text-secondary)', marginTop:'0.25rem'}}>{m.desc}</p>
                    <div className="formula-text" style={{fontSize:'0.6rem', color:'var(--color-umain-text-dim)', marginTop:'0.25rem'}}>{m.route}</div>
                  </div>
                ))}
              </div>
            </DocSection>

            {/* 8. TRIPLE PIPELINE */}
            <DocSection id="workflow" title="8. Workflow Generacion — Triple Pipeline Architecture">
              <div className="wireframe-box" style={{padding:'1rem', marginBottom:'1rem', borderLeft:'3px solid var(--color-umain-accent)'}}>
                <p className="formula-text formula-text--accent" style={{fontSize:'0.75rem'}}>
                  Version 2.1.0 — Aprobado para implementacion
                </p>
              </div>

              <div className="wireframe-box" style={{padding:'1.25rem', fontFamily:"'Geist Mono', monospace", fontSize:'0.7rem', lineHeight:'1.6', whiteSpace:'pre', marginBottom:'1rem'}}>
{`CHARACTER SHEET (UI)
    │
    ├── 20-30 fotos ─────► PIPELINE A ──► Face DNA (Soul ID 2.0)
    ├── Referencias ─────► PIPELINE B ──► Creative shots (GPT Image 2 / Nano Banana Pro)
    └── Audio ───────────► Seed Audio ──► Voice clone

PIPELINE B outputs
    │
    ▼
PIPELINE C (Seedream V5 Pro) ──► Correccion facial adaptativa contra Soul ID
    │
    ▼
CHARACTER SHEET MASTER (organizado por categorias)`}
              </div>

              <h4 className="formula-text formula-text--accent mb-2" style={{fontSize:'0.75rem', textTransform:'uppercase'}}>Los 3 Pipelines</h4>
              <table className="umain-table">
                <thead><tr><th>Pipeline</th><th>Proposito</th><th>Modelos</th><th>Consistencia Facial</th></tr></thead>
                <tbody>
                  <tr><td><span className="formula-text formula-text--accent">A — Identity</span></td><td>DNA facial inmutable</td><td>Soul ID 2.0</td><td>~98%</td></tr>
                  <tr><td><span className="formula-text formula-text--pink">B — Creativity</span></td><td>Control creativo con referencias</td><td>GPT Image 2 / Nano Banana Pro</td><td>~70-80% (sin C)</td></tr>
                  <tr><td><span style={{color:'#22c55e'}}>C — Correction</span></td><td>Correccion facial post-generacion</td><td>Seedream V5 Pro</td><td>~95%+ (con C)</td></tr>
                </tbody>
              </table>
            </DocSection>

            {/* PIPELINE A */}
            <DocSection id="pipeline-a" title="8a. Pipeline A: Identity (Soul ID 2.0)">
              <p className="mb-3" style={{color:'var(--color-umain-text-secondary)', lineHeight:'1.6'}}>
                Se ejecuta UNA VEZ por talento. Output reusable en todas las generaciones futuras.
              </p>
              <div className="wireframe-box" style={{padding:'1rem', marginBottom:'1rem'}}>
                <div className="formula-text formula-text--accent" style={{fontSize:'0.7rem', marginBottom:'0.5rem', textTransform:'uppercase'}}>
                  INPUT: 20-30 FOTOS
                </div>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem', fontSize:'0.75rem'}}>
                  <div>5x Frontal neutral</div>
                  <div>5x Perfil 45°</div>
                  <div>5x 3/4 view</div>
                  <div>5x Expresiones (neutral, sonrisa, seria, riendo, pensativa)</div>
                  <div>5x Iluminacion (natural, estudio, contraluz, tungsteno, fluorescente)</div>
                </div>
              </div>
              <div className="wireframe-box" style={{padding:'1rem'}}>
                <div className="formula-text formula-text--accent" style={{fontSize:'0.7rem', marginBottom:'0.5rem', textTransform:'uppercase'}}>
                  EJECUCION
                </div>
                <div className="formula-text" style={{fontSize:'0.75rem', lineHeight:'2'}}>
                  1. higgsfield_upload(files=[20-30 fotos]) → IDs<br />
                  2. higgsfield_soul_id(action="create", name="...", variant="soul-2", poll=true) → reference_id (~40 creditos)<br />
                  3. higgsfield_element(action="create", category="character_ip_verified", ...) → element_id<br />
                  4. Opcional: higgsfield_audio_generate(type="seed_audio", mode="voice_clone") → voice_id
                </div>
              </div>
            </DocSection>

            {/* PIPELINE B */}
            <DocSection id="pipeline-b" title="8b. Pipeline B: Creativity (GPT Image 2 + Nano Banana Pro)">
              <p className="mb-3" style={{color:'var(--color-umain-text-secondary)', lineHeight:'1.6'}}>
                Generacion con control creativo total usando referencias visuales de outfit, entorno, props y pose.
              </p>
              <div className="wireframe-box" style={{padding:'1rem', marginBottom:'1rem'}}>
                <div className="formula-text formula-text--pink" style={{fontSize:'0.7rem', marginBottom:'0.5rem', textTransform:'uppercase'}}>
                  JERARQUIA NANO BANANA
                </div>
                <table className="umain-table">
                  <thead><tr><th>Version</th><th>Calidad</th><th>Uso</th></tr></thead>
                  <tbody>
                    <tr><td><span className="umain-status-badge umain-status-badge--active">nano_banana_pro</span></td><td>Maxima</td><td>Pipeline B principal: style transfer, batch, consistency lock</td></tr>
                    <tr><td>nano_banana_2</td><td>Alta</td><td>Fallback si pro no disponible</td></tr>
                    <tr><td>nano_banana_2_lite</td><td>Estandar</td><td>Drafts / pruebas rapidas</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="wireframe-box" style={{padding:'1rem'}}>
                <div className="formula-text formula-text--pink" style={{fontSize:'0.7rem', marginBottom:'0.5rem', textTransform:'uppercase'}}>
                  SELECCION DE MODELO POR CASO
                </div>
                <table className="umain-table">
                  <thead><tr><th>Caso</th><th>Modelo</th><th>Razon</th></tr></thead>
                  <tbody>
                    <tr><td>Outfit + entorno especifico</td><td>GPT Image 2</td><td>Referencias + texto simultaneo</td></tr>
                    <tr><td>Product placement</td><td>GPT Image 2</td><td>Edicion quirurgica, texto en empaque</td></tr>
                    <tr><td>Batch de variaciones</td><td>Nano Banana Pro</td><td>Multi-referencia + consistency lock</td></tr>
                    <tr><td>Style transfer / artistico</td><td>Nano Banana Pro</td><td>Control de estilo superior</td></tr>
                    <tr><td>Control de pose via dibujo</td><td>Nano Banana Pro</td><td>Soporte nativo de pose reference</td></tr>
                  </tbody>
                </table>
              </div>
            </DocSection>

            {/* PIPELINE C */}
            <DocSection id="pipeline-c" title="8c. Pipeline C: Facial Correction (Seedream V5 Pro)">
              <div className="wireframe-box" style={{padding:'1rem', marginBottom:'1rem', borderLeft:'3px solid var(--color-umain-accent)'}}>
                <p className="formula-text" style={{fontSize:'0.75rem', color:'var(--color-umain-text-secondary)', lineHeight:'1.6'}}>
                  Sin Pipeline C: GPT Image 2 produce ~70-80% match facial, Nano Banana Pro ~75-85%.<br />
                  <strong className="formula-text--accent">Con Pipeline C: ~95%+ match facial.</strong>
                </p>
              </div>
              <div className="wireframe-box" style={{padding:'1rem'}}>
                <div className="formula-text formula-text--accent" style={{fontSize:'0.7rem', marginBottom:'0.5rem', textTransform:'uppercase'}}>
                  ALGORITMO ADAPTIVE CORRECTION STRENGTH
                </div>
                <div className="formula-text" style={{fontSize:'0.7rem', lineHeight:'1.8', fontFamily:"'Geist Mono', monospace", whiteSpace:'pre', background:'var(--color-umain-surface-alt)', padding:'0.75rem', borderRadius:'0.375rem', border:'1px solid var(--color-umain-border)'}}>
{`1. Medir initial_score contra Soul ID
2. Si >= 0.90 → SALTAR (ahorra creditos)
3. Si >= 0.85 → correction_strength: 0.70 (ligero)
   Si >= 0.80 → correction_strength: 0.80 (medio)
   Si >= 0.75 → correction_strength: 0.85 (fuerte)
   Si < 0.75  → correction_strength: 0.90 (maximo)
4. Aplicar Seedream V5 Pro
5. Si final_score < 0.85 → escalar +0.05 (max 1 vez)
6. Preservar: outfit, environment, pose, props, lighting`}
                </div>
              </div>
            </DocSection>

            {/* RIGHTS ENGINE */}
            <DocSection id="rights-engine" title="8d. Compuerta de Consentimiento (Rights Engine)">
              <p className="mb-3" style={{color:'var(--color-umain-text-secondary)', lineHeight:'1.6'}}>
                5 validaciones antes de tocar cualquier API de generacion.
              </p>
              <div style={{display:'flex', gap:'0.5rem', flexWrap:'wrap'}}>
                {[
                  { step: '1', label: 'Validar token JWT', icon: '✓', ok: true },
                  { step: '2', label: 'Validar alcance', icon: '✓', ok: true },
                  { step: '3', label: 'Validar matriz', icon: '✓', ok: true },
                  { step: '4', label: 'Validar exclusividad', icon: '✓', ok: true },
                  { step: '5', label: 'Generar via Higgsfield + AuditLog', icon: '◈', ok: true },
                ].map(v => (
                  <div key={v.step} className="umain-tag" style={{
                    padding:'0.5rem 0.75rem',
                    borderColor: v.ok ? 'rgba(34,197,94,0.3)' : 'var(--color-umain-border)',
                    color: v.ok ? '#22c55e' : 'var(--color-umain-text-dim)',
                    display:'flex', alignItems:'center', gap:'0.375rem',
                  }}>
                    <span>{v.icon}</span>
                    <span className="formula-text">{v.step}. {v.label}</span>
                  </div>
                ))}
              </div>
            </DocSection>

            {/* APPROVAL */}
            <DocSection id="approval" title="8e. Aprobacion Talento">
              <div className="wireframe-box" style={{padding:'1rem'}}>
                <div className="formula-text" style={{fontSize:'0.75rem', lineHeight:'2'}}>
                  1. Job completado → magic link al talento (WhatsApp/SMS, 72h expiracion)<br />
                  2. Talento ve condiciones + preview del material final<br />
                  3. Decision: Aprobar / Rechazar / Solicitar cambios<br />
                  4. Hash del material visto queda registrado en Approval (defensa legal)<br />
                  5. Aprobado → licencia pasa a vigente, se emite token JWT
                </div>
              </div>
            </DocSection>

            {/* CHARACTER SHEET MASTER */}
            <DocSection id="master" title="8f. Character Sheet Master">
              <div className="wireframe-box" style={{padding:'1rem', fontFamily:"'Geist Mono', monospace", fontSize:'0.7rem', lineHeight:'1.6', whiteSpace:'pre'}}>
{`character_sheet_master/{identity_id}/
    metadata.json
    identity/        → soul_id_reference.jpg, character_element.mp4, voice_clone.mp3
    headshots/       → Pipeline A (Soul ID directo)
    outfits/         → Pipeline B + C
    environments/    → Pipeline B + C
    poses/           → Pipeline B + C
    props/           → Pipeline B + C (con producto)
    variations/      → Estilos alternativos`}
              </div>
            </DocSection>

            {/* QUALITY GATE */}
            <DocSection id="quality-gate" title="8g. Quality Gate System">
              <table className="umain-table">
                <thead><tr><th>Check</th><th>PASS</th><th>REVIEW</th><th>FAIL</th></tr></thead>
                <tbody>
                  <tr><td>Face match score</td><td><span className="umain-status-badge umain-status-badge--active">{'>='} 0.85</span></td><td><span className="umain-status-badge umain-status-badge--pending">0.70-0.84</span></td><td><span className="umain-status-badge umain-status-badge--error">{'<'} 0.70</span></td></tr>
                  <tr><td>Visual quality</td><td><span className="umain-status-badge umain-status-badge--active">{'>='} 0.80</span></td><td><span className="umain-status-badge umain-status-badge--pending">0.65-0.79</span></td><td><span className="umain-status-badge umain-status-badge--error">{'<'} 0.65</span></td></tr>
                  <tr><td>Reference adherence</td><td><span className="umain-status-badge umain-status-badge--active">{'>='} 0.75</span></td><td><span className="umain-status-badge umain-status-badge--pending">0.60-0.74</span></td><td><span className="umain-status-badge umain-status-badge--error">{'<'} 0.60</span></td></tr>
                </tbody>
              </table>
            </DocSection>

            {/* MODELOS */}
            <DocSection id="models" title="9. Modelos Higgsfield — Matriz de Decision Definitiva">
              <table className="umain-table">
                <thead><tr><th>Tarea</th><th>Modelo Primario</th><th>Fallback</th><th>Costo (creditos)</th></tr></thead>
                <tbody>
                  <tr><td>Entrenamiento identidad</td><td><span className="umain-status-badge umain-status-badge--active">Soul ID 2.0</span></td><td>—</td><td>~40 (one-time)</td></tr>
                  <tr><td>Headshots corporativos</td><td>text2image_soul_v2</td><td>—</td><td>1-2</td></tr>
                  <tr><td>Outfit + entorno especifico</td><td>gpt_image_2</td><td>nano_banana_pro</td><td>2-3</td></tr>
                  <tr><td>Batch variaciones outfit</td><td>nano_banana_pro</td><td>nano_banana_2</td><td>2-3</td></tr>
                  <tr><td>Style transfer / artistico</td><td>nano_banana_pro</td><td>—</td><td>2-3</td></tr>
                  <tr><td>Correccion facial post-gen</td><td>seedream_v5_pro</td><td>—</td><td>2-3</td></tr>
                  <tr><td>Video avatar</td><td>seedance_2_0</td><td>kling3_0</td><td>5-10</td></tr>
                  <tr><td>Clonacion voz</td><td>seed_audio</td><td>ElevenLabs</td><td>5-10</td></tr>
                  <tr><td>Texto en imagen</td><td>gpt_image_2</td><td>—</td><td>2-3</td></tr>
                  <tr><td>Pose via dibujo</td><td>nano_banana_pro</td><td>—</td><td>2-3</td></tr>
                </tbody>
              </table>
            </DocSection>

            {/* COSTOS */}
            <DocSection id="costos" title="Costos Estimados">
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem'}}>
                <div className="wireframe-box" style={{padding:'1rem'}}>
                  <div className="formula-text formula-text--accent" style={{fontSize:'0.7rem', marginBottom:'0.75rem', textTransform:'uppercase'}}>
                    SETUP POR AVATAR (~25 assets)
                  </div>
                  <table className="umain-table">
                    <tbody>
                      <tr><td>Soul ID Training</td><td style={{textAlign:'right'}}>~40 creditos</td></tr>
                      <tr><td>Pipeline A headshots (3)</td><td style={{textAlign:'right'}}>~3-6</td></tr>
                      <tr><td>Pipeline B GPT Image 2 (12)</td><td style={{textAlign:'right'}}>~24-36</td></tr>
                      <tr><td>Pipeline B Nano Banana Pro (10)</td><td style={{textAlign:'right'}}>~20-30</td></tr>
                      <tr><td>Pipeline C correcciones (22)</td><td style={{textAlign:'right'}}>~50-60</td></tr>
                      <tr><td>Voice clone</td><td style={{textAlign:'right'}}>~5-10</td></tr>
                      <tr style={{borderTop:'2px solid var(--color-umain-accent)'}}>
                        <td><strong className="formula-text--accent">Total setup</strong></td>
                        <td style={{textAlign:'right'}}><strong className="formula-text--accent">~130-170 creditos</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="wireframe-box" style={{padding:'1rem'}}>
                  <div className="formula-text formula-text--pink" style={{fontSize:'0.7rem', marginBottom:'0.75rem', textTransform:'uppercase'}}>
                    POR CAMPANA
                  </div>
                  <table className="umain-table">
                    <tbody>
                      <tr><td>1 imagen + 1 video</td><td style={{textAlign:'right'}}>~7-15 creditos</td></tr>
                      <tr><td>Nueva variacion outfit</td><td style={{textAlign:'right'}}>~2-3</td></tr>
                      <tr><td>Nuevo entorno</td><td style={{textAlign:'right'}}>~2-3</td></tr>
                      <tr><td>Video clip 5-10s</td><td style={{textAlign:'right'}}>~5-10</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </DocSection>

            {/* DEPLOYMENT */}
            <DocSection id="deployment" title="10. Guia de Despliegue">
              <div className="wireframe-box" style={{padding:'1rem', marginBottom:'1rem', borderLeft:'3px solid var(--color-umain-accent)'}}>
                <p className="formula-text" style={{fontSize:'0.75rem', lineHeight:'1.6'}}>
                  Documento completo de despliegue en <code className="formula-text--accent">DEPLOYMENT_GUIDE.md</code> en la raiz del repositorio.
                </p>
              </div>

              <h4 className="formula-text formula-text--accent mb-2" style={{fontSize:'0.75rem', textTransform:'uppercase'}}>Flujo de Despliegue</h4>
              <div className="wireframe-box" style={{padding:'1rem', marginBottom:'1rem', fontFamily:"'Geist Mono', monospace", fontSize:'0.7rem', lineHeight:'2'}}>
                {`deploy_website(website_id="<ID>")`}<br />
                <span style={{color:'var(--color-umain-text-dim)'}}>{`  → bun install`}</span><br />
                <span style={{color:'var(--color-umain-text-dim)'}}>{`  → tsc --noEmit (typecheck)`}</span><br />
                <span style={{color:'var(--color-umain-text-dim)'}}>{`  → vite build (client + SSR)`}</span><br />
                <span style={{color:'var(--color-umain-text-dim)'}}>{`  → D1 migrations (pendientes)`}</span><br />
                <span style={{color:'var(--color-umain-accent)'}}>{`  → Cloudflare Worker deployed`}</span>
              </div>

              <h4 className="formula-text formula-text--pink mb-2" style={{fontSize:'0.75rem', textTransform:'uppercase'}}>Actualizacion Rapida</h4>
              <div className="wireframe-box" style={{padding:'1rem', marginBottom:'1rem', fontFamily:"'Geist Mono', monospace", fontSize:'0.7rem', lineHeight:'1.8'}}>
                {`git add -A && git commit -m "descripcion"`}<br />
                {`git push origin main`}<br />
                {`deploy_website(website_id="<ID>")`}
              </div>

              <h4 className="formula-text mb-2" style={{fontSize:'0.75rem', textTransform:'uppercase', color:'var(--color-umain-text-dim)'}}>Checklist Pre-Deploy</h4>
              <div style={{display:'flex', flexDirection:'column', gap:'0.375rem'}}>
                {[
                  'bun run build compila sin errores',
                  'No hay placeholders (REMOVE_THIS, TODO)',
                  'Migraciones nuevas son aditivas (no DROP)',
                  'routeTree.gen.ts refleja rutas nuevas',
                  'Template demo carga correctamente',
                ].map((item, i) => (
                  <div key={i} className="formula-text" style={{fontSize:'0.7rem', display:'flex', gap:'0.5rem', alignItems:'center'}}>
                    <span className="umain-status-badge umain-status-badge--active" style={{fontSize:'0.55rem', padding:'0.1rem 0.3rem'}}>CHECK</span>
                    {item}
                  </div>
                ))}
              </div>
            </DocSection>

            {/* CREDENTIALS */}
            <DocSection id="credentials" title="Credenciales Demo">
              <div className="wireframe-box" style={{padding:'1rem', maxWidth:'400px'}}>
                <table className="umain-table">
                  <thead><tr><th>Rol</th><th>Email</th><th>Password</th></tr></thead>
                  <tbody>
                    <tr><td><span className="umain-status-badge umain-status-badge--active">Admin</span></td><td className="formula-text">demo@umain.io</td><td className="formula-text">demo2026</td></tr>
                  </tbody>
                </table>
              </div>
            </DocSection>

            {/* URLS */}
            <DocSection id="urls" title="URLs de Referencia">
              <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                {[
                  { label: 'Sitio en vivo', url: 'https://umain-platform.higgsfield.app' },
                  { label: 'Template Avatar Demo', url: '/identities/template-identity-001/avatar/' },
                  { label: 'Login', url: '/login' },
                  { label: 'Dashboard', url: '/dashboard' },
                  { label: 'Configuracion APIs', url: '/settings' },
                ].map(u => (
                  <div key={u.label} className="wireframe-box" style={{padding:'0.5rem 0.75rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <span className="formula-text" style={{fontSize:'0.7rem'}}>{u.label}</span>
                    <code className="formula-text formula-text--accent" style={{fontSize:'0.7rem'}}>{u.url}</code>
                  </div>
                ))}
              </div>
            </DocSection>

            {/* NEXT STEPS */}
            <DocSection id="next" title="Proximos Pasos (F1)">
              <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                {[
                  'Autenticacion real con bcrypt y sesiones HTTP-only',
                  'CRUD completo via mutations POST/PUT/DELETE',
                  'Implementacion de la compuerta de consentimiento (5 validaciones)',
                  'Integracion real con API de Higgsfield (Triple Pipeline)',
                  'Magic link con tokens JWT firmados',
                  'Upload real de Identity Packs a R2',
                  'Versionado de Character Sheets con persistencia en D1',
                  'Cola de jobs con estado en tiempo real',
                  'Verificacion automatizada de la cadena de AuditLog',
                  'Portal self-serve para talento (aprobaciones, reportes)',
                ].map((step, i) => (
                  <div key={i} className="wireframe-box" style={{padding:'0.5rem 0.75rem', display:'flex', gap:'0.75rem', alignItems:'center'}}>
                    <span className="formula-text formula-text--accent" style={{fontSize:'0.65rem', width:'24px'}}>{(i+1).toString().padStart(2,'0')}</span>
                    <span className="formula-text" style={{fontSize:'0.8rem'}}>{step}</span>
                  </div>
                ))}
              </div>
            </DocSection>
          </div>
        </div>
      </main>
    </div>
  );
}

// ============================================================
// SECTION COMPONENT
// ============================================================
function DocSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} style={{marginBottom:'3rem', scrollMarginTop:'2rem'}}>
      <h2 style={{
        fontSize:'1.25rem', fontWeight:700, marginBottom:'1rem', paddingBottom:'0.5rem',
        borderBottom:'1px solid var(--color-umain-border)',
        color:'var(--color-umain-accent)',
      }}>
        {title}
      </h2>
      {children}
    </div>
  );
}
