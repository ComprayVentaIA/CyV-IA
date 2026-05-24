import { useState } from 'react';
import { Tag, MiniChart, Spinner } from '../../components/ui';
import { C } from '../../styles/theme';

const CMPGS = [
  { id: 1, name: 'Zapatillas Nike Air - Reels', roas: '4.1x', leads: 82, ctr: '4.2%', spent: '$312' },
  { id: 2, name: 'Bolsos importados - Stories', roas: '3.2x', leads: 38, ctr: '3.8%', spent: '$198' },
  { id: 3, name: 'Ropa de invierno - Feed', roas: '1.2x', leads: 9, ctr: '1.9%', spent: '$87' },
  { id: 4, name: 'Tecnología gaming - Carrusel', roas: '5.8x', leads: 179, ctr: '5.1%', spent: '$520' },
  { id: 5, name: 'Indumentaria deportiva', roas: '2.9x', leads: 55, ctr: '3.4%', spent: '$241' },
];

function generatePDF() {
  const date = new Date().toLocaleDateString('es-AR');
  const rows = CMPGS.map(c => `
    <tr>
      <td>${c.name}</td>
      <td class="${parseFloat(c.roas) >= 3 ? 'green' : 'red'}">${c.roas}</td>
      <td>${c.ctr}</td><td>${c.spent}</td>
      <td class="purple">${c.leads}</td>
    </tr>`).join('');
  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Informe — ${date}</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',Arial,sans-serif;background:#fff;color:#1a1a2e;padding:40px}
.header{background:linear-gradient(135deg,#7c5cfc,#4da6ff);color:#fff;padding:28px 32px;border-radius:12px;margin-bottom:28px}
.header h1{font-size:22px;font-weight:800;margin-bottom:4px}.header p{font-size:13px;opacity:.8}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:28px}
.kpi{border:1px solid #e0e0f0;border-radius:10px;padding:16px;text-align:center}
.kpi-lbl{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px}
.kpi-val{font-size:26px;font-weight:800}
.green{color:#00b877}.red{color:#e0003c}.purple{color:#7c5cfc}.amber{color:#e08800}
h2{font-size:16px;font-weight:700;margin:24px 0 14px;border-bottom:2px solid #f0f0ff;padding-bottom:8px}
table{width:100%;border-collapse:collapse;font-size:12px;margin-bottom:28px}
th{text-align:left;padding:8px 10px;background:#f8f8ff;color:#666;font-size:10px;text-transform:uppercase;border-bottom:2px solid #e0e0f0}
td{padding:9px 10px;border-bottom:1px solid #f0f0f8}
.footer{text-align:center;font-size:11px;color:#aaa;border-top:1px solid #f0f0f8;padding-top:18px;margin-top:28px}
</style></head><body>
<div class="header"><h1>📊 Informe Diario — AI Commerce Ads Suite</h1><p>Generado el ${date} a las 20:00 hs</p></div>
<div class="kpis">
  <div class="kpi"><div class="kpi-lbl">ROAS Promedio</div><div class="kpi-val green">3.8x</div></div>
  <div class="kpi"><div class="kpi-lbl">Leads WhatsApp</div><div class="kpi-val purple">342</div></div>
  <div class="kpi"><div class="kpi-lbl">CPC Promedio</div><div class="kpi-val">$0.52</div></div>
  <div class="kpi"><div class="kpi-lbl">Gasto Total</div><div class="kpi-val amber">$1,358</div></div>
</div>
<h2>📣 Detalle de campañas</h2>
<table><thead><tr><th>Campaña</th><th>ROAS</th><th>CTR</th><th>Gasto</th><th>Leads</th></tr></thead><tbody>${rows}</tbody></table>
<div class="footer">AI Commerce Ads Suite · Informe automático · ${date}</div>
</body></html>`;
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `informe-${date.replace(/\//g, '-')}.html`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}

export default function Reports() {
  const [downloading, setDownloading] = useState(false);
  const handlePDF = () => { setDownloading(true); setTimeout(() => { generatePDF(); setDownloading(false); }, 600); };

  return (
    <div className="content fade-in">
      <div className="g4" style={{ marginBottom: 18 }}>
        {[
          { label: 'ROAS promedio', value: '3.8x', change: '+0.4x esta semana', up: true, chart: [2, 2.5, 3, 2.8, 3.5, 3.3, 3.8], color: C.green },
          { label: 'CPM promedio', value: '$4.20', change: '-$0.80 vs ant.', up: true, chart: [7, 6.5, 6, 5.5, 5, 4.8, 4.2], color: C.blue },
          { label: 'Tasa conv. WA', value: '23%', change: '+5% vs mes ant.', up: true, chart: [12, 14, 17, 19, 20, 21, 23], color: C.accent },
          { label: 'Costo / lead', value: '$1.80', change: '-$0.40 vs mes ant.', up: true, chart: [3.5, 3, 2.8, 2.4, 2.2, 2, 1.8], color: C.amber },
        ].map(m => (
          <div key={m.label} className="card card-sm fade-in">
            <div className="m-lbl">{m.label}</div>
            <div className="m-val" style={{ color: m.color }}>{m.value}</div>
            <div className={`m-chg ${m.up ? 'up' : 'down'}`}><span>▲</span> {m.change}</div>
            <MiniChart data={m.chart} color={m.color} />
          </div>
        ))}
      </div>

      <div className="g2" style={{ gap: 16 }}>
        <div className="card">
          <div className="sh">
            <div><div className="sh-title">Informe diario — 20:00</div><div className="sh-sub">Generado automáticamente por IA</div></div>
            <button className="btn btn-g" style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 5 }} onClick={handlePDF} disabled={downloading}>
              {downloading ? <><Spinner />Generando...</> : '📥 Descargar PDF'}
            </button>
          </div>
          {[
            { i: '✅', t: 'Gaming Carrusel: ROAS 5.8x → subir presupuesto', x: 'tg' as const },
            { i: '⚠️', t: 'Ropa Invierno: CTR 1.9% → reformular hook', x: 'ta' as const },
            { i: '🚀', t: 'Reels generan 60% más leads que carruseles', x: 'tb' as const },
            { i: '💬', t: '342 leads WA esta semana (+28%)', x: 'tg' as const },
          ].map((ins, i) => (
            <div key={i} className="insight">
              <span style={{ fontSize: 15 }}>{ins.i}</span>
              <div style={{ flex: 1, fontSize: 12, lineHeight: 1.5 }}>{ins.t}</div>
              <Tag t={ins.x}>{ins.x === 'tg' ? 'Bien' : ins.x === 'ta' ? 'Atención' : 'Info'}</Tag>
            </div>
          ))}
          <div style={{ marginTop: 14, padding: '10px 12px', background: C.greenDim, border: `1px solid ${C.green}33`, borderRadius: 8, fontSize: 12, color: C.green }}>
            ✅ Próximo informe: hoy a las 20:00 hs · Se enviará por email automáticamente
          </div>
        </div>

        <div className="card">
          <div className="sh-title" style={{ marginBottom: 13 }}>Rendimiento por campaña</div>
          {CMPGS.map(c => (
            <div key={c.id} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                <span style={{ fontWeight: 500 }}>{c.name}</span>
                <span style={{ color: C.green, fontFamily: "'DM Mono',monospace" }}>{c.roas}</span>
              </div>
              <div className="prog-wrap">
                <div className="prog-bar" style={{ width: `${Math.min(100, parseFloat(c.roas) / 6 * 100)}%`, background: parseFloat(c.roas) >= 3 ? C.green : parseFloat(c.roas) >= 2 ? C.amber : C.red }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2, fontSize: 10, color: C.textMuted, fontFamily: "'DM Mono',monospace" }}>
                <span>{c.leads} leads</span><span>CTR {c.ctr}</span><span>{c.spent}</span>
              </div>
            </div>
          ))}
          <button className="btn btn-g" style={{ width: '100%', marginTop: 10, fontSize: 12 }} onClick={handlePDF}>
            📥 Descargar informe completo
          </button>
        </div>
      </div>
    </div>
  );
}
