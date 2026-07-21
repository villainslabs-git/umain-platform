import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/approval/$token")({
  component: ApprovalPage,
  loader: ({ params }) => {
    return { token: params.token };
  },
});

function ApprovalPage() {
  const { token } = Route.useLoaderData() as { token: string };
  const talentoNombre = "Talento Ejemplo"; // In real app, fetch from approval token

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-umain-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div className="umain-approval-preview">
        {/* Header */}
        <div className="text-center mb-6">
          <span style={{
            fontFamily: "'Geist', sans-serif",
            fontWeight: 700,
            fontSize: '1.5rem',
            background: 'linear-gradient(135deg, #7dd4fc, #f4a8c8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            UMAIN
          </span>
          <p className="formula-text mt-2" style={{fontSize:'0.8rem'}}>
            Portal de aprobacion del talento
          </p>
        </div>

        {/* Main card */}
        <div className="umain-card">
          <div className="umain-card__header">
            <span className="formula-text formula-text--accent">APROBACION DE LICENCIA</span>
            <span className="umain-status-badge umain-status-badge--pending">Pendiente</span>
          </div>
          <div className="umain-card__body" style={{padding:'1.5rem'}}>
            <div className="text-center mb-6">
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-umain-accent-dim), var(--color-umain-accent-secondary-dim))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
              }}>
                <span style={{fontSize:'1.5rem', fontWeight:700, background: 'linear-gradient(135deg, #7dd4fc, #f4a8c8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                  {talentoNombre.charAt(0)}
                </span>
              </div>
              <h2 style={{fontSize:'1.25rem', fontWeight:700, marginBottom:'0.25rem'}}>
                Hola, {talentoNombre}
              </h2>
              <p className="formula-text" style={{fontSize:'0.8rem', color:'var(--color-umain-text-secondary)'}}>
                Se solicita tu aprobacion para la siguiente licencia
              </p>
            </div>

            {/* Conditions preview */}
            <div className="wireframe-box" style={{marginBottom:'1.5rem'}}>
              <h3 className="formula-text formula-text--accent" style={{fontSize:'0.75rem', marginBottom:'1rem', textTransform:'uppercase'}}>
                CONDICIONES DE LA LICENCIA
              </h3>
              <div style={{display:'flex', flexDirection:'column', gap:'0.75rem'}}>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <span className="formula-text" style={{fontSize:'0.8rem', color:'var(--color-umain-text-dim)'}}>Cliente</span>
                  <span className="formula-text" style={{fontSize:'0.8rem', fontWeight:500}}>Marca Ejemplo S.A.</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <span className="formula-text" style={{fontSize:'0.8rem', color:'var(--color-umain-text-dim)'}}>Uso</span>
                  <span className="formula-text" style={{fontSize:'0.8rem', fontWeight:500}}>Publicidad digital</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <span className="formula-text" style={{fontSize:'0.8rem', color:'var(--color-umain-text-dim)'}}>Medio</span>
                  <span className="formula-text" style={{fontSize:'0.8rem', fontWeight:500}}>Redes sociales</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <span className="formula-text" style={{fontSize:'0.8rem', color:'var(--color-umain-text-dim)'}}>Territorio</span>
                  <span className="formula-text" style={{fontSize:'0.8rem', fontWeight:500}}>Argentina</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <span className="formula-text" style={{fontSize:'0.8rem', color:'var(--color-umain-text-dim)'}}>Plazo</span>
                  <span className="formula-text" style={{fontSize:'0.8rem', fontWeight:500}}>01/08/2026 - 31/01/2027</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <span className="formula-text" style={{fontSize:'0.8rem', color:'var(--color-umain-text-dim)'}}>Fee</span>
                  <span className="formula-text formula-text--accent" style={{fontSize:'0.8rem', fontWeight:500}}>$ 2,500 USD</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <span className="formula-text" style={{fontSize:'0.8rem', color:'var(--color-umain-text-dim)'}}>Split</span>
                  <span className="formula-text" style={{fontSize:'0.8rem', fontWeight:500}}>70% talento / 20% UMAIN / 10% agencia</span>
                </div>
              </div>
            </div>

            {/* Material preview placeholder */}
            <div className="umain-card" style={{borderStyle:'dashed', marginBottom:'1.5rem'}}>
              <div className="umain-card__body" style={{padding:'2rem', textAlign:'center'}}>
                <div className="formula-text" style={{fontSize:'0.75rem', color:'var(--color-umain-text-dim)'}}>
                  Preview del material generado aparecera aqui
                </div>
              </div>
            </div>

            <p className="formula-text" style={{fontSize:'0.7rem', color:'var(--color-umain-text-dim)', textAlign:'center', marginBottom:'1.5rem'}}>
              Al aprobar, confirmas que aceptas las condiciones y autorizas el uso de tu imagen digital
            </p>

            {/* Action buttons */}
            <div style={{display:'flex', gap:'0.75rem', justifyContent:'center'}}>
              <button className="umain-button-secondary" style={{padding:'0.75rem 2rem'}}>
                Aprobar licencia
              </button>
              <button className="umain-button-outline" style={{padding:'0.75rem 2rem'}}>
                Solicitar cambios
              </button>
              <button className="umain-button-ghost" style={{padding:'0.75rem 2rem', color:'#ef4444'}}>
                Rechazar
              </button>
            </div>
          </div>
          <div className="umain-card__footer">
            <div className="formula-text" style={{fontSize:'0.65rem', display:'flex', justifyContent:'space-between'}}>
              <span>Token: {token.substring(0,12)}...</span>
              <span>Expira: 72h desde emision</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
