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
  { value: 'permitido', label: 'Autorizado', color: '#4A7A52' },
  { value: 'caso_por_caso', label: 'Caso por caso', color: '#B89A4A' },
  { value: 'solo_notificar', label: 'Solo notificar', color: '#4A6A8A' },
  { value: 'prohibido', label: 'Prohibido', color: '#A84A4A' },
  { value: 'sin_definir', label: 'Sin evaluar', color: '#7C7C7B' },
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
            <div className="umain-empty__icon">⚠</div>
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

  const totalEvaluated = counts.permitido + counts.caso_por_caso + counts.solo_notificar + counts.prohibido;
  const completionPercent = Math.round((totalEvaluated / IAB_CATEGORIES.length) * 100);

  return (
    <div className="umain-layout">
      <Sidebar />
      <main className="umain-main" style={{ maxWidth: '1200px' }}>
        {/* Header */}
        <div className="umain-page-header">
          <div>
            <Link 
              to={`/identities/$id`} 
              params={{ id: identity.id }} 
              style={{ 
                color: 'var(--color-umain-brand)', 
                textDecoration: 'none', 
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}
            >
              ← {identity.nombre}
            </Link>
            <div className="umain-page-label" style={{ marginTop: '0.5rem' }}>Matriz de consentimiento</div>
            <h1>Tus preferencias por <em>categoría</em>.</h1>
            <p className="umain-page-description">
              Definí con qué categorías de producto querés trabajar. Cada uso licenciado respeta estas preferencias. 
              Cumple con IAB Content Taxonomy 3.1.
            </p>
          </div>
          <div className="umain-page-header__actions">
            <button className="umain-button-ghost umain-button-sm">Wizard de onboarding</button>
            <button className="umain-button-primary umain-button-sm">Guardar y firmar</button>
          </div>
        </div>

        {/* Progress + Filters */}
        <div className="umain-matrix-header">
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', color: 'var(--color-umain-text-secondary)', marginBottom: '0.5rem' }}>
              Completitud de la matriz
            </div>
            <div className="umain-progress">
              <div className="umain-progress__bar" style={{ width: `${completionPercent}%` }} />
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-umain-text)', marginTop: '0.5rem' }}>
              {totalEvaluated} de {IAB_CATEGORIES.length} categorías evaluadas · {counts.sin_definir} sin definir
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '2rem' }}>
            <button 
              className={`umain-filter-btn ${filter === 'todas' ? 'umain-filter-btn--active' : ''}`}
              onClick={() => setFilter('todas')}
            >
              Todas
            </button>
            <button 
              className={`umain-filter-btn ${filter === 'permitido' ? 'umain-filter-btn--active' : ''}`}
              onClick={() => setFilter('permitido')}
            >
              Autorizadas
            </button>
            <button 
              className={`umain-filter-btn ${filter === 'caso_por_caso' ? 'umain-filter-btn--active' : ''}`}
              onClick={() => setFilter('caso_por_caso')}
            >
              Caso por caso
            </button>
            <button 
              className={`umain-filter-btn ${filter === 'prohibido' ? 'umain-filter-btn--active' : ''}`}
              onClick={() => setFilter('prohibido')}
            >
              Prohibidas
            </button>
            <button 
              className={`umain-filter-btn ${filter === 'sin_definir' ? 'umain-filter-btn--active' : ''}`}
              onClick={() => setFilter('sin_definir')}
            >
              Sin definir
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="umain-matrix-legend">
          {STATUS_OPTIONS.map(opt => (
            <div key={opt.value} className="umain-legend-item">
              <span className="umain-legend-dot" style={{ background: opt.color }} />
              <span>{opt.label} ({counts[opt.value]})</span>
            </div>
          ))}
        </div>

        {/* Categories Grid */}
        <div className="umain-matrix-grid">
          {filtered.map((cat) => {
            const current = entries[cat.id] || 'sin_definir';
            const statusOption = STATUS_OPTIONS.find(o => o.value === current);
            
            return (
              <div key={cat.id} className="umain-matrix-category" onClick={() => {
                // Cycle through statuses on click
                const currentIndex = STATUS_OPTIONS.findIndex(o => o.value === current);
                const nextIndex = (currentIndex + 1) % STATUS_OPTIONS.length;
                setCategoryStatus(cat.id, STATUS_OPTIONS[nextIndex].value);
              }}>
                <div 
                  className={`umain-category-state umain-category-state--${current === 'permitido' ? 'allowed' : current === 'caso_por_caso' ? 'case-by-case' : current === 'solo_notificar' ? 'notify' : current === 'prohibido' ? 'prohibited' : 'unset'}`}
                />
                <div className="umain-category-code">{cat.id}</div>
                <div className="umain-category-name">{cat.nombre}</div>
                <div className="umain-category-description">{cat.desc}</div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
