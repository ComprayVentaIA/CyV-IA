import { useState } from 'react';
import { Tag } from '../../components/ui';
import { C } from '../../styles/theme';

const MOCK_AUDIT = [
  { id: 'a1', user: 'Alan Ugarte', action: 'admin.update_plan_price', entity: 'plan', detail: 'starter → $59/mes', time: 'Hace 5min', ip: '192.168.1.1' },
  { id: 'a2', user: 'Alan Ugarte', action: 'admin.suspend_user', entity: 'user', detail: 'Laura Martínez', time: 'Hace 1h', ip: '192.168.1.1' },
  { id: 'a3', user: 'Alan Ugarte', action: 'admin.create_user', entity: 'user', detail: 'Equipo Soporte', time: 'Hace 3h', ip: '192.168.1.1' },
  { id: 'a4', user: 'María González', action: 'campaigns.publish', entity: 'campaign', detail: 'Nike Air - Reels', time: 'Hace 4h', ip: '200.10.5.22' },
  { id: 'a5', user: 'Alan Ugarte', action: 'admin.toggle_feature', entity: 'feature_flag', detail: 'api_access → false', time: 'Ayer 18:32', ip: '192.168.1.1' },
  { id: 'a6', user: 'Carlos Romero', action: 'campaigns.create', entity: 'campaign', detail: 'Gaming Carrusel', time: 'Ayer 14:15', ip: '181.24.8.90' },
  { id: 'a7', user: 'Alan Ugarte', action: 'admin.impersonate', entity: 'user', detail: 'Diego Fernández', time: 'Hace 2 días', ip: '192.168.1.1' },
  { id: 'a8', user: 'Alan Ugarte', action: 'admin.send_announcement', entity: 'announcement', detail: "'Nuevas funciones de IA'", time: 'Hace 3 días', ip: '192.168.1.1' },
];

function actionColor(action: string) {
  if (action.includes('suspend') || action.includes('block')) return C.red;
  if (action.includes('create') || action.includes('activate')) return C.green;
  if (action.includes('impersonate')) return C.amber;
  return C.accent;
}

function actionTag(action: string): 'tr' | 'tg' | 'ta' | 'tp' {
  if (action.includes('suspend') || action.includes('block')) return 'tr';
  if (action.includes('create') || action.includes('activate')) return 'tg';
  if (action.includes('impersonate')) return 'ta';
  return 'tp';
}

export default function AdminAudit() {
  const [search, setSearch] = useState('');

  const filtered = MOCK_AUDIT.filter(a =>
    !search || a.user.toLowerCase().includes(search.toLowerCase()) || a.action.toLowerCase().includes(search.toLowerCase()) || a.detail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page fa">
      <div className="sec-head">
        <div>
          <div className="sec-title">Audit Log</div>
          <div className="sec-sub">Registro de todas las acciones administrativas</div>
        </div>
        <Tag t="tg">{MOCK_AUDIT.length} entradas</Tag>
      </div>

      <div style={{ marginBottom: 16 }}>
        <input className="finput" placeholder="🔍 Buscar por usuario, acción o detalle..." style={{ maxWidth: 360 }} value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="tbl-scroll">
          <table>
            <thead>
              <tr><th>Acción</th><th>Usuario</th><th>Entidad</th><th>Detalle</th><th>IP</th><th>Tiempo</th></tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: actionColor(a.action), flexShrink: 0 }} />
                      <Tag t={actionTag(a.action)}>{a.action}</Tag>
                    </div>
                  </td>
                  <td style={{ fontSize: 13, fontWeight: 500 }}>{a.user}</td>
                  <td><Tag t="tk">{a.entity}</Tag></td>
                  <td style={{ fontSize: 12, color: C.textMuted }}>{a.detail}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: C.textDim }}>{a.ip}</td>
                  <td style={{ fontSize: 11, color: C.textMuted, whiteSpace: 'nowrap' }}>{a.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
