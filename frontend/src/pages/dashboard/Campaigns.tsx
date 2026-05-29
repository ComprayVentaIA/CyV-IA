import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Plus, Play, Pause, RefreshCw,
  TrendingUp, TrendingDown, ChevronUp, ChevronDown,
  BarChart2, Users, DollarSign,
} from 'lucide-react';
import { Tag, Spinner } from '../../components/ui';
import {
  campaignsApi, type CampaignRow,
  formatBudget, formatSpent, formatCpc, normalizeCtr, normalizeRoas,
} from '../../api/campaigns';

const MOCK: CampaignRow[] = [
  { id: '1', name: 'Zapatillas Nike Air - Reels',  status: 'active',     daily_budget_cents: 2500, total_spent_cents: 31200, ctr: '4.2', cpc_cents: 38,  leads: 82,  roas: '4.1', impressions: 18000, clicks: 756,  created_at: '' },
  { id: '2', name: 'Bolsos importados - Stories',  status: 'active',     daily_budget_cents: 1500, total_spent_cents: 19800, ctr: '3.8', cpc_cents: 52,  leads: 38,  roas: '3.2', impressions: 9200,  clicks: 350,  created_at: '' },
  { id: '3', name: 'Ropa de invierno - Feed',      status: 'paused',     daily_budget_cents: 1000, total_spent_cents: 8700,  ctr: '1.9', cpc_cents: 110, leads: 9,   roas: '1.2', impressions: 4500,  clicks: 86,   created_at: '' },
  { id: '4', name: 'Tecnología gaming - Carrusel', status: 'optimizing', daily_budget_cents: 4000, total_spent_cents: 52000, ctr: '5.1', cpc_cents: 29,  leads: 179, roas: '5.8', impressions: 32000, clicks: 1632, created_at: '' },
  { id: '5', name: 'Indumentaria deportiva',       status: 'active',     daily_budget_cents: 2000, total_spent_cents: 24100, ctr: '3.4', cpc_cents: 61,  leads: 55,  roas: '2.9', impressions: 12000, clicks: 408,  created_at: '' },
];

const STATUS_COLORS: Record<string, string> = {
  active:     '#00d68f',
  optimizing: '#ffb347',
  paused:     '#ff4d6a',
};

