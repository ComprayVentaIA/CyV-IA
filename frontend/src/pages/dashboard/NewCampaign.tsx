import { useState, useCallback } from 'react';
import { Spinner } from '../../components/ui';
import FileUploadZone, { type UploadFile } from '../../components/ui/FileUploadZone';
import { uploadsApi } from '../../api/uploads';
import { C } from '../../styles/theme';

const STEPS = ['Producto', 'IA analiza', 'Creativos', 'Publicar'];

export default function NewCampaign() {
  const [step, setStep] = useState(1);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', desc: '', budget: '25' });
  const [mainFiles, setMainFiles] = useState<UploadFile[]>([]);
  const [extraFiles, setExtraFiles] = useState<UploadFile[]>([]);
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleUpload = useCallback(async (files: File[], onProgress: (pct: number) => void) => {
    const res = await uploadsApi.upload(files, onProgress);
    return (res.data as any)?.data?.files ?? res.data?.files ?? [];
  }, []);

  const runAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => { setAnalyzing(false); setAnalyzed(true); }, 2600);
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
                  <select className="fsel"><option>→ WhatsApp</option><option>Tráfico web</option></select>
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

      {step === 2 && (
        <div className="card" style={{ maxWidth: 520, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', padding: '14px 0' }}>
            {!analyzed ? (
              <>
                <div style={{ fontSize: 36, marginBottom: 13 }}>🤖</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 7 }}>
                  {analyzing ? 'IA analizando...' : 'Listo para analizar'}
                </div>
                <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 18, lineHeight: 1.6 }}>
                  Voy a analizar Meta Ad Library, TikTok trends y patrones virales para crear la estrategia perfecta.
                </div>
                {analyzing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left', marginBottom: 18 }}>
                    {['Analizando Meta Ad Library...', 'Detectando hooks virales...', 'Generando copy estratégico...', 'Definiendo segmentación...'].map((t, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: C.textMuted }}>
                        <Spinner /> {t}
                      </div>
                    ))}
                  </div>
                ) : (
                  <button className="btn btn-p" style={{ padding: '10px 24px' }} onClick={runAnalysis}>Iniciar análisis IA</button>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'left' }}>
                <div style={{ textAlign: 'center', marginBottom: 14 }}>
                  <div style={{ fontSize: 30 }}>✅</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, marginTop: 5 }}>Análisis completado</div>
                </div>
                {[['Hook', '"¿Todavía pagás de más?"'], ['Tono', 'Urgencia + beneficio directo'], ['Formato', 'Reel vertical 9:16'], ['Audiencia', 'Mujeres 22-38, moda'], ['CTA', 'Escribinos por WhatsApp →']].map(([k, v], i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: `1px solid ${C.border}22`, fontSize: 13 }}>
                    <span style={{ color: C.textMuted }}>{k}</span>
                    <span style={{ color: C.text, fontWeight: 500, maxWidth: '55%', textAlign: 'right' }}>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, marginBottom: 13 }}>Creativos generados por IA</div>
          <div className="g3">
            {[
              { f: '9:16', l: 'Reel principal', icon: '🎬', bg: '#0d1b2a', best: true },
              { f: '1:1', l: 'Feed cuadrado', icon: '📸', bg: '#0a1a0a', best: false },
              { f: '4:5', l: 'Story', icon: '📱', bg: '#1a0a1a', best: false },
            ].map((c, i) => (
              <div key={i} style={{ background: C.surface, border: `1.5px solid ${i === 0 ? C.accent : C.border}`, borderRadius: 10, overflow: 'hidden', cursor: 'pointer' }}>
                <div style={{ background: c.bg, aspectRatio: c.f === '9:16' ? '9/16' : '4/5', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  {c.best && <div style={{ position: 'absolute', top: 8, right: 8, background: C.accent, color: '#fff', fontSize: 9, padding: '2px 7px', borderRadius: 4 }}>★ Rec.</div>}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 32 }}>{c.icon}</div>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: C.textMuted, marginTop: 5 }}>{c.f}</div>
                  </div>
                </div>
                <div style={{ padding: '10px 11px' }}>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{c.l}</div>
                  <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2, fontFamily: "'DM Mono',monospace" }}>Auto-generado</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
              ['Objetivo', 'Mensajes WhatsApp'],
              ['Formatos', 'Reel + Story + Feed'],
              ['Segmentación', 'IA: Mujeres 22-38'],
              ['Pixel Meta', 'Vinculado ✓'],
              ['Material subido', `${mainFiles.filter(f => f.status === 'done').length} archivo(s) principal + ${extraFiles.filter(f => f.status === 'done').length} adicional(es)`],
            ].map(([k, v], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: `1px solid ${C.border}22` }}>
                <span style={{ color: C.textMuted }}>{k}</span><span style={{ fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
          <div className="card">
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, marginBottom: 13 }}>Preview WhatsApp</div>
            <div style={{ background: '#0d1117', borderRadius: 10, padding: 14, fontSize: 12 }}>
              <div style={{ fontSize: 10, color: '#4b5563', marginBottom: 8, fontFamily: "'DM Mono',monospace" }}>WhatsApp Business</div>
              <div style={{ background: '#1f2937', borderRadius: '10px 10px 10px 2px', padding: '9px 11px', marginBottom: 7, maxWidth: '80%', lineHeight: 1.5 }}>Hola, vi tu anuncio. ¿Tenés disponibilidad?</div>
              <div style={{ background: '#1a3a2a', borderRadius: '10px 10px 2px 10px', padding: '9px 11px', marginLeft: 'auto', maxWidth: '80%', lineHeight: 1.5 }}>¡Hola! Sí 🎉 ¿Cuál es tu talle?</div>
            </div>
            <button className="btn btn-p" style={{ width: '100%', marginTop: 13, padding: '11px', fontSize: 14 }}>🚀 Publicar en Meta Ads</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
        <button className="btn btn-g" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>← Atrás</button>
        {step < 4
          ? <button className="btn btn-p" onClick={() => setStep(step + 1)}>Continuar →</button>
          : <button className="btn btn-p" style={{ background: C.green }}>✅ Publicar</button>
        }
      </div>
    </div>
  );
}
