import api from './client';

export interface CampaignRow {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'optimizing' | 'completed';
  daily_budget_cents: number;
  total_spent_cents: number;
  ctr: string | null;
  cpc_cents: number | null;
  leads: number;
  roas: string | null;
  impressions: number;
  clicks: number;
  created_at: string;
}

export interface DashboardSummary {
  campaigns: Record<string, number>;
  metrics: {
    avg_ctr: string | null;
    avg_roas: string | null;
    total_leads: string | null;
    total_spent: string | null;
    total_impressions: string | null;
    total_clicks: string | null;
  };
  leadsToday: number;
}

export function formatBudget(cents: number) {
  return `$${(cents / 100).toFixed(0)}/día`;
}

export function formatSpent(cents: number) {
  return `$${(cents / 100).toFixed(0)}`;
}

export function formatCpc(cents: number | null) {
  if (!cents) return '—';
  return `$${(cents / 100).toFixed(2)}`;
}

export function normalizeCtr(ctr: string | null) {
  if (!ctr) return '—';
  const n = parseFloat(ctr);
  return isNaN(n) ? '—' : `${n.toFixed(1)}%`;
}

export function normalizeRoas(roas: string | null) {
  if (!roas) return '—';
  const n = parseFloat(roas);
  return isNaN(n) ? '—' : `${n.toFixed(1)}x`;
}

export const campaignsApi = {
  getAll: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get<{ campaigns: CampaignRow[]; total: number; page: number; limit: number }>(
      '/campaigns', { params },
    ),

  pause: (id: string) => api.post(`/campaigns/${id}/pause`),

  resume: (id: string) => api.post(`/campaigns/${id}/resume`),

  getDashboardSummary: () =>
    api.get<DashboardSummary>('/campaigns/dashboard/summary'),
};
