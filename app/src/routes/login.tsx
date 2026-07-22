import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { loginUser } from "../lib/queries";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await loginUser({ data: { email, password } });
      if ("error" in result) {
        setError(result.error as string);
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError("Error de conexion");
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'grid', 
      gridTemplateColumns: '1fr 480px' 
    }}>
      {/* Left side - Brand */}
      <div style={{ 
        background: 'var(--color-umain-brand)', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        padding: '3rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.1,
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontFamily: "'Archivo', 'Helvetica Neue', Arial, sans-serif",
            fontWeight: 300,
            fontSize: '3rem',
            lineHeight: 1,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
          }}>
            UMAIN
          </div>
          <div style={{
            fontFamily: "'Archivo', 'Helvetica Neue', Arial, sans-serif",
            fontWeight: 500,
            fontSize: '0.55rem',
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)',
            marginTop: '0.5rem',
          }}>
            identidad real, licenciada
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontFamily: "'Archivo', 'Helvetica Neue', Arial, sans-serif",
            fontSize: '1.875rem',
            fontWeight: 300,
            fontStyle: 'normal',
            color: '#FFFFFF',
            lineHeight: 1.2,
            marginBottom: '1rem',
          }}>
            "Cada uso de tu identidad digital, con tu consentimiento explícito."
          </div>
          <div style={{
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.4)',
          }}>
            Rights Engine · Trazabilidad C2PA · Split 65/35
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div style={{ 
        background: 'var(--color-umain-bg)', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        padding: '3rem 3.5rem',
        borderLeft: '0.5px solid var(--color-umain-border)'
      }}>
        <h1 style={{
          fontFamily: "'Archivo', 'Helvetica Neue', Arial, sans-serif",
          fontSize: '2rem',
          fontWeight: 300,
          letterSpacing: '-0.02em',
          color: 'var(--color-umain-text)',
          marginBottom: '0.5rem',
        }}>
          Ingresá al portal
        </h1>
        <p style={{
          fontSize: '13px',
          color: 'var(--color-umain-text-secondary)',
          marginBottom: '2.5rem',
        }}>
          Accedé a tu dashboard de talento, matriz de consentimiento y aprobaciones pendientes.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'var(--color-umain-text-secondary)',
              marginBottom: '0.5rem',
            }}>
              Email
            </label>
            <input
              type="email"
              className="umain-input"
              placeholder="usuario@umain.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'var(--color-umain-text-secondary)',
              marginBottom: '0.5rem',
            }}>
              Contraseña
            </label>
            <input
              type="password"
              className="umain-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={{ 
              padding: '0.5rem 0.75rem', 
              fontSize: '12px', 
              color: 'var(--color-status-error)', 
              background: 'rgba(168, 74, 74, 0.1)', 
              borderRadius: '2px',
              border: '0.5px solid rgba(168, 74, 74, 0.3)'
            }}>
              {error}
            </div>
          )}

          <button type="submit" className="umain-button-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div style={{ 
          marginTop: '1.75rem', 
          paddingTop: '1.75rem', 
          borderTop: '0.5px solid var(--color-umain-border)' 
        }}>
          <p style={{ 
            fontSize: '11px', 
            color: 'var(--color-umain-text-dim)', 
            textAlign: 'center',
            letterSpacing: '0.05em'
          }}>
            Demo: admin@umain.io / demo2026
          </p>
        </div>

        <Link to="/landing" style={{
          marginTop: '2rem',
          fontSize: '11px',
          color: 'var(--color-umain-text-dim)',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'color 0.15s',
        }}>
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}
