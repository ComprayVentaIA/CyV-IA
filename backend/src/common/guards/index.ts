import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Pool } from 'pg';
import { PLAN_PERMISSIONS } from '../constants/permissions';
import { DATABASE_POOL } from '../../database/database.module';

// ─── JWT Auth Guard (re-exported for convenience) ────────────────────────────
export { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

// ─── Roles guard ─────────────────────────────────────────────────────────────

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new ForbiddenException('No autenticado');

    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) throw new ForbiddenException(`Se requiere rol: ${requiredRoles.join(' o ')}`);

    return true;
  }
}

// ─── Permissions guard ────────────────────────────────────────────────────────

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermission = (...perms: string[]) => SetMetadata(PERMISSIONS_KEY, perms);

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new ForbiddenException('No autenticado');

    if (user.role === 'admin') return true;

    const planPerms: string[] = PLAN_PERMISSIONS[user.plan] || [];
    const extraPerms: string[] = user.extraPermissions || [];
    const effectivePerms = new Set([...planPerms, ...extraPerms]);

    const hasAll = required.every(perm => effectivePerms.has(perm));
    if (!hasAll) {
      const missing = required.filter(p => !effectivePerms.has(p));
      throw new ForbiddenException(`Permisos insuficientes: ${missing.join(', ')}`);
    }
    return true;
  }
}

// ─── Campaign limit guard ─────────────────────────────────────────────────────

@Injectable()
export class CampaignLimitGuard implements CanActivate {
  constructor(@Inject(DATABASE_POOL) private db: Pool) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user || user.role === 'admin') return true;
    if (user.maxCampaigns === null) return true;

    const { rows } = await this.db.query(
      "SELECT COUNT(*) AS cnt FROM campaigns WHERE user_id = $1 AND status != 'completed'",
      [user.id],
    );
    const used = parseInt(rows[0].cnt);
    if (used >= user.maxCampaigns) {
      throw new ForbiddenException(
        `Límite de campañas alcanzado (${used}/${user.maxCampaigns}). Actualizá tu plan para crear más.`,
      );
    }
    return true;
  }
}
