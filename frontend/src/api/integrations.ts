import api from './client';

export interface Integration {
  id: string;
  type: string;
  config: Record<string, string>;
  status: 'connected' | 'disconnected';
  connected_at: string;
}

export const integrationsApi = {
  getAll: () =>
    api.get<Integration[]>('/integrations'),

  save: (type: string, config: Record<string, string>) =>
    api.post<Integration>(`/integrations/${type}`, config),

  disconnect: (type: string) =>
    api.delete(`/integrations/${type}`),
};
