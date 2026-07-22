import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "../../components/sidebar";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/settings/providers")({
  component: ProvidersPage,
});

// ============================================================
// TYPES
// ============================================================

interface Provider {
  id: string;
  nombre: string;
  tipo: string;
  api_url: string;
  capabilities: string; // JSON string
  priority: number;
  estado: string;
  health_score: number;
  avg_latency_ms: number;
  total_calls: number;
  total_failures: number;
  activo: number;
  model_count?: number;
}

interface ProviderModel {
  id: string;
  model_id: string;
  display_name: string;
  task_type: string;
  capabilities: string;
  credits_per_call: number;
  priority: number;
}

// ============================================================
// PROVIDER TYPES
// ============================================================

const PROVIDER_TYPES = [
  { value: 'higgsfield', label: 'Higgsfield AI', icon: '◈', desc: 'Soul ID, GPT Image 2, Nano Banana, Seedance, Seedream' },
  { value: 'fal_ai', label: 'FAL.ai', icon: '☁', desc: 'Flux, Stable Diffusion, AnimateDiff' },
  { value: 'kling', label: 'Kling AI', icon: '▶', desc: 'Kling 1.5, 2.0, 3.0' },
  { value: 'elevenlabs', label: 'ElevenLabs', icon: '🎙', desc: 'Voice cloning, TTS' },
  { value: 'comfyui', label: 'ComfyUI (Local)', icon: '🖥', desc: 'SDXL, Flux, custom workflows' },
  { value: 'ollama', label: 'Ollama (Local)', icon: '🖥', desc: 'Local LLM inference' },
  { value: 'openai_compatible', label: 'OpenAI Compatible', icon: '☁', desc: 'Any OpenAI-compatible API' },
  { value: 'custom', label: 'Custom API', icon: '◈', desc: 'Custom endpoint' },
];

// ============================================================
// PROVIDERS PAGE
// ============================================================

