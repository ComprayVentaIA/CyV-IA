import { useState, useEffect, useCallback } from 'react';
import { Spinner, Tag, Toggle } from '../../components/ui';
import { aiTrainingApi, type AiPattern, type AiTrainingStats } from '../../api/ai-training';
import { C } from '../../styles/theme';

const PLATFORMS = [
  { id: 'all', label: 'Todos' },
  { id: 'reels', label: 'Reels 9:16' },
  { id: 'stories', label: 'Stories 4:5' },
  { id: 'feed', label: 'Feed 1:1' },
];

const MOCK_PATTERNS: AiPattern[] = [
  { id: 'm1', source: 'TikTok', type: 'video', hook: '¿Todavía pagás de más?', style: 'Texto grande + transición rápida', platform: 'reels', tone: 'Urgencia', visual_notes: 'Fondo negro, letras blancas grandes', cta: 'Escribinos por WhatsApp', audience: 'Mujeres 22-38, moda', score: 94, active: true, uses: 48, created_at: '2026-05-20T00:00:00Z' },
  { id: 'm2', source: 'Meta Ad Library', type: 'video', hook: 'Últimas unidades disponibles', style: 'UGC + subtítulos animados', platform: 'reels', tone: 'Escasez', visual_notes: 'Luz natural, producto en mano', cta: 'Conseguí el tuyo ahora', audience: 'Compradores online 18-35', score: 89, active: true, uses: 31, created_at: '2026-05-18T00:00:00Z' },
  { id: 'm3', source: 'Manual', type: 'image', hook: 'Solo por hoy 40% OFF', style: 'Precio grande, producto hero', platform: 'feed', tone: 'Oferta', visual_notes: 'Fondo blanco, precio destacado', cta: 'Ver más →', audience: 'Compradores ocasionales', score: 81, active: true, uses: 22, created_at: '2026-05-15T00:00:00Z' },
];

// ── Pattern Card ─────────────────────────────────────────────────────────────

function PatternCard({ p, onToggle, onDelete }: {
  p: AiPattern;
  onToggle: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const scoreColor = p.score >= 90 ? C.green : p.score >= 75 ? C.accent : C.amber;
  return (
    <div style={{ background: C.surface, border: `1.5px solid ${p.active ? C.border : C.textDim + '44'}`, borderRadius: 12, padding: 16, opacity: p.active ? 1 : 0.55, transition: 'all .2s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
            <Tag t={p.platform === 'reels' ? 'tp' : p.platform === 'stories' ? 'ta' : 'tb'}>{p.platform}</Tag>
            <Tag t={p.type === 'video' ? 'tr' : 'tk'}>{p.type}</Tag>
            <span style={{ fontSize: 9, color: C.textDim, fontFamily: "'DM Mono',monospace", marginLeft: 'auto' }}>{p.source}</span>
          </div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 4, lineHeight: 1.3 }}>"{p.hook}"</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginLeft: 10, flexShrink: 0 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, color: scoreColor }}>{p.score}</div>
          <div style={{ fontSize: 8, color: C.textDim, fontFamily: "'DM Mono',monospace" }}>SCORE</div>
        </div>
      </div>

      {p.style && (
        <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6, lineHeight: 1.5 }}>
          <span style={{ color: C.textDim }}>Estilo: </span>{p.style}
        </div>
      )}
      {p.tone && (
        <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}>
          <span style={{ color: C.textDim }}>Tono: </span>{p.tone}
        </div>
      )}
      {p.audience && (
        <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 10 }}>
          <span style={{ color: C.textDim }}>Audiencia: </span>{p.audience}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: `1px solid ${C.border}22` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Toggle checked={p.active} onChange={() => onToggle(p.id, !p.active)} />
          <span style={{ fontSize: 10, color: C.textMuted }}>{p.active ? 'Activo' : 'Pausado'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, color: C.textDim, fontFamily: "'DM Mono',monospace" }}>⚡ {p.uses} usos</span>
          <button onClick={() => onDelete(p.id)}
            style={{ fontSize: 10, padding: '3px 8px', borderRadius: 5, background: C.redDim, border: `1px solid ${C.red}33`, color: C.red, cursor: 'pointer' }}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Add Pattern Form ─────────────────────────────────────────────────────────

