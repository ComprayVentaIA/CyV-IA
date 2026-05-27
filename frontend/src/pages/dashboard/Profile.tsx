import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Spinner, Toggle } from '../../components/ui';
import { C } from '../../styles/theme';

type Tab = 'info' | 'security' | 'notifications' | 'danger';

const PLAN_LABELS: Record<string, string> = { starter: 'Starter', growth: 'Growth', scale: 'Scale' };
const PLAN_COLORS: Record<string, string> = { starter: C.green, growth: C.accent, scale: C.blue };

export default function Profile() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<Tab>('info');

  // info tab
  const [name, setName] = useState(user?.fullName ?? '');
  const [email] = useState(user?.email ?? '');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoOk, setInfoOk] = useState('');

  // security tab
  const [curPwd, setCurPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confPwd, setConfPwd] = useState('');
  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdOk, setPwdOk] = useState('');
  const [pwdErr, setPwdErr] = useState('');

  // notifications tab
  const [notifs, setNotifs] = useState({
    dailyReport: true,
    campaignAlerts: true,
    leadNotifs: true,
    weeklyDigest: false,
    productUpdates: false,
  });

  // danger tab
  const [deleteInput, setDeleteInput] = useState('');
  const [deleting, setDeleting] = useState(false);

  const plan = (user?.plan ?? 'growth') as string;
  const planColor = PLAN_COLORS[plan] ?? C.accent;
  const planLabel = PLAN_LABELS[plan] ?? 'Growth';
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'U';

  const saveInfo = async () => {
    if (!name.trim()) return;
    setSavingInfo(true);
    await new Promise(r => setTimeout(r, 900));
    setSavingInfo(false);
    setInfoOk('✅ Perfil actualizado correctamente');
    setTimeout(() => setInfoOk(''), 3500);
  };

  const savePwd = async () => {
    setPwdErr(''); setPwdOk('');
    if (!curPwd || !newPwd || !confPwd) { setPwdErr('Completá todos los campos'); return; }
    if (newPwd.length < 8) { setPwdErr('La nueva contraseña debe tener al menos 8 caracteres'); return; }
    if (newPwd !== confPwd) { setPwdErr('Las contraseñas no coinciden'); return; }
    setSavingPwd(true);
    await new Promise(r => setTimeout(r, 1100));
    setSavingPwd(false);
    setPwdOk('✅ Contraseña actualizada');
    setCurPwd(''); setNewPwd(''); setConfPwd('');
    setTimeout(() => setPwdOk(''), 3500);
  };

  const saveNotifs = async () => {
    await new Promise(r => setTimeout(r, 400));
  };

  const toggle = (k: keyof typeof notifs) => {
    setNotifs(p => ({ ...p, [k]: !p[k] }));
    saveNotifs();
  };

  const handleDelete = async () => {
    if (deleteInput !== 'ELIMINAR') return;
    setDeleting(true);
    await new Promise(r => setTimeout(r, 1500));
    logout();
  };

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'info', label: 'Información', icon: '👤' },
    { id: 'security', label: 'Seguridad', icon: '🔒' },
    { id: 'notifications', label: 'Notificaciones', icon: '🔔' },
    { id: 'danger', label: 'Cuenta', icon: '⚠️' },
  ];

  return (
    <div className="content fade-in" style={{ maxWidth: 780 }}>

      {/* Header card */}
      <div className="card" style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: C.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: '#fff', flexShrink: 0, boxShadow: `0 0 0 3px ${C.accentDim}` }}>
          {initials}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 17, marginBottom: 3 }}>{name || 'Mi perfil'}</div>
          <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 6 }}>{email}</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${planColor}15`, border: `1px solid ${planColor}40`, borderRadius: 6, padding: '3px 10px', fontSize: 11, color: planColor, fontFamily: "'DM Mono',monospace" }}>
            ✦ Plan {planLabel}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center', padding: '10px 18px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 9 }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 20, color: C.accent }}>12</div>
            <div style={{ fontSize: 10, color: C.textMuted, fontFamily: "'DM Mono',monospace" }}>CAMPAÑAS</div>
          </div>
          <div style={{ textAlign: 'center', padding: '10px 18px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 9 }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 20, color: C.green }}>342</div>
            <div style={{ fontSize: 10, color: C.textMuted, fontFamily: "'DM Mono',monospace" }}>LEADS</div>
          </div>
          <div style={{ textAlign: 'center', padding: '10px 18px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 9 }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 20, color: C.blue }}>4.3x</div>
            <div style={{ fontSize: 10, color: C.textMuted, fontFamily: "'DM Mono',monospace" }}>ROAS</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: C.bg, borderRadius: 10, padding: 3, marginBottom: 18, flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '8px 16px', borderRadius: 8, border: tab === t.id ? `1px solid ${C.border}` : 'none', background: tab === t.id ? C.surface : 'transparent', color: tab === t.id ? C.text : C.textMuted, cursor: 'pointer', fontSize: 12.5, fontWeight: tab === t.id ? 500 : 400, transition: 'all .15s', fontFamily: "'DM Sans',sans-serif', display: 'flex", alignItems: 'center', gap: 6 }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── INFO TAB ── */}
      {tab === 'info' && (
        <div className="card">
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 14, marginBottom: 18 }}>Información personal</div>
          {infoOk && <div className="ok-box">{infoOk}</div>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="fg" style={{ gridColumn: '1/-1' }}>
              <label className="flbl">Nombre completo</label>
              <input className="finput" value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre completo" />
            </div>
            <div className="fg">
              <label className="flbl">Email</label>
              <input className="finput" value={email} disabled style={{ opacity: .6, cursor: 'not-allowed' }} />
            </div>
            <div className="fg">
              <label className="flbl">Teléfono / WhatsApp</label>
              <input className="finput" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+54 9 11 xxxx-xxxx" />
            </div>
            <div className="fg" style={{ gridColumn: '1/-1' }}>
              <label className="flbl">Empresa / Negocio</label>
              <input className="finput" value={company} onChange={e => setCompany(e.target.value)} placeholder="Nombre de tu marca o empresa" />
            </div>
          </div>
          <div style={{ marginTop: 18, display: 'flex', gap: 10, alignItems: 'center' }}>
            <button className="btn btn-p" style={{ padding: '10px 24px' }} onClick={saveInfo} disabled={savingInfo}>
              {savingInfo ? <><Spinner color="#fff" /> Guardando...</> : 'Guardar cambios'}
            </button>
          </div>
        </div>
      )}

      {/* ── SECURITY TAB ── */}
      {tab === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card">
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 14, marginBottom: 18 }}>Cambiar contraseña</div>
            {pwdErr && <div className="err-box">{pwdErr}</div>}
            {pwdOk && <div className="ok-box">{pwdOk}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              <div className="fg">
                <label className="flbl">Contraseña actual</label>
                <input className="finput" type="password" placeholder="••••••••" value={curPwd} onChange={e => { setCurPwd(e.target.value); setPwdErr(''); }} />
              </div>
              <div className="fg">
                <label className="flbl">Nueva contraseña</label>
                <input className="finput" type="password" placeholder="Mínimo 8 caracteres" value={newPwd} onChange={e => { setNewPwd(e.target.value); setPwdErr(''); }} />
              </div>
              <div className="fg">
                <label className="flbl">Confirmar nueva contraseña</label>
                <input className="finput" type="password" placeholder="••••••••" value={confPwd} onChange={e => { setConfPwd(e.target.value); setPwdErr(''); }} />
              </div>
            </div>
            {newPwd.length > 0 && (
              <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[['8+ caracteres', newPwd.length >= 8], ['Mayúscula', /[A-Z]/.test(newPwd)], ['Número', /\d/.test(newPwd)]].map(([lbl, ok]) => (
                  <div key={String(lbl)} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 5, background: ok ? C.greenDim : C.redDim, color: ok ? C.green : C.red, fontFamily: "'DM Mono',monospace" }}>
                    {ok ? '✓' : '✗'} {lbl}
                  </div>
                ))}
              </div>
            )}
            <button className="btn btn-p" style={{ marginTop: 18, padding: '10px 24px' }} onClick={savePwd} disabled={savingPwd}>
              {savingPwd ? <><Spinner color="#fff" /> Actualizando...</> : 'Actualizar contraseña'}
            </button>
          </div>

          <div className="card">
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 14, marginBottom: 14 }}>Sesiones activas</div>
            {[
              { device: 'Chrome · Windows 10', loc: 'Buenos Aires, AR', time: 'Ahora', current: true },
              { device: 'Safari · iPhone 15', loc: 'Buenos Aires, AR', time: 'Hace 2h', current: false },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i === 0 ? `1px solid ${C.border}22` : 'none' }}>
                <span style={{ fontSize: 22 }}>{s.device.includes('iPhone') ? '📱' : '💻'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{s.device}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'DM Mono',monospace" }}>{s.loc} · {s.time}</div>
                </div>
                {s.current
                  ? <div style={{ fontSize: 10, color: C.green, background: C.greenDim, border: `1px solid ${C.green}33`, borderRadius: 4, padding: '2px 7px', fontFamily: "'DM Mono',monospace" }}>Esta sesión</div>
                  : <button className="btn btn-d" style={{ fontSize: 11, padding: '4px 10px' }}>Cerrar</button>
                }
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── NOTIFICATIONS TAB ── */}
      {tab === 'notifications' && (
        <div className="card">
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 14, marginBottom: 18 }}>Preferencias de notificaciones</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {([
              ['dailyReport', '📧 Informe diario IA', 'Recibís el análisis de campañas a las 20:00 hs por email'],
              ['campaignAlerts', '🚨 Alertas de campañas', 'Notificación si una campaña baja de un ROAS mínimo'],
              ['leadNotifs', '💬 Nuevos leads WhatsApp', 'Aviso cuando llegan leads desde tus anuncios'],
              ['weeklyDigest', '📊 Resumen semanal', 'Reporte comparativo cada lunes a las 09:00 hs'],
              ['productUpdates', '✨ Novedades de CONVERSIA', 'Nuevas features y mejoras de la plataforma'],
            ] as [keyof typeof notifs, string, string][]).map(([key, label, desc]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 14px', background: C.bg, borderRadius: 9, border: `1px solid ${C.border}`, marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{desc}</div>
                </div>
                <Toggle checked={notifs[key]} onChange={() => toggle(key)} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, padding: '10px 13px', background: C.accentDim, border: `1px solid ${C.accent}33`, borderRadius: 8, fontSize: 12, color: C.accent }}>
            💡 Las notificaciones de leads y alertas se envían por email a <strong>{email}</strong>
          </div>
        </div>
      )}

      {/* ── DANGER TAB ── */}
      {tab === 'danger' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card">
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 14, marginBottom: 5 }}>Exportar mis datos</div>
            <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 14, lineHeight: 1.6 }}>Descargá todos tus datos: campañas, creativos, leads y configuración en formato JSON.</div>
            <button className="btn btn-g" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              📥 Descargar mis datos
            </button>
          </div>

          <div className="card" style={{ border: `1.5px solid ${C.red}33` }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 14, marginBottom: 5, color: C.red }}>⚠️ Eliminar cuenta</div>
            <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 14, lineHeight: 1.6 }}>
              Esta acción es <strong style={{ color: C.text }}>permanente e irreversible</strong>. Se borrarán todas tus campañas, creativos, leads e integraciones.
            </div>
            <div style={{ padding: '12px 14px', background: C.redDim, border: `1px solid ${C.red}22`, borderRadius: 8, marginBottom: 14, fontSize: 12, color: C.red, lineHeight: 1.6 }}>
              Para confirmar, escribí <strong>ELIMINAR</strong> en el campo de abajo.
            </div>
            <div className="fg" style={{ marginBottom: 12 }}>
              <label className="flbl">Confirmación</label>
              <input className="finput" placeholder="ELIMINAR" value={deleteInput} onChange={e => setDeleteInput(e.target.value)} style={{ borderColor: deleteInput === 'ELIMINAR' ? C.red : undefined }} />
            </div>
            <button
              className="btn"
              style={{ background: C.redDim, color: C.red, border: `1px solid ${C.red}44`, opacity: deleteInput === 'ELIMINAR' ? 1 : 0.45, cursor: deleteInput === 'ELIMINAR' ? 'pointer' : 'not-allowed' }}
              onClick={handleDelete}
              disabled={deleteInput !== 'ELIMINAR' || deleting}
            >
              {deleting ? <><Spinner color={C.red} /> Eliminando...</> : '🗑️ Eliminar mi cuenta permanentemente'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
