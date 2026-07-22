import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "../../components/sidebar";
import { useState, useEffect } from "react";
import { getJobs } from "../../lib/queries";

export const Route = createFileRoute("/usage/")({
  component: UsagePage,
});

function UsagePage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await getJobs();
      setJobs(data as any[]);
    } catch (err) {
      console.error('Error loading jobs:', err);
    }
    setLoading(false);
  };

  // Mock data for demo
  const mockUsages = [
    {
      date: 'Abr 2026',
      brand: 'L\'Oréal Paris',
      campaign: 'Revitalift',
      category: 'IAB-186 Cuidado capilar',
      type: 'Video corto',
      territory: '🇦🇷 🇨🇱 🇺🇾',
      status: 'active',
      amount: '$2,100',
      split: 'Tu parte: $1,365',
    },
    {
      date: 'Feb 2026',
      brand: 'H&M',
      campaign: 'Spring/Summer collection',
      category: 'IAB-225 Moda femenina',
      type: 'Campaña de fotos',
      territory: '🌍 Global',
      status: 'active',
      amount: '$1,800',
      split: 'Tu parte: $1,170',
    },
    {
      date: 'Feb 2026',
      brand: 'Pepsi',
      campaign: 'Summer refresh',
      category: 'IAB-1104 Bebidas',
      type: 'Fotos',
      territory: '🇦🇷 🇧🇷',
      status: 'locked',
      amount: '$3,200',
      split: 'Tu parte: $2,080',
    },
    {
      date: 'Ene 2026',
      brand: 'Cartier',
      campaign: 'Love collection',
      category: 'IAB-197 Joyería de lujo',
      type: 'Editorial',
      territory: '🇪🇺 🇺🇸',
      status: 'active',
      amount: '$5,500',
      split: 'Tu parte: $3,575',
    },
    {
      date: 'Dic 2025',
      brand: 'Zara',
      campaign: 'Holiday collection',
      category: 'IAB-225 Moda femenina',
      type: 'Editorial',
      territory: '🌍 Global',
      status: 'expired',
      amount: '$2,400',
      split: 'Tu parte: $1,560',
    },
    {
      date: 'Nov 2025',
      brand: 'Quilmes',
      campaign: 'Summer edition',
      category: 'IAB-430 Versión sin alcohol',
      type: 'Video',
      territory: '🇦🇷',
      status: 'expired',
      amount: '$1,100',
      split: 'Tu parte: $715',
    },
    {
      date: 'Oct 2025',
      brand: 'MAC Cosmetics',
      campaign: 'Ruby Woo',
      category: 'IAB-204 Cosmética',
      type: 'Fotos',
      territory: '🌍 Global',
      status: 'expired',
      amount: '$2,800',
      split: 'Tu parte: $1,820',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="umain-status-badge umain-status-badge--active">Activo</span>;
      case 'locked':
        return <span className="umain-status-badge umain-status-badge--locked">Bloqueado</span>;
      case 'expired':
        return <span className="umain-status-badge umain-status-badge--expired">Vencido</span>;
      default:
        return <span className="umain-status-badge">{status}</span>;
    }
  };

  return (
    <div className="umain-layout">
      <Sidebar />
      <main className="umain-main" style={{ maxWidth: '1200px' }}>
        {/* Header */}
        <div className="umain-page-header">
          <div>
            <div className="umain-page-label">Registro de usos</div>
            <h1>Cada <em>uso</em>, registrado.</h1>
            <p className="umain-page-description">
              Historial completo de todos los usos licenciados de tu identidad digital. 
              Cada entrada incluye Content Credentials C2PA y tracking de regalías.
            </p>
          </div>
          <div className="umain-page-header__actions">
            <button className="umain-button-ghost umain-button-sm">Exportar CSV</button>
            <button className="umain-button-ghost umain-button-sm">Filtrar</button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="umain-stats-grid">
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Usos totales</div>
            <div className="umain-stat-card__value">23</div>
            <div className="umain-stat-card__detail">Desde nov 2025</div>
          </div>
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Activos ahora</div>
            <div className="umain-stat-card__value">7</div>
            <div className="umain-stat-card__detail">Proyectos al aire</div>
          </div>
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Ingresos acumulados</div>
            <div className="umain-stat-card__value">$32,080</div>
            <div className="umain-stat-card__detail">Tu parte de regalías</div>
          </div>
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Promedio por proyecto</div>
            <div className="umain-stat-card__value">$1,395</div>
            <div className="umain-stat-card__detail">Últimos 12 meses</div>
          </div>
        </div>

        {/* Usage Timeline */}
        <div className="umain-card">
          <div className="umain-card__header">
            <h2 className="umain-card__title">Todos los usos registrados</h2>
            <a className="umain-view-all">+ Exportar PDF</a>
          </div>

          {mockUsages.map((usage, index) => (
            <div key={index} className="umain-timeline-item">
              <div className="umain-timeline-date">{usage.date}</div>
              <div className="umain-timeline-thumb">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <ellipse cx="12" cy="9" rx="5" ry="6" stroke="currentColor" strokeWidth="0.8" />
                  <path d="M3 24 Q 3 15 12 15 Q 21 15 21 24" stroke="currentColor" strokeWidth="0.8" fill="none" />
                </svg>
              </div>
              <div className="umain-timeline-info">
                <h4>{usage.brand} · {usage.campaign}</h4>
                <div className="meta">{usage.category} · {usage.type} · {usage.amount} ({usage.split})</div>
              </div>
              <div className="umain-timeline-territory">{usage.territory}</div>
              <div className="umain-timeline-status">
                {getStatusBadge(usage.status)}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
