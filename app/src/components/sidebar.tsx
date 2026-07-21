import { Link, useLocation } from "@tanstack/react-router";

const NAV_SECTIONS = [
  {
    label: "General",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: "◈" },
    ],
  },
  {
    label: "Avatar/Clon",
    items: [
      { to: "/identities", label: "Avatares/Clones", icon: "◈" },
    ],
  },
  {
    label: "Campanas",
    items: [
      { to: "/campaigns", label: "Campanas", icon: "◈" },
      { to: "/licenses", label: "Licencias", icon: "◈" },
    ],
  },
  {
    label: "Rights Engine",
    items: [
      { to: "/consent-gate", label: "Compuerta de Consentimiento", icon: "◈" },
      { to: "/audit-log", label: "Audit Log", icon: "◈" },
    ],
  },
  {
    label: "Operaciones",
    items: [
      { to: "/jobs", label: "Jobs de generacion", icon: "▶" },
      { to: "/audit-log", label: "Audit Log", icon: "◈" },
    ],
  },
  {
    label: "Configuracion",
    items: [
      { to: "/settings", label: "Proveedores APIs", icon: "⚙" },
      { to: "/docs", label: "Documentacion", icon: "◈" },
      { to: "/legal", label: "Biblioteca legal", icon: "◈" },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="umain-sidebar">
      <div className="umain-sidebar__logo">
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <span style={{
            fontFamily: "'Geist', sans-serif",
            fontWeight: 700,
            fontSize: '1.25rem',
            background: 'linear-gradient(135deg, #7dd4fc, #f4a8c8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.03em',
          }}>
            UMAIN
          </span>
          <span className="formula-text" style={{ display: 'block', marginTop: '0.125rem' }}>
            avatares digitales
          </span>
        </Link>
      </div>

      <nav className="umain-sidebar__nav">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <div className="umain-sidebar__section">{section.label}</div>
            {section.items.map((item) => {
              const isActive = currentPath === item.to || currentPath.startsWith(item.to + '/');
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`umain-sidebar__link ${isActive ? 'umain-sidebar__link--active' : ''}`}
                >
                  <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div style={{
        padding: '1rem 1.25rem',
        borderTop: '1px solid var(--color-umain-border)',
      }}>
        <div className="formula-text" style={{ fontSize: '0.75rem' }}>
          UMAIN v0.2.0
        </div>
        <div className="formula-text" style={{ fontSize: '0.7rem', marginTop: '0.25rem', color: 'var(--color-umain-text-dim)' }}>
          Rights Engine + Higgsfield
        </div>
      </div>
    </aside>
  );
}
