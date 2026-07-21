import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "../../../components/sidebar";
import { getIdentity, getConsentMatrix } from "../../../lib/queries";
import { IAB_CATEGORIES } from "../../../lib/umain-types";
import type { ConsentStatus } from "../../../lib/umain-types";
import { useState } from "react";

export const Route = createFileRoute("/identities/$id/consent-matrix")({
  component: ConsentMatrixPage,
  loader: async ({ params }) => {
    try {
      const identity = await getIdentity({ data: params.id });
      const consent = await getConsentMatrix({ data: params.id });
      return { identity, consent };
    } catch {
      return { identity: null, consent: null };
    }
  },
});

const STATUS_OPTIONS: { value: ConsentStatus; label: string; color: string }[] = [
  { value: 'permitido', label: 'Permitido', color: '#22c55e' },
  { value: 'caso_por_caso', label: 'Caso por caso', color: '#eab308' },
  { value: 'solo_notificar', label: 'Solo notificar', color: '#7dd4fc' },
  { value: 'prohibido', label: 'Prohibido', color: '#ef4444' },
  { value: 'sin_definir', label: 'Sin definir', color: '#64748b' },
];

function ConsentMatrixPage() {
  const { identity, consent } = Route.useLoaderData() as any;
  const initialEntries = consent ? JSON.parse(consent.entradas || '{}') : {};
  const [entries, setEntries] = useState<Record<string, ConsentStatus>>(initialEntries);
  const [filter, setFilter] = useState<string>('todas');

  if (!identity) {
    return (
      <div className="umain-layout">
        <Sidebar />
        <main className="umain-main">
          <div className="umain-empty">
            <div className="umain-empty__text">Talento no encontrado</div>
          </div>
        </main>
      </div>
    );
  }

  const setCategoryStatus = (catId: string, status: ConsentStatus) => {
    setEntries(prev => ({ ...prev, [catId]: status }));
  };

  const filtered = filter === 'todas'
    ? IAB_CATEGORIES
    : IAB_CATEGORIES.filter(c => (entries[c.id] || 'sin_definir') === filter);

  const counts = {
    permitido: Object.values(entries).filter(v => v === 'permitido').length,
    caso_por_caso: Object.values(entries).filter(v => v === 'caso_por_caso').length,
    solo_notificar: Object.values(entries).filter(v => v === 'solo_notificar').length,
    prohibido: Object.values(entries).filter(v => v === 'prohibido').length,
    sin_definir: Object.values(entries).filter(v => !v || v === 'sin_definir').length,
  };

  return (
    <div className="umain-layout">
      <Sidebar />
      <main className="umain-main">
        <div className="umain-page-header" style={{marginBottom:'1rem'}}>
          <div>
            <Link to={`/identities/$id`} params={{id: identity.id}} className="formula-text" style={{color:'var(--color-umain-accent)', textDecoration:'none', fontSize:'0.75rem'}}>
              ← {identity.nombre}
            </Link>
            <h1 style={{marginTop:'0.25rem'}}>Matriz de Consentimiento</h1>
            <p className="formula-text mt-1">65 categorias IAB - {consent ? `v${consent.version}` : 'nueva configuración'}</p>
          </div>
        </div>

        {/* Summary bar */}
        <div className="wireframe-box" style={{padding:'1rem', marginBottom:'1.5rem'}}>
          <div style={{display:'flex', gap:'1.5rem', flexWrap:'wrap', alignItems:'center'}}>
            {STATUS_OPTIONS.map(opt => (
              <div key={opt.value} style={{display:'flex', alignItems:'center', gap:'0.375rem'}}>
                <span style={{width:8, height:8, borderRadius:'50%', background:opt.color}}></span>
                <span className="formula-text" style={{fontSize:'0.75rem'}}>{opt.label}: <strong style={{color:opt.color}}>{counts[opt.value]}</strong></span>
              </div>
            ))}
            <div style={{marginLeft:'auto', display:'flex', gap:'0.5rem'}}>
              <select className="umain-input" style={{width:'auto', padding:'0.375rem 0.75rem', fontSize:'0.75rem'}}
                value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="todas">Todas las categorias</option>
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <button className="umain-button-primary" style={{fontSize:'0.75rem'}}>Guardar matriz</button>
            </div>
          </div>
        </div>

        {/* Categories grid */}
        <div className="umain-card">
          <div className="umain-card__body" style={{padding:0}}>
            <table className="umain-table">
              <thead>
                <tr>
                  <th style={{width:'50px'}}>#</th>
                  <th>Categoria IAB</th>
                  <th style={{width:'300px'}}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cat, i) => (
                  <tr key={cat.id}>
                    <td><span className="formula-text" style={{fontSize:'0.75rem', color:'var(--color-umain-text-dim)'}}>{i + 1}</span></td>
                    <td>
                      <span className="formula-text" style={{fontSize:'0.75rem', color:'var(--color-umain-text-dim)'}}>{cat.id}</span>
                      <span style={{display:'block', fontSize:'0.875rem', marginTop:'0.125rem'}}>{cat.nombre}</span>
                    </td>
                    <td>
                      <div style={{display:'flex', gap:'0.375rem', flexWrap:'wrap'}}>
                        {STATUS_OPTIONS.map(opt => {
                          const current = entries[cat.id] || 'sin_definir';
                          const isSelected = current === opt.value;
                          return (
                            <button
                              key={opt.value}
                              onClick={() => setCategoryStatus(cat.id, opt.value)}
                              style={{
                                padding: '0.25rem 0.625rem',
                                fontSize: '0.6875rem',
                                fontFamily: "'Geist Mono', monospace",
                                borderRadius: '999px',
                                border: isSelected ? `1.5px solid ${opt.color}` : '1px solid var(--color-umain-border)',
                                background: isSelected ? `${opt.color}20` : 'transparent',
                                color: isSelected ? opt.color : 'var(--color-umain-text-dim)',
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                              }}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
