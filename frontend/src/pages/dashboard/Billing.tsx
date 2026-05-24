import { useState } from 'react';
import { Tag } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { C } from '../../styles/theme';

const PLANS_META = {
  starter: { price: 49, color: C.green, tagVariant: 'tg' as const },
  growth: { price: 99, color: C.accent, tagVariant: 'tp' as const },
  scale: { price: 199, color: C.blue, tagVariant: 'tb' as const },
};

export default function Billing() {
  const { user } = useAuth();
  const plan = (user?.plan ?? 'growth') as keyof typeof PLANS_META;
  const meta = PLANS_META[plan] ?? PLANS_META.growth;
  const { price, color } = meta;
  const [showUpgrade, setShowUpgrade] = useState(false);

  const invoices = [
    { id: 'INV-2026-005', date: '01/05/2026', amount: price, status: 'pagado', period: 'Mayo 2026' },
    { id: 'INV-2026-004', date: '01/04/2026', amount: price, status: 'pagado', period: 'Abril 2026' },
    { id: 'INV-2026-003', date: '01/03/2026', amount: price, status: 'pagado', period: 'Marzo 2026' },
    { id: 'INV-2026-002', date: '01/02/2026', amount: price, status: 'pagado', period: 'Febrero 2026' },
    { id: 'INV-2026-001', date: '01/01/2026', amount: 0, status: 'gratis', period: 'Enero 2026 (prueba)' },
  ];

  const downloadInvoice = (inv: typeof invoices[0]) => {
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Factura ${inv.id}</title>
<style>body{font-family:Arial,sans-serif;padding:40px;color:#1a1a2e;max-width:600px;margin:0 auto}
.header{border-bottom:3px solid #7c5cfc;padding-bottom:20px;margin-bottom:24px}
h1{color:#7c5cfc;font-size:22px;margin:0 0 4px}.sub{color:#888;font-size:13px}
.row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:14px}
.total{font-weight:700;font-size:16px;color:#7c5cfc;border-top:2px solid #7c5cfc;margin-top:8px}
.badge{display:inline-block;background:#e0fff2;color:#00b877;padding:3px 10px;border-radius:4px;font-size:12px;font-weight:600}</style></head>
<body><div class="header"><h1>AI Commerce Ads Suite</h1><div class="sub">Factura / Recibo de pago</div></div>
<div class="row"><span>Número de factura</span><strong>${inv.id}</strong></div>
<div class="row"><span>Fecha de emisión</span><span>${inv.date}</span></div>
<div class="row"><span>Período</span><span>${inv.period}</span></div>
<div class="row"><span>Cliente</span><span>${user?.fullName ?? 'Cliente'}</span></div>
<div class="row"><span>Plan</span><span>${plan.charAt(0).toUpperCase() + plan.slice(1)}</span></div>
<div class="row"><span>Estado</span><span><span class="badge">${inv.status}</span></span></div>
<div class="row total"><span>Total</span><span>$${inv.amount} USD</span></div>
<p style="font-size:12px;color:#aaa;margin-top:24px">Gracias por usar AI Commerce Ads Suite</p>
</body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${inv.id}.html`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  return (
    <div className="content fade-in">
      <div className="g2" style={{ marginBottom: 18 }}>
        <div className="card" style={{ border: `1.5px solid ${color}44`, background: `${color}08` }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'DM Mono',monospace", textTransform: 'uppercase', marginBottom: 4 }}>Plan activo</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color }}>{plan.charAt(0).toUpperCase() + plan.slice(1)}</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 18, fontWeight: 700, marginTop: 2 }}>${price}<span style={{ fontSize: 13, color: C.textMuted }}>/mes</span></div>
            </div>
            <Tag t={meta.tagVariant}>{plan}</Tag>
          </div>
          <div style={{ borderTop: `1px solid ${color}22`, paddingTop: 12, marginBottom: 14 }}>
            {[['Próximo cobro', '01/06/2026'], ['Método de pago', '•••• •••• •••• 4242'], ['Estado', 'Al día ✓'], ['Miembro desde', 'Enero 2026']].map(([k, v], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '5px 0', borderBottom: `1px solid ${color}11` }}>
                <span style={{ color: C.textMuted }}>{k}</span>
                <span style={{ fontWeight: 500, color: i === 2 ? C.green : C.text }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {plan !== 'scale' && <button className="btn btn-p" style={{ fontSize: 12, flex: 1 }} onClick={() => setShowUpgrade(true)}>⬆️ Mejorar plan</button>}
            <button className="btn btn-g" style={{ fontSize: 12, flex: 1 }}>⚙️ Gestionar suscripción</button>
          </div>
        </div>

        <div className="card">
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, marginBottom: 14 }}>Uso del plan</div>
          {[
            { lbl: 'Campañas activas', used: 12, max: plan === 'starter' ? 20 : null, icon: '📣' },
            { lbl: 'Creativos generados', used: 48, max: plan === 'starter' ? 50 : null, icon: '🎨' },
            { lbl: 'Cuentas Meta', used: 1, max: plan === 'starter' ? 1 : plan === 'growth' ? 3 : 10, icon: '📘' },
            { lbl: 'Leads WA este mes', used: 342, max: null, icon: '💬' },
          ].map((item, i) => (
            <div key={i} style={{ marginBottom: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12 }}>
                <span>{item.icon} {item.lbl}</span>
                <span style={{ fontFamily: "'DM Mono',monospace", color: item.max && item.used / item.max > 0.8 ? C.amber : C.text }}>
                  {item.used}{item.max ? `/${item.max}` : ' ✓'}
                </span>
              </div>
              <div className="prog-wrap"><div className="prog-bar" style={{ width: `${item.max ? Math.min(100, item.used / item.max * 100) : 60}%`, background: item.max && item.used / item.max > 0.8 ? C.amber : color }} /></div>
              {item.max && item.used / item.max > 0.8 && <div style={{ fontSize: 10, color: C.amber, marginTop: 2 }}>⚠️ Cerca del límite · Considerá mejorar tu plan</div>}
            </div>
          ))}
        </div>
      </div>

      {showUpgrade && (
        <div className="card" style={{ marginBottom: 18, border: `1.5px solid ${C.accent}`, background: C.accentDim }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15 }}>⬆️ Mejorar plan</div>
            <button className="btn btn-g" style={{ fontSize: 11 }} onClick={() => setShowUpgrade(false)}>✕ Cerrar</button>
          </div>
          <div className="g2" style={{ gap: 12 }}>
            {([plan === 'starter' ? ['growth', 'Growth', '$99/mes', 'Campañas ilimitadas · IA avanzada · 3 cuentas Meta'] : null, ['scale', 'Scale', '$199/mes', 'IA avanzada completa · 10 cuentas · API · White label']] as Array<string[] | null>).filter((x): x is string[] => x !== null).map(([id, name, p, desc]) => (
              <div key={id} style={{ background: C.surface, border: `1.5px solid ${C.accent}`, borderRadius: 10, padding: 16, cursor: 'pointer' }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{name}</div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 17, color: C.accent, fontWeight: 700, marginBottom: 8 }}>{p}</div>
                <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.5, marginBottom: 12 }}>{desc}</div>
                <button className="btn btn-p" style={{ width: '100%', fontSize: 13 }}>Cambiar a {name}</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 14 }}>Historial de facturación</div>
          <Tag t="tg">Al día</Tag>
        </div>
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Nº Factura</th><th>Período</th><th>Fecha</th><th>Monto</th><th>Estado</th><th>Acción</th></tr></thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id}>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 11 }}>{inv.id}</td>
                  <td style={{ fontSize: 12 }}>{inv.period}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 11 }}>{inv.date}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: inv.amount === 0 ? C.green : C.text }}>{inv.amount === 0 ? 'Gratis' : `$${inv.amount}`}</td>
                  <td><Tag t={inv.status === 'pagado' ? 'tg' : 'tb'}>{inv.status}</Tag></td>
                  <td><button className="btn btn-g" style={{ fontSize: 11, padding: '3px 9px' }} onClick={() => downloadInvoice(inv)}>📥 PDF</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
