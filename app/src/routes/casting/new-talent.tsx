import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "../../components/sidebar";
import { useState } from "react";

export const Route = createFileRoute("/casting/new-talent")({
  component: NewTalentPage,
});

function NewTalentPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    nombreProfesional: '',
    fechaNacimiento: '',
    nacionalidad: 'Argentina',
    email: '',
    telefono: '',
    tier: 'B',
    split: '65',
    notas: '',
  });

  return (
    <div className="umain-layout">
      <Sidebar />
      <main className="umain-main" style={{ maxWidth: '900px' }}>
        {/* Header */}
        <div className="umain-page-header">
          <div>
            <Link to="/casting/dashboard" style={{ 
              color: 'var(--color-umain-brand)', 
              textDecoration: 'none', 
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              ← Panel de representante
            </Link>
            <div className="umain-page-label" style={{ marginTop: '0.5rem' }}>Nuevo talento</div>
            <h1>Crear un <em>nuevo avatar</em></h1>
            <p className="umain-page-description">
              Agrega un nuevo talento a tu roster. Después del alta, podrás subir las fotos para entrenar el Soul ID.
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          marginBottom: '2rem',
          padding: '1rem',
          background: '#FAFAF8',
          border: '0.5px solid var(--color-umain-border)',
          borderRadius: '2px',
        }}>
          {[
            { n: 1, label: 'Datos personales' },
            { n: 2, label: 'Representación' },
            { n: 3, label: 'Configuración' },
            { n: 4, label: 'Fotos (Soul ID)' },
          ].map((s) => (
            <div key={s.n} style={{ 
              flex: 1, 
              textAlign: 'center',
              padding: '0.5rem',
              borderRadius: '2px',
              background: step >= s.n ? 'var(--color-umain-brand)' : 'var(--color-umain-bg-alt)',
              color: step >= s.n ? '#FFF' : 'var(--color-umain-text-dim)',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: step === s.n ? 600 : 400,
            }}>
              {s.n}. {s.label}
            </div>
          ))}
        </div>

        {/* Step 1: Personal Data */}
        {step === 1 && (
          <div className="umain-card">
            <div className="umain-card__header">
              <h2 className="umain-card__title">Datos personales</h2>
            </div>
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-umain-text-dim)', marginBottom: '0.5rem' }}>
                    Nombre completo *
                  </label>
                  <input 
                    className="umain-input" 
                    placeholder="Ej: María García López"
                    value={formData.nombreCompleto}
                    onChange={(e) => setFormData({...formData, nombreCompleto: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-umain-text-dim)', marginBottom: '0.5rem' }}>
                    Nombre profesional *
                  </label>
                  <input 
                    className="umain-input" 
                    placeholder="Ej: María García"
                    value={formData.nombreProfesional}
                    onChange={(e) => setFormData({...formData, nombreProfesional: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-umain-text-dim)', marginBottom: '0.5rem' }}>
                    Fecha de nacimiento
                  </label>
                  <input 
                    className="umain-input" 
                    type="date"
                    value={formData.fechaNacimiento}
                    onChange={(e) => setFormData({...formData, fechaNacimiento: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-umain-text-dim)', marginBottom: '0.5rem' }}>
                    Nacionalidad
                  </label>
                  <select 
                    className="umain-input"
                    value={formData.nacionalidad}
                    onChange={(e) => setFormData({...formData, nacionalidad: e.target.value})}
                  >
                    <option>Argentina</option>
                    <option>Chile</option>
                    <option>Uruguay</option>
                    <option>Brasil</option>
                    <option>Colombia</option>
                    <option>México</option>
                    <option>España</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-umain-text-dim)', marginBottom: '0.5rem' }}>
                    Tier
                  </label>
                  <select 
                    className="umain-input"
                    value={formData.tier}
                    onChange={(e) => setFormData({...formData, tier: e.target.value})}
                  >
                    <option value="A">A - Premium</option>
                    <option value="B">B - Standard</option>
                    <option value="C">C - Entry</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-umain-text-dim)', marginBottom: '0.5rem' }}>
                    Email *
                  </label>
                  <input 
                    className="umain-input" 
                    type="email"
                    placeholder="talento@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-umain-text-dim)', marginBottom: '0.5rem' }}>
                    Teléfono
                  </label>
                  <input 
                    className="umain-input" 
                    placeholder="+54 11 1234-5678"
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-umain-text-dim)', marginBottom: '0.5rem' }}>
                  Notas internas
                </label>
                <textarea 
                  className="umain-input" 
                  rows={3}
                  placeholder="Notas sobre el talento (no visible para el talento)"
                  value={formData.notas}
                  onChange={(e) => setFormData({...formData, notas: e.target.value})}
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Representation */}
        {step === 2 && (
          <div className="umain-card">
            <div className="umain-card__header">
              <h2 className="umain-card__title">Representación</h2>
            </div>
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-umain-text-dim)', marginBottom: '0.5rem' }}>
                  Agencia
                </label>
                <input 
                  className="umain-input" 
                  value="Casting Club (Buenos Aires)"
                  disabled
                  style={{ opacity: 0.7 }}
                />
                <div style={{ fontSize: '10px', color: 'var(--color-umain-text-dim)', marginTop: '0.25rem' }}>
                  Asignada automáticamente a tu cuenta
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-umain-text-dim)', marginBottom: '0.5rem' }}>
                  Representante principal
                </label>
                <input 
                  className="umain-input" 
                  value="Federico López"
                  disabled
                  style={{ opacity: 0.7 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-umain-text-dim)', marginBottom: '0.5rem' }}>
                  Split de regalías (talento / agencia) *
                </label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <input 
                    className="umain-input" 
                    type="number"
                    min="50"
                    max="80"
                    value={formData.split}
                    onChange={(e) => setFormData({...formData, split: e.target.value})}
                    style={{ width: '100px' }}
                  />
                  <span style={{ fontSize: '13px', color: 'var(--color-umain-text-secondary)' }}>/ {100 - parseInt(formData.split)}%</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-umain-text-dim)' }}>
                    (Talento recibe {formData.split}%)
                  </span>
                </div>
              </div>

              <div style={{ 
                padding: '1rem', 
                background: 'var(--color-umain-bg-alt)', 
                borderRadius: '2px',
                border: '0.5px solid var(--color-umain-border)',
              }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-umain-brand)', marginBottom: '0.5rem' }}>
                  Tipo de contrato
                </div>
                <div style={{ fontSize: '13px' }}>
                  Tripartito: UMAIN × Casting Club × Talento
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-umain-text-dim)', marginTop: '0.25rem' }}>
                  El contrato se genera automáticamente y se envía al talento para firma digital.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Configuration */}
        {step === 3 && (
          <div className="umain-card">
            <div className="umain-card__header">
              <h2 className="umain-card__title">Configuración del avatar</h2>
            </div>
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ 
                padding: '1rem', 
                background: 'var(--color-umain-bg-alt)', 
                borderRadius: '2px',
                border: '0.5px solid var(--color-umain-border)',
              }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-umain-brand)', marginBottom: '0.75rem' }}>
                  Configuración por defecto
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-umain-text-dim)' }}>Consentimiento</span>
                    <span>Caso por caso (requiere aprobación)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-umain-text-dim)' }}>Exclusividad</span>
                    <span>Por categoría IAB</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-umain-text-dim)' }}>Territorios</span>
                    <span>Global (configurable)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-umain-text-dim)' }}>Modelo digital</span>
                    <span>Flux LoRA + MetaHuman</span>
                  </div>
                </div>
              </div>

              <div style={{ 
                padding: '1rem', 
                background: 'rgba(184, 154, 74, 0.1)', 
                borderRadius: '2px',
                border: '0.5px solid rgba(184, 154, 74, 0.3)',
              }}>
                <div style={{ fontSize: '12px', color: 'var(--color-status-pending)', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <span>⚠</span>
                  <span>El talento recibirá un magic link para configurar su matriz de consentimiento antes de que se genere cualquier contenido.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Photos */}
        {step === 4 && (
          <div className="umain-card">
            <div className="umain-card__header">
              <h2 className="umain-card__title">Fotos para Soul ID</h2>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <div style={{ 
                padding: '2rem', 
                border: '2px dashed var(--color-umain-border)', 
                borderRadius: '2px', 
                textAlign: 'center',
                marginBottom: '1.5rem',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem', opacity: 0.3 }}>📸</div>
                <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: '16px', fontWeight: 400, marginBottom: '0.5rem' }}>
                  Arrastrá las fotos aquí
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-umain-text-dim)', marginBottom: '1rem' }}>
                  o hacé clic para seleccionar archivos
                </div>
                <button className="umain-button-outline">Seleccionar archivos</button>
              </div>

              <div style={{ 
                padding: '1rem', 
                background: 'var(--color-umain-bg-alt)', 
                borderRadius: '2px',
                border: '0.5px solid var(--color-umain-border)',
                marginBottom: '1rem',
              }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-umain-brand)', marginBottom: '0.75rem' }}>
                  Requisitos para Soul ID
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '12px' }}>
                  <div>✓ Mínimo 20 fotos (recomendado 25-30)</div>
                  <div>✓ Variedad de ángulos: frontal, perfil, 3/4</div>
                  <div>✓ Expresiones: neutral, sonrisa, seria</div>
                  <div>✓ Iluminación variada: natural, studio, contraluz</div>
                  <div>✓ Resolución mínima: 1024x1024px</div>
                  <div>✓ Sin gafas de sol ni accesorios que tapen el rostro</div>
                </div>
              </div>

              <div style={{ fontSize: '11px', color: 'var(--color-umain-text-dim)' }}>
                Las fotos se pueden subir después de crear el talento. El entrenamiento del Soul ID toma ~5 minutos.
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: '0.5px solid var(--color-umain-border)',
        }}>
          <button 
            className="umain-button-ghost"
            onClick={() => setStep(Math.max(1, step - 1))}
            style={{ visibility: step > 1 ? 'visible' : 'hidden' }}
          >
            ← Anterior
          </button>
          
          {step < 4 ? (
            <button 
              className="umain-button-primary"
              onClick={() => setStep(step + 1)}
            >
              Siguiente →
            </button>
          ) : (
            <Link to="/casting/dashboard" className="umain-button-primary">
              Crear talento
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
