import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Sidebar } from "../../../../components/sidebar";
import { useState, useRef } from "react";
import { saveCharacterSheet } from "../../../../lib/queries";

export const Route = createFileRoute("/identities/$id/avatar/")({
  component: AvatarCreationPage,
});

const ASSET_CATEGORIES = [
  { tipo: 'foto_referencia', label: 'Fotos referencia', icon: '▣', accept: 'image/*', desc: '3-5 fotos del rostro en diferentes angulos' },
  { tipo: 'video_pose', label: 'Video de pose', icon: '▶', accept: 'video/*', desc: 'Video corporal de 30-60s' },
  { tipo: 'audio_voz', label: 'Audio de voz', icon: '♢', accept: 'audio/*', desc: 'Grabacion de voz de 2-3 minutos' },
  { tipo: 'captura_4k', label: 'Captura 4K', icon: '⊕', accept: 'image/*,video/*', desc: 'Captura profesional multi-angulo' },
  { tipo: 'look_referencia', label: 'Look referencia', icon: '◈', accept: 'image/*', desc: 'Estilo de peinado, vestimenta, maquillaje' },
];

// Template demo data (Avatar DEMO ref)
const TEMPLATE_ID = 'template-identity-001';
const TEMPLATE_SHEET = {
  nombre: 'Avatar Digital - Sofia Martina',
  tipo: 'avatar', estado: 'listo', version: 1,
  descripcion: `Joven actriz y modelo argentina de 27 anios. Rostro de forma ovalada con facciones armonicas y simetricas. Piel triguena uniforme, ojos marrones expresivos de forma almendrada, y una sonrisa natural que transmite calidez y confianza. Cabello oscuro ondulado de longitud media que enmarca el rostro con naturalidad.

Su mirada es versatil: puede transmitir desde autoridad corporativa hasta cercania juvenil. La estructura facial presenta buena definicion de pomulos y mandibula suave, ideal para captura 3D y recreacion digital con alta fidelidad.

La voz es clara y modulada, con diccion perfecta del espanol rioplatense. Rango vocal amplio que permite desde tonos serenos hasta expresivos.

Perfil optimo para campanas de moda, belleza, lifestyle y contenido corporativo. Versatilidad estilistica comprobada: desde look ejecutivo hasta estetica casual-contemporanea.`,
  descripcion_auto: 'Talento femenino de 27 anios, complexion media. Rasgos faciales armoniosos con alta simetria.',
  assets: [
    { id: 'ta1', tipo: 'foto_referencia', filename: 'sofia_portrait_frontal.jpg', storage_url: 'https://d2ol7oe51mr4n9.cloudfront.net/user_2wOQxQla9e2kHVmC1Pv6AhkGTRv/db3f86ea-97a6-4e17-977d-c6a29edec680.png', descripcion: 'Retrato frontal - toma principal', orden: 1 },
    { id: 'ta2', tipo: 'foto_referencia', filename: 'sofia_portrait_perfil.jpg', storage_url: 'https://d2ol7oe51mr4n9.cloudfront.net/user_2wOQxQla9e2kHVmC1Pv6AhkGTRv/f363b50e-f6a4-4be1-8a5b-04b6f8dca775.png', descripcion: 'Perfil 3/4 - variacion de angulo', orden: 2 },
    { id: 'ta3', tipo: 'look_referencia', filename: 'sofia_look_casual.jpg', storage_url: '', descripcion: 'Look casual lifestyle', orden: 3 },
    { id: 'ta4', tipo: 'audio_voz', filename: 'sofia_grabacion_voz.mp3', storage_url: '', descripcion: 'Guion fonetico espanol rioplatense', orden: 4 },
  ],
  attributes: [
    { id: 'tattr1', atributo: 'Edad aparente', valor: '25-30 anios', fuente: 'auto' },
    { id: 'tattr2', atributo: 'Genero', valor: 'Femenino', fuente: 'auto' },
    { id: 'tattr3', atributo: 'Tono de voz', valor: 'Claro, modulado, espanol rioplatense', fuente: 'manual' },
    { id: 'tattr4', atributo: 'Estilo', valor: 'Versatil: ejecutivo, casual, fashion', fuente: 'manual' },
    { id: 'tattr5', atributo: 'Contexto de uso', valor: 'Publicidad, campanas digitales, contenido corporativo', fuente: 'manual' },
    { id: 'tattr6', atributo: 'Tipo de rostro', valor: 'Ovalado, alta simetria', fuente: 'auto' },
    { id: 'tattr7', atributo: 'Color de ojos', valor: 'Marrones expresivos', fuente: 'auto' },
    { id: 'tattr8', atributo: 'Tipo de cabello', valor: 'Oscuro, ondulado, medio', fuente: 'auto' },
  ],
};

