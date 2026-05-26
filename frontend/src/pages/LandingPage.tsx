import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { C } from '../styles/theme';
import type { Plan } from '../types';

const PLANS: Plan[] = [
  { id: 'starter', name: 'Starter', price: 49, featured: false,
    features: ['20 campañas/mes', '50 creativos IA', 'Reportes automáticos', 'Dashboard completo', 'Soporte email'],
    no: ['Múltiples cuentas Meta', 'Optimización avanzada IA', 'Subusuarios'] },
  { id: 'growth', name: 'Growth', price: 99, featured: true,
    features: ['Campañas ilimitadas', 'Creativos ilimitados', 'Optimización IA avanzada', 'Dashboard premium', '3 cuentas Meta', '2 subusuarios', 'Informe IA diario'],
    no: ['IA avanzada + custom', 'Acceso API'] },
  { id: 'scale', name: 'Scale', price: 199, featured: false,
    features: ['Todo de Growth', 'IA avanzada + custom', 'Automatizaciones ilimitadas', 'Prioridad máxima IA', 'Reportes avanzados', '10 subusuarios', 'Acceso API completo'],
    no: [] },
];

const STATS = [
  { val: '8.4×', label: 'ROAS promedio' },
  { val: '+340%', label: 'Más leads' },
  { val: '92%', label: 'Tasa de entrega' },
  { val: '-68%', label: 'Costo por lead' },
];

const STEPS = [
  { n: '01', icon: '📦', title: 'Subís tu producto', desc: 'Imagen o video del producto, precio y descripción. 2 minutos.' },
  { n: '02', icon: '🤖', title: 'La IA lo analiza', desc: 'Analiza tendencias, competencia y audiencia. Crea la estrategia perfecta.' },
  { n: '03', icon: '🎬', title: 'Genera los creativos', desc: 'Reels 9:16, stories, feed cuadrado con hooks virales y subtítulos.' },
  { n: '04', icon: '🚀', title: 'Publica y optimiza', desc: 'Directo en Meta Ads. Leads van a tu WhatsApp. La IA optimiza sola.' },
];

function useCountUp(target: string, duration = 1500, start = false) {
  const [display, setDisplay] = useState('0');
  useEffect(() => {
    if (!start) return;
    const num = parseFloat(target.replace(/[^0-9.]/g, ''));
    const prefix = target.match(/^[^0-9]*/)?.[0] ?? '';
    const suffix = target.match(/[^0-9.]+$/)?.[0] ?? '';
    const steps = 40;
    const step = num / steps;
    let current = 0;
    let tick = 0;
    const id = setInterval(() => {
      tick++;
      current = Math.min(step * tick, num);
      const formatted = Number.isInteger(num)
        ? Math.round(current).toString()
        : current.toFixed(1);
      setDisplay(`${prefix}${formatted}${suffix}`);
      if (tick >= steps) clearInterval(id);
    }, duration / steps);
    return () => clearInterval(id);
  }, [start, target, duration]);
  return display;
}

