import { useState } from 'react';
import { Tag, Spinner, Toggle } from '../../components/ui';
import { aiApi } from '../../api/ai';
import api from '../../api/client';
import { C } from '../../styles/theme';
import type { Creative } from '../../types';
import { generateCreativeImage } from '../../utils/creativeCanvas';

const AVATARS = [
  { id: 'a1', name: 'Sofía', style: 'Presentadora', emoji: '👩', bg: 'linear-gradient(135deg,#1a0a2e,#2d1555)' },
  { id: 'a2', name: 'Marcos', style: 'Vendedor', emoji: '👨', bg: 'linear-gradient(135deg,#0a1a2e,#1535ab)' },
  { id: 'a3', name: 'Valentina', style: 'Influencer', emoji: '👩‍🦰', bg: 'linear-gradient(135deg,#2e0a1a,#ab1535)' },
  { id: 'a4', name: 'Sin avatar', style: 'Solo producto', emoji: '📦', bg: 'linear-gradient(135deg,#0a2e0a,#1a8020)' },
];

const TEMPLATES = [
  { id: 't1', name: 'Hook urgencia', fmt: '9:16', from: '#1a0528', to: '#3d0f6b', preview: '🎬' },
  { id: 't2', name: 'Oferta limitada', fmt: '9:16', from: '#280505', to: '#6b0f0f', preview: '🔥' },
  { id: 't3', name: 'Unboxing', fmt: '9:16', from: '#05281a', to: '#0f6b3d', preview: '📦' },
  { id: 't4', name: 'Comparativa', fmt: '1:1', from: '#050528', to: '#0f1a6b', preview: '⚡' },
  { id: 't5', name: 'Testimonial', fmt: '4:5', from: '#281a05', to: '#6b4f0f', preview: '⭐' },
  { id: 't6', name: 'Producto hero', fmt: '1:1', from: '#1a0528', to: '#6b0f5b', preview: '✨' },
];

const MUSIC_LIST = ['🎵 Trending pop', '🎸 Energético', '🎹 Minimal', '💫 Motivacional', '🔇 Sin música'];
const VOICE_LIST = ['Femenina — Natural', 'Masculina — Profesional', 'Neutra', 'Femenina — Joven'];

const MOCK_CREATIVES: Creative[] = [
  { id: 'c1', name: 'Reel Nike Air — Hook urgencia', fmt: '9:16', type: 'video', status: 'listo', ctr: '4.8%', icon: '🎬', bg: 'linear-gradient(135deg,#0d1b2a,#1a2a40)', hook: '¿Todavía pagás de más?', platform: 'reels' },
  { id: 'c2', name: 'Story bolsos — Precio gancho', fmt: '9:16', type: 'video', status: 'listo', ctr: '3.2%', icon: '👜', bg: 'linear-gradient(135deg,#1a0a0d,#2a1015)', hook: 'Solo por hoy 40% OFF', platform: 'stories' },
  { id: 'c3', name: 'Feed gaming — Carrusel', fmt: '1:1', type: 'image', status: 'generando', icon: '🎮', bg: 'linear-gradient(135deg,#0a1a0a,#102010)', platform: 'feed' },
  { id: 'c4', name: 'Reel zapatillas — Trending', fmt: '9:16', type: 'video', status: 'listo', ctr: '5.1%', icon: '👟', bg: 'linear-gradient(135deg,#1a1a0a,#2a2a10)', hook: 'El par que todos buscan', platform: 'reels' },
  { id: 'c5', name: 'Story ropa invierno', fmt: '4:5', type: 'image', status: 'listo', ctr: '2.9%', icon: '🧥', bg: 'linear-gradient(135deg,#0d0d1a,#151525)', platform: 'stories' },
  { id: 'c6', name: 'Feed tech — Oferta', fmt: '1:1', type: 'image', status: 'borrador', icon: '💻', bg: 'linear-gradient(135deg,#1a0d1a,#251025)', platform: 'feed' },
];

