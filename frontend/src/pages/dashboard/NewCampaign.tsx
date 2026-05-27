import { useState, useCallback } from 'react';
import { Spinner } from '../../components/ui';
import FileUploadZone, { type UploadFile } from '../../components/ui/FileUploadZone';
import { uploadsApi } from '../../api/uploads';
import { aiApi } from '../../api/ai';
import { generateCreativeImage } from '../../utils/creativeCanvas';
import { C } from '../../styles/theme';

const STEPS = ['Producto', 'IA analiza', 'Creativos', 'Publicar'];

const CREATIVE_CONFIGS = [
  { fmt: '9:16' as const, label: 'Reel principal', from: '#1a0528', to: '#3d0f6b', emoji: '🎬', best: true },
  { fmt: '1:1' as const, label: 'Feed cuadrado', from: '#050528', to: '#0f1a6b', emoji: '📸', best: false },
  { fmt: '4:5' as const, label: 'Story', from: '#281a05', to: '#6b4f0f', emoji: '📱', best: false },
];

interface AiStrategy {
  hook: string;
  headline?: string;
  body?: string;
  cta?: string;
  audience?: { description?: string; age_min?: number; age_max?: number };
  format?: string;
  styleNotes?: string;
  whatsappMessage?: string;
  hooks_variants?: string[];
  reasoning?: string;
}

