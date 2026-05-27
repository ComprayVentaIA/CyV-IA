import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Tag, MiniChart, Spinner } from '../../components/ui';
import { C } from '../../styles/theme';
import { campaignsApi, type CampaignRow, type DashboardSummary, normalizeCtr, normalizeRoas } from '../../api/campaigns';
import { aiApi } from '../../api/ai';

const MOCK_CAMPAIGNS: CampaignRow[] = [
  { id: '1', name: 'Zapatillas Nike Air - Reels', status: 'active', daily_budget_cents: 2500, total_spent_cents: 31200, ctr: '4.2', cpc_cents: 38, leads: 82, roas: '4.1', impressions: 18000, clicks: 756, created_at: '' },
  { id: '2', name: 'Bolsos importados - Stories', status: 'active', daily_budget_cents: 1500, total_spent_cents: 19800, ctr: '3.8', cpc_cents: 52, leads: 38, roas: '3.2', impressions: 9200, clicks: 350, created_at: '' },
  { id: '3', name: 'Ropa de invierno - Feed', status: 'paused', daily_budget_cents: 1000, total_spent_cents: 8700, ctr: '1.9', cpc_cents: 110, leads: 9, roas: '1.2', impressions: 4500, clicks: 86, created_at: '' },
  { id: '4', name: 'Tecnología gaming - Carrusel', status: 'optimizing', daily_budget_cents: 4000, total_spent_cents: 52000, ctr: '5.1', cpc_cents: 29, leads: 179, roas: '5.8', impressions: 32000, clicks: 1632, created_at: '' },
];

const MOCK_INSIGHTS = [
  { i: '🚀', t: 'Gaming Carrusel: ROAS 5.8x → Subir a $60/día', x: 'tg' as const },
  { i: '⏸️', t: 'Ropa invierno: CTR 1.9%, ROAS 1.2x → Pausar hook', x: 'tr' as const },
  { i: '🎯', t: 'Mujeres 18-34 convierte 2.3x más → Aumentar bid', x: 'tb' as const },
  { i: '✏️', t: '\'Últimas unidades\' = CTR +40% → Aplicar a todas', x: 'ta' as const },
];

const TYPE_ICON: Record<string, string> = { scale: '🚀', pause: '⏸️', optimize: '🎯', info: 'ℹ️', warning: '⚠️' };
const TYPE_TAG: Record<string, 'tg' | 'tr' | 'ta' | 'tb'> = { scale: 'tg', pause: 'tr', warning: 'ta', optimize: 'tb', info: 'tb' };