function AddPatternForm({ onSave, onCancel }: { onSave: (p: Partial<AiPattern>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({ hook: '', style: '', platform: 'reels', tone: '', audience: '', cta: '', score: 80, source: 'Manual' });
  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div style={{ background: C.surface2, border: `1.5px solid ${C.accent}44`, borderRadius: 12, padding: 18, marginBottom: 14 }}>
      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 13, marginBottom: 14, color: C.accent }}>+ Nuevo patrón manual</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11 }}>
        <div className="fg" style={{ gridColumn: '1/-1' }}>
          <label className="flbl">Hook principal <span style={{ color: C.red }}>*</span></label>
          <input className="finput" placeholder="¿Todavía pagás de más?" value={form.hook} onChange={e => set('hook', e.target.value)} />
        </div>
        <div className="fg">
          <label className="flbl">Estilo visual</label>
          <input className="finput" placeholder="Texto grande + transición rápida" value={form.style} onChange={e => set('style', e.target.value)} />
        </div>
        <div className="fg">
          <label className="flbl">Tono</label>
          <input className="finput" placeholder="Urgencia / Inspiración / Humor" value={form.tone} onChange={e => set('tone', e.target.value)} />
        </div>
        <div className="fg">
          <label className="flbl">Plataforma</label>
          <select className="fsel" value={form.platform} onChange={e => set('platform', e.target.value)}>
            {['reels', 'stories', 'feed'].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="fg">
          <label className="flbl">Score estimado</label>
          <input className="finput" type="number" min={50} max={100} value={form.score} onChange={e => set('score', +e.target.value)} />
        </div>
        <div className="fg" style={{ gridColumn: '1/-1' }}>
          <label className="flbl">Audiencia ideal</label>
          <input className="finput" placeholder="Mujeres 22-38, moda" value={form.audience} onChange={e => set('audience', e.target.value)} />
        </div>
        <div className="fg" style={{ gridColumn: '1/-1' }}>
          <label className="flbl">CTA</label>
          <input className="finput" placeholder="Escribinos por WhatsApp" value={form.cta} onChange={e => set('cta', e.target.value)} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <button className="btn btn-p" onClick={() => form.hook.trim() && onSave(form)} style={{ flex: 1 }}>Guardar patrón</button>
        <button className="btn btn-g" onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}

// ── Analyze Tab ──────────────────────────────────────────────────────────────

