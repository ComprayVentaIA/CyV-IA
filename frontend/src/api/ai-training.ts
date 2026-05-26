import api from './client';

export interface AiPattern {
  id: string;
  source: string;
  type: 'video' | 'image';
  hook: string;
  style: string;
  platform: string;
  tone: string;
  visual_notes: string;
  cta: string;
  audience: string;
  score: number;
  active: boolean;
  uses: number;
  created_at: string;
}

export interface AiTrainingStats {
  active_count: string;
  total_count: string;
  avg_score: string;
  total_uses: string;
}

export const aiTrainingApi = {
  getPatterns: (params?: { platform?: string; search?: string; active?: boolean }) =>
    api.get<AiPattern[]>('/ai-training/patterns', { params }),

  getStats: () =>
    api.get<AiTrainingStats>('/ai-training/stats'),

  create: (dto: Partial<AiPattern> & { hook: string }) =>
    api.post<AiPattern>('/ai-training/patterns', dto),

  update: (id: string, patch: Partial<AiPattern> & { active?: boolean }) =>
    api.put<AiPattern>(`/ai-training/patterns/${id}`, patch),

  remove: (id: string) =>
    api.delete(`/ai-training/patterns/${id}`),

  analyze: (content: string, sourceUrl?: string) =>
    api.post<Partial<AiPattern>>('/ai-training/analyze', { content, sourceUrl }),

  incrementUses: (id: string) =>
    api.post(`/ai-training/patterns/${id}/use`),
};
