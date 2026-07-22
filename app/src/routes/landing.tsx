import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/landing")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-umain-bg)' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '2rem 3rem',
        borderBottom: '0.5px solid var(--color-umain-border)',
      }}>
        <Link to="/landing" style={{ textDecoration: 'none' }}>
          <div style={{
            fontFamily: "'Archivo', 'Helvetica Neue', Arial, sans-serif",
            fontWeight: 650,
            fontStretch: '122%',
            fontSize: '1.45rem',
            letterSpacing: '0.38em',
            marginRight: '-0.38em',
            textTransform: 'uppercase',
            color: 'var(--color-umain-brand)',
            cursor: 'pointer',
            lineHeight: 1,
          }}>
            UMAIN
          </div>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          <a href="#how" style={{
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--color-umain-text-secondary)',
            textDecoration: 'none',
            cursor: 'pointer',
          }}>
            Cómo funciona
          </a>
          <a href="#for-brands" style={{
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--color-umain-text-secondary)',
            textDecoration: 'none',
            cursor: 'pointer',
          }}>
            Para marcas
          </a>
          <a href="#for-talent" style={{
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--color-umain-text-secondary)',
            textDecoration: 'none',
            cursor: 'pointer',
          }}>
            Para talento
          </a>
          <Link to="/login" style={{
            padding: '0.5rem 1.25rem',
            border: '0.5px solid var(--color-umain-brand)',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--color-umain-brand)',
            background: 'transparent',
            textDecoration: 'none',
            transition: 'all 0.15s',
          }}>
            Portal de talento
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 420px',
        minHeight: 'calc(100vh - 82px)',
      }}>
        <div style={{
          padding: '5rem 3rem 4rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.25em',
              color: 'var(--color-umain-brand)',
              marginBottom: '1.5rem',
            }}>
              Gemelos digitales con consentimiento · Piloto · Buenos Aires
            </div>
            <h1 style={{
              fontFamily: "'Archivo', 'Helvetica Neue', Arial, sans-serif",
              fontSize: 'clamp(3rem, 5vw, 4.5rem)',
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: 'var(--color-umain-text)',
              maxWidth: '680px',
            }}>
              Identidad real,<br />
              <em style={{ fontStyle: 'normal', color: 'var(--color-umain-brand)', fontWeight: 450 }}>
                licenciada
              </em> con intención.
            </h1>
            <p style={{
              fontSize: '14px',
              color: 'var(--color-umain-text-secondary)',
              maxWidth: '480px',
              lineHeight: 1.7,
              marginTop: '2rem',
            }}>
              UMAIN es la infraestructura de gemelos digitales del talento hispano. 
              Las castineras y representantes aportan el roster. UMAIN aporta el rights engine: 
              consentimiento granular, aprobación del talento en cada uso y trazabilidad C2PA. 
              Y las marcas extienden sus campañas sin volver a shootear.
            </p>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '3rem' }}>
              <Link to="/login" style={{
                padding: '0.875rem 2rem',
                background: 'var(--color-umain-brand)',
                color: '#FFFFFF',
                fontFamily: "'Archivo', 'Helvetica Neue', Arial, sans-serif",
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                border: 'none',
                textDecoration: 'none',
                transition: 'all 0.15s',
              }}>
                Ver la demo del portal →
              </Link>
              <a href="#how" style={{
                padding: '0.875rem 2rem',
                background: 'transparent',
                color: 'var(--color-umain-text)',
                fontFamily: "'Archivo', 'Helvetica Neue', Arial, sans-serif",
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                border: '0.5px solid var(--color-umain-border)',
                textDecoration: 'none',
                transition: 'all 0.15s',
              }}>
                Cómo funciona
              </a>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex',
            gap: '3rem',
            paddingTop: '3rem',
            borderTop: '0.5px solid var(--color-umain-border)',
            marginTop: '4rem',
          }}>
            <div>
              <div style={{
                fontFamily: "'Archivo', 'Helvetica Neue', Arial, sans-serif",
                fontSize: '2.5rem',
                fontWeight: 300,
                letterSpacing: '-0.02em',
                color: 'var(--color-umain-text)',
                lineHeight: 1,
              }}>0</div>
              <div style={{
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'var(--color-umain-text-dim)',
                marginTop: '0.5rem',
              }}>Usos sin consentimiento</div>
            </div>
            <div>
              <div style={{
                fontFamily: "'Archivo', 'Helvetica Neue', Arial, sans-serif",
                fontSize: '2.5rem',
                fontWeight: 300,
                letterSpacing: '-0.02em',
                color: 'var(--color-umain-text)',
                lineHeight: 1,
              }}>50–70%</div>
              <div style={{
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'var(--color-umain-text-dim)',
                marginTop: '0.5rem',
              }}>Del fee, para el talento</div>
            </div>
            <div>
              <div style={{
                fontFamily: "'Archivo', 'Helvetica Neue', Arial, sans-serif",
                fontSize: '2.5rem',
                fontWeight: 300,
                letterSpacing: '-0.02em',
                color: 'var(--color-umain-text)',
                lineHeight: 1,
              }}>IAB</div>
              <div style={{
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'var(--color-umain-text-dim)',
                marginTop: '0.5rem',
              }}>Taxonomía 3.1</div>
            </div>
            <div>
              <div style={{
                fontFamily: "'Archivo', 'Helvetica Neue', Arial, sans-serif",
                fontSize: '2.5rem',
                fontWeight: 300,
                letterSpacing: '-0.02em',
                color: 'var(--color-umain-text)',
                lineHeight: 1,
              }}>C2PA</div>
              <div style={{
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'var(--color-umain-text-dim)',
                marginTop: '0.5rem',
              }}>Credenciales de contenido</div>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          borderLeft: '0.5px solid var(--color-umain-border)',
          background: 'var(--color-umain-bg-alt)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="120" height="144" viewBox="0 0 60 72" fill="none" style={{ opacity: 0.2 }}>
            <ellipse cx="30" cy="25" rx="15" ry="18" stroke="currentColor" strokeWidth="0.5" />
            <path d="M5 72 Q 5 42 30 42 Q 55 42 55 72" stroke="currentColor" strokeWidth="0.5" fill="none" />
          </svg>
          <div style={{
            position: 'absolute',
            bottom: '2rem',
            left: '1.5rem',
            right: '1.5rem',
          }}>
            <div style={{
              fontFamily: "'Archivo', 'Helvetica Neue', Arial, sans-serif",
              fontSize: '1.5rem',
              fontWeight: 300,
              fontStyle: 'normal',
              color: 'var(--color-umain-text)',
            }}>Manu Jantus</div>
            <div style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'var(--color-umain-text-dim)',
              marginTop: '0.25rem',
            }}>Tier A · Buenos Aires · Activa desde 2025</div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div id="how" style={{
        padding: '6rem 3rem',
        borderTop: '0.5px solid var(--color-umain-border)',
      }}>
        <div style={{
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.25em',
          color: 'var(--color-umain-brand)',
          marginBottom: '1rem',
        }}>Cómo funciona</div>
        <h2 style={{
          fontFamily: "'Archivo', 'Helvetica Neue', Arial, sans-serif",
          fontSize: '2.5rem',
          fontWeight: 300,
          letterSpacing: '-0.02em',
          color: 'var(--color-umain-text)',
          marginBottom: '3rem',
        }}>Tres pilares, un sistema.</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2px',
          background: 'var(--color-umain-border-soft)',
          border: '0.5px solid var(--color-umain-border)',
        }}>
          {[
            { num: '01', title: 'Capture Protocol', desc: 'Sesión de 45 min con video 4K multi-ángulo, fotografía guiada (40-80 tomas) y captura de voz (10-15 min). Identity Pack cifrado AES-256 en el set.' },
            { num: '02', title: 'Rights Engine', desc: 'Base de datos de identidades, compuerta de consentimiento, workflow de aprobación del talento, AuditLog inmutable con cadena de hashes SHA-256 y firma ed25519.' },
            { num: '03', title: 'Generation Layer', desc: 'Triple Pipeline sobre Higgsfield: Pipeline A (Soul ID 2.0) + Pipeline B (GPT Image 2 / Nano Banana Pro) + Pipeline C (Seedream V5 Pro adaptativo).' },
          ].map((step) => (
            <div key={step.num} style={{
              background: 'var(--color-umain-bg)',
              padding: '2.5rem 2rem',
            }}>
              <div style={{
                fontFamily: "'Archivo', 'Helvetica Neue', Arial, sans-serif",
                fontSize: '3rem',
                fontWeight: 300,
                color: 'var(--color-umain-brand)',
                opacity: 0.4,
                lineHeight: 1,
                marginBottom: '1.5rem',
              }}>{step.num}</div>
              <div style={{
                fontSize: '13px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--color-umain-text)',
                marginBottom: '0.75rem',
              }}>{step.title}</div>
              <div style={{
                fontSize: '13px',
                color: 'var(--color-umain-text-secondary)',
                lineHeight: 1.65,
              }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* For Brands */}
      <div id="for-brands" style={{
        padding: '6rem 3rem',
        borderTop: '0.5px solid var(--color-umain-border)',
      }}>
        <div style={{
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.25em',
          color: 'var(--color-umain-brand)',
          marginBottom: '1rem',
        }}>Para marcas</div>
        <h2 style={{
          fontFamily: "'Archivo', 'Helvetica Neue', Arial, sans-serif",
          fontSize: '2.5rem',
          fontWeight: 300,
          letterSpacing: '-0.02em',
          color: 'var(--color-umain-text)',
          marginBottom: '3rem',
        }}>Campañas sin re-shooting.</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2px',
          background: 'var(--color-umain-border)',
        }}>
          <div style={{ background: 'var(--color-umain-bg-alt)', padding: '3rem' }}>
            <div style={{
              fontFamily: "'Archivo', 'Helvetica Neue', Arial, sans-serif",
              fontSize: '1.75rem',
              fontWeight: 300,
              fontStyle: 'normal',
              color: 'var(--color-umain-text)',
              marginBottom: '1.5rem',
            }}>Beneficios para marcas</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[
                'Extiende campañas existentes sin volver a shootear',
                'Acceso a talento hispano con consentimiento granular',
                'Trazabilidad C2PA en cada asset generado',
                'Exclusividad competitiva automática',
                'Cumplimiento legal verificado (Ley 25.326)',
              ].map((item, i) => (
                <li key={i} style={{
                  fontSize: '13px',
                  color: 'var(--color-umain-text-secondary)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  lineHeight: 1.5,
                }}>
                  <span style={{ color: 'var(--color-umain-brand)', flexShrink: 0 }}>·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ background: 'var(--color-umain-bg-alt)', padding: '3rem' }}>
            <div style={{
              fontFamily: "'Archivo', 'Helvetica Neue', Arial, sans-serif",
              fontSize: '1.75rem',
              fontWeight: 300,
              fontStyle: 'normal',
              color: 'var(--color-umain-text)',
              marginBottom: '1.5rem',
            }}>Proceso</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[
                'Seleccioná el talento del roster disponible',
                'Definí territorio, período y tipo de output',
                'El talento revisa y aprueba cada uso',
                'UMAIN genera el contenido via Triple Pipeline',
                'Entrega con Content Credentials C2PA',
              ].map((item, i) => (
                <li key={i} style={{
                  fontSize: '13px',
                  color: 'var(--color-umain-text-secondary)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  lineHeight: 1.5,
                }}>
                  <span style={{ color: 'var(--color-umain-brand)', flexShrink: 0 }}>·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Partners Band */}
      <div style={{
        background: '#0B0B0B',
        color: '#FFFFFF',
        padding: 'clamp(4rem, 9vw, 7rem) 3rem',
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr',
          gap: 'clamp(2.5rem, 6vw, 5rem)',
          alignItems: 'start',
        }}>
          <div>
            <h2 style={{
              fontFamily: "'Archivo', 'Helvetica Neue', Arial, sans-serif",
              fontWeight: 300,
              fontStyle: 'normal',
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              marginBottom: '1.5rem',
            }}>
              Para castineras y representantes
            </h2>
            <p style={{
              fontSize: '14.5px',
              lineHeight: 1.65,
              color: '#C9C9C8',
              maxWidth: '46ch',
              marginBottom: '2rem',
            }}>
              UMAIN convierte tu roster en infraestructura digital. Cada talento que representás 
              puede generar ingresos pasivos con su gemelo digital, mientras vos mantenés el 
              control comercial.
            </p>
            <button style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              color: '#FFFFFF',
              fontFamily: "'Archivo', 'Helvetica Neue', Arial, sans-serif",
              fontSize: '12px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '0.9rem 1.5rem',
              cursor: 'pointer',
              transition: 'background 0.35s, color 0.35s',
            }}>
              Sumar mi roster
            </button>
          </div>
          <div style={{
            border: '0.5px solid rgba(255, 255, 255, 0.3)',
            padding: '2rem',
            background: 'transparent',
          }}>
            <div style={{
              fontFamily: "'Archivo', 'Helvetica Neue', Arial, sans-serif",
              fontStyle: 'normal',
              fontSize: '1.25rem',
              fontWeight: 400,
              marginBottom: '1.5rem',
              color: '#FFFFFF',
            }}>Términos para partners</div>
            {[
              { label: 'Split', value: '50-70% para el talento, 20-30% para la castinera, 10-20% para UMAIN' },
              { label: 'Contrato', value: 'Tripartito: UMAIN × Castinera × Talento' },
              { label: 'Exclusividad', value: 'Solo derechos digitales de IA · El trabajo tradicional no se toca' },
              { label: 'Duración', value: '3 años con opción de renovación automática' },
            ].map((term, i) => (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: '110px 1fr',
                gap: '1rem',
                padding: '0.85rem 0',
                borderTop: '0.5px solid rgba(255, 255, 255, 0.18)',
              }}>
                <div style={{
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  color: '#A9A9A8',
                  paddingTop: '0.15em',
                }}>{term.label}</div>
                <div style={{
                  fontSize: '13.5px',
                  lineHeight: 1.5,
                  color: '#FFFFFF',
                }}>{term.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        padding: '2rem 3rem',
        borderTop: '0.5px solid var(--color-umain-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{
          fontSize: '11px',
          color: 'var(--color-umain-text-dim)',
          letterSpacing: '0.05em',
        }}>
          © 2026 UMAIN · Identidad real, licenciada
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <a href="#" style={{
            fontSize: '11px',
            color: 'var(--color-umain-text-dim)',
            textDecoration: 'none',
            letterSpacing: '0.05em',
          }}>Términos</a>
          <a href="#" style={{
            fontSize: '11px',
            color: 'var(--color-umain-text-dim)',
            textDecoration: 'none',
            letterSpacing: '0.05em',
          }}>Privacidad</a>
          <a href="#" style={{
            fontSize: '11px',
            color: 'var(--color-umain-text-dim)',
            textDecoration: 'none',
            letterSpacing: '0.05em',
          }}>Contacto</a>
        </div>
      </footer>
    </div>
  );
}
