import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "../../components/sidebar";

export const Route = createFileRoute("/locks/")({
  component: LocksPage,
});

function LocksPage() {
  const activeLocks = [
    {
      brand: 'L\'Oréal Paris',
      category: 'IAB-186',
      categoryLabel: 'Cuidado capilar · Campaña Revitalift',
      competitors: 'Pantene, Herbal Essences, Dove Hair, TRESemmé, Schwarzkopf',
      expires: '15 jun 2026',
      daysLeft: 54,
      progress: 65,
      started: '22 abr 2026',
    },
    {
      brand: 'Pepsi',
      category: 'IAB-1104',
      categoryLabel: 'Bebidas · Summer refresh',
      competitors: 'Coca-Cola, Fanta, Sprite, Dr Pepper, 7Up, Mirinda',
      expires: '30 ago 2026',
      daysLeft: 130,
      progress: 32,
      started: '15 feb 2026',
    },
  ];

  const releasedLocks = [
    {
      date: 'Mar 2026',
      brand: 'MAC Cosmetics',
      detail: 'IAB-204 · Exclusividad de 6 meses · Categoría abierta',
      status: 'Liberada',
    },
    {
      date: 'Ene 2026',
      brand: 'Adidas',
      detail: 'IAB-15 · Exclusividad de 9 meses · Categoría abierta',
      status: 'Liberada',
    },
  ];

  return (
    <div className="umain-layout">
      <Sidebar />
      <main className="umain-main" style={{ maxWidth: '1200px' }}>
        {/* Header */}
        <div className="umain-page-header">
          <div>
            <div className="umain-page-label">Exclusividades</div>
            <h1>Tus ventanas <em>competitivas</em>.</h1>
            <p className="umain-page-description">
              Acuerdos de exclusividad activos que protegen a las marcas con las que trabajás 
              de conflictos con competidores. Cada exclusividad se libera automáticamente al 
              final de su ventana.
            </p>
          </div>
          <div className="umain-page-header__actions">
            <button className="umain-button-ghost umain-button-sm">Historial</button>
            <button className="umain-button-ghost umain-button-sm">Cómo funciona</button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="umain-stats-grid">
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Exclusividades activas</div>
            <div className="umain-stat-card__value">2</div>
            <div className="umain-stat-card__detail">En 2 categorías</div>
          </div>
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Próxima liberación</div>
            <div className="umain-stat-card__value">8 may</div>
            <div className="umain-stat-card__detail">Termina el cooldown de Pepsi</div>
          </div>
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Marcas bloqueadas</div>
            <div className="umain-stat-card__value">11</div>
            <div className="umain-stat-card__detail">Competidores excluidos</div>
          </div>
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Ingresos protegidos</div>
            <div className="umain-stat-card__value">$8,060</div>
            <div className="umain-stat-card__detail">Premium por exclusividad</div>
          </div>
        </div>

        {/* Active Locks */}
        {activeLocks.map((lock, index) => (
          <div key={index} className="umain-lock-card">
            <div>
              <div className="umain-lock-brand">{lock.brand}</div>
              <div className="umain-lock-category">
                <span className="umain-category-tag">{lock.category}</span>
                <span>{lock.categoryLabel}</span>
              </div>
              <div className="umain-lock-competitors">
                Bloquea: {lock.competitors}
              </div>
            </div>
            <div className="umain-lock-dates">
              <div style={{ 
                fontSize: '10px', 
                textTransform: 'uppercase', 
                letterSpacing: '0.1em', 
                color: 'var(--color-umain-text-dim)', 
                marginBottom: '0.25rem' 
              }}>
                Vence
              </div>
              <strong>{lock.expires}</strong>
              <div style={{ 
                fontSize: '11px', 
                color: 'var(--color-umain-text-secondary)', 
                marginTop: '0.25rem' 
              }}>
                quedan {lock.daysLeft} días
              </div>
            </div>
            <div className="umain-lock-progress">
              <div className="umain-lock-progress-label">{lock.progress}% transcurrido</div>
              <div className="umain-lock-progress-bar">
                <div className="umain-lock-progress-fill" style={{ width: `${lock.progress}%` }} />
              </div>
              <div style={{ 
                fontSize: '10px', 
                color: 'var(--color-umain-text-dim)', 
                marginTop: '0.25rem' 
              }}>
                Inició el {lock.started}
              </div>
            </div>
          </div>
        ))}

        {/* Released Locks */}
        <div className="umain-card" style={{ marginTop: '2rem' }}>
          <div className="umain-card__header">
            <h2 className="umain-card__title">Liberadas recientemente</h2>
            <a className="umain-view-all">Ver todo</a>
          </div>

          {releasedLocks.map((lock, index) => (
            <div key={index} className="umain-timeline-item">
              <div className="umain-timeline-date">{lock.date}</div>
              <div className="umain-timeline-thumb">
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="7" width="12" height="8" stroke="currentColor" strokeWidth="1" />
                  <path d="M5 7 L5 4 Q 5 1 8 1 Q 11 1 11 4 L11 7" stroke="currentColor" strokeWidth="1" fill="none" />
                </svg>
              </div>
              <div className="umain-timeline-info">
                <h4>{lock.brand} · Cosmética liberada</h4>
                <div className="meta">{lock.detail}</div>
              </div>
              <div className="umain-timeline-territory">·</div>
              <div className="umain-timeline-status">
                <span className="umain-status-badge umain-status-badge--expired">{lock.status}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
