import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "../../components/sidebar";
import { getAgencyCampaigns } from "../../lib/queries";

export const Route = createFileRoute("/agency/campaigns")({
  component: AgencyCampaignsPage,
  loader: async () => {
    try {
      return await getAgencyCampaigns();
    } catch {
      return [];
    }
  },
});

const fmtUsd = (n: number) =>
  `$${Number(n ?? 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

const BADGE: Record<string, string> = {
  activa: "active",
  completada: "active",
  borrador: "borrador",
  pausada: "pending",
  cancelada: "suprimido",
};

function AgencyCampaignsPage() {
  const campaigns = (Route.useLoaderData() as Array<Record<string, any>>) ?? [];
  const activas = campaigns.filter((c) => c.estado === "activa").length;
  const inversion = campaigns.reduce((a, c) => a + Number(c.inversion_usd ?? 0), 0);

  return (
    <div className="umain-layout">
      <Sidebar />
      <main className="umain-main" style={{ maxWidth: "1200px" }}>
        <div className="umain-page-header">
          <div>
            <div className="umain-page-label">Productora</div>
            <h1>Tus <em>campañas</em>.</h1>
            <p className="umain-page-description">
              Cada campaña agrupa las licencias de los talentos que participan y su inversión total.
            </p>
          </div>
          <div className="umain-page-header__actions">
            <Link to="/agency/requests/new" className="umain-button-primary umain-button-sm">
              + Nueva solicitud
            </Link>
          </div>
        </div>

        <div className="umain-stats-grid">
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Campañas activas</div>
            <div className="umain-stat-card__value">{activas}</div>
            <div className="umain-stat-card__detail">{campaigns.length} en total</div>
          </div>
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Inversión en licencias</div>
            <div className="umain-stat-card__value">{fmtUsd(inversion)}</div>
            <div className="umain-stat-card__detail">Todas las campañas</div>
          </div>
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Licencias vigentes</div>
            <div className="umain-stat-card__value">
              {campaigns.reduce((a, c) => a + Number(c.licencias_vigentes ?? 0), 0)}
            </div>
            <div className="umain-stat-card__detail">Con consentimiento activo</div>
          </div>
        </div>

        <div className="umain-card">
          <div className="umain-card__header">
            <h2 className="umain-card__title">Campañas</h2>
          </div>
          {campaigns.length === 0 ? (
            <div className="umain-empty" style={{ padding: "2rem" }}>
              Sin campañas registradas todavía.
            </div>
          ) : (
            <table className="umain-table">
              <thead>
                <tr>
                  <th>Campaña</th>
                  <th>Cliente</th>
                  <th>Talentos</th>
                  <th>Licencias</th>
                  <th>Inversión</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 450 }}>
                      {c.nombre}
                      {c.descripcion ? (
                        <div style={{ fontSize: "11px", color: "var(--color-umain-text-dim)", maxWidth: 280 }}>
                          {c.descripcion}
                        </div>
                      ) : null}
                    </td>
                    <td>{c.cliente}</td>
                    <td style={{ fontSize: "12px" }}>
                      {c.talentos ? String(c.talentos).split(",").join(", ") : "Sin talentos aún"}
                    </td>
                    <td>
                      {c.licencias_vigentes} vigentes · {c.licencias} total
                    </td>
                    <td style={{ fontWeight: 500 }}>{fmtUsd(c.inversion_usd)}</td>
                    <td>
                      <span className={`umain-status-badge umain-status-badge--${BADGE[c.estado] ?? "borrador"}`}>
                        {c.estado}
                      </span>
                    </td>
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
