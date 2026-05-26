import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Plan } from '../types';

const PLANS: Plan[] = [
  { id: 'starter', name: 'Starter', price: 49, featured: false,
    features: ['20 campañas/mes', '50 creativos IA', 'Reportes automáticos', 'Dashboard básico', 'Soporte email'],
    no: ['Múltiples cuentas Meta', 'Optimización avanzada IA', 'Subusuarios'] },
  { id: 'growth', name: 'Growth', price: 99, featured: true,
    features: ['Campañas ilimitadas', 'Creativos IA ilimitados', 'Optimización IA avanzada', 'Dashboard premium', '3 cuentas Meta', '2 subusuarios', 'Informe IA diario'],
    no: ['IA avanzada + custom', 'Acceso API'] },
  { id: 'scale', name: 'Scale', price: 199, featured: false,
    features: ['Todo de Growth', 'IA avanzada + custom', 'Automatizaciones ilimitadas', 'Prioridad máxima IA', 'Reportes avanzados', '10 subusuarios', 'Acceso API completo'],
    no: [] },
];

const TICKER = ['8.4× ROAS promedio', '+340% más leads', '92% tasa de entrega', '-68% costo por lead', '10 min de producto a campaña', 'Sin conocimientos técnicos', 'Directo a WhatsApp'];

const FEATURES = [
  { icon: '🤖', title: 'IA genera tus creativos', desc: 'Videos, imágenes y reels en todos los formatos. Hooks virales, subtítulos automáticos. Solo das el producto.' },
  { icon: '🎯', title: 'Campañas en un click', desc: 'La IA configura segmentación, presupuesto, copies y CTA. Publica directo en Meta sin tocar Business Manager.' },
  { icon: '💬', title: 'Leads directo a WhatsApp', desc: 'Cada anuncio redirige con mensaje personalizado. Tracking completo de cada conversación.' },
  { icon: '📊', title: 'Dashboard en tiempo real', desc: 'ROI, CTR, CPC y conversiones en un lugar. Sincronización automática con Meta Ads cada hora.' },
  { icon: '📧', title: 'Informe IA diario', desc: 'Qué pausar, qué escalar y por qué — análisis completo con recomendaciones a las 20:00 hs.' },
  { icon: '🔄', title: 'Optimización continua', desc: 'La IA detecta campañas bajo rendimiento y propone mejoras. Vos aprobás con un click.' },
];

const TESTIMONIALS = [
  { name: 'Martina G.', role: 'Tienda de ropa · Buenos Aires', text: 'Pasé de gastar $500 al mes sin resultados, a generar 180 leads en la primera semana. El ROAS se fue a 9x.', avatar: 'M' },
  { name: 'Lucas F.', role: 'Importadora de tecnología', text: 'La IA genera los videos solos y los publica. Antes tardaba 2 días en un creativo. Ahora lo hago en 10 minutos.', avatar: 'L' },
  { name: 'Caro M.', role: 'Marca de calzado', text: 'El informe diario me dice exactamente qué pausar y qué escalar. Es como tener un analista propio las 24 hs.', avatar: 'C' },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, v };
}

