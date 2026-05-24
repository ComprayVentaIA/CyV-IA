import { useState } from 'react';
import { Tag, Confirm, Modal } from '../../components/ui';
import { C } from '../../styles/theme';

interface User {
  id: string; name: string; email: string; role: string; status: string;
  plan: string; planPrice: number; campaigns: number; leads: number;
  lastLogin: string; created: string;
}

const ROLE_COLORS: Record<string, 'tr' | 'tp' | 'tb' | 'tg' | 'ta'> = { admin: 'tr', manager: 'tp', support: 'tb', client: 'tg', subuser: 'ta' };
const STATUS_COLORS: Record<string, 'tg' | 'ta' | 'tr' | 'tb'> = { active: 'tg', suspended: 'ta', blocked: 'tr', pending_verification: 'tb' };
const STATUS_LABELS: Record<string, string> = { active: 'Activo', suspended: 'Suspendido', blocked: 'Bloqueado', pending_verification: 'Sin verificar' };

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'María González', email: 'maria@ejemplo.com', role: 'client', status: 'active', plan: 'growth', planPrice: 99, campaigns: 8, leads: 342, lastLogin: 'Hace 2h', created: '12/01/2026' },
  { id: 'u2', name: 'Carlos Romero', email: 'carlos@ejemplo.com', role: 'client', status: 'active', plan: 'scale', planPrice: 199, campaigns: 24, leads: 1240, lastLogin: 'Hace 15min', created: '05/01/2026' },
  { id: 'u3', name: 'Laura Martínez', email: 'laura@ejemplo.com', role: 'client', status: 'suspended', plan: 'starter', planPrice: 49, campaigns: 2, leads: 18, lastLogin: 'Hace 5 días', created: '20/02/2026' },
  { id: 'u4', name: 'Diego Fernández', email: 'diego@ejemplo.com', role: 'client', status: 'active', plan: 'growth', planPrice: 99, campaigns: 11, leads: 521, lastLogin: 'Ayer', created: '10/03/2026' },
  { id: 'u5', name: 'Equipo Soporte', email: 'soporte@aicommerceads.com', role: 'support', status: 'active', plan: 'scale', planPrice: 199, campaigns: 0, leads: 0, lastLogin: 'Hace 1h', created: '01/01/2026' },
  { id: 'u6', name: 'Valentina López', email: 'vale@ejemplo.com', role: 'client', status: 'active', plan: 'starter', planPrice: 49, campaigns: 3, leads: 87, lastLogin: 'Hace 3 días', created: '14/03/2026' },
];