const CMPGS = [
  { id: 1, name: 'Zapatillas Nike Air - Reels', status: 'activa', roas: '4.1x', leads: 82 },
  { id: 2, name: 'Bolsos importados - Stories', status: 'activa', roas: '3.2x', leads: 38 },
  { id: 3, name: 'Ropa de invierno - Feed', status: 'pausada', roas: '1.2x', leads: 9 },
  { id: 4, name: 'Tecnología gaming - Carrusel', status: 'optimizando', roas: '5.8x', leads: 179 },
];

function CreativeStudio({ onAttach, setCreatives }: { onAttach: (c: Creative) => void; setCreatives: React.Dispatch<React.SetStateAction<Creative[]>> }) {
  const [selTpl, setSelTpl] = useState('t1');
  const [selAv, setSelAv] = useState('a1');
  const [music, setMusic] = useState(0);
  const [voice, setVoice] = useState(0);
  const [script, setScript] = useState('');
  const [hook, setHook] = useState('');
  const [product, setProduct] = useState('');
  const [fmt, setFmt] = useState<'9:16' | '4:5' | '1:1'>('9:16');
  const [genScript, setGenScript] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState<Creative | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [subtitles, setSubtitles] = useState(true);
  const [ctaWa, setCtaWa] = useState(true);

  const tpl = TEMPLATES.find(t => t.id === selTpl) ?? TEMPLATES[0];
  const av = AVATARS.find(a => a.id === selAv) ?? AVATARS[0];

  const refreshPreview = (hookText: string, productText: string, tplObj = tpl, avObj = av, fmtStr = fmt) => {
    if (!hookText.trim() && !productText.trim()) return;
    const img = generateCreativeImage({
      hook: hookText || 'Tu hook aquí',
      product: productText || 'Producto',
      format: fmtStr,
      style: tplObj.name,
      avatarEmoji: avObj.emoji,
      gradientFrom: tplObj.from,
      gradientTo: tplObj.to,
    });
    setPreviewImg(img);
  };

  const makeScript = async () => {
    if (!product.trim()) return;
    setGenScript(true);
    try {
      const res = await aiApi.generateScript(product, tpl.name, fmt);
      const txt = (res.data as { text?: string })?.text ?? '';
      setScript(txt);
      const firstHook = txt.split(/[.!\n]/)[0]?.slice(0, 30) ?? 'Hook aquí';
      setHook(firstHook);
      refreshPreview(firstHook, product);
    } catch {
      const fallback = '¿Todavía pagás de más?\nConseguí el tuyo ahora.\nSolo por hoy. ¡Escribinos por WhatsApp!';
      setScript(fallback);
      setHook('¿Todavía pagás de más?');
      refreshPreview('¿Todavía pagás de más?', product);
    }
    setGenScript(false);
  };

  const generate = async () => {
    if (!product.trim()) return;
    setGenerating(true); setProgress(0); setDone(null);

    let activeScript = script;
    let activeHook = hook;

    if (!activeScript.trim()) {
      setProgress(12);
      try {
        const res = await aiApi.generateScript(product, tpl.name, fmt);
        const txt = (res.data as { text?: string })?.text ?? (res.data as any)?.data?.text ?? '';
        if (txt) {
          activeScript = txt;
          activeHook = txt.split(/[.!\n]/)[0]?.slice(0, 30) ?? activeHook;
          setScript(activeScript);
          setHook(activeHook);
        }
      } catch { /* keep current hook */ }
    }

    setProgress(30);
    await new Promise(r => setTimeout(r, 300));
    setProgress(55);

    // Generate actual canvas image
    const imageUrl = generateCreativeImage({
      hook: activeHook || product,
      product,
      format: fmt,
      style: tpl.name,
      avatarEmoji: av.emoji,
      gradientFrom: tpl.from,
      gradientTo: tpl.to,
    });
    setPreviewImg(imageUrl);

    setProgress(80);
    await new Promise(r => setTimeout(r, 250));
    setProgress(100);

    const nc: Creative = {
      id: `cr${Date.now()}`,
      name: `${product} — ${tpl.name}`,
      fmt,
      type: fmt !== '1:1' ? 'video' : 'image',
      status: 'listo',
      ctr: '—',
      bg: `linear-gradient(135deg,${tpl.from},${tpl.to})`,
      icon: tpl.preview,
      hook: activeHook || 'Hook viral',
      platform: fmt === '9:16' ? 'reels' : fmt === '4:5' ? 'stories' : 'feed',
      imageUrl,
    };

    try {
      await api.post('/creatives', {
        name: nc.name, type: nc.type,
        format: fmt.replace(':', '_'),
        aiPrompt: activeScript,
      });
    } catch { /* non-fatal */ }

    setCreatives(p => [nc, ...p]); setDone(nc); setGenerating(false);
  };

  const fmtChanged = (f: '9:16' | '4:5' | '1:1') => {
    setFmt(f);
    if (hook || product) refreshPreview(hook, product, tpl, av, f);
  };

  const tplChanged = (id: string) => {
    const t = TEMPLATES.find(x => x.id === id) ?? TEMPLATES[0];
    setSelTpl(id);
    setFmt(t.fmt as '9:16' | '4:5' | '1:1');
    if (hook || product) refreshPreview(hook, product, t, av, t.fmt as '9:16' | '4:5' | '1:1');
  };

  const avChanged = (id: string) => {
    const a = AVATARS.find(x => x.id === id) ?? AVATARS[0];
    setSelAv(id);
    if (hook || product) refreshPreview(hook, product, tpl, a, fmt);
  };

  const aspectRatio = fmt === '9:16' ? '9/16' : fmt === '4:5' ? '4/5' : '1';
  const maxWidth = fmt === '9:16' ? 160 : fmt === '4:5' ? 210 : 230;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 260px', gap: 0, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', height: 540 }}>
      {/* Left: Templates + Avatars */}
      <div style={{ background: C.surface, borderRight: `1px solid ${C.border}`, overflowY: 'auto' }}>
        <div style={{ fontSize: 10, color: C.textMuted, fontFamily: "'DM Mono',monospace", textTransform: 'uppercase', padding: '12px 12px 7px', letterSpacing: '.1em' }}>Plantillas</div>
        <div style={{ padding: '0 8px 10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
          {TEMPLATES.map(t => (
            <div key={t.id} onClick={() => tplChanged(t.id)} style={{ border: `1.5px solid ${selTpl === t.id ? C.accent : C.border}`, borderRadius: 8, overflow: 'hidden', cursor: 'pointer', transition: 'all .15s' }}>
              <div style={{ background: `linear-gradient(135deg,${t.from},${t.to})`, aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{t.preview}</div>
              <div style={{ padding: '5px 7px' }}>
                <div style={{ fontSize: 10, fontWeight: 500 }}>{t.name}</div>
                <div style={{ fontSize: 9, color: C.textMuted, fontFamily: "'DM Mono',monospace" }}>{t.fmt}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 10, color: C.textMuted, fontFamily: "'DM Mono',monospace", textTransform: 'uppercase', padding: '8px 12px 7px', letterSpacing: '.1em', borderTop: `1px solid ${C.border}` }}>Avatares IA</div>
        <div style={{ padding: '0 8px 10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {AVATARS.map(a => (
            <div key={a.id} onClick={() => avChanged(a.id)} style={{ border: `1.5px solid ${selAv === a.id ? C.accent : C.border}`, borderRadius: 8, padding: 8, textAlign: 'center', cursor: 'pointer', background: selAv === a.id ? C.accentDim : 'transparent', transition: 'all .15s' }}>
              <div style={{ fontSize: 22, marginBottom: 3 }}>{a.emoji}</div>
              <div style={{ fontSize: 10, fontWeight: 500 }}>{a.name}</div>
              <div style={{ fontSize: 9, color: C.textMuted }}>{a.style}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Center: Preview */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, background: C.bg, gap: 12 }}>
        <div style={{ width: '100%', maxWidth, aspectRatio, borderRadius: 10, overflow: 'hidden', position: 'relative', boxShadow: '0 20px 60px #0009' }}>
          {previewImg ? (
            <img src={previewImg} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{ background: `linear-gradient(135deg,${tpl.from},${tpl.to})`, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 38 }}>{tpl.preview}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.9)', fontFamily: "'Syne',sans-serif", fontWeight: 700, textAlign: 'center', padding: '0 12px', lineHeight: 1.3 }}>{hook || 'Tu hook aquí'}</div>
              {av.id !== 'a4' && <div style={{ fontSize: 24 }}>{av.emoji}</div>}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 10px 8px', background: 'linear-gradient(to top,#000c,transparent)' }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,.8)', fontWeight: 600, textAlign: 'center' }}>💬 Escribinos por WhatsApp</div>
              </div>
            </div>
          )}
          {generating && (
            <div style={{ position: 'absolute', inset: 0, background: '#000a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Spinner size={24} />
            </div>
          )}
        </div>
        {generating && (
          <div style={{ width: '100%', maxWidth: 240 }}>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6, textAlign: 'center' }}>Generando… {progress}%</div>
            <div style={{ background: C.border, borderRadius: 3, height: 4, overflow: 'hidden' }}><div style={{ height: 4, borderRadius: 3, background: C.grad, width: `${progress}%`, transition: 'width .25s ease' }} /></div>
            <div style={{ fontSize: 10, color: C.textDim, textAlign: 'center', marginTop: 5, fontFamily: "'DM Mono',monospace" }}>{progress < 40 ? 'Generando script IA...' : progress < 75 ? 'Renderizando creativo...' : '¡Casi listo!'}</div>
          </div>
        )}
        {done && !generating && (
          <div style={{ background: C.greenDim, border: `1px solid ${C.green}33`, borderRadius: 9, padding: '9px 13px', textAlign: 'center', maxWidth: 240, width: '100%' }}>
            <div style={{ fontSize: 12, color: C.green, fontWeight: 600, marginBottom: 7 }}>✅ Creativo listo</div>
            <div style={{ display: 'flex', gap: 7, justifyContent: 'center' }}>
              <button className="btn btn-green btn-sm" onClick={() => onAttach(done)}>📎 Adjuntar</button>
              <a href={done.imageUrl} download={`${done.name}.jpg`} className="btn btn-g btn-sm" style={{ textDecoration: 'none' }}>📥 Bajar</a>
            </div>
          </div>
        )}
      </div>

      {/* Right: Config */}
      <div style={{ background: C.surface, borderLeft: `1px solid ${C.border}`, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 13 }}>Configuración</div>
        <div className="fg">
          <label className="flbl">Producto</label>
          <input className="finput" placeholder="ej. Nike Air Max" value={product} onChange={e => setProduct(e.target.value)} style={{ fontSize: 12 }} />
        </div>
        <div className="fg">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
            <label className="flbl">Script IA</label>
            <button onClick={makeScript} disabled={genScript || !product.trim()} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 5, border: `1px solid ${C.accent}44`, background: C.accentDim, color: C.accent, cursor: 'pointer' }}>
              {genScript ? <Spinner size={10} /> : '✨ Generar'}
            </button>
          </div>
          <textarea className="ftxt" style={{ minHeight: 70, fontSize: 11 }} placeholder="Script generado por IA…" value={script} onChange={e => setScript(e.target.value)} />
        </div>
        <div className="fg">
          <label className="flbl">Hook superpuesto</label>
          <input className="finput" placeholder="¿Todavía pagás de más?" value={hook}
            onChange={e => { setHook(e.target.value); refreshPreview(e.target.value, product); }}
            style={{ fontSize: 12 }} />
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          {(['9:16', '4:5', '1:1'] as const).map(f => (
            <button key={f} onClick={() => fmtChanged(f)} style={{ flex: 1, padding: '5px 2px', borderRadius: 7, border: `1.5px solid ${fmt === f ? C.accent : C.border}`, background: fmt === f ? C.accentDim : 'transparent', color: fmt === f ? C.accent : C.textMuted, cursor: 'pointer', fontSize: 11, fontFamily: "'DM Mono',monospace" }}>{f}</button>
          ))}
        </div>
        <div className="fg"><label className="flbl">Música</label><select className="fsel" style={{ fontSize: 11 }} value={music} onChange={e => setMusic(+e.target.value)}>{MUSIC_LIST.map((m, i) => <option key={i} value={i}>{m}</option>)}</select></div>
        <div className="fg"><label className="flbl">Voz avatar</label><select className="fsel" style={{ fontSize: 11 }} value={voice} onChange={e => setVoice(+e.target.value)}>{VOICE_LIST.map((v, i) => <option key={i} value={i}>{v}</option>)}</select></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 9px', background: C.bg, borderRadius: 7, fontSize: 11 }}>
          <span>Subtítulos auto</span><Toggle checked={subtitles} onChange={() => setSubtitles(v => !v)} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 9px', background: C.bg, borderRadius: 7, fontSize: 11 }}>
          <span>CTA WhatsApp</span><Toggle checked={ctaWa} onChange={() => setCtaWa(v => !v)} />
        </div>
        <button onClick={generate} disabled={generating || !product.trim()} style={{ width: '100%', padding: '11px', fontSize: 13, fontWeight: 600, background: (generating || !product.trim()) ? C.border : C.grad, color: '#fff', border: 'none', borderRadius: 9, cursor: (generating || !product.trim()) ? 'not-allowed' : 'pointer', marginTop: 4, transition: 'all .15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
          {generating ? <><Spinner color="#fff" />{progress}%</> : '🎬 Generar creativo'}
        </button>
      </div>
    </div>
  );
}

export default function Creatives() {
  const [tab, setTab] = useState<'studio' | 'gallery'>('studio');
  const [creatives, setCreatives] = useState<Creative[]>(MOCK_CREATIVES);
  const [filter, setFilter] = useState('todos');
  const [attachModal, setAttachModal] = useState<Creative | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3200); };
  const confirmAttach = (campId: number) => {
    const camp = CMPGS.find(c => c.id === campId);
    setAttachModal(null);
    showToast(`✅ "${attachModal?.name}" adjuntado a "${camp?.name}"`);
  };

  const filtered = creatives.filter(c => filter === 'todos' || c.platform === filter);

  return (
    <div className="content fade-in">
      {toast && <div style={{ position: 'fixed', top: 16, right: 16, background: C.green, color: '#fff', padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 500, zIndex: 999, boxShadow: '0 4px 20px #0006' }}>{toast}</div>}

      <div className="g4" style={{ marginBottom: 18 }}>
        {[['🎨', 'Creativos', creatives.length], ['📊', 'CTR prom.', '4.3%'], ['🏆', 'Top formato', 'Reels 9:16'], ['⚡', 'Hoy generados', '6']].map(([icon, lbl, val]) => (
          <div key={String(lbl)} className="card card-sm" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>{icon}</span>
            <div><div className="m-lbl">{lbl}</div><div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, marginTop: 2 }}>{val}</div></div>
          </div>
        ))}
      </div>

      <div className="auth-tabs" style={{ marginBottom: 18 }}>
        {[['studio', '🎬 Studio IA'], ['gallery', '🖼️ Galería']].map(([id, lbl]) => (
          <button key={id} className={`auth-tab${tab === id ? ' active' : ''}`} onClick={() => setTab(id as 'studio' | 'gallery')}>{lbl}</button>
        ))}
      </div>

      {tab === 'studio' && <CreativeStudio onAttach={setAttachModal} setCreatives={setCreatives} />}

      {tab === 'gallery' && (
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            {[['todos', 'Todos'], ['reels', 'Reels 9:16'], ['stories', 'Stories'], ['feed', 'Feed 1:1']].map(([id, lbl]) => (
              <button key={id} onClick={() => setFilter(id)} style={{ padding: '5px 13px', borderRadius: 20, fontSize: 12, border: `1px solid ${filter === id ? C.accent : C.border}`, background: filter === id ? C.accentDim : 'transparent', color: filter === id ? C.accent : C.textMuted, cursor: 'pointer', transition: 'all .15s' }}>{lbl}</button>
            ))}
            <button className="btn btn-p btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setTab('studio')}>+ Nuevo en Studio</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))', gap: 12 }}>
            {filtered.map(c => (
              <div key={c.id} style={{ background: C.surface, border: `1.5px solid ${c.status === 'generando' ? C.amber : C.border}`, borderRadius: 10, overflow: 'hidden', cursor: 'pointer', transition: 'all .2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = C.accent)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = c.status === 'generando' ? C.amber : C.border)}>
                <div style={{ background: c.bg, aspectRatio: c.fmt === '9:16' ? '9/16' : c.fmt === '4:5' ? '4/5' : '1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 5, position: 'relative', minHeight: 100, overflow: 'hidden' }}>
                  {c.imageUrl ? (
                    <img src={c.imageUrl} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                  ) : (
                    <>
                      {c.status === 'generando' && <div style={{ position: 'absolute', inset: 0, background: '#000a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 5 }}><Spinner size={18} /><div style={{ fontSize: 9, color: '#fff', fontFamily: "'DM Mono',monospace" }}>Generando…</div></div>}
                      <span style={{ fontSize: 26 }}>{c.icon}</span>
                      {c.hook && <div style={{ fontSize: 9, color: 'rgba(255,255,255,.75)', padding: '2px 7px', background: 'rgba(0,0,0,.45)', borderRadius: 4, maxWidth: '86%', textAlign: 'center', lineHeight: 1.3 }}>"{c.hook}"</div>}
                      <span style={{ fontSize: 8, color: 'rgba(255,255,255,.35)', fontFamily: "'DM Mono',monospace" }}>{c.fmt}</span>
                    </>
                  )}
                </div>
                <div style={{ padding: '9px 10px' }}>
                  <div style={{ fontSize: 11, fontWeight: 500, marginBottom: 5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                    <Tag t={c.status === 'listo' ? 'tg' : c.status === 'generando' ? 'ta' : 'tb'}>{c.status}</Tag>
                    {c.ctr && <span style={{ fontSize: 10, color: C.textMuted, fontFamily: "'DM Mono',monospace" }}>CTR {c.ctr}</span>}
                  </div>
                  <button className="btn btn-g" style={{ width: '100%', fontSize: 11, padding: '5px', border: `1px solid ${C.accent}44`, color: C.accent, background: C.accentDim }} onClick={() => setAttachModal(c)}>
                    📎 Adjuntar a campaña
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {attachModal && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setAttachModal(null)}>
          <div className="modal modal-sm sci">
            <div className="modal-head"><div className="modal-title">Adjuntar a campaña</div><button className="close-btn" onClick={() => setAttachModal(null)}>✕</button></div>
            <div className="modal-body">
              <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 14 }}>Adjuntando: <strong style={{ color: C.text }}>"{attachModal.name}"</strong></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {CMPGS.map(camp => (
                  <div key={camp.id} onClick={() => confirmAttach(camp.id)}
                    style={{ padding: '11px 13px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 9, cursor: 'pointer', transition: 'all .15s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = C.accent)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{camp.name}</div>
                      <div style={{ fontSize: 11, color: C.textMuted }}>ROAS {camp.roas} · {camp.leads} leads</div>
                    </div>
                    <Tag t={camp.status === 'activa' ? 'tg' : camp.status === 'pausada' ? 'tr' : 'ta'}>{camp.status}</Tag>
                  </div>
                ))}
                <div onClick={() => { setAttachModal(null); showToast(`✅ "${attachModal.name}" guardado para próxima campaña`); }}
                  style={{ padding: '10px 13px', background: C.accentDim, border: `1.5px dashed ${C.accent}44`, borderRadius: 9, cursor: 'pointer', textAlign: 'center', fontSize: 13, color: C.accent }}>
                  ✨ Usar en nueva campaña
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
