#!/bin/bash

# Generate base64 encoded images
PORTRAIT=$(base64 -w 0 public/images/talent-portrait.jpg)
LIFESTYLE=$(base64 -w 0 public/images/talent-lifestyle.jpg)
CAMPAIGN=$(base64 -w 0 public/images/talent-campaign.jpg)
PROFILE=$(base64 -w 0 public/images/talent-profile-side.jpg)

cat > preview_v03.html << 'HTMLEOF'
<!DOCTYPE html>
<html lang="es-AR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>UMAIN · Identidad real, licenciada</title>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62.5..125,100..900&display=swap" rel="stylesheet">
<style>
:root{--brand:#0B0B0B;--brand-deep:#000;--bg:#FFF;--bg-alt:#F6F6F5;--bg-deep:#EBEBEA;--fg:#0B0B0B;--fg-muted:#4B4B4A;--fg-soft:#7C7C7B;--border:rgba(11,11,11,.18);--border-soft:rgba(11,11,11,.08);--green:#4A7A52;--yellow:#B89A4A;--red:#A84A4A;--blue:#4A6A8A}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Archivo','Helvetica Neue',Arial,sans-serif;background:var(--bg);color:var(--fg);font-size:14px;line-height:1.5;-webkit-font-smoothing:antialiased}
em{font-style:normal;font-weight:450}
a{cursor:pointer}

/* VIEWS */
.view{display:none}
.view.active{display:block}

/* LANDING */
.landing{min-height:100vh;display:flex;flex-direction:column}
.landing-nav{display:flex;justify-content:space-between;align-items:center;padding:2rem 3rem;border-bottom:.5px solid var(--border)}
.logo-word{font-family:'Archivo',sans-serif;font-weight:650;font-stretch:122%;font-size:1.45rem;letter-spacing:.38em;margin-right:-.38em;text-transform:uppercase;color:var(--fg);line-height:1;cursor:pointer}
.landing-nav-links{display:flex;align-items:center;gap:2.5rem}
.nav-link{font-size:12px;text-transform:uppercase;letter-spacing:.12em;color:var(--fg-muted);text-decoration:none;transition:color .15s}
.nav-link:hover{color:var(--fg)}
.nav-cta{padding:.5rem 1.25rem;border:.5px solid var(--fg);font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:var(--fg);background:transparent;cursor:pointer;font-family:inherit;transition:all .15s}
.nav-cta:hover{background:var(--fg);color:var(--bg)}

/* HERO */
.hero{display:grid;grid-template-columns:1fr 420px;flex:1;min-height:calc(100vh - 82px)}
.hero-content{padding:5rem 3rem 4rem;display:flex;flex-direction:column;justify-content:space-between}
.hero-eyebrow{font-size:10px;text-transform:uppercase;letter-spacing:.25em;color:var(--brand);margin-bottom:1.5rem}
.hero-title{font-family:'Archivo',sans-serif;font-size:clamp(3rem,5vw,4.5rem);font-weight:300;line-height:1.05;letter-spacing:-.02em;max-width:680px}
.hero-sub{font-size:14px;color:var(--fg-muted);max-width:480px;line-height:1.7;margin-top:2rem}
.hero-actions{display:flex;gap:1rem;align-items:center;margin-top:3rem}
.btn-hero-primary{padding:.875rem 2rem;background:var(--fg);color:var(--bg);font-family:'Archivo',sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:.12em;border:none;cursor:pointer;transition:all .15s}
.btn-hero-primary:hover{background:var(--brand)}
.btn-hero-ghost{padding:.875rem 2rem;background:transparent;color:var(--fg);font-family:'Archivo',sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:.12em;border:.5px solid var(--border);cursor:pointer;transition:all .15s}
.btn-hero-ghost:hover{border-color:var(--fg-muted)}
.hero-stats{display:flex;gap:3rem;padding-top:3rem;border-top:.5px solid var(--border);margin-top:4rem}
.hero-stat-value{font-family:'Archivo',sans-serif;font-size:2.5rem;font-weight:300;letter-spacing:-.02em;line-height:1}
.hero-stat-label{font-size:10px;text-transform:uppercase;letter-spacing:.15em;color:var(--fg-soft);margin-top:.5rem}
.hero-image{position:relative;overflow:hidden;border-left:.5px solid var(--border)}
.hero-image img{width:100%;height:100%;object-fit:cover;object-position:top center;display:block;filter:grayscale(10%)}
.hero-image-caption{position:absolute;bottom:2rem;left:1.5rem;right:1.5rem}
.hero-image-name{font-family:'Archivo',sans-serif;font-size:1.5rem;font-weight:300;color:#fff;text-shadow:0 1px 12px rgba(0,0,0,.4)}
.hero-image-meta{font-size:10px;text-transform:uppercase;letter-spacing:.15em;color:rgba(255,255,255,.7);margin-top:.25rem}

/* HOW IT WORKS */
.section{padding:6rem 3rem;border-top:.5px solid var(--border)}
.section-label{font-size:10px;text-transform:uppercase;letter-spacing:.25em;color:var(--brand);margin-bottom:1rem}
.section-title{font-family:'Archivo',sans-serif;font-size:2.5rem;font-weight:300;letter-spacing:-.02em;margin-bottom:3rem}
.how-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:var(--border-soft);border:.5px solid var(--border)}
.how-step{background:var(--bg);padding:2.5rem 2rem}
.how-num{font-family:'Archivo',sans-serif;font-size:3rem;font-weight:300;color:var(--brand);opacity:.4;line-height:1;margin-bottom:1.5rem}
.how-title{font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;margin-bottom:.75rem}
.how-desc{font-size:13px;color:var(--fg-muted);line-height:1.65}

/* FOR WHOM */
.for-grid{display:grid;grid-template-columns:1fr 1fr;gap:2px;background:var(--border)}
.for-card{background:var(--bg-alt);padding:3rem}
.for-card-title{font-family:'Archivo',sans-serif;font-size:1.75rem;font-weight:300;margin-bottom:1.5rem}
.for-list{list-style:none;display:flex;flex-direction:column;gap:.875rem}
.for-list li{font-size:13px;color:var(--fg-muted);display:flex;align-items:flex-start;gap:.75rem;line-height:1.5}
.for-list li::before{content:'·';color:var(--brand);flex-shrink:0}

/* FOOTER */
.landing-footer{padding:2rem 3rem;border-top:.5px solid var(--border);display:flex;justify-content:space-between;align-items:center}
.footer-copy{font-size:11px;color:var(--fg-soft);letter-spacing:.05em}
.footer-links{display:flex;gap:2rem}
.footer-link{font-size:11px;color:var(--fg-soft);text-decoration:none;letter-spacing:.05em;transition:color .15s}
.footer-link:hover{color:var(--fg)}

/* LOGIN */
.login-view{min-height:100vh;display:grid;grid-template-columns:1fr 480px}
.login-left{background:var(--brand);display:flex;flex-direction:column;justify-content:space-between;padding:3rem;position:relative;overflow:hidden}
.login-left-pattern{position:absolute;inset:0;opacity:.08;background-image:linear-gradient(to right,rgba(255,255,255,.1) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.1) 1px,transparent 1px);background-size:40px 40px}
.login-left-logo{position:relative;z-index:1}
.login-left-u{font-family:'Archivo',sans-serif;font-weight:300;font-size:3rem;line-height:1;color:#fff;letter-spacing:-.02em}
.login-left-sub{font-family:'Archivo',sans-serif;font-weight:500;font-size:.55rem;letter-spacing:.45em;text-transform:uppercase;color:rgba(255,255,255,.5);margin-top:.5rem}
.login-quote{position:relative;z-index:1}
.login-quote-text{font-family:'Archivo',sans-serif;font-size:1.875rem;font-weight:300;color:#fff;line-height:1.2;margin-bottom:1rem}
.login-quote-meta{font-size:10px;text-transform:uppercase;letter-spacing:.2em;color:rgba(255,255,255,.4)}
.login-right{background:var(--bg);display:flex;flex-direction:column;justify-content:center;padding:3rem 3.5rem;border-left:.5px solid var(--border)}
.login-title{font-family:'Archivo',sans-serif;font-size:2rem;font-weight:300;letter-spacing:-.02em;margin-bottom:.5rem}
.login-sub{font-size:13px;color:var(--fg-muted);margin-bottom:2.5rem}
.login-field{margin-bottom:1.25rem}
.login-label{display:block;font-size:10px;text-transform:uppercase;letter-spacing:.15em;color:var(--fg-muted);margin-bottom:.5rem}
.login-input{width:100%;padding:.75rem 1rem;background:#FAFAF8;border:.5px solid var(--border);font-family:'Archivo',sans-serif;font-size:14px;color:var(--fg);outline:none;transition:border-color .15s}
.login-input:focus{border-color:var(--brand)}
.login-btn{width:100%;padding:.875rem;background:var(--fg);color:var(--bg);font-family:'Archivo',sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:.15em;border:none;cursor:pointer;margin-top:.5rem;transition:background .15s}
.login-btn:hover{background:var(--brand)}
.login-back{margin-top:2rem;font-size:11px;color:var(--fg-soft);cursor:pointer;display:inline-flex;align-items:center;gap:.5rem;transition:color .15s}
.login-back:hover{color:var(--brand)}

/* PORTAL */
.portal{display:grid;grid-template-columns:240px 1fr;min-height:100vh}
.sidebar{background:var(--bg-alt);border-right:.5px solid var(--border);padding:2rem 0;display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto}
.logo{padding:0 1.5rem 2rem;border-bottom:.5px solid var(--border)}
.logo-sub{font-family:'Archivo',sans-serif;font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--fg-soft);margin-top:.25rem}
.user-card{padding:1.5rem;border-bottom:.5px solid var(--border);display:flex;align-items:center;gap:.75rem}
.avatar{width:40px;height:40px;border-radius:50%;overflow:hidden;flex-shrink:0;border:.5px solid var(--border)}
.avatar img{width:100%;height:100%;object-fit:cover}
.user-name{font-family:'Archivo',sans-serif;font-size:14px;color:var(--fg)}
.user-role{font-size:10px;text-transform:uppercase;letter-spacing:.15em;color:var(--fg-soft)}
.nav-section{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--brand);padding:1rem 1.5rem .5rem}
.nav-item{display:flex;align-items:center;gap:.75rem;padding:.6rem 1.5rem;color:var(--fg-muted);text-decoration:none;font-size:13px;transition:all .15s;cursor:pointer;border-left:2px solid transparent}
.nav-item:hover{color:var(--fg);background:rgba(11,11,11,.03)}
.nav-item.active{color:var(--fg);border-left-color:var(--brand);background:rgba(11,11,11,.03);font-weight:500}
.nav-badge{margin-left:auto;background:var(--brand);color:#fff;font-size:10px;padding:2px 6px;border-radius:10px;font-weight:500}
.sidebar-footer{padding:1rem 1.5rem;border-top:.5px solid var(--border);font-size:10px;color:var(--fg-soft);letter-spacing:.1em;text-transform:uppercase}
.main{padding:2rem 2.5rem;min-height:100vh}
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

/* PROGRESS */
.progress-bar{height:6px;background:var(--bg-deep);border-radius:3px;overflow:hidden}
.progress-fill{height:100%;border-radius:3px;background:var(--brand)}

/* MATRIX */
.matrix-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;padding:1.25rem;background:#FAFAF8;border:.5px solid var(--border);border-radius:2px}
.matrix-legend{display:flex;gap:1.25rem;margin-bottom:1rem;padding:.75rem 1rem;background:var(--bg-alt);border-radius:2px;font-size:11px}
.legend-item{display:flex;align-items:center;gap:6px;color:var(--fg-muted)}
.legend-dot{width:10px;height:10px;border-radius:2px}
.legend-dot.allowed{background:var(--green)}
.legend-dot.case-by-case{background:var(--yellow)}
.legend-dot.prohibited{background:var(--red)}
.legend-dot.unset{background:var(--fg-soft)}
.matrix-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem}
.matrix-cat{background:#FAFAF8;border:.5px solid var(--border);padding:.875rem 1rem;border-radius:2px;cursor:pointer;transition:all .15s;position:relative}
.matrix-cat:hover{border-color:var(--brand);transform:translateY(-1px)}
.cat-state{position:absolute;top:.875rem;right:1rem;width:10px;height:10px;border-radius:2px}
.cat-state.allowed{background:var(--green)}
.cat-state.case-by-case{background:var(--yellow)}
.cat-state.prohibited{background:var(--red)}
.cat-state.unset{background:var(--fg-soft)}
.cat-code{font-size:10px;color:var(--fg-soft);font-family:'Courier New',monospace;margin-bottom:.25rem}
.cat-name{font-family:'Archivo',sans-serif;font-size:15px;font-weight:400;margin-bottom:.25rem;padding-right:1rem}
.cat-desc{font-size:11px;color:var(--fg-muted);line-height:1.4}
.filter-btn{padding:6px 12px;font-size:11px;border:.5px solid var(--border);background:#FAFAF8;color:var(--fg-muted);cursor:pointer;border-radius:2px;text-transform:uppercase;letter-spacing:.05em;transition:all .15s;font-family:inherit}
.filter-btn:hover,.filter-btn.active{border-color:var(--brand);color:var(--brand)}

/* LOCKS */
.lock-card{background:#FAFAF8;border:.5px solid var(--border);border-left:3px solid var(--brand);border-radius:2px;padding:1.25rem;margin-bottom:1rem;display:grid;grid-template-columns:1fr 150px 180px;gap:1.5rem;align-items:center}
.lock-brand{font-family:'Archivo',sans-serif;font-size:1.25rem;font-weight:450;margin-bottom:.25rem}
.lock-cat{font-size:12px;color:var(--fg-muted);display:flex;gap:.5rem;align-items:center}
.lock-comp{font-size:11px;color:var(--fg-soft);margin-top:.5rem}
.lock-dates{font-size:11px;color:var(--fg-muted);text-align:center}
.lock-dates strong{display:block;font-family:'Archivo',sans-serif;font-size:1.125rem;font-weight:450;color:var(--fg)}
.lock-progress{display:flex;flex-direction:column;gap:.5rem;text-align:right}
.lock-progress-label{font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:var(--fg-muted)}
.cat-tag{display:inline-block;font-family:'Courier New',monospace;font-size:10px;padding:2px 6px;background:var(--bg-alt);border-radius:2px;color:var(--fg-soft)}

/* CONTRACTS */
.contract-item{background:#FAFAF8;border:.5px solid var(--border);border-radius:2px;padding:1.25rem;margin-bottom:.75rem;display:grid;grid-template-columns:40px 1fr 120px 100px;gap:1rem;align-items:center}
.contract-icon{width:40px;height:40px;background:var(--bg-alt);border-radius:2px;display:flex;align-items:center;justify-content:center;color:var(--fg-muted)}
.contract-name{font-family:'Archivo',sans-serif;font-size:1.0625rem;font-weight:450;margin-bottom:.25rem}
.contract-meta{font-size:11px;color:var(--fg-muted)}

/* APPROVALS */
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

/* GATE */
.gate-step{padding:6px 12px;font-size:11px;border-radius:2px;font-weight:500;display:inline-flex;align-items:center;gap:.25rem}
.gate-step.pass{border:.5px solid var(--green);background:rgba(74,122,82,.1);color:var(--green)}
.gate-step.fail{border:.5px solid var(--red);background:rgba(168,74,74,.1);color:var(--red)}
.gate-step.pending{border:.5px solid var(--border);color:var(--fg-soft)}

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
.model-detail{display:flex;justify-content:space-between;padding:.5rem 0;border-bottom:.5px solid var(--border-soft);font-size:12px}
.model-detail:last-child{border-bottom:none}
.tier-display{text-align:center;margin-bottom:1rem}
.tier-value{font-family:'Archivo',sans-serif;font-size:3rem;font-weight:300;color:var(--brand);line-height:1}
.tier-label{font-size:11px;text-transform:uppercase;letter-spacing:.15em;color:var(--fg-muted);margin-top:.25rem}

/* PAGES */
.page{display:none}
.page.active{display:block}

/* DEMO BADGE */
.demo-badge{position:fixed;bottom:1rem;right:1rem;z-index:200;background:#0B0B0B;color:#FFF;display:flex;align-items:center;gap:.5rem;font-family:'Archivo',sans-serif;font-size:10px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;padding:.45rem .8rem;border-radius:2px;pointer-events:none}
.demo-dot{width:6px;height:6px;border-radius:50%;background:#22c55e}

@media(max-width:1024px){.portal{grid-template-columns:200px 1fr}.stats-grid{grid-template-columns:repeat(2,1fr)}.content-grid{grid-template-columns:1fr}.matrix-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:720px){.portal,.login-view{grid-template-columns:1fr}.sidebar{display:none}.main{padding:1rem}.stats-grid{grid-template-columns:1fr}.matrix-grid{grid-template-columns:1fr}.timeline-item{grid-template-columns:1fr;gap:.5rem}.lock-card{grid-template-columns:1fr;gap:1rem}.hero{grid-template-columns:1fr}.hero-image{border-left:none;border-top:.5px solid var(--border);min-height:400px}.hero-content{padding:3rem 1.5rem}.how-grid,.for-grid{grid-template-columns:1fr}.landing-nav-links{display:none}}
</style>
</head>
<body>

<div class="demo-badge"><span class="demo-dot"></span>v03 · Landing + Login + Portal</div>

<!-- ============================================================ -->
<!-- VIEW 1: LANDING PAGE -->
<!-- ============================================================ -->
<div class="view active" id="view-landing">
  <div class="landing">
    <!-- NAV -->
    <nav class="landing-nav">
      <div class="logo-word" onclick="showView('view-landing')">UMAIN</div>
      <div class="landing-nav-links">
        <a class="nav-link" href="#how">Cómo funciona</a>
        <a class="nav-link" href="#for-brands">Para marcas</a>
        <a class="nav-link" href="#for-talent">Para talento</a>
        <button class="nav-cta" onclick="showView('view-login')">Portal de talento</button>
      </div>
    </nav>

    <!-- HERO -->
    <div class="hero">
      <div class="hero-content">
        <div>
          <div class="hero-eyebrow">Gemelos digitales con consentimiento · Piloto · Buenos Aires</div>
          <h1 class="hero-title">
            Identidad real,<br>
            <em>licenciada</em> con intención.
          </h1>
          <p class="hero-sub">
            UMAIN es la infraestructura de gemelos digitales del talento hispano. 
            Las castineras y representantes aportan el roster. UMAIN aporta el rights engine: 
            consentimiento granular, aprobación del talento en cada uso y trazabilidad C2PA.
          </p>
          <div class="hero-actions">
            <button class="btn-hero-primary" onclick="showView('view-login')">Ver la demo del portal →</button>
            <button class="btn-hero-ghost" onclick="document.getElementById('how').scrollIntoView({behavior:'smooth'})">Cómo funciona</button>
          </div>
        </div>
        <div class="hero-stats">
          <div>
            <div class="hero-stat-value">0</div>
            <div class="hero-stat-label">Usos sin consentimiento</div>
          </div>
          <div>
            <div class="hero-stat-value">50–70%</div>
            <div class="hero-stat-label">Del fee, para el talento</div>
          </div>
          <div>
            <div class="hero-stat-value">IAB</div>
            <div class="hero-stat-label">Taxonomía 3.1</div>
          </div>
          <div>
            <div class="hero-stat-value">C2PA</div>
            <div class="hero-stat-label">Content Credentials</div>
          </div>
        </div>
      </div>
      <div class="hero-image">
PLACEHOLDER_HERO_IMAGE
        <div class="hero-image-caption">
          <div class="hero-image-name">Manu Jantus</div>
          <div class="hero-image-meta">Tier A · Buenos Aires · Activa desde 2025</div>
        </div>
      </div>
    </div>

    <!-- HOW IT WORKS -->
    <div id="how" class="section">
      <div class="section-label">Cómo funciona</div>
      <h2 class="section-title">Tres pilares, un sistema.</h2>
      <div class="how-grid">
        <div class="how-step">
          <div class="how-num">01</div>
          <div class="how-title">Capture Protocol</div>
          <div class="how-desc">Sesión de 45 min con video 4K multi-ángulo, fotografía guiada (40-80 tomas) y captura de voz (10-15 min). Identity Pack cifrado AES-256.</div>
        </div>
        <div class="how-step">
          <div class="how-num">02</div>
          <div class="how-title">Rights Engine</div>
          <div class="how-desc">Compuerta de consentimiento, workflow de aprobación del talento, AuditLog inmutable con cadena de hashes SHA-256 y firma ed25519.</div>
        </div>
        <div class="how-step">
          <div class="how-num">03</div>
          <div class="how-title">Generation Layer</div>
          <div class="how-desc">Triple Pipeline sobre Higgsfield: Soul ID 2.0 + GPT Image 2 / Nano Banana Pro + Seedream V5 Pro adaptativo.</div>
        </div>
      </div>
    </div>

    <!-- FOR BRANDS -->
    <div id="for-brands" class="section">
      <div class="section-label">Para marcas</div>
      <h2 class="section-title">Campañas sin re-shooting.</h2>
      <div class="for-grid">
        <div class="for-card">
          <div class="for-card-title">Beneficios</div>
          <ul class="for-list">
            <li>Extiende campañas sin volver a shootear</li>
            <li>Acceso a talento hispano con consentimiento granular</li>
            <li>Trazabilidad C2PA en cada asset</li>
            <li>Exclusividad competitiva automática</li>
            <li>Cumplimiento legal verificado</li>
          </ul>
        </div>
        <div class="for-card">
          <div class="for-card-title">Proceso</div>
          <ul class="for-list">
            <li>Seleccioná el talento del roster</li>
            <li>Definí territorio, período y output</li>
            <li>El talento revisa y aprueba cada uso</li>
            <li>UMAIN genera el contenido via Triple Pipeline</li>
            <li>Entrega con Content Credentials C2PA</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- FOR TALENT -->
    <div id="for-talent" class="section">
      <div class="section-label">Para talento</div>
      <h2 class="section-title">Tu identidad, tus reglas.</h2>
      <div class="for-grid">
        <div class="for-card">
          <div class="for-card-title">Control total</div>
          <ul class="for-list">
            <li>Matriz de consentimiento por categoría IAB</li>
            <li>Aprobás cada uso individualmente</li>
            <li>Exclusividad competitiva automática</li>
            <li>Regalías transparentes (65/35 split)</li>
            <li>Derecho de supresión (Ley 25.326)</li>
          </ul>
        </div>
        <div class="for-card">
          <div class="for-card-title">Ingresos pasivos</div>
          <ul class="for-list">
            <li>Tu gemelo digital trabaja 24/7</li>
            <li>Múltiples campañas simultáneas</li>
            <li>Sin conflictos de agenda</li>
            <li>Reportes trimestrales auditables</li>
            <li>Mínimo garantizado por tier</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <footer class="landing-footer">
      <div class="footer-copy">© 2026 UMAIN · Identidad real, licenciada</div>
      <div class="footer-links">
        <a class="footer-link">Términos</a>
        <a class="footer-link">Privacidad</a>
        <a class="footer-link">Contacto</a>
      </div>
    </footer>
  </div>
</div>

<!-- ============================================================ -->
<!-- VIEW 2: LOGIN -->
<!-- ============================================================ -->
<div class="view" id="view-login">
  <div class="login-view">
    <div class="login-left">
      <div class="login-left-pattern"></div>
      <div class="login-left-logo">
        <div class="login-left-u">UMAIN</div>
        <div class="login-left-sub">identidad real, licenciada</div>
      </div>
      <div class="login-quote">
        <div class="login-quote-text">"Cada uso de tu identidad digital, con tu consentimiento explícito."</div>
        <div class="login-quote-meta">Rights Engine · Trazabilidad C2PA · Split 65/35</div>
      </div>
    </div>
    <div class="login-right">
      <h1 class="login-title">Ingresá al portal</h1>
      <p class="login-sub">Accedé a tu dashboard de talento, matriz de consentimiento y aprobaciones pendientes.</p>
      <form onsubmit="event.preventDefault(); showView('view-portal')">
        <div class="login-field">
          <label class="login-label">Email</label>
          <input class="login-input" type="email" placeholder="usuario@umain.io" value="admin@umain.io">
        </div>
        <div class="login-field">
          <label class="login-label">Contraseña</label>
          <input class="login-input" type="password" placeholder="••••••••" value="demo2026">
        </div>
        <button type="submit" class="login-btn">Ingresar</button>
      </form>
      <div style="margin-top:1.75rem;padding-top:1.75rem;border-top:.5px solid var(--border);text-align:center">
        <p style="font-size:11px;color:var(--fg-soft);letter-spacing:.05em">Demo: admin@umain.io / demo2026</p>
      </div>
      <div class="login-back" onclick="showView('view-landing')">← Volver al inicio</div>
    </div>
  </div>
</div>

<!-- ============================================================ -->
<!-- VIEW 3: PORTAL (after login) -->
<!-- ============================================================ -->
<div class="view" id="view-portal">
  <div class="portal">
    <!-- SIDEBAR -->
    <aside class="sidebar">
      <div class="logo">
        <div class="logo-word">UMAIN</div>
        <div class="logo-sub">identidad real, licenciada</div>
      </div>
      <div class="user-card">
        <div class="avatar">
PLACEHOLDER_PORTRAIT
        </div>
        <div>
          <div class="user-name">Manu Jantus</div>
          <div class="user-role">Talento · Tier A</div>
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
        <a class="nav-item" onclick="showView('view-landing')" style="margin-top:1rem;opacity:.6">← Cerrar sesión</a>
      </nav>
      <div class="sidebar-footer">UMAIN v0.3.0<br><span style="font-size:9px;letter-spacing:.05em">Rights Engine + Higgsfield</span></div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="main">

      <!-- DASHBOARD -->
      <div class="page active" id="page-dashboard">
        <div class="page-header">
          <div>
            <div class="page-label">Panel</div>
            <h1 class="page-title">Hola <em>Manu</em>, acá está tu semana.</h1>
          </div>
          <div class="page-actions"><button class="btn primary small">Nueva solicitud</button></div>
        </div>
        <div class="stats-grid">
          <div class="stat-card"><div class="stat-label">Proyectos activos</div><div class="stat-value">4</div><div class="stat-detail">2 al aire, 2 en producción</div></div>
          <div class="stat-card"><div class="stat-label">Regalías Q4</div><div class="stat-value">$10,712</div><div class="stat-detail">vs Q3 <span class="stat-trend">↑ 18%</span></div></div>
          <div class="stat-card"><div class="stat-label">Matriz completa</div><div class="stat-value">72%</div><div class="stat-detail">18 categorías sin evaluar</div></div>
          <div class="stat-card"><div class="stat-label">Exclusividades</div><div class="stat-value">2</div><div class="stat-detail">L'Oréal expira Jun 2026</div></div>
        </div>
        <div class="content-grid">
          <div>
            <div class="card">
              <div class="card-header"><h2 class="card-title">Actividad reciente</h2><a class="view-all">Ver todo</a></div>
              <div class="activity-item"><div class="activity-dot pending"></div><div class="activity-content"><div class="activity-title">Nuevo proyecto: Campaña Samsung Galaxy Z Flip</div><div class="activity-meta">IAB-575 · LATAM · Fecha límite: 28 abr</div></div><a class="activity-action" onclick="showPage('approvals')">Revisar</a></div>
              <div class="activity-item"><div class="activity-dot completed"></div><div class="activity-content"><div class="activity-title">L'Oréal Paris: Campaña 'Revitalift' entregada</div><div class="activity-meta">Uso activo hasta 15 Jun 2026</div></div><a class="activity-action" onclick="showPage('usage')">Ver</a></div>
              <div class="activity-item"><div class="activity-dot alert"></div><div class="activity-content"><div class="activity-title">Exclusividad: categoría Pepsi se libera en 14 días</div><div class="activity-meta">Cooldown termina 24 Abr</div></div><a class="activity-action" onclick="showPage('locks')">Detalles</a></div>
            </div>
          </div>
          <div>
            <div class="card">
              <div class="card-header"><h2 class="card-title">Consentimiento rápido</h2></div>
              <div style="padding:1rem 1.25rem">
                <div style="font-size:11px;color:var(--fg-muted);margin-bottom:.5rem">Completitud</div>
                <div class="progress-bar"><div class="progress-fill" style="width:72%"></div></div>
                <div style="font-size:12px;color:var(--fg);margin-top:.5rem">72% · 47 de 65</div>
                <button class="btn ghost small" style="width:100%;margin-top:1rem;text-align:center" onclick="showPage('matrix')">Editar matriz →</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- PROFILE -->
      <div class="page" id="page-profile">
        <div class="page-header">
          <div>
            <div class="page-label">Perfil</div>
            <h1 class="page-title">Tu <em>identidad</em> en UMAIN.</h1>
            <p class="page-desc">Información personal, representación, y metadata de tu modelo digital.</p>
          </div>
          <div class="page-actions"><button class="btn ghost small">Cancelar</button><button class="btn primary small">Guardar cambios</button></div>
        </div>
        <div class="content-grid">
          <div>
            <div class="card">
              <div class="card-header"><h2 class="card-title">Información personal</h2></div>
              <div class="profile-grid"><div class="profile-label">Nombre completo</div><div class="profile-value">Manuela Jantus</div></div>
              <div class="profile-grid"><div class="profile-label">Nombre profesional</div><div class="profile-value">Manu Jantus</div></div>
              <div class="profile-grid"><div class="profile-label">Fecha nacimiento</div><div class="profile-value">22 de febrero de 1986</div></div>
              <div class="profile-grid"><div class="profile-label">Nacionalidad</div><div class="profile-value">🇦🇷 Argentina</div></div>
              <div class="profile-grid"><div class="profile-label">Domicilio</div><div class="profile-value">Buenos Aires, Argentina</div></div>
              <div class="profile-grid"><div class="profile-label">Idiomas</div><div class="profile-value">Español (nativo) · Inglés (fluido) · Portugués (intermedio)</div></div>
            </div>
            <div class="card">
              <div class="card-header"><h2 class="card-title">Contacto</h2></div>
              <div class="profile-grid"><div class="profile-label">Email</div><div class="profile-value">manu@manujantus.com</div></div>
              <div class="profile-grid"><div class="profile-label">Teléfono</div><div class="profile-value">+54 11 5555-1234 (cifrado)</div></div>
              <div class="profile-grid"><div class="profile-label">Emergencia</div><div class="profile-value">Representante · Casting Club</div></div>
            </div>
            <div class="card">
              <div class="card-header"><h2 class="card-title">Representación</h2></div>
              <div class="profile-grid"><div class="profile-label">Agencia</div><div class="profile-value">Casting Club (Buenos Aires)</div></div>
              <div class="profile-grid"><div class="profile-label">Representante</div><div class="profile-value">Federico López</div></div>
              <div class="profile-grid"><div class="profile-label">Contrato</div><div class="profile-value">Tripartito: UMAIN × Casting Club × Talento</div></div>
              <div class="profile-grid"><div class="profile-label">Exclusividad</div><div class="profile-value">Solo derechos digitales de IA</div></div>
            </div>
          </div>
          <div>
            <div class="card">
              <div class="card-header"><h2 class="card-title">Modelo digital</h2></div>
              <div style="padding:1.25rem">
                <div style="aspect-ratio:3/4;background:var(--bg-alt);border-radius:2px;margin-bottom:1rem;overflow:hidden;border:.5px solid var(--border)">
PLACEHOLDER_PROFILE_PORTRAIT
                </div>
                <div style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--brand);margin-bottom:.75rem">Fotos de referencia</div>
                <div class="ref-grid">
                  <div class="ref-thumb">PLACEHOLDER_LIFESTYLE</div>
                  <div class="ref-thumb">PLACEHOLDER_CAMPAIGN</div>
                  <div class="ref-thumb">PLACEHOLDER_PROFILE</div>
                </div>
                <div style="font-size:10px;color:var(--fg-soft);margin-bottom:1rem">48 fotos · 2.4 GB · Última actualización: Mar 2026</div>
                <div class="model-detail"><span style="color:var(--fg-muted)">Tipo</span><span>Flux LoRA + MetaHuman</span></div>
                <div class="model-detail"><span style="color:var(--fg-muted)">Dataset</span><span>48 fotos · 2.4 GB</span></div>
                <div class="model-detail"><span style="color:var(--fg-muted)">Entrenamiento</span><span>Mar 2026</span></div>
                <div class="model-detail"><span style="color:var(--fg-muted)">Versión</span><span>v2.1</span></div>
                <button class="btn ghost small" style="width:100%;margin-top:1rem">Solicitar reentrenamiento</button>
                <button class="btn danger small" style="width:100%;margin-top:.5rem">Solicitar supresión (Ley 25.326)</button>
              </div>
            </div>
            <div class="card">
              <div class="card-header"><h2 class="card-title">Tier y compensación</h2></div>
              <div style="padding:1.25rem;font-size:13px">
                <div class="tier-display">
                  <div class="tier-value">A</div>
                  <div class="tier-label">Tier</div>
                </div>
                <div class="model-detail"><span style="color:var(--fg-muted)">Split</span><span>65 / 35</span></div>
                <div class="model-detail"><span style="color:var(--fg-muted)">Mínimo garantizado</span><span>$18,000</span></div>
                <div class="model-detail"><span style="color:var(--fg-muted)">Reportes</span><span>Trimestrales</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- MATRIX -->
      <div class="page" id="page-matrix">
        <div class="page-header">
          <div><div class="page-label">Matriz de consentimiento</div><h1 class="page-title">Tus preferencias por <em>categoría</em>.</h1></div>
          <div class="page-actions"><button class="btn ghost small">Wizard</button><button class="btn primary small">Guardar y firmar</button></div>
        </div>
        <div class="matrix-header">
          <div style="flex:1"><div style="font-size:11px;color:var(--fg-muted);margin-bottom:.5rem">Completitud</div><div class="progress-bar"><div class="progress-fill" style="width:72%"></div></div><div style="font-size:12px;color:var(--fg);margin-top:.5rem">47 de 65 · 18 sin definir</div></div>
          <div style="display:flex;gap:.5rem;margin-left:2rem"><button class="filter-btn active">Todas</button><button class="filter-btn">Autorizadas</button><button class="filter-btn">Prohibidas</button></div>
        </div>
        <div class="matrix-legend"><div class="legend-item"><span class="legend-dot allowed"></span> Autorizado</div><div class="legend-item"><span class="legend-dot case-by-case"></span> Caso por caso</div><div class="legend-item"><span class="legend-dot prohibited"></span> Prohibido</div></div>
        <div class="matrix-grid">
          <div class="matrix-cat"><div class="cat-state allowed"></div><div class="cat-code">IAB-16</div><div class="cat-name">Moda y estilo</div><div class="cat-desc">Indumentaria, accesorios, editorial.</div></div>
          <div class="matrix-cat"><div class="cat-state allowed"></div><div class="cat-code">IAB-204</div><div class="cat-name">Belleza y cosmética</div><div class="cat-desc">Maquillaje, skincare, fragancias.</div></div>
          <div class="matrix-cat"><div class="cat-state case-by-case"></div><div class="cat-code">IAB-9</div><div class="cat-name">Alimentos</div><div class="cat-desc">Alimentos y bebidas sin alcohol.</div></div>
          <div class="matrix-cat"><div class="cat-state prohibited"></div><div class="cat-code">IAB-430</div><div class="cat-name">Alcohol</div><div class="cat-desc">Cerveza, vino, destilados.</div></div>
          <div class="matrix-cat"><div class="cat-state prohibited"></div><div class="cat-code">GARM-H8</div><div class="cat-name">Tabaco</div><div class="cat-desc">Cigarrillos, vapeo.</div></div>
          <div class="matrix-cat"><div class="cat-state unset"></div><div class="cat-code">IAB-4</div><div class="cat-name">Empleo</div><div class="cat-desc">Plataformas de empleo.</div></div>
        </div>
      </div>

      <!-- USAGE -->
      <div class="page" id="page-usage">
        <div class="page-header"><div><div class="page-label">Registro de usos</div><h1 class="page-title">Cada <em>uso</em>, registrado.</h1></div></div>
        <div class="stats-grid">
          <div class="stat-card"><div class="stat-label">Usos totales</div><div class="stat-value">23</div></div>
          <div class="stat-card"><div class="stat-label">Activos</div><div class="stat-value">7</div></div>
          <div class="stat-card"><div class="stat-label">Ingresos</div><div class="stat-value">$32,080</div></div>
          <div class="stat-card"><div class="stat-label">Promedio</div><div class="stat-value">$1,395</div></div>
        </div>
        <div class="card">
          <div class="card-header"><h2 class="card-title">Usos registrados</h2></div>
          <div class="timeline-item"><div class="timeline-date">Abr 2026</div><div class="timeline-thumb"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="9" rx="5" ry="6" stroke="currentColor" stroke-width=".8"/><path d="M3 24 Q3 15 12 15 Q21 15 21 24" stroke="currentColor" stroke-width=".8" fill="none"/></svg></div><div class="timeline-info"><h4>L'Oréal · Revitalift</h4><div class="meta">$2,100</div></div><div class="timeline-territory">🇦🇷 🇨🇱 🇺🇾</div><div class="timeline-status"><span class="badge active">Activo</span></div></div>
          <div class="timeline-item"><div class="timeline-date">Feb 2026</div><div class="timeline-thumb"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="9" rx="5" ry="6" stroke="currentColor" stroke-width=".8"/><path d="M3 24 Q3 15 12 15 Q21 15 21 24" stroke="currentColor" stroke-width=".8" fill="none"/></svg></div><div class="timeline-info"><h4>Pepsi · Summer</h4><div class="meta">$3,200</div></div><div class="timeline-territory">🇦🇷 🇧🇷</div><div class="timeline-status"><span class="badge locked">Bloqueado</span></div></div>
        </div>
      </div>

      <!-- APPROVALS -->
      <div class="page" id="page-approvals">
        <div class="page-header"><div><div class="page-label">Aprobaciones pendientes</div><h1 class="page-title"><em>3 proyectos</em> esperando tu revisión.</h1></div></div>
        <div class="approval-card">
          <div class="approval-header"><div><div class="approval-brand">Samsung Galaxy Z Flip 7</div><div class="approval-cat"><span class="cat-tag">IAB-575</span><span>Smartphones · LATAM</span></div></div><div class="approval-deadline">Fecha límite<strong>28 abr</strong></div></div>
          <div class="approval-body"><div class="approval-preview">PLACEHOLDER_CAMPAIGN_APPROVAL</div><div class="approval-details"><div class="detail-row"><div class="detail-label">Cliente</div><div>Samsung · BBDO Buenos Aires</div></div><div class="detail-row"><div class="detail-label">Período</div><div>15 may - 15 nov 2026</div></div><div class="detail-row"><div class="detail-label">Fee</div><div>$8,500 (tu parte: $5,525)</div></div></div></div>
          <div class="approval-footer"><div class="approval-impact">⚠ Aprobar bloquea Apple, Xiaomi hasta nov 2027</div><div style="display:flex;gap:.5rem"><button class="btn ghost small">Cambios</button><button class="btn danger small">Rechazar</button><button class="btn primary small">Aprobar</button></div></div>
        </div>
        <div class="approval-card">
          <div class="approval-header"><div><div class="approval-brand">Natura Beauty Essentials</div><div class="approval-cat"><span class="cat-tag">IAB-204</span><span>Cosmética · Brasil</span></div></div><div class="approval-deadline">Fecha límite<strong>3 may</strong></div></div>
          <div class="approval-body"><div class="approval-preview">PLACEHOLDER_LIFESTYLE_APPROVAL</div><div class="approval-details"><div class="detail-row"><div class="detail-label">Cliente</div><div>Natura &Co · Directo</div></div><div class="detail-row"><div class="detail-label">Período</div><div>1 jun - 1 dic 2026</div></div><div class="detail-row"><div class="detail-label">Fee</div><div>$8,200 (tu parte: $5,330)</div></div></div></div>
          <div class="approval-footer"><div class="approval-impact">✓ Sin conflictos competitivos</div><div style="display:flex;gap:.5rem"><button class="btn ghost small">Cambios</button><button class="btn danger small">Rechazar</button><button class="btn primary small">Aprobar</button></div></div>
        </div>
      </div>

      <!-- LOCKS -->
      <div class="page" id="page-locks">
        <div class="page-header"><div><div class="page-label">Exclusividades</div><h1 class="page-title">Tus ventanas <em>competitivas</em>.</h1></div></div>
        <div class="stats-grid">
          <div class="stat-card"><div class="stat-label">Activas</div><div class="stat-value">2</div></div>
          <div class="stat-card"><div class="stat-label">Próxima liberación</div><div class="stat-value">8 may</div></div>
          <div class="stat-card"><div class="stat-label">Bloqueadas</div><div class="stat-value">11</div></div>
          <div class="stat-card"><div class="stat-label">Protegidos</div><div class="stat-value">$8,060</div></div>
        </div>
        <div class="lock-card"><div><div class="lock-brand">L'Oréal Paris</div><div class="lock-cat"><span class="cat-tag">IAB-186</span><span>Cuidado capilar</span></div><div class="lock-comp">Bloquea: Pantene, Dove Hair, TRESemmé</div></div><div class="lock-dates"><div style="font-size:10px;text-transform:uppercase;color:var(--fg-soft)">Vence</div><strong>15 jun 2026</strong><div style="font-size:11px;color:var(--fg-muted);margin-top:.25rem">54 días</div></div><div class="lock-progress"><div class="lock-progress-label">65% transcurrido</div><div class="progress-bar"><div class="progress-fill" style="width:65%"></div></div></div></div>
        <div class="lock-card"><div><div class="lock-brand">Pepsi</div><div class="lock-cat"><span class="cat-tag">IAB-1104</span><span>Bebidas</span></div><div class="lock-comp">Bloquea: Coca-Cola, Fanta, Sprite</div></div><div class="lock-dates"><div style="font-size:10px;text-transform:uppercase;color:var(--fg-soft)">Vence</div><strong>30 ago 2026</strong><div style="font-size:11px;color:var(--fg-muted);margin-top:.25rem">130 días</div></div><div class="lock-progress"><div class="lock-progress-label">32% transcurrido</div><div class="progress-bar"><div class="progress-fill" style="width:32%"></div></div></div></div>
      </div>

      <!-- CONTRACTS -->
      <div class="page" id="page-contracts">
        <div class="page-header"><div><div class="page-label">Contratos</div><h1 class="page-title">Tu biblioteca <em>legal</em>.</h1></div></div>
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:.15em;color:var(--brand);margin:0 0 1rem">Acuerdos marco</div>
        <div class="contract-item"><div class="contract-icon"><svg width="20" height="20" viewBox="0 0 16 16" fill="none"><path d="M3 1 L13 1 L13 15 L3 15 Z" stroke="currentColor" stroke-width="1" fill="none"/></svg></div><div><div class="contract-name">UMAIN × Casting Club × Manu Jantus</div><div class="contract-meta">Tripartito · 3 años · Firmado 14 may 2025</div></div><div style="font-size:11px"><div style="color:var(--green)">✓ Vigente</div><div style="color:var(--fg-muted)">Vence may 2028</div></div><div><button class="btn ghost small">Ver</button></div></div>
        <div class="contract-item"><div class="contract-icon"><svg width="20" height="20" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="14" height="14" stroke="currentColor" stroke-width="1"/></svg></div><div><div class="contract-name">Anexo I · Matriz de consentimiento (v2)</div><div class="contract-meta">Actualizado 18 feb 2026 · 47 categorías</div></div><div style="font-size:11px"><div style="color:var(--green)">✓ Vigente</div></div><div><button class="btn ghost small">Ver</button></div></div>
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:.15em;color:var(--brand);margin:2rem 0 1rem">Consentimientos</div>
        <div class="contract-item"><div class="contract-icon"><svg width="20" height="20" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" stroke-width="1"/><path d="M2 15 Q2 9 8 9 Q14 9 14 15" stroke="currentColor" stroke-width="1" fill="none"/></svg></div><div><div class="contract-name">L'Oréal Paris · Revitalift</div><div class="contract-meta">IAB-186 · LATAM · 28 mar 2026</div></div><div style="font-size:11px"><div style="color:var(--green)">✓ Firmado</div></div><div><button class="btn ghost small">Ver</button></div></div>
      </div>

      <!-- CONSENT GATE -->
      <div class="page" id="page-gate">
        <div class="page-header"><div><div class="page-label">Compuerta de Consentimiento</div><h1 class="page-title">Rights Engine <em>v2</em></h1></div></div>
        <div style="display:flex;gap:.5rem;align-items:center;flex-wrap:wrap;justify-content:center;padding:1rem;background:#FAFAF8;border:.5px solid var(--border);border-radius:2px;margin-bottom:1.5rem">
          <span class="gate-step pass">1. Token ✓</span><span style="color:var(--fg-soft)">→</span>
          <span class="gate-step pass">2. Alcance ✓</span><span style="color:var(--fg-soft)">→</span>
          <span class="gate-step pass">3. Matriz ✓</span><span style="color:var(--fg-soft)">→</span>
          <span class="gate-step fail">4. Exclusividad ✕</span><span style="color:var(--fg-soft)">→</span>
          <span class="gate-step pending">5. AuditLog</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem">
          <div class="card"><div class="card-header"><span style="font-size:10px;text-transform:uppercase;letter-spacing:.15em;color:var(--brand)">SOLICITUD</span></div><div class="card-body" style="display:flex;flex-direction:column;gap:.75rem"><div><label class="form-label">LICENSE ID</label><input class="form-input" value="template-license-001"></div><div><label class="form-label">MARCA</label><input class="form-input" placeholder="Nike, Coca-Cola..."></div><button class="btn primary" style="width:100%">Ejecutar compuerta</button></div></div>
          <div class="card"><div class="card-header"><span style="font-size:10px;text-transform:uppercase;letter-spacing:.15em;color:var(--fg-muted)">RESULTADO</span></div><div class="card-body" style="text-align:center;padding:2rem"><div style="font-size:2.5rem;margin-bottom:.75rem">❌</div><div style="font-size:16px;font-weight:600;color:var(--red)">RECHAZADO</div><div style="font-size:12px;color:var(--fg-muted);margin-top:.5rem">Marca bloqueada por exclusividad</div></div></div>
        </div>
      </div>

    </main>
  </div>
</div>

<script>
function showView(id){document.querySelectorAll('.view').forEach(v=>{v.classList.remove('active');v.style.display='none'});const el=document.getElementById(id);if(el){el.classList.add('active');el.style.display='block'}window.scrollTo(0,0)}
function showPage(pageId){document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));const page=document.getElementById('page-'+pageId);if(page)page.classList.add('active');document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));document.querySelector(`.nav-item[data-page="${pageId}"]`)?.classList.add('active');window.scrollTo(0,0)}
</script>

</body>
</html>
HTMLEOF

echo "v03 template created!"
