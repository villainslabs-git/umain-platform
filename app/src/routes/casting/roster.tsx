import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "../../components/sidebar";
import { getRoster } from "../../lib/queries";

export const Route = createFileRoute("/casting/roster")({
  component: RosterPage,
  loader: async () => {
    try {
      return await getRoster();
    } catch {
      return [];
    }
  },
});

const fmtUsd = (n: number) =>
  `$${Number(n ?? 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

function initials(nombre: string) {
  return nombre
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function RosterPage() {
  const roster = (Route.useLoaderData() as any[]) ?? [];
  const activos = roster.filter((t) => t.estado === "activo").length;
  const regalias = roster.reduce((acc, t) => acc + Number(t.regalias_usd ?? 0), 0);
  const vigentes = roster.reduce((acc, t) => acc + Number(t.licencias_vigentes ?? 0), 0);

  return (
    <div className="umain-layout">
      <Sidebar />
      <main className="umain-main" style={{ maxWidth: "1200px" }}>
        <div className="umain-page-header">
          <div>
            <div className="umain-page-label">Casting Club</div>
            <h1>Tu <em>roster</em> completo.</h1>
            <p className="umain-page-description">
              Todos los talentos con gemelo digital, su estado, sus licencias y lo que generaron.
            </p>
          </div>
          <div className="umain-page-header__actions">
            <Link to="/casting/new-talent" className="umain-button-primary umain-button-sm">
              + Nuevo talento
            </Link>
          </div>
        </div>

        <div className="umain-stats-grid">
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Talentos activos</div>
            <div className="umain-stat-card__value">{activos}</div>
            <div className="umain-stat-card__detail">{roster.length} total en roster</div>
          </div>
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Licencias vigentes</div>
            <div className="umain-stat-card__value">{vigentes}</div>
            <div className="umain-stat-card__detail">En todo el roster</div>
          </div>
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Regalías acumuladas</div>
            <div className="umain-stat-card__value">{fmtUsd(regalias)}</div>
            <div className="umain-stat-card__detail">Licencias vigentes y vencidas</div>
          </div>
        </div>

        <div className="umain-card">
          <div className="umain-card__header">
            <h2 className="umain-card__title">Roster</h2>
            <Link to="/casting/dashboard" className="umain-view-all">Volver al panel</Link>
          </div>
          {roster.length === 0 ? (
            <div className="umain-empty" style={{ padding: "2rem" }}>
              Sin talentos cargados todavía.
            </div>
          ) : (
            <table className="umain-table">
              <thead>
                <tr>
                  <th>Talento</th>
                  <th>Tier</th>
                  <th>Estado</th>
                  <th>Contrato</th>
                  <th>Licencias</th>
                  <th>Regalías</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {roster.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: "var(--color-umain-brand)",
                            color: "#FFF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "'Archivo', sans-serif",
                            fontSize: "12px",
                            fontWeight: 500,
                            flexShrink: 0,
                          }}
                        >
                          {initials(String(t.nombre ?? ""))}
                        </div>
                        <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 450 }}>
                          {t.nombre}
                        </span>
                      </div>
                    </td>
                    <td>Tier {t.tier}</td>
                    <td>
                      <span
                        className={`umain-status-badge umain-status-badge--${
                          t.estado === "activo" ? "active" : t.estado === "suspendido" ? "pending" : "suprimido"
                        }`}
                      >
                        {t.estado}
                      </span>
                    </td>
                    <td>{t.contrato_ref ?? "Pendiente"}</td>
                    <td>
                      {t.licencias_vigentes} vigentes · {t.licencias_totales} total
                    </td>
                    <td style={{ fontWeight: 500 }}>{fmtUsd(t.regalias_usd)}</td>
                    <td>
                      <Link to="/identities/$id" params={{ id: t.id }} className="umain-button-ghost umain-button-sm">
                        Ver
                      </Link>
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
