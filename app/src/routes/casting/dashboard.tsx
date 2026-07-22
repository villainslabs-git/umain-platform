import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "../../components/sidebar";

export const Route = createFileRoute("/casting/dashboard")({
  component: CastingDashboard,
});

function CastingDashboard() {
  const roster = [
    { id: 1, name: "Manu Jantus", tier: "A", status: "activo", projects: 4, royalties: "$10,712", avatar: "MJ" },
    { id: 2, name: "Lucía Fernández", tier: "A", status: "activo", projects: 3, royalties: "$8,450", avatar: "LF" },
    { id: 3, name: "Camila Torres", tier: "B", status: "activo", projects: 2, royalties: "$4,200", avatar: "CT" },
    { id: 4, name: "Sofía López", tier: "B", status: "suspendido", projects: 0, royalties: "$1,800", avatar: "SL" },
    { id: 5, name: "Valentina Ruiz", tier: "C", status: "activo", projects: 1, royalties: "$950", avatar: "VR" },
  ];

  const pendingApprovals = [
    { talent: "Manu Jantus", brand: "Samsung Galaxy Z Flip", deadline: "28 abr", category: "IAB-575" },
    { talent: "Lucía Fernández", brand: "Nike Running", deadline: "2 may", category: "IAB-15" },
    { talent: "Camila Torres", brand: "L'Oréal Paris", deadline: "5 may", category: "IAB-204" },
  ];

  return (
    <div className="umain-layout">
      <Sidebar />
      <main className="umain-main" style={{ maxWidth: '1200px' }}>
        {/* Header */}
        <div className="umain-page-header">
          <div>
            <div className="umain-page-label">Casting Club</div>
            <h1>Panel de <em>representante</em></h1>
            <p className="umain-page-description">
              Gestiona tu roster de talentos, aprueba solicitudes en su nombre y supervisa las campañas activas.
            </p>
          </div>
          <div className="umain-page-header__actions">
            <Link to="/casting/new-talent" className="umain-button-primary umain-button-sm">
              + Nuevo talento
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="umain-stats-grid">
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Talentos activos</div>
            <div className="umain-stat-card__value">4</div>
            <div className="umain-stat-card__detail">5 total en roster</div>
          </div>
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Proyectos activos</div>
            <div className="umain-stat-card__value">10</div>
            <div className="umain-stat-card__detail">Across all talentos</div>
          </div>
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Regalías totales</div>
            <div className="umain-stat-card__value">$26,112</div>
            <div className="umain-stat-card__detail">Tu comisión: $5,222</div>
          </div>
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Aprobaciones pendientes</div>
            <div className="umain-stat-card__value">3</div>
            <div className="umain-stat-card__detail">
              <span style={{ color: 'var(--color-status-pending)' }}>Requieren atención</span>
            </div>
          </div>
        </div>

        <div className="umain-content-grid">
          <div>
            {/* Roster */}
            <div className="umain-card">
              <div className="umain-card__header">
                <h2 className="umain-card__title">Tu Roster</h2>
                <Link to="/casting/roster" className="umain-view-all">Ver todos</Link>
              </div>
              <div style={{ padding: '1.25rem' }}>
                {roster.map((talent) => (
                  <div key={talent.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem',
                    marginBottom: '0.5rem',
                    background: 'var(--color-umain-bg-alt)',
                    borderRadius: '2px',
                    border: '0.5px solid var(--color-umain-border)',
                  }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'var(--color-umain-brand)',
                      color: '#FFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'Archivo', sans-serif",
                      fontSize: '14px',
                      fontWeight: 500,
                    }}>
                      {talent.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 450 }}>
                        {talent.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-umain-text-dim)' }}>
                        Tier {talent.tier} · {talent.projects} proyectos
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '13px', fontWeight: 500 }}>{talent.royalties}</div>
                      <span className={`umain-status-badge umain-status-badge--${talent.status === 'activo' ? 'active' : 'pending'}`}>
                        {talent.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="umain-card">
              <div className="umain-card__header">
                <h2 className="umain-card__title">Aprobaciones Pendientes</h2>
                <span className="umain-status-badge umain-status-badge--pending">3 pendientes</span>
              </div>
              <div style={{ padding: '1.25rem' }}>
                {pendingApprovals.map((approval, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem',
                    marginBottom: '0.5rem',
                    background: 'var(--color-umain-bg-alt)',
                    borderRadius: '2px',
                    border: '0.5px solid var(--color-umain-border)',
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 450, fontSize: '13px' }}>
                        {approval.brand}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-umain-text-dim)' }}>
                        {approval.talent} · {approval.category}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '11px', color: 'var(--color-status-error)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Fecha límite
                      </div>
                      <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 450, color: 'var(--color-status-error)' }}>
                        {approval.deadline}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      <button className="umain-button-ghost umain-button-sm">Ver</button>
                      <button className="umain-button-primary umain-button-sm">Aprobar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            {/* Quick Actions */}
            <div className="umain-card">
              <div className="umain-card__header">
                <h2 className="umain-card__title">Acciones rápidas</h2>
              </div>
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link to="/casting/new-talent" className="umain-button-primary" style={{ width: '100%', textAlign: 'center' }}>
                  + Crear nuevo talento
                </Link>
                <Link to="/casting/contracts" className="umain-button-ghost" style={{ width: '100%', textAlign: 'center' }}>
                  Gestionar contratos
                </Link>
                <Link to="/casting/reports" className="umain-button-ghost" style={{ width: '100%', textAlign: 'center' }}>
                  Reportes de comisiones
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="umain-card">
              <div className="umain-card__header">
                <h2 className="umain-card__title">Actividad reciente</h2>
              </div>
              <div style={{ padding: '1rem 1.25rem' }}>
                <div className="umain-activity-item">
                  <div className="umain-activity-dot umain-activity-dot--completed"></div>
                  <div className="umain-activity-content">
                    <div className="umain-activity-title">Manu Jantus aprobó campaña Samsung</div>
                    <div className="umain-activity-meta">Hace 2 horas</div>
                  </div>
                </div>
                <div className="umain-activity-item">
                  <div className="umain-activity-dot umain-activity-dot--pending"></div>
                  <div className="umain-activity-content">
                    <div className="umain-activity-title">Nuevo talento: Valentina Ruiz agregada al roster</div>
                    <div className="umain-activity-meta">Ayer</div>
                  </div>
                </div>
                <div className="umain-activity-item">
                  <div className="umain-activity-dot umain-activity-dot--completed"></div>
                  <div className="umain-activity-content">
                    <div className="umain-activity-title">Contrato con L'Oréal Paris renovado</div>
                    <div className="umain-activity-meta">Hace 3 días</div>
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
