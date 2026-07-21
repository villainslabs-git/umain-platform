import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "../../components/sidebar";
import { getJobs, getProviders, getSettings } from "../../lib/queries";

export const Route = createFileRoute("/jobs/")({
  component: JobsPage,
  loader: async () => {
    try {
      const [jobs, providers, settings] = await Promise.all([
        getJobs(),
        getProviders(),
        getSettings(),
      ]);
      return {
        jobs: jobs as any[],
        providers: providers as any[],
        providerDefault: (settings as any)?.generation_provider_default ?? 'higgsfield',
      };
    } catch {
      return { jobs: [], providers: [], providerDefault: 'higgsfield' };
    }
  },
});

const JOB_TYPE_META: Record<string, { icon: string; label: string }> = {
  imagen: { icon: '▣', label: 'Imagen' },
  video: { icon: '▶', label: 'Video' },
  voz: { icon: '♢', label: 'Voz' },
  lipsync: { icon: '⇄', label: 'Lipsync' },
  upscale: { icon: '⊕', label: 'Upscale' },
};

function statusBadge(estado: string) {
  const map: Record<string, string> = {
    creado: 'umain-status-badge--borrador',
    validado: 'umain-status-badge--pending',
    generando: 'umain-status-badge--pending',
    pendiente_qa: 'umain-status-badge--pending',
    pendiente_talento: 'umain-status-badge--pending',
    entregado: 'umain-status-badge--active',
    rechazado: 'umain-status-badge--error',
    fallido: 'umain-status-badge--error',
  };
  return `umain-status-badge ${map[estado] ?? 'umain-status-badge--borrador'}`;
}

