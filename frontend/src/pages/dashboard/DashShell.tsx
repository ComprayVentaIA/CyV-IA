import { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { C } from '../../styles/theme';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊', end: true },
  { path: '/dashboard/campaigns', label: 'Campañas', icon: '📣' },
  { path: '/dashboard/new-campaign', label: 'Nueva campaña', icon: '✨' },
  { path: '/dashboard/creatives', label: 'Creativos IA', icon: '🎨' },
  { path: '/dashboard/conversia-ia', label: 'Conversia IA', icon: '🧠', highlight: true },
  { path: '/dashboard/reports', label: 'Reportes', icon: '📈' },
  { path: '/dashboard/integrations', label: 'Integraciones', icon: '🔗' },
  { path: '/dashboard/billing', label: 'Facturación', icon: '💳' },
  { path: '/dashboard/profile', label: 'Mi perfil', icon: '👤' },
];

const BOTTOM_NAV = [
  { path: '/dashboard', label: 'Inicio', icon: '📊', end: true },
  { path: '/dashboard/campaigns', label: 'Campañas', icon: '📣' },
  { path: '/dashboard/new-campaign', label: 'Crear', icon: '✨' },
  { path: '/dashboard/creatives', label: 'Creativos', icon: '🎨' },
  { path: '/dashboard/conversia-ia', label: 'IA', icon: '🧠' },
];

