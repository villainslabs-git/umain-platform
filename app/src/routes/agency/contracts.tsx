import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "../../components/sidebar";
import { getContractsOverview } from "../../lib/queries";

export const Route = createFileRoute("/agency/contracts")({
  component: AgencyContractsPage,
  loader: async () => {
    try {
      return await getContractsOverview();
    } catch {
      return { marcos: [], licencias: [], legales: [] };
    }
  },
});

const fmtUsd = (n: number) =>
  `$${Number(n ?? 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

function parseJson(s: unknown): Record<string, any> {
  if (typeof s !== "string") return {};
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}

function fecha(s: string) {
  try {
    return new Date(s).toLocaleDateString("es-AR");
  } catch {
    return s;
  }
}

function AgencyContractsPage() {
  const data = Route.useLoaderData() as {
    marcos: Array<Record<string, any>>;
    licencias: Array<Record<string, any>>;
    legales: Array<Record<string, any>>;
  };
  const vigentes = data.licencias.filter((l) => l.estado === "vigente");

  return (
    <div className="umain-layout">
      <Sidebar />
      <main className="umain-main" style={{ maxWidth: "1200px" }}>
        <div className="umain-page-header">
          <div>
            <div className="umain-page-label">Productora</div>
            <h1>Contratos de <em>uso</em>.</h1>
            <p className="umain-page-description">
              Las licencias que firmaste, su alcance y su vigencia. Cada una respaldada por el consentimiento del talento.
            </p>
          </div>
          <div className="umain-page-header__actions">
            <Link to="/agency/requests" className="umain-button-ghost umain-button-sm">
              Ver solicitudes
            </Link>
          </div>
        </div>

        <div className="umain-stats-grid">
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Licencias vigentes</div>
            <div className="umain-stat-card__value">{vigentes.length}</div>
            <div className="umain-stat-card__detail">{data.licencias.length} firmadas en total</div>
          </div>
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Inversión vigente</div>
            <div className="umain-stat-card__value">
              {fmtUsd(vigentes.reduce((a, l) => a + Number(parseJson(l.economia).monto_usd ?? 0), 0))}
            </div>
            <div className="umain-stat-card__detail">Solo licencias activas</div>
          </div>
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Marco legal</div>
            <div className="umain-stat-card__value">{data.marcos.length}</div>
            <div className="umain-stat-card__detail">Talentos con acuerdo marco</div>
          </div>
        </div>

        <div className="umain-card">
          <div className="umain-card__header">
            <h2 className="umain-card__title">Licencias firmadas</h2>
          </div>
          {data.licencias.length === 0 ? (
            <div className="umain-empty" style={{ padding: "2rem" }}>
              Sin contratos de uso firmados todavía.
            </div>
          ) : (
            <table className="umain-table">
              <thead>
                <tr>
                  <th>Talento</th>
                  <th>Campaña</th>
                  <th>Alcance</th>
                  <th>Fee</th>
                  <th>Estado</th>
                  <th>Firmada</th>
                </tr>
              </thead>
              <tbody>
                {data.licencias.map((l) => {
                  const alcance = parseJson(l.alcance);
                  const economia = parseJson(l.economia);
                  return (
                    <tr key={l.id}>
                      <td style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 450 }}>{l.talento_nombre}</td>
                      <td>
                        {l.campania_nombre}
                        <div style={{ fontSize: "11px", color: "var(--color-umain-text-dim)" }}>
                          {l.campania_cliente}
                        </div>
                      </td>
                      <td style={{ fontSize: "12px" }}>
                        {alcance.categoria ?? "General"}
                        <div style={{ fontSize: "11px", color: "var(--color-umain-text-dim)" }}>
                          {alcance.territorio ?? ""}{alcance.plazo_meses ? ` · ${alcance.plazo_meses} meses` : ""}
                        </div>
                      </td>
                      <td style={{ fontWeight: 500 }}>
                        {economia.monto_usd ? fmtUsd(economia.monto_usd) : "Sin monto"}
                      </td>
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
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
