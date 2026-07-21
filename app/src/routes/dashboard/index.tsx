import { createFileRoute, redirect } from "@tanstack/react-router";
import { Sidebar } from "../../components/sidebar";
import { getDashboardStats } from "../../lib/queries";
import type { DashboardStats } from "../../lib/umain-types";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
  loader: async () => {
    try {
      return await getDashboardStats();
    } catch {
      return null;
    }
  },
});

function DashboardPage() {
  const stats = Route.useLoaderData() as DashboardStats | null;

  const defaultStats: DashboardStats = {
    total_identidades: 0, identidades_activas: 0, identidades_suspendidas: 0,
    total_campanias: 0, campanias_activas: 0, licencias_vigentes: 0,
    jobs_en_curso: 0, jobs_completados: 0, aprobaciones_pendientes: 0, alertas: 0,
  };

  const s = stats ?? defaultStats;

  return (
    <div className="umain-layout">
      <Sidebar />
      <main className="umain-main">
        <div className="umain-page-header">
          <div>
            <h1>Dashboard</h1>
            <p className="formula-text mt-1">Resumen del sistema UMAIN</p>
          </div>
          <div className="umain-page-header__actions">
            <span className="umain-status-badge umain-status-badge--active" style={{fontSize:'0.7rem'}}>
              Sistema operativo
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'1rem', marginBottom:'2rem'}}>
          <StatCard label="Identidades activas" value={s.identidades_activas.toString()} total={s.total_identidades.toString()} />
          <StatCard label="Licencias vigentes" value={s.licencias_vigentes.toString()} accent="pink" />
          <StatCard label="Campanas activas" value={s.campanias_activas.toString()} total={s.total_campanias.toString()} />
          <StatCard label="Jobs en curso" value={s.jobs_en_curso.toString()} total={`${s.jobs_completados} completados`} />
          <StatCard label="Aprobaciones pendientes" value={s.aprobaciones_pendientes.toString()} alert={s.aprobaciones_pendientes > 0} />
          <StatCard label="Alertas del sistema" value={s.alertas.toString()} alert={s.alertas > 0} />
        </div>

        {/* Activity sections */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem'}}>
          <div className="umain-card">
            <div className="umain-card__header">
              <span className="formula-text formula-text--accent">ACTIVIDAD RECIENTE</span>
              <span className="formula-text" style={{fontSize:'0.7rem', color:'var(--color-umain-text-dim)'}}>tiempo real</span>
            </div>
            <div className="umain-card__body">
              {s.aprobaciones_pendientes > 0 ? (
                <div className="umain-status-badge umain-status-badge--pending" style={{marginBottom:'0.75rem'}}>
                  {s.aprobaciones_pendientes} aprobaciones pendientes
                </div>
              ) : null}
              <p className="formula-text" style={{color:'var(--color-umain-text-dim)', fontSize:'0.8rem'}}>
                Sistema listo. Conecta la base de datos para ver actividad en tiempo real.
              </p>
            </div>
          </div>

          <div className="umain-card">
            <div className="umain-card__header">
              <span className="formula-text formula-text--pink">ESTADO DEL RIGHTS ENGINE</span>
              <span className="umain-status-badge umain-status-badge--vigente" style={{fontSize:'0.65rem'}}>
                compuerta activa
              </span>
            </div>
            <div className="umain-card__body">
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'0.5rem'}}>
                <span className="formula-text" style={{fontSize:'0.75rem'}}>AuditLog chain</span>
                <span className="formula-text formula-text--accent" style={{fontSize:'0.75rem'}}>verificada</span>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'0.5rem'}}>
                <span className="formula-text" style={{fontSize:'0.75rem'}}>Token validation</span>
                <span className="formula-text formula-text--accent" style={{fontSize:'0.75rem'}}>JWT activo</span>
              </div>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <span className="formula-text" style={{fontSize:'0.75rem'}}>Proveedores</span>
                <span className="formula-text" style={{fontSize:'0.75rem', color:'var(--color-umain-text-dim)'}}>capa de abstraccion lista</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, total, accent, alert: isAlert }: {
  label: string;
  value: string;
  total?: string;
  accent?: 'pink';
  alert?: boolean;
}) {
  return (
    <div className="umain-stat-card">
      <div className="umain-stat-card__label">
        {isAlert && <span style={{color:'var(--color-status-pending)', marginRight:'0.375rem'}}>⚠</span>}
        {label}
      </div>
      <div className="umain-stat-card__value" style={accent === 'pink' ? {color:'var(--color-umain-accent-secondary)'} : {}}>
        {value}
      </div>
      {total && <div className="umain-stat-card__change umain-stat-card__change--up">{total} total</div>}
    </div>
  );
}