export default function DashShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobOpen, setMobOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = (path: string, end = false) =>
    end ? location.pathname === path : location.pathname.startsWith(path);

  const navTo = (path: string) => { navigate(path); setMobOpen(false); };

  const pageTitle = NAV_ITEMS.find(n =>
    (n as any).end ? location.pathname === n.path : location.pathname.startsWith(n.path)
  )?.label ?? 'Dashboard';

  return (
    <div className="app">
      <div className={`mob-overlay${mobOpen ? ' open' : ''}`} onClick={() => setMobOpen(false)} />
      <aside className={`sidebar${mobOpen ? ' mob-open' : ''}`}>
        <div className="logo-wrap">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="logo">
              <div className="logo-icon" style={{ fontSize: 14, fontWeight: 800 }}>C</div>
              <div className="logo-txt">CONVERSIA<div className="logo-sub">ADS SUITE</div></div>
            </div>
            <button style={{ display: 'none', background: 'none', border: 'none', color: C.textMuted, fontSize: 18, cursor: 'pointer', padding: 4 }} className="mob-close-btn" onClick={() => setMobOpen(false)}>✕</button>
          </div>
        </div>
        <nav className="nav">
          <div className="nav-lbl">Principal</div>
          {NAV_ITEMS.slice(0, 7).map(n => (
            <button
              key={n.path}
              className={`nav-btn${isActive(n.path, n.end) ? ' active' : ''}`}
              onClick={() => navTo(n.path)}
              style={(n as any).highlight && !isActive(n.path) ? { background: 'linear-gradient(135deg,#7c5cfc14,#4da6ff14)', border: '1px solid #7c5cfc33', color: '#9d80ff' } : {}}
            >
              <span className="nav-icon">{n.icon}</span>{n.label}
              {(n as any).highlight && <span style={{ marginLeft: 'auto', fontSize: 8, background: 'linear-gradient(135deg,#7c5cfc,#4da6ff)', color: '#fff', padding: '1px 5px', borderRadius: 4, fontFamily: "'DM Mono',monospace" }}>IA</span>}
            </button>
          ))}
          <div className="nav-lbl" style={{ marginTop: 6 }}>Cuenta</div>
          {NAV_ITEMS.slice(7).map(n => (
            <button key={n.path} className={`nav-btn${isActive(n.path) ? ' active' : ''}`} onClick={() => navTo(n.path)}>
              <span className="nav-icon">{n.icon}</span>{n.label}
            </button>
          ))}
          {user?.role === 'admin' && (
            <button className="nav-btn" onClick={() => navTo('/admin')}>
              <span className="nav-icon">⚙️</span>Admin
              <span className="nav-badge">ADMIN</span>
            </button>
          )}
          <button className="nav-btn" onClick={logout} style={{ marginTop: 5 }}><span className="nav-icon">🚪</span>Cerrar sesión</button>
        </nav>
        <div className="sidebar-foot">
          <div className="plan-card">
            <div className="plan-lbl">Plan activo</div>
            <div className="plan-name">{(user?.plan ?? 'Growth').toUpperCase()}</div>
            <div className="bar-wrap"><div className="bar" style={{ width: '62%' }} /></div>
            <div style={{ fontSize: 10, color: C.textMuted, marginTop: 4, fontFamily: "'DM Mono',monospace" }}>12/∞ campañas</div>
          </div>
        </div>
      </aside>
      <main className="main-area">
        <div className="topbar">
          <button className="hamburger" onClick={() => setMobOpen(true)} aria-label="Abrir menú">
            <span /><span /><span />
          </button>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, flex: 1 }} className="topbar-title-txt">{pageTitle}</div>
          <div style={{ fontSize: 12, color: C.textMuted, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '6px 12px' }} className="topbar-search-wrap">🔍 Buscar…</div>
          <button className="btn btn-g" style={{ fontSize: 12, padding: '6px 10px' }}>🔔</button>
          <div ref={avatarRef} style={{ position: 'relative' }}>
            <div
              onClick={() => setAvatarOpen(v => !v)}
              style={{ width: 28, height: 28, borderRadius: '50%', background: C.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, cursor: 'pointer', flexShrink: 0, border: avatarOpen ? `2px solid ${C.accent}` : '2px solid transparent', transition: 'border-color .15s' }}
            >
              {user?.fullName?.[0]?.toUpperCase() ?? 'U'}
            </div>
            {avatarOpen && (
              <div style={{ position: 'absolute', top: 36, right: 0, background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: 6, minWidth: 190, zIndex: 200, boxShadow: '0 12px 40px #00000066' }} className="scale-in">
                <div style={{ padding: '8px 12px', borderBottom: `1px solid ${C.border}`, marginBottom: 4 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.fullName ?? 'Usuario'}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email ?? ''}</div>
                </div>
                {[
                  { icon: '👤', label: 'Mi perfil', path: '/dashboard/profile' },
                  { icon: '💳', label: 'Facturación', path: '/dashboard/billing' },
                  { icon: '🔗', label: 'Integraciones', path: '/dashboard/integrations' },
                ].map(item => (
                  <button key={item.path} onClick={() => { navTo(item.path); setAvatarOpen(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '8px 12px', borderRadius: 8, border: 'none', background: 'none', color: C.textMuted, cursor: 'pointer', fontSize: 13, textAlign: 'left', transition: 'all .12s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = C.bg; (e.currentTarget as HTMLButtonElement).style.color = C.text; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; (e.currentTarget as HTMLButtonElement).style.color = C.textMuted; }}>
                    <span style={{ fontSize: 14 }}>{item.icon}</span>{item.label}
                  </button>
                ))}
                <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 4, paddingTop: 4 }}>
                  <button onClick={() => { logout(); setAvatarOpen(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '8px 12px', borderRadius: 8, border: 'none', background: 'none', color: C.red, cursor: 'pointer', fontSize: 13, textAlign: 'left', transition: 'all .12s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = C.redDim}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'none'}>
                    <span style={{ fontSize: 14 }}>🚪</span>Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
          <button className="btn btn-p" style={{ fontSize: 12, whiteSpace: 'nowrap' }} onClick={() => navTo('/dashboard/new-campaign')}>+ Campaña</button>
        </div>
        <Outlet />
        <nav className="bottom-nav">
          {BOTTOM_NAV.map(n => (
            <button key={n.path} className={`bnav-item${isActive(n.path, n.end) ? ' active' : ''}`} onClick={() => navTo(n.path)}>
              <span className="bnav-icon">{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
}
