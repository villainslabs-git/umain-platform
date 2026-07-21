import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Sidebar } from "../../../components/sidebar";
import { getIdentity, getConsentMatrix, updateIdentityStatus, updateIdentity } from "../../../lib/queries";
import { IAB_CATEGORIES } from "../../../lib/umain-types";
import { useState } from "react";

export const Route = createFileRoute("/identities/$id/")({
  component: IdentityDetailPage,
  loader: async ({ params }) => {
    try {
      const identity = await getIdentity({ data: params.id });
      const consent = await getConsentMatrix({ data: params.id });
      return { identity: identity as any, consent: consent as any };
    } catch {
      return { identity: null, consent: null };
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

function IdentityDetailPage() {
  const { identity, consent } = Route.useLoaderData() as any;
  const router = useRouter();

  // Edit mode state
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    nombre: identity?.nombre ?? '',
    tier: identity?.tier ?? 'B',
    agencia_id: identity?.agencia_id ?? '',
    contrato_ref: identity?.contrato_ref ?? '',
    contacto_aprobacion: identity?.contacto_aprobacion ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!form.nombre.trim()) { setError('El nombre es obligatorio'); return; }
    setSaving(true);
    setError('');
    try {
      await updateIdentity({
        data: {
          id: identity.id,
          nombre: form.nombre,
          tier: form.tier,
          agencia_id: form.agencia_id || null,
          contrato_ref: form.contrato_ref || null,
          contacto_aprobacion: form.contacto_aprobacion || null,
        } as any,
      });
      setEditing(false);
      router.invalidate();
    } catch (err: any) {
      setError(err.message || 'Error al guardar');
    }
    setSaving(false);
  };

  if (!identity) {
    return (
      <div className="umain-layout">
        <Sidebar />
        <main className="umain-main">
          <div className="umain-empty" style={{padding:'4rem'}}>
            <div className="umain-empty__icon">◈</div>
            <div className="umain-empty__text">Avatar/Clon no encontrado</div>
            <Link to="/identities" className="umain-button-outline mt-4 inline-flex">Volver a Avatares/Clones</Link>
          </div>
        </main>
      </div>
    );
  }

  const entradas = consent ? JSON.parse(consent.entradas || '{}') : {};

  return (
    <div className="umain-layout">
      <Sidebar />
      <main className="umain-main">
        <div className="umain-page-header">
          <div>
            <Link to="/identities" className="formula-text" style={{color:'var(--color-umain-accent)', textDecoration:'none', fontSize:'0.75rem'}}>
              ← Volver a Avatares/Clones
            </Link>
            {editing ? (
              <input className="umain-input" style={{fontSize:'1.25rem', fontWeight:700, marginTop:'0.25rem', maxWidth:'400px'}}
                value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
            ) : (
              <h1 style={{marginTop:'0.25rem'}}>{identity.nombre}</h1>
            )}
          </div>
          <div className="umain-page-header__actions">
            <span className={statusBadge(identity.estado)}>{identity.estado}</span>
            <span className="formula-text formula-text--accent" style={{fontSize:'0.75rem'}}>Tier {identity.tier}</span>
            {editing ? (
              <>
                <button className="umain-button-ghost" onClick={() => setEditing(false)}>Cancelar</button>
                <button className="umain-button-primary" style={{fontSize:'0.8rem'}} onClick={handleSave} disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </>
            ) : (
              <button className="umain-button-outline" style={{fontSize:'0.8rem'}} onClick={() => setEditing(true)}>
                Editar Avatar/Clon
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="wireframe-box" style={{padding:'0.5rem 0.75rem', marginBottom:'1rem', borderLeft:'3px solid #ef4444'}}>
            <div className="formula-text" style={{fontSize:'0.75rem', color:'#ef4444'}}>{error}</div>
          </div>
        )}

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', marginBottom:'2rem'}}>
          {/* Info card */}
          <div className="wireframe-box" style={{padding:'1.25rem'}}>
            <h3 className="formula-text formula-text--accent" style={{fontSize:'0.7rem', marginBottom:'1rem', textTransform:'uppercase'}}>
              {editing ? 'EDITAR INFORMACION' : 'INFORMACION DEL AVATAR/CLON'}
            </h3>
            <div style={{display:'flex', flexDirection:'column', gap:'0.75rem'}}>
              {editing ? (
                <>
                  <EditRow label="Tier" value={form.tier} options={['A','B','C']}
                    onChange={v => setForm({...form, tier: v})} />
                  <EditRow label="Agencia ID" value={form.agencia_id}
                    onChange={v => setForm({...form, agencia_id: v})} />
                  <EditRow label="Contrato ref" value={form.contrato_ref}
                    onChange={v => setForm({...form, contrato_ref: v})} />
                  <EditRow label="Contacto aprobacion" value={form.contacto_aprobacion}
                    onChange={v => setForm({...form, contacto_aprobacion: v})} multiline />
                  <div className="formula-text" style={{fontSize:'0.6rem', color:'var(--color-umain-text-dim)', marginTop:'0.5rem'}}>
                    El contacto de aprobacion se usa para enviar magic links al talento (WhatsApp/SMS)
                  </div>
                  <div style={{display:'flex', gap:'0.5rem', marginTop:'0.5rem'}}>
                    <button className="umain-button-outline" style={{fontSize:'0.7rem', padding:'0.25rem 0.5rem'}}
                      onClick={async () => {
                        const estados = ['activo', 'suspendido', 'suprimido'];
                        const idx = (estados.indexOf(identity.estado) + 1) % estados.length;
                        await updateIdentityStatus({ data: { id: identity.id, estado: estados[idx] } });
                        router.invalidate();
                      }}>
                      Cambiar estado: {identity.estado === 'activo' ? '→ suspendido' : identity.estado === 'suspendido' ? '→ suprimido' : '→ activo'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <InfoRow label="ID" value={identity.id} mono />
                  <InfoRow label="Tier" value={`Tier ${identity.tier}`} accent />
                  <InfoRow label="Agencia" value={identity.agencia_id ?? 'Sin asignar'} />
                  <InfoRow label="Contrato" value={identity.contrato_ref ?? 'Pendiente'} />
                  <InfoRow label="Contacto" value={identity.contacto_aprobacion ?? 'No configurado'} />
                  <InfoRow label="Creado" value={new Date(identity.created_at).toLocaleDateString()} />
                  <div style={{marginTop:'0.75rem', display:'flex', gap:'0.5rem'}}>
                    <Link to="/identities/$id/avatar/" params={{id: identity.id}} className="umain-button-primary" style={{fontSize:'0.75rem'}}>
                      Crear Avatar
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Consent summary */}
          <div className="wireframe-box" style={{padding:'1.25rem'}}>
            <h3 className="formula-text" style={{fontSize:'0.7rem', marginBottom:'1rem', textTransform:'uppercase', color:'var(--color-umain-accent-secondary)'}}>
              MATRIZ DE CONSENTIMIENTO
            </h3>
            {consent ? (
              <div style={{display:'flex', flexDirection:'column', gap:'0.75rem'}}>
                <InfoRow label="Version" value={`v${consent.version}`} />
                <InfoRow label="Categorias configuradas" value={`${Object.keys(entradas).length}/65`} />
                <InfoRow label="Permitidas" value={`${Object.values(entradas).filter((v: any) => v === 'permitido').length}`} accent />
                <InfoRow label="Caso por caso" value={`${Object.values(entradas).filter((v: any) => v === 'caso_por_caso').length}`} />
                <InfoRow label="Solo notificar" value={`${Object.values(entradas).filter((v: any) => v === 'solo_notificar').length}`} />
                <InfoRow label="Prohibidas" value={`${Object.values(entradas).filter((v: any) => v === 'prohibido').length}`} />
                <InfoRow label="Firmada" value={consent.firma_hash ? 'Si — ' + new Date(consent.firma_timestamp).toLocaleDateString() : 'Pendiente'} />
                <div style={{marginTop:'0.5rem'}}>
                  <Link to="/identities/$id/consent-matrix" params={{id: identity.id}} className="umain-button-outline" style={{fontSize:'0.8rem'}}>
                    Editar matriz de consentimiento
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <p className="formula-text" style={{fontSize:'0.75rem', color:'var(--color-umain-text-dim)'}}>
                  Matriz de consentimiento no configurada
                </p>
                <Link to="/identities/$id/consent-matrix" params={{id: identity.id}} className="umain-button-primary mt-3 inline-flex" style={{fontSize:'0.8rem'}}>
                  Configurar matriz
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Identity Pack */}
        <div className="umain-card" style={{marginBottom:'1.5rem'}}>
          <div className="umain-card__header">
            <span className="formula-text formula-text--accent" style={{fontSize:'0.7rem', textTransform:'uppercase'}}>
              IDENTITY PACK
            </span>
            <button className="umain-button-outline" style={{fontSize:'0.75rem'}}>+ Subir pack</button>
          </div>
          <div className="umain-card__body">
            <div className="umain-empty" style={{padding:'2rem'}}>
              <div className="umain-empty__text">No hay Identity Packs cargados</div>
              <p className="formula-text" style={{fontSize:'0.75rem', color:'var(--color-umain-text-dim)', marginTop:'0.5rem'}}>
                Subi video 4K, fotos y audio de la sesion de captura
              </p>
            </div>
          </div>
        </div>

        {/* Licenses Section */}
        <div className="umain-card">
          <div className="umain-card__header">
            <span className="formula-text formula-text--pink" style={{fontSize:'0.7rem', textTransform:'uppercase'}}>
              LICENCIAS
            </span>
            <Link to="/licenses" className="umain-button-ghost" style={{fontSize:'0.75rem'}}>Ver todas</Link>
          </div>
          <div className="umain-card__body">
            <div className="umain-empty" style={{padding:'2rem'}}>
              <div className="umain-empty__text">Sin licencias asociadas</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoRow({ label, value, accent, mono }: { label: string; value: string; accent?: boolean; mono?: boolean }) {
  return (
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <span className="formula-text" style={{fontSize:'0.75rem'}}>{label}</span>
      <span style={{
        fontFamily: mono ? "'Geist Mono', monospace" : "'Geist', sans-serif",
        fontSize: '0.8rem',
        fontWeight: accent ? 500 : 400,
        color: accent ? 'var(--color-umain-accent)' : 'var(--color-umain-text)',
        maxWidth: '55%',
        textAlign: 'right' as const,
        wordBreak: 'break-all' as const,
      }}>
        {value}
      </span>
    </div>
  );
}

function EditRow({ label, value, options, onChange, multiline }: {
  label: string; value: string; options?: string[]; onChange: (v: string) => void; multiline?: boolean;
}) {
  return (
    <div>
      <label className="formula-text block mb-1" style={{fontSize:'0.65rem', color:'var(--color-umain-text-dim)'}}>{label.toUpperCase()}</label>
      {options ? (
        <select className="umain-input" style={{fontSize:'0.8rem'}} value={value} onChange={e => onChange(e.target.value)}>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : multiline ? (
        <textarea className="umain-input" style={{fontSize:'0.8rem', resize:'vertical', minHeight:'60px'}}
          value={value} onChange={e => onChange(e.target.value)} />
      ) : (
        <input className="umain-input" style={{fontSize:'0.8rem'}} value={value} onChange={e => onChange(e.target.value)} />
      )}
    </div>
  );
}
