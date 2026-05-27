import api from './client';

export const aiApi = {
  generateScript: (product: string, style: string, format: string) =>
    api.post<{ data: { text: string } }>('/ai/generate-script', { product, style, format }),

  analyzeUrl: (url: string, context?: string) =>
    api.post<{ data: Record<string, unknown> }>('/ai/analyze-url', { url, context }),

  analyzeCampaign: (productName: string, description: string, objective: string) =>
    api.post('/ai/analyze-campaign', { productName, description, objective }),

  generateCreative: (product: string, style: string, format: '9:16' | '4:5' | '1:1', hook?: string) =>
    api.post<{ data: { imageBase64: string } }>('/generative/image', { product, style, format, hook }, { timeout: 90_000 }),

  generateVideo: (imageBase64: string, format: '9:16' | '4:5' | '1:1', movement: 'zoom_in' | 'zoom_out' | 'pan_right' | 'pan_left') =>
    api.post<{ data: { videoBase64: string } }>('/generative/video', { imageBase64, format, movement }, { timeout: 120_000 }),
};
