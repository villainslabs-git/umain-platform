import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "../../components/sidebar";
import { getProviders, saveProvider, validateProvider, deleteProvider, getSettings, saveSetting } from "../../lib/queries";
import { PROVIDER_TYPES } from "../../lib/umain-types";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/settings/")({
  component: SettingsPage,
  loader: async () => {
    try {
      const [providers, settings] = await Promise.all([
        getProviders(),
        getSettings(),
      ]);
      return { providers: providers as any[], settings: settings as Record<string, string> };
    } catch {
      return { providers: [], settings: {} };
    }
  },
});

function SettingsPage() {
  const { providers: initialProviders, settings: initialSettings } = Route.useLoaderData() as any;
  const [providers, setProviders] = useState<any[]>(initialProviders ?? []);
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings ?? {});
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ nombre: '', tipo: 'higgsfield', api_key: '', api_url: '' });
  const [validatingId, setValidatingId] = useState<string | null>(null);

  const handleSave = async () => {
    const result = await saveProvider({ data: editingId ? { ...formData, id: editingId } : formData });
    if (result.success) {
      setShowForm(false);
      setEditingId(null);
      setFormData({ nombre: '', tipo: 'higgsfield', api_key: '', api_url: '' });
      const updated = await getProviders();
      setProviders(updated as any[]);
    }
  };

  const handleValidate = async (id: string) => {
    setValidatingId(id);
    await validateProvider({ data: { id } });
    const updated = await getProviders();
    setProviders(updated as any[]);
    setValidatingId(null);
  };

  const handleDelete = async (id: string) => {
    await deleteProvider({ data: { id } });
    const updated = await getProviders();
    setProviders(updated as any[]);
  };

  const editProvider = (p: any) => {
    setFormData({ nombre: p.nombre, tipo: p.tipo, api_key: p.api_key_encrypted || '', api_url: p.api_url });
    setEditingId(p.id);
    setShowForm(true);
  };

  return (
    <div className="umain-layout">
      <Sidebar />
      <main className="umain-main">
        <div className="umain-page-header">
          <div>
            <h1>Configuracion</h1>
            <p className="formula-text mt-1">Gestion de proveedores de generacion y APIs</p>
          </div>
          <div className="umain-page-header__actions">
            <button className="umain-button-primary" onClick={() => { setShowForm(true); setEditingId(null); setFormData({ nombre: '', tipo: 'higgsfield', api_key: '', api_url: '' }); }}>
              + Agregar API
            </button>
          </div>
        </div>

        {/* Modal form */}
        {showForm && (
          <div className="umain-modal-overlay" onClick={() => setShowForm(false)}>
            <div className="umain-modal" onClick={(e) => e.stopPropagation()}>
              <h3 className="umain-modal__title">{editingId ? 'Editar' : 'Nuevo'} Proveedor API</h3>
              
              <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
                <div>
                  <label className="formula-text block mb-1" style={{color:'var(--color-umain-text-secondary)', fontSize:'0.75rem'}}>TIPO DE API</label>
                  <select className="umain-input" value={formData.tipo}
                    onChange={(e) => setFormData({...formData, tipo: e.target.value})}>
                    {PROVIDER_TYPES.map(pt => (
                      <option key={pt.value} value={pt.value}>{pt.label} - {pt.desc}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="formula-text block mb-1" style={{color:'var(--color-umain-text-secondary)', fontSize:'0.75rem'}}>NOMBRE</label>
                  <input className="umain-input" placeholder="Ej: Higgsfield Produccion" value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
                </div>
                <div>
                  <label className="formula-text block mb-1" style={{color:'var(--color-umain-text-secondary)', fontSize:'0.75rem'}}>API KEY</label>
                  <input className="umain-input" type="password" placeholder="sk-..." value={formData.api_key}
                    onChange={(e) => setFormData({...formData, api_key: e.target.value})} />
                </div>
                <div>
                  <label className="formula-text block mb-1" style={{color:'var(--color-umain-text-secondary)', fontSize:'0.75rem'}}>API URL</label>
                  <input className="umain-input" placeholder="https://api.higgsfield.ai/v1" value={formData.api_url}
                    onChange={(e) => setFormData({...formData, api_url: e.target.value})} />
                </div>
              </div>

              <div style={{display:'flex', gap:'0.75rem', justifyContent:'flex-end', marginTop:'1.5rem'}}>
                <button className="umain-button-ghost" onClick={() => setShowForm(false)}>Cancelar</button>
                <button className="umain-button-primary" onClick={handleSave}>
                  {editingId ? 'Guardar cambios' : 'Agregar API'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Higgsfield info banner */}
        <div className="wireframe-box" style={{padding:'1rem', marginBottom:'1.5rem', borderLeft: '3px solid var(--color-umain-accent)'}}>
          <div style={{display:'flex', gap:'0.75rem', alignItems:'flex-start'}}>
            <span style={{fontSize:'1.25rem'}}>◈</span>
            <div>
              <h3 style={{fontSize:'0.9rem', fontWeight:700, marginBottom:'0.25rem'}}>Higgsfield como motor de generacion</h3>
              <p className="formula-text" style={{fontSize:'0.75rem', color:'var(--color-umain-text-secondary)'}}>
                La plataforma UMAIN usa Higgsfield para generar imagenes (avatares, stills), videos y voz.
                Agrega tu API key de Higgsfield abajo para activar la capa de generacion.
                El Rights Engine valida consentimiento y licencias antes de cada generacion.
              </p>
            </div>
          </div>
        </div>

        {/* Provider cards */}
        <div style={{display:'grid', gridTemplateColumns:'1fr', gap:'1rem'}}>
          {providers.length === 0 ? (
            <div className="umain-card">
              <div className="umain-card__body">
                <div className="umain-empty" style={{padding:'3rem'}}>
                  <div className="umain-empty__icon">⚙</div>
                  <div className="umain-empty__text">No hay proveedores configurados</div>
                  <p className="formula-text mt-2" style={{fontSize:'0.8rem', color:'var(--color-umain-text-dim)'}}>
                    Agrega al menos Higgsfield API para comenzar a generar contenido
                  </p>
                </div>
              </div>
            </div>
          ) : (
            providers.map((p: any) => {
              const providerMeta = PROVIDER_TYPES.find(pt => pt.value === p.tipo);
              return (
                <div key={p.id} className="umain-card">
                  <div className="umain-card__body" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div style={{display:'flex', gap:'1rem', alignItems:'center'}}>
                      <div style={{
                        width: 44, height: 44, borderRadius: '0.5rem',
                        background: p.tipo === 'higgsfield' ? 'linear-gradient(135deg, rgba(125,212,252,0.2), rgba(244,168,200,0.2))' : 'var(--color-umain-surface-alt)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid var(--color-umain-border)',
                      }}>
                        <span className="formula-text" style={{fontSize:'1.1rem'}}>{providerMeta?.icon ?? '◈'}</span>
                      </div>
                      <div>
                        <h3 style={{fontWeight:600, marginBottom:'0.125rem'}}>{p.nombre}</h3>
                        <div style={{display:'flex', gap:'0.75rem', alignItems:'center'}}>
                          <span className="formula-text" style={{fontSize:'0.7rem', color:'var(--color-umain-text-dim)'}}>{providerMeta?.label ?? p.tipo}</span>
                          <span className={`umain-status-badge ${
                            p.estado_validacion === 'valido' ? 'umain-status-badge--active' :
                            p.estado_validacion === 'error' ? 'umain-status-badge--error' :
                            'umain-status-badge--borrador'
                          }`} style={{fontSize:'0.65rem'}}>
                            {p.estado_validacion === 'valido' ? 'Conectado' :
                             p.estado_validacion === 'error' ? 'Error' : 'No verificado'}
                          </span>
                          {p.activo ? (
                            <span className="umain-status-badge umain-status-badge--active" style={{fontSize:'0.6rem'}}>activo</span>
                          ) : (
                            <span className="umain-status-badge umain-status-badge--borrador" style={{fontSize:'0.6rem'}}>inactivo</span>
                          )}
                        </div>
                        {p.api_key_encrypted && (
                          <div className="formula-text" style={{fontSize:'0.65rem', marginTop:'0.25rem', color:'var(--color-umain-text-dim)'}}>
                            API Key: ••••{p.api_key_encrypted.slice(-4)}
                          </div>
                        )}
                        {p.ultima_validacion && (
                          <div className="formula-text" style={{fontSize:'0.65rem', marginTop:'0.125rem', color:'var(--color-umain-text-dim)'}}>
                            Ultima validacion: {new Date(p.ultima_validacion).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{display:'flex', gap:'0.5rem', alignItems:'center'}}>
                      <button className="umain-button-outline" style={{fontSize:'0.75rem'}}
                        onClick={() => handleValidate(p.id)} disabled={validatingId === p.id}>
                        {validatingId === p.id ? 'Validando...' : 'Validar'}
                      </button>
                      <button className="umain-button-ghost" style={{fontSize:'0.75rem'}} onClick={() => editProvider(p)}>
                        Editar
                      </button>
                      <button className="umain-button-ghost" style={{fontSize:'0.75rem', color:'#ef4444'}} onClick={() => handleDelete(p.id)}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Settings summary */}
        <div className="wireframe-box" style={{padding:'1rem', marginTop:'2rem'}}>
          <h3 className="formula-text formula-text--accent" style={{fontSize:'0.75rem', marginBottom:'0.75rem', textTransform:'uppercase'}}>
            CONFIGURACION DEL SISTEMA
          </h3>
          <div style={{display:'flex', gap:'1.5rem', flexWrap:'wrap'}}>
            {Object.entries(settings).map(([key, value]) => (
              <div key={key} style={{minWidth:'200px'}}>
                <div className="formula-text" style={{fontSize:'0.65rem', color:'var(--color-umain-text-dim)'}}>{key}</div>
                <div className="formula-text formula-text--accent" style={{fontSize:'0.8rem', marginTop:'0.125rem'}}>{value as string}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