export default function Campaigns() {
  const navigate  = useNavigate();
  const [campaigns, setCampaigns] = useState<CampaignRow[]>(MOCK);
  const [loading,   setLoading]   = useState(true);
  const [actionId,  setActionId]  = useState<string | null>(null);
  const [search,    setSearch]    = useState('');
  const [filter,    setFilter]    = useState('Todas');
  const [toast,     setToast]     = useState('');
  const [sortKey,   setSortKey]   = useState<string>('leads');
  const [sortAsc,   setSortAsc]   = useState(false);

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3200); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await campaignsApi.getAll({ limit: 50 });
      const list = (res.data as any)?.data?.campaigns ?? (res.data as any)?.campaigns ?? [];
      if (Array.isArray(list) && list.length > 0) setCampaigns(list);
    } catch { /* keep mock */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleCampaign = async (c: CampaignRow) => {
    setActionId(c.id);
    try {
      if (c.status === 'active' || c.status === 'optimizing') {
        await campaignsApi.pause(c.id);
        setCampaigns(p => p.map(x => x.id === c.id ? { ...x, status: 'paused' } : x));
        showToast(`Campaña pausada: "${c.name}"`);
      } else {
        await campaignsApi.resume(c.id);
        setCampaigns(p => p.map(x => x.id === c.id ? { ...x, status: 'active' } : x));
        showToast(`Campaña activada: "${c.name}"`);
      }
    } catch {
      showToast('Conectá Meta Ads para gestionar campañas');
    }
    setActionId(null);
  };

  const handleSort = (key: string) => {
    if (sortKey === key) setSortAsc(v => !v);
    else { setSortKey(key); setSortAsc(false); }
  };

  const tagVariant = (s: string) => s === 'active' ? 'tg' : s === 'paused' ? 'tr' : s === 'optimizing' ? 'ta' : 'tb';
  const statusLabel = (s: string) => s === 'active' ? 'Activa' : s === 'paused' ? 'Pausada' : s === 'optimizing' ? 'Optimizando' : s;

  const filtered = campaigns
    .filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
      const matchFilter =
        filter === 'Todas' ||
        (filter === 'Activas' && (c.status === 'active' || c.status === 'optimizing')) ||
        (filter === 'Pausadas' && c.status === 'paused');
      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      let va: number, vb: number;
      if (sortKey === 'roas')   { va = parseFloat(a.roas ?? '0'); vb = parseFloat(b.roas ?? '0'); }
      else if (sortKey === 'ctr') { va = parseFloat(a.ctr ?? '0'); vb = parseFloat(b.ctr ?? '0'); }
      else if (sortKey === 'leads') { va = a.leads; vb = b.leads; }
      else if (sortKey === 'spent') { va = a.total_spent_cents; vb = b.total_spent_cents; }
      else return 0;
      return sortAsc ? va - vb : vb - va;
    });

  const summaryStats = {
    active:  campaigns.filter(c => c.status === 'active' || c.status === 'optimizing').length,
    paused:  campaigns.filter(c => c.status === 'paused').length,
    leads:   campaigns.reduce((s, c) => s + c.leads, 0),
    spent:   campaigns.reduce((s, c) => s + c.total_spent_cents, 0),
  };

  const SortIcon = ({ k }: { k: string }) =>
    sortKey === k
      ? sortAsc ? <ChevronUp size={11} className="text-accent" /> : <ChevronDown size={11} className="text-accent" />
      : null;

  return (
    <div className="content">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: .96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: .96 }}
            transition={{ duration: .2 }}
            className="fixed top-4 right-4 z-[999] bg-surface border border-border rounded-xl px-4 py-3 text-[13px] text-text flex items-center gap-2.5"
            style={{ boxShadow: '0 8px 32px #00000066' }}
          >
            <span className="w-2 h-2 rounded-full bg-green flex-shrink-0" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Summary strip ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .25 }}
        className="g4 mb-5"
      >
        {[
          { label: 'Activas',       value: summaryStats.active, icon: TrendingUp,   color: '#00d68f' },
          { label: 'Pausadas',      value: summaryStats.paused, icon: TrendingDown, color: '#ff4d6a' },
          { label: 'Leads totales', value: summaryStats.leads,  icon: Users,        color: '#7c5cfc' },
          { label: 'Gasto total',   value: `$${(summaryStats.spent / 100).toFixed(0)}`, icon: DollarSign, color: '#ffb347' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .22, delay: i * .06 }}
              className="card flex items-center gap-3"
              style={{ padding: '12px 14px' }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.color + '1a' }}>
                <Icon size={15} style={{ color: s.color }} />
              </div>
              <div>
                <div className="text-[10px] text-muted font-mono uppercase tracking-wider">{s.label}</div>
                <div className="font-syne font-bold text-[20px] leading-tight" style={{ color: s.color }}>{s.value}</div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Toolbar ───────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .25, delay: .1 }}
        className="flex items-center gap-3 mb-4 flex-wrap"
      >
        {/* Search */}
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          <input
            className="finput"
            placeholder="Buscar campaña..."
            style={{ paddingLeft: 32, maxWidth: 240, width: 240 }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filter */}
        <div className="relative flex items-center gap-1 bg-bg border border-border rounded-lg overflow-hidden">
          <Filter size={12} className="text-muted ml-2.5 flex-shrink-0" />
          <select
            className="fsel"
            style={{ border: 'none', background: 'transparent', paddingLeft: 6, width: 120 }}
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option>Todas</option>
            <option>Activas</option>
            <option>Pausadas</option>
          </select>
        </div>

        <button onClick={load} disabled={loading} className="btn btn-g flex items-center gap-1.5" style={{ padding: '7px 12px', fontSize: 12 }}>
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          Actualizar
        </button>

        <div className="ml-auto flex items-center gap-2">
          {loading && <Spinner size={16} />}
          <span className="text-[11px] text-muted font-mono">{filtered.length} campaña{filtered.length !== 1 ? 's' : ''}</span>
          <button
            onClick={() => navigate('/dashboard/new-campaign')}
            className="btn btn-p flex items-center gap-1.5"
            style={{ fontSize: 12, padding: '6px 12px' }}
          >
            <Plus size={13} />
            Nueva
          </button>
        </div>
      </motion.div>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .25, delay: .15 }}
        className="card"
        style={{ padding: 0, overflow: 'hidden' }}
      >
        <div className="tbl-scroll">
          <table style={{ minWidth: 760 }}>
            <thead>
              <tr>
                <th style={{ paddingLeft: 20 }}>Campaña</th>
                <th>Estado</th>
                <th>Presupuesto</th>
                <th
                  className="cursor-pointer select-none hover:text-text transition-colors"
                  onClick={() => handleSort('spent')}
                >
                  <div className="flex items-center gap-1">Gastado <SortIcon k="spent" /></div>
                </th>
                <th
                  className="cursor-pointer select-none hover:text-text transition-colors"
                  onClick={() => handleSort('ctr')}
                >
                  <div className="flex items-center gap-1">CTR <SortIcon k="ctr" /></div>
                </th>
                <th>CPC</th>
                <th
                  className="cursor-pointer select-none hover:text-text transition-colors"
                  onClick={() => handleSort('leads')}
                >
                  <div className="flex items-center gap-1">Leads <SortIcon k="leads" /></div>
                </th>
                <th
                  className="cursor-pointer select-none hover:text-text transition-colors"
                  onClick={() => handleSort('roas')}
                >
                  <div className="flex items-center gap-1">ROAS <SortIcon k="roas" /></div>
                </th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '48px 20px' }}>
                    <div className="flex flex-col items-center gap-3">
                      <BarChart2 size={32} className="text-dim" />
                      <div className="text-[13px] text-muted">No hay campañas que coincidan</div>
                      <button className="btn btn-p" style={{ fontSize: 12 }} onClick={() => navigate('/dashboard/new-campaign')}>
                        <Plus size={13} /> Crear campaña
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              {filtered.map((c, i) => {
                const roas = parseFloat(c.roas ?? '0');
                const roasColor = roas >= 3 ? '#00d68f' : roas >= 1.5 ? '#ffb347' : '#ff4d6a';
                const isActive = c.status === 'active' || c.status === 'optimizing';
                return (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * .04 }}
                  >
                    <td style={{ paddingLeft: 20 }}>
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-1.5 h-8 rounded-full flex-shrink-0"
                          style={{ background: STATUS_COLORS[c.status] ?? '#666688' }}
                        />
                        <span className="text-[12.5px] font-medium text-text">{c.name}</span>
                      </div>
                    </td>
                    <td><Tag t={tagVariant(c.status) as any}>{statusLabel(c.status)}</Tag></td>
                    <td className="font-mono text-[12px]">{formatBudget(c.daily_budget_cents)}<span className="text-muted text-[10px]">/día</span></td>
                    <td className="font-mono text-[12px]">{formatSpent(c.total_spent_cents)}</td>
                    <td className="font-mono text-[12px]">{normalizeCtr(c.ctr)}</td>
                    <td className="font-mono text-[12px]">{formatCpc(c.cpc_cents)}</td>
                    <td className="font-mono text-[13px] font-semibold" style={{ color: '#7c5cfc' }}>{c.leads}</td>
                    <td className="font-mono text-[13px] font-semibold" style={{ color: roasColor }}>{normalizeRoas(c.roas)}</td>
                    <td>
                      <button
                        className={`btn ${isActive ? 'btn-d' : 'btn-green'} flex items-center gap-1.5`}
                        style={{ padding: '4px 10px', fontSize: 11 }}
                        onClick={() => toggleCampaign(c)}
                        disabled={actionId === c.id}
                      >
                        {actionId === c.id
                          ? <Spinner size={11} />
                          : isActive ? <><Pause size={11} /> Pausar</> : <><Play size={11} /> Activar</>
                        }
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
}
