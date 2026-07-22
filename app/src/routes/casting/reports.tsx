import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "../../components/sidebar";
import { getReports } from "../../lib/queries";

export const Route = createFileRoute("/casting/reports")({
  component: ReportsPage,
  loader: async () => {
    try {
      return await getReports();
    } catch {
      return { por_talento: [], por_campania: [] };
    }
  },
});

const fmtUsd = (n: number) =>
  `$${Number(n ?? 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

function ReportsPage() {
  const data = Route.useLoaderData() as {
    por_talento: Array<{ id: string; nombre: string; tier: string; licencias: number; bruto_usd: number; talento_usd: number }>;
    por_campania: Array<{ id: string; nombre: string; cliente: string; estado: string; licencias: number; bruto_usd: number }>;
  };
  const bruto = data.por_talento.reduce((a, t) => a + Number(t.bruto_usd ?? 0), 0);
  const talento = data.por_talento.reduce((a, t) => a + Number(t.talento_usd ?? 0), 0);
  const plataforma = bruto - talento;

  return (
    <div className="umain-layout">
      <Sidebar />
      <main className="umain-main" style={{ maxWidth: "1200px" }}>
        <div className="umain-page-header">
          <div>
            <div className="umain-page-label">Casting Club</div>
            <h1>Reportes de <em>regalías</em>.</h1>
            <p className="umain-page-description">
              Cuánto generó cada talento y cada campaña. El split del talento nunca baja del 50 por ciento.
            </p>
          </div>
          <div className="umain-page-header__actions">
            <Link to="/casting/dashboard" className="umain-button-ghost umain-button-sm">
              Volver al panel
            </Link>
          </div>
        </div>

        <div className="umain-stats-grid">
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Facturación bruta</div>
            <div className="umain-stat-card__value">{fmtUsd(bruto)}</div>
            <div className="umain-stat-card__detail">Licencias vigentes y vencidas</div>
          </div>
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Para el talento</div>
            <div className="umain-stat-card__value">{fmtUsd(talento)}</div>
            <div className="umain-stat-card__detail">Según split por licencia</div>
          </div>
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">UMAIN + Casting Club</div>
            <div className="umain-stat-card__value">{fmtUsd(plataforma)}</div>
            <div className="umain-stat-card__detail">A repartir según acuerdo</div>
          </div>
        </div>

        <div className="umain-card" style={{ marginBottom: "1.5rem" }}>
          <div className="umain-card__header">
            <h2 className="umain-card__title">Por talento</h2>
          </div>
          {data.por_talento.length === 0 ? (
            <div className="umain-empty" style={{ padding: "2rem" }}>
              Todavía no hay licencias con montos cargados.
            </div>
          ) : (
            <table className="umain-table">
              <thead>
                <tr>
                  <th>Talento</th>
                  <th>Tier</th>
                  <th>Licencias</th>
                  <th>Bruto</th>
                  <th>Para el talento</th>
                </tr>
              </thead>
              <tbody>
                {data.por_talento.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 450 }}>{t.nombre}</td>
                    <td>Tier {t.tier}</td>
                    <td>{t.licencias}</td>
                    <td style={{ fontWeight: 500 }}>{fmtUsd(t.bruto_usd)}</td>
                    <td>{fmtUsd(t.talento_usd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="umain-card">
          <div className="umain-card__header">
            <h2 className="umain-card__title">Por campaña</h2>
          </div>
          {data.por_campania.length === 0 ? (
            <div className="umain-empty" style={{ padding: "2rem" }}>
              Sin campañas registradas.
            </div>
          ) : (
            <table className="umain-table">
              <thead>
                <tr>
                  <th>Campaña</th>
                  <th>Cliente</th>
                  <th>Estado</th>
                  <th>Licencias</th>
                  <th>Bruto</th>
                </tr>
              </thead>
              <tbody>
                {data.por_campania.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 450 }}>{c.nombre}</td>
                    <td>{c.cliente}</td>
                    <td>
                      <span
                        className={`umain-status-badge umain-status-badge--${
                          c.estado === "activa" ? "active" : c.estado === "completada" ? "active" : "borrador"
                        }`}
                      >
                        {c.estado}
                      </span>
                    </td>
                    <td>{c.licencias}</td>
                    <td style={{ fontWeight: 500 }}>{fmtUsd(c.bruto_usd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