function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      // In production, call: const data = await getProviders();
      // For now, use mock data
      const mockProviders: Provider[] = [
        {
          id: 'higgsfield-prod',
          nombre: 'Higgsfield Production',
          tipo: 'higgsfield',
          api_url: 'https://api.higgsfield.ai/v1',
          capabilities: JSON.stringify({
            image: { models: ['gpt_image_2', 'nano_banana_pro', 'seedream_v5_pro'] },
            video: { models: ['seedance_2_0', 'kling3_0', 'wan_2_6'] },
            voice: { models: ['seed_audio'] },
            face_correction: { models: ['seedream_v5_pro'] }
          }),
          priority: 1,
          estado: 'activo',
          health_score: 0.95,
          avg_latency_ms: 4500,
          total_calls: 1247,
          total_failures: 23,
          activo: 1,
          model_count: 7
        },
        {
          id: 'fal-ai-prod',
          nombre: 'FAL.ai',
          tipo: 'fal_ai',
          api_url: 'https://fal.run',
          capabilities: JSON.stringify({
            image: { models: ['flux-pro', 'flux-realism', 'stable-diffusion-xl'] },
            video: { models: ['animate-diff'] }
          }),
          priority: 2,
          estado: 'activo',
          health_score: 0.90,
          avg_latency_ms: 6200,
          total_calls: 342,
          total_failures: 12,
          activo: 1,
          model_count: 4
        },
        {
          id: 'elevenlabs-prod',
          nombre: 'ElevenLabs',
          tipo: 'elevenlabs',
          api_url: 'https://api.elevenlabs.io/v1',
          capabilities: JSON.stringify({
            voice: { models: ['eleven_multilingual_v2', 'eleven_turbo_v2'] }
          }),
          priority: 2,
          estado: 'activo',
          health_score: 0.92,
          avg_latency_ms: 3200,
          total_calls: 89,
          total_failures: 2,
          activo: 1,
          model_count: 2
        },
        {
          id: 'comfyui-local',
          nombre: 'ComfyUI Local',
          tipo: 'comfyui',
          api_url: 'http://localhost:8188',
          capabilities: JSON.stringify({
            image: { models: ['sdxl', 'flux-dev', 'stable-diffusion-3'] }
          }),
          priority: 3,
          estado: 'offline',
          health_score: 0.0,
          avg_latency_ms: 0,
          total_calls: 0,
          total_failures: 0,
          activo: 1,
          model_count: 3
        }
      ];

      setProviders(mockProviders);
    } catch (error) {
      console.error('Error loading providers:', error);
    }
    setLoading(false);
  };

  const handleTestConnection = async (providerId: string) => {
    setTestingId(providerId);
    // Simulate health check
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setProviders(prev => prev.map(p => 
      p.id === providerId 
        ? { ...p, health_score: 0.95, estado: 'activo', avg_latency_ms: 4500 }
        : p
    ));
    setTestingId(null);
  };

  const handleDelete = async (providerId: string) => {
    if (confirm('¿Eliminar este proveedor?')) {
      setProviders(prev => prev.filter(p => p.id !== providerId));
    }
  };

  const getProviderIcon = (tipo: string) => {
    const p = PROVIDER_TYPES.find(t => t.value === tipo);
    return p?.icon || '◈';
  };

  const getProviderLabel = (tipo: string) => {
    const p = PROVIDER_TYPES.find(t => t.value === tipo);
    return p?.label || tipo;
  };

  const getCapabilities = (capsJson: string) => {
    try {
      const caps = JSON.parse(capsJson);
      const result = [];
      if (caps.image?.models?.length > 0) result.push({ type: 'image', count: caps.image.models.length });
      if (caps.video?.models?.length > 0) result.push({ type: 'video', count: caps.video.models.length });
      if (caps.voice?.models?.length > 0) result.push({ type: 'voice', count: caps.voice.models.length });
      if (caps.face_correction?.models?.length > 0) result.push({ type: 'correction', count: caps.face_correction.models.length });
      return result;
    } catch {
      return [];
    }
  };

  const getSuccessRate = (p: Provider) => {
    if (p.total_calls === 0) return '—';
    return Math.round((1 - p.total_failures / p.total_calls) * 100) + '%';
  };

  return (
    <div className="umain-layout">
      <Sidebar />
      <main className="umain-main" style={{ maxWidth: '1200px' }}>
        {/* Header */}
        <div className="umain-page-header">
          <div>
            <div className="umain-page-label">Configuración</div>
            <h1>Proveedores de <em>Generación</em></h1>
            <p className="umain-page-description">
              Configura las APIs de generación de imágenes, video y voz. 
              Soporta proveedores cloud y locales (ComfyUI, Ollama, etc.)
            </p>
          </div>
          <div className="umain-page-header__actions">
            <button 
              className="umain-button-ghost umain-button-sm"
              onClick={() => providers.forEach(p => handleTestConnection(p.id))}
            >
              Test Todos
            </button>
            <button 
              className="umain-button-primary"
              onClick={() => { setEditingProvider(null); setShowModal(true); }}
            >
              + Agregar Proveedor
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="umain-stats-grid" style={{ marginBottom: '2rem' }}>
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Proveedores Activos</div>
            <div className="umain-stat-card__value">
              {providers.filter(p => p.estado === 'activo').length}
            </div>
            <div className="umain-stat-card__detail">
              {providers.length} total configurados
            </div>
          </div>
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Modelos Disponibles</div>
            <div className="umain-stat-card__value">
              {providers.reduce((sum, p) => sum + (p.model_count || 0), 0)}
            </div>
            <div className="umain-stat-card__detail">
              Across all providers
            </div>
          </div>
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Llamadas Totales</div>
            <div className="umain-stat-card__value">
              {providers.reduce((sum, p) => sum + p.total_calls, 0).toLocaleString()}
            </div>
            <div className="umain-stat-card__detail">
              Tasa éxito: {providers.reduce((sum, p) => sum + p.total_calls, 0) > 0 
                ? Math.round((1 - providers.reduce((sum, p) => sum + p.total_failures, 0) / 
                    providers.reduce((sum, p) => sum + p.total_calls, 0)) * 100)
                : 0}%
            </div>
          </div>
          <div className="umain-stat-card">
            <div className="umain-stat-card__label">Salud Promedio</div>
            <div className="umain-stat-card__value">
              {Math.round(providers.reduce((sum, p) => sum + p.health_score, 0) / providers.length * 100)}%
            </div>
            <div className="umain-stat-card__detail">
              Todos los proveedores
            </div>
          </div>
        </div>

        {/* Provider Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {providers.map(provider => (
            <div key={provider.id} className="umain-card">
              <div className="umain-card__header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* Icon */}
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '0.5rem',
                    background: provider.tipo === 'higgsfield' 
                      ? 'linear-gradient(135deg, rgba(125,212,252,0.2), rgba(244,168,200,0.2))'
                      : 'var(--color-umain-bg-alt)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '0.5px solid var(--color-umain-border)',
                  }}>
                    <span style={{ fontSize: '1.25rem' }}>
                      {getProviderIcon(provider.tipo)}
                    </span>
                  </div>
                  
                  {/* Info */}
                  <div>
                    <h3 style={{ fontWeight: 600, marginBottom: '0.125rem' }}>
                      {provider.nombre}
                    </h3>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <span className="formula-text" style={{ fontSize: '0.7rem', color: 'var(--color-umain-text-dim)' }}>
                        {getProviderLabel(provider.tipo)}
                      </span>
                      <span className={`umain-status-badge ${
                        provider.estado === 'activo' ? 'umain-status-badge--active' :
                        provider.estado === 'degraded' ? 'umain-status-badge--pending' :
                        'umain-status-badge--error'
                      }`} style={{ fontSize: '0.65rem' }}>
                        {provider.estado}
                      </span>
                      <span className="umain-status-badge" style={{ 
                        fontSize: '0.6rem',
                        background: 'var(--color-umain-bg-alt)',
                        color: 'var(--color-umain-text-dim)'
                      }}>
                        Priority {provider.priority}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Capabilities */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {getCapabilities(provider.capabilities).map(cap => (
                    <span key={cap.type} style={{
                      padding: '3px 8px',
                      fontSize: '10px',
                      fontFamily: "'Archivo', sans-serif",
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderRadius: '2px',
                      background: cap.type === 'image' ? 'rgba(125,212,252,0.15)' :
                                  cap.type === 'video' ? 'rgba(244,168,200,0.15)' :
                                  cap.type === 'voice' ? 'rgba(122,180,122,0.15)' :
                                  'rgba(184,154,74,0.15)',
                      color: cap.type === 'image' ? '#7dd4fc' :
                             cap.type === 'video' ? '#f4a8c8' :
                             cap.type === 'voice' ? '#4A7A52' :
                             '#B89A4A',
                    }}>
                      {cap.type === 'image' ? '🖼' : 
                       cap.type === 'video' ? '🎬' : 
                       cap.type === 'voice' ? '🎙' : '🔧'} 
                      {cap.type} ({cap.count})
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Stats */}
              <div style={{ padding: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
                  <div>
                    <div className="formula-text" style={{ fontSize: '0.65rem', color: 'var(--color-umain-text-dim)' }}>
                      SALUD
                    </div>
                    <div style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: 600,
                      color: provider.health_score >= 0.8 ? 'var(--color-status-active)' :
                             provider.health_score >= 0.5 ? 'var(--color-status-pending)' :
                             'var(--color-status-error)'
                    }}>
                      {Math.round(provider.health_score * 100)}%
                    </div>
                  </div>
                  <div>
                    <div className="formula-text" style={{ fontSize: '0.65rem', color: 'var(--color-umain-text-dim)' }}>
                      LATENCIA
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                      {provider.avg_latency_ms > 0 ? `${provider.avg_latency_ms}ms` : '—'}
                    </div>
                  </div>
                  <div>
                    <div className="formula-text" style={{ fontSize: '0.65rem', color: 'var(--color-umain-text-dim)' }}>
                      LLAMADAS
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                      {provider.total_calls.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="formula-text" style={{ fontSize: '0.65rem', color: 'var(--color-umain-text-dim)' }}>
                      TASA ÉXITO
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                      {getSuccessRate(provider)}
                    </div>
                  </div>
                  <div>
                    <div className="formula-text" style={{ fontSize: '0.65rem', color: 'var(--color-umain-text-dim)' }}>
                      MODELOS
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                      {provider.model_count || 0}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div style={{ 
                padding: '1rem 1.25rem', 
                borderTop: '0.5px solid var(--color-umain-border)',
                background: 'var(--color-umain-bg-alt)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div className="formula-text" style={{ fontSize: '0.7rem', color: 'var(--color-umain-text-dim)' }}>
                  {provider.api_url}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="umain-button-ghost umain-button-sm"
                    onClick={() => handleTestConnection(provider.id)}
                    disabled={testingId === provider.id}
                  >
                    {testingId === provider.id ? 'Testing...' : 'Test'}
                  </button>
                  <button 
                    className="umain-button-ghost umain-button-sm"
                    onClick={() => { setEditingProvider(provider); setShowModal(true); }}
                  >
                    Editar
                  </button>
                  <button 
                    className="umain-button-ghost umain-button-sm"
                    onClick={() => handleDelete(provider.id)}
                    style={{ color: 'var(--color-status-error)' }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <ProviderModal
            provider={editingProvider}
            onClose={() => { setShowModal(false); setEditingProvider(null); }}
            onSave={(data) => {
              if (editingProvider) {
                setProviders(prev => prev.map(p => p.id === editingProvider.id ? { ...p, ...data } : p));
              } else {
                setProviders(prev => [...prev, { 
                  id: `provider-${Date.now()}`, 
                  ...data,
                  estado: 'activo',
                  health_score: 0,
                  avg_latency_ms: 0,
                  total_calls: 0,
                  total_failures: 0,
                  activo: 1,
                  model_count: 0
                }]);
              }
              setShowModal(false);
              setEditingProvider(null);
            }}
          />
        )}
      </main>
    </div>
  );
}

// ============================================================
// PROVIDER MODAL
// ============================================================

function ProviderModal({ provider, onClose, onSave }: {
  provider: Provider | null;
  onClose: () => void;
  onSave: (data: Partial<Provider>) => void;
}) {
  const [form, setForm] = useState({
    nombre: provider?.nombre || '',
    tipo: provider?.tipo || 'higgsfield',
    api_url: provider?.api_url || '',
    api_key: '',
    priority: provider?.priority || 1,
    capabilities: parseCapabilities(provider?.capabilities || '{}'),
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'models' | 'advanced'>('basic');

  function parseCapabilities(json: string) {
    try {
      return JSON.parse(json);
    } catch {
      return {
        image: { models: [] },
        video: { models: [] },
        voice: { models: [] },
        face_correction: { models: [] }
      };
    }
  }

  const handleSave = () => {
    onSave({
      nombre: form.nombre,
      tipo: form.tipo,
      api_url: form.api_url,
      priority: form.priority,
      capabilities: JSON.stringify(form.capabilities),
    });
  };

  const addModel = (type: string) => {
    const modelName = prompt(`Agregar modelo de ${type}:`);
    if (modelName) {
      setForm(prev => ({
        ...prev,
        capabilities: {
          ...prev.capabilities,
          [type]: {
            ...prev.capabilities[type],
            models: [...(prev.capabilities[type]?.models || []), modelName]
          }
        }
      }));
    }
  };

  const removeModel = (type: string, index: number) => {
    setForm(prev => ({
      ...prev,
      capabilities: {
        ...prev.capabilities,
        [type]: {
          ...prev.capabilities[type],
          models: prev.capabilities[type].models.filter((_: any, i: number) => i !== index)
        }
      }
    }));
  };

  return (
    <div className="umain-modal-overlay" onClick={onClose}>
      <div className="umain-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '750px' }}>
        <h2 className="umain-modal__title">
          {provider ? 'Editar' : 'Agregar'} Proveedor
        </h2>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '0', 
          marginBottom: '1.5rem',
          borderBottom: '0.5px solid var(--color-umain-border)'
        }}>
          {[
            { id: 'basic', label: 'Básico' },
            { id: 'models', label: 'Modelos' },
            { id: 'advanced', label: 'Avanzado' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '0.75rem 1.25rem',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontFamily: "'Archivo', sans-serif",
                fontWeight: activeTab === tab.id ? 600 : 400,
                color: activeTab === tab.id ? 'var(--color-umain-brand)' : 'var(--color-umain-text-dim)',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--color-umain-brand)' : '2px solid transparent',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: Basic */}
        {activeTab === 'basic' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-umain-text-dim)', marginBottom: '0.5rem' }}>
                  NOMBRE *
                </label>
                <input 
                  className="umain-input"
                  value={form.nombre}
                  onChange={e => setForm({...form, nombre: e.target.value})}
                  placeholder="Ej: Higgsfield Production"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-umain-text-dim)', marginBottom: '0.5rem' }}>
                  TIPO *
                </label>
                <select 
                  className="umain-input"
                  value={form.tipo}
                  onChange={e => setForm({...form, tipo: e.target.value})}
                >
                  {PROVIDER_TYPES.map(t => (
                    <option key={t.value} value={t.value}>
                      {t.icon} {t.label} — {t.desc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-umain-text-dim)', marginBottom: '0.5rem' }}>
                API URL *
              </label>
              <input 
                className="umain-input"
                value={form.api_url}
                onChange={e => setForm({...form, api_url: e.target.value})}
                placeholder="https://api.higgsfield.ai/v1"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-umain-text-dim)', marginBottom: '0.5rem' }}>
                API KEY (opcional para locales)
              </label>
              <input 
                className="umain-input"
                type="password"
                value={form.api_key}
                onChange={e => setForm({...form, api_key: e.target.value})}
                placeholder="sk-..."
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-umain-text-dim)', marginBottom: '0.5rem' }}>
                PRIORIDAD (1 = más alta)
              </label>
              <select 
                className="umain-input"
                value={form.priority}
                onChange={e => setForm({...form, priority: parseInt(e.target.value)})}
              >
                <option value={1}>1 - Primario (default)</option>
                <option value={2}>2 - Secundario (fallback)</option>
                <option value={3}>3 - Terciario (backup)</option>
                <option value={4}>4 - Cuaternario</option>
                <option value={5}>5 - Baja prioridad</option>
              </select>
            </div>
          </div>
        )}

        {/* Tab: Models */}
        {activeTab === 'models' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ 
              padding: '1rem', 
              background: 'var(--color-umain-bg-alt)', 
              borderRadius: '2px',
              border: '0.5px solid var(--color-umain-border)'
            }}>
              <div className="formula-text" style={{ fontSize: '0.7rem', color: 'var(--color-umain-text-dim)', marginBottom: '0.75rem' }}>
                💡 Agrega los modelos que este proveedor ofrece. El sistema los usará para routing inteligente.
              </div>
            </div>

            {/* Image Models */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1rem' }}>🖼</span>
                  <span style={{ fontWeight: 600 }}>Modelos de Imagen</span>
                  <span className="formula-text" style={{ fontSize: '0.7rem', color: 'var(--color-umain-text-dim)' }}>
                    ({form.capabilities.image?.models?.length || 0} modelos)
                  </span>
                </div>
                <button 
                  className="umain-button-ghost umain-button-sm"
                  onClick={() => addModel('image')}
                >
                  + Agregar
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {(form.capabilities.image?.models || []).map((model: string, i: number) => (
                  <span key={i} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.375rem 0.75rem',
                    background: 'rgba(125,212,252,0.1)',
                    border: '0.5px solid rgba(125,212,252,0.3)',
                    borderRadius: '2px',
                    fontSize: '12px',
                    fontFamily: "'Archivo', sans-serif",
                  }}>
                    {model}
                    <button 
                      onClick={() => removeModel('image', i)}
                      style={{ 
                        background: 'none', border: 'none', 
                        color: 'var(--color-status-error)', 
                        cursor: 'pointer', fontSize: '14px', padding: '0 2px'
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Video Models */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1rem' }}>🎬</span>
                  <span style={{ fontWeight: 600 }}>Modelos de Video</span>
                  <span className="formula-text" style={{ fontSize: '0.7rem', color: 'var(--color-umain-text-dim)' }}>
                    ({form.capabilities.video?.models?.length || 0} modelos)
                  </span>
                </div>
                <button 
                  className="umain-button-ghost umain-button-sm"
                  onClick={() => addModel('video')}
                >
                  + Agregar
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {(form.capabilities.video?.models || []).map((model: string, i: number) => (
                  <span key={i} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.375rem 0.75rem',
                    background: 'rgba(244,168,200,0.1)',
                    border: '0.5px solid rgba(244,168,200,0.3)',
                    borderRadius: '2px',
                    fontSize: '12px',
                    fontFamily: "'Archivo', sans-serif",
                  }}>
                    {model}
                    <button 
                      onClick={() => removeModel('video', i)}
                      style={{ 
                        background: 'none', border: 'none', 
                        color: 'var(--color-status-error)', 
                        cursor: 'pointer', fontSize: '14px', padding: '0 2px'
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Voice Models */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1rem' }}>🎙</span>
                  <span style={{ fontWeight: 600 }}>Modelos de Voz</span>
                  <span className="formula-text" style={{ fontSize: '0.7rem', color: 'var(--color-umain-text-dim)' }}>
                    ({form.capabilities.voice?.models?.length || 0} modelos)
                  </span>
                </div>
                <button 
                  className="umain-button-ghost umain-button-sm"
                  onClick={() => addModel('voice')}
                >
                  + Agregar
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {(form.capabilities.voice?.models || []).map((model: string, i: number) => (
                  <span key={i} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.375rem 0.75rem',
                    background: 'rgba(74,122,82,0.1)',
                    border: '0.5px solid rgba(74,122,82,0.3)',
                    borderRadius: '2px',
                    fontSize: '12px',
                    fontFamily: "'Archivo', sans-serif",
                  }}>
                    {model}
                    <button 
                      onClick={() => removeModel('voice', i)}
                      style={{ 
                        background: 'none', border: 'none', 
                        color: 'var(--color-status-error)', 
                        cursor: 'pointer', fontSize: '14px', padding: '0 2px'
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Advanced */}
        {activeTab === 'advanced' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ 
              padding: '1rem', 
              background: 'var(--color-umain-bg-alt)', 
              borderRadius: '2px',
              border: '0.5px solid var(--color-umain-border)'
            }}>
              <div className="formula-text" style={{ fontSize: '0.7rem', color: 'var(--color-umain-text-dim)' }}>
                ⚙️ Configuración avanzada para proveedores custom o locales.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-umain-text-dim)', marginBottom: '0.5rem' }}>
                  TIMEOUT (ms)
                </label>
                <input 
                  className="umain-input"
                  type="number"
                  defaultValue={30000}
                  placeholder="30000"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-umain-text-dim)', marginBottom: '0.5rem' }}>
                  MAX RETRIES
                </label>
                <input 
                  className="umain-input"
                  type="number"
                  defaultValue={3}
                  placeholder="3"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-umain-text-dim)', marginBottom: '0.5rem' }}>
                CUSTOM HEADERS (JSON)
              </label>
              <textarea 
                className="umain-input"
                rows={3}
                placeholder='{"X-Custom-Header": "value"}'
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-umain-text-dim)', marginBottom: '0.5rem' }}>
                AUTH METHOD
              </label>
              <select className="umain-input">
                <option value="bearer">Bearer Token</option>
                <option value="api_key">API Key Header</option>
                <option value="query">Query Parameter</option>
                <option value="none">No Authentication</option>
              </select>
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: '0.75rem',
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '0.5px solid var(--color-umain-border)'
        }}>
          <button className="umain-button-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button 
            className="umain-button-ghost"
            onClick={() => {
              // Test connection
              alert('Test de conexión exitoso!');
            }}
          >
            Test Conexión
          </button>
          <button className="umain-button-primary" onClick={handleSave}>
            {provider ? 'Guardar Cambios' : 'Agregar Proveedor'}
          </button>
        </div>
      </div>
    </div>
  );
}
