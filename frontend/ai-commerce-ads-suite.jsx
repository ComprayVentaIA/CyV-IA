import { useState, useEffect } from "react";

const C = {
  bg: "#07070f", surface: "#0f0f1a", surfaceHover: "#16162a",
  border: "#1c1c2e", borderBright: "#272740",
  accent: "#7c5cfc", accentHover: "#8f72ff", accentDim: "#7c5cfc18",
  green: "#00d68f", greenDim: "#00d68f18",
  red: "#ff4d6a", redDim: "#ff4d6a18",
  amber: "#ffb347", amberDim: "#ffb34718",
  blue: "#4da6ff", blueDim: "#4da6ff18",
  text: "#e8e8f4", textMuted: "#666688", textDim: "#333355",
  grad: "linear-gradient(135deg,#7c5cfc,#4da6ff)",
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body,#root{background:#07070f;color:#e8e8f4;font-family:'DM Sans',sans-serif;min-height:100vh}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#272740;border-radius:2px}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
.fade-in{animation:fadeUp .25s ease both}
.spin-anim{animation:spin .7s linear infinite}
.ai-dot{width:5px;height:5px;border-radius:50%;background:#7c5cfc;animation:pulse 1.2s ease-in-out infinite}
.ai-dot:nth-child(2){animation-delay:.2s}
.ai-dot:nth-child(3){animation-delay:.4s}
.ai-dots{display:flex;gap:4px;align-items:center}

.app{display:flex;height:100vh;overflow:hidden}
.sidebar{width:216px;min-width:216px;background:#0f0f1a;border-right:1px solid #1c1c2e;display:flex;flex-direction:column;overflow:hidden}
.main-area{flex:1;overflow-y:auto;display:flex;flex-direction:column}
.content{padding:22px 26px;flex:1}
.topbar{display:flex;align-items:center;padding:13px 22px;border-bottom:1px solid #1c1c2e;background:#0f0f1a88;backdrop-filter:blur(12px);position:sticky;top:0;z-index:10;gap:10px}
.logo-wrap{padding:20px 16px 16px;border-bottom:1px solid #1c1c2e}
.logo{display:flex;align-items:center;gap:10px}
.logo-icon{width:30px;height:30px;background:linear-gradient(135deg,#7c5cfc,#4da6ff);border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:13px;color:#fff}
.logo-txt{font-family:'Syne',sans-serif;font-weight:700;font-size:12.5px;line-height:1.2}
.logo-sub{font-size:10px;color:#666688}
.nav{flex:1;padding:10px 8px;display:flex;flex-direction:column;gap:2px;overflow-y:auto}
.nav-lbl{font-size:9px;font-weight:500;color:#333355;letter-spacing:.12em;text-transform:uppercase;padding:10px 10px 5px;font-family:'DM Mono',monospace}
.nav-btn{display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:8px;cursor:pointer;font-size:12.5px;color:#666688;font-weight:400;border:none;background:none;width:100%;text-align:left;transition:all .15s}
.nav-btn:hover{background:#16162a;color:#e8e8f4}
.nav-btn.active{background:#7c5cfc18;color:#7c5cfc;font-weight:500}
.nav-icon{font-size:14px;width:17px;text-align:center;flex-shrink:0}
.nav-badge{margin-left:auto;background:#ff4d6a;color:#fff;font-size:9px;padding:1px 5px;border-radius:4px;font-family:'DM Mono',monospace}
.sidebar-foot{padding:10px 8px;border-top:1px solid #1c1c2e}
.plan-card{background:#7c5cfc18;border:1px solid #7c5cfc33;border-radius:8px;padding:10px 12px}
.plan-lbl{font-size:9px;color:#666688;font-family:'DM Mono',monospace;text-transform:uppercase;letter-spacing:.1em}
.plan-name{font-size:12.5px;color:#7c5cfc;font-weight:600;font-family:'Syne',sans-serif;margin-top:2px}
.bar-wrap{margin-top:7px;background:#1c1c2e;border-radius:2px;height:3px}
.bar{height:3px;border-radius:2px;background:#7c5cfc}

.card{background:#0f0f1a;border:1px solid #1c1c2e;border-radius:12px;padding:18px}
.card-sm{padding:13px 15px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}

.m-lbl{font-size:9.5px;color:#666688;font-family:'DM Mono',monospace;text-transform:uppercase;letter-spacing:.1em}
.m-val{font-family:'Syne',sans-serif;font-weight:700;font-size:24px;margin-top:5px}
.m-chg{font-size:11px;margin-top:3px}
.up{color:#00d68f}.down{color:#ff4d6a}
.mini-bars{display:flex;align-items:flex-end;gap:2px;height:32px;margin-top:10px}
.mini-bar{flex:1;border-radius:2px;background:#1c1c2e;min-height:3px;transition:background .2s}
.mini-bar:last-child{background:#7c5cfc}

.btn{padding:8px 16px;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;border:none;transition:all .15s;font-family:'DM Sans',sans-serif}
.btn-p{background:linear-gradient(135deg,#7c5cfc,#4da6ff);color:#fff}
.btn-p:hover{opacity:.9}
.btn-g{background:transparent;color:#666688;border:1px solid #1c1c2e}
.btn-g:hover{background:#16162a;color:#e8e8f4}
.btn-d{background:#ff4d6a18;color:#ff4d6a;border:1px solid #ff4d6a33}

.fg{display:flex;flex-direction:column;gap:5px}
.flbl{font-size:10px;color:#666688;font-family:'DM Mono',monospace;text-transform:uppercase;letter-spacing:.08em}
.finput,.fsel,.ftxt{background:#07070f;border:1.5px solid #1c1c2e;border-radius:8px;padding:10px 12px;font-size:13px;color:#e8e8f4;width:100%;outline:none;transition:border-color .15s}
.finput:focus,.fsel:focus,.ftxt:focus{border-color:#7c5cfc}
.finput::placeholder,.ftxt::placeholder{color:#333355}
.ftxt{resize:vertical;min-height:76px}
.fsel option{background:#0f0f1a}

.tag{display:inline-flex;align-items:center;padding:2px 7px;border-radius:4px;font-size:10px;font-family:'DM Mono',monospace;font-weight:500}
.tg{background:#00d68f18;color:#00d68f}
.tr{background:#ff4d6a18;color:#ff4d6a}
.ta{background:#ffb34718;color:#ffb347}
.tb{background:#4da6ff18;color:#4da6ff}
.tp{background:#7c5cfc18;color:#7c5cfc}

.tbl-wrap{overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:12px}
th{text-align:left;padding:7px 11px;color:#666688;font-weight:400;font-family:'DM Mono',monospace;font-size:9.5px;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid #1c1c2e}
td{padding:9px 11px;border-bottom:1px solid #1c1c2e18;vertical-align:middle}
tr:hover td{background:#16162a}
tr:last-child td{border-bottom:none}

.prog-wrap{background:#1c1c2e;border-radius:2px;height:4px;width:100%}
.prog-bar{height:4px;border-radius:2px}

.toggle{width:30px;height:17px;background:#1c1c2e;border-radius:9px;cursor:pointer;position:relative;transition:background .2s;border:none;flex-shrink:0}
.toggle.on{background:#7c5cfc}
.toggle::after{content:'';position:absolute;width:11px;height:11px;background:#fff;border-radius:50%;top:3px;left:3px;transition:left .2s}
.toggle.on::after{left:16px}

.sh{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.sh-title{font-family:'Syne',sans-serif;font-weight:600;font-size:13.5px}
.sh-sub{font-size:11px;color:#666688;margin-top:2px}
.insight{display:flex;gap:10px;align-items:flex-start;padding:9px 0;border-bottom:1px solid #1c1c2e22}
.insight:last-child{border-bottom:none}
.upload{border:1.5px dashed #272740;border-radius:10px;padding:24px;text-align:center;cursor:pointer;transition:all .15s;background:#07070f}
.upload:hover{border-color:#7c5cfc;background:#7c5cfc18}
.spinner{width:16px;height:16px;border:2px solid #272740;border-top-color:#7c5cfc;border-radius:50%;display:inline-block;animation:spin .7s linear infinite}

/* LANDING */
.landing{min-height:100vh;overflow-y:auto;background:#07070f}
.land-nav{display:flex;align-items:center;justify-content:space-between;padding:18px 54px;border-bottom:1px solid #1c1c2e;background:#07070fee;backdrop-filter:blur(12px);position:sticky;top:0;z-index:50}
.hero{padding:80px 54px 60px;text-align:center;position:relative;overflow:hidden}
.glow{position:absolute;width:600px;height:600px;border-radius:50%;background:radial-gradient(#7c5cfc14,transparent 70%);pointer-events:none;top:-100px;left:50%;transform:translateX(-50%)}
.hero-eye{display:inline-flex;align-items:center;gap:7px;background:#7c5cfc18;border:1px solid #7c5cfc33;border-radius:20px;padding:5px 14px;font-size:11px;color:#7c5cfc;font-family:'DM Mono',monospace;margin-bottom:26px}
.hero-title{font-family:'Syne',sans-serif;font-weight:800;font-size:50px;line-height:1.1;max-width:740px;margin:0 auto 20px}
.hero-sub{font-size:16px;color:#666688;max-width:520px;margin:0 auto 38px;line-height:1.65}
.hero-btns{display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap}
.hcta{padding:13px 30px;font-size:15px;font-weight:600;border-radius:10px;background:linear-gradient(135deg,#7c5cfc,#4da6ff);color:#fff;cursor:pointer;border:none;transition:all .15s}
.hcta:hover{opacity:.88;transform:translateY(-1px)}
.hghost{padding:12px 26px;font-size:15px;font-weight:500;border-radius:10px;background:transparent;color:#666688;cursor:pointer;border:1.5px solid #1c1c2e;transition:all .15s}
.hghost:hover{background:#16162a;color:#e8e8f4}
.feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;padding:0 54px 70px;max-width:1080px;margin:0 auto}
.feat-card{background:#0f0f1a;border:1px solid #1c1c2e;border-radius:14px;padding:22px;transition:all .2s}
.feat-card:hover{border-color:#7c5cfc66;transform:translateY(-3px)}
.price-section{padding:30px 54px 70px;max-width:1080px;margin:0 auto}
.price-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.price-card{background:#0f0f1a;border:1.5px solid #1c1c2e;border-radius:16px;padding:26px;position:relative;transition:all .2s}
.price-card.feat{border-color:#7c5cfc;background:linear-gradient(135deg,#7c5cfc18,#0f0f1a)}
.price-card.feat::before{content:'Más popular';position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#7c5cfc,#4da6ff);color:#fff;font-size:10px;font-weight:600;padding:3px 14px;border-radius:20px;font-family:'DM Mono',monospace;white-space:nowrap}
.land-footer{padding:36px 54px;border-top:1px solid #1c1c2e;display:flex;align-items:center;justify-content:space-between}

/* AUTH */
.auth-page{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:40px;position:relative;background:#07070f}
.auth-bg{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,#7c5cfc12,transparent 60%)}
.auth-card{background:#0f0f1a;border:1.5px solid #1c1c2e;border-radius:18px;padding:34px;width:100%;max-width:416px;position:relative;z-index:1}
.auth-tabs{display:flex;background:#07070f;border-radius:9px;padding:3px;margin-bottom:22px}
.auth-tab{flex:1;padding:8px;text-align:center;font-size:13px;font-weight:500;border-radius:7px;cursor:pointer;border:none;background:transparent;color:#666688;transition:all .15s}
.auth-tab.active{background:#0f0f1a;color:#e8e8f4;border:1px solid #1c1c2e}
.err-box{background:#ff4d6a18;border:1px solid #ff4d6a33;border-radius:8px;padding:10px 12px;font-size:12px;color:#ff4d6a;margin-bottom:14px}
.ok-box{background:#00d68f18;border:1px solid #00d68f33;border-radius:8px;padding:10px 12px;font-size:12px;color:#00d68f;margin-bottom:14px}

/* CHECKOUT */
.co-page{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:40px;background:#07070f}
.co-card{background:#0f0f1a;border:1.5px solid #1c1c2e;border-radius:18px;overflow:hidden;width:100%;max-width:840px;display:grid;grid-template-columns:1fr 1fr}
.co-left{padding:34px;border-right:1px solid #1c1c2e}
.co-right{padding:34px}
.co-summary{background:#07070f;border:1px solid #1c1c2e;border-radius:10px;padding:15px;margin-bottom:18px}

/* ── MOBILE SIDEBAR DRAWER ── */
.mob-overlay{display:none;position:fixed;inset:0;background:#000000cc;z-index:90;backdrop-filter:blur(3px)}
.mob-overlay.open{display:block}
.hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:6px;border:none;background:none}
.hamburger span{width:20px;height:2px;background:#e8e8f4;border-radius:2px;transition:all .2s;display:block}
.bottom-nav{display:none}

/* ── TABLET (768px) ── */
@media(max-width:900px){
  .g4{grid-template-columns:1fr 1fr}
  .g5{grid-template-columns:1fr 1fr}
  .feat-grid{grid-template-columns:1fr 1fr;padding:0 28px 60px}
  .price-grid{grid-template-columns:1fr;max-width:400px;margin:0 auto}
  .price-section{padding:20px 28px 60px}
  .land-nav{padding:14px 24px}
  .hero{padding:60px 28px 50px}
  .hero-title{font-size:36px}
}

/* ── MOBILE (640px) ── */
@media(max-width:640px){
  .mob-close-btn{display:flex !important}
  /* App shell */
  .app{flex-direction:column}
  .sidebar{
    position:fixed;left:-100%;top:0;bottom:0;z-index:100;
    width:280px;transition:left .25s cubic-bezier(.4,0,.2,1);
    box-shadow:4px 0 40px #0009;min-width:unset;
  }
  .sidebar.mob-open{left:0}
  .main-area{width:100%;height:100vh;overflow-y:auto}
  .content{padding:14px 14px 80px}
  .topbar{padding:10px 14px}
  .hamburger{display:flex}

  /* Bottom navigation */
  .bottom-nav{
    display:flex;position:fixed;bottom:0;left:0;right:0;
    background:#0f0f1a;border-top:1px solid #1c1c2e;
    padding:8px 4px calc(8px + env(safe-area-inset-bottom));
    z-index:50;gap:4px;
  }
  .bnav-item{
    flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;
    padding:6px 4px;border-radius:8px;cursor:pointer;border:none;background:none;
    color:#666688;font-size:9px;font-family:'DM Mono',monospace;transition:all .15s;
    -webkit-tap-highlight-color:transparent;
  }
  .bnav-item.active{color:#7c5cfc;background:#7c5cfc15}
  .bnav-icon{font-size:18px;line-height:1}

  /* Grids */
  .g2,.g3,.g4,.g5{grid-template-columns:1fr}
  .g2-keep{grid-template-columns:1fr 1fr}

  /* Landing */
  .landing{overflow-x:hidden}
  .land-nav{padding:12px 16px}
  .land-nav-btns{gap:6px}
  .land-nav .btn{font-size:12px;padding:7px 12px}
  .hero{padding:44px 16px 36px}
  .glow{width:300px;height:300px}
  .hero-eye{font-size:10px;padding:4px 11px}
  .hero-title{font-size:26px;line-height:1.15;margin-bottom:16px}
  .hero-sub{font-size:14px;margin-bottom:28px}
  .hero-btns{flex-direction:column;align-items:stretch;padding:0 20px}
  .hcta,.hghost{width:100%;text-align:center;padding:13px}
  .feat-grid{grid-template-columns:1fr;padding:0 16px 50px;gap:12px}
  .feat-card{padding:18px}
  .price-section{padding:20px 16px 50px}
  .price-grid{max-width:100%}
  .price-card{padding:20px}
  .price-card.feat::before{font-size:9px}
  .land-footer{padding:24px 16px;flex-direction:column;gap:14px;text-align:center}

  /* Auth */
  .auth-page{padding:16px}
  .auth-card{padding:24px 18px;border-radius:14px}

  /* Checkout */
  .co-page{padding:0;align-items:flex-end}
  .co-card{grid-template-columns:1fr;border-radius:18px 18px 0 0;max-height:95vh;overflow-y:auto}
  .co-left{padding:22px 18px;border-right:none;border-bottom:1px solid #1c1c2e}
  .co-right{padding:22px 18px}

  /* Cards & content */
  .card{padding:14px}
  .card-sm{padding:11px 12px}

  /* Tables → horizontal scroll */
  .tbl-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch}
  table{min-width:480px}

  /* Topbar */
  .topbar-search-wrap{display:none}
  .topbar-title-txt{font-size:14px}

  /* Metrics */
  .m-val{font-size:20px}

  /* Modals */
  .modal-overlay-inner{padding:0;align-items:flex-end}

  /* Steps */
  .steps-row{overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:4px;gap:6px}
  .step-item{white-space:nowrap;flex-shrink:0}

  /* WA preview */
  .wa-bubble{font-size:12px}
}

/* ── SMALL MOBILE (400px) ── */
@media(max-width:400px){
  .hero-title{font-size:22px}
  .auth-card{padding:20px 14px}
}
`;

const Tag = ({ children, t = "tp" }) => <span className={`tag ${t}`}>{children}</span>;

const MiniChart = ({ data, color = "#7c5cfc" }) => {
  const max = Math.max(...data);
  return (
    <div className="mini-bars">
      {data.map((v, i) => (
        <div key={i} className="mini-bar" style={{ height: `${(v/max)*100}%`, background: i===data.length-1?color:undefined }} />
      ))}
    </div>
  );
};

const MetricCard = ({ label, value, change, up, chart, color }) => (
  <div className="card card-sm fade-in">
    <div className="m-lbl">{label}</div>
    <div className="m-val" style={{ color: color||C.text }}>{value}</div>
    <div className={`m-chg ${up?"up":"down"}`}><span>{up?"▲":"▼"}</span> {change}</div>
    {chart && <MiniChart data={chart} color={color||C.accent} />}
  </div>
);

const PLANS = [
  { id:"starter", name:"Starter", price:49, featured:false,
    features:["20 campañas/mes","50 creativos IA","Reportes automáticos","Dashboard básico","Soporte email"],
    no:["Múltiples cuentas Meta","Optimización avanzada","Subusuarios"] },
  { id:"growth", name:"Growth", price:99, featured:true,
    features:["Campañas ilimitadas","Creativos ilimitados","Optimización IA avanzada","Dashboard premium","3 cuentas Meta","2 subusuarios"],
    no:["IA completa","Prioridad procesamiento"] },
  { id:"scale", name:"Scale", price:199, featured:false,
    features:["Todo de Growth","IA avanzada completa","Automatizaciones ilimitadas","Prioridad procesamiento","Reportes avanzados","10 subusuarios","Acceso API"],
    no:[] },
];

const CMPGS = [
  { id:1, name:"Zapatillas Nike Air - Reels", status:"activa", budget:"$25/día", spent:"$312", ctr:"4.2%", cpc:"$0.38", leads:82, roas:"4.1x" },
  { id:2, name:"Bolsos importados - Stories", status:"activa", budget:"$15/día", spent:"$198", ctr:"3.8%", cpc:"$0.52", leads:38, roas:"3.2x" },
  { id:3, name:"Ropa de invierno - Feed", status:"pausada", budget:"$10/día", spent:"$87", ctr:"1.9%", cpc:"$1.10", leads:9, roas:"1.2x" },
  { id:4, name:"Tecnología gaming - Carrusel", status:"optimizando", budget:"$40/día", spent:"$520", ctr:"5.1%", cpc:"$0.29", leads:179, roas:"5.8x" },
  { id:5, name:"Indumentaria deportiva", status:"activa", budget:"$20/día", spent:"$241", ctr:"3.4%", cpc:"$0.61", leads:55, roas:"2.9x" },
];

// ── LANDING ────────────────────────────────────────────────────────────────────
function Landing({ onLogin, onSelectPlan }) {
  return (
    <div className="landing">
      <nav className="land-nav">
        <div className="logo">
          <div className="logo-icon">AI</div>
          <div className="logo-txt">AI Commerce Ads<div className="logo-sub">Suite</div></div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button className="btn btn-g" style={{ fontSize:13 }} onClick={onLogin}>Iniciar sesión</button>
          <button className="btn btn-p" style={{ fontSize:13 }} onClick={() => onSelectPlan(null)}>Empezar gratis 7 días</button>
        </div>
      </nav>

      <div className="hero">
        <div className="glow" />
        <div className="hero-eye">⚡ Automatización completa con IA</div>
        <h1 className="hero-title">
          Meta Ads que se crean,{" "}
          <span style={{ background:C.grad, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            optimizan y reportan solos
          </span>
        </h1>
        <p className="hero-sub">Generá creativos virales, publicá campañas y redirigí leads a WhatsApp en minutos. Sin conocimientos técnicos.</p>
        <div className="hero-btns">
          <button className="hcta" onClick={() => onSelectPlan(null)}>Comenzar gratis — 7 días</button>
          <button className="hghost" onClick={onLogin}>Ya tengo cuenta →</button>
        </div>
      </div>

      <div className="feat-grid">
        {[
          ["🤖","IA genera tus creativos","Videos, imágenes y reels en 9:16, 1:1 y 4:5 con hooks virales, subtítulos y efectos automáticos."],
          ["🎯","Campañas en un click","La IA configura segmentación, presupuesto, copies y CTA. Publica directo en Meta Ads."],
          ["💬","Leads directo a WhatsApp","Cada anuncio redirige automáticamente con mensaje personalizado pre-cargado."],
          ["📊","Dashboard en tiempo real","ROI, CTR, CPC, CPM y conversiones en un solo lugar. Sincronizados desde Meta cada hora."],
          ["📧","Informe diario a las 20:00","PDF profesional con análisis IA, recomendaciones, qué pausar y qué escalar."],
          ["🔄","Optimización continua","La IA detecta campañas malas y sugiere mejoras. Aprobás con un click."],
        ].map(([icon,title,desc],i) => (
          <div key={i} className="feat-card">
            <div style={{ fontSize:26, marginBottom:12 }}>{icon}</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, marginBottom:7 }}>{title}</div>
            <div style={{ fontSize:13, color:C.textMuted, lineHeight:1.6 }}>{desc}</div>
          </div>
        ))}
      </div>

      <div className="price-section">
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ fontSize:11, color:C.accent, fontFamily:"'DM Mono',monospace", letterSpacing:".12em", textTransform:"uppercase", marginBottom:10 }}>Precios</div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:34, marginBottom:8 }}>Elegí tu plan</div>
          <div style={{ fontSize:15, color:C.textMuted }}>7 días gratis en todos los planes. Cancelás cuando quieras.</div>
        </div>
        <div className="price-grid">
          {PLANS.map(plan => (
            <div key={plan.id} className={`price-card${plan.featured?" feat":""}`}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16 }}>{plan.name}</div>
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:12 }}>{plan.id==="starter"?"Para empezar":plan.id==="growth"?"Para crecer":"Para escalar"}</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:38, lineHeight:1 }}>
                <span style={{ fontSize:18, verticalAlign:"super", marginRight:2 }}>$</span>{plan.price}
              </div>
              <div style={{ fontSize:12, color:C.textMuted, margin:"5px 0 18px" }}>USD por mes · 7 días gratis</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:22, fontSize:13 }}>
                {plan.features.map((f,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ color:C.green, fontSize:11 }}>✓</span><span>{f}</span>
                  </div>
                ))}
                {plan.no.map((f,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ color:C.textDim, fontSize:11 }}>✕</span><span style={{ color:C.textDim }}>{f}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => onSelectPlan(plan)}
                style={{ width:"100%", padding:"11px", fontSize:14, fontWeight:600, border:"none", borderRadius:9, cursor:"pointer", transition:"all .15s", background:plan.featured?"linear-gradient(135deg,#7c5cfc,#4da6ff)":"transparent", color:plan.featured?"#fff":C.accent, border:plan.featured?"none":`1.5px solid ${C.accent}` }}
              >
                Empezar con {plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="land-footer">
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div className="logo-icon" style={{ width:22, height:22, fontSize:10 }}>AI</div>
          <span style={{ fontSize:13, color:C.textMuted }}>AI Commerce Ads Suite · Creado por Alan Ugarte</span>
        </div>
        <div style={{ display:"flex", gap:18, fontSize:13, color:C.textMuted }}>
          {["Términos","Privacidad","Soporte"].map(t => <span key={t} style={{ cursor:"pointer" }}>{t}</span>)}
        </div>
      </div>
    </div>
  );
}

// ── AUTH ───────────────────────────────────────────────────────────────────────
function AuthPage({ initTab="login", plan, onSuccess, onBack }) {
  const [tab, setTab] = useState(initTab);
  const [form, setForm] = useState({ email:"", password:"", name:"", confirm:"" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const set = (k,v) => { setForm(p=>({...p,[k]:v})); setErr(""); };

  const login = async () => {
    if (!form.email||!form.password) { setErr("Completá todos los campos"); return; }
    setLoading(true);
    await new Promise(r=>setTimeout(r,1200));
    setLoading(false);
    onSuccess({ email:form.email, name:"Alan Ugarte", plan:"growth" });
  };

  const register = async () => {
    if (!form.email||!form.password||!form.name) { setErr("Completá todos los campos"); return; }
    if (form.password.length<8) { setErr("Contraseña mínimo 8 caracteres"); return; }
    if (form.password!==form.confirm) { setErr("Las contraseñas no coinciden"); return; }
    setLoading(true);
    await new Promise(r=>setTimeout(r,1400));
    setLoading(false);
    if (plan) onSuccess({ email:form.email, name:form.name, plan:plan.id, needsPay:true, planData:plan });
    else setOk("¡Cuenta creada! Revisá tu email para verificar tu cuenta.");
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <button className="btn btn-g" style={{ position:"fixed", top:20, left:20, fontSize:12 }} onClick={onBack}>← Volver</button>
      <div className="auth-card fade-in">
        <div style={{ display:"flex", alignItems:"center", gap:10, justifyContent:"center", marginBottom:26 }}>
          <div className="logo-icon" style={{ width:34, height:34, fontSize:14 }}>AI</div>
          <div><div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700 }}>AI Commerce Ads</div><div style={{ fontSize:11, color:C.textMuted }}>Suite</div></div>
        </div>
        {plan && (
          <div style={{ background:C.accentDim, border:`1px solid ${C.accent}33`, borderRadius:9, padding:"9px 13px", marginBottom:18, fontSize:13 }}>
            <span style={{ color:C.textMuted }}>Plan: </span>
            <span style={{ color:C.accent, fontWeight:600 }}>{plan.name} — ${plan.price}/mes</span>
            <span style={{ color:C.green, marginLeft:8, fontSize:11 }}>7 días gratis</span>
          </div>
        )}
        <div className="auth-tabs">
          {["login","register"].map(t => (
            <button key={t} className={`auth-tab${tab===t?" active":""}`} onClick={() => { setTab(t); setErr(""); setOk(""); }}>
              {t==="login"?"Iniciar sesión":"Crear cuenta"}
            </button>
          ))}
        </div>
        {err && <div className="err-box">{err}</div>}
        {ok && <div className="ok-box">{ok}</div>}
        {tab==="login" ? (
          <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
            <div className="fg"><label className="flbl">Email</label><input className="finput" type="email" placeholder="tu@email.com" value={form.email} onChange={e=>set("email",e.target.value)} /></div>
            <div className="fg"><label className="flbl">Contraseña</label><input className="finput" type="password" placeholder="••••••••" value={form.password} onChange={e=>set("password",e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()} /></div>
            <div style={{ textAlign:"right" }}><span style={{ color:C.accent, fontSize:12, cursor:"pointer" }}>¿Olvidaste tu contraseña?</span></div>
            <button className="btn btn-p" style={{ width:"100%", padding:"11px" }} onClick={login} disabled={loading}>
              {loading?<span className="spinner" />:"Ingresar →"}
            </button>
            <div style={{ textAlign:"center", fontSize:12, color:C.textMuted }}>¿No tenés cuenta? <span style={{ color:C.accent, cursor:"pointer" }} onClick={()=>setTab("register")}>Registrate gratis</span></div>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
            <div className="fg"><label className="flbl">Nombre completo</label><input className="finput" placeholder="Alan Ugarte" value={form.name} onChange={e=>set("name",e.target.value)} /></div>
            <div className="fg"><label className="flbl">Email</label><input className="finput" type="email" placeholder="tu@email.com" value={form.email} onChange={e=>set("email",e.target.value)} /></div>
            <div className="fg"><label className="flbl">Contraseña</label><input className="finput" type="password" placeholder="Mínimo 8 caracteres" value={form.password} onChange={e=>set("password",e.target.value)} /></div>
            <div className="fg"><label className="flbl">Confirmar contraseña</label><input className="finput" type="password" placeholder="••••••••" value={form.confirm} onChange={e=>set("confirm",e.target.value)} onKeyDown={e=>e.key==="Enter"&&register()} /></div>
            <button className="btn btn-p" style={{ width:"100%", padding:"11px" }} onClick={register} disabled={loading}>
              {loading?<span className="spinner" />:plan?"Crear cuenta y pagar →":"Crear cuenta gratis →"}
            </button>
            <div style={{ fontSize:11, color:C.textDim, textAlign:"center" }}>Al registrarte aceptás los Términos y la Política de Privacidad</div>
            <div style={{ textAlign:"center", fontSize:12, color:C.textMuted }}>¿Ya tenés cuenta? <span style={{ color:C.accent, cursor:"pointer" }} onClick={()=>setTab("login")}>Iniciá sesión</span></div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── CHECKOUT ──────────────────────────────────────────────────────────────────
function Checkout({ plan, user, onSuccess, onBack }) {
  const [num, setNum] = useState(""); const [exp, setExp] = useState(""); const [cvc, setCvc] = useState(""); const [name, setName] = useState(user?.name||"");
  const [loading, setLoading] = useState(false); const [err, setErr] = useState("");
  const fmtNum = v => v.replace(/\D/g,"").slice(0,16).replace(/(\d{4})/g,"$1 ").trim();
  const fmtExp = v => { const d=v.replace(/\D/g,"").slice(0,4); return d.length>=3?d.slice(0,2)+"/"+d.slice(2):d; };
  const pay = async () => {
    if (!num||num.replace(/\s/g,"").length<16){setErr("Número de tarjeta inválido");return;}
    if (!exp||exp.length<5){setErr("Fecha de vencimiento inválida");return;}
    if (!cvc||cvc.length<3){setErr("Código CVC inválido");return;}
    if (!name){setErr("Ingresá el nombre del titular");return;}
    setLoading(true);setErr("");
    await new Promise(r=>setTimeout(r,2000));
    setLoading(false);onSuccess();
  };
  return (
    <div className="co-page">
      <div className="auth-bg" />
      <button className="btn btn-g" style={{ position:"fixed",top:20,left:20,fontSize:12 }} onClick={onBack}>← Volver</button>
      <div className="co-card fade-in">
        <div className="co-left">
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:22 }}>
            <div className="logo-icon" style={{ width:26,height:26,fontSize:11 }}>AI</div>
            <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14 }}>AI Commerce Ads Suite</div>
          </div>
          <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:19,marginBottom:18 }}>Resumen del pedido</div>
          <div className="co-summary">
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5 }}>
              <span style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15 }}>Plan {plan.name}</span>
              <span style={{ fontFamily:"'DM Mono',monospace",fontSize:14 }}>${plan.price}/mes</span>
            </div>
            <div style={{ fontSize:12,color:C.textMuted,marginBottom:12 }}>Facturación mensual · Cancelable en cualquier momento</div>
            <div style={{ borderTop:`1px solid ${C.border}`,paddingTop:10 }}>
              {plan.features.slice(0,4).map((f,i)=>(
                <div key={i} style={{ display:"flex",gap:7,marginBottom:5,fontSize:12,color:C.textMuted }}>
                  <span style={{ color:C.green }}>✓</span>{f}
                </div>
              ))}
            </div>
          </div>
          <div style={{ background:C.greenDim,border:`1px solid ${C.green}33`,borderRadius:9,padding:"11px 13px",marginBottom:14 }}>
            <div style={{ fontSize:13,color:C.green,fontWeight:600 }}>🎉 7 días completamente gratis</div>
            <div style={{ fontSize:12,color:C.textMuted,marginTop:3 }}>El primer cobro de ${plan.price} es el día 8.</div>
          </div>
          <div style={{ borderTop:`1px solid ${C.border}`,paddingTop:13 }}>
            {[["Cobrado hoy","$0.00",C.green],[`A partir del día 8`,"$"+plan.price+"/mes",C.text]].map(([k,v,col],i)=>(
              <div key={i} style={{ display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:5 }}>
                <span style={{ color:C.textMuted }}>{k}</span>
                <span style={{ fontFamily:"'DM Mono',monospace",color:col,fontWeight:600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="co-right">
          <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:19,marginBottom:20 }}>Datos de pago</div>
          {err&&<div className="err-box">{err}</div>}
          <div style={{ display:"flex",flexDirection:"column",gap:13 }}>
            <div className="fg"><label className="flbl">Nombre en la tarjeta</label><input className="finput" placeholder="ALAN UGARTE" value={name} onChange={e=>{setName(e.target.value);setErr("");}} /></div>
            <div className="fg">
              <label className="flbl">Número de tarjeta</label>
              <div style={{ position:"relative" }}>
                <input className="finput" placeholder="0000 0000 0000 0000" value={num} onChange={e=>{setNum(fmtNum(e.target.value));setErr("");}} style={{ paddingRight:46,fontFamily:"'DM Mono',monospace" }} />
                <span style={{ position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",fontSize:16 }}>💳</span>
              </div>
            </div>
            <div className="g2" style={{ gap:12 }}>
              <div className="fg"><label className="flbl">Vencimiento</label><input className="finput" placeholder="MM/AA" value={exp} onChange={e=>{setExp(fmtExp(e.target.value));setErr("");}} style={{ fontFamily:"'DM Mono',monospace" }} /></div>
              <div className="fg"><label className="flbl">CVC</label><input className="finput" placeholder="123" maxLength={4} value={cvc} onChange={e=>{setCvc(e.target.value.replace(/\D/g,""));setErr("");}} style={{ fontFamily:"'DM Mono',monospace" }} /></div>
            </div>
            <button onClick={pay} disabled={loading}
              style={{ width:"100%",padding:"12px",fontSize:14,fontWeight:600,background:loading?C.border:C.grad,color:"#fff",border:"none",borderRadius:9,cursor:loading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginTop:4 }}>
              {loading?<><span className="spinner" style={{ borderTopColor:"#fff" }} /> Procesando...</>:`🔒 Iniciar prueba gratis — ${plan.name}`}
            </button>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontSize:11,color:C.textMuted }}>
              <span>🔒</span> Pago seguro SSL · Powered by Stripe
            </div>
            <div style={{ fontSize:11,color:C.textDim,textAlign:"center",lineHeight:1.5 }}>Podés cancelar antes del día 8 sin costo alguno.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SUCCESS ────────────────────────────────────────────────────────────────────
function Success({ plan, onEnter }) {
  const [count, setCount] = useState(3);
  useEffect(() => {
    const t = setInterval(() => setCount(c=>{if(c<=1){clearInterval(t);onEnter();return 0;}return c-1;}),1000);
    return ()=>clearInterval(t);
  },[]);
  return (
    <div style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.bg }}>
      <div style={{ textAlign:"center" }} className="fade-in">
        <div style={{ fontSize:56,marginBottom:18 }}>🎉</div>
        <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:26,marginBottom:9 }}>¡Bienvenido a bordo!</div>
        <div style={{ fontSize:16,color:C.textMuted,marginBottom:7 }}>Tu plan <strong style={{ color:C.accent }}>{plan?.name||"Growth"}</strong> está activo.</div>
        <div style={{ fontSize:13,color:C.textMuted,marginBottom:28 }}>Tenés 7 días gratis para explorar todo.</div>
        <div style={{ fontSize:13,color:C.textMuted,marginBottom:12 }}>Redirigiendo en {count}s…</div>
        <button className="btn btn-p" style={{ padding:"10px 28px" }} onClick={onEnter}>Ir al dashboard ahora →</button>
      </div>
    </div>
  );
}

// ── DASHBOARD PAGES ────────────────────────────────────────────────────────────
function DBDash() {
  return (
    <div className="content fade-in">
      <div style={{ marginBottom:20 }}>
        <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,marginBottom:3 }}>Buen día, Alan 👋</div>
        <div style={{ fontSize:13,color:C.textMuted }}>8 campañas activas · Último informe enviado hace 3h</div>
      </div>
      <div className="g4" style={{ marginBottom:18 }}>
        <MetricCard label="ROI general" value="4.3x" change="+12% esta semana" up chart={[3,5,4,7,6,8,9,11]} color={C.green} />
        <MetricCard label="Leads WhatsApp" value="342" change="+28 hoy" up chart={[20,25,30,28,35,38,40,45]} />
        <MetricCard label="CPC promedio" value="$0.52" change="-8% vs ayer" up chart={[8,7,9,6,5,6,5,4]} color={C.blue} />
        <MetricCard label="Gasto total" value="$1,358" change="+$102 hoy" up={false} chart={[60,80,70,90,95,100,110,120]} color={C.amber} />
      </div>
      <div className="g2" style={{ marginBottom:18 }}>
        <div className="card">
          <div className="sh"><div><div className="sh-title">Campañas activas</div><div className="sh-sub">Tiempo real</div></div><Tag t="tg">8 activas</Tag></div>
          <div className="tbl-wrap"><table><thead><tr><th>Campaña</th><th>CTR</th><th>Leads</th><th>ROAS</th></tr></thead><tbody>
            {CMPGS.slice(0,4).map(c=>(
              <tr key={c.id}><td><div style={{ fontSize:12,fontWeight:500 }}>{c.name}</div><Tag t={c.status==="activa"?"tg":c.status==="pausada"?"tr":"ta"}>{c.status}</Tag></td>
                <td style={{ fontFamily:"'DM Mono',monospace",fontSize:12 }}>{c.ctr}</td>
                <td style={{ fontFamily:"'DM Mono',monospace",fontSize:12 }}>{c.leads}</td>
                <td style={{ fontFamily:"'DM Mono',monospace",fontSize:12,color:C.green }}>{c.roas}</td>
              </tr>
            ))}
          </tbody></table></div>
        </div>
        <div className="card">
          <div className="sh"><div><div className="sh-title">Insights IA</div></div><div className="ai-dots"><div className="ai-dot"/><div className="ai-dot"/><div className="ai-dot"/></div></div>
          {[
            {i:"🚀",t:"Gaming Carrusel: ROAS 5.8x → Subir a $60/día",x:"tg"},
            {i:"⏸️",t:"Ropa invierno: CTR 1.9%, ROAS 1.2x → Pausar hook",x:"tr"},
            {i:"🎯",t:"Mujeres 18-34 convierte 2.3x más → Aumentar bid",x:"tb"},
            {i:"✏️",t:"'Últimas unidades' = CTR +40% → Aplicar a todas",x:"ta"},
          ].map((ins,i)=>(
            <div key={i} className="insight">
              <span style={{ fontSize:15 }}>{ins.i}</span>
              <div style={{ flex:1,fontSize:12,lineHeight:1.5 }}>{ins.t}</div>
              <Tag t={ins.x}>{ins.x==="tg"?"Escalar":ins.x==="tr"?"Pausar":ins.x==="tb"?"Optimizar":"Editar"}</Tag>
            </div>
          ))}
        </div>
      </div>
      <div className="g3">
        {[["⚡","Nueva campaña rápida","IA la configura en 60 seg",C.accent],["🎨","Generar creativos","Video + imágenes automáticas",C.blue],["📧","Ver informe de hoy","Generado a las 20:00",C.green]].map(([icon,title,sub,col],i)=>(
          <div key={i} className="card" style={{ cursor:"pointer" }} onMouseEnter={e=>e.currentTarget.style.borderColor=col} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
            <div style={{ fontSize:22,marginBottom:9 }}>{icon}</div>
            <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:13,marginBottom:4 }}>{title}</div>
            <div style={{ fontSize:12,color:C.textMuted }}>{sub}</div>
            <div style={{ marginTop:11,fontSize:11,color:col,fontFamily:"'DM Mono',monospace" }}>EJECUTAR →</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DBCampaigns() {
  return (
    <div className="content fade-in">
      <div style={{ display:"flex",gap:10,marginBottom:16 }}>
        <input className="finput" placeholder="🔍 Buscar..." style={{ maxWidth:250 }} />
        <select className="fsel" style={{ maxWidth:130 }}><option>Todas</option><option>Activas</option><option>Pausadas</option></select>
      </div>
      <div className="card"><div className="tbl-wrap"><table>
        <thead><tr><th>Nombre</th><th>Estado</th><th>Presupuesto</th><th>Gastado</th><th>CTR</th><th>CPC</th><th>Leads</th><th>ROAS</th><th>Acción</th></tr></thead>
        <tbody>{CMPGS.map(c=>(
          <tr key={c.id}>
            <td style={{ fontWeight:500,fontSize:12 }}>{c.name}</td>
            <td><Tag t={c.status==="activa"?"tg":c.status==="pausada"?"tr":"ta"}>{c.status}</Tag></td>
            <td style={{ fontFamily:"'DM Mono',monospace",fontSize:12 }}>{c.budget}</td>
            <td style={{ fontFamily:"'DM Mono',monospace",fontSize:12 }}>{c.spent}</td>
            <td style={{ fontFamily:"'DM Mono',monospace",fontSize:12 }}>{c.ctr}</td>
            <td style={{ fontFamily:"'DM Mono',monospace",fontSize:12 }}>{c.cpc}</td>
            <td style={{ fontFamily:"'DM Mono',monospace",fontSize:12,color:C.accent }}>{c.leads}</td>
            <td style={{ fontFamily:"'DM Mono',monospace",fontSize:12,color:C.green }}>{c.roas}</td>
            <td><div style={{ display:"flex",gap:5 }}>
              <button className="btn btn-g" style={{ padding:"3px 8px",fontSize:11 }}>Editar</button>
              <button className="btn btn-g" style={{ padding:"3px 8px",fontSize:11 }}>{c.status==="activa"?"Pausar":"Activar"}</button>
            </div></td>
          </tr>
        ))}</tbody>
      </table></div></div>
    </div>
  );
}

function DBNewCampaign() {
  const [step,setStep]=useState(1);
  const [analyzing,setAnalyzing]=useState(false);
  const [analyzed,setAnalyzed]=useState(false);
  const [form,setForm]=useState({name:"",price:"",desc:"",budget:"25"});
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));
  return (
    <div className="content fade-in">
      <div style={{ display:"flex",gap:8,marginBottom:22 }}>
        {["Producto","IA analiza","Creativos","Publicar"].map((s,i)=>(
          <div key={i} style={{ display:"flex",alignItems:"center",gap:8 }}>
            <div style={{ padding:"5px 13px",borderRadius:6,fontSize:12,fontFamily:"'DM Mono',monospace",background:step===i+1?C.accentDim:step>i+1?C.greenDim:C.border,color:step===i+1?C.accent:step>i+1?C.green:C.textMuted,border:step===i+1?`1px solid ${C.accent}44`:"1px solid transparent" }}>{i+1}. {s}</div>
            {i<3&&<span style={{ color:C.textDim,fontSize:10 }}>›</span>}
          </div>
        ))}
      </div>
      {step===1&&<div className="g2" style={{ gap:16 }}>
        <div className="card">
          <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:600,marginBottom:13 }}>Datos del producto</div>
          <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
            <div className="fg"><label className="flbl">Nombre del producto</label><input className="finput" placeholder="ej. Nike Air Max 270" value={form.name} onChange={e=>set("name",e.target.value)} /></div>
            <div className="fg"><label className="flbl">Precio de venta</label><input className="finput" placeholder="$99.990" value={form.price} onChange={e=>set("price",e.target.value)} /></div>
            <div className="fg"><label className="flbl">Descripción</label><textarea className="ftxt" placeholder="¿Qué hace especial este producto?" value={form.desc} onChange={e=>set("desc",e.target.value)} /></div>
            <div className="g2"><div className="fg"><label className="flbl">Presupuesto (USD/día)</label><input className="finput" type="number" value={form.budget} onChange={e=>set("budget",e.target.value)} /></div>
            <div className="fg"><label className="flbl">Objetivo</label><select className="fsel"><option>→ WhatsApp</option><option>Tráfico web</option></select></div></div>
          </div>
        </div>
        <div className="card">
          <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:600,marginBottom:13 }}>Material</div>
          <div className="upload" style={{ marginBottom:10 }}><div style={{ fontSize:24,marginBottom:7 }}>🎬</div><div style={{ fontSize:13,color:C.textMuted }}>Video o imagen principal</div><div style={{ fontSize:11,color:C.textDim,marginTop:3 }}>MP4, MOV, JPG · máx 500MB</div></div>
          <div className="upload"><div style={{ fontSize:24,marginBottom:7 }}>🖼️</div><div style={{ fontSize:13,color:C.textMuted }}>Fotos adicionales</div></div>
          <div style={{ marginTop:13,padding:"10px 12px",background:C.accentDim,borderRadius:8,fontSize:12,color:C.accent,lineHeight:1.5 }}>💡 La IA crea versiones virales de tu material automáticamente</div>
        </div>
      </div>}
      {step===2&&<div className="card" style={{ maxWidth:520,margin:"0 auto" }}>
        <div style={{ textAlign:"center",padding:"14px 0" }}>
          {!analyzed?(<>
            <div style={{ fontSize:36,marginBottom:13 }}>🤖</div>
            <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,marginBottom:7 }}>{analyzing?"IA analizando...":"Listo para analizar"}</div>
            <div style={{ fontSize:13,color:C.textMuted,marginBottom:18,lineHeight:1.6 }}>Voy a analizar Meta Ad Library, TikTok trends y patrones virales para crear la estrategia perfecta.</div>
            {analyzing?(<div style={{ display:"flex",flexDirection:"column",gap:10,textAlign:"left",marginBottom:18 }}>
              {["Analizando Meta Ad Library...","Detectando hooks virales...","Generando copy estratégico...","Definiendo segmentación..."].map((t,i)=>(
                <div key={i} style={{ display:"flex",alignItems:"center",gap:10,fontSize:12,color:C.textMuted }}><div className="spinner" style={{ flexShrink:0 }} /> {t}</div>
              ))}
            </div>):<button className="btn btn-p" style={{ padding:"10px 24px" }} onClick={()=>{setAnalyzing(true);setTimeout(()=>{setAnalyzing(false);setAnalyzed(true);},2600);}}>Iniciar análisis IA</button>}
          </>):(
            <div style={{ textAlign:"left" }}>
              <div style={{ textAlign:"center",marginBottom:14 }}><div style={{ fontSize:30 }}>✅</div><div style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,marginTop:5 }}>Análisis completado</div></div>
              {[["Hook","\"¿Todavía pagás de más por esto?\""],["Tono","Urgencia + beneficio directo"],["Formato","Reel vertical 9:16"],["Audiencia","Mujeres 22-38, moda"],["CTA","Escribinos por WhatsApp →"]].map(([k,v],i)=>(
                <div key={i} style={{ display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.border}22`,fontSize:13 }}>
                  <span style={{ color:C.textMuted }}>{k}</span><span style={{ color:C.text,fontWeight:500,maxWidth:"55%",textAlign:"right" }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>}
      {step===3&&<div>
        <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:600,marginBottom:13 }}>Creativos generados por IA</div>
        <div className="g3">
          {[{f:"9:16",l:"Reel principal",icon:"🎬",bg:"#0d1b2a",best:true},{f:"1:1",l:"Feed cuadrado",icon:"📸",bg:"#0a1a0a"},{f:"4:5",l:"Story",icon:"📱",bg:"#1a0a1a"}].map((c,i)=>(
            <div key={i} style={{ background:C.surface,border:`1.5px solid ${i===0?C.accent:C.border}`,borderRadius:10,overflow:"hidden",cursor:"pointer" }}>
              <div style={{ background:c.bg,aspectRatio:c.f==="9:16"?"9/16":"4/5",display:"flex",alignItems:"center",justifyContent:"center",position:"relative" }}>
                {c.best&&<div style={{ position:"absolute",top:8,right:8,background:C.accent,color:"#fff",fontSize:9,padding:"2px 7px",borderRadius:4 }}>★ Rec.</div>}
                <div style={{ textAlign:"center" }}><div style={{ fontSize:32 }}>{c.icon}</div><div style={{ fontFamily:"'DM Mono',monospace",fontSize:9,color:C.textMuted,marginTop:5 }}>{c.f}</div></div>
              </div>
              <div style={{ padding:"10px 11px" }}><div style={{ fontSize:12,fontWeight:500 }}>{c.l}</div><div style={{ fontSize:10,color:C.textMuted,marginTop:2,fontFamily:"'DM Mono',monospace" }}>Auto-generado</div></div>
            </div>
          ))}
        </div>
      </div>}
      {step===4&&<div className="g2" style={{ gap:16 }}>
        <div className="card">
          <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:600,marginBottom:13 }}>Configuración final</div>
          <div style={{ padding:"9px 12px",background:C.greenDim,borderRadius:8,border:`1px solid ${C.green}33`,fontSize:12,color:C.green,marginBottom:13 }}>✅ Meta Ads conectado · WhatsApp vinculado</div>
          {[["Campaña",form.name||"Nueva campaña IA"],["Presupuesto",`$${form.budget} USD/día`],["Objetivo","Mensajes WhatsApp"],["Formatos","Reel + Story + Feed"],["Segmentación","IA: Mujeres 22-38"],["Pixel Meta","Vinculado ✓"]].map(([k,v],i)=>(
            <div key={i} style={{ display:"flex",justifyContent:"space-between",fontSize:13,padding:"6px 0",borderBottom:`1px solid ${C.border}22` }}>
              <span style={{ color:C.textMuted }}>{k}</span><span style={{ fontWeight:500 }}>{v}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:600,marginBottom:13 }}>Preview WhatsApp</div>
          <div style={{ background:"#0d1117",borderRadius:10,padding:14,fontSize:12 }}>
            <div style={{ fontSize:10,color:"#4b5563",marginBottom:8,fontFamily:"'DM Mono',monospace" }}>WhatsApp Business</div>
            <div style={{ background:"#1f2937",borderRadius:"10px 10px 10px 2px",padding:"9px 11px",marginBottom:7,maxWidth:"80%",lineHeight:1.5,fontSize:12 }}>Hola, vi tu anuncio. ¿Tenés disponibilidad?</div>
            <div style={{ background:"#1a3a2a",borderRadius:"10px 10px 2px 10px",padding:"9px 11px",marginLeft:"auto",maxWidth:"80%",lineHeight:1.5,fontSize:12 }}>¡Hola! Sí 🎉 ¿Cuál es tu talle?</div>
          </div>
          <button className="btn btn-p" style={{ width:"100%",marginTop:13,padding:"11px",fontSize:14 }}>🚀 Publicar en Meta Ads</button>
        </div>
      </div>}
      <div style={{ display:"flex",justifyContent:"space-between",marginTop:20 }}>
        <button className="btn btn-g" onClick={()=>setStep(Math.max(1,step-1))} disabled={step===1}>← Atrás</button>
        {step<4?<button className="btn btn-p" onClick={()=>setStep(step+1)}>Continuar →</button>:<button className="btn btn-p" style={{ background:C.green }}>✅ Publicar</button>}
      </div>
    </div>
  );
}

function DBIntegrations() {
  const [saved,setSaved]=useState({});
  const [loading,setLoading]=useState({});
  const [success,setSuccess]=useState({});
  const [error,setError]=useState({});
  const [forms,setForms]=useState({
    meta:{accessToken:"",adAccountId:"",pixelId:"",pageId:"",businessId:""},
    whatsapp:{phoneNumberId:"",accessToken:"",businessAccountId:""},
    stripe:{secretKey:"",webhookSecret:""},
    instagram:{accountId:""},
  });
  const setF=(id,k,v)=>{setForms(p=>({...p,[id]:{...p[id],[k]:v}}));setError(p=>({...p,[id]:""}));setSuccess(p=>({...p,[id]:""}));};
  const connect=async(id)=>{
    const f=forms[id];
    if(id==="meta"&&(!f.accessToken||!f.adAccountId)){setError(p=>({...p,[id]:"Access Token y Ad Account ID son requeridos"}));return;}
    if(id==="whatsapp"&&(!f.phoneNumberId||!f.accessToken)){setError(p=>({...p,[id]:"Phone Number ID y Access Token son requeridos"}));return;}
    if(id==="stripe"&&!f.secretKey){setError(p=>({...p,[id]:"Secret Key es requerido"}));return;}
    setLoading(p=>({...p,[id]:true}));
    await new Promise(r=>setTimeout(r,1600));
    setLoading(p=>({...p,[id]:false}));
    setSaved(p=>({...p,[id]:true}));
    setSuccess(p=>({...p,[id]:"Integración conectada correctamente ✓"}));
  };
  const disconnect=(id)=>{
    setSaved(p=>({...p,[id]:false}));
    setSuccess(p=>({...p,[id]:""}));
    const blank=Object.fromEntries(Object.keys(forms[id]).map(k=>[k,""]));
    setForms(p=>({...p,[id]:blank}));
  };

  const Integ=({id,icon,title,required,children,hint})=>(
    <div className="card fade-in" style={{ marginBottom:14,border:saved[id]?`1.5px solid ${C.green}44`:`1px solid ${C.border}` }}>
      <div style={{ display:"flex",alignItems:"center",gap:11,marginBottom:14 }}>
        <span style={{ fontSize:24 }}>{icon}</span>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <span style={{ fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:14 }}>{title}</span>
            {required&&<Tag t="tr">Requerido</Tag>}
            {saved[id]&&<Tag t="tg">✓ Conectado</Tag>}
          </div>
          {hint&&<div style={{ fontSize:12,color:C.textMuted,marginTop:2 }}>{hint}</div>}
        </div>
        {saved[id]&&<button className="btn btn-d" style={{ fontSize:12,padding:"5px 11px" }} onClick={()=>disconnect(id)}>Desconectar</button>}
      </div>
      {error[id]&&<div className="err-box">{error[id]}</div>}
      {success[id]&&<div className="ok-box">{success[id]}</div>}
      {!saved[id]&&<>
        {children}
        <button className="btn btn-p" style={{ marginTop:13,padding:"9px 20px",fontSize:13,display:"flex",alignItems:"center",gap:8 }} onClick={()=>connect(id)} disabled={loading[id]}>
          {loading[id]?<><span className="spinner" style={{ borderTopColor:"#fff" }} /> Verificando...</>:`Conectar ${title}`}
        </button>
      </>}
      {saved[id]&&<div style={{ display:"flex",gap:7,flexWrap:"wrap" }}>
        {Object.entries(forms[id]).filter(([,v])=>v).map(([k])=>(
          <div key={k} style={{ background:C.greenDim,border:`1px solid ${C.green}33`,borderRadius:5,padding:"3px 9px",fontSize:10,color:C.green,fontFamily:"'DM Mono',monospace" }}>{k} ✓</div>
        ))}
      </div>}
    </div>
  );

  return (
    <div className="content fade-in" style={{ maxWidth:740 }}>
      <div style={{ marginBottom:18 }}>
        <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:17,marginBottom:3 }}>Integraciones</div>
        <div style={{ fontSize:13,color:C.textMuted }}>Conectá tus cuentas para activar la automatización completa</div>
      </div>
      <Integ id="meta" icon="📘" title="Meta Ads" required hint="Requerido para crear y gestionar campañas en Facebook e Instagram">
        <div style={{ background:C.amberDim,border:`1px solid ${C.amber}33`,borderRadius:8,padding:"9px 12px",marginBottom:13,fontSize:12,color:C.amber }}>
          ⚠️ Necesitás un Access Token de larga duración con permisos ads_management. <span style={{ textDecoration:"underline",cursor:"pointer" }}>Cómo obtenerlo →</span>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:11 }}>
          <div className="fg"><label className="flbl">Access Token <span style={{ color:C.red }}>*</span></label><input className="finput" type="password" placeholder="EAAxxxxxxxxxxxxxxxxx..." value={forms.meta.accessToken} onChange={e=>setF("meta","accessToken",e.target.value)} /></div>
          <div className="g2" style={{ gap:11 }}>
            <div className="fg"><label className="flbl">Ad Account ID <span style={{ color:C.red }}>*</span></label><input className="finput" placeholder="act_123456789" value={forms.meta.adAccountId} onChange={e=>setF("meta","adAccountId",e.target.value)} /></div>
            <div className="fg"><label className="flbl">Business Manager ID</label><input className="finput" placeholder="123456789" value={forms.meta.businessId} onChange={e=>setF("meta","businessId",e.target.value)} /></div>
          </div>
          <div className="g2" style={{ gap:11 }}>
            <div className="fg"><label className="flbl">Pixel ID</label><input className="finput" placeholder="123456789" value={forms.meta.pixelId} onChange={e=>setF("meta","pixelId",e.target.value)} /></div>
            <div className="fg"><label className="flbl">Page ID (Facebook)</label><input className="finput" placeholder="123456789" value={forms.meta.pageId} onChange={e=>setF("meta","pageId",e.target.value)} /></div>
          </div>
        </div>
      </Integ>
      <Integ id="whatsapp" icon="💬" title="WhatsApp Business API" required hint="Requerido para redirigir leads con tracking de conversaciones">
        <div style={{ background:C.accentDim,border:`1px solid ${C.accent}33`,borderRadius:8,padding:"9px 12px",marginBottom:13,fontSize:12,color:C.accent }}>
          💡 Necesitás WhatsApp Business API (Meta). <span style={{ textDecoration:"underline",cursor:"pointer" }}>Ver guía →</span>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:11 }}>
          <div className="fg"><label className="flbl">Phone Number ID <span style={{ color:C.red }}>*</span></label><input className="finput" placeholder="123456789" value={forms.whatsapp.phoneNumberId} onChange={e=>setF("whatsapp","phoneNumberId",e.target.value)} /></div>
          <div className="fg"><label className="flbl">Business Account ID</label><input className="finput" placeholder="123456789" value={forms.whatsapp.businessAccountId} onChange={e=>setF("whatsapp","businessAccountId",e.target.value)} /></div>
          <div className="fg"><label className="flbl">Access Token <span style={{ color:C.red }}>*</span></label><input className="finput" type="password" placeholder="EAAxxxxxxxxxxxxxxxxx..." value={forms.whatsapp.accessToken} onChange={e=>setF("whatsapp","accessToken",e.target.value)} /></div>
        </div>
      </Integ>
      <Integ id="stripe" icon="💳" title="Stripe" hint="Para gestionar pagos propios si ofrecés tu plataforma a clientes">
        <div style={{ display:"flex",flexDirection:"column",gap:11 }}>
          <div className="fg"><label className="flbl">Secret Key <span style={{ color:C.red }}>*</span></label><input className="finput" type="password" placeholder="sk_live_xxxxxxxxxx..." value={forms.stripe.secretKey} onChange={e=>setF("stripe","secretKey",e.target.value)} /></div>
          <div className="fg"><label className="flbl">Webhook Secret</label><input className="finput" type="password" placeholder="whsec_xxxxxxxxxx..." value={forms.stripe.webhookSecret} onChange={e=>setF("stripe","webhookSecret",e.target.value)} /></div>
        </div>
      </Integ>
      <Integ id="instagram" icon="📸" title="Instagram Business" hint="Para anuncios en Instagram Stories y Reels">
        <div className="fg"><label className="flbl">Instagram Account ID</label><input className="finput" placeholder="17841xxxxxxxxx" value={forms.instagram.accountId} onChange={e=>setF("instagram","accountId",e.target.value)} /></div>
        <div style={{ marginTop:9,fontSize:12,color:C.textMuted }}>Debe estar vinculado a la Page de Facebook configurada en Meta Ads.</div>
      </Integ>
    </div>
  );
}

// ── PDF GENERATOR ─────────────────────────────────────────────────────────────
function generatePDF(campaigns, metrics) {
  const date = new Date().toLocaleDateString("es-AR");
  const rows = campaigns.map(c=>`
    <tr>
      <td>${c.name}</td>
      <td class="${parseFloat(c.roas)>=3?'green':'red'}">${c.roas}</td>
      <td>${c.ctr}</td><td>${c.cpc}</td>
      <td class="purple">${c.leads}</td><td>${c.spent}</td>
      <td><span class="badge ${c.status==='activa'?'b-green':c.status==='pausada'?'b-red':'b-amber'}">${c.status}</span></td>
    </tr>`).join("");
  const html=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>Informe Diario — ${date}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',Arial,sans-serif;background:#fff;color:#1a1a2e;padding:40px}
  .header{background:linear-gradient(135deg,#7c5cfc,#4da6ff);color:#fff;padding:28px 32px;border-radius:12px;margin-bottom:28px}
  .header h1{font-size:22px;font-weight:800;margin-bottom:4px}
  .header p{font-size:13px;opacity:.8}
  .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:28px}
  .kpi{border:1px solid #e0e0f0;border-radius:10px;padding:16px;text-align:center}
  .kpi-lbl{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px}
  .kpi-val{font-size:26px;font-weight:800}
  .green{color:#00b877}.red{color:#e0003c}.purple{color:#7c5cfc}.amber{color:#e08800}
  h2{font-size:16px;font-weight:700;margin:24px 0 14px;border-bottom:2px solid #f0f0ff;padding-bottom:8px}
  table{width:100%;border-collapse:collapse;font-size:12px;margin-bottom:28px}
  th{text-align:left;padding:8px 10px;background:#f8f8ff;color:#666;font-size:10px;text-transform:uppercase;letter-spacing:.08em;border-bottom:2px solid #e0e0f0}
  td{padding:9px 10px;border-bottom:1px solid #f0f0f8}
  tr:hover td{background:#fafaff}
  .badge{padding:2px 8px;border-radius:4px;font-size:10px;font-weight:600}
  .b-green{background:#e0fff2;color:#00b877}.b-red{background:#ffe0e6;color:#e0003c}.b-amber{background:#fff4e0;color:#e08800}
  .insights{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:28px}
  .ins{border:1px solid #e0e0f0;border-radius:8px;padding:12px;display:flex;gap:10px;align-items:flex-start}
  .footer{text-align:center;font-size:11px;color:#aaa;border-top:1px solid #f0f0f8;padding-top:18px;margin-top:28px}
  @media print{body{padding:20px}.header{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<div class="header">
  <h1>📊 Informe Diario — AI Commerce Ads Suite</h1>
  <p>Generado automáticamente el ${date} a las 20:00 hs · 5 campañas activas</p>
</div>
<div class="kpis">
  <div class="kpi"><div class="kpi-lbl">ROAS Promedio</div><div class="kpi-val green">3.8x</div></div>
  <div class="kpi"><div class="kpi-lbl">Leads WhatsApp</div><div class="kpi-val purple">342</div></div>
  <div class="kpi"><div class="kpi-lbl">CPC Promedio</div><div class="kpi-val">$0.52</div></div>
  <div class="kpi"><div class="kpi-lbl">Gasto Total</div><div class="kpi-val amber">$1,358</div></div>
</div>
<h2>🤖 Insights de IA</h2>
<div class="insights">
  <div class="ins"><span>🚀</span><div><strong>Gaming Carrusel:</strong> ROAS 5.8x → Aumentar presupuesto a $60/día</div></div>
  <div class="ins"><span>⏸️</span><div><strong>Ropa Invierno:</strong> CTR 1.9%, ROAS 1.2x → Pausar y reformular hook</div></div>
  <div class="ins"><span>🎯</span><div><strong>Audiencia:</strong> Mujeres 18-34 convierte 2.3x más → Aumentar bid</div></div>
  <div class="ins"><span>📱</span><div><strong>Formato:</strong> Reels generan 60% más leads que carruseles</div></div>
</div>
<h2>📣 Detalle de campañas</h2>
<table><thead><tr><th>Campaña</th><th>ROAS</th><th>CTR</th><th>CPC</th><th>Leads</th><th>Gasto</th><th>Estado</th></tr></thead>
<tbody>${rows}</tbody></table>
<h2>📋 Recomendaciones para mañana</h2>
<table><thead><tr><th>Acción</th><th>Campaña</th><th>Motivo</th></tr></thead><tbody>
<tr><td class="green">▲ Escalar</td><td>Tecnología gaming</td><td>ROAS 5.8x · presupuesto bajo</td></tr>
<tr><td class="red">⏸ Pausar</td><td>Ropa de invierno</td><td>ROAS 1.2x · CTR por debajo del umbral</td></tr>
<tr><td class="amber">✏ Editar hook</td><td>Bolsos importados</td><td>CTR 3.8% → puede mejorar</td></tr>
</tbody></table>
<div class="footer">AI Commerce Ads Suite · Informe generado automáticamente por IA · ${date}</div>
</body></html>`;
  const blob=new Blob([html],{type:"text/html"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url; a.download=`informe-${date.replace(/\//g,"-")}.html`;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

function DBReports() {
  const [downloading,setDownloading]=useState(false);
  const handlePDF=()=>{
    setDownloading(true);
    setTimeout(()=>{ generatePDF(CMPGS,{}); setDownloading(false); },600);
  };
  return (
    <div className="content fade-in">
      <div className="g4" style={{ marginBottom:18 }}>
        <MetricCard label="ROAS promedio" value="3.8x" change="+0.4x esta semana" up chart={[2,2.5,3,2.8,3.5,3.3,3.8]} color={C.green} />
        <MetricCard label="CPM promedio" value="$4.20" change="-$0.80 vs ant." up chart={[7,6.5,6,5.5,5,4.8,4.2]} color={C.blue} />
        <MetricCard label="Tasa conv. WA" value="23%" change="+5% vs mes ant." up chart={[12,14,17,19,20,21,23]} />
        <MetricCard label="Costo / lead" value="$1.80" change="-$0.40 vs mes ant." up chart={[3.5,3,2.8,2.4,2.2,2,1.8]} color={C.amber} />
      </div>
      <div className="g2" style={{ gap:16 }}>
        <div className="card">
          <div className="sh">
            <div><div className="sh-title">Informe diario — 20:00</div><div className="sh-sub">Generado automáticamente por IA</div></div>
            <button className="btn btn-g" style={{ fontSize:11,display:"flex",alignItems:"center",gap:5 }} onClick={handlePDF} disabled={downloading}>
              {downloading?<><span className="spinner"/>Generando...</>:"📥 Descargar PDF"}
            </button>
          </div>
          {[{i:"✅",t:"Gaming Carrusel: ROAS 5.8x → subir presupuesto",x:"tg"},{i:"⚠️",t:"Ropa Invierno: CTR 1.9% → reformular hook",x:"ta"},{i:"🚀",t:"Reels generan 60% más leads que carruseles",x:"tb"},{i:"💬",t:"342 leads WA esta semana (+28%)",x:"tg"}].map((ins,i)=>(
            <div key={i} className="insight"><span style={{ fontSize:15 }}>{ins.i}</span><div style={{ flex:1,fontSize:12,lineHeight:1.5 }}>{ins.t}</div><Tag t={ins.x}>{ins.x==="tg"?"Bien":ins.x==="ta"?"Atención":"Info"}</Tag></div>
          ))}
          <div style={{ marginTop:14,padding:"10px 12px",background:C.greenDim,border:`1px solid ${C.green}33`,borderRadius:8,fontSize:12,color:C.green }}>
            ✅ Próximo informe: hoy a las 20:00 hs · Se enviará por email automáticamente
          </div>
        </div>
        <div className="card">
          <div className="sh-title" style={{ marginBottom:13 }}>Rendimiento por campaña</div>
          {CMPGS.map(c=>(
            <div key={c.id} style={{ marginBottom:12 }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:12 }}><span style={{ fontWeight:500 }}>{c.name}</span><span style={{ color:C.green,fontFamily:"'DM Mono',monospace" }}>{c.roas}</span></div>
              <div className="prog-wrap"><div className="prog-bar" style={{ width:`${Math.min(100,parseFloat(c.roas)/6*100)}%`,background:parseFloat(c.roas)>=3?C.green:parseFloat(c.roas)>=2?C.amber:C.red }} /></div>
              <div style={{ display:"flex",justifyContent:"space-between",marginTop:2,fontSize:10,color:C.textMuted,fontFamily:"'DM Mono',monospace" }}><span>{c.leads} leads</span><span>CTR {c.ctr}</span><span>{c.spent}</span></div>
            </div>
          ))}
          <button className="btn btn-g" style={{ width:"100%",marginTop:10,fontSize:12 }} onClick={handlePDF}>
            📥 Descargar informe completo
          </button>
        </div>
      </div>
    </div>
  );
}

// ── CREATIVE STUDIO (Creatify-like) ─────────────────────────────────────────
const AVATARS=[
  {id:"a1",name:"Sofía",style:"Presentadora",emoji:"👩",bg:"linear-gradient(135deg,#1a0a2e,#2d1555)"},
  {id:"a2",name:"Marcos",style:"Vendedor",emoji:"👨",bg:"linear-gradient(135deg,#0a1a2e,#1535ab)"},
  {id:"a3",name:"Valentina",style:"Influencer",emoji:"👩‍🦰",bg:"linear-gradient(135deg,#2e0a1a,#ab1535)"},
  {id:"a4",name:"Sin avatar",style:"Solo producto",emoji:"📦",bg:"linear-gradient(135deg,#0a2e0a,#1a8020)"},
];
const TEMPLATES=[
  {id:"t1",name:"Hook urgencia",fmt:"9:16",bg:"linear-gradient(135deg,#1a0528,#3d0f6b)",preview:"🎬"},
  {id:"t2",name:"Oferta limitada",fmt:"9:16",bg:"linear-gradient(135deg,#280505,#6b0f0f)",preview:"🔥"},
  {id:"t3",name:"Unboxing",fmt:"9:16",bg:"linear-gradient(135deg,#05281a,#0f6b3d)",preview:"📦"},
  {id:"t4",name:"Comparativa",fmt:"1:1",bg:"linear-gradient(135deg,#050528,#0f1a6b)",preview:"⚡"},
  {id:"t5",name:"Testimonial",fmt:"4:5",bg:"linear-gradient(135deg,#281a05,#6b4f0f)",preview:"⭐"},
  {id:"t6",name:"Producto hero",fmt:"1:1",bg:"linear-gradient(135deg,#1a0528,#6b0f5b)",preview:"✨"},
];
const MUSIC_LIST=["🎵 Trending pop","🎸 Energético","🎹 Minimal","💫 Motivacional","🔇 Sin música"];
const VOICE_LIST=["Femenina — Natural","Masculina — Profesional","Neutra","Femenina — Joven"];

function CreativeStudio({onAttach,creatives,setCreatives}){
  const [selTpl,setSelTpl]=useState("t1");
  const [selAv,setSelAv]=useState("a1");
  const [music,setMusic]=useState(0);
  const [voice,setVoice]=useState(0);
  const [script,setScript]=useState("");
  const [hook,setHook]=useState("");
  const [product,setProduct]=useState("");
  const [fmt,setFmt]=useState("9:16");
  const [genScript,setGenScript]=useState(false);
  const [generating,setGenerating]=useState(false);
  const [progress,setProgress]=useState(0);
  const [done,setDone]=useState(null);
  const tpl=TEMPLATES.find(t=>t.id===selTpl)||TEMPLATES[0];
  const av=AVATARS.find(a=>a.id===selAv)||AVATARS[0];

  const makeScript=async()=>{
    if(!product.trim()) return;
    setGenScript(true);
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:300,
          messages:[{role:"user",content:`Generá un script corto (15 seg) para video ad Meta Ads.
Producto: ${product}. Estilo: ${tpl.name}. Formato: ${fmt}.
Incluí: hook de 3 palabras impactantes, beneficio, urgencia, CTA a WhatsApp.
Máximo 50 palabras. Solo el script listo, sin explicaciones.`}]})});
      const d=await r.json();
      const txt=d.content?.[0]?.text||"";
      setScript(txt);
      setHook(txt.split(/[.!\n]/)[0]?.slice(0,30)||"Hook aquí");
    }catch{
      setScript("¿Todavía pagás de más?\nConseguí el tuyo ahora.\nSolo por hoy. ¡Escribinos por WhatsApp!");
      setHook("¿Todavía pagás de más?");
    }
    setGenScript(false);
  };

  const generate=async()=>{
    setGenerating(true);setProgress(0);setDone(null);
    for(const p of[10,25,45,65,82,95,100]){
      await new Promise(r=>setTimeout(r,280));setProgress(p);
    }
    const nc={id:`cr${Date.now()}`,name:`${product||"Producto"} — ${tpl.name}`,fmt,type:fmt!=="1:1"?"video":"image",
      status:"listo",ctr:"—",bg:tpl.bg,icon:tpl.preview,hook:hook||"Hook viral",
      avatar:av.name,template:tpl.name,platform:fmt==="9:16"?"reels":fmt==="4:5"?"stories":"feed"};
    setCreatives(p=>[nc,...p]);setDone(nc);setGenerating(false);
  };

  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"220px 1fr 260px",gap:0,background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden",height:520}}>
        {/* Left: Templates */}
        <div style={{background:C.surface,borderRight:`1px solid ${C.border}`,overflowY:"auto"}}>
          <div style={{fontSize:10,color:C.textMuted,fontFamily:"'DM Mono',monospace",textTransform:"uppercase",padding:"12px 12px 7px",letterSpacing:".1em"}}>Plantillas</div>
          <div style={{padding:"0 8px 10px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
            {TEMPLATES.map(t=>(
              <div key={t.id} onClick={()=>{setSelTpl(t.id);setFmt(t.fmt);}} style={{border:`1.5px solid ${selTpl===t.id?C.accent:C.border}`,borderRadius:8,overflow:"hidden",cursor:"pointer",transition:"all .15s",boxShadow:selTpl===t.id?`0 0 0 2px ${C.accent}33`:"none"}}>
                <div style={{background:t.bg,aspectRatio:"4/3",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{t.preview}</div>
                <div style={{padding:"5px 7px"}}><div style={{fontSize:10,fontWeight:500}}>{t.name}</div><div style={{fontSize:9,color:C.textMuted,fontFamily:"'DM Mono',monospace"}}>{t.fmt}</div></div>
              </div>
            ))}
          </div>
          <div style={{fontSize:10,color:C.textMuted,fontFamily:"'DM Mono',monospace",textTransform:"uppercase",padding:"8px 12px 7px",letterSpacing:".1em",borderTop:`1px solid ${C.border}`}}>Avatares IA</div>
          <div style={{padding:"0 8px 10px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
            {AVATARS.map(a=>(
              <div key={a.id} onClick={()=>setSelAv(a.id)} style={{border:`1.5px solid ${selAv===a.id?C.accent:C.border}`,borderRadius:8,padding:8,textAlign:"center",cursor:"pointer",background:selAv===a.id?C.accentDim:"transparent",transition:"all .15s"}}>
                <div style={{fontSize:22,marginBottom:3}}>{a.emoji}</div>
                <div style={{fontSize:10,fontWeight:500}}>{a.name}</div>
                <div style={{fontSize:9,color:C.textMuted}}>{a.style}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Center: Preview */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,background:C.bg,gap:12}}>
          <div style={{background:tpl.bg,width:"100%",maxWidth:fmt==="9:16"?170:fmt==="4:5"?220:240,aspectRatio:fmt.replace(":","/"),borderRadius:10,position:"relative",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:8,boxShadow:"0 20px 60px #0009",overflow:"hidden"}}>
            <div style={{fontSize:38}}>{tpl.preview}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,.9)",fontFamily:"'Syne',sans-serif",fontWeight:700,textAlign:"center",padding:"0 12px",lineHeight:1.3}}>{hook||"Tu hook aquí"}</div>
            {av.id!=="a4"&&<div style={{fontSize:24}}>{av.emoji}</div>}
            <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"10px 10px 8px",background:"linear-gradient(to top,#000c,transparent)"}}>
              <div style={{fontSize:10,color:"rgba(255,255,255,.8)",fontWeight:600,textAlign:"center"}}>💬 Escribinos por WhatsApp</div>
            </div>
          </div>
          {generating&&(
            <div style={{width:"100%",maxWidth:240}}>
              <div style={{fontSize:11,color:C.textMuted,marginBottom:6,textAlign:"center"}}>Generando… {progress}%</div>
              <div style={{background:C.border,borderRadius:3,height:4,overflow:"hidden"}}><div style={{height:4,borderRadius:3,background:C.grad,width:`${progress}%`,transition:"width .25s ease"}}/></div>
              <div style={{fontSize:10,color:C.textDim,textAlign:"center",marginTop:5,fontFamily:"'DM Mono',monospace"}}>{progress<40?"Procesando template…":progress<75?"Renderizando con IA…":"¡Casi listo!"}</div>
            </div>
          )}
          {done&&!generating&&(
            <div style={{background:C.greenDim,border:`1px solid ${C.green}33`,borderRadius:9,padding:"9px 13px",textAlign:"center",maxWidth:240,width:"100%"}}>
              <div style={{fontSize:12,color:C.green,fontWeight:600,marginBottom:7}}>✅ Creativo listo</div>
              <div style={{display:"flex",gap:7,justifyContent:"center"}}>
                <button className="btn btn-green btn-sm" onClick={()=>onAttach(done)}>📎 Adjuntar</button>
                <button className="btn btn-g btn-sm">📥 Bajar</button>
              </div>
            </div>
          )}
        </div>
        {/* Right: Config */}
        <div style={{background:C.surface,borderLeft:`1px solid ${C.border}`,overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:10}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:13}}>Configuración</div>
          <div className="fg"><label className="flbl">Producto</label><input className="finput" placeholder="ej. Nike Air Max" value={product} onChange={e=>setProduct(e.target.value)} style={{fontSize:12}}/></div>
          <div className="fg">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
              <label className="flbl">Script IA</label>
              <button onClick={makeScript} disabled={genScript||!product.trim()} style={{fontSize:10,padding:"2px 8px",borderRadius:5,border:`1px solid ${C.accent}44`,background:C.accentDim,color:C.accent,cursor:"pointer"}}>
                {genScript?<span className="spinner" style={{width:10,height:10}}/>:"✨ Generar"}
              </button>
            </div>
            <textarea className="ftxt" style={{minHeight:70,fontSize:11}} placeholder="Script generado por IA…" value={script} onChange={e=>setScript(e.target.value)}/>
          </div>
          <div className="fg"><label className="flbl">Hook superpuesto</label><input className="finput" placeholder="¿Todavía pagás de más?" value={hook} onChange={e=>setHook(e.target.value)} style={{fontSize:12}}/></div>
          <div style={{display:"flex",gap:5}}>
            {["9:16","4:5","1:1"].map(f=>(
              <button key={f} onClick={()=>setFmt(f)} style={{flex:1,padding:"5px 2px",borderRadius:7,border:`1.5px solid ${fmt===f?C.accent:C.border}`,background:fmt===f?C.accentDim:"transparent",color:fmt===f?C.accent:C.textMuted,cursor:"pointer",fontSize:11,fontFamily:"'DM Mono',monospace"}}>{f}</button>
            ))}
          </div>
          <div className="fg"><label className="flbl">Música</label><select className="fsel" style={{fontSize:11}} value={music} onChange={e=>setMusic(+e.target.value)}>{MUSIC_LIST.map((m,i)=><option key={i} value={i}>{m}</option>)}</select></div>
          <div className="fg"><label className="flbl">Voz avatar</label><select className="fsel" style={{fontSize:11}} value={voice} onChange={e=>setVoice(+e.target.value)}>{VOICE_LIST.map((v,i)=><option key={i} value={i}>{v}</option>)}</select></div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"7px 9px",background:C.bg,borderRadius:7,fontSize:11}}>
            <span>Subtítulos auto</span><button className="tog on"/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"7px 9px",background:C.bg,borderRadius:7,fontSize:11}}>
            <span>CTA WhatsApp</span><button className="tog on"/>
          </div>
          <button onClick={generate} disabled={generating} style={{width:"100%",padding:"11px",fontSize:13,fontWeight:600,background:generating?C.border:C.grad,color:"#fff",border:"none",borderRadius:9,cursor:generating?"not-allowed":"pointer",marginTop:4,transition:"all .15s",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
            {generating?<><span className="spinner" style={{borderTopColor:"#fff"}}/>{progress}%</>:"🎬 Generar creativo"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── CREATIVOS IA PAGE ──────────────────────────────────────────────────────────
const MOCK_CREATIVES=[
  {id:"c1",name:"Reel Nike Air — Hook urgencia",fmt:"9:16",type:"video",status:"listo",ctr:"4.8%",icon:"🎬",bg:"linear-gradient(135deg,#0d1b2a,#1a2a40)",hook:"¿Todavía pagás de más?",platform:"reels"},
  {id:"c2",name:"Story bolsos — Precio gancho",fmt:"9:16",type:"video",status:"listo",ctr:"3.2%",icon:"👜",bg:"linear-gradient(135deg,#1a0a0d,#2a1015)",hook:"Solo por hoy 40% OFF",platform:"stories"},
  {id:"c3",name:"Feed gaming — Carrusel",fmt:"1:1",type:"image",status:"generando",icon:"🎮",bg:"linear-gradient(135deg,#0a1a0a,#102010)",platform:"feed"},
  {id:"c4",name:"Reel zapatillas — Trending",fmt:"9:16",type:"video",status:"listo",ctr:"5.1%",icon:"👟",bg:"linear-gradient(135deg,#1a1a0a,#2a2a10)",hook:"El par que todos buscan",platform:"reels"},
  {id:"c5",name:"Story ropa invierno",fmt:"4:5",type:"image",status:"listo",ctr:"2.9%",icon:"🧥",bg:"linear-gradient(135deg,#0d0d1a,#151525)",platform:"stories"},
  {id:"c6",name:"Feed tech — Oferta",fmt:"1:1",type:"image",status:"borrador",icon:"💻",bg:"linear-gradient(135deg,#1a0d1a,#251025)",platform:"feed"},
];

function DBCreatives() {
  const [tab,setTab]=useState("studio");
  const [creatives,setCreatives]=useState(MOCK_CREATIVES);
  const [filter,setFilter]=useState("todos");
  const [attachModal,setAttachModal]=useState(null);
  const [toast,setToast]=useState("");

  const showToast=(m)=>{setToast(m);setTimeout(()=>setToast(""),3200);};
  const handleAttach=(c)=>setAttachModal(c);
  const confirmAttach=(campId)=>{
    const camp=CMPGS.find(c=>c.id===campId);
    setAttachModal(null);
    showToast(`✅ "${attachModal.name}" adjuntado a "${camp?.name}"`);
  };

  const filtered=creatives.filter(c=>filter==="todos"||c.platform===filter);

  return (
    <div className="content fade-in">
      {toast&&<div style={{position:"fixed",top:16,right:16,background:C.green,color:"#fff",padding:"10px 18px",borderRadius:10,fontSize:13,fontWeight:500,zIndex:999,boxShadow:"0 4px 20px #0006"}}>{toast}</div>}
      <div className="g4" style={{marginBottom:18}}>
        {[["🎨","Creativos",creatives.length],["📊","CTR prom.","4.3%"],["🏆","Top formato","Reels 9:16"],["⚡","Hoy generados","6"]].map(([icon,lbl,val])=>(
          <div key={lbl} className="card card-sm" style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:22}}>{icon}</span>
            <div><div className="m-lbl">{lbl}</div><div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:18,marginTop:2}}>{val}</div></div>
          </div>
        ))}
      </div>
      {/* Tabs */}
      <div className="auth-tabs" style={{marginBottom:18}}>
        {[["studio","🎬 Studio IA"],["gallery","🖼️ Galería"]].map(([id,lbl])=>(
          <button key={id} className={`auth-tab${tab===id?" active":""}`} onClick={()=>setTab(id)}>{lbl}</button>
        ))}
      </div>
      {tab==="studio"&&<CreativeStudio onAttach={handleAttach} creatives={creatives} setCreatives={setCreatives}/>}
      {tab==="gallery"&&(
        <div>
          <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
            {[["todos","Todos"],["reels","Reels 9:16"],["stories","Stories"],["feed","Feed 1:1"]].map(([id,lbl])=>(
              <button key={id} onClick={()=>setFilter(id)} style={{padding:"5px 13px",borderRadius:20,fontSize:12,border:`1px solid ${filter===id?C.accent:C.border}`,background:filter===id?C.accentDim:"transparent",color:filter===id?C.accent:C.textMuted,cursor:"pointer",transition:"all .15s"}}>{lbl}</button>
            ))}
            <button className="btn btn-p btn-sm" style={{marginLeft:"auto"}} onClick={()=>setTab("studio")}>+ Nuevo en Studio</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:12}}>
            {filtered.map(c=>(
              <div key={c.id} style={{background:C.surface,border:`1.5px solid ${c.status==="generando"?C.amber:C.border}`,borderRadius:10,overflow:"hidden",cursor:"pointer",transition:"all .2s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor=C.accent}
                onMouseLeave={e=>e.currentTarget.style.borderColor=c.status==="generando"?C.amber:C.border}>
                <div style={{background:c.bg,aspectRatio:c.fmt==="9:16"?"9/16":c.fmt==="4:5"?"4/5":"1",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:5,position:"relative",minHeight:100}}>
                  {c.status==="generando"&&<div style={{position:"absolute",inset:0,background:"#000a",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:5}}><span className="spinner" style={{width:18,height:18}}/><div style={{fontSize:9,color:"#fff",fontFamily:"'DM Mono',monospace"}}>Generando…</div></div>}
                  <span style={{fontSize:26}}>{c.icon}</span>
                  {c.hook&&<div style={{fontSize:9,color:"rgba(255,255,255,.75)",padding:"2px 7px",background:"rgba(0,0,0,.45)",borderRadius:4,maxWidth:"86%",textAlign:"center",lineHeight:1.3}}>"{c.hook}"</div>}
                  <span style={{fontSize:8,color:"rgba(255,255,255,.35)",fontFamily:"'DM Mono',monospace"}}>{c.fmt}</span>
                </div>
                <div style={{padding:"9px 10px"}}>
                  <div style={{fontSize:11,fontWeight:500,marginBottom:5,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                    <Tag t={c.status==="listo"?"tg":c.status==="generando"?"ta":"tb"}>{c.status}</Tag>
                    {c.ctr&&<span style={{fontSize:10,color:C.textMuted,fontFamily:"'DM Mono',monospace"}}>CTR {c.ctr}</span>}
                  </div>
                  <button className="btn btn-g" style={{width:"100%",fontSize:11,padding:"5px",border:`1px solid ${C.accent}44`,color:C.accent,background:C.accentDim}} onClick={()=>handleAttach(c)}>
                    📎 Adjuntar a campaña
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Attach modal */}
      {attachModal&&(
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setAttachModal(null)}>
          <div className="modal modal-sm sci">
            <div className="modal-head"><div className="modal-title">Adjuntar a campaña</div><button className="close-btn" onClick={()=>setAttachModal(null)}>✕</button></div>
            <div className="modal-body">
              <div style={{fontSize:13,color:C.textMuted,marginBottom:14}}>Adjuntando: <strong style={{color:C.text}}>"{attachModal.name}"</strong></div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {CMPGS.map(camp=>(
                  <div key={camp.id} onClick={()=>confirmAttach(camp.id)} style={{padding:"11px 13px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:9,cursor:"pointer",transition:"all .15s",display:"flex",justifyContent:"space-between",alignItems:"center"}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=C.accent}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                    <div><div style={{fontSize:13,fontWeight:500,marginBottom:2}}>{camp.name}</div><div style={{fontSize:11,color:C.textMuted}}>ROAS {camp.roas} · {camp.leads} leads</div></div>
                    <Tag t={camp.status==="activa"?"tg":camp.status==="pausada"?"tr":"ta"}>{camp.status}</Tag>
                  </div>
                ))}
                <div onClick={()=>{setAttachModal(null);showToast(`✅ "${attachModal.name}" guardado para próxima campaña`);}} style={{padding:"10px 13px",background:C.accentDim,border:`1.5px dashed ${C.accent}44`,borderRadius:9,cursor:"pointer",textAlign:"center",fontSize:13,color:C.accent}}>
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
  const [filter,setFilter]=useState("todos");
  const [generating,setGenerating]=useState(false);
  const [generatedCount,setGeneratedCount]=useState(0);
  const [urlInput,setUrlInput]=useState("");
  const [analyzing,setAnalyzing]=useState(false);
  const [aiResult,setAiResult]=useState(null);
  const [learnedPatterns,setLearnedPatterns]=useState([
    {platform:"TikTok",url:"https://tiktok.com/@brand/video/...",hook:"¿Todavía pagás de más?",style:"Transición rápida + texto grande",date:"Hace 2 días"},
    {platform:"Meta Ad Library",url:"https://facebook.com/ads/library/...",hook:"Últimas unidades disponibles",style:"UGC + subtítulos animados",date:"Hace 5 días"},
  ]);

  const detectPlatform=(url)=>{
    if(url.includes("tiktok")) return {name:"TikTok",icon:"🎵",color:"#ff0050"};
    if(url.includes("instagram")||url.includes("reels")) return {name:"Instagram Reels",icon:"📸",color:"#e1306c"};
    if(url.includes("facebook")||url.includes("fb.com")) return {name:"Facebook / Meta Ad Library",icon:"📘",color:"#4da6ff"};
    if(url.includes("pinterest")) return {name:"Pinterest",icon:"📌",color:"#e60023"};
    if(url.includes("canva")) return {name:"Canva",icon:"🎨",color:"#7c5cfc"};
    if(url.includes("youtube")) return {name:"YouTube Shorts",icon:"▶️",color:"#ff4d4d"};
    return {name:"URL externa",icon:"🔗",color:C.textMuted};
  };

  const analyzeURL=async()=>{
    if(!urlInput.trim()) return;
    setAnalyzing(true); setAiResult(null);
    const platform=detectPlatform(urlInput.toLowerCase());
    try {
      const resp=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:700,
          messages:[{role:"user",content:`Soy una plataforma de Meta Ads para ecommerce latinoamericano.
El usuario pegó esta URL de ${platform.name}: ${urlInput}

Analizá qué patrones virales tendría este tipo de contenido publicitario en ${platform.name} para venta de productos físicos.
Generá un análisis en JSON:
{
  "hook": "hook viral detectado o sugerido (máx 12 palabras)",
  "style": "descripción del estilo visual en 1 línea",
  "editing": "técnica de edición clave (ej: zoom rápido, texto animado, transición)",
  "cta": "llamada a la acción detectada",
  "audience": "audiencia ideal para este tipo de contenido",
  "apply_to": ["campaña tipo 1","campaña tipo 2"],
  "viral_score": 85,
  "lesson": "1 aprendizaje clave para replicar en nuestras campañas"
}
Solo JSON, sin texto adicional.`}]}),
      });
      const data=await resp.json();
      const txt=data.content?.[0]?.text||"{}";
      const parsed=JSON.parse(txt.replace(/```json|```/g,"").trim());
      setAiResult({...parsed,platform:platform.name,url:urlInput});
    } catch(e){
      setAiResult({hook:"Análisis completado",style:"Patrón visual de alto impacto detectado",editing:"Transiciones rápidas + texto grande","cta":"Escribinos por WhatsApp",audience:"18-35 compradores online",apply_to:["Ropa","Accesorios"],viral_score:78,lesson:"Usar texto en pantalla en los primeros 2 segundos para captar atención",platform:platform.name,url:urlInput});
    }
    setAnalyzing(false);
  };

  const savePattern=()=>{
    if(!aiResult) return;
    setLearnedPatterns(p=>[{platform:aiResult.platform,url:aiResult.url,hook:aiResult.hook,style:aiResult.style,date:"Ahora"},...p]);
    setAiResult(null); setUrlInput("");
  };

  const filtered=MOCK_CREATIVES.filter(c=>filter==="todos"||c.platform===filter||(filter==="generando"&&c.status==="generando"));

  const doGenerate=()=>{
    setGenerating(true);
    setTimeout(()=>{setGenerating(false);setGeneratedCount(p=>p+3);},2800);
  };

  return (
    <div className="content fade-in">
      {/* Stats */}
      <div className="g4" style={{ marginBottom:18 }}>
        {[["🎨","Creativos activos","24+"+generatedCount],["📊","CTR promedio","3.9%"],["🏆","Mejor formato","Reels 9:16"],["⚡","Generados este mes","48+"+generatedCount]].map(([icon,lbl,val],i)=>(
          <div key={i} className="card card-sm" style={{ display:"flex",alignItems:"center",gap:10 }}>
            <span style={{ fontSize:22 }}>{icon}</span>
            <div><div className="m-lbl">{lbl}</div><div style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:18,marginTop:2 }}>{val}</div></div>
          </div>
        ))}
      </div>

      {/* AI URL Feeder */}
      <div className="card" style={{ marginBottom:18,border:`1px solid ${C.accent}44`,background:`${C.accent}08` }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:14 }}>
          <span style={{ fontSize:20 }}>🧠</span>
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14 }}>Nutrir IA con contenido viral</div>
            <div style={{ fontSize:12,color:C.textMuted }}>Pegá URLs de TikTok, Instagram Reels, Meta Ad Library, Pinterest o Canva</div>
          </div>
          <div style={{ marginLeft:"auto",display:"flex",gap:5 }}>
            {["🎵 TikTok","📸 IG Reels","📘 Meta Ads","📌 Pinterest","🎨 Canva"].map((p,i)=>(
              <span key={i} style={{ fontSize:10,background:C.surface2,border:`1px solid ${C.border}`,borderRadius:5,padding:"2px 7px",color:C.textMuted }}>{p}</span>
            ))}
          </div>
        </div>
        <div style={{ display:"flex",gap:10,marginBottom:aiResult?14:0 }}>
          <input className="finput" placeholder="https://www.tiktok.com/@usuario/video/... o pega cualquier URL de contenido viral"
            value={urlInput} onChange={e=>setUrlInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&analyzeURL()}
            style={{ flex:1 }} />
          <button className="btn btn-p" onClick={analyzeURL} disabled={analyzing||!urlInput.trim()} style={{ whiteSpace:"nowrap" }}>
            {analyzing?<><span className="spinner" style={{ borderTopColor:"#fff" }}/>Analizando...</>:"🔍 Analizar con IA"}
          </button>
        </div>
        {aiResult&&(
          <div style={{ background:C.surface2,border:`1px solid ${C.accent}33`,borderRadius:10,padding:14,animation:"fadeUp .2s ease" }}>
            <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:12 }}>
              <span style={{ fontSize:16 }}>✨</span>
              <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:13 }}>Análisis completado — {aiResult.platform}</div>
              <div style={{ marginLeft:"auto",background:C.greenDim,border:`1px solid ${C.green}33`,borderRadius:6,padding:"2px 9px",fontSize:11,color:C.green,fontFamily:"'DM Mono',monospace" }}>
                Viral Score: {aiResult.viral_score}/100
              </div>
            </div>
            <div className="g2" style={{ gap:10,marginBottom:12 }}>
              {[["🎣 Hook viral",aiResult.hook],["🎬 Estilo",aiResult.style],["✂️ Edición",aiResult.editing],["📢 CTA",aiResult.cta],["🎯 Audiencia",aiResult.audience],["💡 Aprendizaje",aiResult.lesson]].map(([k,v],i)=>(
                <div key={i} style={{ background:C.bg,borderRadius:8,padding:"9px 11px",border:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:10,color:C.textMuted,marginBottom:3 }}>{k}</div>
                  <div style={{ fontSize:12,color:C.text,lineHeight:1.4 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex",gap:10 }}>
              <button className="btn btn-p" style={{ fontSize:12 }} onClick={savePattern}>💾 Guardar patrón en la IA</button>
              <button className="btn btn-g" style={{ fontSize:12 }} onClick={()=>setAiResult(null)}>Descartar</button>
            </div>
          </div>
        )}
      </div>

      {/* Learned patterns */}
      {learnedPatterns.length>0&&(
        <div className="card" style={{ marginBottom:18 }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12 }}>
            <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:13 }}>🧠 Patrones aprendidos ({learnedPatterns.length})</div>
            <Tag t="tg">Activos en IA</Tag>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
            {learnedPatterns.map((p,i)=>(
              <div key={i} style={{ display:"flex",gap:12,alignItems:"center",padding:"9px 12px",background:C.surface2,borderRadius:8,border:`1px solid ${C.border}` }}>
                <span style={{ fontSize:16 }}>{p.platform.includes("TikTok")?"🎵":p.platform.includes("Instagram")?"📸":p.platform.includes("Meta")||p.platform.includes("Facebook")?"📘":p.platform.includes("Pinterest")?"📌":"🎨"}</span>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontSize:12,fontWeight:500,marginBottom:2 }}>"{p.hook}"</div>
                  <div style={{ fontSize:11,color:C.textMuted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{p.style} · {p.platform}</div>
                </div>
                <div style={{ fontSize:10,color:C.textDim,fontFamily:"'DM Mono',monospace",whiteSpace:"nowrap" }}>{p.date}</div>
                <button className="btn btn-g" style={{ fontSize:10,padding:"3px 8px" }} onClick={()=>setLearnedPatterns(prev=>prev.filter((_,j)=>j!==i))}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter + Generate */}
      <div style={{ display:"flex",gap:10,marginBottom:14,flexWrap:"wrap",alignItems:"center" }}>
        {[["todos","Todos"],["reels","Reels 9:16"],["stories","Stories 4:5"],["feed","Feed 1:1"],["generando","Generando"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setFilter(id)} style={{ padding:"5px 13px",borderRadius:20,fontSize:12,border:`1px solid ${filter===id?C.accent:C.border}`,background:filter===id?C.accentDim:"transparent",color:filter===id?C.accent:C.textMuted,cursor:"pointer",transition:"all .15s" }}>{lbl}</button>
        ))}
        <button className="btn btn-p" style={{ marginLeft:"auto",fontSize:12 }} onClick={doGenerate} disabled={generating}>
          {generating?<><span className="spinner" style={{ borderTopColor:"#fff" }}/>Generando...</>:"✨ Generar nuevos creativos"}
        </button>
      </div>

      {/* Creatives grid */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:14 }}>
        {filtered.map(c=>(
          <div key={c.id} style={{ background:C.surface,border:`1.5px solid ${c.status==="generando"?C.amber:C.border}`,borderRadius:10,overflow:"hidden",cursor:"pointer",transition:"all .2s" }}
            onMouseEnter={e=>e.currentTarget.style.borderColor=C.accent}
            onMouseLeave={e=>e.currentTarget.style.borderColor=c.status==="generando"?C.amber:C.border}>
            <div style={{ background:c.bg,aspectRatio:c.fmt==="9:16"?"9/16":c.fmt==="4:5"?"4/5":"1",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:6,position:"relative",minHeight:120 }}>
              {c.status==="generando"&&(
                <div style={{ position:"absolute",inset:0,background:"#00000066",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:6 }}>
                  <div className="spinner" style={{ width:20,height:20 }}/>
                  <div style={{ fontSize:9,color:"#fff",fontFamily:"'DM Mono',monospace" }}>Generando…</div>
                </div>
              )}
              <span style={{ fontSize:28 }}>{c.icon}</span>
              <div style={{ fontFamily:"'DM Mono',monospace",fontSize:9,color:"rgba(255,255,255,.5)" }}>{c.fmt}</div>
              {c.hook&&<div style={{ fontSize:9,color:"rgba(255,255,255,.7)",padding:"2px 8px",background:"rgba(0,0,0,.4)",borderRadius:4,maxWidth:"90%",textAlign:"center",lineHeight:1.3 }}>"{c.hook}"</div>}
            </div>
            <div style={{ padding:"9px 11px" }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3 }}>
                <div style={{ fontSize:11,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1 }}>{c.name}</div>
              </div>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <Tag t={c.status==="listo"?"tg":c.status==="generando"?"ta":"tb"}>{c.status}</Tag>
                {c.ctr&&<span style={{ fontSize:10,color:C.textMuted,fontFamily:"'DM Mono',monospace" }}>CTR {c.ctr}</span>}
              </div>
            </div>
          </div>
        ))}
        {/* Generate placeholder */}
        {generating&&[1,2,3].map(i=>(
          <div key={`gen${i}`} style={{ background:C.surface,border:`1.5px dashed ${C.accent}44`,borderRadius:10,overflow:"hidden" }}>
            <div style={{ aspectRatio:"9/16",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:8,minHeight:120 }}>
              <div className="spinner" style={{ width:22,height:22 }}/>
              <div style={{ fontSize:9,color:C.textMuted,fontFamily:"'DM Mono',monospace" }}>IA generando…</div>
            </div>
            <div style={{ padding:"9px 11px" }}><div style={{ background:C.border,borderRadius:4,height:10,marginBottom:6 }}/><div style={{ background:C.border,borderRadius:4,height:8,width:"60%" }}/></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── BILLING PAGE (USUARIO) ─────────────────────────────────────────────────────
function DBBilling({ user }) {
  const plan=user?.plan||"growth";
  const price=plan==="starter"?49:plan==="scale"?199:99;
  const planColor=plan==="starter"?C.green:plan==="scale"?C.blue:C.accent;
  const [showUpgrade,setShowUpgrade]=useState(false);

  const invoices=[
    {id:"INV-2026-005",date:"01/05/2026",amount:price,status:"pagado",period:"Mayo 2026"},
    {id:"INV-2026-004",date:"01/04/2026",amount:price,status:"pagado",period:"Abril 2026"},
    {id:"INV-2026-003",date:"01/03/2026",amount:price,status:"pagado",period:"Marzo 2026"},
    {id:"INV-2026-002",date:"01/02/2026",amount:price,status:"pagado",period:"Febrero 2026"},
    {id:"INV-2026-001",date:"01/01/2026",amount:0,status:"gratis",period:"Enero 2026 (prueba)"},
  ];

  const downloadInvoice=(inv)=>{
    const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Factura ${inv.id}</title>
<style>body{font-family:Arial,sans-serif;padding:40px;color:#1a1a2e;max-width:600px;margin:0 auto}
.header{border-bottom:3px solid #7c5cfc;padding-bottom:20px;margin-bottom:24px}
h1{color:#7c5cfc;font-size:22px;margin:0 0 4px}.sub{color:#888;font-size:13px}
.row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:14px}
.total{font-weight:700;font-size:16px;color:#7c5cfc;border-top:2px solid #7c5cfc;margin-top:8px}
.badge{display:inline-block;background:#e0fff2;color:#00b877;padding:3px 10px;border-radius:4px;font-size:12px;font-weight:600}</style></head>
<body><div class="header"><h1>AI Commerce Ads Suite</h1><div class="sub">Factura / Recibo de pago</div></div>
<div class="row"><span>Número de factura</span><strong>${inv.id}</strong></div>
<div class="row"><span>Fecha de emisión</span><span>${inv.date}</span></div>
<div class="row"><span>Período</span><span>${inv.period}</span></div>
<div class="row"><span>Cliente</span><span>${user?.name||"Cliente"}</span></div>
<div class="row"><span>Plan</span><span>${plan.charAt(0).toUpperCase()+plan.slice(1)}</span></div>
<div class="row"><span>Estado</span><span><span class="badge">${inv.status}</span></span></div>
<div class="row total"><span>Total</span><span>$${inv.amount} USD</span></div>
<p style="font-size:12px;color:#aaa;margin-top:24px">Gracias por usar AI Commerce Ads Suite · soporte@aicommerceads.com</p>
</body></html>`;
    const blob=new Blob([html],{type:"text/html"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a"); a.href=url; a.download=`${inv.id}.html`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  return (
    <div className="content fade-in">
      {/* Current plan */}
      <div className="g2" style={{ marginBottom:18 }}>
        <div className="card" style={{ border:`1.5px solid ${planColor}44`,background:`${planColor}08` }}>
          <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14 }}>
            <div>
              <div style={{ fontSize:11,color:C.textMuted,fontFamily:"'DM Mono',monospace",textTransform:"uppercase",marginBottom:4 }}>Plan activo</div>
              <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:planColor }}>{plan.charAt(0).toUpperCase()+plan.slice(1)}</div>
              <div style={{ fontFamily:"'DM Mono',monospace",fontSize:18,fontWeight:700,marginTop:2 }}>${price}<span style={{ fontSize:13,color:C.textMuted }}>/mes</span></div>
            </div>
            <Tag t={plan==="starter"?"tg":plan==="scale"?"tb":"tp"}>{plan}</Tag>
          </div>
          <div style={{ borderTop:`1px solid ${planColor}22`,paddingTop:12,marginBottom:14 }}>
            {[["Próximo cobro","01/06/2026"],["Método de pago","•••• •••• •••• 4242"],["Estado","Al día ✓"],["Miembro desde","Enero 2026"]].map(([k,v],i)=>(
              <div key={i} style={{ display:"flex",justifyContent:"space-between",fontSize:13,padding:"5px 0",borderBottom:`1px solid ${planColor}11` }}>
                <span style={{ color:C.textMuted }}>{k}</span>
                <span style={{ fontWeight:500,color:i===2?C.green:C.text }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display:"flex",gap:8 }}>
            {plan!=="scale"&&<button className="btn btn-p" style={{ fontSize:12,flex:1 }} onClick={()=>setShowUpgrade(true)}>⬆️ Mejorar plan</button>}
            <button className="btn btn-g" style={{ fontSize:12,flex:1 }}>⚙️ Gestionar suscripción</button>
          </div>
        </div>
        <div className="card">
          <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:600,marginBottom:14 }}>Uso del plan</div>
          {[
            {lbl:"Campañas activas",used:12,max:plan==="starter"?20:null,icon:"📣"},
            {lbl:"Creativos generados",used:48,max:plan==="starter"?50:null,icon:"🎨"},
            {lbl:"Cuentas Meta",used:1,max:plan==="starter"?1:plan==="growth"?3:10,icon:"📘"},
            {lbl:"Leads WA este mes",used:342,max:null,icon:"💬"},
          ].map((item,i)=>(
            <div key={i} style={{ marginBottom:13 }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:12 }}>
                <span>{item.icon} {item.lbl}</span>
                <span style={{ fontFamily:"'DM Mono',monospace",color:item.max&&item.used/item.max>0.8?C.amber:C.text }}>
                  {item.used}{item.max?`/${item.max}`:" ✓"}
                </span>
              </div>
              <div className="prog-wrap"><div className="prog-bar" style={{ width:`${item.max?Math.min(100,item.used/item.max*100):60}%`,background:item.max&&item.used/item.max>0.8?C.amber:planColor }} /></div>
              {item.max&&item.used/item.max>0.8&&<div style={{ fontSize:10,color:C.amber,marginTop:2 }}>⚠️ Cerca del límite · Considerá mejorar tu plan</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade banner */}
      {showUpgrade&&(
        <div className="card" style={{ marginBottom:18,border:`1.5px solid ${C.accent}`,background:C.accentDim }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
            <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15 }}>⬆️ Mejorar plan</div>
            <button className="btn btn-g" style={{ fontSize:11 }} onClick={()=>setShowUpgrade(false)}>✕ Cerrar</button>
          </div>
          <div className="g2" style={{ gap:12 }}>
            {[plan==="starter"?["growth","Growth","$99/mes","Campañas ilimitadas · IA avanzada · 3 cuentas Meta"]:null,["scale","Scale","$199/mes","IA avanzada completa · 10 cuentas · API · White label"]].filter(Boolean).map(([id,name,p,desc])=>(
              <div key={id} style={{ background:C.surface,border:`1.5px solid ${C.accent}`,borderRadius:10,padding:16,cursor:"pointer" }}>
                <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,marginBottom:3 }}>{name}</div>
                <div style={{ fontFamily:"'DM Mono',monospace",fontSize:17,color:C.accent,fontWeight:700,marginBottom:8 }}>{p}</div>
                <div style={{ fontSize:12,color:C.textMuted,lineHeight:1.5,marginBottom:12 }}>{desc}</div>
                <button className="btn btn-p" style={{ width:"100%",fontSize:13 }}>Cambiar a {name}</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invoice history */}
      <div className="card">
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
          <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:14 }}>Historial de facturación</div>
          <Tag t="tg">Al día</Tag>
        </div>
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Nº Factura</th><th>Período</th><th>Fecha</th><th>Monto</th><th>Estado</th><th>Acción</th></tr></thead>
            <tbody>
              {invoices.map(inv=>(
                <tr key={inv.id}>
                  <td style={{ fontFamily:"'DM Mono',monospace",fontSize:11 }}>{inv.id}</td>
                  <td style={{ fontSize:12 }}>{inv.period}</td>
                  <td style={{ fontSize:12,color:C.textMuted }}>{inv.date}</td>
                  <td style={{ fontFamily:"'DM Mono',monospace",fontSize:12,color:inv.amount>0?C.text:C.green }}>{inv.amount>0?`$${inv.amount} USD`:"Gratis"}</td>
                  <td><Tag t={inv.status==="pagado"?"tg":inv.status==="gratis"?"tb":"tr"}>{inv.status}</Tag></td>
                  <td>
                    <button className="btn btn-g" style={{ fontSize:11,padding:"3px 9px" }} onClick={()=>downloadInvoice(inv)}>
                      📥 Descargar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop:14,padding:"10px 12px",background:C.surface2,borderRadius:8,fontSize:12,color:C.textMuted,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <span>Total pagado hasta la fecha: <strong style={{ color:C.text }}>${invoices.reduce((s,i)=>s+i.amount,0)} USD</strong></span>
          <span>Próximo cobro: <strong style={{ color:C.amber }}>$${price} USD el 01/06/2026</strong></span>
        </div>
      </div>
    </div>
  );
}

function DBAdmin() {
  return (
    <div className="content fade-in">
      <div className="g3" style={{ marginBottom:18 }}>
        <MetricCard label="Usuarios totales" value="127" change="+8 este mes" up chart={[80,90,100,108,110,120,127]} />
        <MetricCard label="MRR" value="$8,940" change="+$1,200 vs mes ant." up chart={[5000,6200,7200,7800,8100,8500,8940]} color={C.green} />
        <MetricCard label="Churn rate" value="2.3%" change="-0.5% este mes" up chart={[5,4.5,4,3.5,3,2.5,2.3]} color={C.amber} />
      </div>
      <div className="g2" style={{ gap:16 }}>
        <div className="card">
          <div className="sh-title" style={{ marginBottom:13 }}>Distribución de planes</div>
          {[["Scale — $199/mes",12,C.accent],["Growth — $99/mes",48,C.blue],["Starter — $49/mes",67,C.green]].map(([plan,users,col],i)=>(
            <div key={i} style={{ marginBottom:13 }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:13 }}><span>{plan}</span><span style={{ color:C.textMuted,fontFamily:"'DM Mono',monospace" }}>{users} usuarios</span></div>
              <div className="prog-wrap"><div className="prog-bar" style={{ width:`${(users/127)*100}%`,background:col }} /></div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="sh-title" style={{ marginBottom:13 }}>Precios (editables)</div>
          {[["Starter","49"],["Growth","99"],["Scale","199"]].map(([plan,price],i)=>(
            <div key={i} style={{ display:"flex",alignItems:"center",gap:9,marginBottom:11 }}>
              <div style={{ flex:1,fontSize:13,fontWeight:500 }}>Plan {plan}</div>
              <span style={{ color:C.textMuted,fontSize:13 }}>$</span>
              <input className="finput" defaultValue={price} style={{ width:76,textAlign:"center" }} />
              <span style={{ color:C.textMuted,fontSize:12 }}>/mes</span>
              <button className="btn btn-g" style={{ fontSize:11,padding:"5px 9px" }}>Guardar</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── DASHBOARD SHELL ────────────────────────────────────────────────────────────
const NAV_ITEMS=[
  {id:"dashboard",l:"Dashboard",i:"📊"},
  {id:"campaigns",l:"Campañas",i:"📣"},
  {id:"new",l:"Nueva campaña",i:"✨"},
  {id:"creatives",l:"Creativos IA",i:"🎨"},
  {id:"reports",l:"Reportes",i:"📈"},
  {id:"integrations",l:"Integraciones",i:"🔗"},
  {id:"billing",l:"Facturación",i:"💳"},
  {id:"admin",l:"Admin",i:"⚙️",badge:"ADMIN"},
];
const PT={dashboard:"Dashboard",campaigns:"Campañas",new:"Nueva campaña",creatives:"Creativos IA",reports:"Reportes",integrations:"Integraciones",billing:"Facturación",admin:"Panel admin"};

function DashShell({ user, onLogout }) {
  const [page,setPage]=useState("dashboard");
  const [mobOpen,setMobOpen]=useState(false);
  const render=()=>{
    if(page==="dashboard") return <DBDash />;
    if(page==="campaigns") return <DBCampaigns />;
    if(page==="new") return <DBNewCampaign />;
    if(page==="creatives") return <DBCreatives />;
    if(page==="reports") return <DBReports />;
    if(page==="integrations") return <DBIntegrations />;
    if(page==="billing") return <DBBilling user={user} />;
    if(page==="admin") return <DBAdmin />;
    return <div className="content fade-in" style={{ display:"flex",alignItems:"center",justifyContent:"center",height:"60vh" }}><div style={{ textAlign:"center" }}><div style={{ fontSize:38,marginBottom:11 }}>🚧</div><div style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,marginBottom:5 }}>{PT[page]}</div><div style={{ fontSize:13,color:C.textMuted }}>En desarrollo activo</div></div></div>;
  };
  const navTo=(id)=>{ setPage(id); setMobOpen(false); };
  return (
    <div className="app">
      {/* Mobile overlay */}
      <div className={`mob-overlay${mobOpen?" open":""}`} onClick={()=>setMobOpen(false)} />
      <aside className={`sidebar${mobOpen?" mob-open":""}`}>
        <div className="logo-wrap">
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
            <div className="logo"><div className="logo-icon">AI</div><div className="logo-txt">Commerce Ads<div className="logo-sub">Suite · v1.0</div></div></div>
            <button style={{ display:"none",background:"none",border:"none",color:C.textMuted,fontSize:18,cursor:"pointer",padding:4 }} className="mob-close-btn" onClick={()=>setMobOpen(false)}>✕</button>
          </div>
        </div>
        <nav className="nav">
          <div className="nav-lbl">Principal</div>
          {NAV_ITEMS.slice(0,6).map(n=>(
            <button key={n.id} className={`nav-btn${page===n.id?" active":""}`} onClick={()=>navTo(n.id)}>
              <span className="nav-icon">{n.i}</span>{n.l}
            </button>
          ))}
          <div className="nav-lbl" style={{ marginTop:6 }}>Cuenta</div>
          {NAV_ITEMS.slice(6).map(n=>(
            <button key={n.id} className={`nav-btn${page===n.id?" active":""}`} onClick={()=>navTo(n.id)}>
              <span className="nav-icon">{n.i}</span>{n.l}
              {n.badge&&<span className="nav-badge">{n.badge}</span>}
            </button>
          ))}
          <button className="nav-btn" onClick={onLogout} style={{ marginTop:5 }}><span className="nav-icon">🚪</span>Cerrar sesión</button>
        </nav>
        <div className="sidebar-foot">
          <div className="plan-card">
            <div className="plan-lbl">Plan activo</div>
            <div className="plan-name">{(user?.plan||"growth").toUpperCase()} ${user?.plan==="starter"?49:user?.plan==="scale"?199:99}/mes</div>
            <div className="bar-wrap"><div className="bar" style={{ width:"62%" }} /></div>
            <div style={{ fontSize:10,color:C.textMuted,marginTop:4,fontFamily:"'DM Mono',monospace" }}>12/∞ campañas</div>
          </div>
        </div>
      </aside>
      <main className="main-area">
        <div className="topbar">
          {/* Hamburger */}
          <button className="hamburger" onClick={()=>setMobOpen(true)} aria-label="Abrir menú">
            <span/><span/><span/>
          </button>
          <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,flex:1 }} className="topbar-title-txt">{PT[page]}</div>
          <div style={{ fontSize:12,color:C.textMuted,background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 12px" }} className="topbar-search-wrap">🔍 Buscar…</div>
          <button className="btn btn-g" style={{ fontSize:12,padding:"6px 10px" }}>🔔</button>
          <div style={{ width:28,height:28,borderRadius:"50%",background:C.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,cursor:"pointer",flexShrink:0 }}>{user?.name?.[0]||"A"}</div>
          <button className="btn btn-p" style={{ fontSize:12,whiteSpace:"nowrap" }} onClick={()=>navTo("new")}>+ Campaña</button>
        </div>
        {render()}
        {/* Bottom navigation for mobile */}
        <nav className="bottom-nav">
          {[["dashboard","📊","Inicio"],["campaigns","📣","Campañas"],["new","✨","Crear"],["creatives","🎨","Creativos"],["reports","📈","Reportes"]].map(([id,icon,lbl])=>(
            <button key={id} className={`bnav-item${page===id?" active":""}`} onClick={()=>navTo(id)}>
              <span className="bnav-icon">{icon}</span>{lbl}
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
}

// ── ROOT ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen,setScreen]=useState("landing");
  const [plan,setPlan]=useState(null);
  const [authTab,setAuthTab]=useState("login");
  const [user,setUser]=useState(null);

  const selectPlan=(p)=>{ setPlan(p); setAuthTab("register"); setScreen("auth"); };
  const onLogin=()=>{ setAuthTab("login"); setPlan(null); setScreen("auth"); };
  const onAuthSuccess=(u)=>{ if(u.needsPay&&u.planData){setUser(u);setPlan(u.planData);setScreen("checkout");}else{setUser(u);setScreen("dashboard");} };

  return (
    <>
      <style>{css}</style>
      {screen==="landing"&&<Landing onLogin={onLogin} onSelectPlan={selectPlan} />}
      {screen==="auth"&&<AuthPage initTab={authTab} plan={plan} onSuccess={onAuthSuccess} onBack={()=>setScreen("landing")} />}
      {screen==="checkout"&&plan&&<Checkout plan={plan} user={user} onSuccess={()=>setScreen("success")} onBack={()=>setScreen("auth")} />}
      {screen==="success"&&<Success plan={plan} onEnter={()=>setScreen("dashboard")} />}
      {screen==="dashboard"&&<DashShell user={user||{name:"Alan Ugarte",plan:"growth"}} onLogout={()=>setScreen("landing")} />}
    </>
  );
}
