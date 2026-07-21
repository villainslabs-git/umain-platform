import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "../../components/sidebar";
import { getCampaigns } from "../../lib/queries";

export const Route = createFileRoute("/campaigns/")({
  component: CampaignsPage,
  loader: async () => {
    try { return await getCampaigns(); }
    catch { return []; }
  },
});

function statusBadge(estado: string) {
  const map: Record<string, string> = {
    activa: 'umain-status-badge--active',
    borrador: 'umain-status-badge--borrador',
    pausada: 'umain-status-badge--pending',
    completada: 'umain-status-badge--vigente',
    cancelada: 'umain-status-badge--error',
  };
  return `umain-status-badge ${map[estado] ?? 'umain-status-badge--borrador'}`;
}

function CampaignsPage() {
  const campaigns = (Route.useLoaderData() as any[]) ?? [];

  return (
    <div className="umain-layout">
      <Sidebar />
      <main className="umain-main">
        <div className="umain-page-header">
          <div>
            <h1>Campanas</h1>
            <p className="formula-text mt-1">Gestion de campanas publicitarias</p>
          </div>
          <div className="umain-page-header__actions">
            <button className="umain-button-primary">+ Nueva campana</button>
          </div>
        </div>

        <div className="umain-card">
          <div className="umain-card__body" style={{padding:0}}>
            <table className="umain-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Cliente</th>
                  <th>Estado</th>
                  <th>Creada</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="umain-empty">
                        <div className="umain-empty__icon">◈</div>
                        <div className="umain-empty__text">No hay campanas</div>
                        <p className="formula-text mt-2" style={{fontSize:'0.8rem', color:'var(--color-umain-text-dim)'}}>
                          Crea la primera campana para empezar
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  campaigns.map((c: any) => (
                    <tr key={c.id}>
                      <td><span style={{fontWeight:500}}>{c.nombre}</span></td>
                      <td><span className="formula-text">{c.cliente}</span></td>
                      <td><span className={statusBadge(c.estado)}>{c.estado}</span></td>
                      <td><span className="formula-text">{new Date(c.created_at).toLocaleDateString()}</span></td>
                      <td><button className="umain-button-ghost" style={{fontSize:'0.75rem'}}>Ver</button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
