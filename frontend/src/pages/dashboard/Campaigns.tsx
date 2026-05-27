import { useState, useEffect, useCallback } from 'react';
import { Tag, Spinner } from '../../components/ui';
import { C } from '../../styles/theme';
import {
  campaignsApi, type CampaignRow,
  formatBudget, formatSpent, formatCpc, normalizeCtr, normalizeRoas,
} from '../../api/campaigns';

const MOCK: CampaignRow[] = [
  { id: '1', name: 'Zapatillas Nike Air - Reels', status: 'active', daily_budget_cents: 2500, total_spent_cents: 31200, ctr: '4.2', cpc_cents: 38, leads: 82, roas: '4.1', impressions: 18000, clicks: 756, created_at: '' },
  { id: '2', name: 'Bolsos importados - Stories', status: 'active', daily_budget_cents: 1500, total_spent_cents: 19800, ctr: '3.8', cpc_cents: 52, leads: 38, roas: '3.2', impressions: 9200, clicks: 350, created_at: '' },
  { id: '3', name: 'Ropa de invierno - Feed', status: 'paused', daily_budget_cents: 1000, total_spent_cents: 8700, ctr: '1.9', cpc_cents: 110, leads: 9, roas: '1.2', impressions: 4500, clicks: 86, created_at: '' },
  { id: '4', name: 'Tecnología gaming - Carrusel', status: 'optimizing', daily_budget_cents: 4000, total_spent_cents: 52000, ctr: '5.1', cpc_cents: 29, leads: 179, roas: '5.8', impressions: 32000, clicks: 1632, created_at: '' },
  { id: '5', name: 'Indumentaria deportiva', status: 'active', daily_budget_cents: 2000, total_spent_cents: 24100, ctr: '3.4', cpc_cents: 61, leads: 55, roas: '2.9', impressions: 12000, clicks: 408, created_at: '' },
];

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<CampaignRow[]>(MOCK);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Todas');
  const [toast, setToast] = useState('');

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await campaignsApi.getAll({ limit: 50 });
      const list = (res.data as any)?.data?.campaigns ?? (res.data as any)?.campaigns ?? [];
      if (Array.isArray(list) && list.length > 0) setCampaigns(list);
    } catch {
      // keep mock data
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleCampaign = async (c: CampaignRow) => {
    setActionId(c.id);
    try {
      if (c.status === 'active' || c.status === 'optimizing') {
        await campaignsApi.pause(c.id);
        setCampaigns(p => p.map(x => x.id === c.id ? { ...x, status: 'paused' } : x));
        showToast(`⏸️ "${c.name}" pausada`);
      } else {
        await campaignsApi.resume(c.id);
        setCampaigns(p => p.map(x => x.id === c.id ? { ...x, status: 'active' } : x));
        showToast(`▶️ "${c.name}" activada`);
      }
    } catch {
      showToast('No disponible sin Meta Ads conectado');
    }
    setActionId(null);
  };

  const filtered = campaigns.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'Todas' ||
      (filter === 'Activas' && (c.status === 'active' || c.status === 'optimizing')) ||
      (filter === 'Pausadas' && c.status === 'paused');
    return matchSearch && matchFilter;
  });

  const tagVariant = (s: string) =>
    s === 'active' ? 'tg' : s === 'paused' ? 'tr' : s === 'optimizing' ? 'ta' : 'tb';

  const statusLabel = (s: string) =>
    s === 'active' ? 'activa' : s === 'paused' ? 'pausada' : s === 'optimizing' ? 'optimizando' : s;

  return (
    <div className="content fade-in">
      {toast && (
        <div style={{ position: 'fixed', top: 16, right: 16, background: C.green, color: '#fff', padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 500, zIndex: 999, boxShadow: '0 4px 20px #0006' }}>{toast}</div>
      )}

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
        <input className="finput" placeholder="🔍 Buscar..." style={{ maxWidth: 250 }} value={search} onChange={e => setSearch(e.target.value)} />
        <select className="fsel" style={{ maxWidth: 130 }} value={filter} onChange={e => setFilter(e.target.value)}>
          <option>Todas</option>
          <option>Activas</option>
          <option>Pausadas</option>
        </select>
        {loading && <Spinner size={16} />}
        <div style={{ marginLeft: 'auto', fontSize: 12, color: C.textMuted, fontFamily: "'DM Mono',monospace" }}>
          {filtered.length} campaña{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Nombre</th><th>Estado</th><th>Presupuesto</th><th>Gastado</th>
                <th>CTR</th><th>CPC</th><th>Leads</th><th>ROAS</th><th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && !loading && (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: C.textMuted, fontSize: 13 }}>
                  No hay campañas. <a href="/dashboard/new-campaign" style={{ color: C.accent }}>Crear primera campaña →</a>
                </td></tr>
              )}
              {filtered.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 500, fontSize: 12 }}>{c.name}</td>
                  <td><Tag t={tagVariant(c.status) as any}>{statusLabel(c.status)}</Tag></td>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 12 }}>{formatBudget(c.daily_budget_cents)}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 12 }}>{formatSpent(c.total_spent_cents)}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 12 }}>{normalizeCtr(c.ctr)}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 12 }}>{formatCpc(c.cpc_cents)}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: C.accent }}>{c.leads}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: parseFloat(c.roas ?? '0') >= 3 ? C.green : parseFloat(c.roas ?? '0') >= 1.5 ? C.amber : C.red }}>{normalizeRoas(c.roas)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button className="btn btn-g" style={{ padding: '3px 8px', fontSize: 11 }}
                        onClick={() => toggleCampaign(c)} disabled={actionId === c.id}>
                        {actionId === c.id ? <Spinner size={12} /> : (c.status === 'active' || c.status === 'optimizing') ? 'Pausar' : 'Activar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
