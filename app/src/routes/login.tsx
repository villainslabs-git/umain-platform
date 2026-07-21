import { createFileRoute, redirect, Link } from "@tanstack/react-router";
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
        // In a real app, set session cookie here
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError("Error de conexion");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-dvh items-center justify-center px-4" style={{background:'var(--color-umain-bg)'}}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span style={{
            fontFamily: "'Geist', sans-serif",
            fontWeight: 700,
            fontSize: '2rem',
            background: 'linear-gradient(135deg, #7dd4fc, #f4a8c8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>UMAIN</span>
          <p className="formula-text mt-2">plataforma de avatares digitales</p>
        </div>

        <div className="wireframe-box">
          <h2 className="text-lg font-bold mb-1">Acceso al sistema</h2>
          <p className="formula-text mb-6">Ingresa tus credenciales</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="formula-text block mb-1.5" style={{color:'var(--color-umain-text-secondary)'}}>
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
              <label className="formula-text block mb-1.5" style={{color:'var(--color-umain-text-secondary)'}}>
                Contrasena
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
              <div className="umain-status-badge umain-status-badge--error" style={{borderRadius:'0.375rem', width:'100%', justifyContent:'center', padding:'0.5rem'}}>
                {error}
              </div>
            )}

            <button type="submit" className="umain-button-primary w-full" disabled={loading}>
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <div className="mt-6 pt-4" style={{borderTop:'1px solid var(--color-umain-border)'}}>
            <p className="formula-text text-center" style={{fontSize:'0.75rem', color:'var(--color-umain-text-dim)'}}>
              Demo: admin@umain.io / demo2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
