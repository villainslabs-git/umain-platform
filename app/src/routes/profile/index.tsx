import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "../../components/sidebar";

export const Route = createFileRoute("/profile/")({
  component: ProfilePage,
});

function ProfilePage() {
  // Mock data for demo talent
  const talent = {
    nombreCompleto: "Manuela Jantus",
    nombreProfesional: "Manu Jantus",
    fechaNacimiento: "22 de febrero de 1986",
    nacionalidad: "Argentina",
    bandera: "🇦🇷",
    domicilio: "Buenos Aires, Argentina",
    idiomas: "Español (nativo) · Inglés (fluido) · Portugués (intermedio)",
    email: "manu@manujantus.com",
    telefono: "+54 11 5555-1234 (cifrado)",
    contactoEmergencia: "Representante · Casting Club",
    agencia: "Casting Club (Buenos Aires)",
    representante: "Federico López",
    tipoContrato: "Tripartito: UMAIN × Casting Club × Talento",
    exclusividad: "Solo derechos digitales de IA · El trabajo tradicional no se toca",
    modeloTipo: "Flux LoRA + MetaHuman",
    dataset: "48 fotos · 2.4 GB",
    ultimoEntrenamiento: "Mar 2026",
    version: "v2.1",
    almacenamiento: "AWS S3 · cifrado",
    tier: "A",
    splitRegalias: "65 / 35",
    minimoGarantizado: "$18,000",
    reportes: "Trimestrales",
  };

  return (
    <div className="umain-layout">
      <Sidebar />
      <main className="umain-main" style={{ maxWidth: '1200px' }}>
        {/* Header */}
        <div className="umain-page-header">
          <div>
            <div className="umain-page-label">Perfil</div>
            <h1>Tu <em>identidad</em> en UMAIN.</h1>
            <p className="umain-page-description">
              Información personal, representación, y metadata de tu modelo digital. 
              Los cambios requieren re-firma del Acuerdo de Talento.
            </p>
          </div>
          <div className="umain-page-actions">
            <button className="umain-button-ghost umain-button-sm">Cancelar</button>
            <button className="umain-button-primary umain-button-sm">Guardar cambios</button>
          </div>
        </div>

        <div className="umain-content-grid">
          <div>
            {/* Información Personal */}
            <div className="umain-card">
              <div className="umain-card__header">
                <h2 className="umain-card__title">Información personal</h2>
              </div>
              <div className="umain-form-row">
                <div className="umain-form-label">Nombre completo</div>
                <div className="umain-form-value">{talent.nombreCompleto}</div>
              </div>
              <div className="umain-form-row">
                <div className="umain-form-label">Nombre profesional</div>
                <div className="umain-form-value">{talent.nombreProfesional}</div>
              </div>
              <div className="umain-form-row">
                <div className="umain-form-label">Fecha de nacimiento</div>
                <div className="umain-form-value">{talent.fechaNacimiento}</div>
              </div>
              <div className="umain-form-row">
                <div className="umain-form-label">Nacionalidad</div>
                <div className="umain-form-value">{talent.bandera} {talent.nacionalidad}</div>
              </div>
              <div className="umain-form-row">
                <div className="umain-form-label">Domicilio</div>
                <div className="umain-form-value">{talent.domicilio}</div>
              </div>
              <div className="umain-form-row">
                <div className="umain-form-label">Idiomas</div>
                <div className="umain-form-value">{talent.idiomas}</div>
              </div>
            </div>

            {/* Contacto */}
            <div className="umain-card">
              <div className="umain-card__header">
                <h2 className="umain-card__title">Contacto</h2>
              </div>
              <div className="umain-form-row">
                <div className="umain-form-label">Email</div>
                <div className="umain-form-value">{talent.email}</div>
              </div>
              <div className="umain-form-row">
                <div className="umain-form-label">Teléfono</div>
                <div className="umain-form-value">{talent.telefono}</div>
              </div>
              <div className="umain-form-row">
                <div className="umain-form-label">Contacto de emergencia</div>
                <div className="umain-form-value">{talent.contactoEmergencia}</div>
              </div>
            </div>

            {/* Representación */}
            <div className="umain-card">
              <div className="umain-card__header">
                <h2 className="umain-card__title">Representación</h2>
              </div>
              <div className="umain-form-row">
                <div className="umain-form-label">Agencia</div>
                <div className="umain-form-value">{talent.agencia}</div>
              </div>
              <div className="umain-form-row">
                <div className="umain-form-label">Representante principal</div>
                <div className="umain-form-value">{talent.representante}</div>
              </div>
              <div className="umain-form-row">
                <div className="umain-form-label">Tipo de contrato</div>
                <div className="umain-form-value">{talent.tipoContrato}</div>
              </div>
              <div className="umain-form-row">
                <div className="umain-form-label">Exclusividad</div>
                <div className="umain-form-value">{talent.exclusividad}</div>
              </div>
            </div>
          </div>

          <div>
            {/* Modelo Digital */}
            <div className="umain-card">
              <div className="umain-card__header">
                <h2 className="umain-card__title">Modelo digital</h2>
              </div>
              <div style={{ padding: '1.25rem' }}>
                {/* Avatar Preview */}
                <div style={{ 
                  aspectRatio: '3/4', 
                  background: 'var(--color-umain-bg-alt)', 
                  borderRadius: '2px', 
                  marginBottom: '1rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: 'var(--color-umain-text-dim)',
                  border: '0.5px solid var(--color-umain-border)'
                }}>
                  <svg width="80" height="96" viewBox="0 0 60 72" fill="none">
                    <ellipse cx="30" cy="25" rx="15" ry="18" stroke="currentColor" strokeWidth="0.5" />
                    <path d="M5 72 Q 5 42 30 42 Q 55 42 55 72" stroke="currentColor" strokeWidth="0.5" fill="none" />
                  </svg>
                </div>

                {/* Model Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '0.5px solid var(--color-umain-border-soft)' }}>
                    <span style={{ color: 'var(--color-umain-text-secondary)' }}>Tipo de modelo</span>
                    <span>{talent.modeloTipo}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '0.5px solid var(--color-umain-border-soft)' }}>
                    <span style={{ color: 'var(--color-umain-text-secondary)' }}>Dataset de entrenamiento</span>
                    <span>{talent.dataset}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '0.5px solid var(--color-umain-border-soft)' }}>
                    <span style={{ color: 'var(--color-umain-text-secondary)' }}>Último entrenamiento</span>
                    <span>{talent.ultimoEntrenamiento}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '0.5px solid var(--color-umain-border-soft)' }}>
                    <span style={{ color: 'var(--color-umain-text-secondary)' }}>Versión</span>
                    <span>{talent.version}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                    <span style={{ color: 'var(--color-umain-text-secondary)' }}>Almacenamiento</span>
                    <span>{talent.almacenamiento}</span>
                  </div>
                </div>

                {/* Actions */}
                <button className="umain-button-ghost umain-button-sm" style={{ width: '100%', marginTop: '1rem' }}>
                  Solicitar reentrenamiento
                </button>
                <button className="umain-button-danger umain-button-sm" style={{ width: '100%', marginTop: '0.5rem' }}>
                  Solicitar supresión (Ley 25.326)
                </button>
              </div>
            </div>

            {/* Tier y Compensación */}
            <div className="umain-card">
              <div className="umain-card__header">
                <h2 className="umain-card__title">Tier y compensación</h2>
              </div>
              <div style={{ padding: '1.25rem', fontSize: '13px' }}>
                {/* Tier Display */}
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <div style={{ 
                    fontFamily: "'Archivo', 'Helvetica Neue', Arial, sans-serif", 
                    fontSize: '3rem', 
                    fontWeight: 300, 
                    color: 'var(--color-umain-brand)', 
                    lineHeight: 1 
                  }}>
                    {talent.tier}
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.15em', 
                    color: 'var(--color-umain-text-secondary)', 
                    marginTop: '0.25rem' 
                  }}>
                    Tier
                  </div>
                </div>

                {/* Compensation Details */}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '0.5px solid var(--color-umain-border-soft)' }}>
                  <span style={{ color: 'var(--color-umain-text-secondary)' }}>Split de regalías</span>
                  <span>{talent.splitRegalias}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '0.5px solid var(--color-umain-border-soft)' }}>
                  <span style={{ color: 'var(--color-umain-text-secondary)' }}>Mínimo garantizado 2026</span>
                  <span>{talent.minimoGarantizado}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                  <span style={{ color: 'var(--color-umain-text-secondary)' }}>Reportes</span>
                  <span>{talent.reportes}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
