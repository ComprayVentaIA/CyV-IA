import { useState, useEffect, useRef } from "react";

// ─── THEME ────────────────────────────────────────────────────────────────────
const C = {
  bg: "#05050d", surface: "#0c0c18", surface2: "#121220",
  border: "#1a1a2e", borderBright: "#252540",
  accent: "#7c5cfc", accentDim: "#7c5cfc18",
  green: "#00d68f", greenDim: "#00d68f15",
  red: "#ff4d6a", redDim: "#ff4d6a15",
  amber: "#ffb347", amberDim: "#ffb34715",
  blue: "#4da6ff", blueDim: "#4da6ff15",
  pink: "#ff6b9d", pinkDim: "#ff6b9d15",
  text: "#e2e2f0", textMuted: "#5a5a80", textDim: "#2a2a45",
  grad: "linear-gradient(135deg,#7c5cfc,#4da6ff)",
  gradGreen: "linear-gradient(135deg,#00d68f,#00b07a)",
  gradRed: "linear-gradient(135deg,#ff4d6a,#cc2244)",
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body,#root{background:${C.bg};color:${C.text};font-family:'DM Sans',sans-serif;min-height:100vh}
::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:${C.borderBright};border-radius:2px}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}
@keyframes shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}
@keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
@keyframes glow{0%,100%{box-shadow:0 0 20px ${C.accent}22}50%{box-shadow:0 0 40px ${C.accent}44}}
.fa{animation:fadeUp .2s ease both}
.si{animation:slideIn .2s ease both}
.sci{animation:scaleIn .15s ease both}
.spinner{width:15px;height:15px;border:2px solid ${C.borderBright};border-top-color:${C.accent};border-radius:50%;animation:spin .7s linear infinite;display:inline-block}
.pulse-dot{width:7px;height:7px;border-radius:50%;animation:pulse 2s ease infinite}

/* ── LAYOUT ── */
.shell{display:flex;height:100vh;overflow:hidden}
.aside{width:220px;min-width:220px;background:${C.surface};border-right:1px solid ${C.border};display:flex;flex-direction:column}
.main-col{flex:1;overflow-y:auto;display:flex;flex-direction:column;min-width:0}
.topbar{display:flex;align-items:center;padding:13px 24px;border-bottom:1px solid ${C.border};background:${C.surface}cc;backdrop-filter:blur(16px);position:sticky;top:0;z-index:20;gap:10px}
.page{padding:22px 24px;flex:1}

