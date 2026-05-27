import { useState, useEffect, useCallback } from 'react';
import { Tag, MiniChart, Spinner } from '../../components/ui';
import { C } from '../../styles/theme';
import { reportsApi, type ReportRow } from '../../api/reports';
import api from '../../api/client';

const MOCK_CAMPAIGNS = [
  { id: 1, name: 'Zapatillas Nike Air - Reels', roas: '4.1x', leads: 82, ctr: '4.2%', spent: '$312' },
  { id: 2, name: 'Bolsos importados - Stories', roas: '3.2x', leads: 38, ctr: '3.8%', spent: '$198' },
  { id: 3, name: 'Ropa de invierno - Feed', roas: '1.2x', leads: 9, ctr: '1.9%', spent: '$87' },
  { id: 4, name: 'Tecnología gaming - Carrusel', roas: '5.8x', leads: 179, ctr: '5.1%', spent: '$520' },
  { id: 5, name: 'Indumentaria deportiva', roas: '2.9x', leads: 55, ctr: '3.4%', spent: '$241' },
];

const INSIGHT_TYPE_ICON: Record<string, string> = { scale: '🚀', pause: '⏸️', optimize: '🎯', info: 'ℹ️', warning: '⚠️' };
const INSIGHT_TYPE_TAG: Record<string, 'tg' | 'ta' | 'tb' | 'tr'> = { scale: 'tg', warning: 'ta', info: 'tb', optimize: 'tb', pause: 'tr' };