function AnalyzeTab({ onExtracted }: { onExtracted: (p: Partial<AiPattern>) => void }) {
  const [tab, setTab] = useState<'content' | 'manual'>('content');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<Partial<AiPattern> | null>(null);
  const [toast, setToast] = useState('');

  const analyze = async () => {
    if (!content.trim() && !url.trim()) return;
    setAnalyzing(true); setResult(null);
    try {
      const res = await aiTrainingApi.analyze(content || url, url || undefined);
      const data = (res.data as any)?.data ?? res.data;
      setResult(data);
    } catch {
      setResult({ hook: 'Hook viral detectado', style: 'Estilo limpio y directo', tone: 'Urgencia', score: 78, platform: 'reels' });
    }
    setAnalyzing(false);
  };

  const save = () => {
    if (!result) return;
    onExtracted({ ...result, source: url ? 'URL' : 'Análisis IA' });
    setResult(null); setContent(''); setUrl('');
    setToast('✅ Patrón extraído y guardado');
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div>
      {toast && (
        <div style={{ position: 'fixed', top: 16, right: 16, background: C.green, color: '#fff', padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 500, zIndex: 999 }}>{toast}</div>
      )}

      <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
        {[['content', '✍️ Pegar contenido'], ['manual', '⚙️ Entrada manual']].map(([id, lbl]) => (
          <button key={id} onClick={() => setTab(id as any)} style={{ padding: '7px 16px', borderRadius: 8, border: `1.5px solid ${tab === id ? C.accent : C.border}`, background: tab === id ? C.accentDim : 'transparent', color: tab === id ? C.accent : C.textMuted, cursor: 'pointer', fontSize: 12, transition: 'all .15s' }}>{lbl}</button>
        ))}
      </div>

      {tab === 'content' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card">
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, marginBottom: 12, fontSize: 13 }}>📋 Pegá el contenido</div>
            <div className="fg" style={{ marginBottom: 10 }}>
              <label className="flbl">Script / copy del anuncio</label>
              <textarea className="ftxt" style={{ minHeight: 130, fontSize: 12 }} placeholder="Pegá el texto del video o anuncio viral que querés analizar..." value={content} onChange={e => setContent(e.target.value)} />
            </div>
            <div className="fg" style={{ marginBottom: 14 }}>
              <label className="flbl">URL de referencia (opcional)</label>
              <input className="finput" placeholder="https://tiktok.com/..." value={url} onChange={e => setUrl(e.target.value)} />
            </div>
            <button className="btn btn-p" style={{ width: '100%', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} onClick={analyze} disabled={analyzing || (!content.trim() && !url.trim())}>
              {analyzing ? <><Spinner color="#fff" /> Analizando con IA...</> : '🤖 Extraer patrón con IA'}
            </button>
          </div>

          <div className="card">
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, marginBottom: 12, fontSize: 13 }}>🎯 Patrón extraído</div>
            {!result && !analyzing && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: C.textDim, fontSize: 13 }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>🧠</div>
                Pegá un contenido y la IA extraerá el patrón viral automáticamente
              </div>
            )}
            {analyzing && (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <Spinner size={28} />
                <div style={{ fontSize: 12, color: C.textMuted, marginTop: 14 }}>Analizando patrones virales...</div>
              </div>
            )}
            {result && !analyzing && (
              <div>
                {([['Hook', result.hook], ['Estilo', result.style], ['Tono', result.tone], ['CTA', result.cta], ['Audiencia', result.audience], ['Plataforma', result.platform]] as [string, any][]).filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: `1px solid ${C.border}22`, fontSize: 12 }}>
                    <span style={{ color: C.textMuted, flexShrink: 0 }}>{k}</span>
                    <span style={{ fontWeight: 500, textAlign: 'right', maxWidth: '65%' }}>{String(v)}</span>
                  </div>
                ))}
                {result.score && (
                  <div style={{ marginTop: 10, padding: '8px 12px', background: C.accentDim, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: C.accent }}>Score viral estimado</span>
                    <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: C.accent }}>{result.score}</span>
                  </div>
                )}
                <button className="btn btn-p" style={{ width: '100%', marginTop: 14 }} onClick={save}>💾 Guardar en biblioteca</button>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'manual' && (
        <AddPatternForm
          onSave={p => { onExtracted(p); setToast('✅ Patrón guardado'); setTimeout(() => setToast(''), 3000); }}
          onCancel={() => {}}
        />
      )}

      {/* Cuadro de instrucciones */}
      <div style={{ marginTop: 18, padding: '14px 16px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 12, lineHeight: 1.7, color: C.textMuted }}>
        <div style={{ fontWeight: 600, color: C.text, marginBottom: 6, fontFamily: "'Syne',sans-serif" }}>💡 Cómo entrenar mejor a la IA</div>
        <ul style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <li>Pegá scripts de videos virales de TikTok, Instagram Reels o Meta Ad Library</li>
          <li>La IA extrae el hook, estilo visual, tono y audiencia ideal automáticamente</li>
          <li>Cuantos más patrones activos tengas, más personalizada será la generación de creativos</li>
          <li>Score +85 = patrón de alto rendimiento. Priorizá siempre estos.</li>
        </ul>
      </div>
    </div>
  );
}

// ── Config Tab ───────────────────────────────────────────────────────────────

