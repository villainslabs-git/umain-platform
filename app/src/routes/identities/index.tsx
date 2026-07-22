import { createFileRoute, Link, useRouter, useNavigate } from "@tanstack/react-router";
import { Sidebar } from "../../components/sidebar";
import { getIdentities, createIdentity, updateIdentityStatus, deleteIdentity } from "../../lib/queries";
import { useState } from "react";

export const Route = createFileRoute("/identities/")({
  component: IdentitiesPage,
  loader: async () => {
    try {
      return await getIdentities();
    } catch {
      return [];
    }
  },
});

function statusBadge(estado: string) {
  const map: Record<string, string> = {
    activo: 'umain-status-badge--active',
    suspendido: 'umain-status-badge--pending',
    suprimido: 'umain-status-badge--suprimido',
  };
  return `umain-status-badge ${map[estado] ?? 'umain-status-badge--borrador'}`;
}

function IdentitiesPage() {
  const initialData = (Route.useLoaderData() as any[]) ?? [];
  const [identities, setIdentities] = useState<any[]>(initialData);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', tier: 'B', agencia_id: '', contrato_ref: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const navigate = useNavigate();

  const refreshData = async () => {
    try {
      const data = await getIdentities();
      setIdentities(data as any[]);
    } catch {}
  };

  const handleCreate = async () => {
    if (!formData.nombre.trim()) { setError('El nombre es obligatorio'); return; }
    setSaving(true);
    setError('');
    try {
      const result = await createIdentity({ data: formData as any });
      if (result.success) {
        setShowForm(false);
        // Redirect to avatar creation page for this new talent
        navigate({ to: '/identities/$id/avatar', params: { id: result.id } });
      }
    } catch (err: any) {
      setError(err.message || 'Error al crear el talento');
    }
    setSaving(false);
  };

  const handleStatusChange = async (id: string, estado: string) => {
    try {
      await updateIdentityStatus({ data: { id, estado } });
      await refreshData();
    } catch {}
  };

  return (
    <div className="umain-layout">
      <Sidebar />
      <main className="umain-main">
        <div className="umain-page-header">
          <div>
            <h1>Avatares/Clones</h1>
            <p className="formula-text mt-1">Gestion de avatares digitales y clones de voz</p>
          </div>
          <div className="umain-page-header__actions">
            <button className="umain-button-primary" onClick={() => setShowForm(true)}>
              + Nuevo Avatar/Clon
            </button>
          </div>
        </div>

        {/* Modal de creacion */}
        {showForm && (
          <div className="umain-modal-overlay" onClick={() => setShowForm(false)}>
            <div className="umain-modal" onClick={(e) => e.stopPropagation()} style={{maxWidth:'480px'}}>
              <h3 className="umain-modal__title">Nuevo Avatar/Clon</h3>

              {error && (
                <div className="wireframe-box" style={{padding:'0.5rem 0.75rem', marginBottom:'1rem', borderLeft:'3px solid #ef4444'}}>
                  <div className="formula-text" style={{fontSize:'0.75rem', color:'#ef4444'}}>{error}</div>
                </div>
              )}

              <div style={{display:'flex', flexDirection:'column', gap:'0.75rem'}}>
                <div>
                  <label className="formula-text block mb-1" style={{fontSize:'0.65rem', color:'var(--color-umain-text-dim)'}}>NOMBRE COMPLETO</label>
                  <input className="umain-input" placeholder="Nombre del talento" value={formData.nombre}
                    onChange={e => setFormData({...formData, nombre: e.target.value})} autoFocus />
                </div>
                <div>
                  <label className="formula-text block mb-1" style={{fontSize:'0.65rem', color:'var(--color-umain-text-dim)'}}>TIER</label>
                  <select className="umain-input" value={formData.tier} onChange={e => setFormData({...formData, tier: e.target.value})}>
                    <option value="A">Tier A — Premium</option>
                    <option value="B">Tier B — Estandar</option>
                    <option value="C">Tier C — Base</option>
                  </select>
                </div>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem'}}>
                  <div>
                    <label className="formula-text block mb-1" style={{fontSize:'0.65rem', color:'var(--color-umain-text-dim)'}}>AGENCIA ID</label>
                    <input className="umain-input" placeholder="Opcional" value={formData.agencia_id}
                      onChange={e => setFormData({...formData, agencia_id: e.target.value})} />
                  </div>
                  <div>
                    <label className="formula-text block mb-1" style={{fontSize:'0.65rem', color:'var(--color-umain-text-dim)'}}>CONTRATO REF</label>
                    <input className="umain-input" placeholder="Ej: CONT-2026-XXX" value={formData.contrato_ref}
                      onChange={e => setFormData({...formData, contrato_ref: e.target.value})} />
                  </div>
                </div>
              </div>

              <div style={{display:'flex', gap:'0.75rem', justifyContent:'flex-end', marginTop:'1.5rem'}}>
                <button className="umain-button-ghost" onClick={() => setShowForm(false)}>Cancelar</button>
                <button className="umain-button-primary" onClick={handleCreate} disabled={saving}>
                  {saving ? 'Creando...' : 'Crear Avatar/Clon'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabla de talentos */}
        <div className="umain-card">
          <div className="umain-card__body" style={{padding:0}}>
            <table className="umain-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Tier</th>
                  <th>Estado</th>
                  <th>Agencia</th>
                  <th>Contrato</th>
                  <th>Creado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {identities.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="umain-empty">
                        <div className="umain-empty__icon">◈</div>
                        <div className="umain-empty__text">No hay Avatares/Clones registrados</div>
                        <p className="formula-text mt-2" style={{fontSize:'0.8rem', color:'var(--color-umain-text-dim)'}}>
                          Hacé clic en "+ Nuevo Avatar/Clon" para comenzar
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  identities.map((id: any) => (
                    <tr key={id.id}>
                      <td>
                        <Link to={`/identities/$id`} params={{id: id.id}} style={{color:'var(--color-umain-accent)', textDecoration:'none', fontFamily:'Geist, sans-serif', fontWeight:500}}>
                          {id.nombre}
                        </Link>
                      </td>
                      <td><span className="formula-text formula-text--accent">Tier {id.tier}</span></td>
                      <td>
                        <select
                          className="umain-status-badge"
                          value={id.estado}
                          onChange={(e) => handleStatusChange(id.id, e.target.value)}
                          style={{
                            background: 'var(--color-umain-surface-alt)',
                            border: '1px solid var(--color-umain-border)',
                            cursor: 'pointer',
                            fontSize: '0.7rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '999px',
                            fontFamily: "'Geist Mono', monospace",
                            color: id.estado === 'activo' ? '#22c55e' : id.estado === 'suspendido' ? '#eab308' : '#ef4444',
                          }}
                        >
                          <option value="activo">activo</option>
                          <option value="suspendido">suspendido</option>
                          <option value="suprimido">suprimido</option>
                        </select>
                      </td>
                      <td><span className="formula-text">{id.agencia_id ? id.agencia_id.substring(0,8) : '—'}</span></td>
                      <td><span className="formula-text">{id.contrato_ref ?? '—'}</span></td>
                      <td><span className="formula-text">{new Date(id.created_at).toLocaleDateString()}</span></td>
                      <td>
                        <div style={{display:'flex', gap:'0.25rem'}}>
                          <Link to={`/identities/$id`} params={{id: id.id}} className="umain-button-ghost" style={{fontSize:'0.7rem', padding:'0.2rem 0.5rem'}}>
                            Ver
                          </Link>
                          {id.estado !== 'suprimido' && (
                            <button className="umain-button-ghost" style={{fontSize:'0.65rem', padding:'0.2rem 0.4rem', color:'#ef4444'}}
                              onClick={async () => {
                                if (confirm(`Eliminar a ${id.nombre}? Se marcara como suprimido de la lista de Avatares/Clones.`)) {
                                  await deleteIdentity({ data: { id: id.id } });
                                  await refreshData();
                                }
                              }}>
                              ×
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {identities.length > 0 && (
          <div className="formula-text" style={{fontSize:'0.65rem', color:'var(--color-umain-text-dim)', marginTop:'0.75rem', textAlign:'center'}}>
            {identities.length} avatar/clon{identities.length !== 1 ? 'es' : ''} registrado{identities.length !== 1 ? 's' : ''} · 
            {identities.filter((i: any) => i.estado === 'activo').length} activos ·
            {identities.filter((i: any) => i.estado === 'suspendido').length} suspendidos ·
            {identities.filter((i: any) => i.estado === 'suprimido').length} suprimidos
          </div>
        )}
      </main>
    </div>
  );
}