export default function AdminUsers() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState<User | null>(null);
  const [confirm, setConfirm] = useState<{ type: string; user: User } | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const filtered = users.filter(u =>
    (!search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) &&
    (!roleFilter || u.role === roleFilter) &&
    (!statusFilter || u.status === statusFilter)
  );

  const doAction = (userId: string, action: string, extra?: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== userId) return u;
      if (action === 'activate') return { ...u, status: 'active' };
      if (action === 'suspend') return { ...u, status: 'suspended' };
      if (action === 'block') return { ...u, status: 'blocked' };
      if (action === 'plan') return { ...u, plan: extra!, planPrice: extra === 'starter' ? 49 : extra === 'growth' ? 99 : 199 };
      return u;
    }));
    setSelected(null);
    showToast(`Acción ejecutada: ${action}`);
  };

  return (
    <div className="page fa">
      {toast && <div style={{ position: 'fixed', top: 16, right: 16, background: C.green, color: '#fff', padding: '9px 16px', borderRadius: 9, fontSize: 13, fontWeight: 500, zIndex: 999 }}>✅ {toast}</div>}

      <div className="sec-head" style={{ marginBottom: 16 }}>
        <div>
          <div className="sec-title">Gestión de usuarios</div>
          <div className="sec-sub">{users.length} usuarios · {users.filter(u => u.status === 'active').length} activos</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <input className="finput" placeholder="🔍 Buscar por nombre o email..." style={{ maxWidth: 280 }} value={search} onChange={e => setSearch(e.target.value)} />
        <select className="fsel" style={{ maxWidth: 140 }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="">Todos los roles</option>
          {['admin', 'manager', 'support', 'client', 'subuser'].map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select className="fsel" style={{ maxWidth: 150 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="suspended">Suspendidos</option>
          <option value="blocked">Bloqueados</option>
        </select>
        {(search || roleFilter || statusFilter) && <button className="btn btn-g btn-sm" onClick={() => { setSearch(''); setRoleFilter(''); setStatusFilter(''); }}>✕ Limpiar</button>}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="tbl-scroll">
          <table>
            <thead>
              <tr><th>Usuario</th><th>Rol</th><th>Plan</th><th>Estado</th><th>Campañas</th><th>Leads</th><th>Último acceso</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: C.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{u.name[0]}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{u.name}</div>
                        <div style={{ fontSize: 11, color: C.textMuted }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><Tag t={ROLE_COLORS[u.role] ?? 'tk' as 'tr'}>{u.role}</Tag></td>
                  <td>
                    <div style={{ fontSize: 12 }}>{u.plan}</div>
                    <div style={{ fontSize: 10, color: C.textMuted, fontFamily: "'DM Mono',monospace" }}>${u.planPrice}/mes</div>
                  </td>
                  <td><Tag t={STATUS_COLORS[u.status] ?? 'tk' as 'tg'}>{STATUS_LABELS[u.status] ?? u.status}</Tag></td>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 12 }}>{u.campaigns}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: C.accent }}>{u.leads}</td>
                  <td style={{ fontSize: 11, color: C.textMuted }}>{u.lastLogin}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      <button className="btn btn-g btn-sm" onClick={() => setSelected(u)}>Ver</button>
                      {u.status === 'active' && <button className="btn btn-amber btn-sm" onClick={() => setConfirm({ type: 'suspend', user: u })}>Suspender</button>}
                      {u.status === 'suspended' && <button className="btn btn-green btn-sm" onClick={() => doAction(u.id, 'activate')}>Activar</button>}
                      {u.status !== 'blocked' && <button className="btn btn-red btn-sm" onClick={() => setConfirm({ type: 'block', user: u })}>Bloquear</button>}
                      {u.status === 'blocked' && <button className="btn btn-green btn-sm" onClick={() => doAction(u.id, 'activate')}>Desbloquear</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <Modal title={selected.name} onClose={() => setSelected(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
            {[['Email', selected.email], ['Rol', selected.role], ['Plan', `${selected.plan} — $${selected.planPrice}/mes`], ['Estado', STATUS_LABELS[selected.status] ?? selected.status], ['Campañas', String(selected.campaigns)], ['Leads', String(selected.leads)], ['Miembro desde', selected.created], ['Último acceso', selected.lastLogin]].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: `1px solid ${C.border}22` }}>
                <span style={{ color: C.textMuted }}>{k}</span><span style={{ fontWeight: 500 }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>Cambiar plan</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {['starter', 'growth', 'scale'].map(p => (
                  <button key={p} className={`btn ${selected.plan === p ? 'btn-p' : 'btn-g'} btn-sm`} onClick={() => doAction(selected.id, 'plan', p)}>{p}</button>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {confirm?.type === 'suspend' && (
        <Confirm
          message={`¿Suspender a ${confirm.user.name}?`}
          detail="El usuario no podrá acceder hasta que lo actives nuevamente."
          onConfirm={() => { doAction(confirm.user.id, 'suspend'); setConfirm(null); showToast('Usuario suspendido'); }}
          onCancel={() => setConfirm(null)}
          danger
        />
      )}
      {confirm?.type === 'block' && (
        <Confirm
          message={`¿Bloquear a ${confirm.user.name}?`}
          detail="Se revocarán todos sus tokens. No podrá iniciar sesión."
          onConfirm={() => { doAction(confirm.user.id, 'block'); setConfirm(null); showToast('Usuario bloqueado'); }}
          onCancel={() => setConfirm(null)}
          danger
        />
      )}
    </div>
  );
}