function JobsPage() {
  const { jobs, providers, providerDefault } = Route.useLoaderData() as any;
  const hasHiggsfield = providers.some((p: any) => p.tipo === 'higgsfield' && p.estado_validacion === 'valido');

  return (
    <div className="umain-layout">
      <Sidebar />
      <main className="umain-main">
        <div className="umain-page-header">
          <div>
            <h1>Jobs de Generacion</h1>
            <p className="formula-text mt-1">Motor: <span className="formula-text--accent">Higgsfield</span> via capa de abstraccion UMAIN</p>
          </div>
          <div className="umain-page-header__actions">
            <Link to="/settings" className="umain-button-outline" style={{fontSize:'0.75rem'}}>
              Configurar APIs
            </Link>
            {hasHiggsfield ? (
              <span className="umain-status-badge umain-status-badge--active" style={{fontSize:'0.7rem'}}>
                Higgsfield conectado
              </span>
            ) : (
              <span className="umain-status-badge umain-status-badge--pending" style={{fontSize:'0.7rem'}}>
                Higgsfield pendiente
              </span>
            )}
          </div>
        </div>

        {/* Architecture overview */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1.5rem'}}>
          <div className="wireframe-box" style={{padding:'1rem', borderLeft: '3px solid var(--color-umain-accent)'}}>
            <div className="formula-text formula-text--accent" style={{fontSize:'0.75rem', marginBottom:'0.5rem', textTransform:'uppercase'}}>
              CAPA DE GENERACION: HIGGSFIELD
            </div>
            <div style={{display:'flex', flexDirection:'column', gap:'0.375rem'}}>
              <div className="formula-text" style={{fontSize:'0.7rem', display:'flex', justifyContent:'space-between'}}>
                <span style={{color:'var(--color-umain-text-dim)'}}>API endpoint</span>
                <span className="formula-text--accent">https://api.higgsfield.ai/v1</span>
              </div>
              <div className="formula-text" style={{fontSize:'0.7rem', display:'flex', justifyContent:'space-between'}}>
                <span style={{color:'var(--color-umain-text-dim)'}}>Modelo imagenes</span>
                <span className="formula-text--pink">nano_banana_2 / seedream_v4_5</span>
              </div>
              <div className="formula-text" style={{fontSize:'0.7rem', display:'flex', justifyContent:'space-between'}}>
                <span style={{color:'var(--color-umain-text-dim)'}}>Modelo video</span>
                <span className="formula-text--pink">seedance_2_0 / veo3 / kling2_6</span>
              </div>
              <div className="formula-text" style={{fontSize:'0.7rem', display:'flex', justifyContent:'space-between'}}>
                <span style={{color:'var(--color-umain-text-dim)'}}>Modelo voz</span>
                <span className="formula-text--pink">seed_audio / elevenlabs</span>
              </div>
            </div>
          </div>

          <div className="wireframe-box" style={{padding:'1rem'}}>
            <div className="formula-text" style={{fontSize:'0.75rem', color:'var(--color-umain-text-dim)', marginBottom:'0.5rem', textTransform:'uppercase'}}>
              COMPUERTA DE CONSENTIMIENTO (Rights Engine)
            </div>
            <div style={{display:'flex', gap:'0.375rem', flexWrap:'wrap'}}>
              <span className="umain-tag" style={{borderColor:'#22c55e40', color:'#22c55e'}}>1. Validar token JWT</span>
              <span className="umain-tag" style={{borderColor:'#22c55e40', color:'#22c55e'}}>2. Validar alcance</span>
              <span className="umain-tag" style={{borderColor:'#22c55e40', color:'#22c55e'}}>3. Validar matriz</span>
              <span className="umain-tag" style={{borderColor:'#22c55e40', color:'#22c55e'}}>4. Validar exclusividad</span>
              <span className="umain-tag umain-status-badge--active" style={{borderColor:'var(--color-umain-accent)', fontWeight:500}}>5. Generar via Higgsfield</span>
            </div>
            <div className="formula-text" style={{fontSize:'0.65rem', marginTop:'0.75rem', color:'var(--color-umain-text-dim)'}}>
              El workflow interno con proveedores es invisible para el talento. 
              La compuerta es la unica via hacia Higgsfield.
            </div>
          </div>
        </div>

        {/* Job list */}
        <div className="umain-card">
          <div className="umain-card__body" style={{padding:0}}>
            <table className="umain-table">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Talento</th>
                  <th>Proveedor</th>
                  <th>Estado</th>
                  <th>Token validado</th>
                  <th>Creado</th>
                </tr>
              </thead>
              <tbody>
                {jobs.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="umain-empty">
                        <div className="umain-empty__icon">▶</div>
                        <div className="umain-empty__text">No hay jobs de generacion</div>
                        <p className="formula-text mt-2" style={{fontSize:'0.8rem', color:'var(--color-umain-text-dim)'}}>
                          Los jobs se crean al solicitar generacion con una licencia vigente.
                          La compuerta de consentimiento valida cada solicitud antes de enviarla a Higgsfield.
                        </p>
                        <div style={{marginTop:'1rem', display:'flex', gap:'0.75rem', justifyContent:'center'}}>
                          <Link to="/settings" className="umain-button-outline" style={{fontSize:'0.8rem'}}>
                            Configurar API keys
                          </Link>
                          <Link to="/identities" className="umain-button-outline" style={{fontSize:'0.8rem'}}>
                            Ver talentos
                          </Link>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  jobs.map((j: any) => {
                    const meta = JOB_TYPE_META[j.tipo] ?? { icon: '◈', label: j.tipo };
                    return (
                      <tr key={j.id}>
                        <td>
                          <span style={{marginRight:'0.375rem'}}>{meta.icon}</span>
                          <span className="formula-text">{meta.label}</span>
                        </td>
                        <td><span className="formula-text formula-text--accent">{j.talento_nombre ?? j.identity_id?.substring(0,8)}</span></td>
                        <td>
                          <span className="formula-text" style={{fontSize:'0.75rem'}}>
                            {j.proveedor_nombre ?? (j.proveedor === 'higgsfield' ? 'Higgsfield' : j.proveedor ?? 'Pendiente')}
                          </span>
                        </td>
                        <td><span className={statusBadge(j.estado)}>{j.estado}</span></td>
                        <td>
                          <span className="formula-text" style={{fontSize:'0.7rem',
                            color: j.token_validado_en ? 'var(--color-umain-accent)' : 'var(--color-umain-text-dim)'
                          }}>
                            {j.token_validado_en ? new Date(j.token_validado_en).toLocaleString() : '—'}
                          </span>
                        </td>
                        <td><span className="formula-text">{new Date(j.created_at).toLocaleDateString()}</span></td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick actions */}
        <div className="umain-card" style={{marginTop:'1.5rem'}}>
          <div className="umain-card__header">
            <span className="formula-text formula-text--pink">NUEVO JOB DE GENERACION</span>
          </div>
          <div className="umain-card__body" style={{padding:'1.25rem'}}>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1rem'}}>
              <button className="wireframe-box" style={{padding:'1.25rem', textAlign:'center', cursor:'pointer', border: '1px dashed var(--color-umain-border)'}}>
                <div className="formula-text" style={{fontSize:'1.5rem', marginBottom:'0.5rem'}}>▣</div>
                <div className="formula-text" style={{fontWeight:500}}>Generar Imagen</div>
                <p className="formula-text" style={{fontSize:'0.7rem', color:'var(--color-umain-text-dim)', marginTop:'0.25rem'}}>
                  Avatar / Still via Higgsfield
                </p>
              </button>
              <button className="wireframe-box" style={{padding:'1.25rem', textAlign:'center', cursor:'pointer', border: '1px dashed var(--color-umain-border)', opacity:0.5}}>
                <div className="formula-text" style={{fontSize:'1.5rem', marginBottom:'0.5rem'}}>▶</div>
                <div className="formula-text" style={{fontWeight:500}}>Generar Video</div>
                <p className="formula-text" style={{fontSize:'0.7rem', color:'var(--color-umain-text-dim)', marginTop:'0.25rem'}}>
                  Proximamente
                </p>
              </button>
              <button className="wireframe-box" style={{padding:'1.25rem', textAlign:'center', cursor:'pointer', border: '1px dashed var(--color-umain-border)', opacity:0.5}}>
                <div className="formula-text" style={{fontSize:'1.5rem', marginBottom:'0.5rem'}}>♢</div>
                <div className="formula-text" style={{fontWeight:500}}>Clonar Voz</div>
                <p className="formula-text" style={{fontSize:'0.7rem', color:'var(--color-umain-text-dim)', marginTop:'0.25rem'}}>
                  Proximamente
                </p>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
