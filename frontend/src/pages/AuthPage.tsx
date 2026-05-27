import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from '../components/ui';
import { C } from '../styles/theme';
import type { Plan } from '../types';

interface LocationState {
  plan?: Plan;
  tab?: 'login' | 'register';
}

export default function AuthPage() {
  const navigate = useNavigate();
  const { state: locState } = useLocation() as { state: LocationState | null };
  const { login, register } = useAuth();

  const plan = locState?.plan ?? null;
  const [tab, setTab] = useState<'login' | 'register'>(locState?.tab ?? 'login');
  const [form, setForm] = useState({ email: '', password: '', name: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  const set = (k: string, v: string) => { setForm(p => ({ ...p, [k]: v })); setErr(''); };

  const doLogin = async () => {
    if (!form.email || !form.password) { setErr('Completá todos los campos'); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setErr(msg ?? 'Email o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  const doRegister = async () => {
    if (!form.email || !form.password || !form.name) { setErr('Completá todos los campos'); return; }
    if (form.password.length < 8) { setErr('Contraseña mínimo 8 caracteres'); return; }
    if (form.password !== form.confirm) { setErr('Las contraseñas no coinciden'); return; }
    setLoading(true);
    try {
      const msg = await register(form.email, form.password, form.name);
      if (plan) {
        navigate('/checkout', { state: { plan } });
      } else {
        setOk(msg ?? 'Revisá tu email para verificar tu cuenta.');
      }
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setErr(msg ?? 'Error al registrar. Intentá nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <button className="btn btn-g" style={{ position: 'fixed', top: 20, left: 20, fontSize: 12 }} onClick={() => navigate('/')}>← Volver</button>
      <div className="auth-card fade-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 26 }}>
          <div className="logo-icon" style={{ width: 34, height: 34, fontSize: 14 }}>C</div>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: '.01em' }}>CONVERSIA</div>
            <div style={{ fontSize: 9, color: C.textMuted, fontFamily: "'DM Mono',monospace", letterSpacing: '.1em' }}>ADS SUITE</div>
          </div>
        </div>
        {plan && (
          <div style={{ background: C.accentDim, border: `1px solid ${C.accent}33`, borderRadius: 9, padding: '9px 13px', marginBottom: 18, fontSize: 13 }}>
            <span style={{ color: C.textMuted }}>Plan: </span>
            <span style={{ color: C.accent, fontWeight: 600 }}>{plan.name} — ${plan.price}/mes</span>
            <span style={{ color: C.green, marginLeft: 8, fontSize: 11 }}>7 días gratis</span>
          </div>
        )}
        <div className="auth-tabs">
          {(['login', 'register'] as const).map(t => (
            <button key={t} className={`auth-tab${tab === t ? ' active' : ''}`} onClick={() => { setTab(t); setErr(''); setOk(''); }}>
              {t === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
            </button>
          ))}
        </div>
        {err && <div className="err-box">{err}</div>}
        {ok && <div className="ok-box">{ok}</div>}
        {tab === 'login' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            <div className="fg"><label className="flbl">Email</label><input className="finput" type="email" placeholder="tu@email.com" value={form.email} onChange={e => set('email', e.target.value)} /></div>
            <div className="fg"><label className="flbl">Contraseña</label><input className="finput" type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} onKeyDown={e => e.key === 'Enter' && doLogin()} /></div>
            <div style={{ textAlign: 'right' }}><span style={{ color: C.accent, fontSize: 12, cursor: 'pointer' }}>¿Olvidaste tu contraseña?</span></div>
            <button className="btn btn-p" style={{ width: '100%', padding: '11px' }} onClick={doLogin} disabled={loading}>
              {loading ? <Spinner color="#fff" /> : 'Ingresar →'}
            </button>
            <div style={{ textAlign: 'center', fontSize: 12, color: C.textMuted }}>¿No tenés cuenta? <span style={{ color: C.accent, cursor: 'pointer' }} onClick={() => setTab('register')}>Registrate gratis</span></div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            <div className="fg"><label className="flbl">Nombre completo</label><input className="finput" placeholder="Alan Ugarte" value={form.name} onChange={e => set('name', e.target.value)} /></div>
            <div className="fg"><label className="flbl">Email</label><input className="finput" type="email" placeholder="tu@email.com" value={form.email} onChange={e => set('email', e.target.value)} /></div>
            <div className="fg"><label className="flbl">Contraseña</label><input className="finput" type="password" placeholder="Mínimo 8 caracteres" value={form.password} onChange={e => set('password', e.target.value)} /></div>
            <div className="fg"><label className="flbl">Confirmar contraseña</label><input className="finput" type="password" placeholder="••••••••" value={form.confirm} onChange={e => set('confirm', e.target.value)} onKeyDown={e => e.key === 'Enter' && doRegister()} /></div>
            <button className="btn btn-p" style={{ width: '100%', padding: '11px' }} onClick={doRegister} disabled={loading}>
              {loading ? <Spinner color="#fff" /> : plan ? 'Crear cuenta y pagar →' : 'Crear cuenta gratis →'}
            </button>
            <div style={{ fontSize: 11, color: C.textDim, textAlign: 'center' }}>Al registrarte aceptás los Términos y la Política de Privacidad</div>
            <div style={{ textAlign: 'center', fontSize: 12, color: C.textMuted }}>¿Ya tenés cuenta? <span style={{ color: C.accent, cursor: 'pointer' }} onClick={() => setTab('login')}>Iniciá sesión</span></div>
          </div>
        )}
      </div>
    </div>
  );
}