export default function NewCampaign() {
  const [step, setStep] = useState(1);
  const [analyzing, setAnalyzing] = useState(false);
  const [strategy, setStrategy] = useState<AiStrategy | null>(null);
  const [analyzeError, setAnalyzeError] = useState('');
  const [form, setForm] = useState({ name: '', price: '', desc: '', budget: '25', objective: '→ WhatsApp' });
  const [mainFiles, setMainFiles] = useState<UploadFile[]>([]);
  const [extraFiles, setExtraFiles] = useState<UploadFile[]>([]);
  const [creativeImages, setCreativeImages] = useState<string[]>([]);
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleUpload = useCallback(async (files: File[], onProgress: (pct: number) => void) => {
    const res = await uploadsApi.upload(files, onProgress);
    return (res.data as any)?.data?.files ?? [];
  }, []);

  const runAnalysis = async () => {
    if (!form.name.trim() && !form.desc.trim()) return;
    setAnalyzing(true);
    setAnalyzeError('');
    setStrategy(null);
    try {
      const res = await aiApi.analyzeCampaign(
        form.name || 'Producto sin nombre',
        form.desc || form.name,
        form.objective,
      );
      const data = (res.data as any)?.data ?? res.data;
      setStrategy(data);
    } catch {
      // fallback strategy
      setStrategy({
        hook: '¿Todavía pagás de más?',
        headline: form.name || 'Oferta especial',
        cta: 'Escribinos por WhatsApp',
        audience: { description: 'Compradores online 18-40', age_min: 18, age_max: 40 },
        format: '9_16',
        styleNotes: 'Texto grande, fondo oscuro, urgencia',
        whatsappMessage: 'Hola, vi tu anuncio. ¿Tenés disponibilidad?',
      });
      setAnalyzeError('IA sin conexión — usando estrategia de respaldo');
    }
    setAnalyzing(false);
  };

  const goToCreatives = () => {
    if (!strategy) return;
    const hook = strategy.hook || form.name || 'Oferta especial';
    const product = form.name || 'Producto';
    const images = CREATIVE_CONFIGS.map(cfg =>
      generateCreativeImage({
        hook,
        product,
        format: cfg.fmt,
        style: strategy.styleNotes ?? 'Hook urgencia',
        avatarEmoji: cfg.emoji,
        gradientFrom: cfg.from,
        gradientTo: cfg.to,
      })
    );
    setCreativeImages(images);
    setStep(3);
  };

  const displayStrategy = strategy ?? {
    hook: '—', audience: { description: '—' }, format: '9_16', cta: '—', styleNotes: '—',
  };

  return (
    <div className="content fade-in">
      <div className="steps-row" style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
        {STEPS.map((s, i) => (
          <div key={i} className="step-item" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              padding: '5px 13px', borderRadius: 6, fontSize: 12, fontFamily: "'DM Mono',monospace",
              background: step === i + 1 ? C.accentDim : step > i + 1 ? C.greenDim : C.border,
              color: step === i + 1 ? C.accent : step > i + 1 ? C.green : C.textMuted,
              border: step === i + 1 ? `1px solid ${C.accent}44` : '1px solid transparent',
            }}>{i + 1}. {s}</div>
            {i < 3 && <span style={{ color: C.textDim, fontSize: 10 }}>›</span>}
          </div>
        ))}
      </div>

      {/* Step 1: Product data */}
      {step === 1 && (
        <div className="g2" style={{ gap: 16 }}>
          <div className="card">
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, marginBottom: 13 }}>Datos del producto</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="fg">
                <label className="flbl">Nombre del producto</label>
                <input className="finput" placeholder="ej. Nike Air Max 270" value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
              <div className="fg">
                <label className="flbl">Precio de venta</label>
                <input className="finput" placeholder="$99.990" value={form.price} onChange={e => set('price', e.target.value)} />
              </div>
              <div className="fg">
                <label className="flbl">Descripción</label>
                <textarea className="ftxt" placeholder="¿Qué hace especial este producto?" value={form.desc} onChange={e => set('desc', e.target.value)} />
              </div>
              <div className="g2">
                <div className="fg">
                  <label className="flbl">Presupuesto (USD/día)</label>
                  <input className="finput" type="number" value={form.budget} onChange={e => set('budget', e.target.value)} />
                </div>
                <div className="fg">
                  <label className="flbl">Objetivo</label>
                  <select className="fsel" value={form.objective} onChange={e => set('objective', e.target.value)}>
                    <option>→ WhatsApp</option>
                    <option>Tráfico web</option>
                    <option>Conversiones</option>
                    <option>Reconocimiento de marca</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, marginBottom: 13 }}>Material</div>
            <div style={{ marginBottom: 13 }}>
              <label className="flbl" style={{ marginBottom: 7, display: 'block' }}>Video o imagen principal</label>
              <FileUploadZone
                accept="video/mp4,video/quicktime,video/webm,image/jpeg,image/png,image/webp"
                multiple={false}
                maxSizeMB={500}
                icon="🎬"
                label="Arrastrá o hacé click para subir"
                hint="MP4, MOV, JPG, PNG · máx 500 MB"
                value={mainFiles}
                onChange={setMainFiles}
                onUpload={handleUpload}
              />
            </div>
            <div>
              <label className="flbl" style={{ marginBottom: 7, display: 'block' }}>Fotos adicionales</label>
              <FileUploadZone
                accept="image/jpeg,image/png,image/webp"
                multiple={true}
                maxSizeMB={50}
                icon="🖼️"
                label="Arrastrá las fotos aquí"
                hint="JPG, PNG, WebP · máx 50 MB por foto"
                value={extraFiles}
                onChange={setExtraFiles}
                onUpload={handleUpload}
              />
            </div>
            <div style={{ marginTop: 13, padding: '10px 12px', background: C.accentDim, borderRadius: 8, fontSize: 12, color: C.accent, lineHeight: 1.5 }}>
              💡 La IA crea versiones virales de tu material automáticamente
            </div>
          </div>
        </div>
      )}

      {/* Step 2: AI analysis */}
      {step === 2 && (
        <div className="card" style={{ maxWidth: 540, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', padding: '14px 0' }}>
            {!strategy && !analyzing && (
              <>
                <div style={{ fontSize: 36, marginBottom: 13 }}>🤖</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 7 }}>Listo para analizar</div>
                <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 18, lineHeight: 1.6 }}>
                  La IA va a analizar tu producto y crear la estrategia perfecta de Meta Ads: hook viral, audiencia, copy y formato ideal.
                </div>
                <button className="btn btn-p" style={{ padding: '10px 24px' }} onClick={runAnalysis}>
                  🤖 Iniciar análisis IA
                </button>
              </>
            )}

            {analyzing && (
              <>
                <div style={{ fontSize: 36, marginBottom: 13 }}>🤖</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 18 }}>IA analizando...</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left', marginBottom: 18 }}>
                  {['Analizando Meta Ad Library...', 'Detectando hooks virales...', 'Generando copy estratégico...', 'Definiendo segmentación ideal...'].map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: C.textMuted }}>
                      <Spinner /> {t}
                    </div>
                  ))}
                </div>
              </>
            )}

            {strategy && !analyzing && (
              <div style={{ textAlign: 'left' }}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 30 }}>✅</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, marginTop: 5 }}>Estrategia generada por IA</div>
                  {analyzeError && <div style={{ fontSize: 11, color: C.amber, marginTop: 5 }}>⚠️ {analyzeError}</div>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {([
                    ['Hook viral', displayStrategy.hook],
                    ['Audiencia', displayStrategy.audience?.description ?? '—'],
                    ['Edad', displayStrategy.audience ? `${displayStrategy.audience.age_min ?? 18}–${displayStrategy.audience.age_max ?? 45} años` : '—'],
                    ['Formato recomendado', displayStrategy.format?.replace('_', ':') ?? '9:16'],
                    ['CTA', displayStrategy.cta ?? '—'],
                    ['Estilo visual', displayStrategy.styleNotes ?? '—'],
                  ] as [string, string][]).map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${C.border}22`, fontSize: 13 }}>
                      <span style={{ color: C.textMuted, flexShrink: 0, marginRight: 12 }}>{k}</span>
                      <span style={{ color: C.text, fontWeight: 500, textAlign: 'right', maxWidth: '60%', lineHeight: 1.4 }}>{v}</span>
                    </div>
                  ))}
                </div>
                {strategy.hooks_variants && strategy.hooks_variants.length > 0 && (
                  <div style={{ marginTop: 14, padding: '10px 12px', background: C.accentDim, borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: C.accent, fontWeight: 600, marginBottom: 6 }}>Variantes de hook</div>
                    {strategy.hooks_variants.map((h, i) => (
                      <div key={i} style={{ fontSize: 12, color: C.text, padding: '3px 0' }}>• {h}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Generated creatives */}
      {step === 3 && (
        <div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, marginBottom: 13 }}>Creativos generados por IA</div>
          <div className="g3">
            {CREATIVE_CONFIGS.map((cfg, i) => (
              <div key={i} style={{ background: C.surface, border: `1.5px solid ${i === 0 ? C.accent : C.border}`, borderRadius: 10, overflow: 'hidden', cursor: 'pointer', transition: 'all .2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = C.accent)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = i === 0 ? C.accent : C.border)}>
                <div style={{ aspectRatio: cfg.fmt === '9:16' ? '9/16' : '4/5', position: 'relative', overflow: 'hidden', background: `linear-gradient(135deg,${cfg.from},${cfg.to})` }}>
                  {cfg.best && (
                    <div style={{ position: 'absolute', top: 8, right: 8, background: C.accent, color: '#fff', fontSize: 9, padding: '2px 7px', borderRadius: 4, zIndex: 2 }}>★ Recomendado</div>
                  )}
                  {creativeImages[i] ? (
                    <img src={creativeImages[i]} alt={cfg.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6 }}>
                      <div style={{ fontSize: 32 }}>{cfg.emoji}</div>
                      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,.4)' }}>{cfg.fmt}</div>
                    </div>
                  )}
                </div>
                <div style={{ padding: '10px 11px' }}>
                  <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 3 }}>{cfg.label}</div>
                  <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2, fontFamily: "'DM Mono',monospace", marginBottom: 8 }}>Auto-generado · {cfg.fmt}</div>
                  {creativeImages[i] && (
                    <a href={creativeImages[i]} download={`creativo-${cfg.fmt.replace(':','-')}.jpg`}
                      style={{ display: 'block', textAlign: 'center', fontSize: 11, padding: '5px', border: `1px solid ${C.border}`, borderRadius: 6, color: C.textMuted, textDecoration: 'none', background: C.bg }}>
                      📥 Descargar
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Publish */}
      {step === 4 && (
        <div className="g2" style={{ gap: 16 }}>
          <div className="card">
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, marginBottom: 13 }}>Configuración final</div>
            <div style={{ padding: '9px 12px', background: C.greenDim, borderRadius: 8, border: `1px solid ${C.green}33`, fontSize: 12, color: C.green, marginBottom: 13 }}>
              ✅ Meta Ads conectado · WhatsApp vinculado
            </div>
            {[
              ['Campaña', form.name || 'Nueva campaña IA'],
              ['Presupuesto', `$${form.budget} USD/día`],
              ['Objetivo', form.objective],
              ['Formatos', 'Reel + Story + Feed'],
              ['Segmentación', strategy?.audience?.description ?? 'IA: Audiencia optimizada'],
              ['Hook IA', strategy?.hook ?? '—'],
              ['Pixel Meta', 'Vinculado ✓'],
              ['Material subido', `${mainFiles.filter(f => f.status === 'done').length} principal + ${extraFiles.filter(f => f.status === 'done').length} adicional`],
            ].map(([k, v], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: `1px solid ${C.border}22` }}>
                <span style={{ color: C.textMuted }}>{k}</span><span style={{ fontWeight: 500, maxWidth: '60%', textAlign: 'right' }}>{v}</span>
              </div>
            ))}
          </div>
          <div className="card">
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, marginBottom: 13 }}>Preview WhatsApp</div>
            <div style={{ background: '#0d1117', borderRadius: 10, padding: 14, fontSize: 12 }}>
              <div style={{ fontSize: 10, color: '#4b5563', marginBottom: 8, fontFamily: "'DM Mono',monospace" }}>WhatsApp Business</div>
              <div style={{ background: '#1f2937', borderRadius: '10px 10px 10px 2px', padding: '9px 11px', marginBottom: 7, maxWidth: '80%', lineHeight: 1.5 }}>
                {strategy?.whatsappMessage ?? 'Hola, vi tu anuncio. ¿Tenés disponibilidad?'}
              </div>
              <div style={{ background: '#1a3a2a', borderRadius: '10px 10px 2px 10px', padding: '9px 11px', marginLeft: 'auto', maxWidth: '80%', lineHeight: 1.5 }}>¡Hola! Sí 🎉 ¿Cuál es tu talle?</div>
            </div>
            <button className="btn btn-p" style={{ width: '100%', marginTop: 13, padding: '11px', fontSize: 14 }}>🚀 Publicar en Meta Ads</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
        <button className="btn btn-g" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>← Atrás</button>
        {step === 2 && !strategy && !analyzing ? (
          <button className="btn btn-p" onClick={runAnalysis}>🤖 Analizar con IA</button>
        ) : step === 2 && strategy ? (
          <button className="btn btn-p" onClick={goToCreatives}>Generar creativos →</button>
        ) : step < 4 ? (
          <button className="btn btn-p" onClick={() => setStep(step + 1)} disabled={step === 2 && analyzing}>
            {analyzing ? <><Spinner size={14} color="#fff" /> Analizando...</> : 'Continuar →'}
          </button>
        ) : (
          <button className="btn btn-p" style={{ background: C.green }}>✅ Publicar</button>
        )}
      </div>
    </div>
  );
}
