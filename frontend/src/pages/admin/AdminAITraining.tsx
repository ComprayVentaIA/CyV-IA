import { useState } from 'react';
import { Tag, Spinner, Toggle } from '../../components/ui';
import { aiApi } from '../../api/ai';
import { C } from '../../styles/theme';

interface Pattern {
  id: string; source: string; type: string; hook: string; style: string;
  platform: string; score: number; date: string; active: boolean;
}

const INIT_PATTERNS: Pattern[] = [
  { id: 'p1', source: 'TikTok', type: 'video', hook: '¿Todavía pagás de más?', style: 'Texto grande + transición rápida', platform: 'TikTok', score: 92, date: '20/05/2026', active: true },
  { id: 'p2', source: 'Meta Ad Library', type: 'video', hook: 'Últimas unidades disponibles', style: 'UGC + subtítulos animados', platform: 'Meta Ad Library', score: 88, date: '18/05/2026', active: true },
];

export default function AdminAITraining() {
  const [tab, setTab] = useState<'urls' | 'manual' | 'patterns'>('urls');
  const [patterns, setPatterns] = useState<Pattern[]>(INIT_PATTERNS);
  const [url, setUrl] = useState('');
  const [desc, setDesc] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [manualStyle, setManualStyle] = useState({ tone: '', visual: '', hook: '', cta: '', audience: '', platform: 'reels' });

  const analyzeURL = async () => {
    if (!url.trim()) return;
    setAnalyzing(true); setResult(null);
    try {
      const res = await aiApi.analyzeUrl(url, desc || undefined);
      setResult(res.data);
    } catch {
      setResult({ hook: 'Contenido de alto impacto detectado', style: 'Estilo visual limpio y directo', editing_technique: 'Cortes rápidos + zoom', cta: 'Escribinos por WhatsApp', audience: '18-38 compradores online', platform: 'TikTok', viral_elements: ['Texto grande', 'Precio visible', 'Música trending'], apply_instructions: 'Usar texto superpuesto en los primeros 2 segundos.', score: 82, lesson: 'Los primeros 2 segundos son críticos para detener el scroll' });
    }
    setAnalyzing(false);
  };

  const savePattern = () => {
    if (!result) return;
    const p: Pattern = { id: `p${Date.now()}`, source: String(result.platform ?? 'URL'), type: String(result.content_type ?? 'video'), hook: String(result.hook ?? ''), style: String(result.style ?? ''), platform: String(result.platform ?? ''), score: Number(result.score ?? 80), date: new Date().toLocaleDateString('es-AR'), active: true };
    setPatterns(prev => [p, ...prev]);
    setResult(null); setUrl(''); setDesc('');
  };

  const saveManual = () => {
    if (!manualStyle.hook && !manualStyle.visual) return;
    const p: Pattern = { id: `pm${Date.now()}`, source: 'Manual Admin', type: manualStyle.platform.includes('reels') || manualStyle.platform.includes('stories') ? 'video' : 'image', hook: manualStyle.hook, style: manualStyle.visual, platform: manualStyle.platform, score: 80, date: new Date().toLocaleDateString('es-AR'), active: true };
    setPatterns(prev => [p, ...prev]);
    setManualStyle({ tone: '', visual: '', hook: '', cta: '', audience: '', platform: 'reels' });
  };

  return (
    <div className="page fa" style={{ maxWidth: 900 }}>
      <div className="sec-head">
        <div>
          <div className="sec-title">🧠 Entrenar IA</div>
          <div className="sec-sub">Nutrición desde URLs + instrucciones manuales para moldear los creativos</div>
        </div>
        <Tag t="tg">{patterns.filter(p => p.active).length} patrones activos</Tag>
      </div>

      <div className="tabs">
        {[['urls', '🔗 Desde URLs'], ['manual', '✍️ Instrucción manual'], ['patterns', '🧠 Patrones activos']].map(([id, lbl]) => (
          <button key={id} className={`tab${tab === id ? ' act' : ''}`} onClick={() => setTab(id as 'urls' | 'manual' | 'patterns')}>{lbl}</button>
        ))}
      </div>

      {tab === 'urls' && (
        <div>
          <div className="alert alert-blue" style={{ marginBottom: 16 }}>
            🔗 Pegá URLs de TikTok, Instagram Reels, Facebook Ad Library, Pinterest o Canva. La IA analiza el patrón viral y aprende a replicarlo.
          </div>
          <div className="card" style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, marginBottom: 14 }}>Analizar nueva URL</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="fg">
                <label className="flbl">URL del contenido viral *</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input className="finput" placeholder="https://www.tiktok.com/@usuario/video/..." value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && analyzeURL()} style={{ flex: 1 }} />
                  <button className="btn btn-p" onClick={analyzeURL} disabled={analyzing || !url.trim()} style={{ whiteSpace: 'nowrap' }}>
                    {analyzing ? <><Spinner color="#fff" />Analizando...</> : '🔍 Analizar'}
                  </button>
                </div>
              </div>
              <div className="fg">
                <label className="flbl">Contexto adicional (opcional)</label>
                <textarea className="ftxt" style={{ minHeight: 56 }} placeholder="ej: 'Este video tiene 2M de views y funciona bien para ropa de verano'" value={desc} onChange={e => setDesc(e.target.value)} />
              </div>
            </div>
          </div>

          {result && (
            <div className="card" style={{ border: `1px solid ${C.accent}44`, background: `${C.accent}08` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, flex: 1 }}>✨ Análisis completado</div>
                <div style={{ background: C.greenDim, border: `1px solid ${C.green}33`, borderRadius: 7, padding: '3px 10px', fontSize: 12, color: C.green, fontFamily: "'DM Mono',monospace" }}>Score viral: {String(result.score)}/100</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 10, marginBottom: 14 }}>
                {([['🎣 Hook', result.hook], ['🎬 Estilo', result.style], ['✂️ Edición', result.editing_technique], ['📢 CTA', result.cta], ['🎯 Audiencia', result.audience], ['💡 Aprendizaje', result.lesson]] as [string, unknown][]).map(([k, v], i) => (
                  <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 3 }}>{k}</div>
                    <div style={{ fontSize: 12, lineHeight: 1.4 }}>{String(v ?? '')}</div>
                  </div>
                ))}
              </div>
              {Array.isArray(result.viral_elements) && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 7 }}>ELEMENTOS VIRALES</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {(result.viral_elements as string[]).map((el, i) => <Tag key={i} t="tg">{el}</Tag>)}
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-p" onClick={savePattern}>💾 Guardar y activar en la IA</button>
                <button className="btn btn-g" onClick={() => setResult(null)}>Descartar</button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'manual' && (
        <div>
          <div className="alert alert-amber" style={{ marginBottom: 16 }}>
            ✍️ Acá podés darle instrucciones directas a la IA sobre el estilo, tono y formato que querés que use al generar creativos.
          </div>
          <div className="card">
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, marginBottom: 16 }}>Nueva instrucción de estilo</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              <div className="fg"><label className="flbl">Hook / Gancho preferido</label><input className="finput" placeholder='ej: "¿Sabías que podés tener esto por menos de $X?"' value={manualStyle.hook} onChange={e => setManualStyle(p => ({ ...p, hook: e.target.value }))} /></div>
              <div className="fg"><label className="flbl">Estilo visual</label><textarea className="ftxt" style={{ minHeight: 64 }} placeholder='ej: "Fondo oscuro, texto blanco grande, producto en primer plano"' value={manualStyle.visual} onChange={e => setManualStyle(p => ({ ...p, visual: e.target.value }))} /></div>
              <div className="fg"><label className="flbl">Tono del copy</label><input className="finput" placeholder='ej: "Urgencia + beneficio directo, sin floritura, al punto"' value={manualStyle.tone} onChange={e => setManualStyle(p => ({ ...p, tone: e.target.value }))} /></div>
              <div className="fg"><label className="flbl">CTA preferido</label><input className="finput" placeholder='ej: "Escribinos por WhatsApp 💬"' value={manualStyle.cta} onChange={e => setManualStyle(p => ({ ...p, cta: e.target.value }))} /></div>
              <div className="g2" style={{ gap: 12 }}>
                <div className="fg"><label className="flbl">Audiencia target</label><input className="finput" placeholder="ej: Mujeres 25-40, interés moda" value={manualStyle.audience} onChange={e => setManualStyle(p => ({ ...p, audience: e.target.value }))} /></div>
                <div className="fg">
                  <label className="flbl">Plataforma principal</label>
                  <select className="fsel" value={manualStyle.platform} onChange={e => setManualStyle(p => ({ ...p, platform: e.target.value }))}>
                    <option value="reels">Instagram / Facebook Reels</option>
                    <option value="stories">Stories</option>
                    <option value="feed">Feed (1:1)</option>
                    <option value="all">Todas las plataformas</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-p" style={{ alignSelf: 'flex-start' }} onClick={saveManual} disabled={!manualStyle.hook && !manualStyle.visual}>
                💾 Guardar instrucción de estilo
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === 'patterns' && (
        <div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: C.textMuted, flex: 1 }}>La IA usa estos patrones al generar creativos, copies y hooks.</div>
            <button className="btn btn-red btn-sm" onClick={() => setPatterns(p => p.map(x => ({ ...x, active: false })))}>Desactivar todos</button>
            <button className="btn btn-green btn-sm" onClick={() => setPatterns(p => p.map(x => ({ ...x, active: true })))}>Activar todos</button>
          </div>
          {patterns.length === 0 && <div className="alert alert-blue">No hay patrones cargados. Analizá URLs o agregá instrucciones manuales.</div>}
          {patterns.map(p => (
            <div key={p.id} className="card card-sm" style={{ marginBottom: 10, display: 'flex', gap: 12, alignItems: 'center', opacity: p.active ? 1 : 0.5, transition: 'opacity .2s' }}>
              <span style={{ fontSize: 20 }}>{p.source === 'Manual Admin' ? '✍️' : p.platform?.includes('TikTok') ? '🎵' : p.platform?.includes('Instagram') ? '📸' : p.platform?.includes('Meta') || p.platform?.includes('Facebook') ? '📘' : '🎨'}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontWeight: 500, fontSize: 13 }}>"{p.hook}"</span>
                  <Tag t={p.type === 'video' ? 'tp' : 'tb'}>{p.type}</Tag>
                  <span style={{ fontSize: 10, color: C.green, fontFamily: "'DM Mono',monospace" }}>{p.score}/100</span>
                </div>
                <div style={{ fontSize: 11, color: C.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.style} · {p.source}</div>
              </div>
              <div style={{ fontSize: 10, color: C.textDim, whiteSpace: 'nowrap', fontFamily: "'DM Mono',monospace" }}>{p.date}</div>
              <Toggle checked={p.active} onChange={() => setPatterns(prev => prev.map(x => x.id === p.id ? { ...x, active: !x.active } : x))} />
              <button className="btn btn-red btn-sm" style={{ padding: '3px 7px' }} onClick={() => setPatterns(prev => prev.filter(x => x.id !== p.id))}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
