import { useNavigate } from 'react-router-dom';
import { C } from '../styles/theme';
import type { Plan } from '../types';

const PLANS: Plan[] = [
  { id: 'starter', name: 'Starter', price: 49, featured: false,
    features: ['20 campañas/mes', '50 creativos IA', 'Reportes automáticos', 'Dashboard básico', 'Soporte email'],
    no: ['Múltiples cuentas Meta', 'Optimización avanzada', 'Subusuarios'] },
  { id: 'growth', name: 'Growth', price: 99, featured: true,
    features: ['Campañas ilimitadas', 'Creativos ilimitados', 'Optimización IA avanzada', 'Dashboard premium', '3 cuentas Meta', '2 subusuarios'],
    no: ['IA completa', 'Prioridad procesamiento'] },
  { id: 'scale', name: 'Scale', price: 199, featured: false,
    features: ['Todo de Growth', 'IA avanzada completa', 'Automatizaciones ilimitadas', 'Prioridad procesamiento', 'Reportes avanzados', '10 subusuarios', 'Acceso API'],
    no: [] },
];

export default function LandingPage() {
  const navigate = useNavigate();

  const selectPlan = (plan: Plan | null) => navigate('/auth', { state: { plan, tab: 'register' } });
  const goLogin = () => navigate('/auth', { state: { tab: 'login' } });

  return (
    <div className="landing">
      <nav className="land-nav">
        <div className="logo">
          <div className="logo-icon">AI</div>
          <div className="logo-txt">AI Commerce Ads<div className="logo-sub">Suite</div></div>
        </div>
        <div className="land-nav-btns" style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-g" style={{ fontSize: 13 }} onClick={goLogin}>Iniciar sesión</button>
          <button className="btn btn-p" style={{ fontSize: 13 }} onClick={() => selectPlan(null)}>Empezar gratis 7 días</button>
        </div>
      </nav>

      <div className="hero">
        <div className="glow" />
        <div className="hero-eye">⚡ Automatización completa con IA</div>
        <h1 className="hero-title">
          Meta Ads que se crean,{' '}
          <span style={{ background: C.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            optimizan y reportan solos
          </span>
        </h1>
        <p className="hero-sub">Generá creativos virales, publicá campañas y redirigí leads a WhatsApp en minutos. Sin conocimientos técnicos.</p>
        <div className="hero-btns">
          <button className="hcta" onClick={() => selectPlan(null)}>Comenzar gratis — 7 días</button>
          <button className="hghost" onClick={goLogin}>Ya tengo cuenta →</button>
        </div>
      </div>

      <div className="feat-grid">
        {[
          ['🤖', 'IA genera tus creativos', 'Videos, imágenes y reels en 9:16, 1:1 y 4:5 con hooks virales, subtítulos y efectos automáticos.'],
          ['🎯', 'Campañas en un click', 'La IA configura segmentación, presupuesto, copies y CTA. Publica directo en Meta Ads.'],
          ['💬', 'Leads directo a WhatsApp', 'Cada anuncio redirige automáticamente con mensaje personalizado pre-cargado.'],
          ['📊', 'Dashboard en tiempo real', 'ROI, CTR, CPC, CPM y conversiones en un solo lugar. Sincronizados desde Meta cada hora.'],
          ['📧', 'Informe diario a las 20:00', 'PDF profesional con análisis IA, recomendaciones, qué pausar y qué escalar.'],
          ['🔄', 'Optimización continua', 'La IA detecta campañas malas y sugiere mejoras. Aprobás con un click.'],
        ].map(([icon, title, desc], i) => (
          <div key={i} className="feat-card">
            <div style={{ fontSize: 26, marginBottom: 12 }}>{icon}</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 7 }}>{title}</div>
            <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>{desc}</div>
          </div>
        ))}
      </div>

      <div className="price-section">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 11, color: C.accent, fontFamily: "'DM Mono',monospace", letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 10 }}>Precios</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 34, marginBottom: 8 }}>Elegí tu plan</div>
          <div style={{ fontSize: 15, color: C.textMuted }}>7 días gratis en todos los planes. Cancelás cuando quieras.</div>
        </div>
        <div className="price-grid">
          {PLANS.map(plan => (
            <div key={plan.id} className={`price-card${plan.featured ? ' feat' : ''}`}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16 }}>{plan.name}</div>
              <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 12 }}>{plan.id === 'starter' ? 'Para empezar' : plan.id === 'growth' ? 'Para crecer' : 'Para escalar'}</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 38, lineHeight: 1 }}>
                <span style={{ fontSize: 18, verticalAlign: 'super', marginRight: 2 }}>$</span>{plan.price}
              </div>
              <div style={{ fontSize: 12, color: C.textMuted, margin: '5px 0 18px' }}>USD por mes · 7 días gratis</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22, fontSize: 13 }}>
                {plan.features.map((f, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: C.green, fontSize: 11 }}>✓</span><span>{f}</span></div>)}
                {plan.no.map((f, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: C.textDim, fontSize: 11 }}>✕</span><span style={{ color: C.textDim }}>{f}</span></div>)}
              </div>
              <button
                onClick={() => selectPlan(plan)}
                style={{ width: '100%', padding: '11px', fontSize: 14, fontWeight: 600, border: 'none', borderRadius: 9, cursor: 'pointer', transition: 'all .15s', background: plan.featured ? 'linear-gradient(135deg,#7c5cfc,#4da6ff)' : 'transparent', color: plan.featured ? '#fff' : C.accent, borderColor: plan.featured ? 'transparent' : C.accent, borderWidth: plan.featured ? 0 : 1.5, borderStyle: 'solid' }}
              >
                Empezar con {plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="land-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="logo-icon" style={{ width: 22, height: 22, fontSize: 10 }}>AI</div>
          <span style={{ fontSize: 13, color: C.textMuted }}>AI Commerce Ads Suite · Creado por Alan Ugarte</span>
        </div>
        <div style={{ display: 'flex', gap: 18, fontSize: 13, color: C.textMuted }}>
          {['Términos', 'Privacidad', 'Soporte'].map(t => <span key={t} style={{ cursor: 'pointer' }}>{t}</span>)}
        </div>
      </div>
    </div>
  );
}
