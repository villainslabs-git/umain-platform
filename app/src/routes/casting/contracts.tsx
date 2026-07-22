import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "../../components/sidebar";
import { getContractsOverview } from "../../lib/queries";

export const Route = createFileRoute("/casting/contracts")({
  component: CastingContractsPage,
  loader: async () => {
    try {
      return await getContractsOverview();
    } catch {
      return { marcos: [], licencias: [], legales: [] };
    }
  },
});

function fecha(s: string) {
  try {
    return new Date(s).toLocaleDateString("es-AR");
  } catch {
    return s;
  }
}

function CastingContractsPage() {
  const data = Route.useLoaderData() as {
    marcos: Array<Record<string, any>>;
    licencias: Array<Record<string, any>>;
    legales: Array<Record<string, any>>;
  };

  return (
    <div className="umain-layout">
      <Sidebar />
      <main className="umain-main" style={{ maxWidth: "1200px" }}>
        <div className="umain-page-header">
          <div>
            <div className="umain-page-label">Casting Club</div>
            <h1>Contratos del <em>roster</em>.</h1>
            <p className="umain-page-description">
              Acuerdos marco por talento y licencias de uso firmadas. Todo tripartito: UMAIN, Casting Club y el talento.
            </p>
          </div>
          <div className="umain-page-header__actions">
            <Link to="/casting/dashboard" className="umain-button-ghost umain-button-sm">
              Volver al panel
            </Link>
          </div>
        </div>

        <div
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "var(--color-umain-brand)",
            margin: "0 0 1rem",
          }}
        >
          Acuerdos marco por talento
        </div>

        {data.marcos.length === 0 ? (
          <div className="umain-empty" style={{ padding: "2rem" }}>
            Sin acuerdos marco registrados.
          </div>
        ) : (
          data.marcos.map((m) => (
            <div key={m.id} className="umain-contract-item">
              <div className="umain-contract-icon">
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                  <path d="M3 1 L13 1 L13 15 L3 15 Z" stroke="currentColor" strokeWidth="1" fill="none" />
                  <line x1="5" y1="5" x2="11" y2="5" stroke="currentColor" strokeWidth="1" />
                  <line x1="5" y1="8" x2="11" y2="8" stroke="currentColor" strokeWidth="1" />
                  <line x1="5" y1="11" x2="9" y2="11" stroke="currentColor" strokeWidth="1" />
                </svg>
              </div>
              <div>
                <div className="umain-contract-name">
                  {m.nombre} · Acuerdo marco {m.contrato_ref}
                </div>
                <div className="umain-contract-meta">
                  Tier {m.tier} · Tripartito UMAIN, CC y talento · Alta {fecha(m.created_at)}
                </div>
              </div>
              <div className="umain-contract-signed">
                <div
                  style={{
                    color:
                      m.estado === "activo" ? "var(--color-status-active)" : "var(--color-status-pending)",
                  }}
                >
                  {m.estado === "activo" ? "✓ Vigente" : m.estado}
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.375rem" }}>
                <Link to="/identities/$id" params={{ id: m.id }} className="umain-button-ghost umain-button-sm">
                  Ver talento
                </Link>
              </div>
            </div>
          ))
        )}

        <div
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "var(--color-umain-brand)",
            margin: "2rem 0 1rem",
          }}
        >
          Licencias de uso firmadas
        </div>

        {data.licencias.length === 0 ? (
          <div className="umain-empty" style={{ padding: "2rem" }}>
            Sin licencias firmadas todavía.
          </div>
        ) : (
          <table className="umain-table">
            <thead>
              <tr>
                <th>Talento</th>
                <th>Campaña</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th>Firmada</th>
              </tr>
            </thead>
            <tbody>
              {data.licencias.map((l) => (
                <tr key={l.id}>
                  <td style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 450 }}>{l.talento_nombre}</td>
                  <td>{l.campania_nombre}</td>
                  <td>{l.campania_cliente}</td>
                  <td>
                    <span
                      className={`umain-status-badge umain-status-badge--${
                        l.estado === "vigente" ? "active" : l.estado === "vencida" ? "borrador" : "suprimido"
                      }`}
                    >
                      {l.estado}
                    </span>
                  </td>
                  <td>{fecha(l.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
