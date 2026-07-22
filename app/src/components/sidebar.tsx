import { Link, useLocation } from "@tanstack/react-router";

const NAV_SECTIONS = [
  {
    label: "General",
    items: [
      { to: "/dashboard", label: "Panel", icon: "◈" },
      { to: "/profile", label: "Mi perfil", icon: "◈" },
    ],
  },
  {
    label: "Mi Identidad",
    items: [
      { to: "/identities", label: "Avatares/Clones", icon: "◈" },
      { to: "/consent-gate", label: "Consentimiento", icon: "◈" },
    ],
  },
  {
    label: "Campanas",
    items: [
      { to: "/campaigns", label: "Campanas", icon: "◈" },
      { to: "/licenses", label: "Licencias", icon: "◈" },
      { to: "/jobs", label: "Jobs", icon: "▶" },
    ],
  },
  {
    label: "Derechos",
    items: [
      { to: "/usage", label: "Registro de usos", icon: "◈" },
      { to: "/locks", label: "Exclusividades", icon: "◈" },
      { to: "/contracts", label: "Contratos", icon: "◈" },
    ],
  },
  {
    label: "Sistema",
    items: [
      { to: "/audit-log", label: "Audit Log", icon: "◈" },
      { to: "/settings", label: "Proveedores", icon: "⚙" },
      { to: "/legal", label: "Legal", icon: "◈" },
      { to: "/docs", label: "Docs", icon: "◈" },
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
            fontFamily: "'Archivo', 'Helvetica Neue', Arial, sans-serif",
            fontWeight: 650,
            fontStretch: '122%',
            fontSize: '1.45rem',
            letterSpacing: '0.38em',
            marginRight: '-0.38em',
            textTransform: 'uppercase',
            color: 'var(--color-umain-brand)',
            lineHeight: 1,
          }}>
            UMAIN
          </span>
          <span style={{ 
            display: 'block', 
            marginTop: '0.25rem',
            fontFamily: "'Archivo', 'Helvetica Neue', Arial, sans-serif",
            fontSize: '10px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-umain-text-dim)',
          }}>
            identidad real, licenciada
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
        padding: '1rem 1.5rem',
        borderTop: '0.5px solid var(--color-umain-border)',
      }}>
        <div style={{ 
          fontFamily: "'Archivo', 'Helvetica Neue', Arial, sans-serif",
          fontSize: '10px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--color-umain-text-dim)',
        }}>
          UMAIN v0.3.0
        </div>
        <div style={{ 
          fontFamily: "'Archivo', 'Helvetica Neue', Arial, sans-serif",
          fontSize: '10px',
          marginTop: '0.25rem',
          color: 'var(--color-umain-text-dim)',
          letterSpacing: '0.05em',
        }}>
          Rights Engine + Higgsfield
        </div>
      </div>
    </aside>
  );
}
