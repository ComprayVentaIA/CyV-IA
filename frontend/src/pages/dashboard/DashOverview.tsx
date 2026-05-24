import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Tag, MiniChart } from '../../components/ui';
import { C } from '../../styles/theme';

const CMPGS = [
  { id: 1, name: 'Zapatillas Nike Air - Reels', status: 'activa', ctr: '4.2%', leads: 82, roas: '4.1x' },
  { id: 2, name: 'Bolsos importados - Stories', status: 'activa', ctr: '3.8%', leads: 38, roas: '3.2x' },
  { id: 3, name: 'Ropa de invierno - Feed', status: 'pausada', ctr: '1.9%', leads: 9, roas: '1.2x' },
  { id: 4, name: 'Tecnología gaming - Carrusel', status: 'optimizando', ctr: '5.1%', leads: 179, roas: '5.8x' },
];

const INSIGHTS = [
  { i: '🚀', t: 'Gaming Carrusel: ROAS 5.8x → Subir a $60/día', x: 'tg' as const },
  { i: '⏸️', t: 'Ropa invierno: CTR 1.9%, ROAS 1.2x → Pausar hook', x: 'tr' as const },
  { i: '🎯', t: 'Mujeres 18-34 convierte 2.3x más → Aumentar bid', x: 'tb' as const },
  { i: '✏️', t: '\'Últimas unidades\' = CTR +40% → Aplicar a todas', x: 'ta' as const },
];

export default function DashOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.fullName?.split(' ')[0] ?? 'Equipo';

  return (
    <div className="content fade-in">
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, marginBottom: 3 }}>Buen día, {firstName} 👋</div>
        <div style={{ fontSize: 13, color: C.textMuted }}>8 campañas activas · Último informe enviado hace 3h</div>
      </div>

      <div className="g4" style={{ marginBottom: 18 }}>
        {[
          { label: 'ROI general', value: '4.3x', change: '+12% esta semana', up: true, chart: [3, 5, 4, 7, 6, 8, 9, 11], color: C.green },
          { label: 'Leads WhatsApp', value: '342', change: '+28 hoy', up: true, chart: [20, 25, 30, 28, 35, 38, 40, 45], color: C.accent },
          { label: 'CPC promedio', value: '$0.52', change: '-8% vs ayer', up: true, chart: [8, 7, 9, 6, 5, 6, 5, 4], color: C.blue },
          { label: 'Gasto total', value: '$1,358', change: '+$102 hoy', up: false, chart: [60, 80, 70, 90, 95, 100, 110, 120], color: C.amber },
        ].map(m => (
          <div key={m.label} className="card card-sm fade-in">
            <div className="m-lbl">{m.label}</div>
            <div className="m-val" style={{ color: m.color }}>{m.value}</div>
            <div className={`m-chg ${m.up ? 'up' : 'down'}`}><span>{m.up ? '▲' : '▼'}</span> {m.change}</div>
            <MiniChart data={m.chart} color={m.color} />
          </div>
        ))}
      </div>

      <div className="g2" style={{ marginBottom: 18 }}>
        <div className="card">
          <div className="sh">
            <div><div className="sh-title">Campañas activas</div><div className="sh-sub">Tiempo real</div></div>
            <Tag t="tg">8 activas</Tag>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>Campaña</th><th>CTR</th><th>Leads</th><th>ROAS</th></tr></thead>
              <tbody>
                {CMPGS.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>{c.name}</div>
                      <Tag t={c.status === 'activa' ? 'tg' : c.status === 'pausada' ? 'tr' : 'ta'}>{c.status}</Tag>
                    </td>
                    <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 12 }}>{c.ctr}</td>
                    <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 12 }}>{c.leads}</td>
                    <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: C.green }}>{c.roas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="sh">
            <div><div className="sh-title">Insights IA</div></div>
            <div className="ai-dots"><div className="ai-dot" /><div className="ai-dot" /><div className="ai-dot" /></div>
          </div>
          {INSIGHTS.map((ins, i) => (
            <div key={i} className="insight">
              <span style={{ fontSize: 15 }}>{ins.i}</span>
              <div style={{ flex: 1, fontSize: 12, lineHeight: 1.5 }}>{ins.t}</div>
              <Tag t={ins.x}>{ins.x === 'tg' ? 'Escalar' : ins.x === 'tr' ? 'Pausar' : ins.x === 'tb' ? 'Optimizar' : 'Editar'}</Tag>
            </div>
          ))}
        </div>
      </div>

      <div className="g3">
        {[
          ['⚡', 'Nueva campaña rápida', 'IA la configura en 60 seg', C.accent, '/dashboard/new-campaign'],
          ['🎨', 'Generar creativos', 'Video + imágenes automáticas', C.blue, '/dashboard/creatives'],
          ['📧', 'Ver informe de hoy', 'Generado a las 20:00', C.green, '/dashboard/reports'],
        ].map(([icon, title, sub, col, path]) => (
          <div key={path as string} className="card" style={{ cursor: 'pointer' }}
            onClick={() => navigate(path as string)}
            onMouseEnter={e => (e.currentTarget.style.borderColor = col as string)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
            <div style={{ fontSize: 22, marginBottom: 9 }}>{icon}</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{title}</div>
            <div style={{ fontSize: 12, color: C.textMuted }}>{sub}</div>
            <div style={{ marginTop: 11, fontSize: 11, color: col as string, fontFamily: "'DM Mono',monospace" }}>EJECUTAR →</div>
          </div>
        ))}
      </div>
    </div>
  );
}
