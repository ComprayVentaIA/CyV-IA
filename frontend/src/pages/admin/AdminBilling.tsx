import { Tag } from '../../components/ui';
import { C } from '../../styles/theme';

const USERS = [
  { id: 'u1', name: 'María González', email: 'maria@ejemplo.com', plan: 'growth', planPrice: 99, status: 'active', nextBilling: '01/06/2026', since: 'Enero 2026' },
  { id: 'u2', name: 'Carlos Romero', email: 'carlos@ejemplo.com', plan: 'scale', planPrice: 199, status: 'active', nextBilling: '01/06/2026', since: 'Enero 2026' },
  { id: 'u3', name: 'Laura Martínez', email: 'laura@ejemplo.com', plan: 'starter', planPrice: 49, status: 'suspended', nextBilling: '—', since: 'Febrero 2026' },
  { id: 'u4', name: 'Diego Fernández', email: 'diego@ejemplo.com', plan: 'growth', planPrice: 99, status: 'active', nextBilling: '01/06/2026', since: 'Marzo 2026' },
  { id: 'u5', name: 'Valentina López', email: 'vale@ejemplo.com', plan: 'starter', planPrice: 49, status: 'active', nextBilling: '01/06/2026', since: 'Marzo 2026' },
];

const MRR = USERS.filter(u => u.status === 'active').reduce((sum, u) => sum + u.planPrice, 0);

export default function AdminBilling() {
  return (
    <div className="page fa">
      <div className="sec-head" style={{ marginBottom: 20 }}>
        <div>
          <div className="sec-title">Facturación Global</div>
          <div className="sec-sub">Ingresos y estado de suscripciones</div>
        </div>
      </div>

      <div className="g4" style={{ marginBottom: 18 }}>
        {[
          { label: 'MRR', value: `$${MRR}`, color: C.green, cls: 'green' },
          { label: 'ARR estimado', value: `$${MRR * 12}`, color: C.accent, cls: 'purple' },
          { label: 'Suscripciones activas', value: String(USERS.filter(u => u.status === 'active').length), color: C.blue, cls: 'blue' },
          { label: 'Suspendidas', value: String(USERS.filter(u => u.status !== 'active').length), color: C.amber, cls: 'amber' },
        ].map(k => (
          <div key={k.label} className={`kpi ${k.cls} fa`}>
            <div className="kpi-lbl">{k.label}</div>
            <div className="kpi-val" style={{ color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="g3" style={{ marginBottom: 18 }}>
        {[['Starter', USERS.filter(u => u.plan === 'starter').length, C.green, 49], ['Growth', USERS.filter(u => u.plan === 'growth').length, C.accent, 99], ['Scale', USERS.filter(u => u.plan === 'scale').length, C.blue, 199]].map(([name, n, col, price]) => (
          <div key={name as string} className="card" style={{ border: `1.5px solid ${col}33` }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, color: col as string }}>{name}</div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 22, fontWeight: 700, margin: '6px 0 3px' }}>${price}<span style={{ fontSize: 12, color: C.textMuted }}>/mes</span></div>
            <div style={{ fontSize: 13, color: C.textMuted }}>{n} usuario{(n as number) !== 1 ? 's' : ''}</div>
            <div style={{ marginTop: 8, fontFamily: "'DM Mono',monospace", fontSize: 14, color: col as string, fontWeight: 600 }}>${(n as number) * (price as number)}/mes</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 14, marginBottom: 14 }}>Suscripciones activas</div>
        <div className="tbl-scroll">
          <table>
            <thead>
              <tr><th>Usuario</th><th>Plan</th><th>Monto mensual</th><th>Estado</th><th>Próximo cobro</th><th>Miembro desde</th></tr>
            </thead>
            <tbody>
              {USERS.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{u.name}</div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>{u.email}</div>
                  </td>
                  <td><Tag t={u.plan === 'scale' ? 'tb' : u.plan === 'growth' ? 'tp' : 'tg'}>{u.plan}</Tag></td>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, fontWeight: 600 }}>${u.planPrice}</td>
                  <td><Tag t={u.status === 'active' ? 'tg' : 'ta'}>{u.status === 'active' ? 'Activo' : 'Suspendido'}</Tag></td>
                  <td style={{ fontSize: 12, color: C.textMuted }}>{u.nextBilling}</td>
                  <td style={{ fontSize: 12, color: C.textMuted }}>{u.since}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
