import api from './client';

export interface ReportRow {
  id: string;
  type: string;
  period_start: string;
  period_end: string;
  summary: {
    totalCampaigns: number;
    activeCampaigns: number;
    totalSpent: number;
    totalLeads: number;
    avgCtr: number;
    avgRoas: number;
    bestCampaign: string | null;
    worstCampaign: string | null;
  };
  insights: Array<{
    type: string;
    title: string;
    detail: string;
    action: string;
    priority: string;
  }>;
  pdf_url: string | null;
  created_at: string;
}

export const reportsApi = {
  getAll: (page = 1, limit = 10) =>
    api.get<{ reports: ReportRow[]; total: number; page: number; limit: number }>(
      '/reports', { params: { page, limit } },
    ),

  generate: () => api.post('/reports/generate'),
};
