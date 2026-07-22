#!/bin/bash

# Generate base64 encoded images
PORTRAIT=$(base64 -w 0 public/images/talent-portrait.jpg)
LIFESTYLE=$(base64 -w 0 public/images/talent-lifestyle.jpg)
CAMPAIGN=$(base64 -w 0 public/images/talent-campaign.jpg)
PROFILE=$(base64 -w 0 public/images/talent-profile-side.jpg)

cat > preview_v04.html << HTMLEOF
<!DOCTYPE html>
<html lang="es-AR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>UMAIN · Preview v04 · 3 Portales</title>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62.5..125,100..900&display=swap" rel="stylesheet">
<style>
:root{--brand:#0B0B0B;--brand-deep:#000;--bg:#FFF;--bg-alt:#F6F6F5;--bg-deep:#EBEBEA;--fg:#0B0B0B;--fg-muted:#4B4B4A;--fg-soft:#7C7C7B;--border:rgba(11,11,11,.18);--border-soft:rgba(11,11,11,.08);--green:#4A7A52;--yellow:#B89A4A;--red:#A84A4A;--blue:#4A6A8A}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Archivo','Helvetica Neue',Arial,sans-serif;background:var(--bg);color:var(--fg);font-size:14px;line-height:1.5;-webkit-font-smoothing:antialiased}
em{font-style:normal;font-weight:450}
a{cursor:pointer}
.view{display:none}.view.active{display:block}

/* PORTAL SELECTOR */
.portal-selector{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:3rem;background:var(--bg-alt)}
.portal-selector-title{font-family:'Archivo',sans-serif;font-size:2.5rem;font-weight:300;letter-spacing:-.02em;margin-bottom:.5rem}
.portal-selector-sub{font-size:13px;color:var(--fg-muted);margin-bottom:3rem}
.portal-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;max-width:900px;width:100%}
.portal-card{background:var(--bg);border:.5px solid var(--border);border-radius:2px;padding:2rem;cursor:pointer;transition:all .2s;text-align:center}
.portal-card:hover{border-color:var(--brand);transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,.08)}
.portal-card-icon{width:60px;height:60px;border-radius:50%;background:var(--bg-alt);display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;font-size:24px;color:var(--brand)}
.portal-card-title{font-family:'Archivo',sans-serif;font-size:1.25rem;font-weight:450;margin-bottom:.5rem}
.portal-card-desc{font-size:12px;color:var(--fg-muted);line-height:1.5}
.portal-card-badge{display:inline-block;margin-top:1rem;padding:4px 10px;font-size:10px;text-transform:uppercase;letter-spacing:.1em;border:.5px solid var(--border);border-radius:2px;color:var(--fg-soft)}

/* COMMON */
.sidebar{background:var(--bg-alt);border-right:.5px solid var(--border);padding:2rem 0;display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto;width:240px;flex-shrink:0}
.logo{padding:0 1.5rem 2rem;border-bottom:.5px solid var(--border)}
.logo-word{font-family:'Archivo',sans-serif;font-weight:650;font-stretch:122%;font-size:1.45rem;letter-spacing:.38em;margin-right:-.38em;text-transform:uppercase;color:var(--fg);line-height:1}
.logo-sub{font-family:'Archivo',sans-serif;font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--fg-soft);margin-top:.25rem}
.user-card{padding:1.5rem;border-bottom:.5px solid var(--border);display:flex;align-items:center;gap:.75rem}
.avatar{width:40px;height:40px;border-radius:50%;overflow:hidden;flex-shrink:0;border:.5px solid var(--border)}
.avatar img{width:100%;height:100%;object-fit:cover}
.avatar-placeholder{width:40px;height:40px;border-radius:50%;background:var(--brand);color:#FFF;display:flex;align-items:center;justify-content:center;font-family:'Archivo',sans-serif;font-size:14px;font-weight:500;flex-shrink:0}
.nav-section{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--brand);padding:1rem 1.5rem .5rem}
.nav-item{display:flex;align-items:center;gap:.75rem;padding:.6rem 1.5rem;color:var(--fg-muted);text-decoration:none;font-size:13px;transition:all .15s;cursor:pointer;border-left:2px solid transparent}
.nav-item:hover{color:var(--fg);background:rgba(11,11,11,.03)}
.nav-item.active{color:var(--fg);border-left-color:var(--brand);background:rgba(11,11,11,.03);font-weight:500}
.nav-badge{margin-left:auto;background:var(--brand);color:#fff;font-size:10px;padding:2px 6px;border-radius:10px;font-weight:500}
.sidebar-footer{padding:1rem 1.5rem;border-top:.5px solid var(--border);font-size:10px;color:var(--fg-soft);letter-spacing:.1em;text-transform:uppercase;margin-top:auto}
.main{padding:2rem 2.5rem;min-height:100vh;flex:1}
.page-header{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:2rem;padding-bottom:1.5rem;border-bottom:.5px solid var(--border);gap:2rem}
.page-label{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--brand);margin-bottom:.5rem}
.page-title{font-family:'Archivo',sans-serif;font-size:2.5rem;font-weight:300;letter-spacing:-.02em}
.page-desc{font-size:13px;color:var(--fg-muted);max-width:600px;margin-top:.5rem}
.page-actions{display:flex;gap:.5rem;align-items:center}

