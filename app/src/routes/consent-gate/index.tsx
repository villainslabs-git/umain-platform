import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "../../components/sidebar";
import { executeConsentGate, authorizeGeneration, verifyAuditChain, ConsentGateRequest } from "../../lib/rights-engine";
import { useState } from "react";

export const Route = createFileRoute("/consent-gate/")({
  component: ConsentGatePage,
});

const IAB_SHORTLIST = [
  { id: 'iab-1', nombre: 'Identificadores de dispositivo' },
  { id: 'iab-2', nombre: 'Direccion IP' },
  { id: 'iab-4', nombre: 'Datos de navegacion web' },
  { id: 'iab-13', nombre: 'Datos de audio (voz del usuario)' },
  { id: 'iab-14', nombre: 'Datos biometricos faciales' },
  { id: 'iab-15', nombre: 'Datos de salud (PROHIBIDO)' },
  { id: 'iab-21', nombre: 'Datos de fotos' },
  { id: 'iab-46', nombre: 'Datos de NFC' },
];

function ConsentGatePage() {
  const [request, setRequest] = useState<ConsentGateRequest>({
    license_id: 'template-license-001',
    identity_id: 'template-identity-001',
    tipo: 'imagen',
    medio: 'redes_sociales',
    territorio: 'AR',
    categoria_iab: 'iab-4',
    marca: '',
    prompt: '',
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [chainResult, setChainResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'gate' | 'chain'>('gate');
  const [mode, setMode] = useState<'validate' | 'authorize'>('validate');

  const runValidation = async () => {
    setLoading(true);
    setResult(null);
    try {
      const fn = mode === 'authorize' ? authorizeGeneration : executeConsentGate;
      const res = await fn({ data: request });
      setResult(res);
    } catch (err: any) {
      setResult({
        allowed: false, paso_fallido: 0,
        validation_steps: [],
        errors: [err.message || 'Error interno'],
        warnings: [],
      });
    }
    setLoading(false);
  };

  const runChainVerification = async () => {
    setLoading(true);
    try {
      const res = await verifyAuditChain();
      setChainResult(res);
    } catch (err: any) {
      setChainResult({ chain_valid: false, error: err.message });
    }
    setLoading(false);
  };

  return (
    <div className="umain-layout">
      <Sidebar />
      <main className="umain-main" style={{maxWidth:'1200px'}}>
        <div className="umain-page-header">
          <div>
            <h1>Compuerta de Consentimiento</h1>
            <p className="formula-text mt-1">Rights Engine v2 — 5 validaciones en cadena</p>
          </div>
          <div className="umain-page-header__actions">
            <button className="umain-button-outline" style={{fontSize:'0.75rem'}} onClick={() => setActiveTab('chain')}>
              Verificar AuditLog Chain
            </button>
            <button className="umain-button-primary" style={{fontSize:'0.75rem'}} onClick={() => setActiveTab('gate')}>
              Compuerta
            </button>
          </div>
        </div>

        {activeTab === 'gate' && (
          <>
            {/* Diagrama de pasos */}
            <div className="wireframe-box" style={{padding:'0.75rem 1rem', marginBottom:'1.5rem'}}>
              <div style={{display:'flex', gap:'0.25rem', alignItems:'center', flexWrap:'wrap', justifyContent:'center'}}>
                {[
                  { n: '1', l: 'Token JWT', c: result ? (result.validation_steps?.[0]?.passed ? '#22c55e' : result.paso_fallido === 1 ? '#ef4444' : 'var(--color-umain-text-dim)') : 'var(--color-umain-text-dim)' },
                  { n: '2', l: 'Alcance', c: result ? (result.validation_steps?.[1]?.passed ? '#22c55e' : result.paso_fallido === 2 ? '#ef4444' : 'var(--color-umain-text-dim)') : 'var(--color-umain-text-dim)' },
                  { n: '3', l: 'Matriz', c: result ? (result.validation_steps?.[2]?.passed ? '#22c55e' : result.paso_fallido === 3 ? '#ef4444' : 'var(--color-umain-text-dim)') : 'var(--color-umain-text-dim)' },
                  { n: '4', l: 'Exclusividad', c: result ? (result.validation_steps?.[3]?.passed ? '#22c55e' : result.paso_fallido === 4 ? '#ef4444' : 'var(--color-umain-text-dim)') : 'var(--color-umain-text-dim)' },
                  { n: '5', l: 'AuditLog', c: result ? (result.allowed ? '#22c55e' : 'var(--color-umain-text-dim)') : 'var(--color-umain-text-dim)' },
                ].map((s, i) => (
                  <span key={s.n} style={{display:'flex', alignItems:'center', gap:'0.25rem'}}>
                    <span className="umain-tag" style={{borderColor: s.c === '#22c55e' ? 'rgba(34,197,94,0.4)' : s.c === '#ef4444' ? 'rgba(239,68,68,0.4)' : undefined, color: s.c, fontWeight: s.c !== 'var(--color-umain-text-dim)' ? 600 : 400}}>
                      {s.n}. {s.l}
                    </span>
                    {i < 4 && <span className="formula-text" style={{color:'var(--color-umain-text-dim)', fontSize:'0.7rem'}}>→</span>}
                  </span>
                ))}
              </div>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem'}}>
              {/* Formulario */}
              <div className="umain-card">
                <div className="umain-card__header">
                  <span className="formula-text formula-text--accent" style={{fontSize:'0.7rem', textTransform:'uppercase'}}>
                    SOLICITUD
                  </span>
                  <div style={{display:'flex', gap:'0.25rem'}}>
                    <button className={`umain-button-${mode === 'validate' ? 'primary' : 'ghost'}`} style={{fontSize:'0.65rem', padding:'0.25rem 0.5rem'}} onClick={() => setMode('validate')}>
                      Solo validar
                    </button>
                    <button className={`umain-button-${mode === 'authorize' ? 'primary' : 'ghost'}`} style={{fontSize:'0.65rem', padding:'0.25rem 0.5rem'}} onClick={() => setMode('authorize')}>
                      Validar + generar job
                    </button>
                  </div>
                </div>
                <div className="umain-card__body">
                  <div style={{display:'flex', flexDirection:'column', gap:'0.75rem'}}>
                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem'}}>
                      <div>
                        <label className="formula-text block mb-1" style={{fontSize:'0.6rem', color:'var(--color-umain-text-dim)'}}>LICENSE ID</label>
                        <input className="umain-input" style={{fontSize:'0.75rem'}} value={request.license_id} onChange={e => setRequest({...request, license_id: e.target.value})} />
                      </div>
                      <div>
                        <label className="formula-text block mb-1" style={{fontSize:'0.6rem', color:'var(--color-umain-text-dim)'}}>IDENTITY ID</label>
                        <input className="umain-input" style={{fontSize:'0.75rem'}} value={request.identity_id} onChange={e => setRequest({...request, identity_id: e.target.value})} />
                      </div>
                    </div>
                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.75rem'}}>
                      <div>
                        <label className="formula-text block mb-1" style={{fontSize:'0.6rem', color:'var(--color-umain-text-dim)'}}>TIPO</label>
                        <select className="umain-input" style={{fontSize:'0.75rem'}} value={request.tipo} onChange={e => setRequest({...request, tipo: e.target.value})}>
                          <option value="imagen">Imagen</option>
                          <option value="video">Video</option>
                          <option value="voz">Voz</option>
                        </select>
                      </div>
                      <div>
                        <label className="formula-text block mb-1" style={{fontSize:'0.6rem', color:'var(--color-umain-text-dim)'}}>MEDIO</label>
                        <select className="umain-input" style={{fontSize:'0.75rem'}} value={request.medio} onChange={e => setRequest({...request, medio: e.target.value})}>
                          <option value="redes_sociales">Redes Sociales</option>
                          <option value="tv">TV</option>
                          <option value="digital">Digital</option>
                          <option value="via_publica">Via Publica</option>
                        </select>
                      </div>
                      <div>
                        <label className="formula-text block mb-1" style={{fontSize:'0.6rem', color:'var(--color-umain-text-dim)'}}>TERRITORIO</label>
                        <select className="umain-input" style={{fontSize:'0.75rem'}} value={request.territorio} onChange={e => setRequest({...request, territorio: e.target.value})}>
                          <option value="AR">Argentina</option>
                          <option value="US">Estados Unidos</option>
                          <option value="LATAM">Latinoamerica</option>
                          <option value="WORLD">Mundo</option>
                        </select>
                      </div>
                    </div>
                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem'}}>
                      <div>
                        <label className="formula-text block mb-1" style={{fontSize:'0.6rem', color:'var(--color-umain-text-dim)'}}>CATEGORIA IAB</label>
                        <select className="umain-input" style={{fontSize:'0.75rem'}} value={request.categoria_iab} onChange={e => setRequest({...request, categoria_iab: e.target.value})}>
                          {IAB_SHORTLIST.map(c => <option key={c.id} value={c.id}>{c.id} - {c.nombre}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="formula-text block mb-1" style={{fontSize:'0.6rem', color:'var(--color-umain-text-dim)'}}>MARCA</label>
                        <input className="umain-input" style={{fontSize:'0.75rem'}} placeholder="Nike, Coca-Cola..." value={request.marca} onChange={e => setRequest({...request, marca: e.target.value})} />
                      </div>
                    </div>
                    <div>
                      <label className="formula-text block mb-1" style={{fontSize:'0.6rem', color:'var(--color-umain-text-dim)'}}>PROMPT</label>
                      <textarea className="umain-input" style={{fontSize:'0.75rem'}} rows={2} value={request.prompt} onChange={e => setRequest({...request, prompt: e.target.value})} />
                    </div>
                    <button className="umain-button-primary" onClick={runValidation} disabled={loading}>
                      {loading ? 'Procesando...' : mode === 'authorize' ? 'Ejecutar compuerta + generar job' : 'Ejecutar compuerta (solo validar)'}
                    </button>
                    <div className="formula-text" style={{fontSize:'0.6rem', color:'var(--color-umain-text-dim)', textAlign:'center'}}>
                      Datos demo precargados — License: template-license-001 | Identity: template-identity-001
                    </div>
                  </div>
                </div>
              </div>

              {/* Resultado */}
              <div className="umain-card">
                <div className="umain-card__header">
                  <span className="formula-text formula-text--pink" style={{fontSize:'0.7rem', textTransform:'uppercase'}}>
                    RESULTADO
                  </span>
                  {result && (
                    <span className="formula-text" style={{fontSize:'0.6rem', color:'var(--color-umain-text-dim)'}}>
                      {result.audit_log_seq ? `audit #${result.audit_log_seq}` : ''}
                    </span>
                  )}
                </div>
                <div className="umain-card__body">
                  {!result ? (
                    <div className="umain-empty" style={{padding:'2rem'}}>
                      <div className="umain-empty__icon">◈</div>
                      <div className="umain-empty__text">Completa los datos y ejecuta</div>
                      <p className="formula-text" style={{fontSize:'0.7rem', color:'var(--color-umain-text-dim)'}}>5 validaciones en cadena contra el Rights Engine</p>
                    </div>
                  ) : (
                    <div style={{display:'flex', flexDirection:'column', gap:'0.75rem'}}>
                      {/* Status */}
                      <div className="wireframe-box" style={{padding:'0.75rem', textAlign:'center', borderColor: result.allowed ? 'rgba(34,197,94,0.5)' : 'rgba(239,68,68,0.5)'}}>
                        <div style={{fontSize:'1.5rem'}}>{result.allowed ? '✅' : '❌'}</div>
                        <div className="formula-text" style={{fontSize:'0.85rem', fontWeight:600, color: result.allowed ? '#22c55e' : '#ef4444'}}>
                          {result.allowed ? 'AUTORIZADO' : `RECHAZADO — Paso ${result.paso_fallido}`}
                        </div>
                      </div>

                      {/* Errores */}
                      {result.errors?.map((e: string, i: number) => (
                        <div key={i} className="wireframe-box" style={{padding:'0.5rem 0.75rem', borderLeft:'3px solid #ef4444'}}>
                          <div className="formula-text" style={{fontSize:'0.7rem', color:'#ef4444'}}>{e}</div>
                        </div>
                      ))}

                      {/* Warnings */}
                      {result.warnings?.map((w: string, i: number) => (
                        <div key={i} className="wireframe-box" style={{padding:'0.5rem 0.75rem', borderLeft:'3px solid #eab308'}}>
                          <div className="formula-text" style={{fontSize:'0.7rem', color:'#eab308'}}>⚠ {w}</div>
                        </div>
                      ))}

                      {/* Job ID */}
                      {result.job_id && (
                        <div className="wireframe-box" style={{padding:'0.5rem 0.75rem', borderLeft:'3px solid var(--color-umain-accent)'}}>
                          <div className="formula-text" style={{fontSize:'0.6rem', color:'var(--color-umain-text-dim)'}}>JOB ID</div>
                          <div className="formula-text formula-text--accent" style={{fontSize:'0.7rem'}}>{result.job_id}</div>
                        </div>
                      )}

                      {/* Pasos detallados */}
                      <div className="formula-text" style={{fontSize:'0.65rem', color:'var(--color-umain-text-dim)', textTransform:'uppercase', marginTop:'0.5rem'}}>
                        VALIDACIONES INDIVIDUALES
                      </div>
                      {result.validation_steps?.map((s: any) => (
                        <div key={s.paso} className="wireframe-box" style={{
                          padding:'0.5rem 0.75rem',
                          borderColor: s.passed ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
                        }}>
                          <div style={{display:'flex', gap:'0.5rem', alignItems:'flex-start'}}>
                            <span>{s.passed ? '✅' : '❌'}</span>
                            <div style={{flex:1}}>
                              <div className="formula-text" style={{fontSize:'0.7rem', fontWeight:600, color: s.passed ? '#22c55e' : '#ef4444'}}>
                                {s.paso}. {s.nombre}
                              </div>
                              <div className="formula-text" style={{fontSize:'0.65rem', color:'var(--color-umain-text-secondary)', marginTop:'0.125rem'}}>
                                {s.detalle}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Info adicional */}
                      {result.allowed && (
                        <div className="formula-text" style={{fontSize:'0.6rem', color:'var(--color-umain-text-dim)', textAlign:'center', marginTop:'0.5rem'}}>
                          {result.job_id
                            ? 'Job de generacion creado en estado "validado". Pendiente de envio a Higgsfield.'
                            : 'Validacion exitosa. Usa "Validar + generar job" para crear el job de generacion.'}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'chain' && (
          <div>
            <div className="umain-card">
              <div className="umain-card__header">
                <span className="formula-text formula-text--accent" style={{fontSize:'0.7rem', textTransform:'uppercase'}}>
                  VERIFICACION DE CADENA — AUDIT LOG
                </span>
                <button className="umain-button-outline" style={{fontSize:'0.75rem'}} onClick={runChainVerification} disabled={loading}>
                  {loading ? 'Verificando...' : 'Ejecutar'}
                </button>
              </div>
              <div className="umain-card__body">
                {!chainResult ? (
                  <div className="umain-empty" style={{padding:'2rem'}}>
                    <div className="umain-empty__text">Presiona "Ejecutar" para verificar la cadena de hashes SHA-256</div>
                  </div>
                ) : (
                  <div>
                    <div className="wireframe-box" style={{padding:'0.75rem', marginBottom:'1rem', textAlign:'center', borderColor: chainResult.chain_valid ? 'rgba(34,197,94,0.5)' : 'rgba(239,68,68,0.5)'}}>
                      <div style={{fontSize:'1.5rem'}}>{chainResult.chain_valid ? '✅' : '❌'}</div>
                      <div className="formula-text" style={{fontSize:'0.85rem', color: chainResult.chain_valid ? '#22c55e' : '#ef4444'}}>
                        {chainResult.chain_valid ? 'Cadena de hash VERIFICADA' : 'Cadena de hash ROTA'}
                      </div>
                      <div className="formula-text" style={{fontSize:'0.65rem', color:'var(--color-umain-text-dim)', marginTop:'0.25rem'}}>
                        {chainResult.total_entries} entradas · {chainResult.verified} OK · {chainResult.broken} rotas
                      </div>
                    </div>
                    {chainResult.error && (
                      <div className="wireframe-box" style={{padding:'0.5rem 0.75rem', borderLeft:'3px solid #ef4444'}}>
                        <div className="formula-text" style={{fontSize:'0.7rem', color:'#ef4444'}}>{chainResult.error}</div>
                      </div>
                    )}
                    {chainResult.results && chainResult.results.length > 0 && (
                      <div style={{maxHeight:'300px', overflowY:'auto'}}>
                        <table className="umain-table">
                          <thead><tr><th>Seq</th><th>Estado</th></tr></thead>
                          <tbody>
                            {chainResult.results.map((r: any) => (
                              <tr key={r.seq}>
                                <td><span className="formula-text" style={{fontSize:'0.7rem'}}>{r.seq}</span></td>
                                <td><span className="umain-status-badge umain-status-badge--active" style={{fontSize:'0.6rem'}}>{r.status}</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