export default function DashOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.fullName?.split(' ')[0] ?? 'Equipo';

  const [campaigns, setCampaigns] = useState<CampaignRow[]>(MOCK_CAMPAIGNS);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [insights, setInsights] = useState<typeof MOCK_INSIGHTS | any[]>(MOCK_INSIGHTS);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [campRes, sumRes] = await Promise.all([
          campaignsApi.getAll({ limit: 5 }),
          campaignsApi.getDashboardSummary(),
        ]);
        const list = (campRes.data as any)?.data?.campaigns ?? (campRes.data as any)?.campaigns ?? [];
        const sum = (sumRes.data as any)?.data ?? sumRes.data;
        if (Array.isArray(list) && list.length > 0) setCampaigns(list);
        if (sum) setSummary(sum);
      } catch {
        // keep mock
      }
      setLoading(false);
    })();
  }, []);

  const refreshInsights = async () => {
    setLoadingInsights(true);
    try {
      const res = await aiApi.analyzeUrl('', `Generá insights para ${campaigns.length} campañas`);
      const data = (res.data as any)?.data ?? res.data;
      if (Array.isArray(data) && data.length > 0) {
        setInsights(data.map((ins: any) => ({
          i: TYPE_ICON[ins.type] ?? '💡',
          t: `${ins.title}: ${ins.detail}`,
          x: TYPE_TAG[ins.type] ?? 'tb',
        })));
      }
    } catch { /* keep mock */ }
    setLoadingInsights(false);
  };

  const activeCount = summary?.campaigns?.active ?? campaigns.filter(c => c.status === 'active' || c.status === 'optimizing').length;
  const totalLeads = summary?.metrics?.total_leads ? parseInt(String(summary.metrics.total_leads)) : campaigns.reduce((s, c) => s + c.leads, 0);
  const avgRoas = summary?.metrics?.avg_roas ? parseFloat(summary.metrics.avg_roas).toFixed(1) + 'x' : '—';
  const totalSpentUsd = summary?.metrics?.total_spent ? `$${(parseInt(String(summary.metrics.total_spent)) / 100).toFixed(0)}` : '—';
  const leadsToday = summary?.leadsToday ?? 0;

  const tagV = (s: string) => s === 'active' ? 'tg' : s === 'paused' ? 'tr' : 'ta';
  const tagL = (s: string) => s === 'active' ? 'activa' : s === 'paused' ? 'pausada' : 'optimizando';

  return (
    <div className="content fade-in">
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, marginBottom: 3 }}>
          Buen día, {firstName} 👋
        </div>
        <div style={{ fontSize: 13, color: C.textMuted }}>
          {loading ? 'Cargando...' : `${activeCount} campañas activas · ${leadsToday > 0 ? `${leadsToday} leads hoy` : 'Sin leads hoy'}`}
        </div>
      </div>

      <div className="g4" style={{ marginBottom: 18 }}>
        {[
          { label: 'ROAS promedio', value: loading ? '—' : avgRoas, change: 'promedio histórico', up: true, chart: [3, 5, 4, 7, 6, 8, 9, 11], color: C.green },
          { label: 'Leads totales', value: loading ? '—' : String(totalLeads), change: `+${leadsToday} hoy`, up: true, chart: [20, 25, 30, 28, 35, 38, 40, 45], color: C.accent },
          { label: 'Campañas activas', value: loading ? '—' : String(activeCount), change: 'en este momento', up: true, chart: [4, 5, 5, 6, 6, 7, 7, activeCount], color: C.blue },
          { label: 'Gasto total', value: loading ? '—' : totalSpentUsd, change: 'acumulado', up: false, chart: [60, 80, 70, 90, 95, 100, 110, 120], color: C.amber },
        ].map(m => (
          <div key={m.label} className="card card-sm fade-in">
            <div className="m-lbl">{m.label}</div>
            <div className="m-val" style={{ color: m.color }}>{m.value}</div>
            <div className={`m-chg ${m.up ? 'up' : 'down'}`}><span>{m.up ? '▲' : '▼'}</span> {m.change}</div>
            <MiniChart data={m.chart} color={m.color} />
          </div>
        ))}
      </div>

      <div className="g2" style={{ marginBottom: 18 }}>
        <div className="card">
          <div className="sh">
            <div><div className="sh-title">Campañas recientes</div><div className="sh-sub">{loading ? 'Cargando...' : 'Datos en tiempo real'}</div></div>
            <Tag t="tg">{activeCount} activas</Tag>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '30px 0' }}><Spinner size={20} /></div>
          ) : (
            <div className="tbl-wrap">
              <table>
                <thead><tr><th>Campaña</th><th>CTR</th><th>Leads</th><th>ROAS</th></tr></thead>
                <tbody>
                  {campaigns.slice(0, 5).map(c => (
                    <tr key={c.id}>
                      <td>
                        <div style={{ fontSize: 12, fontWeight: 500 }}>{c.name}</div>
                        <Tag t={tagV(c.status) as any}>{tagL(c.status)}</Tag>
                      </td>
                      <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 12 }}>{normalizeCtr(c.ctr)}</td>
                      <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 12 }}>{c.leads}</td>
                      <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: parseFloat(c.roas ?? '0') >= 3 ? C.green : C.amber }}>{normalizeRoas(c.roas)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <div className="sh">
            <div><div className="sh-title">Insights IA</div></div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <button onClick={refreshInsights} disabled={loadingInsights}
                style={{ fontSize: 10, padding: '3px 9px', borderRadius: 5, border: `1px solid ${C.accent}44`, background: C.accentDim, color: C.accent, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                {loadingInsights ? <Spinner size={10} /> : '🤖'} Actualizar
              </button>
              <div className="ai-dots"><div className="ai-dot" /><div className="ai-dot" /><div className="ai-dot" /></div>
            </div>
          </div>
          {loadingInsights ? (
            <div style={{ textAlign: 'center', padding: '30px 0' }}><Spinner size={20} /></div>
          ) : (
            insights.map((ins: any, i: number) => (
              <div key={i} className="insight">
                <span style={{ fontSize: 15 }}>{ins.i ?? '💡'}</span>
                <div style={{ flex: 1, fontSize: 12, lineHeight: 1.5 }}>{ins.t}</div>
                <Tag t={ins.x ?? 'tb'}>{ins.x === 'tg' ? 'Escalar' : ins.x === 'tr' ? 'Pausar' : ins.x === 'tb' ? 'Optimizar' : 'Editar'}</Tag>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="g3">
        {[
          ['⚡', 'Nueva campaña rápida', 'IA la configura en 60 seg', C.accent, '/dashboard/new-campaign'],
          ['🎨', 'Generar creativos', 'Video + imágenes automáticas', C.blue, '/dashboard/creatives'],
          ['📧', 'Ver informes', 'Con insights de IA', C.green, '/dashboard/reports'],
        ].map(([icon, title, sub, col, path]) => (
          <div key={path as string} className="card" style={{ cursor: 'pointer' }}
            onClick={() => navigate(path as string)}
            onMouseEnter={e => (e.currentTarget.style.borderColor = col as string)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
            <div style={{ fontSize: 22, marginBottom: 9 }}>{icon}</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{title}</div>
            <div style={{ fontSize: 12, color: C.textMuted }}>{sub}</div>
            <div style={{ marginTop: 11, fontSize: 11, color: col as string, fontFamily: "'DM Mono',monospace" }}>EJECUTAR →</div>
          </div>
        ))}
      </div>
    </div>
  );
}