function Fade({ children, delay = 0, y = 24 }: { children: ReactNode; delay?: number; y?: number }) {
  const { ref, v } = useInView();
  return (
    <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? 'none' : `translateY(${y}px)`, transition: `opacity .65s ease ${delay}ms, transform .65s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => (t + 1) % TICKER.length), 2800);
    return () => clearInterval(id);
  }, []);

  const toRegister = () => navigate('/auth', { state: { tab: 'register' } });
  const toLogin = () => navigate('/auth', { state: { tab: 'login' } });
  const toPlan = (plan: Plan) => navigate('/auth', { state: { plan, tab: 'register' } });

  return (
    <div style={{ minHeight: '100vh', background: '#050508', color: '#f0f0f8', fontFamily: "'DM Sans',sans-serif", overflowX: 'hidden' }}>

      {/* ── Nav ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 58, borderBottom: '1px solid #ffffff0d', background: '#050508cc', backdropFilter: 'blur(20px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#7c5cfc,#4da6ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 13, color: '#fff' }}>C</div>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: '.01em', lineHeight: 1 }}>CONVERSIA</div>
            <div style={{ fontSize: 8, color: '#6b6b80', fontFamily: "'DM Mono',monospace", letterSpacing: '.1em', lineHeight: 1.2 }}>ADS SUITE</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={toLogin} style={{ padding: '7px 16px', borderRadius: 8, background: 'none', border: '1px solid #ffffff14', color: '#9090a8', cursor: 'pointer', fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>
            Iniciar sesión
          </button>
          <button onClick={toRegister} style={{ padding: '7px 18px', borderRadius: 8, background: 'linear-gradient(135deg,#7c5cfc,#4da6ff)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans',sans-serif", boxShadow: '0 4px 20px #7c5cfc40' }}>
            Empezar gratis
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div style={{ position: 'relative', padding: '100px 24px 0', textAlign: 'center', overflow: 'hidden' }}>
        {/* Background glows */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: 900, height: 900, borderRadius: '50%', background: 'radial-gradient(circle,#7c5cfc18 0%,transparent 60%)', top: -300, left: '50%', transform: 'translateX(-50%)' }} />
          <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,#4da6ff10 0%,transparent 65%)', top: 0, right: '5%' }} />
          <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,#ff6b6b08 0%,transparent 65%)', top: 100, left: '5%' }} />
        </div>

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#7c5cfc12', border: '1px solid #7c5cfc30', borderRadius: 100, padding: '6px 16px', fontSize: 12, color: '#9d7dff', fontFamily: "'DM Mono',monospace", marginBottom: 32, animation: 'fadeUp .5s ease both' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c5cfc', display: 'inline-block', boxShadow: '0 0 8px #7c5cfc' }} />
          Automatización completa con IA · 2026
        </div>

        <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 'clamp(38px,6vw,72px)', lineHeight: 1.06, maxWidth: 820, margin: '0 auto 12px', letterSpacing: '-.03em', animation: 'fadeUp .6s ease .1s both' }}>
          Meta Ads que se crean,
        </h1>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 'clamp(38px,6vw,72px)', lineHeight: 1.06, maxWidth: 820, margin: '0 auto 32px', letterSpacing: '-.03em', background: 'linear-gradient(135deg,#9d7dff 0%,#4da6ff 50%,#7effd4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'fadeUp .6s ease .15s both' }}>
          optimizan y reportan solos.
        </h1>

        <p style={{ fontSize: 18, color: '#7070a0', maxWidth: 520, margin: '0 auto 44px', lineHeight: 1.75, animation: 'fadeUp .6s ease .2s both' }}>
          Generá creativos virales con IA, publicá campañas y redirigí leads a WhatsApp.<br />Sin agencias. Sin conocimientos técnicos.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap', animation: 'fadeUp .6s ease .25s both' }}>
          <button onClick={toRegister} style={{ padding: '15px 36px', fontSize: 15, fontWeight: 700, borderRadius: 12, background: 'linear-gradient(135deg,#7c5cfc,#4da6ff)', border: 'none', color: '#fff', cursor: 'pointer', boxShadow: '0 8px 40px #7c5cfc50', fontFamily: "'DM Sans',sans-serif" }}>
            Comenzar gratis — 7 días →
          </button>
          <button onClick={toLogin} style={{ padding: '14px 28px', fontSize: 15, fontWeight: 500, borderRadius: 12, background: 'none', border: '1px solid #ffffff14', color: '#7070a0', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
            Ya tengo cuenta
          </button>
        </div>

        <div style={{ fontSize: 12, color: '#40405a', fontFamily: "'DM Mono',monospace", marginTop: 20, animation: 'fadeUp .6s ease .3s both' }}>
          Sin tarjeta de crédito · Cancelás cuando querés · Setup en 2 min
        </div>

        {/* Product mockup */}
        <div style={{ maxWidth: 860, margin: '64px auto -1px', animation: 'fadeUp .9s ease .4s both', position: 'relative' }}>
          {/* Glow under the card */}
          <div style={{ position: 'absolute', bottom: 0, left: '10%', right: '10%', height: 80, background: 'linear-gradient(#7c5cfc20,transparent)', filter: 'blur(24px)', pointerEvents: 'none' }} />

          {/* Browser chrome */}
          <div style={{ background: '#0d0d14', border: '1px solid #ffffff0f', borderRadius: '14px 14px 0 0', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', gap: 5 }}>
              {['#ff5f57','#febc2e','#28c840'].map((c,i) => <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
            </div>
            <div style={{ flex: 1, background: '#1a1a26', borderRadius: 6, padding: '4px 12px', fontSize: 11, color: '#40405a', fontFamily: "'DM Mono',monospace", textAlign: 'center', maxWidth: 280, margin: '0 auto' }}>
              app.conversia.ai/dashboard
            </div>
          </div>

          {/* Dashboard content */}
          <div style={{ background: '#0a0a10', border: '1px solid #ffffff0f', borderTop: 'none', borderRadius: '0 0 14px 14px', padding: 20 }}>
            {/* Metrics row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 12 }}>
              {[
                { icon: '📊', label: 'ROAS', val: '8.4×', color: '#7effd4' },
                { icon: '💬', label: 'Leads hoy', val: '47', color: '#4da6ff' },
                { icon: '🎯', label: 'CTR', val: '4.8%', color: '#9d7dff' },
                { icon: '💰', label: 'Gasto', val: '$2.3k', color: '#ffbd2e' },
              ].map((m, i) => (
                <div key={i} style={{ background: '#12121c', border: '1px solid #ffffff08', borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ fontSize: 11, color: '#50507a', fontFamily: "'DM Mono',monospace", textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>{m.icon} {m.label}</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 24, color: m.color }}>{m.val}</div>
                </div>
              ))}
            </div>

            {/* Bottom row */}
            <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 10 }}>
              {/* Chart placeholder */}
              <div style={{ background: '#12121c', border: '1px solid #ffffff08', borderRadius: 10, padding: '14px', height: 100 }}>
                <div style={{ fontSize: 11, color: '#50507a', fontFamily: "'DM Mono',monospace", marginBottom: 10 }}>ROAS últimos 7 días</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 55 }}>
                  {[45, 60, 50, 75, 65, 85, 84].map((h, i) => (
                    <div key={i} style={{ flex: 1, background: i === 6 ? 'linear-gradient(#9d7dff,#4da6ff)' : '#1e1e32', borderRadius: '3px 3px 0 0', height: `${h}%` }} />
                  ))}
                </div>
              </div>

              {/* Leads feed */}
              <div style={{ background: '#12121c', border: '1px solid #ffffff08', borderRadius: 10, padding: '14px' }}>
                <div style={{ fontSize: 11, color: '#50507a', fontFamily: "'DM Mono',monospace", marginBottom: 10 }}>💬 LEADS EN VIVO</div>
                {[['L', 'Lucas M. — Nike Air Max', '2m'], ['S', 'Sofía R. — Talle 38?', '6m'], ['C', 'Carlos B. — Precio?', '11m']].map(([av, msg, t], i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: i < 2 ? '1px solid #ffffff06' : 'none' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'linear-gradient(135deg,#7c5cfc,#4da6ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, flexShrink: 0 }}>{av}</div>
                    <div style={{ fontSize: 11, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#c0c0d8' }}>{msg}</div>
                    <div style={{ fontSize: 9, color: '#40405a', fontFamily: "'DM Mono',monospace", flexShrink: 0 }}>{t}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Ticker ── */}
      <div style={{ background: 'linear-gradient(90deg,#7c5cfc,#4da6ff)', padding: '14px 0', overflow: 'hidden', position: 'relative' }}>
        <div style={{ display: 'flex', gap: 48, whiteSpace: 'nowrap', animation: 'ticker 18s linear infinite' }}>
          {[...TICKER, ...TICKER, ...TICKER].map((t, i) => (
            <span key={i} style={{ fontSize: 13, fontWeight: 600, fontFamily: "'DM Mono',monospace", flexShrink: 0 }}>
              ✦ {t}
            </span>
          ))}
        </div>
        <style>{`@keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-33.33%) } }`}</style>
      </div>

      {/* ── Stats ── */}
      <div style={{ padding: '70px 48px', borderBottom: '1px solid #ffffff08' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2 }}>
          {[['8.4×', 'ROAS promedio'], ['+340%', 'Más leads'], ['92%', 'Tasa de entrega'], ['-68%', 'Costo por lead']].map(([val, label], i) => (
            <Fade key={i} delay={i * 80}>
              <div style={{ textAlign: 'center', padding: '20px 16px', borderRight: i < 3 ? '1px solid #ffffff08' : 'none' }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 44, background: 'linear-gradient(135deg,#9d7dff,#4da6ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: 12, color: '#50507a', marginTop: 8, fontFamily: "'DM Mono',monospace", textTransform: 'uppercase', letterSpacing: '.1em' }}>{label}</div>
              </div>
            </Fade>
          ))}
        </div>
      </div>

      {/* ── How it works ── */}
      <div style={{ padding: '80px 48px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <Fade>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <div style={{ fontSize: 11, color: '#7c5cfc', fontFamily: "'DM Mono',monospace", letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 14 }}>Cómo funciona</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 40, letterSpacing: '-.03em' }}>Del producto al lead<br /><span style={{ color: '#50507a', fontWeight: 400, fontSize: 32 }}>en 10 minutos</span></div>
            </div>
          </Fade>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: '#ffffff08', border: '1px solid #ffffff08', borderRadius: 16, overflow: 'hidden' }}>
            {[
              { n: '01', icon: '📦', title: 'Subís el producto', desc: 'Imagen, precio y descripción. 2 minutos.' },
              { n: '02', icon: '🤖', title: 'La IA lo analiza', desc: 'Audiencia, tendencias y estrategia perfecta.' },
              { n: '03', icon: '🎬', title: 'Genera creativos', desc: 'Reels, stories y feed con hooks virales.' },
              { n: '04', icon: '🚀', title: 'Publica y optimiza', desc: 'Directo en Meta Ads. Leads a WhatsApp.' },
            ].map((s, i) => (
              <Fade key={i} delay={i * 100}>
                <div style={{ background: '#050508', padding: '30px 22px', textAlign: 'center', borderRight: i < 3 ? '1px solid #ffffff08' : 'none', height: '100%' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: '#0d0d18', border: '1px solid #ffffff0d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, margin: '0 auto 16px' }}>{s.icon}</div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: '#7c5cfc', marginBottom: 8, letterSpacing: '.1em' }}>{s.n}</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: '#50507a', lineHeight: 1.65 }}>{s.desc}</div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </div>

      {/* ── Features ── */}
      <div style={{ padding: '40px 48px 80px', background: '#08080f', borderTop: '1px solid #ffffff08', borderBottom: '1px solid #ffffff08' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Fade>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ fontSize: 11, color: '#7c5cfc', fontFamily: "'DM Mono',monospace", letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 14 }}>Características</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 40, letterSpacing: '-.03em' }}>Todo incluido</div>
            </div>
          </Fade>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {FEATURES.map((f, i) => (
              <Fade key={i} delay={i * 60}>
                <div style={{ background: '#050508', border: '1px solid #ffffff0a', borderRadius: 14, padding: '24px', height: '100%' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#7c5cfc18,#4da6ff18)', border: '1px solid #7c5cfc20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16 }}>{f.icon}</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: '#50507a', lineHeight: 1.7 }}>{f.desc}</div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </div>

      {/* ── Testimonials ── */}
      <div style={{ padding: '80px 48px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Fade>
            <div style={{ textAlign: 'center', marginBottom: 52 }}>
              <div style={{ fontSize: 11, color: '#7c5cfc', fontFamily: "'DM Mono',monospace", letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 14 }}>Resultados reales</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 40, letterSpacing: '-.03em' }}>Resultados de usuarios reales</div>
            </div>
          </Fade>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {TESTIMONIALS.map((t, i) => (
              <Fade key={i} delay={i * 100}>
                <div style={{ background: '#08080f', border: '1px solid #ffffff0a', borderRadius: 16, padding: '26px', display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
                  <div style={{ fontSize: 13, color: '#9d7dff', letterSpacing: '.15em' }}>★★★★★</div>
                  <div style={{ fontSize: 15, color: '#c8c8e0', lineHeight: 1.75, flex: 1, fontStyle: 'italic' }}>"{t.text}"</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#7c5cfc,#4da6ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14 }}>{t.avatar}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#e0e0f0' }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: '#50507a' }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </div>

      {/* ── Pricing ── */}
      <div style={{ padding: '40px 48px 80px', background: '#08080f', borderTop: '1px solid #ffffff08' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <Fade>
            <div style={{ textAlign: 'center', marginBottom: 52 }}>
              <div style={{ fontSize: 11, color: '#7c5cfc', fontFamily: "'DM Mono',monospace", letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 14 }}>Precios</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 40, marginBottom: 12, letterSpacing: '-.03em' }}>Elegí tu plan</div>
              <div style={{ fontSize: 15, color: '#50507a' }}>7 días gratis en todos los planes. Cancelás cuando querés.</div>
            </div>
          </Fade>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {PLANS.map((plan, i) => (
              <Fade key={plan.id} delay={i * 80}>
                <div style={{ background: plan.featured ? '#0d0d1a' : '#050508', border: `1px solid ${plan.featured ? '#7c5cfc50' : '#ffffff0a'}`, borderRadius: 18, padding: '28px', position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', boxShadow: plan.featured ? '0 0 60px #7c5cfc18' : 'none' }}>
                  {plan.featured && (
                    <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#7c5cfc,#4da6ff)', color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 16px', borderRadius: 100, fontFamily: "'DM Mono',monospace", whiteSpace: 'nowrap', letterSpacing: '.08em' }}>
                      ✦ MÁS POPULAR
                    </div>
                  )}
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{plan.name}</div>
                  <div style={{ fontSize: 12, color: '#50507a', marginBottom: 20 }}>
                    {plan.id === 'starter' ? 'Para empezar y validar' : plan.id === 'growth' ? 'Para crecer con fuerza' : 'Para escalar sin límites'}
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 52, letterSpacing: '-.04em', lineHeight: 1 }}>${plan.price}</span>
                    <span style={{ fontSize: 13, color: '#50507a', marginLeft: 4 }}>USD/mes</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28, flex: 1 }}>
                    {plan.features.map((f, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: '#c0c0d8' }}>
                        <span style={{ color: '#7effd4', fontSize: 11, marginTop: 2, flexShrink: 0 }}>✓</span>{f}
                      </div>
                    ))}
                    {plan.no.map((f, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: '#30304a' }}>
                        <span style={{ fontSize: 11, marginTop: 2, flexShrink: 0 }}>✕</span>{f}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => toPlan(plan)} style={{ width: '100%', padding: '13px', fontSize: 14, fontWeight: 700, borderRadius: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", background: plan.featured ? 'linear-gradient(135deg,#7c5cfc,#4da6ff)' : 'none', color: plan.featured ? '#fff' : '#9d7dff', border: plan.featured ? 'none' : '1.5px solid #7c5cfc60', boxShadow: plan.featured ? '0 8px 30px #7c5cfc40' : 'none', transition: 'opacity .15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '.85'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}>
                    Empezar con {plan.name} →
                  </button>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA final ── */}
      <div style={{ padding: '100px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 50%,#7c5cfc12,transparent)', pointerEvents: 'none' }} />
        <Fade>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 'clamp(32px,5vw,56px)', letterSpacing: '-.03em', marginBottom: 16, lineHeight: 1.1 }}>
            Empezá hoy.<br />
            <span style={{ background: 'linear-gradient(135deg,#9d7dff,#4da6ff,#7effd4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Resultados esta semana.
            </span>
          </div>
          <p style={{ fontSize: 17, color: '#50507a', maxWidth: 440, margin: '0 auto 40px', lineHeight: 1.7 }}>
            7 días gratis, sin tarjeta de crédito.<br />Cancelás cuando querés.
          </p>
          <button onClick={toRegister} style={{ padding: '16px 44px', fontSize: 16, fontWeight: 700, borderRadius: 14, background: 'linear-gradient(135deg,#7c5cfc,#4da6ff)', border: 'none', color: '#fff', cursor: 'pointer', boxShadow: '0 12px 50px #7c5cfc50', fontFamily: "'DM Sans',sans-serif" }}>
            Crear mi cuenta gratis →
          </button>
          <div style={{ fontSize: 12, color: '#30304a', fontFamily: "'DM Mono',monospace", marginTop: 18 }}>
            Setup en 2 minutos · Sin tarjeta · Cancelás en cualquier momento
          </div>
        </Fade>
      </div>

      {/* ── Footer ── */}
      <div style={{ padding: '22px 48px', borderTop: '1px solid #ffffff08', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg,#7c5cfc,#4da6ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 9, color: '#fff' }}>C</div>
          <span style={{ fontSize: 12, color: '#30304a', fontFamily: "'DM Mono',monospace" }}>CONVERSIA ADS · 2026</span>
        </div>
        <div style={{ display: 'flex', gap: 24, fontSize: 12, color: '#30304a', fontFamily: "'DM Mono',monospace" }}>
          {['Términos', 'Privacidad', 'Soporte'].map(t => <span key={t} style={{ cursor: 'pointer' }}>{t}</span>)}
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:none } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
