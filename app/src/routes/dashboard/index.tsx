import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "../../components/sidebar";
import { getDashboardStats } from "../../lib/queries";
import type { DashboardStats } from "../../lib/umain-types";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
  loader: async () => {
    try {
      return await getDashboardStats();
    } catch {
      return null;
    }
  },
});

function DashboardPage() {
  const stats = Route.useLoaderData() as DashboardStats | null;

  const defaultStats: DashboardStats = {
    total_identidades: 0, identidades_activas: 0, identidades_suspendidas: 0,
    total_campanias: 0, campanias_activas: 0, licencias_vigentes: 0,
    jobs_en_curso: 0, jobs_completados: 0, aprobaciones_pendientes: 0, alertas: 0,
  };

  const s = stats ?? defaultStats;

  return (
    <div className="umain-layout">
      <Sidebar />
      <main className="umain-main" style={{ maxWidth: '1200px' }}>
        {/* Header */}
        <div className="umain-page-header">
          <div>
            <div className="umain-page-label">Panel</div>
            <h1>Hola <em>equipo</em>, acá está el resumen.</h1>
          </div>
          <div className="umain-page-header__actions">
            <Link to="/identities" className="umain-button-primary umain-button-sm">
              Nueva solicitud
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="umain-stats-grid">
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Identidades activas</div>
            <div className="umain-stat-card__value">{s.identidades_activas}</div>
            <div className="umain-stat-card__detail">{s.total_identidades} total en plataforma</div>
          </div>
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Licencias vigentes</div>
            <div className="umain-stat-card__value">{s.licencias_vigentes}</div>
            <div className="umain-stat-card__detail">{s.jobs_completados} jobs completados</div>
          </div>
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Campañas activas</div>
            <div className="umain-stat-card__value">{s.campanias_activas}</div>
            <div className="umain-stat-card__detail">{s.total_campanias} total</div>
          </div>
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Aprobaciones pendientes</div>
            <div className="umain-stat-card__value">{s.aprobaciones_pendientes}</div>
            <div className="umain-stat-card__detail">
              {s.aprobaciones_pendientes > 0 ? (
                <span style={{ color: 'var(--color-status-pending)' }}>Requieren revisión</span>
              ) : (
                'Sin pendientes'
              )}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="umain-content-grid">
          <div>
            {/* Activity Feed */}
            <div className="umain-card">
              <div className="umain-card__header">
                <h2 className="umain-card__title">Actividad reciente</h2>
                <Link to="/jobs" className="umain-view-all">Ver todo</Link>
              </div>

              <div className="umain-activity-item">
                <div className="umain-activity-dot umain-activity-dot--pending"></div>
                <div className="umain-activity-content">
                  <div className="umain-activity-title">Nuevo proyecto esperando aprobación</div>
                  <div className="umain-activity-meta">IAB-575 Smartphones · Territorio: LATAM · Fecha límite: 28 abr</div>
                </div>
                <Link to="/jobs" className="umain-activity-action">Revisar</Link>
              </div>

              <div className="umain-activity-item">
                <div className="umain-activity-dot umain-activity-dot--completed"></div>
                <div className="umain-activity-content">
                  <div className="umain-activity-title">L'Oréal Paris: Campaña 'Revitalift' entregada</div>
                  <div className="umain-activity-meta">Uso activo hasta 15 Jun 2026 · Content Credentials incorporados</div>
                </div>
                <Link to="/usage" className="umain-activity-action">Ver</Link>
              </div>

              <div className="umain-activity-item">
                <div className="umain-activity-dot umain-activity-dot--alert"></div>
                <div className="umain-activity-content">
                  <div className="umain-activity-title">Exclusividad: categoría Pepsi se libera en 14 días</div>
                  <div className="umain-activity-meta">Cooldown de bebidas termina 24 Abr · IAB-1104 disponible desde 8 May</div>
                </div>
                <Link to="/locks" className="umain-activity-action">Detalles</Link>
              </div>

              <div className="umain-activity-item">
                <div className="umain-activity-dot umain-activity-dot--completed"></div>
                <div className="umain-activity-content">
                  <div className="umain-activity-title">Reporte de regalías Q4 2025 emitido</div>
                  <div className="umain-activity-meta">Total ganado: $10,712 · 7 usos activos · Descargar PDF</div>
                </div>
                <Link to="/royalties" className="umain-activity-action">Reporte</Link>
              </div>
            </div>

            {/* Recent Usage */}
            <div className="umain-card">
              <div className="umain-card__header">
                <h2 className="umain-card__title">Usos recientes</h2>
                <Link to="/usage" className="umain-view-all">Registro completo</Link>
              </div>

              <div className="umain-timeline-item">
                <div className="umain-timeline-date">Abr 2026</div>
                <div className="umain-timeline-thumb">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <ellipse cx="12" cy="9" rx="5" ry="6" stroke="currentColor" strokeWidth="0.8" />
                    <path d="M3 24 Q 3 15 12 15 Q 21 15 21 24" stroke="currentColor" strokeWidth="0.8" fill="none" />
                  </svg>
                </div>
                <div className="umain-timeline-info">
                  <h4>L'Oréal Paris · Revitalift</h4>
                  <div className="meta">IAB-186 Cuidado capilar · Video corto</div>
                </div>
                <div className="umain-timeline-territory">🇦🇷 🇨🇱 🇺🇾</div>
                <div className="umain-timeline-status">
                  <span className="umain-status-badge umain-status-badge--active">Activo</span>
                </div>
              </div>

              <div className="umain-timeline-item">
                <div className="umain-timeline-date">Feb 2026</div>
                <div className="umain-timeline-thumb">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <ellipse cx="12" cy="9" rx="5" ry="6" stroke="currentColor" strokeWidth="0.8" />
                    <path d="M3 24 Q 3 15 12 15 Q 21 15 21 24" stroke="currentColor" strokeWidth="0.8" fill="none" />
                  </svg>
                </div>
                <div className="umain-timeline-info">
                  <h4>Pepsi · Summer refresh</h4>
                  <div className="meta">IAB-1104 Bebidas · Fotos</div>
                </div>
                <div className="umain-timeline-territory">🇦🇷 🇧🇷</div>
                <div className="umain-timeline-status">
                  <span className="umain-status-badge umain-status-badge--locked">Bloqueado</span>
                </div>
              </div>

              <div className="umain-timeline-item">
                <div className="umain-timeline-date">Dic 2025</div>
                <div className="umain-timeline-thumb">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <ellipse cx="12" cy="9" rx="5" ry="6" stroke="currentColor" strokeWidth="0.8" />
                    <path d="M3 24 Q 3 15 12 15 Q 21 15 21 24" stroke="currentColor" strokeWidth="0.8" fill="none" />
                  </svg>
                </div>
                <div className="umain-timeline-info">
                  <h4>Zara · Holiday collection</h4>
                  <div className="meta">IAB-225 Moda femenina · Editorial</div>
                </div>
                <div className="umain-timeline-territory">🌍 Global</div>
                <div className="umain-timeline-status">
                  <span className="umain-status-badge umain-status-badge--expired">Vencido</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            {/* Consentimiento rápido */}
            <div className="umain-card">
              <div className="umain-card__header">
                <h2 className="umain-card__title">Consentimiento rápido</h2>
              </div>

              <div style={{ padding: '1rem 1.25rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-umain-text-secondary)', marginBottom: '0.5rem' }}>
                    Completitud de la matriz
                  </div>
                  <div className="umain-progress">
                    <div className="umain-progress__bar" style={{ width: '72%' }} />
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-umain-text)', marginTop: '0.5rem' }}>
                    72% · 47 de 65 evaluadas
                  </div>
                </div>

                <div style={{ 
                  fontSize: '11px', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.15em', 
                  color: 'var(--color-umain-brand)', 
                  margin: '1.25rem 0 0.75rem' 
                }}>
                  Categorías más activas
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    { name: 'Moda y estilo', status: 'allowed' },
                    { name: 'Belleza y cosmética', status: 'allowed' },
                    { name: 'Alimentos y bebidas', status: 'case-by-case' },
                    { name: 'Alcohol', status: 'prohibited' },
                    { name: 'Tabaco', status: 'prohibited' },
                    { name: 'Apuestas', status: 'prohibited' },
                  ].map((cat) => (
                    <div key={cat.name} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '0.5rem 0.75rem', 
                      background: 'var(--color-umain-bg-alt)', 
                      borderRadius: '2px', 
                      fontSize: '12px' 
                    }}>
                      <span>{cat.name}</span>
                      <span className={`umain-category-state umain-category-state--${cat.status}`} 
                        style={{ position: 'static', width: '10px', height: '10px' }} />
                    </div>
                  ))}
                </div>

                <Link 
                  to="/consent-gate" 
                  className="umain-button-ghost umain-button-sm" 
                  style={{ display: 'block', marginTop: '1.25rem', textAlign: 'center', width: '100%' }}
                >
                  Editar la matriz de consentimiento →
                </Link>
              </div>
            </div>

            {/* Exclusividades activas */}
            <div className="umain-card">
              <div className="umain-card__header">
                <h2 className="umain-card__title">Exclusividades activas</h2>
                <Link to="/locks" className="umain-view-all">Ver todo</Link>
              </div>
              <div style={{ padding: '1rem 1.25rem', fontSize: '13px' }}>
                <div style={{ 
                  padding: '0.75rem', 
                  background: 'var(--color-umain-bg-alt)', 
                  borderRadius: '2px', 
                  marginBottom: '0.75rem', 
                  border: '0.5px solid var(--color-umain-border)' 
                }}>
                  <div style={{ 
                    fontFamily: "'Archivo', 'Helvetica Neue', Arial, sans-serif", 
                    fontStyle: 'normal', 
                    marginBottom: '0.25rem' 
                  }}>
                    L'Oréal Paris
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-umain-text-secondary)' }}>
                    Cuidado capilar (IAB-186)
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-umain-text-dim)', marginTop: '0.25rem' }}>
                    Hasta el 15 jun 2026 · quedan 54 días
                  </div>
                </div>
                <div style={{ 
                  padding: '0.75rem', 
                  background: 'var(--color-umain-bg-alt)', 
                  borderRadius: '2px', 
                  border: '0.5px solid var(--color-umain-border)' 
                }}>
                  <div style={{ 
                    fontFamily: "'Archivo', 'Helvetica Neue', Arial, sans-serif", 
                    fontStyle: 'normal', 
                    marginBottom: '0.25rem' 
                  }}>
                    Pepsi
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-umain-text-secondary)' }}>
                    Bebidas (IAB-1104)
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-umain-text-dim)', marginTop: '0.25rem' }}>
                    Hasta ago 2026 · Coca-Cola bloqueada
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
