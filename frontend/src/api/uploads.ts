import api from './client';

export interface UploadedFile {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  type: 'image' | 'video';
}

export const uploadsApi = {
  upload: (files: File[], onProgress?: (pct: number) => void) => {
    const form = new FormData();
    files.forEach(f => form.append('files', f));
    return api.post<{ data: { files: UploadedFile[] } }>('/uploads', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: e => {
        if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total));
      },
    });
  },
};