interface Asset { id: string; tipo: string; filename: string; file_size?: number; storage_url: string; descripcion: string; orden: number; }
interface Attr { id: string; atributo: string; valor: string; fuente: string; }

function AvatarCreationPage() {
  const params = useParams({ from: "/identities/$id/avatar/" });
  const identityId = params.id;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeCategory, setActiveCategory] = useState('foto_referencia');

  const isTemplate = identityId === TEMPLATE_ID;
  const template = isTemplate ? TEMPLATE_SHEET : null;

  // Identity info — template data for demo, basic info for new identities
  const identity = isTemplate
    ? { id: TEMPLATE_ID, nombre: 'Avatar DEMO ref', tier: 'A', estado: 'activo' }
    : { id: identityId, nombre: 'Nuevo Avatar/Clon', tier: 'B', estado: 'activo' };

  const [charName, setCharName] = useState(template?.nombre ?? '');
  const [description, setDescription] = useState(template?.descripcion ?? '');
  const [autoDescription] = useState(template?.descripcion_auto ?? '');
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);
  const [assets, setAssets] = useState<Asset[]>(template?.assets ?? []);
  const [attributes, setAttributes] = useState<Attr[]>(template?.attributes ?? [
    { id: 'd1', atributo: 'Edad aparente', valor: '', fuente: 'manual' },
    { id: 'd2', atributo: 'Genero', valor: '', fuente: 'manual' },
    { id: 'd3', atributo: 'Tono de voz', valor: '', fuente: 'manual' },
    { id: 'd4', atributo: 'Estilo', valor: '', fuente: 'manual' },
  ]);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [showTrainingMenu, setShowTrainingMenu] = useState(false);
  const [trainingOption, setTrainingOption] = useState<string>('todo');
  const [saved, setSaved] = useState(false);

  const trainingOptions = [
    { value: 'todo', label: 'TODO', desc: 'Entrenar avatar visual + clon de voz + character sheet' },
    { value: 'avatar_visual', label: 'AVATAR VISUAL', desc: 'Solo entrenar la identidad visual (Soul ID)' },
    { value: 'avatar_voz', label: 'AVATAR DE VOZ', desc: 'Solo clonar la voz (Seed Audio)' },
    { value: 'character_sheet', label: 'SOLO CHARACTER SHEET', desc: 'Guardar perfil sin entrenar' },
  ];

  const handleTrainingAction = (option: string) => {
    setTrainingOption(option);
    setShowTrainingMenu(false);
    if (option === 'character_sheet') {
      handleSaveProfile();
    } else {
      setSaved(true);
    }
    // In future: call the corresponding Higgsfield pipeline
    // option = 'todo' → Pipeline A + B + C
    // option = 'avatar_visual' → Pipeline A only
    // option = 'avatar_voz' → voice clone only
    // option = 'character_sheet' → just save (calls handleSaveProfile)
  };

  const [savingProfile, setSavingProfile] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setSaveError('');
    try {
      const result = await saveCharacterSheet({
        data: {
          identity_id: identityId,
          nombre: charName || (identity?.nombre ?? 'Nuevo Avatar'),
          descripcion: description,
          descripcion_auto: autoDescription,
          assets: assets.map(a => ({
            tipo: a.tipo,
            filename: a.filename,
            storage_url: a.storage_url,
            descripcion: a.descripcion,
            orden: a.orden,
          })),
          attributes: attributes.map(a => ({
            atributo: a.atributo,
            valor: a.valor,
            fuente: a.fuente,
          })),
        },
      });
      if (result.success) {
        setSaved(true);
      } else {
        setSaveError('Error al guardar el perfil');
      }
    } catch (err: any) {
      setSaveError(err?.message ?? 'Error de conexion al guardar');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      setAssets(prev => [...prev, {
        id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        tipo: activeCategory, filename: file.name, file_size: file.size,
        storage_url: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
        descripcion: '', orden: prev.length + 1,
      }]);
    }
    e.target.value = '';
  };

  const removeAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
    if (selectedAsset === id) setSelectedAsset(null);
  };

  const generateDescription = () => {
    setIsAutoGenerating(true);
    setTimeout(() => {
      const foto = assets.filter(a => a.tipo.match(/foto|look|captura/)).length;
      const audio = assets.filter(a => a.tipo === 'audio_voz').length;
      const video = assets.filter(a => a.tipo === 'video_pose').length;
      let desc = '';
      if (foto > 0) desc += 'Persona de facciones armonicas con alta simetria facial. Mirada expresiva y natural frente a camara. Piel de tono uniforme. Versatilidad para distintos estilos de iluminacion y angulos de captura. ';
      if (audio > 0) desc += 'Voz clara y modulada con buena diccion y proyeccion. Rango vocal versatil, capaz de transmitir matices emocionales con naturalidad. ';
      if (video > 0) desc += 'Movimientos corporales fluidos y naturales. Presencia escenica autentica con gestualidad expresiva. ';
      desc += '\n\nPerfil optimo para generacion de avatar digital. El talento presenta caracteristicas ideales para clonacion digital con alta fidelidad visual y naturalidad en movimiento.';
      setDescription(desc);
      setIsAutoGenerating(false);
    }, 1200);
  };

  const updateAttr = (id: string, valor: string) => setAttributes(prev => prev.map(a => a.id === id ? { ...a, valor, fuente: 'manual' } : a));
  const updateAttrLabel = (id: string, atributo: string) => setAttributes(prev => prev.map(a => a.id === id ? { ...a, atributo } : a));
  const addAttribute = () => setAttributes(prev => [...prev, { id: `a-${Date.now()}`, atributo: '', valor: '', fuente: 'manual' }]);

  const assetsByCategory = (tipo: string) => assets.filter(a => a.tipo === tipo);
  const mainPhoto = assets.find(a => a.tipo === 'foto_referencia' && a.storage_url);

  return (
    <div className="umain-layout">
      <Sidebar />
      <main className="umain-main" style={{maxWidth:'1400px', overflow:'visible'}}>
        {/* Header */}
        <div className="umain-page-header" style={{marginBottom:'1rem'}}>
          <div>
            <Link to="/identities/$id" params={{id: identity.id}} className="formula-text"
              style={{color:'var(--color-umain-accent)', textDecoration:'none', fontSize:'0.75rem'}}>
              ← {identity.nombre}
            </Link>
            <h1 style={{marginTop:'0.25rem'}}>Creacion de Avatar/Clon</h1>
            <p className="formula-text mt-1">Character Sheet para clon digital</p>
          </div>
          <div className="umain-page-header__actions" style={{position:'relative'}}>
            <span className={`umain-status-badge ${template ? 'umain-status-badge--active' : saved ? 'umain-status-badge--active' : 'umain-status-badge--borrador'}`} style={{fontSize:'0.7rem'}}>
              v{1} · {template ? 'listo' : saved ? 'guardado' : 'borrador'}
            </span>
            <button className="umain-button-outline" style={{fontSize:'0.75rem'}} onClick={handleSaveProfile} disabled={savingProfile || (assets.length === 0 && !description)}>
              {savingProfile ? 'Guardando...' : 'Guardar perfil sin entrenar'}
            </button>
            {saveError && <span style={{color:'var(--color-status-error)', fontSize:'0.7rem', fontFamily:'Geist Mono, monospace'}}>{saveError}</span>}
            <div style={{position:'relative'}}>
              <button className="umain-button-primary" style={{fontSize:'0.75rem'}}
                onClick={() => setShowTrainingMenu(!showTrainingMenu)}
                disabled={assets.length === 0}>
                {template ? 'Regenerar avatar' : 'Iniciar entrenamiento'} ▾
              </button>
              {showTrainingMenu && (
                <div style={{
                  position:'fixed', top:0, left:0, right:0, bottom:0, zIndex:49,
                }} onClick={() => setShowTrainingMenu(false)} />
              )}
              {showTrainingMenu && (
                <div style={{
                  position:'absolute', top:'100%', right:0, marginTop:'0.25rem',
                  background:'var(--color-umain-surface)', border:'1px solid var(--color-umain-border)',
                  borderRadius:'0.5rem', padding:'0.25rem', zIndex:50,
                  minWidth:'280px', boxShadow:'0 8px 32px rgba(0,0,0,0.4)',
                }}>
                  {trainingOptions.map(opt => (
                    <button key={opt.value} onClick={() => handleTrainingAction(opt.value)}
                      style={{
                        display:'block', width:'100%', textAlign:'left', padding:'0.625rem 0.75rem',
                        border:'none', borderRadius:'0.375rem', cursor:'pointer',
                        background: trainingOption === opt.value ? 'var(--color-umain-accent-dim)' : 'transparent',
                        color: trainingOption === opt.value ? 'var(--color-umain-accent)' : 'var(--color-umain-text)',
                        fontFamily:"'Geist', sans-serif", fontSize:'0.8rem',
                        transition:'all 0.1s',
                      }}
                      onMouseOver={e => { e.currentTarget.style.background = 'var(--color-umain-accent-dim)'; }}
                      onMouseOut={e => { if (trainingOption !== opt.value) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <div style={{fontWeight:600}}>{opt.label}</div>
                      <div className="formula-text" style={{fontSize:'0.65rem', color:'var(--color-umain-text-dim)', marginTop:'0.125rem'}}>{opt.desc}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {isTemplate && (
          <div className="wireframe-box" style={{padding:'0.75rem 1rem', marginBottom:'1rem', borderLeft:'3px solid var(--color-umain-accent)'}}>
            <div className="formula-text formula-text--accent" style={{fontSize:'0.7rem', display:'flex', justifyContent:'space-between'}}>
              <span>◈ TEMPLATE DEMO — Avatar precargado con datos de ejemplo. Todos los assets y atributos son editables.</span>
              <Link to="/identities" className="formula-text" style={{color:'var(--color-umain-accent-secondary)'}}>Ver lista →</Link>
            </div>
          </div>
        )}

        {!isTemplate && (
          <div className="wireframe-box" style={{padding:'0.75rem 1rem', marginBottom:'1rem', borderLeft:'3px solid var(--color-umain-accent-secondary)'}}>
            <div className="formula-text formula-text--pink" style={{fontSize:'0.7rem'}}>
              ◈ Nuevo Avatar/Clon — Comenza subiendo fotos de referencia para construir el Character Sheet.
            </div>
          </div>
        )}

        {/* Stats row */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', marginBottom:'1.5rem'}}>
          <div className="wireframe-box" style={{padding:'1.25rem'}}>
            <div className="formula-text formula-text--accent" style={{fontSize:'0.75rem', marginBottom:'0.75rem', textTransform:'uppercase'}}>IDENTIDAD</div>
            <div style={{display:'flex', gap:'0.75rem', alignItems:'center', marginBottom:'0.75rem'}}>
              <div style={{width:40, height:40, borderRadius:'0.5rem', background:'var(--color-umain-surface-alt)', border:'1px solid var(--color-umain-border)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden'}}>
                {mainPhoto ? <img src={mainPhoto.storage_url} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                  : <span style={{fontWeight:700, fontSize:'0.9rem'}}>{identity.nombre?.charAt(0) ?? '?'}</span>}
              </div>
              <div>
                <div style={{fontWeight:600, fontSize:'0.9rem'}}>{identity.nombre}</div>
                <div className="formula-text" style={{fontSize:'0.65rem', color:'var(--color-umain-text-dim)'}}>Tier {identity.tier} · {identity.estado}</div>
              </div>
            </div>
            <input className="umain-input" placeholder="Nombre del avatar/clon" value={charName}
              onChange={(e) => setCharName(e.target.value)} />
          </div>
          <div className="wireframe-box" style={{padding:'1.25rem'}}>
            <div className="formula-text" style={{fontSize:'0.75rem', color:'var(--color-umain-text-dim)', marginBottom:'0.75rem', textTransform:'uppercase'}}>RESUMEN</div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:'0.75rem'}}>
              {[
                { label: 'Assets', value: assets.length.toString() },
                { label: 'Atributos', value: attributes.filter(a => a.valor).length.toString() },
                { label: 'Descripcion', value: description ? 'Lista' : 'Pendiente' },
                { label: 'Estado', value: template ? 'Listo' : 'Edicion' },
              ].map(s => (
                <div key={s.label}>
                  <div className="umain-stat-card__label">{s.label}</div>
                  <div className="umain-stat-card__value" style={{fontSize:'1.5rem'}}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Three column layout */}
        <div style={{display:'grid', gridTemplateColumns:'300px 1fr 360px', gap:'1.5rem'}}>
          {/* LEFT: Assets */}
          <div className="umain-card">
            <div className="umain-card__header">
              <span className="formula-text formula-text--accent" style={{fontSize:'0.7rem', textTransform:'uppercase'}}>ASSETS</span>
              <button className="umain-button-ghost" style={{fontSize:'0.7rem', padding:'0.25rem 0.5rem'}}
                onClick={() => fileInputRef.current?.click()}>+ Subir</button>
            </div>
            <input ref={fileInputRef} type="file" multiple accept={ASSET_CATEGORIES.find(c => c.tipo === activeCategory)?.accept} style={{display:'none'}} onChange={handleFileUpload} />
            <div style={{padding:'0.5rem', borderBottom:'1px solid var(--color-umain-border)', display:'flex', gap:'0.25rem', flexWrap:'wrap'}}>
              {ASSET_CATEGORIES.map(cat => (
                <button key={cat.tipo} onClick={() => setActiveCategory(cat.tipo)}
                  style={{padding:'0.2rem 0.4rem', fontSize:'0.6rem', borderRadius:'0.25rem', fontFamily:"'Geist Mono', monospace",
                    border: activeCategory === cat.tipo ? '1px solid var(--color-umain-accent)' : '1px solid transparent',
                    background: activeCategory === cat.tipo ? 'var(--color-umain-accent-dim)' : 'transparent',
                    color: activeCategory === cat.tipo ? 'var(--color-umain-accent)' : 'var(--color-umain-text-dim)', cursor:'pointer'}}>
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
            <div className="umain-card__body" style={{padding:'0.75rem', minHeight:'180px'}}>
              {assetsByCategory(activeCategory).length > 0 ? (
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem'}}>
                  {assetsByCategory(activeCategory).map(asset => (
                    <div key={asset.id} onClick={() => setSelectedAsset(asset.id)}
                      style={{position:'relative', border:selectedAsset===asset.id?'2px solid var(--color-umain-accent)':'1px solid var(--color-umain-border)',
                        borderRadius:'0.375rem', overflow:'hidden', cursor:'pointer', aspectRatio:'1', background:'var(--color-umain-surface-alt)'}}>
                      {asset.storage_url ? (
                        <img src={asset.storage_url} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                      ) : (
                        <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',flexDirection:'column'}}>
                          <span style={{fontSize:'1.25rem',opacity:0.5}}>{ASSET_CATEGORIES.find(c=>c.tipo===activeCategory)?.icon}</span>
                          <span className="formula-text" style={{fontSize:'0.55rem',color:'var(--color-umain-text-dim)'}}>{asset.filename.slice(0,18)}</span>
                        </div>
                      )}
                      <button onClick={(e)=>{e.stopPropagation();removeAsset(asset.id);}}
                        style={{position:'absolute',top:'0.2rem',right:'0.2rem',width:'18px',height:'18px',borderRadius:'50%',
                          border:'none',background:'rgba(239,68,68,0.8)',color:'#fff',fontSize:'0.6rem',cursor:'pointer'}}>×</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div onClick={()=>fileInputRef.current?.click()}
                  style={{border:'2px dashed var(--color-umain-border)',borderRadius:'0.5rem',padding:'2rem 1rem',textAlign:'center',cursor:'pointer'}}>
                  <div style={{fontSize:'2rem',marginBottom:'0.5rem',opacity:0.4}}>{ASSET_CATEGORIES.find(c=>c.tipo===activeCategory)?.icon}</div>
                  <div className="formula-text" style={{fontSize:'0.7rem',color:'var(--color-umain-text-dim)'}}>Solta archivos aca</div>
                  <div className="formula-text" style={{fontSize:'0.6rem',color:'var(--color-umain-text-dim)',marginTop:'0.5rem'}}>{ASSET_CATEGORIES.find(c=>c.tipo===activeCategory)?.desc}</div>
                </div>
              )}
            </div>
          </div>

          {/* CENTER: Character Sheet Preview */}
          <div className="umain-card">
            <div className="umain-card__header">
              <span className="formula-text formula-text--pink" style={{fontSize:'0.7rem',textTransform:'uppercase'}}>CHARACTER SHEET</span>
              <span className="formula-text" style={{fontSize:'0.65rem',color:'var(--color-umain-text-dim)'}}>preview</span>
            </div>
            <div className="umain-card__body" style={{padding:'1.25rem'}}>
              <div className="wireframe-box" style={{padding:0,overflow:'hidden'}}>
                <div style={{padding:'1.25rem',background:'linear-gradient(135deg,rgba(125,212,252,0.08),rgba(244,168,200,0.08))',
                  borderBottom:'1px solid var(--color-umain-border)',display:'flex',gap:'1rem',alignItems:'center'}}>
                  <div style={{width:72,height:72,borderRadius:'0.625rem',background:'var(--color-umain-surface-alt)',
                    border:'1px solid var(--color-umain-border)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,overflow:'hidden'}}>
                    {mainPhoto ? <img src={mainPhoto.storage_url} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                      : <span style={{fontSize:'2rem',opacity:0.3,fontWeight:700}}>{charName?.charAt(0)??'?'}</span>}
                  </div>
                  <div style={{flex:1}}>
                    <h2 style={{fontSize:'1.125rem',fontWeight:700,marginBottom:'0.125rem'}}>{charName||'Nombre del avatar/clon'}</h2>
                    <div style={{display:'flex',gap:'0.375rem',flexWrap:'wrap'}}>
                      {attributes.filter(a=>a.valor).slice(0,3).map(a=>(
                        <span key={a.id} className="umain-tag" style={{fontSize:'0.55rem'}}>{a.atributo}: {a.valor}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{padding:'1rem',borderBottom:'1px solid var(--color-umain-border)'}}>
                  <div className="formula-text" style={{fontSize:'0.6rem',color:'var(--color-umain-text-dim)',marginBottom:'0.375rem',textTransform:'uppercase'}}>DESCRIPCION</div>
                  <p style={{fontSize:'0.8rem',lineHeight:'1.6',color:description?'var(--color-umain-text)':'var(--color-umain-text-dim)',whiteSpace:'pre-line'}}>
                    {description||'Sin descripcion. Subi fotos y usa Auto-generar.'}
                  </p>
                </div>
                {assets.length>0 && (
                  <div style={{padding:'0.75rem 1rem',borderBottom:'1px solid var(--color-umain-border)'}}>
                    <div className="formula-text" style={{fontSize:'0.6rem',color:'var(--color-umain-text-dim)',marginBottom:'0.375rem',textTransform:'uppercase'}}>ASSETS ({assets.length})</div>
                    <div style={{display:'flex',gap:'0.375rem',overflowX:'auto'}}>
                      {assets.map(asset=>(
                        <div key={asset.id} style={{width:48,height:48,borderRadius:'0.375rem',border:'1px solid var(--color-umain-border)',
                          background:'var(--color-umain-surface-alt)',flexShrink:0,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center'}}>
                          {asset.storage_url ? <img src={asset.storage_url} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                            : <span style={{fontSize:'1rem',opacity:0.4}}>{asset.tipo==='audio_voz'?'♢':'▶'}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{padding:'0.75rem 1rem'}}>
                  <div className="formula-text" style={{fontSize:'0.6rem',color:'var(--color-umain-text-dim)',marginBottom:'0.5rem',textTransform:'uppercase'}}>ATRIBUTOS</div>
                  {attributes.filter(a=>a.atributo).length>0 ? (
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.25rem'}}>
                      {attributes.filter(a=>a.atributo).map(a=>(
                        <div key={a.id} style={{display:'flex',justifyContent:'space-between',padding:'0.2rem 0',borderBottom:'1px solid var(--color-umain-border)'}}>
                          <span className="formula-text" style={{fontSize:'0.65rem',color:'var(--color-umain-text-dim)'}}>{a.atributo}</span>
                          <span className="formula-text" style={{fontSize:'0.65rem',color:a.valor?'var(--color-umain-text)':'var(--color-umain-text-dim)'}}>{a.valor||'—'}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="formula-text" style={{fontSize:'0.65rem',color:'var(--color-umain-text-dim)'}}>Sin atributos</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Editor */}
          <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            <div className="umain-card">
              <div className="umain-card__header">
                <span className="formula-text formula-text--accent" style={{fontSize:'0.7rem',textTransform:'uppercase'}}>DESCRIPCION</span>
                <button className="umain-button-outline" style={{fontSize:'0.65rem',padding:'0.25rem 0.5rem'}}
                  onClick={generateDescription} disabled={isAutoGenerating||assets.length===0}>
                  {isAutoGenerating?'Generando...':'Auto-generar'}
                </button>
              </div>
              <div className="umain-card__body" style={{padding:'0.75rem'}}>
                <textarea className="umain-input" rows={10}
                  placeholder="Describe el avatar/clon digital aqui. Subi fotos y usa 'Auto-generar'."
                  value={description} onChange={(e)=>setDescription(e.target.value)}
                  style={{resize:'vertical',fontFamily:"'Geist', sans-serif",fontSize:'0.8rem',lineHeight:'1.5'}} />
                <div className="formula-text" style={{fontSize:'0.6rem',color:'var(--color-umain-text-dim)',marginTop:'0.375rem',display:'flex',justifyContent:'space-between'}}>
                  <span>{description.length} caracteres</span>
                  <span>Descripcion para prompt de generacion</span>
                </div>
              </div>
            </div>
            <div className="umain-card">
              <div className="umain-card__header">
                <span className="formula-text formula-text--pink" style={{fontSize:'0.7rem',textTransform:'uppercase'}}>ATRIBUTOS</span>
                <button className="umain-button-ghost" style={{fontSize:'0.65rem',padding:'0.25rem 0.5rem'}} onClick={addAttribute}>+</button>
              </div>
              <div className="umain-card__body" style={{padding:'0.75rem'}}>
                <div style={{display:'flex',flexDirection:'column',gap:'0.375rem'}}>
                  {attributes.map(attr=>(
                    <div key={attr.id} style={{display:'flex',gap:'0.375rem',alignItems:'center'}}>
                      <input className="umain-input" style={{width:'90px',fontSize:'0.65rem',padding:'0.3rem 0.4rem'}}
                        placeholder="Atributo" value={attr.atributo}
                        onChange={(e)=>updateAttrLabel(attr.id,e.target.value)} />
                      <input className="umain-input" style={{flex:1,fontSize:'0.65rem',padding:'0.3rem 0.4rem'}}
                        placeholder="Valor" value={attr.valor}
                        onChange={(e)=>updateAttr(attr.id,e.target.value)} />
                      <span className="formula-text" style={{fontSize:'0.5rem',color:attr.fuente==='auto'?'var(--color-umain-accent)':'var(--color-umain-text-dim)',width:'24px',textAlign:'center'}}>
                        {attr.fuente==='auto'?'AI':'M'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
