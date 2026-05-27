import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Spinner } from '../components/ui';
import { C } from '../styles/theme';
import type { Plan } from '../types';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: { plan?: Plan } | null };
  const plan = state?.plan;

  const [num, setNum] = useState('');
  const [exp, setExp] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  if (!plan) {
    navigate('/');
    return null;
  }

  const fmtNum = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})/g, '$1 ').trim();
  const fmtExp = (v: string) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d; };

  const pay = async () => {
    if (!num || num.replace(/\s/g, '').length < 16) { setErr('Número de tarjeta inválido'); return; }
    if (!exp || exp.length < 5) { setErr('Fecha de vencimiento inválida'); return; }
    if (!cvc || cvc.length < 3) { setErr('Código CVC inválido'); return; }
    if (!name) { setErr('Ingresá el nombre del titular'); return; }
    setLoading(true); setErr('');
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    navigate('/success', { state: { plan } });
  };

  return (
    <div className="co-page">
      <div className="auth-bg" />
      <button className="btn btn-g" style={{ position: 'fixed', top: 20, left: 20, fontSize: 12 }} onClick={() => navigate(-1)}>← Volver</button>
      <div className="co-card fade-in">
        <div className="co-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
            <div className="logo-icon" style={{ width: 26, height: 26, fontSize: 11 }}>C</div>
            <div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: '.01em' }}>CONVERSIA</div>
              <div style={{ fontSize: 8, color: C.textMuted, fontFamily: "'DM Mono',monospace", letterSpacing: '.1em' }}>ADS SUITE</div>
            </div>
          </div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 19, marginBottom: 18 }}>Resumen del pedido</div>
          <div className="co-summary">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15 }}>Plan {plan.name}</span>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 14 }}>${plan.price}/mes</span>
            </div>
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 12 }}>Facturación mensual · Cancelable en cualquier momento</div>
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
              {plan.features.slice(0, 4).map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 7, marginBottom: 5, fontSize: 12, color: C.textMuted }}>
                  <span style={{ color: C.green }}>✓</span>{f}
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: C.greenDim, border: `1px solid ${C.green}33`, borderRadius: 9, padding: '11px 13px', marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: C.green, fontWeight: 600 }}>🎉 7 días completamente gratis</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>El primer cobro de ${plan.price} es el día 8.</div>
          </div>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 13 }}>
            {[['Cobrado hoy', '$0.00', C.green], [`A partir del día 8`, '$' + plan.price + '/mes', C.text]].map(([k, v, col], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                <span style={{ color: C.textMuted }}>{k}</span>
                <span style={{ fontFamily: "'DM Mono',monospace", color: col as string, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="co-right">
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 19, marginBottom: 20 }}>Datos de pago</div>
          {err && <div className="err-box">{err}</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            <div className="fg"><label className="flbl">Nombre en la tarjeta</label><input className="finput" placeholder="ALAN UGARTE" value={name} onChange={e => { setName(e.target.value); setErr(''); }} /></div>
            <div className="fg">
              <label className="flbl">Número de tarjeta</label>
              <div style={{ position: 'relative' }}>
                <input className="finput" placeholder="0000 0000 0000 0000" value={num} onChange={e => { setNum(fmtNum(e.target.value)); setErr(''); }} style={{ paddingRight: 46, fontFamily: "'DM Mono',monospace" }} />
                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>💳</span>
              </div>
            </div>
            <div className="g2" style={{ gap: 12 }}>
              <div className="fg"><label className="flbl">Vencimiento</label><input className="finput" placeholder="MM/AA" value={exp} onChange={e => { setExp(fmtExp(e.target.value)); setErr(''); }} style={{ fontFamily: "'DM Mono',monospace" }} /></div>
              <div className="fg"><label className="flbl">CVC</label><input className="finput" placeholder="123" maxLength={4} value={cvc} onChange={e => { setCvc(e.target.value.replace(/\D/g, '')); setErr(''); }} style={{ fontFamily: "'DM Mono',monospace" }} /></div>
            </div>
            <button onClick={pay} disabled={loading}
              style={{ width: '100%', padding: '12px', fontSize: 14, fontWeight: 600, background: loading ? C.border : C.grad, color: '#fff', border: 'none', borderRadius: 9, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 }}>
              {loading ? <><Spinner color="#fff" /> Procesando...</> : `🔒 Iniciar prueba gratis — ${plan.name}`}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 11, color: C.textMuted }}>
              <span>🔒</span> Pago seguro SSL · Powered by Stripe
            </div>
            <div style={{ fontSize: 11, color: C.textDim, textAlign: 'center', lineHeight: 1.5 }}>Podés cancelar antes del día 8 sin costo alguno.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
