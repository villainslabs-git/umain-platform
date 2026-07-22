import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "../../components/sidebar";

export const Route = createFileRoute("/contracts/")({
  component: ContractsPage,
});

function ContractsPage() {
  const frameworkContracts = [
    {
      name: 'UMAIN × Casting Club × Manu Jantus · Acuerdo Marco de Talento',
      meta: 'Acuerdo tripartito · Ley argentina · 3 años · Firmado el 14 may 2025',
      status: 'Vigente',
      expiry: 'Vence may 2028',
      statusColor: 'var(--color-status-active)',
    },
    {
      name: 'Anexo I · Matriz de consentimiento (v2)',
      meta: 'Actualizado el 18 feb 2026 · 47 categorías evaluadas · Firma digital',
      status: 'Vigente',
      expiry: 'v1 archivada',
      statusColor: 'var(--color-status-active)',
    },
    {
      name: 'Anexo II · Tabla de ventanas de exclusividad',
      meta: 'Ventanas competitivas por categoría · Actualizado el 15 ene 2026',
      status: 'Vigente',
      expiry: 'Plantilla estándar',
      statusColor: 'var(--color-status-active)',
    },
  ];

  const projectConsents = [
    {
      name: 'L\'Oréal Paris · Consentimiento campaña Revitalift',
      meta: 'IAB-186 Cuidado capilar · LATAM · Firmado el 28 mar 2026',
      ref: '#UM-2026-0412',
      statusColor: 'var(--color-status-active)',
    },
    {
      name: 'Pepsi · Consentimiento Summer refresh',
      meta: 'IAB-1104 Bebidas · AR + BR · Firmado el 30 ene 2026',
      ref: '#UM-2026-0198',
      statusColor: 'var(--color-status-active)',
    },
    {
      name: 'Cartier · Consentimiento Love collection',
      meta: 'IAB-197 Lujo · Global · Firmado el 5 ene 2026',
      ref: '#UM-2026-0021',
      statusColor: 'var(--color-status-active)',
    },
  ];

  const legalDocs = [
    {
      name: 'Consentimiento de datos biométricos (Ley 25.326)',
      meta: 'Cumplimiento Ley de Protección de Datos Personales · Firmado el 14 may 2025',
      status: 'Vigente',
      expiry: 'Registrado ante la AAIP',
      statusColor: 'var(--color-status-active)',
    },
    {
      name: 'NDA · Sesión de pre-captura',
      meta: 'Firmado el 2 may 2025 · Vigente hasta la terminación del proyecto',
      status: 'Vigente',
      expiry: 'Sin vencimiento',
      statusColor: 'var(--color-status-active)',
    },
  ];

  return (
    <div className="umain-layout">
      <Sidebar />
      <main className="umain-main" style={{ maxWidth: '1200px' }}>
        {/* Header */}
        <div className="umain-page-header">
          <div>
            <div className="umain-page-label">Contratos y documentos</div>
            <h1>Tu biblioteca <em>legal</em>.</h1>
            <p className="umain-page-description">
              Todos los documentos firmados, enmiendas y consentimientos por proyecto. 
              Cada documento tiene timestamp y es a prueba de manipulación.
            </p>
          </div>
          <div className="umain-page-header__actions">
            <button className="umain-button-ghost umain-button-sm">Subir documento</button>
            <button className="umain-button-ghost umain-button-sm">Compartir con abogado</button>
          </div>
        </div>

        {/* Framework Contracts */}
        <div style={{ 
          fontSize: '11px', 
          textTransform: 'uppercase', 
          letterSpacing: '0.15em', 
          color: 'var(--color-umain-brand)', 
          margin: '0 0 1rem' 
        }}>
          Acuerdos marco
        </div>

        {frameworkContracts.map((contract, index) => (
          <div key={index} className="umain-contract-item">
            <div className="umain-contract-icon">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <path d="M3 1 L13 1 L13 15 L3 15 Z" stroke="currentColor" strokeWidth="1" fill="none" />
                <line x1="5" y1="5" x2="11" y2="5" stroke="currentColor" strokeWidth="1" />
                <line x1="5" y1="8" x2="11" y2="8" stroke="currentColor" strokeWidth="1" />
                <line x1="5" y1="11" x2="9" y2="11" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>
            <div>
              <div className="umain-contract-name">{contract.name}</div>
              <div className="umain-contract-meta">{contract.meta}</div>
            </div>
            <div className="umain-contract-signed">
              <div style={{ color: contract.statusColor }}>✓ {contract.status}</div>
              <div style={{ marginTop: '0.25rem' }}>{contract.expiry}</div>
            </div>
            <div style={{ display: 'flex', gap: '0.375rem' }}>
              <button className="umain-button-ghost umain-button-sm">Ver</button>
              <button className="umain-button-ghost umain-button-sm">PDF</button>
            </div>
          </div>
        ))}

        {/* Project Consents */}
        <div style={{ 
          fontSize: '11px', 
          textTransform: 'uppercase', 
          letterSpacing: '0.15em', 
          color: 'var(--color-umain-brand)', 
          margin: '2rem 0 1rem' 
        }}>
          Consentimientos por proyecto
        </div>

        {projectConsents.map((consent, index) => (
          <div key={index} className="umain-contract-item">
            <div className="umain-contract-icon">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1" />
                <path d="M2 15 Q 2 9 8 9 Q 14 9 14 15" stroke="currentColor" strokeWidth="1" fill="none" />
              </svg>
            </div>
            <div>
              <div className="umain-contract-name">{consent.name}</div>
              <div className="umain-contract-meta">{consent.meta}</div>
            </div>
            <div className="umain-contract-signed">
              <div style={{ color: consent.statusColor }}>✓ Firmado</div>
              <div style={{ marginTop: '0.25rem' }}>{consent.ref}</div>
            </div>
            <div style={{ display: 'flex', gap: '0.375rem' }}>
              <button className="umain-button-ghost umain-button-sm">Ver</button>
              <button className="umain-button-ghost umain-button-sm">PDF</button>
            </div>
          </div>
        ))}

        {/* Legal & Compliance */}
        <div style={{ 
          fontSize: '11px', 
          textTransform: 'uppercase', 
          letterSpacing: '0.15em', 
          color: 'var(--color-umain-brand)', 
          margin: '2rem 0 1rem' 
        }}>
          Legal y compliance
        </div>

        {legalDocs.map((doc, index) => (
          <div key={index} className="umain-contract-item">
            <div className="umain-contract-icon">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="7" width="12" height="8" stroke="currentColor" strokeWidth="1" />
                <path d="M5 7 L5 4 Q 5 1 8 1 Q 11 1 11 4 L11 7" stroke="currentColor" strokeWidth="1" fill="none" />
              </svg>
            </div>
            <div>
              <div className="umain-contract-name">{doc.name}</div>
              <div className="umain-contract-meta">{doc.meta}</div>
            </div>
            <div className="umain-contract-signed">
              <div style={{ color: doc.statusColor }}>✓ {doc.status}</div>
              <div style={{ marginTop: '0.25rem' }}>{doc.expiry}</div>
            </div>
            <div style={{ display: 'flex', gap: '0.375rem' }}>
              <button className="umain-button-ghost umain-button-sm">Ver</button>
              <button className="umain-button-ghost umain-button-sm">PDF</button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
