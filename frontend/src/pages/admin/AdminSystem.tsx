import { useState } from 'react';
import { Tag, Toggle } from '../../components/ui';
import { C } from '../../styles/theme';

export default function AdminSystem() {
  const [maintenance, setMaintenance] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoReports, setAutoReports] = useState(true);

  return (
    <div className="page fa">
      <div className="sec-head" style={{ marginBottom: 20 }}>
        <div>
          <div className="sec-title">Sistema</div>
          <div className="sec-sub">Configuración global de la plataforma</div>
        </div>
      </div>

      <div className="g2" style={{ marginBottom: 18 }}>
        <div className="card">
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, marginBottom: 16 }}>Estado del sistema</div>
          {[
            { label: 'API Backend', status: 'online', sub: 'NestJS · localhost:3000' },
            { label: 'Base de datos', status: 'online', sub: 'PostgreSQL · pool activo' },
            { label: 'Meta Ads API', status: 'online', sub: 'Última sync hace 12min' },
            { label: 'Servicio de email', status: 'online', sub: 'SendGrid · activo' },
            { label: 'IA (Anthropic)', status: 'online', sub: 'Claude claude-sonnet-4-6 · activo' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: `1px solid ${C.border}22` }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.status === 'online' ? C.green : C.red, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>{s.sub}</div>
              </div>
              <Tag t={s.status === 'online' ? 'tg' : 'tr'}>{s.status}</Tag>
            </div>
          ))}
        </div>

        <div className="card">
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, marginBottom: 16 }}>Configuración global</div>
          {[
            { label: 'Modo mantenimiento', sub: 'Bloquea acceso a clientes', value: maintenance, onChange: setMaintenance, danger: true },
            { label: 'Notificaciones por email', sub: 'Enviar emails a usuarios', value: emailNotifications, onChange: setEmailNotifications },
            { label: 'Informes automáticos 20:00', sub: 'PDF diario enviado por email', value: autoReports, onChange: setAutoReports },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: `1px solid ${C.border}22` }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: item.danger && item.value ? C.red : C.text }}>{item.label}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>{item.sub}</div>
              </div>
              <Toggle checked={item.value} onChange={() => item.onChange(!item.value)} />
            </div>
          ))}

          {maintenance && (
            <div className="alert alert-red" style={{ marginTop: 14 }}>
              🚨 Los clientes no pueden acceder a la plataforma en este momento.
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, marginBottom: 14 }}>Información del sistema</div>
        <div className="g3">
          {[['Versión', 'v1.0.0'], ['Entorno', 'Production'], ['Node.js', '20.x'], ['NestJS', '10.x'], ['React', '19.x'], ['Base de datos', 'PostgreSQL 15']].map(([k, v]) => (
            <div key={k} style={{ padding: '9px 12px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8 }}>
              <div style={{ fontSize: 10, color: C.textMuted, fontFamily: "'DM Mono',monospace", marginBottom: 3 }}>{k}</div>
              <div style={{ fontSize: 13, fontWeight: 500, fontFamily: "'DM Mono',monospace" }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
