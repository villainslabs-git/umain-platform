import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/agency/requests/new")({
  component: NewRequestPage,
});

function NewRequestPage() {
  const [formData, setFormData] = useState({
    campaignName: '',
    client: '',
    description: '',
    selectedTalent: '',
    category: '',
    territory: 'AR',
    startDate: '',
    endDate: '',
    outputType: 'fotos',
    budget: '',
    exclusivity: false,
    notes: '',
  });

  const availableTalents = [
    { id: 1, name: "Manu Jantus", tier: "A", rate: "$2,500" },
    { id: 2, name: "Lucía Fernández", tier: "A", rate: "$2,200" },
    { id: 3, name: "Sofía López", tier: "B", rate: "$1,500" },
    { id: 4, name: "Valentina Ruiz", tier: "C", rate: "$900" },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-umain-bg)' }}>
      {/* Header */}
      <header style={{ 
        padding: '1.5rem 3rem', 
        borderBottom: '0.5px solid var(--color-umain-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/agency/catalog" style={{ textDecoration: 'none' }}>
            <div style={{ 
              fontFamily: "'Archivo', sans-serif", 
              fontWeight: 650, 
              fontSize: '1.25rem', 
              letterSpacing: '0.38em', 
              textTransform: 'uppercase',
              color: 'var(--color-umain-brand)',
            }}>
              UMAIN
            </div>
          </Link>
          <span style={{ fontSize: '12px', color: 'var(--color-umain-text-dim)' }}>→</span>
          <span style={{ fontSize: '12px', color: 'var(--color-umain-text)' }}>Nueva solicitud</span>
        </div>
      </header>

      <main style={{ padding: '2rem 3rem', maxWidth: '900px' }}>
        {/* Header */}
        <div style={{ 
          marginBottom: '2rem',
          paddingBottom: '1.5rem',
          borderBottom: '0.5px solid var(--color-umain-border)',
        }}>
          <div style={{ 
            fontSize: '10px', 
            letterSpacing: '0.2em', 
            textTransform: 'uppercase', 
            color: 'var(--color-umain-brand)',
            marginBottom: '0.5rem',
          }}>
            Solicitud de talento
          </div>
          <h1 style={{ 
            fontFamily: "'Archivo', sans-serif", 
            fontSize: '2.5rem', 
            fontWeight: 300, 
            letterSpacing: '-0.02em' 
          }}>
            Crear <em>solicitud</em>
          </h1>
          <p style={{ 
            fontSize: '13px', 
            color: 'var(--color-umain-text-dim)', 
            marginTop: '0.5rem',
          }}>
            Definí los detalles de tu campaña. La solicitud se enviará al talento y a UMAIN para validación del Rights Engine.
          </p>
        </div>

        {/* Campaign Details */}
        <div style={{ 
          background: '#FAFAF8',
          border: '0.5px solid var(--color-umain-border)',
          borderRadius: '2px',
          marginBottom: '1.5rem',
        }}>
          <div style={{ 
            padding: '1rem 1.25rem', 
            borderBottom: '0.5px solid var(--color-umain-border)',
            fontFamily: "'Archivo', sans-serif",
            fontSize: '1.25rem',
            fontWeight: 400,
          }}>
            Datos de la campaña
          </div>
          <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-umain-text-dim)', marginBottom: '0.5rem' }}>
                  Nombre de campaña *
                </label>
                <input 
                  className="umain-input" 
                  placeholder="Ej: Summer Collection 2026"
                  value={formData.campaignName}
                  onChange={(e) => setFormData({...formData, campaignName: e.target.value})}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-umain-text-dim)', marginBottom: '0.5rem' }}>
                  Cliente / Marca *
                </label>
                <input 
                  className="umain-input" 
                  placeholder="Ej: Nike, L'Oréal, Samsung"
                  value={formData.client}
                  onChange={(e) => setFormData({...formData, client: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-umain-text-dim)', marginBottom: '0.5rem' }}>
                Descripción de la campaña
              </label>
              <textarea 
                className="umain-input" 
                rows={3}
                placeholder="Describí el concepto, el tono y los objetivos de la campaña..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>
        </div>

        {/* Talent Selection */}
        <div style={{ 
          background: '#FAFAF8',
          border: '0.5px solid var(--color-umain-border)',
          borderRadius: '2px',
          marginBottom: '1.5rem',
        }}>
          <div style={{ 
            padding: '1rem 1.25rem', 
            borderBottom: '0.5px solid var(--color-umain-border)',
            fontFamily: "'Archivo', sans-serif",
            fontSize: '1.25rem',
            fontWeight: 400,
          }}>
            Selección de talento
          </div>
          <div style={{ padding: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              {availableTalents.map((talent) => (
                <div 
                  key={talent.id}
                  onClick={() => setFormData({...formData, selectedTalent: String(talent.id)})}
                  style={{ 
                    padding: '1rem',
                    background: formData.selectedTalent === String(talent.id) 
                      ? 'var(--color-umain-accent-dim)' 
                      : 'var(--color-umain-bg-alt)',
                    border: `0.5px solid ${formData.selectedTalent === String(talent.id) 
                      ? 'var(--color-umain-brand)' 
                      : 'var(--color-umain-border)'}`,
                    borderRadius: '2px',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 450 }}>
                        {talent.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-umain-text-dim)' }}>
                        Tier {talent.tier} · {talent.rate}
                      </div>
                    </div>
                    {formData.selectedTalent === String(talent.id) && (
                      <span style={{ color: 'var(--color-umain-brand)', fontSize: '18px' }}>✓</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Campaign Details */}
        <div style={{ 
          background: '#FAFAF8',
          border: '0.5px solid var(--color-umain-border)',
          borderRadius: '2px',
          marginBottom: '1.5rem',
        }}>
          <div style={{ 
            padding: '1rem 1.25rem', 
            borderBottom: '0.5px solid var(--color-umain-border)',
            fontFamily: "'Archivo', sans-serif",
            fontSize: '1.25rem',
            fontWeight: 400,
          }}>
            Detalles de la campaña
          </div>
          <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-umain-text-dim)', marginBottom: '0.5rem' }}>
                  Categoría IAB *
                </label>
                <select 
                  className="umain-input"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">Seleccionar...</option>
                  <option value="iab-16">IAB-16 Moda y estilo</option>
                  <option value="iab-204">IAB-204 Belleza y cosmética</option>
                  <option value="iab-186">IAB-186 Cuidado capilar</option>
                  <option value="iab-225">IAB-225 Moda femenina</option>
                  <option value="iab-575">IAB-575 Smartphones</option>
                  <option value="iab-15">IAB-15 Deportes</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-umain-text-dim)', marginBottom: '0.5rem' }}>
                  Territorio *
                </label>
                <select 
                  className="umain-input"
                  value={formData.territory}
                  onChange={(e) => setFormData({...formData, territory: e.target.value})}
                >
                  <option value="AR">Argentina</option>
                  <option value="LATAM">Latinoamérica</option>
                  <option value="GLOBAL">Global</option>
                  <option value="US">Estados Unidos</option>
                  <option value="EU">Europa</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-umain-text-dim)', marginBottom: '0.5rem' }}>
                  Tipo de output
                </label>
                <select 
                  className="umain-input"
                  value={formData.outputType}
                  onChange={(e) => setFormData({...formData, outputType: e.target.value})}
                >
                  <option value="fotos">Fotos</option>
                  <option value="video">Video</option>
                  <option value="ambos">Fotos + Video</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-umain-text-dim)', marginBottom: '0.5rem' }}>
                  Fecha inicio
                </label>
                <input 
                  className="umain-input" 
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-umain-text-dim)', marginBottom: '0.5rem' }}>
                  Fecha fin
                </label>
                <input 
                  className="umain-input" 
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={formData.exclusivity}
                  onChange={(e) => setFormData({...formData, exclusivity: e.target.checked})}
                />
                <span style={{ fontSize: '13px' }}>
                  Solicitar exclusividad de categoría (bloquea competidores)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '1.5rem 0',
          borderTop: '0.5px solid var(--color-umain-border)',
        }}>
          <Link to="/agency/catalog" style={{ 
            fontSize: '11px', 
            color: 'var(--color-umain-text-dim)',
            textDecoration: 'none',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            ← Volver al catálogo
          </Link>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="umain-button-ghost">
              Guardar borrador
            </button>
            <button className="umain-button-primary">
              Enviar solicitud
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
