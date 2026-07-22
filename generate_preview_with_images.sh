#!/bin/bash

# Generate base64 encoded images
PORTRAIT=$(base64 -w 0 public/images/talent-portrait.jpg)
LIFESTYLE=$(base64 -w 0 public/images/talent-lifestyle.jpg)
CAMPAIGN=$(base64 -w 0 public/images/talent-campaign.jpg)
PROFILE=$(base64 -w 0 public/images/talent-profile-side.jpg)

# Create the HTML with embedded images
cat > preview_v02.html << HTMLEOF
<!DOCTYPE html>
<html lang="es-AR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>UMAIN · Preview v02 · Con Fotos del Talento</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62.5..125,100..900&display=swap" rel="stylesheet">
<style>
  :root {
    --brand: #0B0B0B;
    --brand-deep: #000000;
    --brand-bright: #3D3D3D;
    --bg: #FFFFFF;
    --bg-alt: #F6F6F5;
    --bg-deep: #EBEBEA;
    --fg: #0B0B0B;
    --fg-muted: #4B4B4A;
    --fg-soft: #7C7C7B;
    --border: rgba(11, 11, 11, 0.18);
    --border-soft: rgba(11, 11, 11, 0.08);
    --green: #4A7A52;
    --yellow: #B89A4A;
    --red: #A84A4A;
    --blue: #4A6A8A;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Archivo', 'Helvetica Neue', Arial, sans-serif;
    background: var(--bg);
    color: var(--fg);
    font-size: 14px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  em { font-style: normal; font-weight: 450; }

  .portal { display: grid; grid-template-columns: 240px 1fr; min-height: 100vh; }
  .login-view { display: none; min-height: 100vh; grid-template-columns: 1fr 480px; }
  .login-view.active { display: grid; }

  .sidebar {
    background: var(--bg-alt);
    border-right: 0.5px solid var(--border);
    padding: 2rem 0;
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
  }
  .logo { padding: 0 1.5rem 2rem; border-bottom: 0.5px solid var(--border); }
  .logo-word {
    font-family: 'Archivo', 'Helvetica Neue', Arial, sans-serif;
    font-weight: 650; font-stretch: 122%; font-size: 1.45rem;
    letter-spacing: 0.38em; margin-right: -0.38em;
    text-transform: uppercase; color: var(--fg); line-height: 1;
  }
  .logo-sub {
    font-family: 'Archivo', 'Helvetica Neue', Arial, sans-serif;
    font-size: 10px; letter-spacing: 0.15em;
    text-transform: uppercase; color: var(--fg-soft); margin-top: 0.25rem;
  }
  .nav-section {
    font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--brand); padding: 1rem 1.5rem 0.5rem;
  }
  .nav-item {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.6rem 1.5rem; color: var(--fg-muted);
    text-decoration: none; font-size: 13px;
    transition: all 0.15s; cursor: pointer;
    border-left: 2px solid transparent;
  }
  .nav-item:hover { color: var(--fg); background: rgba(11, 11, 11, 0.03); }
  .nav-item.active {
    color: var(--fg); border-left-color: var(--brand);
    background: rgba(11, 11, 11, 0.03); font-weight: 500;
  }
  .nav-badge {
    margin-left: auto; background: var(--brand); color: white;
    font-size: 10px; padding: 2px 6px; border-radius: 10px; font-weight: 500;
  }
  .sidebar-footer {
    padding: 1rem 1.5rem; border-top: 0.5px solid var(--border);
    font-size: 10px; color: var(--fg-soft); letter-spacing: 0.1em; text-transform: uppercase;
  }

  .main { padding: 2rem 2.5rem; min-height: 100vh; }

  .page-header {
    display: flex; justify-content: space-between; align-items: flex-end;
    margin-bottom: 2rem; padding-bottom: 1.5rem;
    border-bottom: 0.5px solid var(--border); gap: 2rem;
  }
  .page-label {
    font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--brand); margin-bottom: 0.5rem;
  }
  .page-title {
    font-family: 'Archivo', 'Helvetica Neue', Arial, sans-serif;
    font-size: 2.5rem; font-weight: 300; letter-spacing: -0.02em;
  }
  .page-description {
    font-size: 13px; color: var(--fg-muted); max-width: 600px; margin-top: 0.5rem;
  }
  .page-actions { display: flex; gap: 0.5rem; align-items: center; }

  .btn {
    padding: 0.5rem 0.875rem; font-size: 11px; text-transform: uppercase;
    letter-spacing: 0.1em; border: 0.5px solid var(--fg); color: var(--fg);
    background: transparent; cursor: pointer; border-radius: 2px;
    transition: all 0.15s; text-decoration: none; font-family: inherit;
    display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
  }
  .btn:hover { background: var(--fg); color: var(--bg); }
  .btn.primary { background: var(--brand); color: white; border-color: var(--brand); }
  .btn.primary:hover { background: var(--brand-deep); border-color: var(--brand-deep); }
  .btn.ghost { border-color: var(--border); color: var(--fg-muted); }
  .btn.ghost:hover { color: var(--fg); border-color: var(--fg-muted); background: transparent; }
  .btn.small { padding: 0.375rem 0.625rem; font-size: 10px; }
  .btn.danger { border-color: var(--red); color: var(--red); }
  .btn.danger:hover { background: var(--red); color: white; }

  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
  .stat-card { background: #FAFAF8; border: 0.5px solid var(--border); padding: 1.25rem; border-radius: 2px; }
  .stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: var(--brand); margin-bottom: 0.5rem; }
  .stat-value { font-family: 'Archivo', sans-serif; font-size: 2.25rem; font-weight: 300; line-height: 1; letter-spacing: -0.01em; }
  .stat-detail { font-size: 11px; color: var(--fg-muted); margin-top: 0.5rem; }

  .card { background: #FAFAF8; border: 0.5px solid var(--border); border-radius: 2px; margin-bottom: 1.5rem; overflow: hidden; }
  .card-header {
    padding: 1rem 1.25rem; border-bottom: 0.5px solid var(--border);
    display: flex; justify-content: space-between; align-items: baseline;
  }
  .card-title { font-family: 'Archivo', sans-serif; font-size: 1.25rem; font-weight: 400; font-style: normal; }
  .card-body { padding: 1.25rem; }
  .view-all { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--brand); text-decoration: none; cursor: pointer; }

  .content-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; }

  .activity-item {
    padding: 1rem 1.25rem; border-bottom: 0.5px solid var(--border-soft);
    display: flex; gap: 1rem; align-items: flex-start;
  }
  .activity-item:last-child { border-bottom: none; }
  .activity-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--brand); margin-top: 6px; flex-shrink: 0; }
  .activity-dot.pending { background: var(--yellow); }
  .activity-dot.completed { background: var(--green); }
  .activity-dot.alert { background: var(--red); }
  .activity-content { flex: 1; }
  .activity-title { font-size: 13px; color: var(--fg); margin-bottom: 0.25rem; }
  .activity-meta { font-size: 11px; color: var(--fg-soft); }
  .activity-action {
    font-size: 10px; color: var(--brand); text-decoration: none;
    padding: 4px 10px; border: 0.5px solid var(--brand); border-radius: 2px;
    text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; white-space: nowrap;
  }
  .activity-action:hover { background: var(--brand); color: white; }

  .timeline-item {
    display: grid; grid-template-columns: 80px 48px 1fr 100px 90px;
    gap: 1rem; padding: 1rem 1.25rem; border-bottom: 0.5px solid var(--border-soft); align-items: center;
  }
  .timeline-item:last-child { border-bottom: none; }
  .timeline-date { font-size: 10px; color: var(--fg-soft); text-transform: uppercase; letter-spacing: 0.05em; }
  .timeline-thumb {
    width: 48px; height: 48px; background: var(--bg-alt); border-radius: 2px;
    display: flex; align-items: center; justify-content: center; color: var(--fg-soft);
  }
  .timeline-info h4 { font-family: 'Archivo', sans-serif; font-size: 14px; font-weight: 400; margin-bottom: 0.25rem; }
  .timeline-info .meta { font-size: 11px; color: var(--fg-muted); }
  .timeline-territory { font-size: 13px; }
  .timeline-status { font-size: 10px; }

  .badge {
    display: inline-flex; align-items: center; gap: 0.375rem;
    padding: 3px 8px; font-family: 'Archivo', sans-serif;
    font-size: 10px; font-weight: 500; text-transform: uppercase;
    letter-spacing: 0.1em; border-radius: 2px;
  }
  .badge.active { background: rgba(74, 122, 82, 0.1); color: var(--green); }
  .badge.pending { background: rgba(184, 154, 74, 0.1); color: var(--yellow); }
  .badge.error { background: rgba(168, 74, 74, 0.1); color: var(--red); }
  .badge.locked { background: rgba(11, 11, 11, 0.05); color: var(--brand); }
  .badge.expired { background: var(--bg-deep); color: var(--fg-soft); }

  .progress-bar { height: 6px; background: var(--bg-deep); border-radius: 3px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 3px; background: var(--brand); }

  .matrix-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 1.5rem; padding: 1.25rem;
    background: #FAFAF8; border: 0.5px solid var(--border); border-radius: 2px;
  }
  .matrix-legend {
    display: flex; gap: 1.25rem; margin-bottom: 1rem; padding: 0.75rem 1rem;
    background: var(--bg-alt); border-radius: 2px; font-size: 11px;
  }
  .legend-item { display: flex; align-items: center; gap: 6px; color: var(--fg-muted); }
  .legend-dot { width: 10px; height: 10px; border-radius: 2px; }
  .legend-dot.allowed { background: var(--green); }
  .legend-dot.case-by-case { background: var(--yellow); }
  .legend-dot.notify { background: var(--blue); }
  .legend-dot.prohibited { background: var(--red); }
  .legend-dot.unset { background: var(--fg-soft); }

  .matrix-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
  .matrix-cat {
    background: #FAFAF8; border: 0.5px solid var(--border); padding: 0.875rem 1rem;
    border-radius: 2px; cursor: pointer; transition: all 0.15s; position: relative;
  }
  .matrix-cat:hover { border-color: var(--brand); transform: translateY(-1px); }
  .cat-state { position: absolute; top: 0.875rem; right: 1rem; width: 10px; height: 10px; border-radius: 2px; }
  .cat-state.allowed { background: var(--green); }
  .cat-state.case-by-case { background: var(--yellow); }
  .cat-state.notify { background: var(--blue); }
  .cat-state.prohibited { background: var(--red); }
  .cat-state.unset { background: var(--fg-soft); }
  .cat-code { font-size: 10px; color: var(--fg-soft); letter-spacing: 0.05em; font-family: 'Courier New', monospace; margin-bottom: 0.25rem; }
  .cat-name { font-family: 'Archivo', sans-serif; font-size: 15px; font-weight: 400; margin-bottom: 0.25rem; padding-right: 1rem; }
  .cat-desc { font-size: 11px; color: var(--fg-muted); line-height: 1.4; }

  .filter-btn {
    padding: 6px 12px; font-size: 11px; border: 0.5px solid var(--border);
    background: #FAFAF8; color: var(--fg-muted); cursor: pointer; border-radius: 2px;
    text-transform: uppercase; letter-spacing: 0.05em; transition: all 0.15s; font-family: inherit;
  }
  .filter-btn:hover, .filter-btn.active { border-color: var(--brand); color: var(--brand); }

  .lock-card {
    background: #FAFAF8; border: 0.5px solid var(--border);
    border-left: 3px solid var(--brand); border-radius: 2px;
    padding: 1.25rem; margin-bottom: 1rem;
    display: grid; grid-template-columns: 1fr 150px 180px;
    gap: 1.5rem; align-items: center;
  }
  .lock-brand { font-family: 'Archivo', sans-serif; font-size: 1.25rem; font-weight: 450; margin-bottom: 0.25rem; }
  .lock-cat { font-size: 12px; color: var(--fg-muted); display: flex; gap: 0.5rem; align-items: center; }
  .lock-comp { font-size: 11px; color: var(--fg-soft); margin-top: 0.5rem; }
  .lock-dates { font-size: 11px; color: var(--fg-muted); text-align: center; }
  .lock-dates strong { display: block; font-family: 'Archivo', sans-serif; font-size: 1.125rem; font-weight: 450; color: var(--fg); }
  .lock-progress { display: flex; flex-direction: column; gap: 0.5rem; text-align: right; }
  .lock-progress-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--fg-muted); }

  .cat-tag { display: inline-block; font-family: 'Courier New', monospace; font-size: 10px; padding: 2px 6px; background: var(--bg-alt); border-radius: 2px; color: var(--fg-soft); }

  .contract-item {
    background: #FAFAF8; border: 0.5px solid var(--border); border-radius: 2px;
    padding: 1.25rem; margin-bottom: 0.75rem;
    display: grid; grid-template-columns: 40px 1fr 120px 100px; gap: 1rem; align-items: center;
  }
  .contract-icon {
    width: 40px; height: 40px; background: var(--bg-alt); border-radius: 2px;
    display: flex; align-items: center; justify-content: center; color: var(--fg-muted);
  }
  .contract-name { font-family: 'Archivo', sans-serif; font-size: 1.0625rem; font-weight: 450; margin-bottom: 0.25rem; }
  .contract-meta { font-size: 11px; color: var(--fg-muted); }

  .approval-card { background: #FAFAF8; border: 0.5px solid var(--border); border-radius: 2px; margin-bottom: 1rem; overflow: hidden; }
  .approval-header {
    padding: 1.25rem; display: grid; grid-template-columns: 1fr auto; gap: 1rem;
    align-items: flex-start; border-bottom: 0.5px solid var(--border);
  }
  .approval-brand { font-family: 'Archivo', sans-serif; font-size: 1.375rem; font-weight: 450; margin-bottom: 0.25rem; }
  .approval-cat { font-size: 12px; color: var(--fg-muted); display: flex; align-items: center; gap: 0.5rem; }
  .approval-deadline { font-size: 11px; color: var(--red); text-transform: uppercase; letter-spacing: 0.1em; text-align: right; }
  .approval-deadline strong { display: block; font-size: 18px; font-family: 'Archivo', sans-serif; font-weight: 450; color: var(--red); margin-top: 0.25rem; }
  .approval-body { padding: 1.25rem; display: grid; grid-template-columns: 180px 1fr; gap: 1.5rem; }
  .approval-preview {
    aspect-ratio: 3/4; background: var(--bg-alt); border-radius: 2px;
    display: flex; align-items: center; justify-content: center; color: var(--fg-soft);
    overflow: hidden;
  }
  .approval-details { display: flex; flex-direction: column; gap: 0.5rem; }
  .detail-row { display: grid; grid-template-columns: 130px 1fr; gap: 0.75rem; font-size: 13px; padding: 0.375rem 0; border-bottom: 0.5px solid var(--border-soft); }
  .detail-label { color: var(--fg-muted); font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; }
  .approval-footer {
    padding: 1rem 1.25rem; border-top: 0.5px solid var(--border);
    background: var(--bg-alt); display: flex; justify-content: space-between; align-items: center;
  }
  .approval-impact { font-size: 11px; color: var(--fg-muted); }

  .gate-step {
    padding: 6px 12px; font-size: 11px; border-radius: 2px; font-weight: 500;
    display: inline-flex; align-items: center; gap: 0.25rem;
  }
  .gate-step.pass { border: 0.5px solid var(--green); background: rgba(74,122,82,0.1); color: var(--green); }
  .gate-step.fail { border: 0.5px solid var(--red); background: rgba(168,74,74,0.1); color: var(--red); }
  .gate-step.pending { border: 0.5px solid var(--border); color: var(--fg-soft); }

  .form-input {
    width: 100%; padding: 0.5rem 0.75rem; border: 0.5px solid var(--border);
    background: #FAFAF8; border-radius: 2px; font-family: inherit; font-size: 14px; color: var(--fg);
  }
  .form-input:focus { outline: none; border-color: var(--brand); }
  .form-label {
    display: block; font-size: 10px; text-transform: uppercase;
    letter-spacing: 0.15em; color: var(--fg-muted); margin-bottom: 0.5rem;
  }

  .page { display: none; }
  .page.active { display: block; }

  .demo-badge {
    position: fixed; bottom: 1rem; right: 1rem; z-index: 200;
    background: #0B0B0B; color: #FFFFFF;
    display: flex; align-items: center; gap: 0.5rem;
    font-family: 'Archivo', sans-serif; font-size: 10px; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase;
    padding: 0.45rem 0.8rem; border-radius: 2px; pointer-events: none;
  }
  .demo-dot { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; }

  @media (max-width: 1024px) {
    .portal { grid-template-columns: 200px 1fr; }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .content-grid { grid-template-columns: 1fr; }
    .matrix-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 720px) {
    .portal { grid-template-columns: 1fr; }
    .sidebar { display: none; }
    .main { padding: 1rem; }
    .stats-grid { grid-template-columns: 1fr; }
    .matrix-grid { grid-template-columns: 1fr; }
    .timeline-item { grid-template-columns: 1fr; gap: 0.5rem; }
    .lock-card { grid-template-columns: 1fr; gap: 1rem; }
    .login-view { grid-template-columns: 1fr; }
  }
</style>
</head>
<body>

<div class="demo-badge"><span class="demo-dot"></span>Preview v02 · Con Fotos</div>

<!-- LOGIN VIEW -->
<div class="login-view" id="view-login">
  <div style="background: var(--brand); display: flex; flex-direction: column; justify-content: space-between; padding: 3rem; position: relative; overflow: hidden;">
    <div style="position: absolute; inset: 0; opacity: 0.08; background-image: linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 40px 40px;"></div>
    <div style="position: relative; z-index: 1;">
      <div style="font-family: 'Archivo', sans-serif; font-weight: 300; font-size: 3rem; line-height: 1; color: #FFFFFF; letter-spacing: -0.02em;">UMAIN</div>
      <div style="font-family: 'Archivo', sans-serif; font-weight: 500; font-size: 0.55rem; letter-spacing: 0.45em; text-transform: uppercase; color: rgba(255,255,255,0.5); margin-top: 0.5rem;">identidad real, licenciada</div>
    </div>
    <div style="position: relative; z-index: 1;">
      <div style="font-family: 'Archivo', sans-serif; font-size: 1.875rem; font-weight: 300; color: #FFFFFF; line-height: 1.2; margin-bottom: 1rem;">"Cada uso de tu identidad digital, con tu consentimiento explícito."</div>
      <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(255,255,255,0.4);">Rights Engine · Trazabilidad C2PA · Split 65/35</div>
    </div>
  </div>
  <div style="background: var(--bg); display: flex; flex-direction: column; justify-content: center; padding: 3rem 3.5rem; border-left: 0.5px solid var(--border);">
    <h1 style="font-family: 'Archivo', sans-serif; font-size: 2rem; font-weight: 300; letter-spacing: -0.02em; margin-bottom: 0.5rem;">Ingresá al portal</h1>
    <p style="font-size: 13px; color: var(--fg-muted); margin-bottom: 2.5rem;">Accedé a tu dashboard de talento, matriz de consentimiento y aprobaciones pendientes.</p>
    <form onsubmit="event.preventDefault(); showView('view-portal');">
      <div style="margin-bottom: 1.25rem;">
        <label class="form-label">Email</label>
        <input class="form-input" type="email" placeholder="usuario@umain.io" value="admin@umain.io">
      </div>
      <div style="margin-bottom: 1.25rem;">
        <label class="form-label">Contraseña</label>
        <input class="form-input" type="password" placeholder="••••••••" value="demo2026">
      </div>
      <button type="submit" class="btn primary" style="width: 100%; margin-top: 0.5rem;">Ingresar</button>
    </form>
    <div style="margin-top: 1.75rem; padding-top: 1.75rem; border-top: 0.5px solid var(--border); text-align: center;">
      <p style="font-size: 11px; color: var(--fg-soft); letter-spacing: 0.05em;">Demo: admin@umain.io / demo2026</p>
    </div>
    <a onclick="showView('view-portal')" style="margin-top: 2rem; font-size: 11px; color: var(--fg-soft); cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem;">← Ir al dashboard</a>
  </div>
</div>

<!-- PORTAL VIEW -->
<div class="portal" id="view-portal">
  <!-- SIDEBAR -->
  <aside class="sidebar">
    <div class="logo">
      <div class="logo-word">UMAIN</div>
      <div class="logo-sub">identidad real, licenciada</div>
    </div>
    
    <!-- User Card -->
    <div style="padding: 1.5rem; border-bottom: 0.5px solid var(--border); display: flex; align-items: center; gap: 0.75rem;">
      <div style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; border: 0.5px solid var(--border);">
        <img src="data:image/jpeg;base64,${PORTRAIT}" alt="Manu Jantus" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
      <div>
        <div style="font-family: 'Archivo', sans-serif; font-size: 14px; color: var(--fg);">Manu Jantus</div>
        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: var(--fg-soft);">Talento · Tier A</div>
      </div>
    </div>
    
    <nav>
      <div class="nav-section">General</div>
      <a class="nav-item active" data-page="dashboard" onclick="showPage('dashboard')">◈ Panel</a>
      <a class="nav-item" data-page="profile" onclick="showPage('profile')">◈ Mi perfil</a>
      
      <div class="nav-section">Mi Identidad</div>
      <a class="nav-item" data-page="matrix" onclick="showPage('matrix')">◈ Consentimiento</a>
      <a class="nav-item" data-page="usage" onclick="showPage('usage')">◈ Registro de usos</a>
      
      <div class="nav-section">Campañas</div>
      <a class="nav-item" data-page="approvals" onclick="showPage('approvals')">◈ Aprobaciones <span class="nav-badge">3</span></a>
      
      <div class="nav-section">Derechos</div>
      <a class="nav-item" data-page="locks" onclick="showPage('locks')">◈ Exclusividades</a>
      <a class="nav-item" data-page="contracts" onclick="showPage('contracts')">◈ Contratos</a>
      
      <div class="nav-section">Sistema</div>
      <a class="nav-item" data-page="gate" onclick="showPage('gate')">◈ Consent Gate</a>
    </nav>
    <div class="sidebar-footer">UMAIN v0.3.0<br><span style="font-size:9px;letter-spacing:0.05em;">Rights Engine + Higgsfield</span></div>
  </aside>

  <!-- MAIN -->
  <main class="main">

    <!-- ==================== PROFILE ==================== -->
    <div class="page" id="page-profile">
      <div class="page-header">
        <div>
          <div class="page-label">Perfil</div>
          <h1 class="page-title">Tu <em>identidad</em> en UMAIN.</h1>
          <p class="page-description">Información personal, representación, y metadata de tu modelo digital.</p>
        </div>
        <div class="page-actions">
          <button class="btn ghost small">Cancelar</button>
          <button class="btn primary small">Guardar cambios</button>
        </div>
      </div>

      <div class="content-grid">
        <div>
          <div class="card">
            <div class="card-header"><h2 class="card-title">Información personal</h2></div>
            <div style="display: grid; grid-template-columns: 200px 1fr; gap: 1.5rem; padding: 1.25rem; border-bottom: 0.5px solid var(--border-soft);">
              <div style="font-size: 12px; color: var(--fg-muted); text-transform: uppercase; letter-spacing: 0.1em;">Nombre completo</div>
              <div>Manuela Jantus</div>
            </div>
            <div style="display: grid; grid-template-columns: 200px 1fr; gap: 1.5rem; padding: 1.25rem; border-bottom: 0.5px solid var(--border-soft);">
              <div style="font-size: 12px; color: var(--fg-muted); text-transform: uppercase; letter-spacing: 0.1em;">Nombre profesional</div>
              <div>Manu Jantus</div>
            </div>
            <div style="display: grid; grid-template-columns: 200px 1fr; gap: 1.5rem; padding: 1.25rem; border-bottom: 0.5px solid var(--border-soft);">
              <div style="font-size: 12px; color: var(--fg-muted); text-transform: uppercase; letter-spacing: 0.1em;">Fecha de nacimiento</div>
              <div>22 de febrero de 1986</div>
            </div>
            <div style="display: grid; grid-template-columns: 200px 1fr; gap: 1.5rem; padding: 1.25rem; border-bottom: 0.5px solid var(--border-soft);">
              <div style="font-size: 12px; color: var(--fg-muted); text-transform: uppercase; letter-spacing: 0.1em;">Nacionalidad</div>
              <div>🇦🇷 Argentina</div>
            </div>
            <div style="display: grid; grid-template-columns: 200px 1fr; gap: 1.5rem; padding: 1.25rem; border-bottom: 0.5px solid var(--border-soft);">
              <div style="font-size: 12px; color: var(--fg-muted); text-transform: uppercase; letter-spacing: 0.1em;">Domicilio</div>
              <div>Buenos Aires, Argentina</div>
            </div>
            <div style="display: grid; grid-template-columns: 200px 1fr; gap: 1.5rem; padding: 1.25rem;">
              <div style="font-size: 12px; color: var(--fg-muted); text-transform: uppercase; letter-spacing: 0.1em;">Idiomas</div>
              <div>Español (nativo) · Inglés (fluido) · Portugués (intermedio)</div>
            </div>
          </div>

          <div class="card">
            <div class="card-header"><h2 class="card-title">Contacto</h2></div>
            <div style="display: grid; grid-template-columns: 200px 1fr; gap: 1.5rem; padding: 1.25rem; border-bottom: 0.5px solid var(--border-soft);">
              <div style="font-size: 12px; color: var(--fg-muted); text-transform: uppercase; letter-spacing: 0.1em;">Email</div>
              <div>manu@manujantus.com</div>
            </div>
            <div style="display: grid; grid-template-columns: 200px 1fr; gap: 1.5rem; padding: 1.25rem; border-bottom: 0.5px solid var(--border-soft);">
              <div style="font-size: 12px; color: var(--fg-muted); text-transform: uppercase; letter-spacing: 0.1em;">Teléfono</div>
              <div>+54 11 5555-1234 (cifrado)</div>
            </div>
            <div style="display: grid; grid-template-columns: 200px 1fr; gap: 1.5rem; padding: 1.25rem;">
              <div style="font-size: 12px; color: var(--fg-muted); text-transform: uppercase; letter-spacing: 0.1em;">Contacto de emergencia</div>
              <div>Representante · Casting Club</div>
            </div>
          </div>

          <div class="card">
            <div class="card-header"><h2 class="card-title">Representación</h2></div>
            <div style="display: grid; grid-template-columns: 200px 1fr; gap: 1.5rem; padding: 1.25rem; border-bottom: 0.5px solid var(--border-soft);">
              <div style="font-size: 12px; color: var(--fg-muted); text-transform: uppercase; letter-spacing: 0.1em;">Agencia</div>
              <div>Casting Club (Buenos Aires)</div>
            </div>
            <div style="display: grid; grid-template-columns: 200px 1fr; gap: 1.5rem; padding: 1.25rem; border-bottom: 0.5px solid var(--border-soft);">
              <div style="font-size: 12px; color: var(--fg-muted); text-transform: uppercase; letter-spacing: 0.1em;">Representante principal</div>
              <div>Federico López</div>
            </div>
            <div style="display: grid; grid-template-columns: 200px 1fr; gap: 1.5rem; padding: 1.25rem; border-bottom: 0.5px solid var(--border-soft);">
              <div style="font-size: 12px; color: var(--fg-muted); text-transform: uppercase; letter-spacing: 0.1em;">Tipo de contrato</div>
              <div>Tripartito: UMAIN × Casting Club × Talento</div>
            </div>
            <div style="display: grid; grid-template-columns: 200px 1fr; gap: 1.5rem; padding: 1.25rem;">
              <div style="font-size: 12px; color: var(--fg-muted); text-transform: uppercase; letter-spacing: 0.1em;">Exclusividad</div>
              <div>Solo derechos digitales de IA · El trabajo tradicional no se toca</div>
            </div>
          </div>
        </div>

        <div>
          <div class="card">
            <div class="card-header"><h2 class="card-title">Modelo digital</h2></div>
            <div style="padding: 1.25rem;">
              <!-- Main Portrait -->
              <div style="aspect-ratio: 3/4; background: var(--bg-alt); border-radius: 2px; margin-bottom: 1rem; overflow: hidden; border: 0.5px solid var(--border);">
                <img src="data:image/jpeg;base64,${PORTRAIT}" alt="Manu Jantus" style="width: 100%; height: 100%; object-fit: cover; display: block;">
              </div>

              <!-- Reference Photos -->
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--brand); margin-bottom: 0.75rem;">Fotos de referencia</div>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin-bottom: 1rem;">
                <div style="aspect-ratio: 1; border-radius: 2px; overflow: hidden; border: 0.5px solid var(--border);">
                  <img src="data:image/jpeg;base64,${LIFESTYLE}" alt="Lifestyle" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div style="aspect-ratio: 1; border-radius: 2px; overflow: hidden; border: 0.5px solid var(--border);">
                  <img src="data:image/jpeg;base64,${CAMPAIGN}" alt="Campaign" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div style="aspect-ratio: 1; border-radius: 2px; overflow: hidden; border: 0.5px solid var(--border);">
                  <img src="data:image/jpeg;base64,${PROFILE}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
              </div>
              <div style="font-size: 10px; color: var(--fg-soft); margin-bottom: 1rem;">48 fotos · 2.4 GB · Última actualización: Mar 2026</div>

              <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 12px;">
                <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 0.5px solid var(--border-soft);">
                  <span style="color: var(--fg-muted);">Tipo de modelo</span>
                  <span>Flux LoRA + MetaHuman</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 0.5px solid var(--border-soft);">
                  <span style="color: var(--fg-muted);">Dataset de entrenamiento</span>
                  <span>48 fotos · 2.4 GB</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 0.5px solid var(--border-soft);">
                  <span style="color: var(--fg-muted);">Último entrenamiento</span>
                  <span>Mar 2026</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 0.5px solid var(--border-soft);">
                  <span style="color: var(--fg-muted);">Versión</span>
                  <span>v2.1</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 0.5rem 0;">
                  <span style="color: var(--fg-muted);">Almacenamiento</span>
                  <span>AWS S3 · cifrado</span>
                </div>
              </div>

              <button class="btn ghost small" style="width: 100%; margin-top: 1rem;">Solicitar reentrenamiento</button>
              <button class="btn danger small" style="width: 100%; margin-top: 0.5rem;">Solicitar supresión (Ley 25.326)</button>
            </div>
          </div>

          <div class="card">
            <div class="card-header"><h2 class="card-title">Tier y compensación</h2></div>
            <div style="padding: 1.25rem; font-size: 13px;">
              <div style="text-align: center; margin-bottom: 1rem;">
                <div style="font-family: 'Archivo', sans-serif; font-size: 3rem; font-weight: 300; color: var(--brand); line-height: 1;">A</div>
                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: var(--fg-muted); margin-top: 0.25rem;">Tier</div>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 0.5px solid var(--border-soft);">
                <span style="color: var(--fg-muted);">Split de regalías</span>
                <span>65 / 35</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 0.5px solid var(--border-soft);">
                <span style="color: var(--fg-muted);">Mínimo garantizado 2026</span>
                <span>$18,000</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 0.5rem 0;">
                <span style="color: var(--fg-muted);">Reportes</span>
                <span>Trimestrales</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== DASHBOARD ==================== -->
    <div class="page active" id="page-dashboard">
      <div class="page-header">
        <div>
          <div class="page-label">Panel</div>
          <h1 class="page-title">Hola <em>Manu</em>, acá está tu semana.</h1>
        </div>
        <div class="page-actions"><button class="btn primary small">Nueva solicitud</button></div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Proyectos activos</div>
          <div class="stat-value">4</div>
          <div class="stat-detail">2 al aire, 2 en producción</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Regalías Q4</div>
          <div class="stat-value">$10,712</div>
          <div class="stat-detail">vs Q3 <span class="stat-trend">↑ 18%</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Matriz completa</div>
          <div class="stat-value">72%</div>
          <div class="stat-detail">18 categorías sin evaluar</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Exclusividades activas</div>
          <div class="stat-value">2</div>
          <div class="stat-detail">L'Oréal expira Jun 2026</div>
        </div>
      </div>

      <div class="content-grid">
        <div>
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Actividad reciente</h2>
              <a class="view-all">Ver todo</a>
            </div>
            <div class="activity-item">
              <div class="activity-dot pending"></div>
              <div class="activity-content">
                <div class="activity-title">Nuevo proyecto esperando aprobación: Campaña Samsung Galaxy Z Flip</div>
                <div class="activity-meta">IAB-575 Smartphones · Territorio: LATAM · Fecha límite: 28 abr</div>
              </div>
              <a class="activity-action" onclick="showPage('approvals')">Revisar</a>
            </div>
            <div class="activity-item">
              <div class="activity-dot completed"></div>
              <div class="activity-content">
                <div class="activity-title">L'Oréal Paris: Campaña 'Revitalift' entregada</div>
                <div class="activity-meta">Uso activo hasta 15 Jun 2026 · Content Credentials incorporados</div>
              </div>
              <a class="activity-action" onclick="showPage('usage')">Ver</a>
            </div>
            <div class="activity-item">
              <div class="activity-dot alert"></div>
              <div class="activity-content">
                <div class="activity-title">Exclusividad: categoría Pepsi se libera en 14 días</div>
                <div class="activity-meta">Cooldown de bebidas termina 24 Abr · IAB-1104 disponible desde 8 May</div>
              </div>
              <a class="activity-action" onclick="showPage('locks')">Detalles</a>
            </div>
            <div class="activity-item">
              <div class="activity-dot completed"></div>
              <div class="activity-content">
                <div class="activity-title">Reporte de regalías Q4 2025 emitido</div>
                <div class="activity-meta">Total ganado: $10,712 · 7 usos activos</div>
              </div>
              <a class="activity-action">Reporte</a>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Usos recientes</h2>
              <a class="view-all" onclick="showPage('usage')">Registro completo</a>
            </div>
            <div class="timeline-item">
              <div class="timeline-date">Abr 2026</div>
              <div class="timeline-thumb"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="9" rx="5" ry="6" stroke="currentColor" stroke-width="0.8"/><path d="M3 24 Q 3 15 12 15 Q 21 15 21 24" stroke="currentColor" stroke-width="0.8" fill="none"/></svg></div>
              <div class="timeline-info"><h4>L'Oréal Paris · Revitalift</h4><div class="meta">IAB-186 Cuidado capilar · Video corto</div></div>
              <div class="timeline-territory">🇦🇷 🇨🇱 🇺🇾</div>
              <div class="timeline-status"><span class="badge active">Activo</span></div>
            </div>
            <div class="timeline-item">
              <div class="timeline-date">Feb 2026</div>
              <div class="timeline-thumb"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="9" rx="5" ry="6" stroke="currentColor" stroke-width="0.8"/><path d="M3 24 Q 3 15 12 15 Q 21 15 21 24" stroke="currentColor" stroke-width="0.8" fill="none"/></svg></div>
              <div class="timeline-info"><h4>Pepsi · Summer refresh</h4><div class="meta">IAB-1104 Bebidas · Fotos</div></div>
              <div class="timeline-territory">🇦🇷 🇧🇷</div>
              <div class="timeline-status"><span class="badge locked">Bloqueado</span></div>
            </div>
            <div class="timeline-item">
              <div class="timeline-date">Dic 2025</div>
              <div class="timeline-thumb"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="9" rx="5" ry="6" stroke="currentColor" stroke-width="0.8"/><path d="M3 24 Q 3 15 12 15 Q 21 15 21 24" stroke="currentColor" stroke-width="0.8" fill="none"/></svg></div>
              <div class="timeline-info"><h4>Zara · Holiday collection</h4><div class="meta">IAB-225 Moda femenina · Editorial</div></div>
              <div class="timeline-territory">🌍 Global</div>
              <div class="timeline-status"><span class="badge expired">Vencido</span></div>
            </div>
          </div>
        </div>

        <div>
          <div class="card">
            <div class="card-header"><h2 class="card-title">Consentimiento rápido</h2></div>
            <div style="padding: 1rem 1.25rem;">
              <div style="margin-bottom: 1rem;">
                <div style="font-size: 11px; color: var(--fg-muted); margin-bottom: 0.5rem;">Completitud de la matriz</div>
                <div class="progress-bar"><div class="progress-fill" style="width: 72%;"></div></div>
                <div style="font-size: 12px; color: var(--fg); margin-top: 0.5rem;">72% · 47 de 65 evaluadas</div>
              </div>
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: var(--brand); margin: 1.25rem 0 0.75rem;">Categorías más activas</div>
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.75rem; background: var(--bg-alt); border-radius: 2px; font-size: 12px;"><span>Moda y estilo</span><span class="legend-dot allowed"></span></div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.75rem; background: var(--bg-alt); border-radius: 2px; font-size: 12px;"><span>Belleza y cosmética</span><span class="legend-dot allowed"></span></div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.75rem; background: var(--bg-alt); border-radius: 2px; font-size: 12px;"><span>Alimentos y bebidas</span><span class="legend-dot case-by-case"></span></div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.75rem; background: var(--bg-alt); border-radius: 2px; font-size: 12px;"><span>Alcohol</span><span class="legend-dot prohibited"></span></div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.75rem; background: var(--bg-alt); border-radius: 2px; font-size: 12px;"><span>Tabaco</span><span class="legend-dot prohibited"></span></div>
              </div>
              <button class="btn ghost small" style="width: 100%; margin-top: 1.25rem; text-align: center;" onclick="showPage('matrix')">Editar la matriz →</button>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Exclusividades activas</h2>
              <a class="view-all" onclick="showPage('locks')">Ver todo</a>
            </div>
            <div style="padding: 1rem 1.25rem; font-size: 13px;">
              <div style="padding: 0.75rem; background: var(--bg-alt); border-radius: 2px; margin-bottom: 0.75rem; border: 0.5px solid var(--border);">
                <div style="font-family: 'Archivo', sans-serif; font-weight: 450; margin-bottom: 0.25rem;">L'Oréal Paris</div>
                <div style="font-size: 11px; color: var(--fg-muted);">Cuidado capilar (IAB-186)</div>
                <div style="font-size: 11px; color: var(--fg-soft); margin-top: 0.25rem;">Hasta el 15 jun 2026 · quedan 54 días</div>
              </div>
              <div style="padding: 0.75rem; background: var(--bg-alt); border-radius: 2px; border: 0.5px solid var(--border);">
                <div style="font-family: 'Archivo', sans-serif; font-weight: 450; margin-bottom: 0.25rem;">Pepsi</div>
                <div style="font-size: 11px; color: var(--fg-muted);">Bebidas (IAB-1104)</div>
                <div style="font-size: 11px; color: var(--fg-soft); margin-top: 0.25rem;">Hasta ago 2026 · Coca-Cola bloqueada</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== APPROVALS ==================== -->
    <div class="page" id="page-approvals">
      <div class="page-header">
        <div>
          <div class="page-label">Aprobaciones pendientes</div>
          <h1 class="page-title"><em>3 proyectos</em> esperando tu revisión.</h1>
          <p class="page-description">Revisá los detalles, visualizá el output propuesto, y aprobá o rechazá.</p>
        </div>
        <div class="page-actions"><button class="btn ghost small">Filtro: Todos</button></div>
      </div>

      <div class="approval-card">
        <div class="approval-header">
          <div>
            <div class="approval-brand">Samsung Galaxy Z Flip 7</div>
            <div class="approval-cat"><span class="cat-tag">IAB-575</span><span>Smartphones · Video · LATAM</span></div>
          </div>
          <div class="approval-deadline">Fecha límite<strong>28 abr</strong></div>
        </div>
        <div class="approval-body">
          <div class="approval-preview">
            <img src="data:image/jpeg;base64,${CAMPAIGN}" alt="Samsung Campaign" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div class="approval-details">
            <div class="detail-row"><div class="detail-label">Cliente</div><div>Samsung Electronics · BBDO Buenos Aires</div></div>
            <div class="detail-row"><div class="detail-label">Período</div><div>15 may - 15 nov 2026 (6 meses)</div></div>
            <div class="detail-row"><div class="detail-label">Territorio</div><div>🇦🇷 🇧🇷 🇲🇽 🇨🇴 🇨🇱</div></div>
            <div class="detail-row"><div class="detail-label">Output</div><div>Spot 15s · 5 fotos · Digital + vía pública</div></div>
            <div class="detail-row"><div class="detail-label">Fee</div><div>$8,500 (tu parte: $5,525)</div></div>
          </div>
        </div>
        <div class="approval-footer">
          <div class="approval-impact">⚠ Aprobar bloquea Apple, Xiaomi y Motorola hasta nov 2027</div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn ghost small">Pedir cambios</button>
            <button class="btn danger small">Rechazar</button>
            <button class="btn primary small">Aprobar y firmar</button>
          </div>
        </div>
      </div>

      <div class="approval-card">
        <div class="approval-header">
          <div>
            <div class="approval-brand">Natura Beauty Essentials</div>
            <div class="approval-cat"><span class="cat-tag">IAB-204</span><span>Cosmética · Editorial · Brasil</span></div>
          </div>
          <div class="approval-deadline">Fecha límite<strong>3 may</strong></div>
        </div>
        <div class="approval-body">
          <div class="approval-preview">
            <img src="data:image/jpeg;base64,${LIFESTYLE}" alt="Natura Campaign" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div class="approval-details">
            <div class="detail-row"><div class="detail-label">Cliente</div><div>Natura &Co · Directo</div></div>
            <div class="detail-row"><div class="detail-label">Período</div><div>1 jun - 1 dic 2026 (6 meses)</div></div>
            <div class="detail-row"><div class="detail-label">Territorio</div><div>🇧🇷 Solo Brasil</div></div>
            <div class="detail-row"><div class="detail-label">Output</div><div>12 fotos · Editorial · Digital + gráfica</div></div>
            <div class="detail-row"><div class="detail-label">Fee</div><div>$8,200 (tu parte: $5,330)</div></div>
          </div>
        </div>
        <div class="approval-footer">
          <div class="approval-impact">✓ Sin conflictos competitivos detectados</div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn ghost small">Pedir cambios</button>
            <button class="btn danger small">Rechazar</button>
            <button class="btn primary small">Aprobar y firmar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== MATRIX ==================== -->
    <div class="page" id="page-matrix">
      <div class="page-header">
        <div>
          <div class="page-label">Matriz de consentimiento</div>
          <h1 class="page-title">Tus preferencias por <em>categoría</em>.</h1>
          <p class="page-description">Definí con qué categorías de producto querés trabajar.</p>
        </div>
        <div class="page-actions">
          <button class="btn ghost small">Wizard</button>
          <button class="btn primary small">Guardar y firmar</button>
        </div>
      </div>
      <div class="matrix-header">
        <div style="flex: 1;">
          <div style="font-size: 11px; color: var(--fg-muted); margin-bottom: 0.5rem;">Completitud</div>
          <div class="progress-bar"><div class="progress-fill" style="width: 72%;"></div></div>
          <div style="font-size: 12px; color: var(--fg); margin-top: 0.5rem;">47 de 65 · 18 sin definir</div>
        </div>
        <div style="display: flex; gap: 0.5rem; margin-left: 2rem;">
          <button class="filter-btn active">Todas</button>
          <button class="filter-btn">Autorizadas</button>
          <button class="filter-btn">Prohibidas</button>
        </div>
      </div>
      <div class="matrix-legend">
        <div class="legend-item"><span class="legend-dot allowed"></span> Autorizado</div>
        <div class="legend-item"><span class="legend-dot case-by-case"></span> Caso por caso</div>
        <div class="legend-item"><span class="legend-dot prohibited"></span> Prohibido</div>
      </div>
      <div class="matrix-grid">
        <div class="matrix-cat"><div class="cat-state allowed"></div><div class="cat-code">IAB-16</div><div class="cat-name">Moda y estilo</div><div class="cat-desc">Indumentaria, accesorios, editorial.</div></div>
        <div class="matrix-cat"><div class="cat-state allowed"></div><div class="cat-code">IAB-204</div><div class="cat-name">Belleza y cosmética</div><div class="cat-desc">Maquillaje, skincare, fragancias.</div></div>
        <div class="matrix-cat"><div class="cat-state case-by-case"></div><div class="cat-code">IAB-9</div><div class="cat-name">Alimentos</div><div class="cat-desc">Alimentos y bebidas sin alcohol.</div></div>
        <div class="matrix-cat"><div class="cat-state prohibited"></div><div class="cat-code">IAB-430</div><div class="cat-name">Alcohol</div><div class="cat-desc">Cerveza, vino, destilados.</div></div>
        <div class="matrix-cat"><div class="cat-state prohibited"></div><div class="cat-code">GARM-H8</div><div class="cat-name">Tabaco</div><div class="cat-desc">Cigarrillos, vapeo.</div></div>
        <div class="matrix-cat"><div class="cat-state unset"></div><div class="cat-code">IAB-4</div><div class="cat-name">Empleo</div><div class="cat-desc">Plataformas de empleo.</div></div>
      </div>
    </div>

    <!-- ==================== USAGE ==================== -->
    <div class="page" id="page-usage">
      <div class="page-header">
        <div>
          <div class="page-label">Registro de usos</div>
          <h1 class="page-title">Cada <em>uso</em>, registrado.</h1>
        </div>
      </div>
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-label">Usos totales</div><div class="stat-value">23</div></div>
        <div class="stat-card"><div class="stat-label">Activos</div><div class="stat-value">7</div></div>
        <div class="stat-card"><div class="stat-label">Ingresos</div><div class="stat-value">$32,080</div></div>
        <div class="stat-card"><div class="stat-label">Promedio</div><div class="stat-value">$1,395</div></div>
      </div>
      <div class="card">
        <div class="card-header"><h2 class="card-title">Usos registrados</h2></div>
        <div class="timeline-item">
          <div class="timeline-date">Abr 2026</div>
          <div class="timeline-thumb"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="9" rx="5" ry="6" stroke="currentColor" stroke-width="0.8"/><path d="M3 24 Q 3 15 12 15 Q 21 15 21 24" stroke="currentColor" stroke-width="0.8" fill="none"/></svg></div>
          <div class="timeline-info"><h4>L'Oréal · Revitalift</h4><div class="meta">$2,100</div></div>
          <div class="timeline-territory">🇦🇷 🇨🇱 🇺🇾</div>
          <div class="timeline-status"><span class="badge active">Activo</span></div>
        </div>
        <div class="timeline-item">
          <div class="timeline-date">Feb 2026</div>
          <div class="timeline-thumb"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="9" rx="5" ry="6" stroke="currentColor" stroke-width="0.8"/><path d="M3 24 Q 3 15 12 15 Q 21 15 21 24" stroke="currentColor" stroke-width="0.8" fill="none"/></svg></div>
          <div class="timeline-info"><h4>Pepsi · Summer</h4><div class="meta">$3,200</div></div>
          <div class="timeline-territory">🇦🇷 🇧🇷</div>
          <div class="timeline-status"><span class="badge locked">Bloqueado</span></div>
        </div>
      </div>
    </div>

    <!-- ==================== LOCKS ==================== -->
    <div class="page" id="page-locks">
      <div class="page-header">
        <div>
          <div class="page-label">Exclusividades</div>
          <h1 class="page-title">Tus ventanas <em>competitivas</em>.</h1>
        </div>
      </div>
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-label">Activas</div><div class="stat-value">2</div></div>
        <div class="stat-card"><div class="stat-label">Próxima liberación</div><div class="stat-value">8 may</div></div>
        <div class="stat-card"><div class="stat-label">Bloqueadas</div><div class="stat-value">11</div></div>
        <div class="stat-card"><div class="stat-label">Protegidos</div><div class="stat-value">$8,060</div></div>
      </div>
      <div class="lock-card">
        <div>
          <div class="lock-brand">L'Oréal Paris</div>
          <div class="lock-cat"><span class="cat-tag">IAB-186</span><span>Cuidado capilar</span></div>
          <div class="lock-comp">Bloquea: Pantene, Dove Hair, TRESemmé</div>
        </div>
        <div class="lock-dates">
          <div style="font-size: 10px; text-transform: uppercase; color: var(--fg-soft);">Vence</div>
          <strong>15 jun 2026</strong>
          <div style="font-size: 11px; color: var(--fg-muted); margin-top: 0.25rem;">54 días</div>
        </div>
        <div class="lock-progress">
          <div class="lock-progress-label">65% transcurrido</div>
          <div class="progress-bar"><div class="progress-fill" style="width: 65%;"></div></div>
        </div>
      </div>
      <div class="lock-card">
        <div>
          <div class="lock-brand">Pepsi</div>
          <div class="lock-cat"><span class="cat-tag">IAB-1104</span><span>Bebidas</span></div>
          <div class="lock-comp">Bloquea: Coca-Cola, Fanta, Sprite</div>
        </div>
        <div class="lock-dates">
          <div style="font-size: 10px; text-transform: uppercase; color: var(--fg-soft);">Vence</div>
          <strong>30 ago 2026</strong>
          <div style="font-size: 11px; color: var(--fg-muted); margin-top: 0.25rem;">130 días</div>
        </div>
        <div class="lock-progress">
          <div class="lock-progress-label">32% transcurrido</div>
          <div class="progress-bar"><div class="progress-fill" style="width: 32%;"></div></div>
        </div>
      </div>
    </div>

    <!-- ==================== CONTRACTS ==================== -->
    <div class="page" id="page-contracts">
      <div class="page-header">
        <div>
          <div class="page-label">Contratos</div>
          <h1 class="page-title">Tu biblioteca <em>legal</em>.</h1>
        </div>
      </div>
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: var(--brand); margin: 0 0 1rem;">Acuerdos marco</div>
      <div class="contract-item">
        <div class="contract-icon"><svg width="20" height="20" viewBox="0 0 16 16" fill="none"><path d="M3 1 L13 1 L13 15 L3 15 Z" stroke="currentColor" stroke-width="1" fill="none"/></svg></div>
        <div><div class="contract-name">UMAIN × Casting Club × Manu Jantus</div><div class="contract-meta">Tripartito · 3 años · Firmado 14 may 2025</div></div>
        <div style="font-size: 11px;"><div style="color: var(--green);">✓ Vigente</div><div style="color: var(--fg-muted);">Vence may 2028</div></div>
        <div><button class="btn ghost small">Ver</button></div>
      </div>
      <div class="contract-item">
        <div class="contract-icon"><svg width="20" height="20" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="14" height="14" stroke="currentColor" stroke-width="1"/></svg></div>
        <div><div class="contract-name">Anexo I · Matriz de consentimiento (v2)</div><div class="contract-meta">Actualizado 18 feb 2026 · 47 categorías</div></div>
        <div style="font-size: 11px;"><div style="color: var(--green);">✓ Vigente</div></div>
        <div><button class="btn ghost small">Ver</button></div>
      </div>
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: var(--brand); margin: 2rem 0 1rem;">Consentimientos</div>
      <div class="contract-item">
        <div class="contract-icon"><svg width="20" height="20" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" stroke-width="1"/><path d="M2 15 Q 2 9 8 9 Q 14 9 14 15" stroke="currentColor" stroke-width="1" fill="none"/></svg></div>
        <div><div class="contract-name">L'Oréal Paris · Revitalift</div><div class="contract-meta">IAB-186 · LATAM · 28 mar 2026</div></div>
        <div style="font-size: 11px;"><div style="color: var(--green);">✓ Firmado</div></div>
        <div><button class="btn ghost small">Ver</button></div>
      </div>
    </div>

    <!-- ==================== CONSENT GATE ==================== -->
    <div class="page" id="page-gate">
      <div class="page-header">
        <div>
          <div class="page-label">Compuerta de Consentimiento</div>
          <h1 class="page-title">Rights Engine <em>v2</em></h1>
        </div>
      </div>
      <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; justify-content: center; padding: 1rem; background: #FAFAF8; border: 0.5px solid var(--border); border-radius: 2px; margin-bottom: 1.5rem;">
        <span class="gate-step pass">1. Token ✓</span>
        <span style="color: var(--fg-soft);">→</span>
        <span class="gate-step pass">2. Alcance ✓</span>
        <span style="color: var(--fg-soft);">→</span>
        <span class="gate-step pass">3. Matriz ✓</span>
        <span style="color: var(--fg-soft);">→</span>
        <span class="gate-step fail">4. Exclusividad ✕</span>
        <span style="color: var(--fg-soft);">→</span>
        <span class="gate-step pending">5. AuditLog</span>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
        <div class="card">
          <div class="card-header"><span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: var(--brand);">SOLICITUD</span></div>
          <div class="card-body" style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div><label class="form-label">LICENSE ID</label><input class="form-input" value="template-license-001"></div>
            <div><label class="form-label">MARCA</label><input class="form-input" placeholder="Nike, Coca-Cola..."></div>
            <button class="btn primary" style="width: 100%;">Ejecutar compuerta</button>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: var(--fg-muted);">RESULTADO</span></div>
          <div class="card-body" style="text-align: center; padding: 2rem;">
            <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">❌</div>
            <div style="font-size: 16px; font-weight: 600; color: var(--red);">RECHAZADO</div>
            <div style="font-size: 12px; color: var(--fg-muted); margin-top: 0.5rem;">Marca bloqueada por exclusividad</div>
          </div>
        </div>
      </div>
    </div>

  </main>
</div>

<script>
function showView(id) {
  document.querySelectorAll('.login-view, .portal').forEach(v => {
    v.classList.remove('active');
    v.style.display = 'none';
  });
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('active');
    el.style.display = id === 'view-login' ? 'grid' : 'grid';
  }
  window.scrollTo(0, 0);
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + pageId);
  if (page) page.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelector(`.nav-item[data-page="${pageId}"]`)?.classList.add('active');
  window.scrollTo(0, 0);
}

document.getElementById('view-portal').style.display = 'grid';
document.getElementById('view-login').style.display = 'none';
</script>

</body>
</html>
HTMLEOF

echo "Preview v02 generated with embedded images!"
