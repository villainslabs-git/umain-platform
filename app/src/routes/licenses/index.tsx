import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "../../components/sidebar";
import { getLicenses } from "../../lib/queries";

export const Route = createFileRoute("/licenses/")({
  component: LicensesPage,
  loader: async () => {
    try { return await getLicenses(); }
    catch { return []; }
  },
});

function statusBadge(estado: string) {
  const map: Record<string, string> = {
    vigente: 'umain-status-badge--vigente',
    borrador: 'umain-status-badge--borrador',
    pendiente_aprobacion: 'umain-status-badge--pending',
    vencida: 'umain-status-badge--borrador',
    revocada: 'umain-status-badge--revocada',
  };
  return `umain-status-badge ${map[estado] ?? 'umain-status-badge--borrador'}`;
}

function LicensesPage() {
  const licenses = (Route.useLoaderData() as any[]) ?? [];

  return (
    <div className="umain-layout">
      <Sidebar />
      <main className="umain-main">
        <div className="umain-page-header">
          <div>
            <h1>Licencias</h1>
            <p className="formula-text mt-1">Gestion de tokens de licencia y consentimiento</p>
          </div>
          <div className="umain-page-header__actions">
            <button className="umain-button-primary">+ Nueva licencia</button>
          </div>
        </div>

        <div className="umain-card">
          <div className="umain-card__body" style={{padding:0}}>
            <table className="umain-table">
              <thead>
                <tr>
                  <th>Talento</th>
                  <th>Campana</th>
                  <th>Estado</th>
                  <th>Alcance</th>
                  <th>Creada</th>
                  <th>Token</th>
                </tr>
              </thead>
              <tbody>
                {licenses.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="umain-empty">
                        <div className="umain-empty__icon">◈</div>
                        <div className="umain-empty__text">No hay licencias</div>
                        <p className="formula-text mt-2" style={{fontSize:'0.8rem', color:'var(--color-umain-text-dim)'}}>
                          Las licencias se generan al crear una campana con un talento asignado
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  licenses.map((l: any) => {
                    const alcance = typeof l.alcance === 'string' ? JSON.parse(l.alcance) : l.alcance;
                    return (
                      <tr key={l.id}>
                        <td><span className="formula-text formula-text--accent">{l.talento_nombre ?? l.identity_id?.substring(0,8)}</span></td>
                        <td><span className="formula-text">{l.campania_nombre ?? l.campaign_id?.substring(0,8)}</span></td>
                        <td><span className={statusBadge(l.estado)}>{l.estado}</span></td>
                        <td><span className="formula-text" style={{fontSize:'0.75rem'}}>{alcance?.medio ?? '—'}</span></td>
                        <td><span className="formula-text">{new Date(l.created_at).toLocaleDateString()}</span></td>
                        <td><span className="formula-text" style={{fontSize:'0.65rem', color: l.token_jwt ? 'var(--color-umain-accent)' : 'var(--color-umain-text-dim)'}}>
                          {l.token_jwt ? 'Emitido' : 'Pendiente'}
                        </span></td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
