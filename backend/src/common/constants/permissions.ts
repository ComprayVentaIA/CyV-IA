// Mirrors PLAN_PERMISSIONS in the frontend admin panel
export const PLAN_PERMISSIONS: Record<string, string[]> = {
  starter: [
    'campaigns.create','campaigns.read','campaigns.update','campaigns.publish','campaigns.duplicate',
    'creatives.create','creatives.read',
    'ai.analyze','ai.generate_creatives',
    'meta.connect','meta.publish','meta.sync',
    'whatsapp.connect','whatsapp.track',
    'reports.read','reports.export',
    'billing.read','integrations.manage',
  ],
  growth: [
    'campaigns.create','campaigns.read','campaigns.update','campaigns.delete','campaigns.publish','campaigns.duplicate',
    'creatives.create','creatives.read',
    'ai.analyze','ai.generate_creatives','ai.optimize',
    'meta.connect','meta.publish','meta.sync',
    'whatsapp.connect','whatsapp.track',
    'reports.read','reports.export','reports.schedule',
    'billing.read','billing.manage',
    'users.invite','integrations.manage',
  ],
  scale: [
    'campaigns.create','campaigns.read','campaigns.update','campaigns.delete','campaigns.publish','campaigns.duplicate',
    'creatives.create','creatives.read',
    'ai.analyze','ai.generate_creatives','ai.optimize','ai.advanced',
    'meta.connect','meta.publish','meta.sync',
    'whatsapp.connect','whatsapp.track',
    'reports.read','reports.export','reports.schedule',
    'billing.read','billing.manage',
    'users.invite','users.manage',
    'integrations.manage',
  ],
};

export function getUserEffectivePermissions(plan: string, extraPerms: string[]): Set<string> {
  const planPerms = PLAN_PERMISSIONS[plan] || [];
  return new Set([...planPerms, ...extraPerms]);
}

export function userHasPermission(plan: string, extraPerms: string[], permission: string): boolean {
  const perms = getUserEffectivePermissions(plan, extraPerms);
  return perms.has(permission);
}
