export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'manager' | 'support' | 'client' | 'subuser';
  status: 'active' | 'suspended' | 'blocked' | 'pending_verification';
  plan: string | null;
  extraPermissions: string[];
  planFeatures: string[];
  maxCampaigns: number | null;
  maxCreatives: number | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends AuthTokens {
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    subscription: Subscription | null;
  };
}

export interface Subscription {
  status: string;
  plan: string;
  displayName: string;
  maxCampaigns: number | null;
  maxCreatives: number | null;
}

export interface Campaign {
  id: number | string;
  name: string;
  status: 'activa' | 'pausada' | 'optimizando';
  budget: string;
  spent: string;
  ctr: string;
  cpc: string;
  leads: number;
  roas: string;
}

export interface Creative {
  id: string;
  name: string;
  fmt: '9:16' | '4:5' | '1:1';
  type: 'video' | 'image';
  status: 'listo' | 'generando' | 'borrador';
  ctr?: string;
  icon: string;
  bg: string;
  hook?: string;
  platform: 'reels' | 'stories' | 'feed';
  imageUrl?: string;
}

export interface Plan {
  id: 'starter' | 'growth' | 'scale';
  name: string;
  price: number;
  featured: boolean;
  features: string[];
  no: string[];
}

export type TagVariant = 'tg' | 'tr' | 'ta' | 'tb' | 'tp' | 'tk';

export interface ApiError {
  message: string;
  statusCode?: number;
}
