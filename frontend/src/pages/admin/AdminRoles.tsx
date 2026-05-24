import { Tag } from '../../components/ui';
import { C } from '../../styles/theme';

const ROLES = [
  { id: 'r1', name: 'admin', display: 'Administrador', color: C.red, desc: 'Acceso total al sistema', users: 1, perms: ['*'] },
  { id: 'r2', name: 'manager', display: 'Manager', color: C.accent, desc: 'Gestión de usuarios y campañas', users: 1, perms: ['campaigns.*', 'users.manage', 'admin.access'] },
  { id: 'r3', name: 'support', display: 'Soporte', color: C.blue, desc: 'Lectura y soporte a clientes', users: 1, perms: ['campaigns.read', 'reports.read', 'admin.access'] },
  { id: 'r4', name: 'client', display: 'Cliente', color: C.green, desc: 'Usuario estándar de la plataforma', users: 5, perms: ['campaigns.*', 'creatives.*', 'ai.*'] },
  { id: 'r5', name: 'subuser', display: 'Subusuario', color: C.amber, desc: 'Acceso limitado asignado por cliente', users: 0, perms: ['campaigns.read', 'reports.read'] },
];

const PLAN_PERMISSIONS = {
  starter: ['campaigns.create', 'campaigns.read', 'campaigns.update', 'campaigns.publish', 'creatives.create', 'creatives.read', 'ai.analyze', 'ai.generate_creatives', 'meta.connect', 'meta.publish', 'whatsapp.connect', 'reports.read', 'reports.export', 'billing.read'],
  growth: ['campaigns.delete', 'campaigns.duplicate', 'ai.optimize', 'meta.sync', 'whatsapp.track', 'reports.schedule', 'billing.manage', 'users.invite', 'integrations.manage'],
  scale: ['ai.advanced', 'users.manage'],
};

export default function AdminRoles() {
  return (
    <div className="page fa">
      <div className="sec-head" style={{ marginBottom: 20 }}>
        <div>
          <div className="sec-title">Roles & Permisos</div>
          <div className="sec-sub">Estructura de roles y permisos por plan</div>
        </div>
      </div>

      <div className="g2" style={{ marginBottom: 20 }}>
        {ROLES.map(r => (
          <div key={r.id} className="card" style={{ border: `1.5px solid ${r.color}33` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${r.color}22`, border: `2px solid ${r.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: r.color }}>
                {r.display[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14 }}>{r.display}</div>
                <div style={{ fontSize: 12, color: C.textMuted }}>{r.desc}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, color: C.textMuted }}>usuarios</div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontWeight: 700, color: r.color }}>{r.users}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {r.perms.map(p => <Tag key={p} t="tk">{p}</Tag>)}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Permisos por Plan</div>
        <div className="g3">
          {(Object.entries(PLAN_PERMISSIONS) as Array<[keyof typeof PLAN_PERMISSIONS, string[]]>).map(([plan, perms]) => (
            <div key={plan}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 13, color: plan === 'starter' ? C.green : plan === 'growth' ? C.accent : C.blue, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                {plan === 'growth' ? '+ Growth' : plan === 'scale' ? '+ Scale' : 'Starter'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {perms.map(p => (
                  <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                    <span style={{ color: C.green, fontSize: 10 }}>✓</span>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: C.textMuted }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