function StatCard({ val, label, animate }: { val: string; label: string; animate: boolean }) {
  const display = useCountUp(val, 1400, animate);
  return (
    <div style={{ textAlign: 'center', padding: '20px 10px' }}>
      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 36, background: C.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>
        {animate ? display : val}
      </div>
      <div style={{ fontSize: 12, color: C.textMuted, marginTop: 6, fontFamily: "'DM Mono',monospace", textTransform: 'uppercase', letterSpacing: '.08em' }}>{label}</div>
    </div>
  );
}

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function AnimSection({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)', transition: `opacity .6s ease ${delay}ms, transform .6s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

const TESTIMONIALS = [
  { name: 'Martina G.', role: 'Tienda de ropa — Buenos Aires', text: 'Pasé de gastar $500 al mes en publicidad sin resultados, a generar 180 leads en la primera semana. El ROAS se fue a 9x.', avatar: '👩' },
  { name: 'Lucas F.', role: 'Importadora de tecnología', text: 'La IA genera los videos solos y los publica. Antes tardaba 2 días hacer un creativo. Ahora lo hago en 10 minutos.', avatar: '👨' },
  { name: 'Caro M.', role: 'Marca de calzado', text: 'Lo que más me sorprendió fue el informe diario. Me dice exactamente qué pausar y qué escalar. Es como tener un analista propio.', avatar: '👩‍💼' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { ref: statsRef, visible: statsVisible } = useInView(0.3);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const selectPlan = (plan: Plan | null) => navigate('/auth', { state: { plan, tab: 'register' } });
  const goLogin = () => navigate('/auth', { state: { tab: 'login' } });

  return (
    <div style={{ minHeight: '100vh', overflowY: 'auto', background: C.bg, fontFamily: "'DM Sans',sans-serif" }}>

      {/* ── Nav ─────────────────────────────────────────────────────────────── */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 48px', borderBottom: `1px solid ${C.border}`, background: `${C.bg}ee`, backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: C.grad, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 13, color: '#fff' }}>C</div>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: '-.01em' }}>CONVERSIA</div>
            <div style={{ fontSize: 9, color: C.textMuted, fontFamily: "'DM Mono',monospace", marginTop: -2, letterSpacing: '.06em' }}>ADS SUITE</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={goLogin} style={{ padding: '8px 16px', borderRadius: 8, background: 'transparent', border: `1px solid ${C.border}`, color: C.textMuted, cursor: 'pointer', fontSize: 13, fontFamily: "'DM Sans',sans-serif", transition: 'all .15s' }}
            onMouseEnter={e => { (e.target as HTMLButtonElement).style.color = C.text; (e.target as HTMLButtonElement).style.background = C.surface; }}
            onMouseLeave={e => { (e.target as HTMLButtonElement).style.color = C.textMuted; (e.target as HTMLButtonElement).style.background = 'transparent'; }}>
            Iniciar sesión
          </button>
          <button onClick={() => selectPlan(null)} style={{ padding: '8px 18px', borderRadius: 8, background: C.grad, border: 'none', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", transition: 'all .15s' }}
            onMouseEnter={e => { (e.target as HTMLButtonElement).style.opacity = '.85'; }}
            onMouseLeave={e => { (e.target as HTMLButtonElement).style.opacity = '1'; }}>
            7 días gratis →
          </button>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <div style={{ padding: '90px 48px 70px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Glow effects */}
        <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(#7c5cfc14,transparent 65%)', top: -200, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(#4da6ff0d,transparent 65%)', top: 0, right: '15%', pointerEvents: 'none' }} />

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: `${C.accent}18`, border: `1px solid ${C.accent}33`, borderRadius: 20, padding: '5px 14px', fontSize: 11, color: C.accent, fontFamily: "'DM Mono',monospace", marginBottom: 28, animation: 'fadeUp .5s ease both' }}>
          ⚡ Automatización completa con IA — Nuevo 2026
        </div>

        <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(32px,5vw,60px)', lineHeight: 1.08, maxWidth: 800, margin: '0 auto 22px', letterSpacing: '-.02em', animation: 'fadeUp .6s ease .1s both' }}>
          Meta Ads que se crean,{' '}
          <span style={{ background: C.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            optimizan y reportan solos
          </span>
        </h1>

        <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 540, margin: '0 auto 38px', lineHeight: 1.7, animation: 'fadeUp .6s ease .2s both' }}>
          Generá creativos virales con IA, publicá campañas y redirigí leads a WhatsApp. Sin conocimientos técnicos. Sin agencias.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap', animation: 'fadeUp .6s ease .3s both' }}>
          <button onClick={() => selectPlan(null)} style={{ padding: '14px 32px', fontSize: 15, fontWeight: 700, borderRadius: 10, background: C.grad, border: 'none', color: '#fff', cursor: 'pointer', boxShadow: '0 8px 32px #7c5cfc33', transition: 'all .2s', fontFamily: "'DM Sans',sans-serif" }}
            onMouseEnter={e => { (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.target as HTMLButtonElement).style.boxShadow = '0 12px 40px #7c5cfc44'; }}
            onMouseLeave={e => { (e.target as HTMLButtonElement).style.transform = 'translateY(0)'; (e.target as HTMLButtonElement).style.boxShadow = '0 8px 32px #7c5cfc33'; }}>
            Comenzar gratis — 7 días
          </button>
          <button onClick={goLogin} style={{ padding: '13px 26px', fontSize: 15, fontWeight: 500, borderRadius: 10, background: 'transparent', border: `1.5px solid ${C.border}`, color: C.textMuted, cursor: 'pointer', transition: 'all .2s', fontFamily: "'DM Sans',sans-serif" }}
            onMouseEnter={e => { (e.target as HTMLButtonElement).style.color = C.text; (e.target as HTMLButtonElement).style.borderColor = C.borderBright; }}
            onMouseLeave={e => { (e.target as HTMLButtonElement).style.color = C.textMuted; (e.target as HTMLButtonElement).style.borderColor = C.border; }}>
            Ya tengo cuenta →
          </button>
        </div>

        <div style={{ fontSize: 12, color: C.textDim, marginTop: 18, fontFamily: "'DM Mono',monospace", animation: 'fadeUp .6s ease .4s both' }}>
          Sin tarjeta de crédito · Cancelás cuando querés
        </div>

        {/* Product preview card */}
        <div style={{ maxWidth: 760, margin: '56px auto 0', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 40px 80px #0008', animation: 'fadeUp .8s ease .5s both' }}>
          <div style={{ background: C.bg, padding: '10px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 7 }}>
            {['#ff5f57','#ffbd2e','#28c840'].map((c,i) => <div key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />)}
            <div style={{ flex: 1, background: C.surface2, borderRadius: 5, padding: '3px 12px', fontSize: 11, color: C.textDim, fontFamily: "'DM Mono',monospace", maxWidth: 280, margin: '0 auto' }}>conversia.app/dashboard</div>
          </div>
          <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
            {[['📊','ROAS','8.4×','green'],['💬','Leads','1,847','blue'],['🎯','CTR','4.8%','purple'],['💰','Gasto','$2.3k','amber']].map(([icon,lbl,val,color],i) => (
              <div key={i} style={{ background: C.bg, borderRadius: 9, padding: '12px', border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 16, marginBottom: 5 }}>{icon}</div>
                <div style={{ fontSize: 9, color: C.textMuted, fontFamily: "'DM Mono',monospace", textTransform: 'uppercase', letterSpacing: '.08em' }}>{lbl}</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 20, color: color === 'green' ? C.green : color === 'blue' ? C.blue : color === 'purple' ? C.accent : C.amber, marginTop: 2 }}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: '0 20px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ background: C.bg, borderRadius: 9, padding: '13px', border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>Creativos generados hoy</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {['🎬','📸','📱'].map((e,i) => <div key={i} style={{ flex: 1, background: `linear-gradient(135deg,#${['1a0528','0a1a2e','2e0a1a'][i]},#${['3d0f6b','1535ab','ab1535'][i]})`, borderRadius: 7, aspectRatio: i===0?'9/16':'4/5', display:'flex',alignItems:'center',justifyContent:'center',fontSize:18 }}>{e}</div>)}
              </div>
            </div>
            <div style={{ background: C.bg, borderRadius: 9, padding: '13px', border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>💬 Leads de hoy</div>
              {[['Lucas M.','Quiero el Nike Air Max','hace 3 min'],['Sofía R.','¿Tienen talle 38?','hace 8 min'],['Carlos B.','Precio del televisor','hace 14 min']].map(([n,m,t],i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: i<2?`1px solid ${C.border}22`:'none', fontSize: 11 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: C.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{n[0]}</div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m}</div>
                  </div>
                  <div style={{ fontSize: 9, color: C.textDim, fontFamily: "'DM Mono',monospace', flexShrink: 0" }}>{t}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats ───────────────────────────────────────────────────────────── */}
      <div ref={statsRef} style={{ padding: '50px 48px', borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: C.surface }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
          {STATS.map((s, i) => <StatCard key={i} {...s} animate={statsVisible} />)}
        </div>
      </div>

      {/* ── How it works ────────────────────────────────────────────────────── */}
      <div style={{ padding: '80px 48px', maxWidth: 1000, margin: '0 auto' }}>
        <AnimSection>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 11, color: C.accent, fontFamily: "'DM Mono',monospace", letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 12 }}>Cómo funciona</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 36, letterSpacing: '-.02em' }}>Del producto al lead<br />en 10 minutos</div>
          </div>
        </AnimSection>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
          {STEPS.map((s, i) => (
            <AnimSection key={i} delay={i * 100}>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '24px', display: 'flex', gap: 18, transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${C.accent}44`; e.currentTarget.style.background = C.surface2; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface; }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: C.textDim, marginTop: 2, flexShrink: 0 }}>{s.n}</div>
                <div>
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 7 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.65 }}>{s.desc}</div>
                </div>
              </div>
            </AnimSection>
          ))}
        </div>
      </div>

      {/* ── Features ────────────────────────────────────────────────────────── */}
      <div style={{ padding: '40px 48px 80px', background: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <AnimSection>
            <div style={{ textAlign: 'center', marginBottom: 52 }}>
              <div style={{ fontSize: 11, color: C.accent, fontFamily: "'DM Mono',monospace", letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 12 }}>Características</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 36, letterSpacing: '-.02em' }}>Todo en uno</div>
            </div>
          </AnimSection>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {[
              ['🤖', 'IA genera tus creativos', 'Videos, imágenes y reels en todos los formatos con hooks virales, subtítulos y efectos automáticos. Solo das el producto.'],
              ['🎯', 'Campañas en un click', 'La IA configura segmentación, presupuesto, copies y CTA. Publica directo en Meta Ads sin tocar Business Manager.'],
              ['💬', 'Leads directo a WhatsApp', 'Cada anuncio redirige con mensaje personalizado pre-cargado. Tracking completo de cada conversación.'],
              ['📊', 'Dashboard en tiempo real', 'ROI, CTR, CPC y conversiones en un lugar. Sincronización automática con Meta Ads cada hora.'],
              ['📧', 'Informe diario con IA', 'Análisis completo con recomendaciones específicas. Qué pausar, qué escalar y por qué — a las 20:00.'],
              ['🔄', 'Optimización continua', 'La IA detecta campañas bajo rendimiento y propone mejoras. Vos aprobás con un click.'],
            ].map(([icon, title, desc], i) => (
              <AnimSection key={i} delay={i * 60}>
                <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 14, padding: '22px', height: '100%', transition: 'all .2s', cursor: 'default' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${C.accent}44`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <div style={{ fontSize: 26, marginBottom: 12 }}>{icon}</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{title}</div>
                  <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.65 }}>{desc}</div>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </div>

      {/* ── Testimonials ────────────────────────────────────────────────────── */}
      <div style={{ padding: '80px 48px', maxWidth: 1000, margin: '0 auto' }}>
        <AnimSection>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, color: C.accent, fontFamily: "'DM Mono',monospace", letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 12 }}>Resultados reales</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 36, letterSpacing: '-.02em' }}>Lo que dicen nuestros usuarios</div>
          </div>
        </AnimSection>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {TESTIMONIALS.map((t, i) => (
            <AnimSection key={i} delay={i * 100}>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ color: C.accent, fontSize: 14 }}>★★★★★</div>
                <div style={{ fontSize: 13, color: C.text, lineHeight: 1.7, flex: 1 }}>"{t.text}"</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: C.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>{t.role}</div>
                  </div>
                </div>
              </div>
            </AnimSection>
          ))}
        </div>
      </div>

      {/* ── Pricing ─────────────────────────────────────────────────────────── */}
      <div style={{ padding: '40px 48px 80px', background: C.surface, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <AnimSection>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ fontSize: 11, color: C.accent, fontFamily: "'DM Mono',monospace", letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 12 }}>Precios</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 36, marginBottom: 10, letterSpacing: '-.02em' }}>Elegí tu plan</div>
              <div style={{ fontSize: 15, color: C.textMuted }}>7 días gratis en todos los planes. Cancelás cuando querés.</div>
            </div>
          </AnimSection>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {PLANS.map((plan, i) => (
              <AnimSection key={plan.id} delay={i * 80}>
                <div style={{ background: plan.featured ? `linear-gradient(160deg,${C.surface2},${C.bg})` : C.bg, border: `${plan.featured ? 2 : 1}px solid ${plan.featured ? C.accent + '66' : C.border}`, borderRadius: 16, padding: '26px', position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', boxShadow: plan.featured ? `0 0 40px ${C.accent}18` : 'none' }}>
                  {plan.featured && (
                    <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: C.grad, color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 14px', borderRadius: 20, fontFamily: "'DM Mono',monospace", whiteSpace: 'nowrap' }}>
                      ✦ MÁS POPULAR
                    </div>
                  )}
                  <div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 3 }}>{plan.name}</div>
                    <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 16 }}>
                      {plan.id === 'starter' ? 'Para empezar y validar' : plan.id === 'growth' ? 'Para crecer con fuerza' : 'Para escalar sin límites'}
                    </div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 42, lineHeight: 1, marginBottom: 4 }}>
                      <span style={{ fontSize: 20, verticalAlign: 'super', marginRight: 1 }}>$</span>{plan.price}
                    </div>
                    <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 22 }}>USD/mes · 7 días gratis</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 24, flex: 1 }}>
                    {plan.features.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 13 }}>
                        <span style={{ color: C.green, fontSize: 10, marginTop: 2, flexShrink: 0 }}>✓</span>
                        <span>{f}</span>
                      </div>
                    ))}
                    {plan.no.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 13 }}>
                        <span style={{ color: C.textDim, fontSize: 10, marginTop: 2, flexShrink: 0 }}>✕</span>
                        <span style={{ color: C.textDim }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => selectPlan(plan)} style={{ width: '100%', padding: '12px', fontSize: 14, fontWeight: 600, border: 'none', borderRadius: 10, cursor: 'pointer', transition: 'all .15s', fontFamily: "'DM Sans',sans-serif", background: plan.featured ? C.grad : 'transparent', color: plan.featured ? '#fff' : C.accent, borderColor: plan.featured ? 'transparent' : C.accent, borderWidth: plan.featured ? 0 : 1.5, borderStyle: 'solid', boxShadow: plan.featured ? `0 8px 24px ${C.accent}33` : 'none' }}
                    onMouseEnter={e => { (e.target as HTMLButtonElement).style.opacity = '.88'; (e.target as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { (e.target as HTMLButtonElement).style.opacity = '1'; (e.target as HTMLButtonElement).style.transform = 'translateY(0)'; }}>
                    Empezar con {plan.name} →
                  </button>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA final ───────────────────────────────────────────────────────── */}
      <div style={{ padding: '80px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(#7c5cfc10,transparent 65%)', bottom: -150, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }} />
        <AnimSection>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 38, marginBottom: 16, letterSpacing: '-.02em' }}>
            Empezá hoy.<br />
            <span style={{ background: C.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Resultados esta semana.</span>
          </div>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.65 }}>
            7 días gratis, sin tarjeta de crédito. Cancelás cuando querés.
          </p>
          <button onClick={() => selectPlan(null)} style={{ padding: '15px 36px', fontSize: 16, fontWeight: 700, borderRadius: 12, background: C.grad, border: 'none', color: '#fff', cursor: 'pointer', boxShadow: '0 10px 40px #7c5cfc44', transition: 'all .2s', fontFamily: "'DM Sans',sans-serif" }}
            onMouseEnter={e => { (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.target as HTMLButtonElement).style.boxShadow = '0 16px 50px #7c5cfc55'; }}
            onMouseLeave={e => { (e.target as HTMLButtonElement).style.transform = 'translateY(0)'; (e.target as HTMLButtonElement).style.boxShadow = '0 10px 40px #7c5cfc44'; }}>
            Crear mi cuenta gratis →
          </button>
        </AnimSection>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <div style={{ padding: '24px 48px', borderTop: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 24, height: 24, background: C.grad, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 10, color: '#fff' }}>C</div>
          <span style={{ fontSize: 12, color: C.textMuted, fontFamily: "'DM Mono',monospace" }}>CONVERSIA ADS · 2026</span>
        </div>
        <div style={{ display: 'flex', gap: 22, fontSize: 12, color: C.textDim }}>
          {['Términos', 'Privacidad', 'Soporte'].map(t => (
            <span key={t} style={{ cursor: 'pointer', transition: 'color .15s' }}
              onMouseEnter={e => { (e.target as HTMLSpanElement).style.color = C.textMuted; }}
              onMouseLeave={e => { (e.target as HTMLSpanElement).style.color = C.textDim; }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
