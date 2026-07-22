import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/agency/catalog")({
  component: AgencyCatalog,
});

function AgencyCatalog() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const talents = [
    { 
      id: 1, 
      name: "Manu Jantus", 
      tier: "A", 
      location: "Buenos Aires",
      categories: ["Moda", "Belleza", "Lifestyle"],
      rate: "$2,500/campaña",
      availability: "Disponible",
      avatar: "MJ",
      photo: true
    },
    { 
      id: 2, 
      name: "Lucía Fernández", 
      tier: "A", 
      location: "Santiago",
      categories: ["Deportes", "Fitness", "Tech"],
      rate: "$2,200/campaña",
      availability: "Disponible",
      avatar: "LF",
      photo: true
    },
    { 
      id: 3, 
      name: "Camila Torres", 
      tier: "B", 
      location: "Ciudad de México",
      categories: ["Cosmética", "Lujo", "Travel"],
      rate: "$1,800/campaña",
      availability: "Ocupado hasta Jun",
      avatar: "CT",
      photo: true
    },
    { 
      id: 4, 
      name: "Sofía López", 
      tier: "B", 
      location: "Bogotá",
      categories: ["Food", "Lifestyle", "Home"],
      rate: "$1,500/campaña",
      availability: "Disponible",
      avatar: "SL",
      photo: true
    },
    { 
      id: 5, 
      name: "Valentina Ruiz", 
      tier: "C", 
      location: "Montevideo",
      categories: ["Moda", "Street", "Music"],
      rate: "$900/campaña",
      availability: "Disponible",
      avatar: "VR",
      photo: true
    },
  ];

  const filteredTalents = talents.filter(t => {
    if (filter === 'available' && t.availability !== 'Disponible') return false;
    if (filter === 'tier-a' && t.tier !== 'A') return false;
    if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-umain-bg)' }}>
      {/* Agency Header */}
      <header style={{ 
        padding: '1.5rem 3rem', 
        borderBottom: '0.5px solid var(--color-umain-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div>
            <div style={{ 
              fontFamily: "'Archivo', sans-serif", 
              fontWeight: 650, 
              fontSize: '1.25rem', 
              letterSpacing: '0.38em', 
              textTransform: 'uppercase' 
            }}>
              UMAIN
            </div>
            <div style={{ 
              fontSize: '10px', 
              letterSpacing: '0.15em', 
              textTransform: 'uppercase', 
              color: 'var(--color-umain-text-dim)' 
            }}>
              Portal de Agencias
            </div>
          </div>
          <nav style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/agency/catalog" style={{ 
              fontSize: '12px', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em', 
              color: 'var(--color-umain-brand)', 
              textDecoration: 'none',
              fontWeight: 500,
            }}>
              Catálogo
            </Link>
            <Link to="/agency/requests" style={{ 
              fontSize: '12px', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em', 
              color: 'var(--color-umain-text-dim)', 
              textDecoration: 'none' 
            }}>
              Solicitudes
            </Link>
            <Link to="/agency/campaigns" style={{ 
              fontSize: '12px', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em', 
              color: 'var(--color-umain-text-dim)', 
              textDecoration: 'none' 
            }}>
              Campañas
            </Link>
            <Link to="/agency/contracts" style={{ 
              fontSize: '12px', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em', 
              color: 'var(--color-umain-text-dim)', 
              textDecoration: 'none' 
            }}>
              Contratos
            </Link>
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '11px', color: 'var(--color-umain-text-dim)' }}>BBDO Buenos Aires</span>
          <div style={{ 
            width: 32, 
            height: 32, 
            borderRadius: '50%', 
            background: 'var(--color-umain-brand)', 
            color: '#FFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 500,
          }}>BB</div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '2rem 3rem', maxWidth: '1400px' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-end',
          marginBottom: '2rem',
          paddingBottom: '1.5rem',
          borderBottom: '0.5px solid var(--color-umain-border)',
        }}>
          <div>
            <div style={{ 
              fontSize: '10px', 
              letterSpacing: '0.2em', 
              textTransform: 'uppercase', 
              color: 'var(--color-umain-brand)',
              marginBottom: '0.5rem',
            }}>
              Catálogo de talentos
            </div>
            <h1 style={{ 
              fontFamily: "'Archivo', sans-serif", 
              fontSize: '2.5rem', 
              fontWeight: 300, 
              letterSpacing: '-0.02em' 
            }}>
              Encontrá el <em>talento</em> ideal
            </h1>
            <p style={{ 
              fontSize: '13px', 
              color: 'var(--color-umain-text-dim)', 
              marginTop: '0.5rem',
              maxWidth: '600px',
            }}>
              Buscá entre talentos verificados con consentimiento granular. Cada perfil incluye disponibilidad, categorías IAB y tarifas.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/agency/requests/new" className="umain-button-primary">
              + Nueva solicitud
            </Link>
          </div>
        </div>

        {/* Search & Filters */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '1.5rem',
          padding: '1rem',
          background: '#FAFAF8',
          border: '0.5px solid var(--color-umain-border)',
          borderRadius: '2px',
        }}>
          <input 
            className="umain-input" 
            placeholder="Buscar talento..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1 }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[
              { id: 'all', label: 'Todos' },
              { id: 'available', label: 'Disponibles' },
              { id: 'tier-a', label: 'Tier A' },
            ].map((f) => (
              <button 
                key={f.id}
                className={`umain-filter-btn ${filter === f.id ? 'active' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div style={{ 
          fontSize: '11px', 
          color: 'var(--color-umain-text-dim)', 
          marginBottom: '1rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>
          {filteredTalents.length} talentos encontrados
        </div>

        {/* Talent Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '1rem' 
        }}>
          {filteredTalents.map((talent) => (
            <div key={talent.id} style={{ 
              background: '#FAFAF8',
              border: '0.5px solid var(--color-umain-border)',
              borderRadius: '2px',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}>
              {/* Photo placeholder */}
              <div style={{ 
                aspectRatio: '3/4', 
                background: 'var(--color-umain-bg-alt)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: '0.5px solid var(--color-umain-border)',
              }}>
                <div style={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  background: 'var(--color-umain-brand)',
                  color: '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Archivo', sans-serif",
                  fontSize: '24px',
                  fontWeight: 500,
                }}>
                  {talent.avatar}
                </div>
              </div>

              <div style={{ padding: '1rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '0.5rem',
                }}>
                  <div>
                    <div style={{ 
                      fontFamily: "'Archivo', sans-serif", 
                      fontSize: '16px', 
                      fontWeight: 450 
                    }}>
                      {talent.name}
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      color: 'var(--color-umain-text-dim)' 
                    }}>
                      {talent.location}
                    </div>
                  </div>
                  <span style={{ 
                    padding: '2px 8px',
                    background: 'rgba(11, 11, 11, 0.05)',
                    borderRadius: '2px',
                    fontFamily: "'Archivo', sans-serif",
                    fontSize: '12px',
                    fontWeight: 500,
                  }}>
                    {talent.tier}
                  </span>
                </div>

                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '0.375rem', 
                  marginBottom: '0.75rem' 
                }}>
                  {talent.categories.map((cat) => (
                    <span key={cat} style={{ 
                      padding: '2px 6px',
                      background: 'var(--color-umain-bg-alt)',
                      border: '0.5px solid var(--color-umain-border)',
                      borderRadius: '2px',
                      fontSize: '10px',
                      color: 'var(--color-umain-text-dim)',
                    }}>
                      {cat}
                    </span>
                  ))}
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  paddingTop: '0.75rem',
                  borderTop: '0.5px solid var(--color-umain-border)',
                }}>
                  <div>
                    <div style={{ 
                      fontFamily: "'Archivo', sans-serif", 
                      fontSize: '14px', 
                      fontWeight: 450 
                    }}>
                      {talent.rate}
                    </div>
                    <div style={{ 
                      fontSize: '10px', 
                      color: talent.availability === 'Disponible' 
                        ? 'var(--color-status-active)' 
                        : 'var(--color-status-pending)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                    }}>
                      {talent.availability}
                    </div>
                  </div>
                  <button className="umain-button-primary umain-button-sm">
                    Solicitar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
