import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "../../components/sidebar";
import { getLegalDocuments } from "../../lib/queries";

export const Route = createFileRoute("/legal/")({
  component: LegalPage,
  loader: async () => {
    try { return await getLegalDocuments(); }
    catch { return []; }
  },
});

function typeBadge(tipo: string) {
  const map: Record<string, { color: string; bg: string }> = {
    contrato: { color: '#7dd4fc', bg: 'rgba(125,212,252,0.12)' },
    certificado_supresion: { color: '#f4a8c8', bg: 'rgba(244,168,200,0.12)' },
    consentimiento: { color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
    otro: { color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' },
  };
  const m = map[tipo] ?? map.otro;
  return { ...m, label: tipo.replace(/_/g, ' ') };
}

function LegalPage() {
  const docs = (Route.useLoaderData() as any[]) ?? [];

  return (
    <div className="umain-layout">
      <Sidebar />
      <main className="umain-main">
        <div className="umain-page-header">
          <div>
            <h1>Biblioteca Legal</h1>
            <p className="formula-text mt-1">Contratos, certificados de supresion y documentos de consentimiento</p>
          </div>
          <div className="umain-page-header__actions">
            <button className="umain-button-outline">Subir documento</button>
          </div>
        </div>

        <div className="umain-card">
          <div className="umain-card__body" style={{padding:0}}>
            <table className="umain-table">
              <thead>
                <tr>
                  <th>Titulo</th>
                  <th>Tipo</th>
                  <th>Talento</th>
                  <th>Hash</th>
                  <th>Subido</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {docs.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="umain-empty">
                        <div className="umain-empty__icon">◈</div>
                        <div className="umain-empty__text">Biblioteca legal vacia</div>
                        <p className="formula-text mt-2" style={{fontSize:'0.8rem', color:'var(--color-umain-text-dim)'}}>
                          Los contratos y certificados apareceran aqui automaticamente
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  docs.map((d: any) => {
                    const badge = typeBadge(d.tipo);
                    return (
                      <tr key={d.id}>
                        <td><span style={{fontWeight:500}}>{d.titulo}</span></td>
                        <td>
                          <span style={{
                            padding: '0.2rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.6875rem',
                            fontFamily: "'Geist Mono', monospace",
                            background: badge.bg,
                            color: badge.color,
                          }}>
                            {badge.label}
                          </span>
                        </td>
                        <td><span className="formula-text">{d.identity_id?.substring(0,8) ?? '—'}</span></td>
                        <td><span className="formula-text" style={{fontSize:'0.65rem', color:'var(--color-umain-text-dim)'}}>{d.hash_sha256?.substring(0,16) ?? '—'}</span></td>
                        <td><span className="formula-text">{new Date(d.created_at).toLocaleDateString()}</span></td>
                        <td><button className="umain-button-ghost" style={{fontSize:'0.75rem'}}>Descargar</button></td>
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