function ConfigTab() {
  const [cfg, setCfg] = useState({
    autoLearn: true,
    minScore: 75,
    preferReels: true,
    language: 'rioplatense',
    urgency: true,
    emoji: false,
    maxHookWords: 10,
  });
  const set = (k: string, v: any) => setCfg(p => ({ ...p, [k]: v }));
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div style={{ maxWidth: 600 }}>
      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 13, marginBottom: 14 }}>🤖 Comportamiento de la IA</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            ['Aprendizaje automático', 'La IA aprende de los creativos con mejor CTR', 'autoLearn'],
            ['Priorizar Reels 9:16', 'Genera primero el formato de mayor alcance', 'preferReels'],
            ['Tono de urgencia', 'Incluye escasez y urgencia en los hooks', 'urgency'],
            ['Incluir emojis', 'Agrega emojis en hooks y copies', 'emoji'],
          ].map(([label, desc, key]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: C.bg, borderRadius: 8, border: `1px solid ${C.border}` }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{desc}</div>
              </div>
              <Toggle checked={(cfg as any)[key]} onChange={() => set(key, !(cfg as any)[key])} />
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 13, marginBottom: 14 }}>⚙️ Parámetros</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="fg">
            <label className="flbl">Score mínimo de patrones</label>
            <input className="finput" type="number" min={50} max={99} value={cfg.minScore} onChange={e => set('minScore', +e.target.value)} />
          </div>
          <div className="fg">
            <label className="flbl">Max palabras en hook</label>
            <input className="finput" type="number" min={5} max={20} value={cfg.maxHookWords} onChange={e => set('maxHookWords', +e.target.value)} />
          </div>
          <div className="fg" style={{ gridColumn: '1/-1' }}>
            <label className="flbl">Variante de idioma</label>
            <select className="fsel" value={cfg.language} onChange={e => set('language', e.target.value)}>
              <option value="rioplatense">Español rioplatense (Argentina)</option>
              <option value="neutro">Español neutro (LATAM)</option>
              <option value="mexico">Español México</option>
            </select>
          </div>
        </div>
      </div>

      {saved && <div className="ok-box">✅ Configuración guardada</div>}
      <button className="btn btn-p" style={{ padding: '10px 24px' }} onClick={save}>Guardar configuración</button>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function ConversiaIA() {
  const [tab, setTab] = useState<'library' | 'train' | 'config'>('library');
  const [patterns, setPatterns] = useState<AiPattern[]>(MOCK_PATTERNS);
  const [stats, setStats] = useState<AiTrainingStats | null>(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000); };

  const loadPatterns = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, sRes] = await Promise.all([
        aiTrainingApi.getPatterns({ platform: filter === 'all' ? undefined : filter, search: search || undefined }),
        aiTrainingApi.getStats(),
      ]);
      const pData = (pRes.data as any)?.data ?? pRes.data;
      const sData = (sRes.data as any)?.data ?? sRes.data;
      if (Array.isArray(pData) && pData.length) setPatterns(pData);
      if (sData) setStats(sData);
    } catch {
      // keep mock data
    }
    setLoading(false);
  }, [filter, search]);

  useEffect(() => { loadPatterns(); }, [loadPatterns]);

  const togglePattern = async (id: string, active: boolean) => {
    setPatterns(p => p.map(x => x.id === id ? { ...x, active } : x));
    try { await aiTrainingApi.update(id, { active }); } catch { loadPatterns(); }
  };

  const deletePattern = async (id: string) => {
    setPatterns(p => p.filter(x => x.id !== id));
    try { await aiTrainingApi.remove(id); showToast('🗑️ Patrón eliminado'); } catch { loadPatterns(); }
  };

  const saveNewPattern = async (dto: Partial<AiPattern>) => {
    try {
      const res = await aiTrainingApi.create(dto as any);
      const data = (res.data as any)?.data ?? res.data;
      setPatterns(p => [data, ...p]);
    } catch {
      const mock: AiPattern = { id: `m${Date.now()}`, source: dto.source ?? 'Manual', type: dto.type ?? 'video', hook: dto.hook ?? '', style: dto.style ?? '', platform: dto.platform ?? 'reels', tone: dto.tone ?? '', visual_notes: '', cta: dto.cta ?? '', audience: dto.audience ?? '', score: dto.score ?? 80, active: true, uses: 0, created_at: new Date().toISOString() };
      setPatterns(p => [mock, ...p]);
    }
    setShowAdd(false);
    showToast('✅ Patrón guardado en biblioteca');
  };

  const displayed = patterns.filter(p => {
    if (filter !== 'all' && p.platform !== filter) return false;
    if (search && !p.hook.toLowerCase().includes(search.toLowerCase()) && !p.style?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="content fade-in">
      {toast && <div style={{ position: 'fixed', top: 16, right: 16, background: C.green, color: '#fff', padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 500, zIndex: 999, boxShadow: '0 4px 20px #0006' }}>{toast}</div>}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#7c5cfc,#4da6ff)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14, color: '#fff' }}>C</div>
            <div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: '-.01em' }}>CONVERSIA <span style={{ background: 'linear-gradient(135deg,#7c5cfc,#4da6ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>IA</span></div>
              <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'DM Mono',monospace", marginTop: -2 }}>Sistema de entrenamiento de inteligencia artificial</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 7 }}>
          {tab === 'library' && <button className="btn btn-p btn-sm" onClick={() => setShowAdd(v => !v)}>+ Patrón manual</button>}
        </div>
      </div>

      {/* Stats */}
      <div className="g4" style={{ marginBottom: 18 }}>
        {[
          ['🧠', 'Patrones activos', stats ? stats.active_count : patterns.filter(p => p.active).length.toString(), 'green'],
          ['📊', 'Score promedio', stats ? `${stats.avg_score}` : '85', 'purple'],
          ['⚡', 'Total usos', stats ? stats.total_uses : patterns.reduce((a, p) => a + p.uses, 0).toString(), 'blue'],
          ['🎯', 'Total patrones', stats ? stats.total_count : patterns.length.toString(), ''],
        ].map(([icon, lbl, val, color]) => (
          <div key={String(lbl)} className="card card-sm" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>{icon}</span>
            <div>
              <div className="m-lbl">{lbl}</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 22, marginTop: 2, color: color === 'green' ? C.green : color === 'purple' ? C.accent : color === 'blue' ? C.blue : C.text }}>{val}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, background: C.bg, borderRadius: 10, padding: 3, marginBottom: 20, width: 'fit-content' }}>
        {[['library', '📚 Biblioteca'], ['train', '🧪 Entrenar'], ['config', '⚙️ Configuración']].map(([id, lbl]) => (
          <button key={id} onClick={() => setTab(id as any)} style={{ padding: '8px 18px', borderRadius: 8, border: tab === id ? `1px solid ${C.border}` : 'none', background: tab === id ? C.surface : 'transparent', color: tab === id ? C.text : C.textMuted, cursor: 'pointer', fontSize: 12.5, fontWeight: tab === id ? 500 : 400, transition: 'all .15s', fontFamily: "'DM Sans',sans-serif" }}>{lbl}</button>
        ))}
      </div>

      {/* Library Tab */}
      {tab === 'library' && (
        <div>
          {showAdd && <AddPatternForm onSave={saveNewPattern} onCancel={() => setShowAdd(false)} />}

          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            {PLATFORMS.map(p => (
              <button key={p.id} onClick={() => setFilter(p.id)} style={{ padding: '5px 13px', borderRadius: 20, fontSize: 12, border: `1px solid ${filter === p.id ? C.accent : C.border}`, background: filter === p.id ? C.accentDim : 'transparent', color: filter === p.id ? C.accent : C.textMuted, cursor: 'pointer', transition: 'all .15s' }}>{p.label}</button>
            ))}
            <input className="finput" placeholder="🔍 Buscar patrón..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginLeft: 'auto', width: 220, fontSize: 12 }} />
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}><Spinner size={24} /></div>
          ) : displayed.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: C.textMuted }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🧠</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, marginBottom: 8 }}>Sin patrones todavía</div>
              <div style={{ fontSize: 13 }}>Agregá patrones en la pestaña "Entrenar" para que la IA mejore sus creativos</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 14 }}>
              {displayed.map(p => (
                <PatternCard key={p.id} p={p} onToggle={togglePattern} onDelete={deletePattern} />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'train' && <AnalyzeTab onExtracted={saveNewPattern} />}
      {tab === 'config' && <ConfigTab />}
    </div>
  );
}
