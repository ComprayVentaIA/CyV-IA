import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { C } from '../styles/theme';
import type { Plan } from '../types';

export default function SuccessPage() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: { plan?: Plan } | null };
  const plan = state?.plan;
  const [count, setCount] = useState(3);

  useEffect(() => {
    const t = setInterval(() => setCount(c => {
      if (c <= 1) { clearInterval(t); navigate('/dashboard'); return 0; }
      return c - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [navigate]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.bg }}>
      <div style={{ textAlign: 'center' }} className="fade-in">
        <div style={{ fontSize: 56, marginBottom: 18 }}>🎉</div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 26, marginBottom: 9 }}>¡Bienvenido a bordo!</div>
        <div style={{ fontSize: 16, color: C.textMuted, marginBottom: 7 }}>Tu plan <strong style={{ color: C.accent }}>{plan?.name ?? 'Growth'}</strong> está activo.</div>
        <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 28 }}>Tenés 7 días gratis para explorar todo.</div>
        <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 12 }}>Redirigiendo en {count}s…</div>
        <button className="btn btn-p" style={{ padding: '10px 28px' }} onClick={() => navigate('/dashboard')}>Ir al dashboard ahora →</button>
      </div>
    </div>
  );
}
