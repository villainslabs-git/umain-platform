import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "../../components/sidebar";

export const Route = createFileRoute("/royalties/")({
  component: RoyaltiesPage,
});

function RoyaltiesPage() {
  const reports = [
    {
      period: 'Q1 2026 · ene–mar',
      title: 'Período en curso',
      status: 'open',
      statusText: 'Cierra el 30 jun 2026 · Pago el 15 jul 2026',
      total: '$8,996',
      items: [
        { brand: 'L\'Oréal Paris · Revitalift', detail: 'abr a jun 2026 · Cuidado capilar', gross: '$2,100', split: '65/35', net: '$1,365' },
        { brand: 'H&M · Spring/Summer', detail: 'abr a oct 2026 · Moda femenina', gross: '$1,800', split: '65/35', net: '$1,170' },
        { brand: 'Pepsi · Summer refresh', detail: 'feb a ago 2026 · Bebidas', gross: '$3,200', split: '65/35', net: '$2,080' },
        { brand: 'Cartier · Love collection', detail: 'ene a dic 2026 · Joyería de lujo', gross: '$5,500', split: '65/35', net: '$3,575' },
        { brand: 'MAC · Ruby Woo residual', detail: 'oct 2025 a mar 2026 · Cosmética', gross: '$1,240', split: '65/35', net: '$806' },
      ],
    },
    {
      period: 'Q4 2025 · oct–dic',
      title: 'Cerrado y pagado',
      status: 'paid',
      statusText: '✓ Pagado el 15 ene 2026 por transferencia',
      total: '$10,712',
      items: [],
    },
    {
      period: 'Q3 2025 · jul–sep',
      title: 'Cerrado y pagado',
      status: 'paid',
      statusText: '✓ Pagado el 15 oct 2025',
      total: '$9,074',
      items: [],
    },
    {
      period: 'Q2 2025 · abr–jun',
      title: 'Trimestre de onboarding',
      status: 'partial',
      statusText: 'Parcial: firmó con UMAIN en mayo 2025',
      total: '$3,302',
      items: [],
    },
  ];

  return (
    <div className="umain-layout">
      <Sidebar />
      <main className="umain-main" style={{ maxWidth: '1200px' }}>
        {/* Header */}
        <div className="umain-page-header">
          <div>
            <div className="umain-page-label">Regalías y reportes</div>
            <h1>Tus <em>ingresos</em>, auditables.</h1>
            <p className="umain-page-description">
              Reportes trimestrales con desglose completo de usos licenciados, splits de regalías, 
              e ingresos por territorio. Descargables en PDF para tu archivo o contador.
            </p>
          </div>
          <div className="umain-page-header__actions">
            <button className="umain-button-ghost umain-button-sm">Exportar todo</button>
            <button className="umain-button-ghost umain-button-sm">Contactar soporte</button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="umain-stats-grid">
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Ganado Q1 2026</div>
            <div className="umain-stat-card__value">$8,996</div>
            <div className="umain-stat-card__detail">5 usos activos</div>
          </div>
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Ganado Q4 2025</div>
            <div className="umain-stat-card__value">$10,712</div>
            <div className="umain-stat-card__detail">Pagado el 15 ene 2026</div>
          </div>
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Progreso del mínimo garantizado</div>
            <div className="umain-stat-card__value">50%</div>
            <div className="umain-stat-card__detail">$8,996 de $18,000</div>
          </div>
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Próximo pago</div>
            <div className="umain-stat-card__value">15 jul</div>
            <div className="umain-stat-card__detail">Reporte Q2 2026</div>
          </div>
        </div>

        {/* Evolution Chart */}
        <div className="umain-card" style={{ marginBottom: '1.5rem' }}>
          <div className="umain-card__header">
            <h2 className="umain-card__title">Evolución de ingresos</h2>
            <span style={{ 
              fontSize: '11px', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em', 
              color: 'var(--color-umain-text-dim)' 
            }}>
              4 trimestres
            </span>
          </div>
          <div style={{ padding: '1.5rem 1.25rem 1.25rem' }}>
            <svg 
              viewBox="-32 -10 640 175" 
              style={{ width: '100%', overflow: 'visible' }}
              role="img" 
              aria-label="Ingresos por trimestre"
            >
              {/* Grid lines */}
              <line x1="0" y1="0" x2="588" y2="0" stroke="rgba(11,11,11,0.06)" strokeWidth="0.5" />
              <line x1="0" y1="30" x2="588" y2="30" stroke="rgba(11,11,11,0.06)" strokeWidth="0.5" />
              <line x1="0" y1="60" x2="588" y2="60" stroke="rgba(11,11,11,0.06)" strokeWidth="0.5" />
              <line x1="0" y1="90" x2="588" y2="90" stroke="rgba(11,11,11,0.06)" strokeWidth="0.5" />
              
              {/* Y-axis labels */}
              <text x="-6" y="4" textAnchor="end" fontFamily="Archivo, sans-serif" fontSize="9" fill="#4B4B4A">$12k</text>
              <text x="-6" y="34" textAnchor="end" fontFamily="Archivo, sans-serif" fontSize="9" fill="#4B4B4A">$9k</text>
              <text x="-6" y="64" textAnchor="end" fontFamily="Archivo, sans-serif" fontSize="9" fill="#4B4B4A">$6k</text>
              <text x="-6" y="94" textAnchor="end" fontFamily="Archivo, sans-serif" fontSize="9" fill="#4B4B4A">$3k</text>
              
              {/* Bars */}
              <rect x="30" y="87" width="90" height="33" fill="#EBEBEA" rx="1" />
              <rect x="180" y="29" width="90" height="91" fill="#EBEBEA" rx="1" />
              <rect x="330" y="13" width="90" height="107" fill="#0B0B0B" opacity="0.65" rx="1" />
              <rect x="480" y="30" width="90" height="90" fill="#0B0B0B" rx="1" />
              
              {/* Bar values */}
              <text x="75" y="81" textAnchor="middle" fontFamily="Archivo, sans-serif" fontSize="9" fontWeight="500" fill="#4B4B4A">$3.3k</text>
              <text x="225" y="23" textAnchor="middle" fontFamily="Archivo, sans-serif" fontSize="9" fontWeight="500" fill="#4B4B4A">$9.1k</text>
              <text x="375" y="7" textAnchor="middle" fontFamily="Archivo, sans-serif" fontSize="9" fontWeight="600" fill="#3D3D3D">$10.7k</text>
              <text x="525" y="24" textAnchor="middle" fontFamily="Archivo, sans-serif" fontSize="9" fontWeight="600" fill="#3D3D3D">$9.0k</text>
              
              {/* X-axis labels */}
              <text x="75" y="148" textAnchor="middle" fontFamily="Archivo, sans-serif" fontSize="9" fill="#4B4B4A">Q2 '25</text>
              <text x="225" y="148" textAnchor="middle" fontFamily="Archivo, sans-serif" fontSize="9" fill="#4B4B4A">Q3 '25</text>
              <text x="375" y="148" textAnchor="middle" fontFamily="Archivo, sans-serif" fontSize="9" fontWeight="600" fill="#0B0B0B">Q4 '25</text>
              <text x="525" y="148" textAnchor="middle" fontFamily="Archivo, sans-serif" fontSize="9" fontWeight="600" fill="#0B0B0B">Q1 '26</text>
            </svg>
          </div>
        </div>

        {/* Reports */}
        {reports.map((report, index) => (
          <div key={index} className="umain-report-card">
            <div className="umain-report-header">
              <div>
                <div className="umain-report-period">{report.period}</div>
                <div className="umain-report-title">{report.title}</div>
                <div style={{ 
                  fontSize: '12px', 
                  color: report.status === 'paid' ? 'var(--color-status-active)' : 'var(--color-umain-text-secondary)', 
                  marginTop: '0.5rem' 
                }}>
                  {report.statusText}
                </div>
              </div>
              <div>
                <div className="umain-report-period" style={{ textAlign: 'right' }}>
                  {report.status === 'open' ? 'Ganado a la fecha' : 'Total ganado'}
                </div>
                <div className="umain-report-amount">
                  <span className="currency">$</span>{report.total.replace('$', '')}
                </div>
              </div>
            </div>

            {/* Breakdown for open report */}
            {report.items.length > 0 && (
              <>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 100px 100px 100px', 
                  gap: '1rem', 
                  padding: '0.75rem 0', 
                  fontSize: '10px', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.1em', 
                  color: 'var(--color-umain-text-dim)' 
                }}>
                  <div>Uso</div>
                  <div style={{ textAlign: 'right' }}>Bruto</div>
                  <div style={{ textAlign: 'right' }}>Split</div>
                  <div style={{ textAlign: 'right' }}>Tu parte</div>
                </div>
                
                {report.items.map((item, itemIndex) => (
                  <div key={itemIndex} style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 100px 100px 100px', 
                    gap: '1rem', 
                    padding: '0.75rem 0', 
                    fontSize: '13px', 
                    borderBottom: '0.5px solid var(--color-umain-border-soft)' 
                  }}>
                    <div>
                      <div style={{ fontFamily: "'Archivo', 'Helvetica Neue', Arial, sans-serif", fontSize: '14px' }}>
                        {item.brand}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-umain-text-secondary)' }}>
                        {item.detail}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{item.gross}</div>
                    <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{item.split}</div>
                    <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>{item.net}</div>
                  </div>
                ))}

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 100px 100px 100px', 
                  gap: '1rem', 
                  padding: '1rem 0', 
                  fontSize: '13px', 
                  fontWeight: 500, 
                  borderTop: '1px solid var(--color-umain-border)' 
                }}>
                  <div>Total Q1 2026</div>
                  <div style={{ textAlign: 'right' }}>$13,840</div>
                  <div style={{ textAlign: 'right' }}>·</div>
                  <div style={{ textAlign: 'right' }}>$8,996</div>
                </div>
              </>
            )}

            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              {report.items.length > 0 && <button className="umain-button-ghost umain-button-sm">Disputar</button>}
              <button className="umain-button-ghost umain-button-sm">Descargar PDF</button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