/* BUTTONS */
.btn{padding:.5rem .875rem;font-size:11px;text-transform:uppercase;letter-spacing:.1em;border:.5px solid var(--fg);color:var(--fg);background:transparent;cursor:pointer;border-radius:2px;transition:all .15s;font-family:inherit;display:inline-flex;align-items:center;justify-content:center;gap:.5rem}
.btn:hover{background:var(--fg);color:var(--bg)}
.btn.primary{background:var(--brand);color:#fff;border-color:var(--brand)}
.btn.primary:hover{background:var(--brand-deep);border-color:var(--brand-deep)}
.btn.ghost{border-color:var(--border);color:var(--fg-muted)}
.btn.ghost:hover{color:var(--fg);border-color:var(--fg-muted);background:transparent}
.btn.small{padding:.375rem .625rem;font-size:10px}
.btn.danger{border-color:var(--red);color:var(--red)}
.btn.danger:hover{background:var(--red);color:#fff}

/* STATS */
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:2rem}
.stat-card{background:#FAFAF8;border:.5px solid var(--border);padding:1.25rem;border-radius:2px}
.stat-label{font-size:10px;text-transform:uppercase;letter-spacing:.15em;color:var(--brand);margin-bottom:.5rem}
.stat-value{font-family:'Archivo',sans-serif;font-size:2.25rem;font-weight:300;line-height:1}
.stat-detail{font-size:11px;color:var(--fg-muted);margin-top:.5rem}
.stat-trend{display:inline-block;font-size:10px;color:var(--green);margin-left:.5rem}

/* CARDS */
.card{background:#FAFAF8;border:.5px solid var(--border);border-radius:2px;margin-bottom:1.5rem;overflow:hidden}
.card-header{padding:1rem 1.25rem;border-bottom:.5px solid var(--border);display:flex;justify-content:space-between;align-items:baseline}
.card-title{font-family:'Archivo',sans-serif;font-size:1.25rem;font-weight:400}
.card-body{padding:1.25rem}
.view-all{font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--brand);text-decoration:none;cursor:pointer}
.content-grid{display:grid;grid-template-columns:2fr 1fr;gap:2rem}

/* ACTIVITY */
.activity-item{padding:1rem 1.25rem;border-bottom:.5px solid var(--border-soft);display:flex;gap:1rem;align-items:flex-start}
.activity-item:last-child{border-bottom:none}
.activity-dot{width:8px;height:8px;border-radius:50%;background:var(--brand);margin-top:6px;flex-shrink:0}
.activity-dot.pending{background:var(--yellow)}
.activity-dot.completed{background:var(--green)}
.activity-dot.alert{background:var(--red)}
.activity-content{flex:1}
.activity-title{font-size:13px;color:var(--fg);margin-bottom:.25rem}
.activity-meta{font-size:11px;color:var(--fg-soft)}
.activity-action{font-size:10px;color:var(--brand);padding:4px 10px;border:.5px solid var(--brand);border-radius:2px;text-transform:uppercase;letter-spacing:.05em;cursor:pointer;white-space:nowrap}
.activity-action:hover{background:var(--brand);color:#fff}

/* TIMELINE */
.timeline-item{display:grid;grid-template-columns:80px 48px 1fr 100px 90px;gap:1rem;padding:1rem 1.25rem;border-bottom:.5px solid var(--border-soft);align-items:center}
.timeline-item:last-child{border-bottom:none}
.timeline-date{font-size:10px;color:var(--fg-soft);text-transform:uppercase;letter-spacing:.05em}
.timeline-thumb{width:48px;height:48px;background:var(--bg-alt);border-radius:2px;display:flex;align-items:center;justify-content:center;color:var(--fg-soft)}
.timeline-info h4{font-family:'Archivo',sans-serif;font-size:14px;font-weight:400;margin-bottom:.25rem}
.timeline-info .meta{font-size:11px;color:var(--fg-muted)}
.timeline-territory{font-size:13px}
.badge{display:inline-flex;align-items:center;gap:.375rem;padding:3px 8px;font-family:'Archivo',sans-serif;font-size:10px;font-weight:500;text-transform:uppercase;letter-spacing:.1em;border-radius:2px}
.badge.active{background:rgba(74,122,82,.1);color:var(--green)}
.badge.locked{background:rgba(11,11,11,.05);color:var(--brand)}
.badge.expired{background:var(--bg-deep);color:var(--fg-soft)}
.badge.pending{background:rgba(184,154,74,.1);color:var(--yellow)}

/* PROGRESS */
.progress-bar{height:6px;background:var(--bg-deep);border-radius:3px;overflow:hidden}
.progress-fill{height:100%;border-radius:3px;background:var(--brand)}

/* FILTER */
.filter-btn{padding:6px 12px;font-size:11px;border:.5px solid var(--border);background:#FAFAF8;color:var(--fg-muted);cursor:pointer;border-radius:2px;text-transform:uppercase;letter-spacing:.05em;transition:all .15s;font-family:inherit}
.filter-btn:hover,.filter-btn.active{border-color:var(--brand);color:var(--brand)}

/* LOCK CARD */
.lock-card{background:#FAFAF8;border:.5px solid var(--border);border-left:3px solid var(--brand);border-radius:2px;padding:1.25rem;margin-bottom:1rem;display:grid;grid-template-columns:1fr 150px 180px;gap:1.5rem;align-items:center}
.lock-brand{font-family:'Archivo',sans-serif;font-size:1.25rem;font-weight:450;margin-bottom:.25rem}
.lock-cat{font-size:12px;color:var(--fg-muted);display:flex;gap:.5rem;align-items:center}
.lock-comp{font-size:11px;color:var(--fg-soft);margin-top:.5rem}
.lock-dates{font-size:11px;color:var(--fg-muted);text-align:center}
.lock-dates strong{display:block;font-family:'Archivo',sans-serif;font-size:1.125rem;font-weight:450;color:var(--fg)}
.lock-progress{display:flex;flex-direction:column;gap:.5rem;text-align:right}
.lock-progress-label{font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:var(--fg-muted)}
.cat-tag{display:inline-block;font-family:'Courier New',monospace;font-size:10px;padding:2px 6px;background:var(--bg-alt);border-radius:2px;color:var(--fg-soft)}

/* APPROVAL */
.approval-card{background:#FAFAF8;border:.5px solid var(--border);border-radius:2px;margin-bottom:1rem;overflow:hidden}
.approval-header{padding:1.25rem;display:grid;grid-template-columns:1fr auto;gap:1rem;align-items:flex-start;border-bottom:.5px solid var(--border)}
.approval-brand{font-family:'Archivo',sans-serif;font-size:1.375rem;font-weight:450;margin-bottom:.25rem}
.approval-cat{font-size:12px;color:var(--fg-muted);display:flex;align-items:center;gap:.5rem}
.approval-deadline{font-size:11px;color:var(--red);text-transform:uppercase;letter-spacing:.1em;text-align:right}
.approval-deadline strong{display:block;font-size:18px;font-family:'Archivo',sans-serif;font-weight:450;color:var(--red);margin-top:.25rem}
.approval-body{padding:1.25rem;display:grid;grid-template-columns:180px 1fr;gap:1.5rem}
.approval-preview{aspect-ratio:3/4;background:var(--bg-alt);border-radius:2px;overflow:hidden}
.approval-preview img{width:100%;height:100%;object-fit:cover}
.approval-details{display:flex;flex-direction:column;gap:.5rem}
.detail-row{display:grid;grid-template-columns:130px 1fr;gap:.75rem;font-size:13px;padding:.375rem 0;border-bottom:.5px solid var(--border-soft)}
.detail-label{color:var(--fg-muted);font-size:11px;text-transform:uppercase;letter-spacing:.1em}
.approval-footer{padding:1rem 1.25rem;border-top:.5px solid var(--border);background:var(--bg-alt);display:flex;justify-content:space-between;align-items:center}
.approval-impact{font-size:11px;color:var(--fg-muted)}

/* FORM */
.form-input{width:100%;padding:.5rem .75rem;border:.5px solid var(--border);background:#FAFAF8;border-radius:2px;font-family:inherit;font-size:14px;color:var(--fg)}
.form-input:focus{outline:none;border-color:var(--brand)}
.form-label{display:block;font-size:10px;text-transform:uppercase;letter-spacing:.15em;color:var(--fg-muted);margin-bottom:.5rem}

/* PROFILE */
.profile-grid{display:grid;grid-template-columns:200px 1fr;gap:1.5rem;padding:1.25rem;border-bottom:.5px solid var(--border-soft)}
.profile-label{font-size:12px;color:var(--fg-muted);text-transform:uppercase;letter-spacing:.1em}
.profile-value{font-size:14px}
.ref-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;margin-bottom:1rem}
.ref-thumb{aspect-ratio:1;border-radius:2px;overflow:hidden;border:.5px solid var(--border)}
.ref-thumb img{width:100%;height:100%;object-fit:cover}

/* ROSTER ITEM */
.roster-item{display:flex;align-items:center;gap:1rem;padding:.75rem;margin-bottom:.5rem;background:var(--bg-alt);border-radius:2px;border:.5px solid var(--border)}

/* TALENT CARD (Agency) */
.talent-card{background:#FAFAF8;border:.5px solid var(--border);border-radius:2px;overflow:hidden;cursor:pointer;transition:all .15s}
.talent-card:hover{border-color:var(--brand);transform:translateY(-2px)}
.talent-card-photo{aspect-ratio:3/4;background:var(--bg-alt);display:flex;align-items:center;justify-content:center;border-bottom:.5px solid var(--border)}
.talent-card-body{padding:1rem}

/* PAGES */
.page{display:none}.page.active{display:block}

/* DEMO BADGE */
.demo-badge{position:fixed;bottom:1rem;right:1rem;z-index:200;background:#0B0B0B;color:#FFF;display:flex;align-items:center;gap:.5rem;font-family:'Archivo',sans-serif;font-size:10px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;padding:.45rem .8rem;border-radius:2px;pointer-events:none}
.demo-dot{width:6px;height:6px;border-radius:50%;background:#22c55e}

/* WIZARD STEPS */
.wizard-steps{display:flex;gap:.5rem;margin-bottom:2rem}
.wizard-step{flex:1;text-align:center;padding:.5rem;border-radius:2px;font-size:11px;text-transform:uppercase;letter-spacing:.05em;transition:all .15s}
.wizard-step.active{background:var(--brand);color:#fff;font-weight:600}
.wizard-step.completed{background:rgba(74,122,82,.1);color:var(--green)}
.wizard-step.pending{background:var(--bg-alt);color:var(--fg-soft)}

/* UPLOAD ZONE */
.upload-zone{padding:2rem;border:2px dashed var(--border);border-radius:2px;text-align:center;margin-bottom:1.5rem}

@media(max-width:1024px){.stats-grid{grid-template-columns:repeat(2,1fr)}.content-grid{grid-template-columns:1fr}.portal-cards{grid-template-columns:1fr}}
@media(max-width:720px){.sidebar{display:none}.main{padding:1rem}.stats-grid{grid-template-columns:1fr}.timeline-item{grid-template-columns:1fr;gap:.5rem}.lock-card{grid-template-columns:1fr;gap:1rem}}
</style>
</head>
<body>

<div class="demo-badge"><span class="demo-dot"></span>v04 · 3 Portales</div>

<!-- ============================================================ -->
<!-- VIEW 0: PORTAL SELECTOR -->
<!-- ============================================================ -->
<div class="view active" id="view-selector">
  <div class="portal-selector">
    <div style="margin-bottom:1rem">
      <div style="font-family:'Archivo',sans-serif;font-weight:650;font-size:2rem;letter-spacing:.38em;text-transform:uppercase;color:var(--brand)">UMAIN</div>
      <div style="font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--fg-soft);margin-top:.25rem">identidad real, licenciada</div>
    </div>
    <h1 class="portal-selector-title">Seleccioná tu <em>portal</em></h1>
    <p class="portal-selector-sub">Cada rol tiene su propia vista. Elegí el portal para continuar.</p>
    
    <div class="portal-cards">
      <div class="portal-card" onclick="showView('view-talento')">
        <div class="portal-card-icon">👤</div>
        <div class="portal-card-title">Portal Talento</div>
        <div class="portal-card-desc">Gestiona tu identidad digital, matriz de consentimiento, aprobaciones y regalías.</div>
        <div class="portal-card-badge">Tier A · Manu Jantus</div>
      </div>
      
      <div class="portal-card" onclick="showView('view-castinera')">
        <div class="portal-card-icon">🎭</div>
        <div class="portal-card-title">Portal Castinera</div>
        <div class="portal-card-desc">Gestiona tu roster de talentos, crea nuevos avatares y aprueba campañas.</div>
        <div class="portal-card-badge">Casting Club · 5 talentos</div>
      </div>
      
      <div class="portal-card" onclick="showView('view-agencia')">
        <div class="portal-card-icon">🏢</div>
        <div class="portal-card-title">Portal Agencia</div>
        <div class="portal-card-desc">Busca talentos, envía solicitudes y gestiona campañas publicitarias.</div>
        <div class="portal-card-badge">BBDO Buenos Aires</div>
      </div>
    </div>
    
    <div style="margin-top:3rem;font-size:11px;color:var(--fg-soft)">
      Demo: admin@umain.io / demo2026
    </div>
  </div>
</div>

<!-- ============================================================ -->
<!-- VIEW 1: PORTAL TALENTO -->
<!-- ============================================================ -->
<div class="view" id="view-talento">
  <div style="display:flex;min-height:100vh">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="logo">
        <div class="logo-word" onclick="showView('view-selector')">UMAIN</div>
        <div class="logo-sub">Portal Talento</div>
      </div>
      <div class="user-card">
        <div class="avatar"><img src="data:image/jpeg;base64,${PORTRAIT}" alt="Manu"></div>
        <div><div style="font-family:'Archivo',sans-serif;font-size:14px">Manu Jantus</div><div style="font-size:10px;text-transform:uppercase;letter-spacing:.15em;color:var(--fg-soft)">Talento · Tier A</div></div>
      </div>
      <nav>
        <div class="nav-section">General</div>
        <a class="nav-item active" onclick="showTalentoPage('t-dashboard')">◈ Panel</a>
        <a class="nav-item" onclick="showTalentoPage('t-profile')">◈ Mi perfil</a>
        <div class="nav-section">Mi Identidad</div>
        <a class="nav-item" onclick="showTalentoPage('t-matrix')">◈ Consentimiento</a>
        <a class="nav-item" onclick="showTalentoPage('t-usage')">◈ Registro de usos</a>
        <div class="nav-section">Campañas</div>
        <a class="nav-item" onclick="showTalentoPage('t-approvals')">◈ Aprobaciones <span class="nav-badge">3</span></a>
        <div class="nav-section">Derechos</div>
        <a class="nav-item" onclick="showTalentoPage('t-locks')">◈ Exclusividades</a>
        <a class="nav-item" onclick="showTalentoPage('t-contracts')">◈ Contratos</a>
        <a class="nav-item" onclick="showView('view-selector')" style="margin-top:1rem;opacity:.6">← Cambiar portal</a>
      </nav>
      <div class="sidebar-footer">UMAIN v0.4.0</div>
    </aside>

    <!-- Main -->
    <main class="main">
      <!-- Dashboard -->
      <div class="page active" id="t-dashboard">
        <div class="page-header"><div><div class="page-label">Panel</div><h1 class="page-title">Hola <em>Manu</em>, acá está tu semana.</h1></div></div>
        <div class="stats-grid">
          <div class="stat-card"><div class="stat-label">Proyectos activos</div><div class="stat-value">4</div><div class="stat-detail">2 al aire, 2 en producción</div></div>
          <div class="stat-card"><div class="stat-label">Regalías Q4</div><div class="stat-value">$10,712</div><div class="stat-detail">vs Q3 <span class="stat-trend">↑ 18%</span></div></div>
          <div class="stat-card"><div class="stat-label">Matriz completa</div><div class="stat-value">72%</div><div class="stat-detail">18 categorías sin evaluar</div></div>
          <div class="stat-card"><div class="stat-label">Exclusividades</div><div class="stat-value">2</div><div class="stat-detail">L'Oréal expira Jun 2026</div></div>
        </div>
        <div class="content-grid">
          <div>
            <div class="card"><div class="card-header"><h2 class="card-title">Actividad reciente</h2></div>
              <div class="activity-item"><div class="activity-dot pending"></div><div class="activity-content"><div class="activity-title">Nuevo proyecto: Campaña Samsung Galaxy Z Flip</div><div class="activity-meta">IAB-575 · LATAM · 28 abr</div></div><a class="activity-action">Revisar</a></div>
              <div class="activity-item"><div class="activity-dot completed"></div><div class="activity-content"><div class="activity-title">L'Oréal: Campaña Revitalift entregada</div><div class="activity-meta">Uso activo hasta 15 Jun 2026</div></div></div>
              <div class="activity-item"><div class="activity-dot alert"></div><div class="activity-content"><div class="activity-title">Exclusividad Pepsi se libera en 14 días</div><div class="activity-meta">Cooldown termina 24 Abr</div></div></div>
            </div>
          </div>
          <div>
            <div class="card"><div class="card-header"><h2 class="card-title">Consentimiento</h2></div>
              <div style="padding:1rem 1.25rem"><div style="font-size:11px;color:var(--fg-muted);margin-bottom:.5rem">Completitud</div><div class="progress-bar"><div class="progress-fill" style="width:72%"></div></div><div style="font-size:12px;margin-top:.5rem">72% · 47 de 65</div></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile -->
      <div class="page" id="t-profile">
        <div class="page-header"><div><div class="page-label">Perfil</div><h1 class="page-title">Tu <em>identidad</em> en UMAIN.</h1></div><div class="page-actions"><button class="btn primary small">Guardar cambios</button></div></div>
        <div class="content-grid">
          <div>
            <div class="card"><div class="card-header"><h2 class="card-title">Información personal</h2></div>
              <div class="profile-grid"><div class="profile-label">Nombre</div><div class="profile-value">Manuela Jantus</div></div>
              <div class="profile-grid"><div class="profile-label">Profesional</div><div class="profile-value">Manu Jantus</div></div>
              <div class="profile-grid"><div class="profile-label">Nacimiento</div><div class="profile-value">22 feb 1986</div></div>
              <div class="profile-grid"><div class="profile-label">Nacionalidad</div><div class="profile-value">🇦🇷 Argentina</div></div>
              <div class="profile-grid"><div class="profile-label">Idiomas</div><div class="profile-value">ES · EN · PT</div></div>
            </div>
            <div class="card"><div class="card-header"><h2 class="card-title">Representación</h2></div>
              <div class="profile-grid"><div class="profile-label">Agencia</div><div class="profile-value">Casting Club (BA)</div></div>
              <div class="profile-grid"><div class="profile-label">Contrato</div><div class="profile-value">Tripartito UMAIN × CC × Talento</div></div>
            </div>
          </div>
          <div>
            <div class="card"><div class="card-header"><h2 class="card-title">Modelo digital</h2></div>
              <div style="padding:1.25rem">
                <div style="aspect-ratio:3/4;border-radius:2px;overflow:hidden;margin-bottom:1rem;border:.5px solid var(--border)"><img src="data:image/jpeg;base64,${PORTRAIT}" style="width:100%;height:100%;object-fit:cover"></div>
                <div class="ref-grid"><div class="ref-thumb"><img src="data:image/jpeg;base64,${LIFESTYLE}"></div><div class="ref-thumb"><img src="data:image/jpeg;base64,${CAMPAIGN}"></div><div class="ref-thumb"><img src="data:image/jpeg;base64,${PROFILE}"></div></div>
                <div style="font-size:10px;color:var(--fg-soft);margin-bottom:1rem">48 fotos · 2.4 GB · Mar 2026</div>
              </div>
            </div>
            <div class="card"><div class="card-header"><h2 class="card-title">Tier</h2></div>
              <div style="padding:1.25rem;text-align:center"><div style="font-family:'Archivo',sans-serif;font-size:3rem;font-weight:300;color:var(--brand)">A</div><div style="font-size:11px;text-transform:uppercase;letter-spacing:.15em;color:var(--fg-muted)">Split 65/35 · $18,000 mínimo</div></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Approvals -->
      <div class="page" id="t-approvals">
        <div class="page-header"><div><div class="page-label">Aprobaciones</div><h1 class="page-title"><em>3 proyectos</em> esperando.</h1></div></div>
        <div class="approval-card">
          <div class="approval-header"><div><div class="approval-brand">Samsung Galaxy Z Flip 7</div><div class="approval-cat"><span class="cat-tag">IAB-575</span>Smartphones · LATAM</div></div><div class="approval-deadline">Fecha límite<strong>28 abr</strong></div></div>
          <div class="approval-body"><div class="approval-preview"><img src="data:image/jpeg;base64,${CAMPAIGN}"></div><div class="approval-details"><div class="detail-row"><div class="detail-label">Cliente</div><div>Samsung · BBDO</div></div><div class="detail-row"><div class="detail-label">Fee</div><div>$8,500 (tu: $5,525)</div></div></div></div>
          <div class="approval-footer"><div class="approval-impact">⚠ Aprobar bloquea Apple, Xiaomi hasta nov 2027</div><div style="display:flex;gap:.5rem"><button class="btn danger small">Rechazar</button><button class="btn primary small">Aprobar</button></div></div>
        </div>
      </div>

      <!-- Others (simplified) -->
      <div class="page" id="t-matrix"><div class="page-header"><div><div class="page-label">Matriz</div><h1 class="page-title">Consentimiento por <em>categoría</em>.</h1></div></div><div class="card"><div class="card-body" style="text-align:center;padding:3rem;color:var(--fg-soft)">65 categorías IAB · 47 evaluadas</div></div></div>
      <div class="page" id="t-usage"><div class="page-header"><div><div class="page-label">Usos</div><h1 class="page-title">Cada <em>uso</em>, registrado.</h1></div></div><div class="card"><div class="card-body" style="text-align:center;padding:3rem;color:var(--fg-soft)">23 usos · $32,080 acumulados</div></div></div>
      <div class="page" id="t-locks"><div class="page-header"><div><div class="page-label">Exclusividades</div><h1 class="page-title">Ventanas <em>competitivas</em>.</h1></div></div><div class="lock-card"><div><div class="lock-brand">L'Oréal Paris</div><div class="lock-cat"><span class="cat-tag">IAB-186</span>Cuidado capilar</div></div><div class="lock-dates"><strong>15 jun 2026</strong><div style="margin-top:.25rem">54 días</div></div><div class="lock-progress"><div class="lock-progress-label">65%</div><div class="progress-bar"><div class="progress-fill" style="width:65%"></div></div></div></div></div>
      <div class="page" id="t-contracts"><div class="page-header"><div><div class="page-label">Contratos</div><h1 class="page-title">Biblioteca <em>legal</em>.</h1></div></div><div class="card"><div class="card-body" style="text-align:center;padding:3rem;color:var(--fg-soft)">3 documentos firmados</div></div></div>
    </main>
  </div>
</div>

<!-- ============================================================ -->
<!-- VIEW 2: PORTAL CASTINERA -->
<!-- ============================================================ -->
<div class="view" id="view-castinera">
  <div style="display:flex;min-height:100vh">
    <aside class="sidebar">
      <div class="logo"><div class="logo-word" onclick="showView('view-selector')">UMAIN</div><div class="logo-sub">Portal Castinera</div></div>
      <div class="user-card"><div class="avatar-placeholder">FL</div><div><div style="font-family:'Archivo',sans-serif;font-size:14px">Federico López</div><div style="font-size:10px;text-transform:uppercase;letter-spacing:.15em;color:var(--fg-soft)">Casting Club</div></div></div>
      <nav>
        <div class="nav-section">General</div>
        <a class="nav-item active" onclick="showCastingPage('c-dashboard')">◈ Dashboard</a>
        <a class="nav-item" onclick="showCastingPage('c-roster')">◈ Roster</a>
        <div class="nav-section">Gestión</div>
        <a class="nav-item" onclick="showCastingPage('c-new')">◈ Nuevo talento</a>
        <a class="nav-item" onclick="showCastingPage('c-approvals')">◈ Aprobaciones <span class="nav-badge">3</span></a>
        <a class="nav-item" onclick="showCastingPage('c-contracts')">◈ Contratos</a>
        <a class="nav-item" onclick="showView('view-selector')" style="margin-top:1rem;opacity:.6">← Cambiar portal</a>
      </nav>
      <div class="sidebar-footer">UMAIN v0.4.0</div>
    </aside>

    <main class="main">
      <!-- Dashboard -->
      <div class="page active" id="c-dashboard">
        <div class="page-header"><div><div class="page-label">Casting Club</div><h1 class="page-title">Panel de <em>representante</em></h1></div><div class="page-actions"><button class="btn primary small">+ Nuevo talento</button></div></div>
        <div class="stats-grid">
          <div class="stat-card"><div class="stat-label">Talentos activos</div><div class="stat-value">4</div><div class="stat-detail">5 total en roster</div></div>
          <div class="stat-card"><div class="stat-label">Proyectos</div><div class="stat-value">10</div><div class="stat-detail">Across all talentos</div></div>
          <div class="stat-card"><div class="stat-label">Regalías totales</div><div class="stat-value">$26,112</div><div class="stat-detail">Tu comisión: $5,222</div></div>
          <div class="stat-card"><div class="stat-label">Pendientes</div><div class="stat-value">3</div><div class="stat-detail"><span style="color:var(--yellow)">Requieren atención</span></div></div>
        </div>
        <div class="content-grid">
          <div>
            <div class="card"><div class="card-header"><h2 class="card-title">Tu Roster</h2></div>
              <div style="padding:1.25rem">
                <div class="roster-item"><div class="avatar-placeholder" style="width:36px;height:36px;font-size:12px">MJ</div><div style="flex:1"><div style="font-family:'Archivo',sans-serif;font-weight:450;font-size:13px">Manu Jantus</div><div style="font-size:11px;color:var(--fg-soft)">Tier A · 4 proyectos</div></div><div style="text-align:right"><div style="font-size:13px;font-weight:500">$10,712</div><span class="badge active">Activo</span></div></div>
                <div class="roster-item"><div class="avatar-placeholder" style="width:36px;height:36px;font-size:12px">LF</div><div style="flex:1"><div style="font-family:'Archivo',sans-serif;font-weight:450;font-size:13px">Lucía Fernández</div><div style="font-size:11px;color:var(--fg-soft)">Tier A · 3 proyectos</div></div><div style="text-align:right"><div style="font-size:13px;font-weight:500">$8,450</div><span class="badge active">Activo</span></div></div>
                <div class="roster-item"><div class="avatar-placeholder" style="width:36px;height:36px;font-size:12px">CT</div><div style="flex:1"><div style="font-family:'Archivo',sans-serif;font-weight:450;font-size:13px">Camila Torres</div><div style="font-size:11px;color:var(--fg-soft)">Tier B · 2 proyectos</div></div><div style="text-align:right"><div style="font-size:13px;font-weight:500">$4,200</div><span class="badge active">Activo</span></div></div>
                <div class="roster-item"><div class="avatar-placeholder" style="width:36px;height:36px;font-size:12px">SL</div><div style="flex:1"><div style="font-family:'Archivo',sans-serif;font-weight:450;font-size:13px">Sofía López</div><div style="font-size:11px;color:var(--fg-soft)">Tier B · 0 proyectos</div></div><div style="text-align:right"><div style="font-size:13px;font-weight:500">$1,800</div><span class="badge pending">Suspendido</span></div></div>
              </div>
            </div>
          </div>
          <div>
            <div class="card"><div class="card-header"><h2 class="card-title">Aprobaciones pendientes</h2></div>
              <div style="padding:1rem 1.25rem">
                <div class="roster-item"><div style="flex:1"><div style="font-size:13px;font-weight:500">Samsung Galaxy Z Flip</div><div style="font-size:11px;color:var(--fg-soft)">Manu Jantus · IAB-575</div></div><div style="font-size:11px;color:var(--red)">28 abr</div></div>
                <div class="roster-item"><div style="flex:1"><div style="font-size:13px;font-weight:500">Nike Running</div><div style="font-size:11px;color:var(--fg-soft)">Lucía Fernández · IAB-15</div></div><div style="font-size:11px;color:var(--red)">2 may</div></div>
                <div class="roster-item"><div style="flex:1"><div style="font-size:13px;font-weight:500">L'Oréal Paris</div><div style="font-size:11px;color:var(--fg-soft)">Camila Torres · IAB-204</div></div><div style="font-size:11px;color:var(--red)">5 may</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- New Talent Wizard -->
      <div class="page" id="c-new">
        <div class="page-header"><div><div class="page-label">Nuevo talento</div><h1 class="page-title">Crear un <em>nuevo avatar</em></h1></div></div>
        <div class="wizard-steps">
          <div class="wizard-step completed">1. Datos</div>
          <div class="wizard-step active">2. Representación</div>
          <div class="wizard-step pending">3. Config</div>
          <div class="wizard-step pending">4. Fotos</div>
        </div>
        <div class="card"><div class="card-header"><h2 class="card-title">Representación</h2></div>
          <div style="padding:1.25rem;display:flex;flex-direction:column;gap:1.25rem">
            <div><label class="form-label">Agencia</label><input class="form-input" value="Casting Club (Buenos Aires)" disabled style="opacity:.7"></div>
            <div><label class="form-label">Split regalías (talento / agencia)</label><div style="display:flex;gap:1rem;align-items:center"><input class="form-input" type="number" value="65" style="width:80px"><span style="font-size:13px;color:var(--fg-muted)">/ 35%</span></div></div>
            <div style="padding:1rem;background:var(--bg-alt);border-radius:2px;border:.5px solid var(--border)"><div style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--brand);margin-bottom:.5rem">Contrato</div><div style="font-size:13px">Tripartito: UMAIN × Casting Club × Talento</div></div>
          </div>
        </div>
      </div>

      <!-- Others -->
      <div class="page" id="c-roster"><div class="page-header"><div><div class="page-label">Roster</div><h1 class="page-title">Tus <em>talentos</em>.</h1></div></div><div class="card"><div class="card-body" style="text-align:center;padding:3rem;color:var(--fg-soft)">5 talentos en roster</div></div></div>
      <div class="page" id="c-approvals"><div class="page-header"><div><div class="page-label">Aprobaciones</div><h1 class="page-title"><em>3 pendientes</em></h1></div></div><div class="card"><div class="card-body" style="text-align:center;padding:3rem;color:var(--fg-soft)">3 campañas esperando aprobación</div></div></div>
      <div class="page" id="c-contracts"><div class="page-header"><div><div class="page-label">Contratos</div><h1 class="page-title">Gestión <em>contractual</em>.</h1></div></div><div class="card"><div class="card-body" style="text-align:center;padding:3rem;color:var(--fg-soft)">8 contratos activos</div></div></div>
    </main>
  </div>
</div>

<!-- ============================================================ -->
<!-- VIEW 3: PORTAL AGENCIA -->
<!-- ============================================================ -->
<div class="view" id="view-agencia">
  <div style="min-height:100vh">
    <!-- Agency Header -->
    <header style="padding:1.5rem 3rem;border-bottom:.5px solid var(--border);display:flex;justify-content:space-between;align-items:center">
      <div style="display:flex;align-items:center;gap:2rem">
        <div><div style="font-family:'Archivo',sans-serif;font-weight:650;font-size:1.25rem;letter-spacing:.38em;text-transform:uppercase;cursor:pointer" onclick="showView('view-selector')">UMAIN</div><div style="font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--fg-soft)">Portal de Agencias</div></div>
        <nav style="display:flex;gap:1.5rem">
          <a style="font-size:12px;text-transform:uppercase;letter-spacing:.1em;color:var(--brand);font-weight:500">Catálogo</a>
          <a style="font-size:12px;text-transform:uppercase;letter-spacing:.1em;color:var(--fg-soft)">Solicitudes</a>
          <a style="font-size:12px;text-transform:uppercase;letter-spacing:.1em;color:var(--fg-soft)">Campañas</a>
          <a style="font-size:12px;text-transform:uppercase;letter-spacing:.1em;color:var(--fg-soft)">Contratos</a>
        </nav>
      </div>
      <div style="display:flex;align-items:center;gap:1rem">
        <span style="font-size:11px;color:var(--fg-soft)">BBDO Buenos Aires</span>
        <div class="avatar-placeholder" style="width:32px;height:32px;font-size:11px">BB</div>
      </div>
    </header>

    <main style="padding:2rem 3rem;max-width:1400px">
      <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:2rem;padding-bottom:1.5rem;border-bottom:.5px solid var(--border)">
        <div><div style="font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--brand);margin-bottom:.5rem">Catálogo de talentos</div><h1 style="font-family:'Archivo',sans-serif;font-size:2.5rem;font-weight:300;letter-spacing:-.02em">Encontrá el <em>talento</em> ideal</h1></div>
        <button class="btn primary">+ Nueva solicitud</button>
      </div>

      <!-- Search -->
      <div style="display:flex;gap:1rem;margin-bottom:1.5rem;padding:1rem;background:#FAFAF8;border:.5px solid var(--border);border-radius:2px">
        <input class="form-input" placeholder="Buscar talento..." style="flex:1">
        <button class="filter-btn active">Todos</button>
        <button class="filter-btn">Disponibles</button>
        <button class="filter-btn">Tier A</button>
      </div>

      <div style="font-size:11px;color:var(--fg-soft);margin-bottom:1rem;text-transform:uppercase;letter-spacing:.1em">5 talentos encontrados</div>

      <!-- Talent Grid -->
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1rem">
        <div class="talent-card">
          <div class="talent-card-photo"><div class="avatar-placeholder" style="width:60px;height:60px;font-size:20px">MJ</div></div>
          <div class="talent-card-body">
            <div style="display:flex;justify-content:space-between;margin-bottom:.5rem"><div><div style="font-family:'Archivo',sans-serif;font-weight:450">Manu Jantus</div><div style="font-size:11px;color:var(--fg-soft)">Buenos Aires</div></div><span style="padding:2px 8px;background:var(--bg-alt);border-radius:2px;font-size:12px;font-weight:500">A</span></div>
            <div style="display:flex;flex-wrap:wrap;gap:.375rem;margin-bottom:.75rem"><span style="padding:2px 6px;background:var(--bg-alt);border:.5px solid var(--border);border-radius:2px;font-size:10px;color:var(--fg-soft)">Moda</span><span style="padding:2px 6px;background:var(--bg-alt);border:.5px solid var(--border);border-radius:2px;font-size:10px;color:var(--fg-soft)">Belleza</span></div>
            <div style="display:flex;justify-content:space-between;align-items:center;padding-top:.75rem;border-top:.5px solid var(--border)"><div><div style="font-family:'Archivo',sans-serif;font-size:14px;font-weight:450">$2,500</div><div style="font-size:10px;color:var(--green);text-transform:uppercase;letter-spacing:.1em">Disponible</div></div><button class="btn primary small">Solicitar</button></div>
          </div>
        </div>

        <div class="talent-card">
          <div class="talent-card-photo"><div class="avatar-placeholder" style="width:60px;height:60px;font-size:20px">LF</div></div>
          <div class="talent-card-body">
            <div style="display:flex;justify-content:space-between;margin-bottom:.5rem"><div><div style="font-family:'Archivo',sans-serif;font-weight:450">Lucía Fernández</div><div style="font-size:11px;color:var(--fg-soft)">Santiago</div></div><span style="padding:2px 8px;background:var(--bg-alt);border-radius:2px;font-size:12px;font-weight:500">A</span></div>
            <div style="display:flex;flex-wrap:wrap;gap:.375rem;margin-bottom:.75rem"><span style="padding:2px 6px;background:var(--bg-alt);border:.5px solid var(--border);border-radius:2px;font-size:10px;color:var(--fg-soft)">Deportes</span><span style="padding:2px 6px;background:var(--bg-alt);border:.5px solid var(--border);border-radius:2px;font-size:10px;color:var(--fg-soft)">Fitness</span></div>
            <div style="display:flex;justify-content:space-between;align-items:center;padding-top:.75rem;border-top:.5px solid var(--border)"><div><div style="font-family:'Archivo',sans-serif;font-size:14px;font-weight:450">$2,200</div><div style="font-size:10px;color:var(--green);text-transform:uppercase;letter-spacing:.1em">Disponible</div></div><button class="btn primary small">Solicitar</button></div>
          </div>
        </div>

        <div class="talent-card">
          <div class="talent-card-photo"><div class="avatar-placeholder" style="width:60px;height:60px;font-size:20px">CT</div></div>
          <div class="talent-card-body">
            <div style="display:flex;justify-content:space-between;margin-bottom:.5rem"><div><div style="font-family:'Archivo',sans-serif;font-weight:450">Camila Torres</div><div style="font-size:11px;color:var(--fg-soft)">Ciudad de México</div></div><span style="padding:2px 8px;background:var(--bg-alt);border-radius:2px;font-size:12px;font-weight:500">B</span></div>
            <div style="display:flex;flex-wrap:wrap;gap:.375rem;margin-bottom:.75rem"><span style="padding:2px 6px;background:var(--bg-alt);border:.5px solid var(--border);border-radius:2px;font-size:10px;color:var(--fg-soft)">Cosmética</span><span style="padding:2px 6px;background:var(--bg-alt);border:.5px solid var(--border);border-radius:2px;font-size:10px;color:var(--fg-soft)">Lujo</span></div>
            <div style="display:flex;justify-content:space-between;align-items:center;padding-top:.75rem;border-top:.5px solid var(--border)"><div><div style="font-family:'Archivo',sans-serif;font-size:14px;font-weight:450">$1,800</div><div style="font-size:10px;color:var(--yellow);text-transform:uppercase;letter-spacing:.1em">Ocupado hasta Jun</div></div><button class="btn ghost small" disabled>No disponible</button></div>
          </div>
        </div>

        <div class="talent-card">
          <div class="talent-card-photo"><div class="avatar-placeholder" style="width:60px;height:60px;font-size:20px">VR</div></div>
          <div class="talent-card-body">
            <div style="display:flex;justify-content:space-between;margin-bottom:.5rem"><div><div style="font-family:'Archivo',sans-serif;font-weight:450">Valentina Ruiz</div><div style="font-size:11px;color:var(--fg-soft)">Montevideo</div></div><span style="padding:2px 8px;background:var(--bg-alt);border-radius:2px;font-size:12px;font-weight:500">C</span></div>
            <div style="display:flex;flex-wrap:wrap;gap:.375rem;margin-bottom:.75rem"><span style="padding:2px 6px;background:var(--bg-alt);border:.5px solid var(--border);border-radius:2px;font-size:10px;color:var(--fg-soft)">Moda</span><span style="padding:2px 6px;background:var(--bg-alt);border:.5px solid var(--border);border-radius:2px;font-size:10px;color:var(--fg-soft)">Street</span></div>
            <div style="display:flex;justify-content:space-between;align-items:center;padding-top:.75rem;border-top:.5px solid var(--border)"><div><div style="font-family:'Archivo',sans-serif;font-size:14px;font-weight:450">$900</div><div style="font-size:10px;color:var(--green);text-transform:uppercase;letter-spacing:.1em">Disponible</div></div><button class="btn primary small">Solicitar</button></div>
          </div>
        </div>
      </div>
    </main>
  </div>
</div>

<script>
function showView(id){document.querySelectorAll('.view').forEach(v=>{v.classList.remove('active');v.style.display='none'});const el=document.getElementById(id);if(el){el.classList.add('active');el.style.display='block'}window.scrollTo(0,0)}
function showTalentoPage(id){document.querySelectorAll('#view-talento .page').forEach(p=>p.classList.remove('active'));document.getElementById(id)?.classList.add('active');document.querySelectorAll('#view-talento .nav-item').forEach(n=>n.classList.remove('active'));event?.target?.classList?.add('active');window.scrollTo(0,0)}
function showCastingPage(id){document.querySelectorAll('#view-castinera .page').forEach(p=>p.classList.remove('active'));document.getElementById(id)?.classList.add('active');document.querySelectorAll('#view-castinera .nav-item').forEach(n=>n.classList.remove('active'));event?.target?.classList?.add('active');window.scrollTo(0,0)}
</script>

</body>
</html>
HTMLEOF

echo "v04 generated!"
