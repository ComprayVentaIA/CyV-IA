import api from './client';

export const aiApi = {
  generateScript: (product: string, style: string, format: string) =>
    api.post<{ data: { text: string } }>('/ai/generate-script', { product, style, format }),

  analyzeUrl: (url: string, context?: string) =>
    api.post<{ data: Record<string, unknown> }>('/ai/analyze-url', { url, context }),

  analyzeCampaign: (productName: string, description: string, objective: string) =>
    api.post('/ai/analyze-campaign', { productName, description, objective }),
};
