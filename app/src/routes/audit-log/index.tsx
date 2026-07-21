import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "../../components/sidebar";
import { getAuditLog } from "../../lib/queries";

export const Route = createFileRoute("/audit-log/")({
  component: AuditLogPage,
  loader: async () => {
    try { return await getAuditLog(); }
    catch { return []; }
  },
});

const EVENT_COLORS: Record<string, string> = {
  emision: '#7dd4fc',
  validacion: '#22c55e',
  aprobacion: '#22c55e',
  output: '#f4a8c8',
  revocacion: '#ef4444',
  supresion: '#f87171',
  error: '#ef4444',
};

function AuditLogPage() {
  const entries = (Route.useLoaderData() as any[]) ?? [];

  return (
    <div className="umain-layout">
      <Sidebar />
      <main className="umain-main">
        <div className="umain-page-header">
          <div>
            <h1>Audit Log</h1>
            <p className="formula-text mt-1">Registro inmutable encadenado criptograficamente</p>
          </div>
          <div className="umain-page-header__actions">
            <span className="umain-status-badge umain-status-badge--active" style={{fontSize:'0.7rem'}}>
              SHA-256 chain
            </span>
            <span className="formula-text formula-text--accent" style={{fontSize:'0.7rem'}}>
              ed25519 signed
            </span>
          </div>
        </div>

        <div className="wireframe-box" style={{padding:'0.75rem 1rem', marginBottom:'1.5rem'}}>
          <div style={{display:'flex', gap:'1rem', alignItems:'center', flexWrap:'wrap'}}>
            <span className="formula-text" style={{fontSize:'0.7rem', color:'var(--color-umain-text-dim)'}}>Append-only · Sin UPDATE/DELETE</span>
            <span className="formula-text" style={{fontSize:'0.7rem', color:'var(--color-umain-text-dim)'}}>Hash chain verificada</span>
            <span className="formula-text" style={{fontSize:'0.7rem', color:'var(--color-umain-text-dim)'}}>Firma por lote con KMS</span>
            <div style={{marginLeft:'auto'}}>
              <button className="umain-button-outline" style={{fontSize:'0.75rem'}}>Verificar cadena</button>
            </div>
          </div>
        </div>

        <div className="umain-card">
          <div className="umain-card__body" style={{padding:0}}>
            <table className="umain-table">
              <thead>
                <tr>
                  <th style={{width:'60px'}}>Seq</th>
                  <th style={{width:'100px'}}>Evento</th>
                  <th>Payload</th>
                  <th style={{width:'90px'}}>Identity</th>
                  <th style={{width:'130px'}}>Timestamp</th>
                  <th style={{width:'110px'}}>Hash</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="umain-empty">
                        <div className="umain-empty__icon">◈</div>
                        <div className="umain-empty__text">AuditLog vacio</div>
                        <p className="formula-text mt-2" style={{fontSize:'0.8rem', color:'var(--color-umain-text-dim)'}}>
                          El registro se pobla automaticamente con cada operacion del Rights Engine
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  entries.map((e: any) => (
                    <tr key={e.seq}>
                      <td><span className="formula-text" style={{fontSize:'0.7rem', color:'var(--color-umain-text-dim)'}}>{e.seq}</span></td>
                      <td>
                        <span className="formula-text" style={{
                          fontSize:'0.75rem',
                          color: EVENT_COLORS[e.evento] ?? 'var(--color-umain-text)',
                        }}>
                          {e.evento}
                        </span>
                      </td>
                      <td>
                        <span className="formula-text" style={{fontSize:'0.7rem', color:'var(--color-umain-text-secondary)', maxWidth:'300px', display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                          {e.payload}
                        </span>
                      </td>
                      <td><span className="formula-text" style={{fontSize:'0.65rem'}}>{e.identity_id?.substring(0,8) ?? '—'}</span></td>
                      <td><span className="formula-text" style={{fontSize:'0.7rem'}}>{new Date(e.created_at).toLocaleString()}</span></td>
                      <td>
                        <span className="formula-text" style={{fontSize:'0.6rem', color:'var(--color-umain-text-dim)', fontFamily:'monospace'}}>
                          {e.hash?.substring(0,12)}...
                        </span>
                      </td>
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
