import { useNavigate } from 'react-router-dom';
import { C } from '../../styles/theme';

const AUDIT_PREVIEW = [
  { action: 'admin.update_plan_price', user: 'Alan Ugarte', detail: 'starter → $59/mes', time: 'Hace 5min', color: '#7c5cfc' },
  { action: 'admin.suspend_user', user: 'Alan Ugarte', detail: 'Laura Martínez', time: 'Hace 1h', color: '#ff4d6a' },
  { action: 'admin.create_user', user: 'Alan Ugarte', detail: 'Equipo Soporte', time: 'Hace 3h', color: '#00d68f' },
  { action: 'campaigns.publish', user: 'María González', detail: 'Nike Air - Reels', time: 'Hace 4h', color: '#7c5cfc' },
  { action: 'admin.toggle_feature', user: 'Alan Ugarte', detail: 'api_access → false', time: 'Ayer 18:32', color: '#ffb347' },
];

export default function AdminOverview() {
  const navigate = useNavigate();

  return (
    <div className="page fa">
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, marginBottom: 3 }}>Panel de Administración</div>
        <div style={{ fontSize: 13, color: C.textMuted }}>Vista global del sistema</div>
      </div>

      <div className="g5" style={{ marginBottom: 18 }}>
        {[
          { label: 'MRR', value: '$8,940', change: '+$1,200 vs mes ant.', color: C.green },
          { label: 'Usuarios activos', value: '6', change: '+3 este mes', color: C.accent },
          { label: 'Tasa de churn', value: '2.3%', change: '-0.5% este mes', color: C.blue },
          { label: 'Suspendidos', value: '1', sub: 'Requieren atención', color: C.amber },
          { label: 'ARR', value: '$107k', change: '+14% YoY', color: C.green },
        ].map(kpi => (
          <div key={kpi.label} className={`kpi ${kpi.color === C.green ? 'green' : kpi.color === C.accent ? 'purple' : kpi.color === C.blue ? 'blue' : kpi.color === C.amber ? 'amber' : 'purple'} fa`}>
            <div className="kpi-lbl">{kpi.label}</div>
            <div className="kpi-val">{kpi.value}</div>
            {kpi.change && <div className="kpi-chg up" style={{ color: C.green }}>▲ {kpi.change}</div>}
            {kpi.sub && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{kpi.sub}</div>}
          </div>
        ))}
      </div>

      <div className="g2" style={{ marginBottom: 18 }}>
        <div className="card">
          <div className="sec-head"><div><div className="sec-title">Distribución de planes</div></div></div>
          {[['Scale — $199/mes', 2, C.accent, 20], ['Growth — $99/mes', 4, C.blue, 40], ['Starter — $49/mes', 1, C.green, 10]].map(([plan, n, col, w]) => (
            <div key={plan as string} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 13 }}>
                <span>{plan}</span>
                <span style={{ color: C.textMuted, fontFamily: "'DM Mono',monospace" }}>{n} usuarios</span>
              </div>
              <div className="prog"><div className="prog-bar" style={{ width: `${w}%`, background: col as string }} /></div>
            </div>
          ))}
          <button className="btn btn-g btn-sm" onClick={() => navigate('/admin/billing')}>Ver facturación</button>
        </div>

        <div className="card">
          <div className="sec-head"><div className="sec-title">Actividad reciente</div></div>
          {AUDIT_PREVIEW.map((a, i) => (
            <div key={i} className="act-item">
              <div className="act-dot" style={{ background: a.color }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 500 }}>{a.action}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>{a.user} · {a.detail}</div>
              </div>
              <div style={{ fontSize: 10, color: C.textDim, fontFamily: "'DM Mono',monospace", whiteSpace: 'nowrap' }}>{a.time}</div>
            </div>
          ))}
          <button className="btn btn-g btn-sm" style={{ marginTop: 12 }} onClick={() => navigate('/admin/audit')}>Ver todo el log →</button>
        </div>
      </div>

      <div className="g3">
        {[
          { icon: '👥', title: 'Nuevo usuario', sub: 'Crear cuenta manualmente', color: C.accent, path: '/admin/users' },
          { icon: '📢', title: 'Enviar anuncio', sub: 'Comunicar a todos los clientes', color: C.blue, path: '/admin/comms' },
          { icon: '🚩', title: 'Feature flags', sub: 'Activar/desactivar funciones', color: C.amber, path: '/admin/flags' },
        ].map(a => (
          <div key={a.path} className="card" style={{ cursor: 'pointer', transition: 'all .15s' }} onClick={() => navigate(a.path)}
            onMouseEnter={e => (e.currentTarget.style.borderColor = a.color)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
            <div style={{ fontSize: 22, marginBottom: 9 }}>{a.icon}</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 13, marginBottom: 3 }}>{a.title}</div>
            <div style={{ fontSize: 12, color: C.textMuted }}>{a.sub}</div>
            <div style={{ marginTop: 10, fontSize: 11, color: a.color, fontFamily: "'DM Mono',monospace" }}>EJECUTAR →</div>
          </div>
        ))}
      </div>
    </div>
  );
}