function generatePDF(campaignRows: typeof MOCK_CAMPAIGNS, aiInsights?: any[]) {
  const date = new Date().toLocaleDateString('es-AR');
  const rows = campaignRows.map(c => `
    <tr>
      <td>${c.name}</td>
      <td class="${parseFloat(c.roas) >= 3 ? 'green' : 'red'}">${c.roas}</td>
      <td>${c.ctr}</td><td>${c.spent}</td>
      <td class="purple">${c.leads}</td>
    </tr>`).join('');

  const insightSection = aiInsights && aiInsights.length > 0 ? `
    <h2>🤖 Insights generados por IA</h2>
    <ul>${aiInsights.map(ins => `<li><strong>${ins.title ?? ins.t ?? ''}</strong>: ${ins.detail ?? ins.action ?? ''}</li>`).join('')}</ul>
  ` : '';

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
ul{padding-left:20px;display:flex;flex-direction:column;gap:8px;font-size:13px;line-height:1.6;margin-bottom:20px}
.footer{text-align:center;font-size:11px;color:#aaa;border-top:1px solid #f0f0f8;padding-top:18px;margin-top:28px}
</style></head><body>
<div class="header"><h1>📊 Informe Diario — CONVERSIA ADS</h1><p>Generado el ${date} a las 20:00 hs</p></div>
<div class="kpis">
  <div class="kpi"><div class="kpi-lbl">ROAS Promedio</div><div class="kpi-val green">3.8x</div></div>
  <div class="kpi"><div class="kpi-lbl">Leads WhatsApp</div><div class="kpi-val purple">342</div></div>
  <div class="kpi"><div class="kpi-lbl">CPC Promedio</div><div class="kpi-val">$0.52</div></div>
  <div class="kpi"><div class="kpi-lbl">Gasto Total</div><div class="kpi-val amber">$1,358</div></div>
</div>
<h2>📣 Detalle de campañas</h2>
<table><thead><tr><th>Campaña</th><th>ROAS</th><th>CTR</th><th>Gasto</th><th>Leads</th></tr></thead><tbody>${rows}</tbody></table>
${insightSection}
<div class="footer">CONVERSIA ADS · Informe automático · ${date}</div>
</body></html>`;
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `informe-${date.replace(/\//g, '-')}.html`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}

export default function Reports() {
  const [downloading, setDownloading] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [generatingInsights, setGeneratingInsights] = useState(false);
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [toast, setToast] = useState('');

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3500); };

  const loadReports = useCallback(async () => {
    setLoadingReports(true);
    try {
      const res = await reportsApi.getAll();
      const list = (res.data as any)?.data?.reports ?? (res.data as any)?.reports ?? [];
      if (Array.isArray(list)) setReports(list);
    } catch { /* keep empty */ }
    setLoadingReports(false);
  }, []);

  useEffect(() => { loadReports(); }, [loadReports]);

  const handlePDF = () => {
    setDownloading(true);
    setTimeout(() => { generatePDF(MOCK_CAMPAIGNS, aiInsights); setDownloading(false); }, 400);
  };

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    try {
      await reportsApi.generate();
      await loadReports();
      showToast('✅ Informe generado correctamente');
    } catch {
      showToast('⚠️ Sin datos de campaña para generar informe');
    }
    setGeneratingReport(false);
  };

  const handleGenerateInsights = async () => {
    setGeneratingInsights(true);
    try {
      const res = await api.post('/ai/insights', { campaigns: MOCK_CAMPAIGNS });
      const data = (res.data as any)?.data ?? res.data;
      if (Array.isArray(data) && data.length > 0) {
        setAiInsights(data);
        showToast('🤖 Insights de IA generados');
      }
    } catch {
      showToast('⚠️ IA no disponible — configurá ANTHROPIC_API_KEY en Railway');
    }
    setGeneratingInsights(false);
  };

  const latestReport = reports[0];
  const latestInsights = latestReport?.insights ?? [];

  const displayInsights: { i: string; t: string; x: 'tg' | 'ta' | 'tb' | 'tr' }[] =
    aiInsights.length > 0
      ? aiInsights.map(ins => ({
          i: INSIGHT_TYPE_ICON[ins.type] ?? '💡',
          t: `${ins.title}: ${ins.detail}`,
          x: INSIGHT_TYPE_TAG[ins.type] ?? 'tb',
        }))
      : latestInsights.length > 0
      ? latestInsights.map((ins: any) => ({
          i: INSIGHT_TYPE_ICON[ins.type] ?? '💡',
          t: `${ins.title}: ${ins.detail ?? ins.action}`,
          x: INSIGHT_TYPE_TAG[ins.type] ?? 'tb',
        }))
      : [
          { i: '✅', t: 'Gaming Carrusel: ROAS 5.8x → subir presupuesto', x: 'tg' as const },
          { i: '⚠️', t: 'Ropa Invierno: CTR 1.9% → reformular hook', x: 'ta' as const },
          { i: '🚀', t: 'Reels generan 60% más leads que carruseles', x: 'tb' as const },
          { i: '💬', t: '342 leads WA esta semana (+28%)', x: 'tg' as const },
        ];

  const campaignRows = latestReport?.summary
    ? MOCK_CAMPAIGNS.map((c, i) => ({
        ...c,
        roas: i === 0 ? `${(latestReport.summary.avgRoas ?? 4.1).toFixed(1)}x` : c.roas,
        leads: i === 0 ? latestReport.summary.totalLeads : c.leads,
      }))
    : MOCK_CAMPAIGNS;

  return (
    <div className="content fade-in">
      {toast && (
        <div style={{ position: 'fixed', top: 16, right: 16, background: C.green, color: '#fff', padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 500, zIndex: 999, boxShadow: '0 4px 20px #0006' }}>{toast}</div>
      )}

      <div className="g4" style={{ marginBottom: 18 }}>
        {[
          { label: 'ROAS promedio', value: latestReport ? `${(latestReport.summary.avgRoas ?? 3.8).toFixed(1)}x` : '3.8x', change: '+0.4x esta semana', up: true, chart: [2, 2.5, 3, 2.8, 3.5, 3.3, 3.8], color: C.green },
          { label: 'CPM promedio', value: '$4.20', change: '-$0.80 vs ant.', up: true, chart: [7, 6.5, 6, 5.5, 5, 4.8, 4.2], color: C.blue },
          { label: 'Leads totales', value: latestReport ? String(latestReport.summary.totalLeads ?? 342) : '342', change: '+5% vs mes ant.', up: true, chart: [12, 14, 17, 19, 20, 21, 23], color: C.accent },
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
            <div>
              <div className="sh-title">
                {latestReport ? `Informe — ${new Date(latestReport.created_at).toLocaleDateString('es-AR')}` : 'Informe diario — 20:00'}
              </div>
              <div className="sh-sub">
                {loadingReports ? 'Cargando...' : latestReport ? `Campañas: ${latestReport.summary.totalCampaigns} · Leads: ${latestReport.summary.totalLeads}` : 'Generado automáticamente por IA'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 7 }}>
              <button className="btn btn-g" style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 5 }}
                onClick={handleGenerateInsights} disabled={generatingInsights}>
                {generatingInsights ? <><Spinner size={12} />Analizando...</> : '🤖 Insights IA'}
              </button>
              <button className="btn btn-g" style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 5 }}
                onClick={handlePDF} disabled={downloading}>
                {downloading ? <><Spinner size={12} />Generando...</> : '📥 PDF'}
              </button>
            </div>
          </div>

          {loadingReports ? (
            <div style={{ textAlign: 'center', padding: '30px 0' }}><Spinner size={20} /></div>
          ) : (
            displayInsights.map((ins, i) => (
              <div key={i} className="insight">
                <span style={{ fontSize: 15 }}>{ins.i}</span>
                <div style={{ flex: 1, fontSize: 12, lineHeight: 1.5 }}>{ins.t}</div>
                <Tag t={ins.x}>{ins.x === 'tg' ? 'Bien' : ins.x === 'ta' ? 'Atención' : ins.x === 'tr' ? 'Pausar' : 'Info'}</Tag>
              </div>
            ))
          )}

          <div style={{ marginTop: 14, display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ flex: 1, padding: '10px 12px', background: C.greenDim, border: `1px solid ${C.green}33`, borderRadius: 8, fontSize: 12, color: C.green }}>
              ✅ Próximo informe: hoy a las 20:00 hs
            </div>
            <button className="btn btn-g" style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}
              onClick={handleGenerateReport} disabled={generatingReport}>
              {generatingReport ? <><Spinner size={12} />Generando...</> : '⚡ Generar ahora'}
            </button>
          </div>
        </div>

        <div className="card">
          <div className="sh-title" style={{ marginBottom: 13 }}>Rendimiento por campaña</div>
          {campaignRows.map(c => (
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

          {reports.length > 0 && (
            <div style={{ marginTop: 14, borderTop: `1px solid ${C.border}22`, paddingTop: 12 }}>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8, fontFamily: "'DM Mono',monospace", textTransform: 'uppercase', letterSpacing: '.05em' }}>Historial de informes</div>
              {reports.slice(0, 5).map(r => (
                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: `1px solid ${C.border}11`, fontSize: 12 }}>
                  <span>{new Date(r.period_start).toLocaleDateString('es-AR')} — {r.type}</span>
                  <Tag t="tb">{r.summary.totalLeads} leads</Tag>
                </div>
              ))}
            </div>
          )}

          <button className="btn btn-g" style={{ width: '100%', marginTop: 12, fontSize: 12 }} onClick={handlePDF}>
            📥 Descargar informe completo
          </button>
        </div>
      </div>
    </div>
  );
}
