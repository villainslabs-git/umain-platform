import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "../../../components/sidebar";
import { getLicenseRequests } from "../../../lib/queries";

export const Route = createFileRoute("/agency/requests/")({
  component: AgencyRequestsPage,
  loader: async () => {
    try {
      return await getLicenseRequests();
    } catch {
      return [];
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

const ESTADOS: Record<string, { label: string; badge: string }> = {
  pendiente_aprobacion: { label: "Esperando al talento", badge: "pending" },
  borrador: { label: "Borrador", badge: "borrador" },
  vigente: { label: "Aprobada y vigente", badge: "active" },
  vencida: { label: "Vencida", badge: "borrador" },
  revocada: { label: "Revocada", badge: "suprimido" },
};

function AgencyRequestsPage() {
  const requests = (Route.useLoaderData() as Array<Record<string, any>>) ?? [];
  const pendientes = requests.filter((r) => r.estado === "pendiente_aprobacion").length;

  return (
    <div className="umain-layout">
      <Sidebar />
      <main className="umain-main" style={{ maxWidth: "1200px" }}>
        <div className="umain-page-header">
          <div>
            <div className="umain-page-label">Productora</div>
            <h1>Tus <em>solicitudes</em> de licencia.</h1>
            <p className="umain-page-description">
              Cada solicitud pasa por la compuerta de consentimiento: nada se genera hasta que el talento aprueba.
            </p>
          </div>
          <div className="umain-page-header__actions">
            <Link to="/agency/requests/new" className="umain-button-primary umain-button-sm">
              + Nueva solicitud
            </Link>
            <Link to="/agency/catalog" className="umain-button-ghost umain-button-sm">
              Ver catálogo
            </Link>
          </div>
        </div>

        <div className="umain-stats-grid">
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Solicitudes totales</div>
            <div className="umain-stat-card__value">{requests.length}</div>
            <div className="umain-stat-card__detail">Historial completo</div>
          </div>
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Esperando aprobación</div>
            <div className="umain-stat-card__value">{pendientes}</div>
            <div className="umain-stat-card__detail">
              <span style={{ color: "var(--color-status-pending)" }}>El talento decide</span>
            </div>
          </div>
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Aprobadas y vigentes</div>
            <div className="umain-stat-card__value">
              {requests.filter((r) => r.estado === "vigente").length}
            </div>
            <div className="umain-stat-card__detail">Listas para generar</div>
          </div>
        </div>

        <div className="umain-card">
          <div className="umain-card__header">
            <h2 className="umain-card__title">Solicitudes</h2>
          </div>
          {requests.length === 0 ? (
            <div className="umain-empty" style={{ padding: "2rem" }}>
              Sin solicitudes todavía. Armá la primera desde el catálogo.
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
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => {
                  const alcance = parseJson(r.alcance);
                  const economia = parseJson(r.economia);
                  const estado = ESTADOS[r.estado] ?? { label: r.estado, badge: "borrador" };
                  return (
                    <tr key={r.id}>
                      <td style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 450 }}>
                        {r.talento_nombre}
                        <span style={{ color: "var(--color-umain-text-dim)", fontSize: "11px" }}>
                          {" "}· Tier {r.talento_tier}
                        </span>
                      </td>
                      <td>
                        {r.campania_nombre}
                        <div style={{ fontSize: "11px", color: "var(--color-umain-text-dim)" }}>
                          {r.campania_cliente}
                        </div>
                      </td>
                      <td style={{ fontSize: "12px" }}>
                        {alcance.categoria ?? "Sin categoría"}
                        <div style={{ fontSize: "11px", color: "var(--color-umain-text-dim)" }}>
                          {alcance.territorio ?? ""}{alcance.plazo_meses ? ` · ${alcance.plazo_meses} meses` : ""}
                        </div>
                      </td>
                      <td style={{ fontWeight: 500 }}>
                        {economia.monto_usd ? fmtUsd(economia.monto_usd) : "A cotizar"}
                      </td>
                      <td>
                        <span className={`umain-status-badge umain-status-badge--${estado.badge}`}>
                          {estado.label}
                        </span>
                      </td>
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