/* ── SIDEBAR ── */
.logo-area{padding:20px 16px 16px;border-bottom:1px solid ${C.border}}
.logo-row{display:flex;align-items:center;gap:10px}
.logo-box{width:32px;height:32px;background:${C.grad};border-radius:9px;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:12px;color:#fff;flex-shrink:0}
.logo-txt{font-family:'Syne',sans-serif;font-weight:700;font-size:12px;line-height:1.25}
.logo-badge{display:inline-flex;align-items:center;gap:4px;background:${C.redDim};border:1px solid ${C.red}44;border-radius:4px;padding:1px 6px;font-size:9px;color:${C.red};font-family:'DM Mono',monospace;margin-top:3px}
.nav-area{flex:1;padding:10px 8px;overflow-y:auto;display:flex;flex-direction:column;gap:1px}
.nav-sec{font-size:9px;color:${C.textDim};letter-spacing:.12em;text-transform:uppercase;padding:10px 10px 5px;font-family:'DM Mono',monospace}
.nav-item{display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:8px;cursor:pointer;font-size:12.5px;color:${C.textMuted};border:none;background:none;width:100%;text-align:left;transition:all .15s;position:relative}
.nav-item:hover{background:${C.surface2};color:${C.text}}
.nav-item.act{background:${C.accentDim};color:${C.accent};font-weight:500}
.nav-item.act::before{content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);width:3px;height:60%;background:${C.accent};border-radius:0 2px 2px 0}
.nav-ic{font-size:14px;width:16px;text-align:center;flex-shrink:0}
.nav-cnt{margin-left:auto;background:${C.red};color:#fff;font-size:9px;padding:1px 5px;border-radius:10px;font-family:'DM Mono',monospace}
.admin-profile{padding:12px 14px;border-top:1px solid ${C.border};display:flex;align-items:center;gap:9px}
.avatar{width:28px;height:28px;border-radius:50%;background:${C.grad};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0}

/* ── CARDS ── */
.card{background:${C.surface};border:1px solid ${C.border};border-radius:12px;padding:18px}
.card-sm{padding:13px 15px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.g5{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}

/* ── KPI CARDS ── */
.kpi{background:${C.surface};border:1px solid ${C.border};border-radius:12px;padding:16px;position:relative;overflow:hidden}
.kpi::before{content:'';position:absolute;top:0;left:0;right:0;height:2px}
.kpi.green::before{background:${C.gradGreen}}
.kpi.purple::before{background:${C.grad}}
.kpi.red::before{background:${C.gradRed}}
.kpi.amber::before{background:linear-gradient(135deg,${C.amber},#ff8c00)}
.kpi.blue::before{background:linear-gradient(135deg,${C.blue},#0066cc)}
.kpi-lbl{font-size:9.5px;color:${C.textMuted};font-family:'DM Mono',monospace;text-transform:uppercase;letter-spacing:.1em}
.kpi-val{font-family:'Syne',sans-serif;font-weight:700;font-size:26px;margin:6px 0 3px;line-height:1}
.kpi-chg{font-size:11px}
.mini-bars{display:flex;align-items:flex-end;gap:2px;height:28px;margin-top:10px}
.mini-bar{flex:1;border-radius:2px;min-height:3px;transition:background .2s}

/* ── BUTTONS ── */
.btn{padding:7px 14px;border-radius:8px;font-size:12.5px;font-weight:500;cursor:pointer;border:none;transition:all .15s;font-family:'DM Sans',sans-serif;display:inline-flex;align-items:center;gap:6px}
.btn-p{background:${C.grad};color:#fff}
.btn-p:hover{opacity:.88}
.btn-g{background:transparent;color:${C.textMuted};border:1px solid ${C.border}}
.btn-g:hover{background:${C.surface2};color:${C.text}}
.btn-red{background:${C.redDim};color:${C.red};border:1px solid ${C.red}33}
.btn-red:hover{background:${C.red}25}
.btn-green{background:${C.greenDim};color:${C.green};border:1px solid ${C.green}33}
.btn-green:hover{background:${C.green}25}
.btn-amber{background:${C.amberDim};color:${C.amber};border:1px solid ${C.amber}33}
.btn-sm{padding:4px 10px;font-size:11px;border-radius:6px}
.btn:disabled{opacity:.45;cursor:not-allowed}

/* ── FORMS ── */
.fg{display:flex;flex-direction:column;gap:5px}
.flbl{font-size:10px;color:${C.textMuted};font-family:'DM Mono',monospace;text-transform:uppercase;letter-spacing:.08em}
.finput,.fsel,.ftxt{background:${C.bg};border:1.5px solid ${C.border};border-radius:8px;padding:9px 11px;font-size:13px;color:${C.text};width:100%;outline:none;transition:border-color .15s;font-family:'DM Sans',sans-serif}
.finput:focus,.fsel:focus,.ftxt:focus{border-color:${C.accent}}
.finput::placeholder,.ftxt::placeholder{color:${C.textDim}}
.fsel option{background:${C.surface}}
.ftxt{resize:vertical;min-height:70px}

/* ── TAGS ── */
.tag{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:5px;font-size:10px;font-family:'DM Mono',monospace;font-weight:500;white-space:nowrap}
.tg{background:${C.greenDim};color:${C.green}}
.tr{background:${C.redDim};color:${C.red}}
.ta{background:${C.amberDim};color:${C.amber}}
.tb{background:${C.blueDim};color:${C.blue}}
.tp{background:${C.accentDim};color:${C.accent}}
.tk{background:${C.surface2};color:${C.textMuted}}

/* ── TABLE ── */
.tbl-scroll{overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:12px}
th{text-align:left;padding:8px 12px;color:${C.textMuted};font-weight:400;font-family:'DM Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:.1em;border-bottom:1px solid ${C.border};white-space:nowrap;background:${C.surface}}
td{padding:10px 12px;border-bottom:1px solid ${C.border}18;vertical-align:middle}
tr:hover td{background:${C.surface2}88}
tr:last-child td{border-bottom:none}

/* ── MODAL ── */
.overlay{position:fixed;inset:0;background:#000000bb;z-index:100;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px)}
.modal{background:${C.surface};border:1.5px solid ${C.border};border-radius:16px;width:100%;max-width:720px;max-height:90vh;overflow:hidden;display:flex;flex-direction:column}
.modal-lg{max-width:900px}
.modal-sm{max-width:440px}
.modal-head{display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid ${C.border}}
.modal-body{overflow-y:auto;padding:22px;flex:1}
.modal-foot{padding:14px 22px;border-top:1px solid ${C.border};display:flex;justify-content:flex-end;gap:10px}
.close-btn{width:28px;height:28px;border-radius:6px;border:1px solid ${C.border};background:none;color:${C.textMuted};cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center}
.close-btn:hover{background:${C.surface2};color:${C.text}}

/* ── TABS ── */
.tabs{display:flex;gap:2px;background:${C.bg};border-radius:9px;padding:3px;margin-bottom:18px}
.tab{flex:1;padding:7px 10px;text-align:center;font-size:12px;font-weight:500;border-radius:7px;cursor:pointer;border:none;background:transparent;color:${C.textMuted};transition:all .15s}
.tab.act{background:${C.surface};color:${C.text};border:1px solid ${C.border}}

/* ── PROGRESS ── */
.prog{background:${C.border};border-radius:2px;height:4px;width:100%}
.prog-bar{height:4px;border-radius:2px;transition:width .3s}

/* ── TOGGLE ── */
.tog{width:32px;height:18px;background:${C.border};border-radius:9px;cursor:pointer;position:relative;transition:background .2s;border:none;flex-shrink:0}
.tog.on{background:${C.accent}}
.tog::after{content:'';position:absolute;width:12px;height:12px;background:#fff;border-radius:50%;top:3px;left:3px;transition:left .2s;box-shadow:0 1px 3px #0004}
.tog.on::after{left:17px}

/* ── SECTION ── */
.sec-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.sec-title{font-family:'Syne',sans-serif;font-weight:700;font-size:15px}
.sec-sub{font-size:12px;color:${C.textMuted};margin-top:2px}

/* ── PERMISSION GRID ── */
.perm-group{background:${C.surface2};border:1px solid ${C.border};border-radius:10px;padding:14px;margin-bottom:10px}
.perm-group-title{font-size:11px;font-weight:600;color:${C.text};margin-bottom:10px;font-family:'Syne',sans-serif;display:flex;align-items:center;gap:7px}
.perm-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:7px}
.perm-item{display:flex;align-items:center;justify-content:space-between;padding:6px 10px;background:${C.bg};border:1px solid ${C.border};border-radius:7px;font-size:11.5px}
.perm-key{font-family:'DM Mono',monospace;font-size:10px;color:${C.textMuted}}

/* ── ALERTS ── */
.alert{padding:10px 14px;border-radius:8px;font-size:12px;margin-bottom:14px;display:flex;align-items:flex-start;gap:8px}
.alert-red{background:${C.redDim};border:1px solid ${C.red}33;color:${C.red}}
.alert-green{background:${C.greenDim};border:1px solid ${C.green}33;color:${C.green}}
.alert-amber{background:${C.amberDim};border:1px solid ${C.amber}33;color:${C.amber}}
.alert-blue{background:${C.blueDim};border:1px solid ${C.blue}33;color:${C.blue}}

/* ── ACTIVITY FEED ── */
.act-item{display:flex;gap:10px;padding:9px 0;border-bottom:1px solid ${C.border}22}
.act-item:last-child{border-bottom:none}
.act-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:4px}
`;

// ─── PLAN PERMISSIONS AUTO-MAP ────────────────────────────────────────────────
const PLAN_PERMISSIONS = {
  starter: [
    "campaigns.create","campaigns.read","campaigns.update","campaigns.publish","campaigns.duplicate",
    "creatives.create","creatives.read",
    "ai.analyze","ai.generate_creatives",
    "meta.connect","meta.publish","meta.sync",
    "whatsapp.connect","whatsapp.track",
    "reports.read","reports.export",
    "billing.read","integrations.manage",
  ],
  growth: [
    "campaigns.create","campaigns.read","campaigns.update","campaigns.delete","campaigns.publish","campaigns.duplicate",
    "creatives.create","creatives.read",
    "ai.analyze","ai.generate_creatives","ai.optimize",
    "meta.connect","meta.publish","meta.sync",
    "whatsapp.connect","whatsapp.track",
    "reports.read","reports.export","reports.schedule",
    "billing.read","billing.manage",
    "users.invite","integrations.manage",
  ],
  scale: [
    "campaigns.create","campaigns.read","campaigns.update","campaigns.delete","campaigns.publish","campaigns.duplicate",
    "creatives.create","creatives.read",
    "ai.analyze","ai.generate_creatives","ai.optimize","ai.advanced",
    "meta.connect","meta.publish","meta.sync",
    "whatsapp.connect","whatsapp.track",
    "reports.read","reports.export","reports.schedule",
    "billing.read","billing.manage",
    "users.invite","users.manage",
    "integrations.manage",
  ],
};

const PLAN_DESCRIPTIONS = {
  starter:  { label:"Starter",  price:"$49/mes",  color:"#00d68f", perms:["20 campañas/mes","50 creativos IA","IA básica (analizar + generar)","1 cuenta Meta","Reportes automáticos","WhatsApp redirect"] },
  growth:   { label:"Growth",   price:"$99/mes",  color:"#7c5cfc", perms:["Campañas ilimitadas","Creativos ilimitados","IA optimización avanzada","3 cuentas Meta","Reportes + programar","Invitar usuarios","Gestión de billing"] },
  scale:    { label:"Scale",    price:"$199/mes", color:"#4da6ff", perms:["Todo de Growth","IA avanzada completa","10 cuentas Meta","Gestionar subusers","Acceso API REST","White label"] },
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const ADMIN = { email: "admin@aicommerceads.com", name: "Alan Ugarte", role: "admin" };

const ALL_PERMISSIONS_GROUPED = {
  "Campañas": [
    { key: "campaigns.create", label: "Crear campañas" },
    { key: "campaigns.read", label: "Ver campañas" },
    { key: "campaigns.update", label: "Editar campañas" },
    { key: "campaigns.delete", label: "Eliminar campañas" },
    { key: "campaigns.publish", label: "Publicar en Meta" },
    { key: "campaigns.duplicate", label: "Duplicar campañas" },
  ],
  "Creativos & IA": [
    { key: "creatives.create", label: "Crear creativos" },
    { key: "creatives.read", label: "Ver creativos" },
    { key: "ai.analyze", label: "Análisis con IA" },
    { key: "ai.generate_creatives", label: "Generar creativos IA" },
    { key: "ai.optimize", label: "Optimización IA" },
    { key: "ai.advanced", label: "IA avanzada completa" },
  ],
  "Integraciones": [
    { key: "meta.connect", label: "Conectar Meta Ads" },
    { key: "meta.publish", label: "Publicar en Meta" },
    { key: "whatsapp.connect", label: "Conectar WhatsApp" },
    { key: "whatsapp.track", label: "Tracking WhatsApp" },
    { key: "integrations.manage", label: "Gestionar integraciones" },
  ],
  "Reportes": [
    { key: "reports.read", label: "Ver reportes" },
    { key: "reports.export", label: "Exportar PDF" },
    { key: "reports.schedule", label: "Programar reportes" },
  ],
  "Usuarios & Billing": [
    { key: "users.invite", label: "Invitar usuarios" },
    { key: "users.manage", label: "Gestionar usuarios" },
    { key: "billing.read", label: "Ver facturación" },
    { key: "billing.manage", label: "Gestionar pagos" },
  ],
  "Administración": [
    { key: "admin.access", label: "Acceso al panel admin" },
    { key: "admin.users", label: "Gestión de usuarios" },
    { key: "admin.billing", label: "Admin facturación" },
    { key: "admin.system", label: "Configuración sistema" },
    { key: "admin.impersonate", label: "Impersonar usuarios" },
    { key: "admin.audit", label: "Ver audit log" },
    { key: "admin.announcements", label: "Enviar anuncios" },
    { key: "admin.feature_flags", label: "Feature flags" },
  ],
};

const ROLE_COLORS = { admin:"tr", manager:"tp", support:"tb", client:"tg", subuser:"ta" };
const STATUS_COLORS = { active:"tg", suspended:"ta", blocked:"tr", pending_verification:"tb" };
const STATUS_LABELS = { active:"Activo", suspended:"Suspendido", blocked:"Bloqueado", pending_verification:"Sin verificar" };

const MOCK_USERS = [
  { id:"u1", name:"María González", email:"maria@ejemplo.com", role:"client", status:"active", plan:"growth", planPrice:99, campaigns:8, leads:342, lastLogin:"Hace 2h", created:"12/01/2026", perms:[] },
  { id:"u2", name:"Carlos Romero", email:"carlos@ejemplo.com", role:"client", status:"active", plan:"scale", planPrice:199, campaigns:24, leads:1240, lastLogin:"Hace 15min", created:"05/01/2026", perms:[] },
  { id:"u3", name:"Laura Martínez", email:"laura@ejemplo.com", role:"client", status:"suspended", plan:"starter", planPrice:49, campaigns:2, leads:18, lastLogin:"Hace 5 días", created:"20/02/2026", perms:[], suspendedReason:"Incumplimiento de términos" },
  { id:"u4", name:"Diego Fernández", email:"diego@ejemplo.com", role:"client", status:"active", plan:"growth", planPrice:99, campaigns:11, leads:521, lastLogin:"Ayer", created:"10/03/2026", perms:[] },
  { id:"u5", name:"Equipo Soporte", email:"soporte@aicommerceads.com", role:"support", status:"active", plan:"scale", planPrice:199, campaigns:0, leads:0, lastLogin:"Hace 1h", created:"01/01/2026", perms:["admin.access","admin.users","admin.audit"] },
  { id:"u6", name:"Valentina López", email:"vale@ejemplo.com", role:"client", status:"active", plan:"starter", planPrice:49, campaigns:3, leads:87, lastLogin:"Hace 3 días", created:"14/03/2026", perms:[] },
  { id:"u7", name:"Matías Soria", email:"mati@ejemplo.com", role:"manager", status:"active", plan:"scale", planPrice:199, campaigns:0, leads:0, lastLogin:"Hace 30min", created:"02/02/2026", perms:["admin.access","admin.users","campaigns.read"] },
];

const MOCK_FLAGS = [
  { id:"f1", name:"ai_creative_generation", desc:"Generación de creativos con IA", enabled:true, scope:null },
  { id:"f2", name:"ai_optimization", desc:"Optimización automática de campañas", enabled:true, scope:"growth" },
  { id:"f3", name:"ai_advanced", desc:"IA avanzada completa (análisis profundo)", enabled:true, scope:"scale" },
  { id:"f4", name:"auto_daily_reports", desc:"Informes diarios automáticos a las 20:00", enabled:true, scope:null },
  { id:"f5", name:"meta_ads_publish", desc:"Publicación directa en Meta Ads API", enabled:true, scope:null },
  { id:"f6", name:"multi_meta_accounts", desc:"Múltiples cuentas Meta Ads", enabled:true, scope:"growth" },
  { id:"f7", name:"api_access", desc:"Acceso a la API REST de la plataforma", enabled:false, scope:"scale" },
  { id:"f8", name:"white_label", desc:"White label / marca propia", enabled:false, scope:"scale" },
  { id:"f9", name:"bulk_campaign_creation", desc:"Creación masiva de campañas", enabled:true, scope:"growth" },
  { id:"f10", name:"maintenance_mode", desc:"🚨 Modo mantenimiento (bloquea acceso clientes)", enabled:false, scope:null },
];

const MOCK_AUDIT = [
  { id:"a1", user:"Alan Ugarte", action:"admin.update_plan_price", entity:"plan", detail:"starter → $59/mes", time:"Hace 5min", ip:"192.168.1.1" },
  { id:"a2", user:"Alan Ugarte", action:"admin.suspend_user", entity:"user", detail:"Laura Martínez", time:"Hace 1h", ip:"192.168.1.1" },
  { id:"a3", user:"Alan Ugarte", action:"admin.create_user", entity:"user", detail:"Equipo Soporte", time:"Hace 3h", ip:"192.168.1.1" },
  { id:"a4", user:"María González", action:"campaigns.publish", entity:"campaign", detail:"Nike Air - Reels", time:"Hace 4h", ip:"200.10.5.22" },
  { id:"a5", user:"Alan Ugarte", action:"admin.toggle_feature", entity:"feature_flag", detail:"api_access → false", time:"Ayer 18:32", ip:"192.168.1.1" },
  { id:"a6", user:"Carlos Romero", action:"campaigns.create", entity:"campaign", detail:"Gaming Carrusel", time:"Ayer 14:15", ip:"181.24.8.90" },
  { id:"a7", user:"Alan Ugarte", action:"admin.impersonate", entity:"user", detail:"Diego Fernández", time:"Hace 2 días", ip:"192.168.1.1" },
  { id:"a8", user:"Alan Ugarte", action:"admin.send_announcement", entity:"announcement", detail:"'Nuevas funciones de IA'", time:"Hace 3 días", ip:"192.168.1.1" },
];

const MOCK_ROLES = [
  { id:"r1", name:"admin", display:"Administrador", color:"#ff4d6a", desc:"Acceso total al sistema", users:1, perms:["*"] },
  { id:"r2", name:"manager", display:"Manager", color:"#7c5cfc", desc:"Gestión de usuarios y campañas", users:1, perms:["campaigns.*","users.manage","admin.access"] },
  { id:"r3", name:"support", display:"Soporte", color:"#4da6ff", desc:"Lectura y soporte a clientes", users:1, perms:["campaigns.read","reports.read","admin.access"] },
  { id:"r4", name:"client", display:"Cliente", color:"#00d68f", desc:"Usuario estándar de la plataforma", users:5, perms:["campaigns.*","creatives.*","ai.*"] },
  { id:"r5", name:"subuser", display:"Subusuario", color:"#ffb347", desc:"Acceso limitado asignado por cliente", users:0, perms:["campaigns.read","reports.read"] },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const Tag = ({ children, t = "tp", dot }) => (
  <span className={`tag ${t}`}>
    {dot && <span className="pulse-dot" style={{ background: "currentColor" }} />}
    {children}
  </span>
);

const MiniBar = ({ data, color }) => {
  const max = Math.max(...data);
  return (
    <div className="mini-bars">
      {data.map((v, i) => (
        <div key={i} className="mini-bar" style={{ height: `${(v / max) * 100}%`, background: i === data.length - 1 ? color : `${color}40` }} />
      ))}
    </div>
  );
};

const KpiCard = ({ label, value, change, up, color = "purple", chart, icon, sub }) => (
  <div className={`kpi ${color} fa`}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div className="kpi-lbl">{label}</div>
      {icon && <span style={{ fontSize: 18 }}>{icon}</span>}
    </div>
    <div className="kpi-val">{value}</div>
    {change && <div className={`kpi-chg ${up ? "up" : "down"}`} style={{ color: up ? C.green : C.red }}>{up ? "▲" : "▼"} {change}</div>}
    {sub && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{sub}</div>}
    {chart && <MiniBar data={chart} color={color === "green" ? C.green : color === "red" ? C.red : color === "amber" ? C.amber : color === "blue" ? C.blue : C.accent} />}
  </div>
);

const Modal = ({ title, onClose, children, size = "", footer, badge }) => (
  <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className={`modal ${size} sci`}>
      <div className="modal-head">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16 }}>{title}</div>
          {badge && badge}
        </div>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>
      <div className="modal-body">{children}</div>
      {footer && <div className="modal-foot">{footer}</div>}
    </div>
  </div>
);

const Confirm = ({ message, detail, onConfirm, onCancel, danger }) => (
  <div className="overlay">
    <div className="modal modal-sm sci">
      <div className="modal-head">
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>Confirmar acción</div>
        <button className="close-btn" onClick={onCancel}>✕</button>
      </div>
      <div className="modal-body">
        <div style={{ fontSize: 14, marginBottom: 8, fontWeight: 500 }}>{message}</div>
        {detail && <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.5 }}>{detail}</div>}
      </div>
      <div className="modal-foot">
        <button className="btn btn-g" onClick={onCancel}>Cancelar</button>
        <button className={`btn ${danger ? "btn-red" : "btn-p"}`} onClick={onConfirm}>Confirmar</button>
      </div>
    </div>
  </div>
);

// ─── PAGE: OVERVIEW ────────────────────────────────────────────────────────────
function Overview({ users, onNavigate }) {
  return (
    <div className="page fa">
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, marginBottom: 3 }}>Panel de Administración</div>
        <div style={{ fontSize: 13, color: C.textMuted }}>Vista global del sistema · Admin: {ADMIN.email}</div>
      </div>
      <div className="g5" style={{ marginBottom: 18 }}>
        <KpiCard label="MRR" value="$8,940" change="+$1,200 vs mes ant." up color="green" chart={[5000,5800,6200,7200,7800,8100,8500,8940]} />
        <KpiCard label="Usuarios activos" value={users.filter(u=>u.status==="active").length.toString()} change="+3 este mes" up color="purple" chart={[50,60,70,80,90,100,110,users.filter(u=>u.status==="active").length]} />
        <KpiCard label="Tasa de churn" value="2.3%" change="-0.5% este mes" up color="blue" chart={[5,4.5,4,3.5,3,2.8,2.5,2.3]} />
        <KpiCard label="Suspendidos" value={users.filter(u=>u.status==="suspended").length.toString()} sub="Requieren atención" color="amber" icon="⚠️" />
        <KpiCard label="ARR" value="$107k" change="+14% YoY" up color="green" chart={[60,70,80,90,95,100,104,107]} />
      </div>

      <div className="g2" style={{ marginBottom: 18 }}>
        <div className="card">
          <div className="sec-head"><div><div className="sec-title">Distribución de planes</div></div></div>
          {[["Scale — $199/mes",2,C.accent,20],["Growth — $99/mes",4,C.blue,40],["Starter — $49/mes",1,C.green,10]].map(([plan,n,col,w],i)=>(
            <div key={i} style={{ marginBottom:14 }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:13 }}>
                <span>{plan}</span>
                <span style={{ color:C.textMuted,fontFamily:"'DM Mono',monospace" }}>{n} usuarios</span>
              </div>
              <div className="prog"><div className="prog-bar" style={{ width:`${w}%`,background:col }} /></div>
            </div>
          ))}
          <div style={{ display:"flex",gap:10,marginTop:14 }}>
            <button className="btn btn-g btn-sm" onClick={()=>onNavigate("billing")}>Ver facturación</button>
          </div>
        </div>

        <div className="card">
          <div className="sec-head"><div className="sec-title">Actividad reciente</div></div>
          {MOCK_AUDIT.slice(0,5).map((a,i)=>(
            <div key={i} className="act-item">
              <div className="act-dot" style={{ background: a.action.includes("suspend")||a.action.includes("block")?C.red:a.action.includes("create")?C.green:C.accent }} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12,fontWeight:500 }}>{a.action}</div>
                <div style={{ fontSize:11,color:C.textMuted }}>{a.user} · {a.detail}</div>
              </div>
              <div style={{ fontSize:10,color:C.textDim,fontFamily:"'DM Mono',monospace",whiteSpace:"nowrap" }}>{a.time}</div>
            </div>
          ))}
          <button className="btn btn-g btn-sm" style={{ marginTop:12 }} onClick={()=>onNavigate("audit")}>Ver todo el log →</button>
        </div>
      </div>

      <div className="g3">
        {[
          { icon:"👥", title:"Nuevo usuario", sub:"Crear cuenta manualmente", color:C.accent, action:()=>onNavigate("users") },
          { icon:"📢", title:"Enviar anuncio", sub:"Comunicar a todos los clientes", color:C.blue, action:()=>onNavigate("comms") },
          { icon:"🚩", title:"Feature flags", sub:"Activar/desactivar funciones", color:C.amber, action:()=>onNavigate("flags") },
        ].map((a,i)=>(
          <div key={i} className="card" style={{ cursor:"pointer",transition:"all .15s" }} onClick={a.action}
            onMouseEnter={e=>e.currentTarget.style.borderColor=a.color}
            onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
            <div style={{ fontSize:22,marginBottom:9 }}>{a.icon}</div>
            <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:13,marginBottom:3 }}>{a.title}</div>
            <div style={{ fontSize:12,color:C.textMuted }}>{a.sub}</div>
            <div style={{ marginTop:10,fontSize:11,color:a.color,fontFamily:"'DM Mono',monospace" }}>EJECUTAR →</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PAGE: USERS ──────────────────────────────────────────────────────────────
function UsersPage({ users, setUsers }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [creating, setCreating] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(""),3000); };

  const filtered = users.filter(u =>
    (!search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) &&
    (!roleFilter || u.role === roleFilter) &&
    (!statusFilter || u.status === statusFilter)
  );

  const doAction = (userId, action, extra) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== userId) return u;
      if (action === "activate") return { ...u, status:"active", suspendedReason:undefined };
      if (action === "suspend") return { ...u, status:"suspended", suspendedReason:extra };
      if (action === "block") return { ...u, status:"blocked", blockedReason:extra };
      if (action === "plan") return { ...u, plan:extra, planPrice:extra==="starter"?49:extra==="growth"?99:199 };
      if (action === "role") return { ...u, role:extra };
      return u;
    }));
    setSelected(null);
    showToast(`Acción ejecutada: ${action}`);
  };

  return (
    <div className="page fa">
      {toast && (
        <div style={{ position:"fixed",top:16,right:16,background:C.green,color:"#fff",padding:"9px 16px",borderRadius:9,fontSize:13,fontWeight:500,zIndex:999,boxShadow:"0 4px 20px #0006" }}>
          ✅ {toast}
        </div>
      )}

      {/* Header */}
      <div className="sec-head" style={{ marginBottom:16 }}>
        <div>
          <div className="sec-title">Gestión de usuarios</div>
          <div className="sec-sub">{users.length} usuarios · {users.filter(u=>u.status==="active").length} activos</div>
        </div>
        <button className="btn btn-p" onClick={()=>setCreating(true)}>+ Crear usuario</button>
      </div>

      {/* Filters */}
      <div style={{ display:"flex",gap:10,marginBottom:16,flexWrap:"wrap" }}>
        <input className="finput" placeholder="🔍 Buscar por nombre o email..." style={{ maxWidth:280 }} value={search} onChange={e=>setSearch(e.target.value)} />
        <select className="fsel" style={{ maxWidth:140 }} value={roleFilter} onChange={e=>setRoleFilter(e.target.value)}>
          <option value="">Todos los roles</option>
          {["admin","manager","support","client","subuser"].map(r=><option key={r} value={r}>{r}</option>)}
        </select>
        <select className="fsel" style={{ maxWidth:150 }} value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="suspended">Suspendidos</option>
          <option value="blocked">Bloqueados</option>
        </select>
        {(search||roleFilter||statusFilter) && (
          <button className="btn btn-g btn-sm" onClick={()=>{setSearch("");setRoleFilter("");setStatusFilter("");}}>✕ Limpiar</button>
        )}
      </div>

      {/* Table */}
      <div className="card" style={{ padding:0, overflow:"hidden" }}>
        <div className="tbl-scroll">
          <table>
            <thead>
              <tr>
                <th>Usuario</th><th>Rol</th><th>Plan</th><th>Estado</th>
                <th>Campañas</th><th>Leads</th><th>Último acceso</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display:"flex",alignItems:"center",gap:9 }}>
                      <div style={{ width:30,height:30,borderRadius:"50%",background:C.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#fff",flexShrink:0 }}>{u.name[0]}</div>
                      <div>
                        <div style={{ fontSize:13,fontWeight:500 }}>{u.name}</div>
                        <div style={{ fontSize:11,color:C.textMuted }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><Tag t={ROLE_COLORS[u.role]||"tk"}>{u.role}</Tag></td>
                  <td>
                    <div style={{ fontSize:12 }}>{u.plan}</div>
                    <div style={{ fontSize:10,color:C.textMuted,fontFamily:"'DM Mono',monospace" }}>${u.planPrice}/mes</div>
                  </td>
                  <td><Tag t={STATUS_COLORS[u.status]||"tk"}>{STATUS_LABELS[u.status]||u.status}</Tag></td>
                  <td style={{ fontFamily:"'DM Mono',monospace",fontSize:12 }}>{u.campaigns}</td>
                  <td style={{ fontFamily:"'DM Mono',monospace",fontSize:12,color:C.accent }}>{u.leads}</td>
                  <td style={{ fontSize:11,color:C.textMuted }}>{u.lastLogin}</td>
                  <td>
                    <div style={{ display:"flex",gap:5,flexWrap:"wrap" }}>
                      <button className="btn btn-g btn-sm" onClick={()=>setSelected(u)}>Ver</button>
                      {u.status==="active" && <button className="btn btn-amber btn-sm" onClick={()=>setConfirm({type:"suspend",user:u})}>Suspender</button>}
                      {u.status==="suspended" && <button className="btn btn-green btn-sm" onClick={()=>doAction(u.id,"activate")}>Activar</button>}
                      {u.status!=="blocked" && <button className="btn btn-red btn-sm" onClick={()=>setConfirm({type:"block",user:u})}>Bloquear</button>}
                      {u.status==="blocked" && <button className="btn btn-green btn-sm" onClick={()=>doAction(u.id,"activate")}>Desbloquear</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {selected && <UserDetailModal user={selected} onClose={()=>setSelected(null)} onAction={doAction} showToast={showToast} />}

      {/* Create User Modal */}
      {creating && <CreateUserModal onClose={()=>setCreating(false)} onCreated={(u)=>{setUsers(p=>[...p,u]);setCreating(false);showToast(`Usuario ${u.name} creado correctamente`);}} />}

      {/* Confirm dialogs */}
      {confirm?.type==="suspend" && (
        <Confirm
          message={`¿Suspender a ${confirm.user.name}?`}
          detail="El usuario no podrá acceder a la plataforma hasta que lo actives nuevamente. Sus campañas activas serán pausadas."
          onConfirm={()=>{doAction(confirm.user.id,"suspend","Suspendido por admin");setConfirm(null);showToast("Usuario suspendido");}}
          onCancel={()=>setConfirm(null)}
          danger
        />
      )}
      {confirm?.type==="block" && (
        <Confirm
          message={`¿Bloquear permanentemente a ${confirm.user.name}?`}
          detail="Se revocarán todos sus tokens de acceso y no podrá iniciar sesión. Esta acción es más severa que suspender."
          onConfirm={()=>{doAction(confirm.user.id,"block","Bloqueado por admin");setConfirm(null);showToast("Usuario bloqueado");}}
          onCancel={()=>setConfirm(null)}
          danger
        />
      )}
    </div>
  );
}

// ─── USER DETAIL MODAL ────────────────────────────────────────────────────────
function UserDetailModal({ user, onClose, onAction, showToast }) {
  const [tab, setTab] = useState("info");
  const [editPerms, setEditPerms] = useState(user.perms || []);
  const [plan, setPlan] = useState(user.plan);
  const [role, setRole] = useState(user.role);
  const [impersonating, setImpersonating] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const togglePerm = (key) => setEditPerms(p => p.includes(key) ? p.filter(x=>x!==key) : [...p,key]);

  const allPerms = Object.values(ALL_PERMISSIONS_GROUPED).flat().map(p=>p.key);
  const hasAll = allPerms.every(p => editPerms.includes(p));
  const toggleAll = () => setEditPerms(hasAll ? [] : allPerms);

  const fakeLogs = [
    { action:"campaigns.publish", detail:"Nike Air Reels", time:"Hace 2h" },
    { action:"creatives.create", detail:"Reel 9:16 generado", time:"Hace 4h" },
    { action:"meta.connect", detail:"act_123456789", time:"Ayer" },
    { action:"auth.login", detail:"IP: 200.10.5.22", time:"Hace 2h" },
    { action:"reports.export", detail:"Informe PDF mayo", time:"Hace 3 días" },
  ];

  return (
    <Modal
      title={user.name}
      onClose={onClose}
      size="modal-lg"
      badge={<Tag t={STATUS_COLORS[user.status]||"tk"}>{STATUS_LABELS[user.status]||user.status}</Tag>}
      footer={
        <div style={{ display:"flex",gap:8,width:"100%",alignItems:"center" }}>
          <div style={{ fontSize:12,color:C.textMuted,flex:1 }}>ID: <span style={{ fontFamily:"'DM Mono',monospace" }}>{user.id}</span></div>
          <button className="btn btn-g" onClick={onClose}>Cerrar</button>
          {tab==="perms" && (
            <button className="btn btn-p" onClick={()=>{onAction(user.id,"perms",editPerms);showToast("Permisos actualizados");onClose();}}>
              Guardar permisos
            </button>
          )}
        </div>
      }
    >
      <div className="tabs">
        {[["info","📋 Info"],["plan","💳 Plan"],["perms","🔐 Permisos"],["activity","📊 Actividad"],["danger","☢️ Zona peligrosa"]].map(([id,lbl])=>(
          <button key={id} className={`tab${tab===id?" act":""}`} onClick={()=>setTab(id)}>{lbl}</button>
        ))}
      </div>

      {tab==="info" && (
        <div>
          <div className="g2" style={{ gap:12,marginBottom:16 }}>
            {[
              ["Nombre completo",user.name],["Email",user.email],
              ["Rol",user.role],["Plan",`${user.plan} ($${user.planPrice}/mes)`],
              ["Campañas",user.campaigns],["Leads totales",user.leads],
              ["Último acceso",user.lastLogin],["Miembro desde",user.created],
            ].map(([k,v],i)=>(
              <div key={i} style={{ background:C.surface2,borderRadius:8,padding:"10px 12px" }}>
                <div style={{ fontSize:10,color:C.textMuted,fontFamily:"'DM Mono',monospace",textTransform:"uppercase",marginBottom:3 }}>{k}</div>
                <div style={{ fontSize:13,fontWeight:500 }}>{v}</div>
              </div>
            ))}
          </div>
          {user.suspendedReason && (
            <div className="alert alert-amber">⚠️ <div><strong>Motivo de suspensión:</strong> {user.suspendedReason}</div></div>
          )}
          <div style={{ display:"flex",gap:10,flexWrap:"wrap",marginTop:8 }}>
            <div className="fg" style={{ flex:1 }}>
              <label className="flbl">Cambiar rol</label>
              <select className="fsel" value={role} onChange={e=>setRole(e.target.value)}>
                {["client","manager","support","subuser"].map(r=><option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <button className="btn btn-p" style={{ alignSelf:"flex-end" }} onClick={()=>{onAction(user.id,"role",role);showToast("Rol actualizado");onClose();}}>
              Actualizar rol
            </button>
          </div>
        </div>
      )}

      {tab==="plan" && (
        <div>
          <div className="alert alert-blue" style={{ marginBottom:16 }}>
            🔄 Al cambiar el plan, los permisos del usuario se actualizan <strong>automáticamente</strong> según lo incluido en cada plan.
          </div>
          <div className="g3" style={{ gap:12,marginBottom:18 }}>
            {Object.entries(PLAN_DESCRIPTIONS).map(([id,info])=>(
              <div key={id} onClick={()=>setPlan(id)} style={{ background:plan===id?`${info.color}15`:C.surface2,border:`1.5px solid ${plan===id?info.color:C.border}`,borderRadius:10,padding:14,cursor:"pointer",transition:"all .15s",position:"relative" }}>
                {plan===id && <div style={{ position:"absolute",top:8,right:8,fontSize:10,background:info.color,color:"#fff",borderRadius:4,padding:"1px 7px",fontFamily:"'DM Mono',monospace" }}>ACTIVO</div>}
                <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,marginBottom:4 }}>{info.label}</div>
                <div style={{ fontFamily:"'DM Mono',monospace",fontSize:16,color:plan===id?info.color:C.textMuted,fontWeight:700,marginBottom:10 }}>{info.price}</div>
                <div style={{ display:"flex",flexDirection:"column",gap:4 }}>
                  {info.perms.map((p,i)=>(
                    <div key={i} style={{ fontSize:11,color:C.textMuted,display:"flex",alignItems:"center",gap:5 }}>
                      <span style={{ color:info.color,fontSize:10 }}>✓</span>{p}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Preview de permisos que se activarán */}
          <div style={{ background:C.surface2,border:`1px solid ${C.border}`,borderRadius:10,padding:14,marginBottom:16 }}>
            <div style={{ fontSize:12,fontWeight:600,marginBottom:10,fontFamily:"'Syne',sans-serif" }}>
              🔐 Permisos que se activarán con Plan {PLAN_DESCRIPTIONS[plan].label}
            </div>
            <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
              {PLAN_PERMISSIONS[plan].map(p=>(
                <span key={p} style={{ background:`${PLAN_DESCRIPTIONS[plan].color}15`,border:`1px solid ${PLAN_DESCRIPTIONS[plan].color}33`,color:PLAN_DESCRIPTIONS[plan].color,fontSize:10,padding:"2px 8px",borderRadius:5,fontFamily:"'DM Mono',monospace" }}>{p}</span>
              ))}
            </div>
            <div style={{ fontSize:11,color:C.textMuted,marginTop:10 }}>
              Total: <strong style={{ color:C.text }}>{PLAN_PERMISSIONS[plan].length} permisos</strong> se asignarán automáticamente
            </div>
          </div>

          <div style={{ display:"flex",gap:10,alignItems:"center" }}>
            <button className="btn btn-p" onClick={()=>{
              onAction(user.id,"plan",plan);
              onAction(user.id,"perms", PLAN_PERMISSIONS[plan]);
              showToast(`Plan ${plan} activado · ${PLAN_PERMISSIONS[plan].length} permisos asignados automáticamente`);
              onClose();
            }}>
              ✅ Aplicar plan y permisos
            </button>
            <span style={{ fontSize:12,color:C.textMuted }}>Los permisos del plan anterior serán reemplazados</span>
          </div>
          <div style={{ fontSize:12,color:C.textMuted,marginTop:10,lineHeight:1.5 }}>
            ⚠️ Cambiar el plan manualmente no afecta la facturación en Stripe. Coordiná también desde el portal de Stripe.
          </div>
        </div>
      )}

      {tab==="perms" && (
        <div>
          <div className="alert alert-blue">🔐 Los permisos aquí definidos se suman a los del rol asignado. Usá esto para dar accesos extra individuales.</div>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
            <div style={{ fontSize:13,fontWeight:500 }}>Permisos extra para {user.name}</div>
            <button className="btn btn-g btn-sm" onClick={toggleAll}>{hasAll?"Desmarcar todo":"Seleccionar todo"}</button>
          </div>
          {Object.entries(ALL_PERMISSIONS_GROUPED).map(([group, perms]) => (
            <div key={group} className="perm-group">
              <div className="perm-group-title">
                {group === "Campañas" ? "📣" : group === "Creativos & IA" ? "🎨" : group === "Integraciones" ? "🔗" : group === "Reportes" ? "📊" : group === "Usuarios & Billing" ? "💳" : "⚙️"} {group}
              </div>
              <div className="perm-grid">
                {perms.map(perm => (
                  <div key={perm.key} className="perm-item" style={{ borderColor: editPerms.includes(perm.key)?C.accent:C.border }}>
                    <div>
                      <div style={{ fontSize:12,fontWeight:500 }}>{perm.label}</div>
                      <div className="perm-key">{perm.key}</div>
                    </div>
                    <button className={`tog${editPerms.includes(perm.key)?" on":""}`} onClick={()=>togglePerm(perm.key)} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="activity" && (
        <div>
          <div style={{ marginBottom:14 }}>
            {fakeLogs.map((l,i)=>(
              <div key={i} className="act-item">
                <div className="act-dot" style={{ background:l.action.includes("auth")?C.blue:l.action.includes("publish")?C.green:C.accent }} />
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12,fontFamily:"'DM Mono',monospace",color:C.text }}>{l.action}</div>
                  <div style={{ fontSize:11,color:C.textMuted }}>{l.detail}</div>
                </div>
                <div style={{ fontSize:10,color:C.textDim }}>{l.time}</div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex",gap:10 }}>
            <button className="btn btn-g btn-sm" onClick={()=>{setImpersonating(true);setTimeout(()=>setImpersonating(false),2000);showToast(`Sesión iniciada como ${user.name}`);}}>
              {impersonating?<span className="spinner"/>:"🕵️ Impersonar usuario"}
            </button>
            <button className="btn btn-g btn-sm" onClick={()=>{setResetDone(true);showToast("Contraseña temporal enviada por email");}}>
              {resetDone?"✓ Enviado":"🔑 Reset contraseña"}
            </button>
          </div>
        </div>
      )}

      {tab==="danger" && (
        <div>
          <div className="alert alert-red">⚠️ Las acciones en esta sección son irreversibles o tienen impacto inmediato en el acceso del usuario.</div>
          <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
            {[
              { icon:"⏸️", title:"Suspender cuenta", desc:"El usuario no podrá acceder. Sus datos se conservan.", action:"Suspender", t:"btn-amber", do:()=>{onAction(user.id,"suspend","Suspendido manualmente");onClose();} },
              { icon:"🚫", title:"Bloquear cuenta", desc:"Revoca todos los tokens. Acceso completamente vedado.", action:"Bloquear", t:"btn-red", do:()=>{onAction(user.id,"block","Bloqueado por admin");onClose();} },
              { icon:"✅", title:"Activar cuenta", desc:"Restaura el acceso completo del usuario.", action:"Activar", t:"btn-green", do:()=>{onAction(user.id,"activate");onClose();} },
              { icon:"🔑", title:"Resetear contraseña", desc:"Envía contraseña temporal al email del usuario.", action:"Reset pwd", t:"btn-g", do:()=>{showToast("Contraseña temporal enviada");} },
              { icon:"📧", title:"Verificar email manualmente", desc:"Marca el email como verificado sin que el usuario lo haga.", action:"Verificar", t:"btn-g", do:()=>{showToast("Email verificado");} },
            ].map((a,i)=>(
              <div key={i} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 16px" }}>
                <div style={{ display:"flex",gap:10,alignItems:"flex-start" }}>
                  <span style={{ fontSize:20 }}>{a.icon}</span>
                  <div>
                    <div style={{ fontSize:13,fontWeight:600,marginBottom:2 }}>{a.title}</div>
                    <div style={{ fontSize:12,color:C.textMuted,lineHeight:1.4 }}>{a.desc}</div>
                  </div>
                </div>
                <button className={`btn ${a.t} btn-sm`} style={{ whiteSpace:"nowrap",marginLeft:16 }} onClick={a.do}>{a.action}</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}

// ─── CREATE USER MODAL ────────────────────────────────────────────────────────
function CreateUserModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name:"", email:"", password:"", role:"client", plan:"starter", sendEmail:true });
  const [perms, setPerms] = useState([]);
  const [tab, setTab] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const set = (k,v) => { setForm(p=>({...p,[k]:v})); setErr(""); };

  const create = async () => {
    if (!form.name||!form.email||!form.password) { setErr("Completá nombre, email y contraseña"); return; }
    if (form.password.length < 8) { setErr("Contraseña mínimo 8 caracteres"); return; }
    setLoading(true);
    await new Promise(r=>setTimeout(r,1500));
    setLoading(false);
    const allPerms = [...new Set([...PLAN_PERMISSIONS[form.plan], ...perms])];
    onCreated({ id:`u${Date.now()}`, name:form.name, email:form.email, role:form.role, status:"active", plan:form.plan, planPrice:form.plan==="starter"?49:form.plan==="growth"?99:199, campaigns:0, leads:0, lastLogin:"Nunca", created:new Date().toLocaleDateString("es-AR"), perms:allPerms });
  };

  const togglePerm = (key) => setPerms(p=>p.includes(key)?p.filter(x=>x!==key):[...p,key]);

  return (
    <Modal
      title="Crear nuevo usuario"
      onClose={onClose}
      size="modal-lg"
      footer={
        <>
          <button className="btn btn-g" onClick={onClose}>Cancelar</button>
          <button className="btn btn-p" onClick={create} disabled={loading}>
            {loading?<><span className="spinner" style={{ borderTopColor:"#fff" }}/> Creando...</>:"✓ Crear usuario"}
          </button>
        </>
      }
    >
      <div className="tabs">
        {[["basic","👤 Datos"],["plan","💳 Plan & Rol"],["perms","🔐 Permisos"]].map(([id,lbl])=>(
          <button key={id} className={`tab${tab===id?" act":""}`} onClick={()=>setTab(id)}>{lbl}</button>
        ))}
      </div>
      {err && <div className="alert alert-red">{err}</div>}

      {tab==="basic" && (
        <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
          <div className="g2" style={{ gap:12 }}>
            <div className="fg"><label className="flbl">Nombre completo *</label><input className="finput" placeholder="María González" value={form.name} onChange={e=>set("name",e.target.value)} /></div>
            <div className="fg"><label className="flbl">Email *</label><input className="finput" type="email" placeholder="maria@ejemplo.com" value={form.email} onChange={e=>set("email",e.target.value)} /></div>
          </div>
          <div className="fg"><label className="flbl">Contraseña temporal *</label><input className="finput" type="password" placeholder="Mínimo 8 caracteres" value={form.password} onChange={e=>set("password",e.target.value)} /></div>
          <div style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:C.surface2,borderRadius:8,fontSize:13 }}>
            <button className={`tog${form.sendEmail?" on":""}`} onClick={()=>set("sendEmail",!form.sendEmail)} />
            <span>Enviar email de bienvenida con las credenciales</span>
          </div>
          <div className="alert alert-blue">💡 El usuario podrá cambiar su contraseña desde su perfil luego del primer acceso.</div>
        </div>
      )}

      {tab==="plan" && (
        <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
          <div className="fg">
            <label className="flbl">Rol del usuario</label>
            <select className="fsel" value={form.role} onChange={e=>set("role",e.target.value)}>
              <option value="client">Cliente — acceso estándar</option>
              <option value="manager">Manager — gestión + admin parcial</option>
              <option value="support">Soporte — solo lectura + admin</option>
              <option value="subuser">Subusuario — acceso mínimo</option>
            </select>
          </div>
          <div>
            <label className="flbl" style={{ display:"block",marginBottom:10 }}>Plan asignado</label>
            <div className="g3" style={{ gap:10 }}>
              {Object.entries(PLAN_DESCRIPTIONS).map(([id,info])=>(
                <div key={id} onClick={()=>{ set("plan",id); setPerms(PLAN_PERMISSIONS[id]); }}
                  style={{ background:form.plan===id?`${info.color}15`:C.surface2,border:`1.5px solid ${form.plan===id?info.color:C.border}`,borderRadius:10,padding:14,cursor:"pointer",textAlign:"center",transition:"all .15s" }}>
                  <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,marginBottom:3 }}>{info.label}</div>
                  <div style={{ fontFamily:"'DM Mono',monospace",fontSize:15,color:form.plan===id?info.color:C.textMuted,fontWeight:700,marginBottom:6 }}>{info.price}</div>
                  <div style={{ fontSize:10,color:C.textMuted }}>{PLAN_PERMISSIONS[id].length} permisos incluidos</div>
                </div>
              ))}
            </div>
          </div>
          {/* Auto permisos preview */}
          <div style={{ background:C.surface2,border:`1px solid ${C.border}`,borderRadius:10,padding:14 }}>
            <div style={{ fontSize:12,fontWeight:600,marginBottom:8,fontFamily:"'Syne',sans-serif",display:"flex",alignItems:"center",gap:7 }}>
              <span>🔄</span> Permisos que se asignarán automáticamente
              <span style={{ marginLeft:"auto",fontSize:11,color:PLAN_DESCRIPTIONS[form.plan].color,fontFamily:"'DM Mono',monospace" }}>{PLAN_PERMISSIONS[form.plan].length} permisos</span>
            </div>
            <div style={{ display:"flex",flexWrap:"wrap",gap:5 }}>
              {PLAN_PERMISSIONS[form.plan].map(p=>(
                <span key={p} style={{ background:`${PLAN_DESCRIPTIONS[form.plan].color}15`,border:`1px solid ${PLAN_DESCRIPTIONS[form.plan].color}33`,color:PLAN_DESCRIPTIONS[form.plan].color,fontSize:9.5,padding:"2px 7px",borderRadius:4,fontFamily:"'DM Mono',monospace" }}>{p}</span>
              ))}
            </div>
            <div style={{ fontSize:11,color:C.textMuted,marginTop:8 }}>
              ✅ Estos permisos se activarán automáticamente al crear el usuario con este plan
            </div>
          </div>
        </div>
      )}

      {tab==="perms" && (
        <div>
          <div className="alert alert-green">
            ✅ <strong>{PLAN_PERMISSIONS[form.plan].length} permisos del Plan {PLAN_DESCRIPTIONS[form.plan].label}</strong> ya están incluidos automáticamente. Acá podés agregar permisos extra opcionales.
          </div>
          {/* Plan base perms (read-only) */}
          <div style={{ background:C.surface2,border:`1px solid ${C.border}`,borderRadius:10,padding:14,marginBottom:14 }}>
            <div style={{ fontSize:12,fontWeight:600,marginBottom:8,color:PLAN_DESCRIPTIONS[form.plan].color,fontFamily:"'Syne',sans-serif" }}>
              🔒 Incluidos en Plan {PLAN_DESCRIPTIONS[form.plan].label} (no editables)
            </div>
            <div style={{ display:"flex",flexWrap:"wrap",gap:5 }}>
              {PLAN_PERMISSIONS[form.plan].map(p=>(
                <span key={p} style={{ background:`${PLAN_DESCRIPTIONS[form.plan].color}15`,border:`1px solid ${PLAN_DESCRIPTIONS[form.plan].color}33`,color:PLAN_DESCRIPTIONS[form.plan].color,fontSize:9.5,padding:"2px 7px",borderRadius:4,fontFamily:"'DM Mono',monospace" }}>{p}</span>
              ))}
            </div>
          </div>
          <div className="alert alert-amber">⚡ Permisos EXTRA (opcional): solo agregá si este usuario necesita algo fuera del plan.</div>
          {Object.entries(ALL_PERMISSIONS_GROUPED).slice(0,3).map(([group,items])=>{
            const extras = items.filter(p=>!PLAN_PERMISSIONS[form.plan].includes(p.key));
            if (!extras.length) return null;
            return (
              <div key={group} className="perm-group">
                <div className="perm-group-title">{group} — solo extras disponibles</div>
                <div className="perm-grid">
                  {extras.map(p=>(
                    <div key={p.key} className="perm-item" style={{ borderColor:perms.includes(p.key)?C.accent:C.border }}>
                      <div>
                        <div style={{ fontSize:12 }}>{p.label}</div>
                        <div className="perm-key">{p.key}</div>
                      </div>
                      <button className={`tog${perms.includes(p.key)?" on":""}`} onClick={()=>togglePerm(p.key)} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
}

// ─── PAGE: ROLES ──────────────────────────────────────────────────────────────
function RolesPage() {
  const [roles, setRoles] = useState(MOCK_ROLES);
  const [selected, setSelected] = useState(null);
  const [creating, setCreating] = useState(false);

  return (
    <div className="page fa">
      <div className="sec-head">
        <div><div className="sec-title">Roles y permisos</div><div className="sec-sub">Define qué puede hacer cada tipo de usuario</div></div>
        <button className="btn btn-p" onClick={()=>setCreating(true)}>+ Crear rol</button>
      </div>
      <div className="g2" style={{ marginBottom:20 }}>
        {roles.map(r=>(
          <div key={r.id} className="card" style={{ cursor:"pointer",borderColor:selected?.id===r.id?r.color:C.border,transition:"all .15s" }} onClick={()=>setSelected(r)}>
            <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
              <div style={{ width:10,height:10,borderRadius:"50%",background:r.color,flexShrink:0 }} />
              <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,flex:1 }}>{r.display}</div>
              <Tag t={r.name==="admin"?"tr":r.name==="manager"?"tp":r.name==="support"?"tb":r.name==="client"?"tg":"ta"}>{r.name}</Tag>
            </div>
            <div style={{ fontSize:12,color:C.textMuted,marginBottom:12,lineHeight:1.5 }}>{r.desc}</div>
            <div style={{ display:"flex",justifyContent:"space-between",fontSize:12 }}>
              <span style={{ color:C.textMuted }}>{r.users} usuario{r.users!==1?"s":""}</span>
              <span style={{ color:C.accent }}>{r.perms.includes("*")?"Todos los permisos":`${r.perms.length} permisos`}</span>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="card">
          <div className="sec-head">
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <div style={{ width:12,height:12,borderRadius:"50%",background:selected.color }} />
              <div className="sec-title">Permisos de: {selected.display}</div>
            </div>
            <button className="btn btn-g btn-sm" onClick={()=>setSelected(null)}>Cerrar</button>
          </div>
          {selected.perms.includes("*") ? (
            <div className="alert alert-red">🛡️ Este rol tiene TODOS los permisos del sistema sin excepción.</div>
          ) : (
            <div>
              {Object.entries(ALL_PERMISSIONS_GROUPED).map(([group,items])=>{
                const active = items.filter(p=>selected.perms.some(rp=>rp===p.key||rp.endsWith(".*")&&p.key.startsWith(rp.replace(".*",""))));
                if (!active.length) return null;
                return (
                  <div key={group} style={{ marginBottom:12 }}>
                    <div style={{ fontSize:11,fontWeight:600,color:C.textMuted,marginBottom:7,fontFamily:"'Syne',sans-serif" }}>{group}</div>
                    <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                      {active.map(p=><Tag key={p.key} t="tg">{p.label}</Tag>)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {creating && (
        <Modal title="Crear rol personalizado" onClose={()=>setCreating(false)} size="modal-lg"
          footer={<><button className="btn btn-g" onClick={()=>setCreating(false)}>Cancelar</button><button className="btn btn-p">Crear rol</button></>}>
          <div style={{ display:"flex",flexDirection:"column",gap:13 }}>
            <div className="g2" style={{ gap:12 }}>
              <div className="fg"><label className="flbl">Nombre del rol (slug)</label><input className="finput" placeholder="ej. editor" /></div>
              <div className="fg"><label className="flbl">Nombre a mostrar</label><input className="finput" placeholder="ej. Editor de contenido" /></div>
            </div>
            <div className="fg"><label className="flbl">Descripción</label><input className="finput" placeholder="¿Qué puede hacer este rol?" /></div>
            <div className="alert alert-blue">Seleccioná los permisos que tendrá este rol:</div>
            {Object.entries(ALL_PERMISSIONS_GROUPED).slice(0,3).map(([group,items])=>(
              <div key={group} className="perm-group">
                <div className="perm-group-title">{group}</div>
                <div className="perm-grid">
                  {items.map(p=>(
                    <div key={p.key} className="perm-item">
                      <div style={{ fontSize:12 }}>{p.label}</div>
                      <button className="tog" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── PAGE: BILLING ────────────────────────────────────────────────────────────
function BillingPage({ users }) {
  return (
    <div className="page fa">
      <div className="sec-head"><div className="sec-title">Facturación y suscripciones</div></div>
      <div className="g4" style={{ marginBottom:18 }}>
        <KpiCard label="MRR" value="$8,940" change="+$1,200" up color="green" chart={[5000,6000,7000,7800,8400,8940]} />
        <KpiCard label="ARR proyectado" value="$107k" change="+14% YoY" up color="purple" />
        <KpiCard label="Suscripciones activas" value="7" change="+3 este mes" up color="blue" />
        <KpiCard label="Churn mes" value="$0" sub="0 cancelaciones" color="amber" />
      </div>

      <div className="g2" style={{ marginBottom:18 }}>
        <div className="card">
          <div className="sec-title" style={{ marginBottom:14 }}>Precios de planes (editables)</div>
          {[["starter","Starter",49,"20 campañas · 50 creativos"],["growth","Growth",99,"Campañas ilimitadas"],["scale","Scale",199,"IA avanzada + API"]].map(([id,name,price,desc])=>(
            <div key={id} style={{ display:"flex",alignItems:"center",gap:12,marginBottom:14,padding:"12px 14px",background:C.surface2,borderRadius:10 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600,fontSize:14 }}>Plan {name}</div>
                <div style={{ fontSize:11,color:C.textMuted }}>{desc}</div>
              </div>
              <span style={{ color:C.textMuted }}>$</span>
              <input className="finput" defaultValue={price} style={{ width:76,textAlign:"center",fontFamily:"'DM Mono',monospace" }} />
              <span style={{ fontSize:13,color:C.textMuted }}>/mes</span>
              <button className="btn btn-p btn-sm">Guardar</button>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="sec-title" style={{ marginBottom:14 }}>Revenue breakdown</div>
          {[["Scale $199 × 2","$398/mes",C.accent],["Growth $99 × 4","$396/mes",C.blue],["Starter $49 × 1","$49/mes",C.green]].map(([label,amount,color],i)=>(
            <div key={i} style={{ marginBottom:14 }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:13 }}>
                <span>{label}</span><span style={{ fontFamily:"'DM Mono',monospace",color }}>{amount}</span>
              </div>
              <div className="prog"><div className="prog-bar" style={{ width:`${i===0?45:i===1?45:10}%`,background:color }} /></div>
            </div>
          ))}
          <div style={{ borderTop:`1px solid ${C.border}`,paddingTop:12,marginTop:4 }}>
            <div style={{ display:"flex",justifyContent:"space-between",fontSize:14,fontWeight:700 }}>
              <span>Total MRR</span>
              <span style={{ fontFamily:"'DM Mono',monospace",color:C.green }}>$843/mes</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="sec-title" style={{ marginBottom:14 }}>Suscripciones activas</div>
        <div className="tbl-scroll">
          <table>
            <thead><tr><th>Usuario</th><th>Plan</th><th>Monto</th><th>Estado</th><th>Próximo cobro</th><th>Acción</th></tr></thead>
            <tbody>
              {users.filter(u=>u.plan).map(u=>(
                <tr key={u.id}>
                  <td><div style={{ fontSize:13,fontWeight:500 }}>{u.name}</div><div style={{ fontSize:11,color:C.textMuted }}>{u.email}</div></td>
                  <td><Tag t="tp">{u.plan}</Tag></td>
                  <td style={{ fontFamily:"'DM Mono',monospace",fontSize:12,color:C.green }}>${u.planPrice}/mes</td>
                  <td><Tag t={u.status==="active"?"tg":"tr"}>{u.status==="active"?"Al día":"Atrasado"}</Tag></td>
                  <td style={{ fontSize:12,color:C.textMuted }}>01/06/2026</td>
                  <td><div style={{ display:"flex",gap:5 }}>
                    <button className="btn btn-g btn-sm">Portal Stripe</button>
                    <button className="btn btn-amber btn-sm">Cambiar plan</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: FEATURE FLAGS ──────────────────────────────────────────────────────
function FlagsPage() {
  const [flags, setFlags] = useState(MOCK_FLAGS);
  const toggle = (id) => setFlags(p=>p.map(f=>f.id===id?{...f,enabled:!f.enabled}:f));

  return (
    <div className="page fa">
      <div className="sec-head">
        <div><div className="sec-title">Feature Flags</div><div className="sec-sub">Activá o desactivá funciones globalmente o por plan</div></div>
        <button className="btn btn-p">+ Nueva flag</button>
      </div>
      <div className="alert alert-red">🚨 <div><strong>Modo mantenimiento:</strong> Si activás "maintenance_mode", todos los clientes verán una pantalla de mantenimiento y no podrán operar la plataforma.</div></div>
      <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
        {flags.map(f=>(
          <div key={f.id} className="card card-sm" style={{ display:"flex",alignItems:"center",gap:14,borderColor:f.name==="maintenance_mode"&&f.enabled?C.red:C.border }}>
            <button className={`tog${f.enabled?" on":""}`} onClick={()=>toggle(f.id)} />
            <div style={{ flex:1 }}>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:3 }}>
                <span style={{ fontFamily:"'DM Mono',monospace",fontSize:12,fontWeight:500,color:C.text }}>{f.name}</span>
                {f.scope && <Tag t="tb">{f.scope}+</Tag>}
                {f.name==="maintenance_mode" && <Tag t="tr">CRÍTICO</Tag>}
              </div>
              <div style={{ fontSize:12,color:C.textMuted }}>{f.desc}</div>
            </div>
            <Tag t={f.enabled?"tg":"tr"}>{f.enabled?"Activa":"Inactiva"}</Tag>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PAGE: AUDIT LOG ──────────────────────────────────────────────────────────
function AuditPage() {
  const [filter, setFilter] = useState("");
  const filtered = MOCK_AUDIT.filter(a => !filter || a.action.includes(filter) || a.user.toLowerCase().includes(filter.toLowerCase()));
  const actionColor = (a) => a.includes("block")||a.includes("delete")?C.red:a.includes("create")||a.includes("activate")?C.green:a.includes("suspend")?C.amber:C.accent;

  return (
    <div className="page fa">
      <div className="sec-head">
        <div><div className="sec-title">Registro de auditoría</div><div className="sec-sub">Historial completo de acciones del sistema</div></div>
        <button className="btn btn-g">📥 Exportar CSV</button>
      </div>
      <div style={{ display:"flex",gap:10,marginBottom:16 }}>
        <input className="finput" placeholder="🔍 Filtrar por acción o usuario..." style={{ maxWidth:340 }} value={filter} onChange={e=>setFilter(e.target.value)} />
        <select className="fsel" style={{ maxWidth:160 }}><option>Todas las acciones</option><option>admin.*</option><option>campaigns.*</option><option>auth.*</option></select>
      </div>
      <div className="card" style={{ padding:0,overflow:"hidden" }}>
        <div className="tbl-scroll">
          <table>
            <thead><tr><th>Timestamp</th><th>Usuario</th><th>Acción</th><th>Entidad</th><th>Detalle</th><th>IP</th></tr></thead>
            <tbody>
              {filtered.map(a=>(
                <tr key={a.id}>
                  <td style={{ fontSize:11,color:C.textMuted,fontFamily:"'DM Mono',monospace",whiteSpace:"nowrap" }}>{a.time}</td>
                  <td style={{ fontSize:12,fontWeight:500 }}>{a.user}</td>
                  <td><span style={{ fontFamily:"'DM Mono',monospace",fontSize:11,color:actionColor(a.action) }}>{a.action}</span></td>
                  <td><Tag t="tk">{a.entity||"—"}</Tag></td>
                  <td style={{ fontSize:12,color:C.textMuted }}>{a.detail}</td>
                  <td style={{ fontFamily:"'DM Mono',monospace",fontSize:11,color:C.textDim }}>{a.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: COMUNICACIONES ─────────────────────────────────────────────────────
function CommsPage({ users }) {
  const [form, setForm] = useState({ subject:"", body:"", target:"all", targetPlan:"growth" });
  const [sent, setSent] = useState(null);
  const [loading, setLoading] = useState(false);
  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  const send = async () => {
    if (!form.subject||!form.body) return;
    setLoading(true);
    await new Promise(r=>setTimeout(r,1800));
    setLoading(false);
    const count = form.target==="all"?users.length:form.target==="plan"?users.filter(u=>u.plan===form.targetPlan).length:1;
    setSent({ count, subject:form.subject });
  };

  return (
    <div className="page fa">
      <div className="sec-head"><div className="sec-title">Comunicaciones</div><div className="sec-sub" style={{ marginTop:2 }}>Enviá emails y anuncios a tus usuarios</div></div>
      <div className="g2" style={{ gap:18,alignItems:"start" }}>
        <div className="card">
          <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:600,marginBottom:16 }}>Nuevo anuncio / email</div>
          {sent && <div className="alert alert-green">✅ Enviado a {sent.count} usuarios · Asunto: "{sent.subject}"</div>}
          <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
            <div className="fg"><label className="flbl">Destinatarios</label>
              <select className="fsel" value={form.target} onChange={e=>set("target",e.target.value)}>
                <option value="all">Todos los usuarios activos ({users.filter(u=>u.status==="active").length})</option>
                <option value="plan">Por plan</option>
                <option value="user">Usuario específico</option>
              </select>
            </div>
            {form.target==="plan" && (
              <div className="fg"><label className="flbl">Plan destino</label>
                <select className="fsel" value={form.targetPlan} onChange={e=>set("targetPlan",e.target.value)}>
                  <option value="starter">Starter</option><option value="growth">Growth</option><option value="scale">Scale</option>
                </select>
              </div>
            )}
            {form.target==="user" && (
              <div className="fg"><label className="flbl">Usuario</label>
                <select className="fsel">
                  {users.map(u=><option key={u.id}>{u.name} — {u.email}</option>)}
                </select>
              </div>
            )}
            <div className="fg"><label className="flbl">Asunto *</label><input className="finput" placeholder="ej. Nuevas funciones disponibles" value={form.subject} onChange={e=>set("subject",e.target.value)} /></div>
            <div className="fg"><label className="flbl">Mensaje *</label><textarea className="ftxt" style={{ minHeight:120 }} placeholder="Escribí el contenido del email..." value={form.body} onChange={e=>set("body",e.target.value)} /></div>
            <button className="btn btn-p" onClick={send} disabled={loading||!form.subject||!form.body}>
              {loading?<><span className="spinner" style={{ borderTopColor:"#fff" }}/> Enviando...</>:"📨 Enviar email"}
            </button>
          </div>
        </div>
        <div>
          <div className="card" style={{ marginBottom:14 }}>
            <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:600,marginBottom:12 }}>Templates rápidos</div>
            {[
              ["🎉","Bienvenida a nuevo plan","¡Gracias por actualizar tu plan! Ya tenés acceso a todas las funciones..."],
              ["⚠️","Aviso de mantenimiento","La plataforma estará en mantenimiento el [fecha] de [hora] a [hora]..."],
              ["🚀","Nuevas funciones","Nos complace anunciar el lanzamiento de [función]..."],
              ["💳","Recordatorio de pago","Tu suscripción se renovará en 3 días por $[monto]..."],
            ].map(([icon,title,preview],i)=>(
              <div key={i} onClick={()=>set("subject",title)} style={{ padding:"10px 12px",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,cursor:"pointer",marginBottom:8,transition:"all .15s" }}
                onMouseEnter={e=>e.currentTarget.style.borderColor=C.accent}
                onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                <div style={{ fontSize:12,fontWeight:500,marginBottom:2 }}>{icon} {title}</div>
                <div style={{ fontSize:11,color:C.textMuted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{preview}</div>
              </div>
            ))}
          </div>
          <div className="card">
            <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:600,marginBottom:12 }}>Historial enviados</div>
            {[["Nuevas funciones de IA","Todos","3 días","127 recibido"],["Mantenimiento programado","Todos","1 sem","127 recibido"],["Oferta Scale","Starter","2 sem","43 recibido"]].map(([sub,dest,when,result],i)=>(
              <div key={i} style={{ padding:"8px 0",borderBottom:`1px solid ${C.border}18`,fontSize:12 }}>
                <div style={{ fontWeight:500,marginBottom:2 }}>{sub}</div>
                <div style={{ color:C.textMuted,fontSize:11 }}>{dest} · {when} · {result}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: SYSTEM SETTINGS ────────────────────────────────────────────────────
function SystemPage() {
  const [settings, setSettings] = useState({ reportHour:"20", trialDays:"7", maxFileMB:"500", rateLimit:"1000", testMode:true, maintenance:false, companyName:"AI Commerce Ads Suite", supportEmail:"soporte@aicommerceads.com" });
  const [saved, setSaved] = useState(false);
  const set = (k,v) => setSettings(p=>({...p,[k]:v}));

  return (
    <div className="page fa" style={{ maxWidth:800 }}>
      <div className="sec-head"><div className="sec-title">Configuración del sistema</div></div>
      {saved && <div className="alert alert-green">✅ Configuración guardada correctamente</div>}

      <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
        {/* General */}
        <div className="card">
          <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:600,marginBottom:14 }}>⚙️ General</div>
          <div className="g2" style={{ gap:12 }}>
            <div className="fg"><label className="flbl">Nombre de la plataforma</label><input className="finput" value={settings.companyName} onChange={e=>set("companyName",e.target.value)} /></div>
            <div className="fg"><label className="flbl">Email de soporte</label><input className="finput" value={settings.supportEmail} onChange={e=>set("supportEmail",e.target.value)} /></div>
            <div className="fg"><label className="flbl">Hora de reportes diarios</label><select className="fsel" value={settings.reportHour} onChange={e=>set("reportHour",e.target.value)}>{Array.from({length:24},(_,i)=><option key={i} value={i}>{String(i).padStart(2,"0")}:00</option>)}</select></div>
            <div className="fg"><label className="flbl">Días de prueba gratis</label><input className="finput" type="number" value={settings.trialDays} onChange={e=>set("trialDays",e.target.value)} /></div>
            <div className="fg"><label className="flbl">Tamaño máximo de archivo (MB)</label><input className="finput" type="number" value={settings.maxFileMB} onChange={e=>set("maxFileMB",e.target.value)} /></div>
            <div className="fg"><label className="flbl">Rate limit (requests/hora)</label><input className="finput" type="number" value={settings.rateLimit} onChange={e=>set("rateLimit",e.target.value)} /></div>
          </div>
        </div>

        {/* Stripe */}
        <div className="card">
          <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:600,marginBottom:14 }}>💳 Stripe</div>
          <div style={{ display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:C.surface2,borderRadius:9,marginBottom:12 }}>
            <button className={`tog${settings.testMode?" on":""}`} onClick={()=>set("testMode",!settings.testMode)} />
            <div>
              <div style={{ fontSize:13,fontWeight:500 }}>Modo de prueba (test mode)</div>
              <div style={{ fontSize:12,color:C.textMuted }}>Desactivá solo cuando estés listo para cobros reales</div>
            </div>
            <Tag t={settings.testMode?"ta":"tg"}>{settings.testMode?"TEST":"LIVE"}</Tag>
          </div>
          {settings.testMode && <div className="alert alert-amber">⚠️ En modo test los cobros no son reales. Usá tarjetas de prueba de Stripe.</div>}
        </div>

        {/* Maintenance */}
        <div className="card" style={{ border:`1px solid ${settings.maintenance?C.red:C.border}` }}>
          <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:600,marginBottom:14,color:settings.maintenance?C.red:C.text }}>🚨 Modo mantenimiento</div>
          <div style={{ display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:settings.maintenance?C.redDim:C.surface2,borderRadius:9,marginBottom:settings.maintenance?12:0 }}>
            <button className={`tog${settings.maintenance?" on":""}`} style={{ background:settings.maintenance?C.red:undefined }} onClick={()=>set("maintenance",!settings.maintenance)} />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13,fontWeight:500 }}>Activar modo mantenimiento</div>
              <div style={{ fontSize:12,color:C.textMuted }}>Los clientes verán una pantalla de mantenimiento y no podrán operar</div>
            </div>
            <Tag t={settings.maintenance?"tr":"tg"}>{settings.maintenance?"🔴 ACTIVO":"🟢 INACTIVO"}</Tag>
          </div>
          {settings.maintenance && <div className="alert alert-red" style={{ marginBottom:0 }}>🚨 El modo mantenimiento está ACTIVO. Todos los clientes están bloqueados.</div>}
        </div>

        {/* Admin credentials reminder */}
        <div className="card" style={{ border:`1px solid ${C.accent}44`,background:C.accentDim }}>
          <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:600,marginBottom:14,color:C.accent }}>🔐 Credenciales de administrador</div>
          <div className="g2" style={{ gap:10 }}>
            {[["Email admin","admin@aicommerceads.com"],["Contraseña","AdminACA2026!#"],["Rol","Administrador (acceso total)"],["Creado","Seed inicial del sistema"]].map(([k,v],i)=>(
              <div key={i} style={{ padding:"10px 12px",background:C.bg,borderRadius:8,border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:10,color:C.textMuted,fontFamily:"'DM Mono',monospace",textTransform:"uppercase",marginBottom:3 }}>{k}</div>
                <div style={{ fontSize:13,fontFamily:"'DM Mono',monospace",color:C.text }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize:12,color:C.textMuted,marginTop:12 }}>⚠️ Cambiá la contraseña después del primer acceso desde Perfil → Seguridad.</div>
        </div>

        <div style={{ display:"flex",justifyContent:"flex-end",gap:10 }}>
          <button className="btn btn-g">Descartar cambios</button>
          <button className="btn btn-p" onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),3000);}}>Guardar configuración</button>
        </div>
      </div>
    </div>
  );
}

// ─── NAV CONFIG ───────────────────────────────────────────────────────────────
const NAV = [
  { id:"overview", label:"Overview", icon:"📊" },
  { id:"users", label:"Usuarios", icon:"👥", badge:1 },
  { id:"roles", label:"Roles & Permisos", icon:"🔐" },
  { id:"billing", label:"Facturación", icon:"💳" },
  { id:"flags", label:"Feature Flags", icon:"🚩" },
  { id:"ai_training", label:"Entrenar IA", icon:"🧠" },
  { id:"audit", label:"Audit Log", icon:"📋" },
  { id:"comms", label:"Comunicaciones", icon:"📢" },
  { id:"system", label:"Sistema", icon:"⚙️" },
];

const PAGE_TITLES = { overview:"Overview", users:"Usuarios", roles:"Roles y permisos", billing:"Facturación", flags:"Feature Flags", ai_training:"Entrenar IA", audit:"Audit Log", comms:"Comunicaciones", system:"Configuración" };

// ─── PAGE: AI TRAINING ────────────────────────────────────────────────────────
function AITrainingPage() {
  const [url,setUrl]=useState("");
  const [desc,setDesc]=useState("");
  const [analyzing,setAnalyzing]=useState(false);
  const [result,setResult]=useState(null);
  const [tab,setTab]=useState("urls");
  const [patterns,setPatterns]=useState([
    {id:"p1",source:"TikTok",type:"video",hook:"¿Todavía pagás de más?",style:"Transición rápida + texto grande en pantalla",platform:"TikTok",score:92,date:"20/05/2026",active:true},
    {id:"p2",source:"Meta Ad Library",type:"video",hook:"Últimas unidades disponibles",style:"UGC casero + subtítulos animados blancos",platform:"Facebook",score:88,date:"15/05/2026",active:true},
    {id:"p3",source:"Pinterest",type:"image",hook:"El look que todos quieren",style:"Fondo limpio blanco + producto centrado",platform:"Pinterest",score:75,date:"10/05/2026",active:true},
    {id:"p4",source:"Instagram Reels",type:"video",hook:"No lo podía creer cuando llegó",style:"Unboxing + reacción natural",platform:"Instagram",score:85,date:"05/05/2026",active:false},
  ]);
  const [manualStyle,setManualStyle]=useState({tone:"",visual:"",hook:"",cta:"",audience:"",platform:"reels"});

  const detectPlatform=(url)=>{
    if(url.includes("tiktok")) return "TikTok";
    if(url.includes("instagram")||url.includes("reels")) return "Instagram";
    if(url.includes("facebook")||url.includes("fb.com")||url.includes("ads/library")) return "Facebook / Meta Ad Library";
    if(url.includes("pinterest")) return "Pinterest";
    if(url.includes("canva")) return "Canva";
    if(url.includes("youtube")) return "YouTube Shorts";
    return "URL externa";
  };

  const analyzeURL=async()=>{
    if(!url.trim()) return;
    setAnalyzing(true); setResult(null);
    const platform=detectPlatform(url.toLowerCase());
    try {
      const resp=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:900,
          messages:[{role:"user",content:`Eres el sistema de IA de una plataforma de Meta Ads para ecommerce latinoamericano.
El administrador quiere entrenar la IA con contenido de ${platform}.
URL: ${url}
${desc?`Descripción adicional del admin: ${desc}`:""}

Analizá qué patrones virales y de alto rendimiento tiene este tipo de contenido publicitario en ${platform} para venta de productos físicos. Esto alimentará el motor de IA para generar mejores creativos.

Respondé SOLO con este JSON:
{
  "hook": "gancho viral principal detectado",
  "style": "descripción del estilo visual (1 oración)",
  "editing_technique": "técnica de edición clave",
  "cta": "llamada a la acción",
  "audience": "audiencia ideal",
  "platform": "${platform}",
  "content_type": "video|image",
  "viral_elements": ["elemento1","elemento2","elemento3"],
  "best_for": ["categoría de producto1","categoría2"],
  "apply_instructions": "instrucción concreta de cómo aplicar esto al generar creativos",
  "score": 85,
  "lesson": "aprendizaje principal para replicar"
}`}]}),
      });
      const data=await resp.json();
      const txt=data.content?.[0]?.text||"{}";
      const parsed=JSON.parse(txt.replace(/```json|```/g,"").trim());
      setResult(parsed);
    } catch(e){
      setResult({hook:"Contenido de alto impacto detectado",style:"Estilo visual limpio y directo con foco en el producto",editing_technique:"Cortes rápidos + zoom dinámico",cta:"Escribinos por WhatsApp","audience":"18-38 compradores online",platform,content_type:"video",viral_elements:["Texto grande en primeros 2 seg","Música trending","Precio visible"],best_for:["Ropa","Accesorios","Tecnología"],apply_instructions:"Usar texto superpuesto en los primeros 2 segundos. Mostrar precio con descuento prominente.",score:82,lesson:"Los primeros 2 segundos son críticos para detener el scroll"});
    }
    setAnalyzing(false);
  };

  const savePattern=()=>{
    if(!result) return;
    const newPattern={id:`p${Date.now()}`,source:result.platform,type:result.content_type,hook:result.hook,style:result.style,platform:result.platform,score:result.score,date:new Date().toLocaleDateString("es-AR"),active:true};
    setPatterns(p=>[newPattern,...p]);
    setResult(null); setUrl(""); setDesc("");
  };

  const saveManual=()=>{
    const newPattern={id:`pm${Date.now()}`,source:"Manual Admin",type:manualStyle.platform.includes("reels")||manualStyle.platform.includes("stories")?"video":"image",hook:manualStyle.hook,style:manualStyle.visual,platform:manualStyle.platform,score:80,date:new Date().toLocaleDateString("es-AR"),active:true};
    setPatterns(p=>[newPattern,...p]);
    setManualStyle({tone:"",visual:"",hook:"",cta:"",audience:"",platform:"reels"});
  };

  return (
    <div className="page fa" style={{ maxWidth:900 }}>
      <div className="sec-head">
        <div>
          <div className="sec-title">🧠 Entrenar IA</div>
          <div className="sec-sub">Nutrición automática desde URLs + instrucciones manuales para moldear los creativos generados</div>
        </div>
        <Tag t="tg">{patterns.filter(p=>p.active).length} patrones activos</Tag>
      </div>

      <div className="tabs">
        {[["urls","🔗 Desde URLs"],["manual","✍️ Instrucción manual"],["patterns","🧠 Patrones activos"]].map(([id,lbl])=>(
          <button key={id} className={`tab${tab===id?" act":""}`} onClick={()=>setTab(id)}>{lbl}</button>
        ))}
      </div>

      {tab==="urls"&&(
        <div>
          <div className="alert alert-blue" style={{ marginBottom:16 }}>
            🔗 Pegá URLs de TikTok, Instagram Reels, Facebook Ad Library, Pinterest o Canva. La IA analiza el patrón viral y aprende a replicarlo en los creativos de tus clientes.
          </div>
          <div className="card" style={{ marginBottom:14 }}>
            <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:600,marginBottom:14 }}>Analizar nueva URL</div>
            <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
              <div className="fg">
                <label className="flbl">URL del contenido viral *</label>
                <div style={{ display:"flex",gap:10 }}>
                  <input className="finput" placeholder="https://www.tiktok.com/@usuario/video/... o cualquier URL" value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&analyzeURL()} style={{ flex:1 }} />
                  <button className="btn btn-p" onClick={analyzeURL} disabled={analyzing||!url.trim()} style={{ whiteSpace:"nowrap" }}>
                    {analyzing?<><div className="spinner" style={{ borderTopColor:"#fff" }}/>Analizando...</>:"🔍 Analizar"}
                  </button>
                </div>
              </div>
              <div className="fg">
                <label className="flbl">Contexto adicional (opcional)</label>
                <textarea className="ftxt" style={{ minHeight:56 }} placeholder="ej: 'Este video tiene 2M de views y funciona bien para ropa de verano femenina'" value={desc} onChange={e=>setDesc(e.target.value)} />
              </div>
              <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
                {[["🎵","TikTok","tiktok.com"],["📸","Instagram","instagram.com/reel"],["📘","Meta Ad Library","facebook.com/ads/library"],["📌","Pinterest","pinterest.com"],["🎨","Canva","canva.com"],["▶️","YouTube Shorts","youtube.com/shorts"]].map(([icon,name,eg])=>(
                  <div key={name} onClick={()=>setUrl(`https://${eg}/...`)} style={{ padding:"5px 11px",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:7,cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",gap:5,color:C.textMuted,transition:"all .15s" }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=C.accent}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                    {icon} {name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {result&&(
            <div className="card" style={{ border:`1px solid ${C.accent}44`,background:`${C.accent}08`,animation:"fadeUp .2s ease" }}>
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
                <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,flex:1 }}>✨ Análisis completado</div>
                <div style={{ background:C.greenDim,border:`1px solid ${C.green}33`,borderRadius:7,padding:"3px 10px",fontSize:12,color:C.green,fontFamily:"'DM Mono',monospace" }}>Score viral: {result.score}/100</div>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10,marginBottom:14 }}>
                {[["🎣 Hook",result.hook],["🎬 Estilo",result.style],["✂️ Edición",result.editing_technique],["📢 CTA",result.cta],["🎯 Audiencia",result.audience],["💡 Aprendizaje",result.lesson]].map(([k,v],i)=>(
                  <div key={i} style={{ background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px" }}>
                    <div style={{ fontSize:10,color:C.textMuted,marginBottom:3 }}>{k}</div>
                    <div style={{ fontSize:12,lineHeight:1.4 }}>{v}</div>
                  </div>
                ))}
              </div>
              {result.viral_elements&&(
                <div style={{ marginBottom:14 }}>
                  <div style={{ fontSize:11,color:C.textMuted,marginBottom:7 }}>ELEMENTOS VIRALES DETECTADOS</div>
                  <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                    {result.viral_elements.map((el,i)=><Tag key={i} t="tg">{el}</Tag>)}
                  </div>
                </div>
              )}
              <div style={{ background:C.surface2,borderRadius:8,padding:"10px 12px",marginBottom:14,fontSize:12,color:C.text,lineHeight:1.5 }}>
                <strong style={{ color:C.accent }}>📋 Instrucción para la IA:</strong> {result.apply_instructions}
              </div>
              <div style={{ display:"flex",gap:10 }}>
                <button className="btn btn-p" onClick={savePattern}>💾 Guardar y activar en la IA</button>
                <button className="btn btn-g" onClick={()=>setResult(null)}>Descartar</button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab==="manual"&&(
        <div>
          <div className="alert alert-amber" style={{ marginBottom:16 }}>
            ✍️ Acá podés darle instrucciones directas a la IA sobre el estilo, tono y formato que querés que use al generar creativos y copies.
          </div>
          <div className="card">
            <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:600,marginBottom:16 }}>Nueva instrucción de estilo</div>
            <div style={{ display:"flex",flexDirection:"column",gap:13 }}>
              <div className="fg"><label className="flbl">Hook / Gancho preferido</label><input className="finput" placeholder='ej: "¿Sabías que podés tener esto por menos de $X?"' value={manualStyle.hook} onChange={e=>setManualStyle(p=>({...p,hook:e.target.value}))} /></div>
              <div className="fg"><label className="flbl">Estilo visual</label><textarea className="ftxt" style={{ minHeight:64 }} placeholder='ej: "Fondo oscuro, texto blanco grande, producto en primer plano, sin música muy fuerte"' value={manualStyle.visual} onChange={e=>setManualStyle(p=>({...p,visual:e.target.value}))} /></div>
              <div className="fg"><label className="flbl">Tono del copy</label><input className="finput" placeholder='ej: "Urgencia + beneficio directo, sin floritura, al punto"' value={manualStyle.tone} onChange={e=>setManualStyle(p=>({...p,tone:e.target.value}))} /></div>
              <div className="fg"><label className="flbl">CTA preferido</label><input className="finput" placeholder='ej: "Escribinos por WhatsApp y te mandamos info 💬"' value={manualStyle.cta} onChange={e=>setManualStyle(p=>({...p,cta:e.target.value}))} /></div>
              <div className="g2" style={{ gap:12 }}>
                <div className="fg"><label className="flbl">Audiencia target</label><input className="finput" placeholder="ej: Mujeres 25-40, interés moda" value={manualStyle.audience} onChange={e=>setManualStyle(p=>({...p,audience:e.target.value}))} /></div>
                <div className="fg"><label className="flbl">Plataforma principal</label>
                  <select className="fsel" value={manualStyle.platform} onChange={e=>setManualStyle(p=>({...p,platform:e.target.value}))}>
                    <option value="reels">Instagram / Facebook Reels</option>
                    <option value="stories">Stories</option>
                    <option value="feed">Feed (cuadrado 1:1)</option>
                    <option value="all">Todas las plataformas</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-p" style={{ alignSelf:"flex-start" }} onClick={saveManual} disabled={!manualStyle.hook&&!manualStyle.visual}>
                💾 Guardar instrucción de estilo
              </button>
            </div>
          </div>
        </div>
      )}

      {tab==="patterns"&&(
        <div>
          <div style={{ display:"flex",gap:10,marginBottom:14 }}>
            <div style={{ fontSize:13,color:C.textMuted,flex:1 }}>
              La IA usa estos patrones al generar creativos, copies y hooks para tus clientes.
            </div>
            <button className="btn btn-red btn-sm" onClick={()=>setPatterns(p=>p.map(x=>({...x,active:false})))}>Desactivar todos</button>
            <button className="btn btn-green btn-sm" onClick={()=>setPatterns(p=>p.map(x=>({...x,active:true})))}>Activar todos</button>
          </div>
          {patterns.length===0&&<div className="alert alert-blue">No hay patrones cargados. Analizá URLs o agregá instrucciones manuales.</div>}
          {patterns.map(p=>(
            <div key={p.id} className="card card-sm" style={{ marginBottom:10,display:"flex",gap:12,alignItems:"center",opacity:p.active?1:.5,transition:"opacity .2s" }}>
              <span style={{ fontSize:20 }}>{p.platform?.includes("TikTok")?"🎵":p.platform?.includes("Instagram")?"📸":p.platform?.includes("Facebook")||p.platform?.includes("Meta")?"📘":p.platform?.includes("Pinterest")?"📌":p.source==="Manual Admin"?"✍️":"🎨"}</span>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:3 }}>
                  <span style={{ fontWeight:500,fontSize:13 }}>"{p.hook}"</span>
                  <Tag t={p.type==="video"?"tp":"tb"}>{p.type}</Tag>
                  {p.score&&<span style={{ fontSize:10,color:C.green,fontFamily:"'DM Mono',monospace" }}>{p.score}/100</span>}
                </div>
                <div style={{ fontSize:11,color:C.textMuted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{p.style} · {p.source}</div>
              </div>
              <div style={{ fontSize:10,color:C.textDim,whiteSpace:"nowrap",fontFamily:"'DM Mono',monospace" }}>{p.date}</div>
              <button className={`tog${p.active?" on":""}`} onClick={()=>setPatterns(prev=>prev.map(x=>x.id===p.id?{...x,active:!x.active}:x))} />
              <button className="btn btn-red btn-sm" style={{ padding:"3px 7px" }} onClick={()=>setPatterns(prev=>prev.filter(x=>x.id!==p.id))}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ROOT ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("overview");
  const [users, setUsers] = useState(MOCK_USERS);
  const suspended = users.filter(u=>u.status==="suspended").length;

  const renderPage = () => {
    if (page==="overview") return <Overview users={users} onNavigate={setPage} />;
    if (page==="users") return <UsersPage users={users} setUsers={setUsers} />;
    if (page==="roles") return <RolesPage />;
    if (page==="billing") return <BillingPage users={users} />;
    if (page==="flags") return <FlagsPage />;
    if (page==="ai_training") return <AITrainingPage />;
    if (page==="audit") return <AuditPage />;
    if (page==="comms") return <CommsPage users={users} />;
    if (page==="system") return <SystemPage />;
  };

  return (
    <>
      <style>{css}</style>
      <div className="shell">
        {/* SIDEBAR */}
        <aside className="aside">
          <div className="logo-area">
            <div className="logo-row">
              <div className="logo-box">AI</div>
              <div>
                <div className="logo-txt">AI Commerce Ads</div>
                <div className="logo-badge">⚡ ADMIN PANEL</div>
              </div>
            </div>
          </div>

          <nav className="nav-area">
            <div className="nav-sec">Administración</div>
            {NAV.slice(0,4).map(n => (
              <button key={n.id} className={`nav-item${page===n.id?" act":""}`} onClick={()=>setPage(n.id)}>
                <span className="nav-ic">{n.icon}</span>
                {n.label}
                {n.id==="users" && suspended>0 && <span className="nav-cnt">{suspended}</span>}
              </button>
            ))}
            <div className="nav-sec" style={{ marginTop:8 }}>Sistema</div>
            {NAV.slice(4).map(n => (
              <button key={n.id} className={`nav-item${page===n.id?" act":""}`} onClick={()=>setPage(n.id)}>
                <span className="nav-ic">{n.icon}</span>
                {n.label}
              </button>
            ))}
          </nav>

          <div className="admin-profile">
            <div className="avatar">A</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>Alan Ugarte</div>
              <div style={{ fontSize:10,color:C.textMuted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>admin@aicommerceads.com</div>
            </div>
            <Tag t="tr">ADMIN</Tag>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main-col">
          <div className="topbar">
            <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,flex:1 }}>{PAGE_TITLES[page]}</div>
            <div style={{ display:"flex",alignItems:"center",gap:10,fontSize:12,color:C.textMuted,fontFamily:"'DM Mono',monospace",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,padding:"5px 11px" }}>
              🔴 LIVE &nbsp;·&nbsp; {new Date().toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"})}
            </div>
            <div style={{ fontSize:12,color:C.green,fontFamily:"'DM Mono',monospace" }}>●&nbsp;Sistema OK</div>
            <button className="btn btn-g" style={{ fontSize:12,padding:"6px 11px" }}>🔔</button>
          </div>
          {renderPage()}
        </div>
      </div>
    </>
  );
}
