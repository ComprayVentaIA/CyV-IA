import {
  Injectable, Inject, NotFoundException,
  ConflictException, ForbiddenException, Logger,
} from '@nestjs/common';
import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';
import { DATABASE_POOL } from '../database/database.module';
import { EmailService } from '../common/services/email.service';
import { CacheService } from '../common/services/cache.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateRoleDto } from './dto/create-role.dto';

// ─── Full permission set ──────────────────────────────────────────────────────
export const ALL_PERMISSIONS = [
  // Campaigns
  'campaigns.create', 'campaigns.read', 'campaigns.update',
  'campaigns.delete', 'campaigns.publish', 'campaigns.duplicate',
  // Creatives
  'creatives.create', 'creatives.read', 'creatives.delete',
  // Meta Ads
  'meta.connect', 'meta.publish', 'meta.sync',
  // AI
  'ai.analyze', 'ai.generate_creatives', 'ai.optimize',
  // Reports
  'reports.read', 'reports.export', 'reports.schedule',
  // WhatsApp
  'whatsapp.connect', 'whatsapp.track',
  // Billing
  'billing.read', 'billing.manage',
  // Users
  'users.invite', 'users.manage',
  // Integrations
  'integrations.manage',
  // Admin
  'admin.access', 'admin.users', 'admin.billing',
  'admin.system', 'admin.impersonate', 'admin.audit',
  'admin.announcements', 'admin.feature_flags',
] as const;

export type Permission = typeof ALL_PERMISSIONS[number];

// Preset role permission sets
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  admin: ALL_PERMISSIONS as unknown as Permission[],
  manager: [
    'campaigns.create','campaigns.read','campaigns.update','campaigns.publish','campaigns.duplicate',
    'creatives.create','creatives.read','meta.connect','meta.publish','meta.sync',
    'ai.analyze','ai.generate_creatives','ai.optimize',
    'reports.read','reports.export','whatsapp.connect','whatsapp.track',
    'billing.read','users.invite','users.manage','integrations.manage',
    'admin.access','admin.users',
  ],
  support: [
    'campaigns.read','creatives.read','reports.read',
    'admin.access','admin.users','admin.audit',
  ],
  client: [
    'campaigns.create','campaigns.read','campaigns.update','campaigns.publish','campaigns.duplicate',
    'creatives.create','creatives.read','meta.connect','meta.publish','meta.sync',
    'ai.analyze','ai.generate_creatives','ai.optimize',
    'reports.read','reports.export','reports.schedule',
    'whatsapp.connect','whatsapp.track','billing.read','integrations.manage',
  ],
  subuser: [
    'campaigns.read','creatives.read','reports.read',
  ],
};

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @Inject(DATABASE_POOL) private readonly db: Pool,
    private readonly emailService: EmailService,
    private readonly cache: CacheService,
  ) {}

  // ── Dashboard metrics ─────────────────────────────────────────────────────

  async getDashboardMetrics() {
    const [users, subs, campaigns, leads] = await Promise.all([
      this.db.query(`SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'active') AS active,
        COUNT(*) FILTER (WHERE status = 'suspended') AS suspended,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') AS new_30d
        FROM users WHERE role != 'admin'`),
      this.db.query(`SELECT
        COUNT(*) FILTER (WHERE s.status = 'active') AS active,
        COUNT(*) FILTER (WHERE p.name = 'starter') AS starter,
        COUNT(*) FILTER (WHERE p.name = 'growth') AS growth,
        COUNT(*) FILTER (WHERE p.name = 'scale') AS scale,
        SUM(p.price_usd_cents) FILTER (WHERE s.status = 'active') AS mrr_cents
        FROM subscriptions s JOIN plans p ON p.id = s.plan_id`),
      this.db.query(`SELECT COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'active') AS active
        FROM campaigns`),
      this.db.query(`SELECT COUNT(*) AS total,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') AS today
        FROM leads`),
    ]);

    return {
      users: users.rows[0],
      subscriptions: subs.rows[0],
      campaigns: campaigns.rows[0],
      leads: leads.rows[0],
    };
  }

  // ── User management ───────────────────────────────────────────────────────

  async getUsers(filters: { search?: string; role?: string; status?: string; plan?: string; page?: number; limit?: number }) {
    const { search, role, status, plan, page = 1, limit = 20 } = filters;
    const offset = (page - 1) * limit;
    const conditions: string[] = ["u.role != 'admin'"];
    const params: any[] = [];
    let idx = 1;

    if (search) {
      conditions.push(`(u.full_name ILIKE $${idx} OR u.email ILIKE $${idx})`);
      params.push(`%${search}%`); idx++;
    }
    if (role) { conditions.push(`u.role = $${idx}`); params.push(role); idx++; }
    if (status) { conditions.push(`u.status = $${idx}`); params.push(status); idx++; }
    if (plan) { conditions.push(`p.name = $${idx}`); params.push(plan); idx++; }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const { rows: users } = await this.db.query(
      `SELECT u.id, u.email, u.full_name, u.role, u.status, u.email_verified,
              u.last_login_at, u.created_at,
              p.name AS plan_name, p.display_name AS plan_display,
              p.price_usd_cents,
              s.status AS sub_status, s.current_period_end,
              (SELECT COUNT(*) FROM campaigns WHERE user_id = u.id) AS campaign_count,
              (SELECT COUNT(*) FROM leads WHERE user_id = u.id) AS lead_count,
              COALESCE((SELECT json_agg(extra_perms) FROM (SELECT jsonb_array_elements_text(u.extra_permissions) AS extra_perms) ep), '[]') AS extra_permissions
       FROM users u
       LEFT JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active'
       LEFT JOIN plans p ON p.id = s.plan_id
       ${where}
       ORDER BY u.created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset],
    );

    const { rows: count } = await this.db.query(
      `SELECT COUNT(*) AS total FROM users u
       LEFT JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active'
       LEFT JOIN plans p ON p.id = s.plan_id
       ${where}`,
      params,
    );

    return { users, total: parseInt(count[0].total), page, limit };
  }

  async getUserDetail(userId: string) {
    const { rows } = await this.db.query(
      `SELECT u.*, p.name AS plan_name, p.display_name, p.price_usd_cents,
              s.status AS sub_status, s.stripe_subscription_id, s.current_period_start, s.current_period_end,
              s.canceled_at
       FROM users u
       LEFT JOIN subscriptions s ON s.user_id = u.id AND s.status IN ('active','trialing')
       LEFT JOIN plans p ON p.id = s.plan_id
       WHERE u.id = $1`,
      [userId],
    );
    if (rows.length === 0) throw new NotFoundException('Usuario no encontrado');

    const user = rows[0];
    delete user.password_hash;

    // Get recent activity
    const { rows: activity } = await this.db.query(
      `SELECT action, entity, entity_id, ip_address, created_at
       FROM audit_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20`,
      [userId],
    );

    // Get campaigns summary
    const { rows: campaigns } = await this.db.query(
      `SELECT name, status, impressions, clicks, leads, roas, total_spent_cents, created_at
       FROM campaigns WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10`,
      [userId],
    );

    return { ...user, activity, campaigns };
  }

  async createUser(adminId: string, dto: CreateUserDto) {
    const existing = await this.db.query('SELECT id FROM users WHERE email = $1', [dto.email.toLowerCase()]);
    if (existing.rows.length > 0) throw new ConflictException('Email ya registrado');

    const passwordHash = await bcrypt.hash(dto.password || Math.random().toString(36).slice(-12), 12);
    const extraPerms = dto.extraPermissions ? JSON.stringify(dto.extraPermissions) : '[]';

    const { rows } = await this.db.query(
      `INSERT INTO users (email, password_hash, full_name, role, status, email_verified, extra_permissions)
       VALUES ($1, $2, $3, $4, 'active', TRUE, $5)
       RETURNING id, email, full_name, role, status`,
      [dto.email.toLowerCase(), passwordHash, dto.fullName, dto.role || 'client', extraPerms],
    );

    // Assign plan
    if (dto.planName) {
      const planResult = await this.db.query('SELECT id FROM plans WHERE name = $1', [dto.planName]);
      if (planResult.rows.length > 0) {
        await this.db.query(
          `INSERT INTO subscriptions (user_id, plan_id, status) VALUES ($1, $2, 'active')`,
          [rows[0].id, planResult.rows[0].id],
        );
      }
    }

    await this.logAction(adminId, 'admin.create_user', 'user', rows[0].id, { email: dto.email, role: dto.role });

    if (dto.sendWelcomeEmail) {
      await this.emailService.sendWelcomeAdmin(dto.email, dto.fullName, dto.password);
    }

    return rows[0];
  }

  async updateUser(adminId: string, userId: string, dto: UpdateUserDto) {
    const sets: string[] = ['updated_at = NOW()'];
    const params: any[] = [];
    let idx = 1;

    if (dto.fullName) { sets.push(`full_name = $${idx++}`); params.push(dto.fullName); }
    if (dto.email) { sets.push(`email = $${idx++}`); params.push(dto.email.toLowerCase()); }
    if (dto.role) { sets.push(`role = $${idx++}`); params.push(dto.role); }
    if (dto.status) { sets.push(`status = $${idx++}`); params.push(dto.status); }
    if (dto.extraPermissions !== undefined) {
      sets.push(`extra_permissions = $${idx++}`);
      params.push(JSON.stringify(dto.extraPermissions));
    }
    if (dto.password) {
      const hash = await bcrypt.hash(dto.password, 12);
      sets.push(`password_hash = $${idx++}`);
      params.push(hash);
    }

    params.push(userId);
    const { rows } = await this.db.query(
      `UPDATE users SET ${sets.join(', ')} WHERE id = $${idx} RETURNING id, email, full_name, role, status`,
      params,
    );
    if (rows.length === 0) throw new NotFoundException('Usuario no encontrado');

    await this.cache.del(`user:${userId}`);
    await this.logAction(adminId, 'admin.update_user', 'user', userId, dto);
    return rows[0];
  }

  async suspendUser(adminId: string, userId: string, reason: string) {
    if (adminId === userId) throw new ForbiddenException('No podés suspender tu propia cuenta');
    await this.db.query(
      "UPDATE users SET status = 'suspended', suspended_reason = $2, updated_at = NOW() WHERE id = $1",
      [userId, reason],
    );
    // Invalidate JWT cache so the next request checks DB status
    await this.cache.del(`user:${userId}`);
    await this.logAction(adminId, 'admin.suspend_user', 'user', userId, { reason });
    return { message: 'Usuario suspendido' };
  }

  async activateUser(adminId: string, userId: string) {
    await this.db.query(
      "UPDATE users SET status = 'active', suspended_reason = NULL, blocked_reason = NULL, updated_at = NOW() WHERE id = $1",
      [userId],
    );
    await this.cache.del(`user:${userId}`);
    await this.logAction(adminId, 'admin.activate_user', 'user', userId);
    return { message: 'Usuario activado' };
  }

  async blockUser(adminId: string, userId: string, reason: string) {
    if (adminId === userId) throw new ForbiddenException('No podés bloquear tu propia cuenta');
    await this.db.query(
      "UPDATE users SET status = 'blocked', blocked_reason = $2, updated_at = NOW() WHERE id = $1",
      [userId, reason],
    );
    // Immediately revoke all active sessions + invalidate JWT cache
    await Promise.all([
      this.db.query("UPDATE refresh_tokens SET revoked = TRUE WHERE user_id = $1", [userId]),
      this.cache.del(`user:${userId}`),
    ]);
    await this.logAction(adminId, 'admin.block_user', 'user', userId, { reason });
    return { message: 'Usuario bloqueado' };
  }

  async deleteUser(adminId: string, userId: string) {
    if (adminId === userId) throw new ForbiddenException('No podés eliminar tu propia cuenta');
    await this.cache.del(`user:${userId}`);
    await this.db.query('DELETE FROM users WHERE id = $1', [userId]);
    await this.logAction(adminId, 'admin.delete_user', 'user', userId);
    return { message: 'Usuario eliminado permanentemente' };
  }

  async impersonateUser(adminId: string, targetUserId: string) {
    const { rows } = await this.db.query(
      "SELECT id, email, role FROM users WHERE id = $1 AND status = 'active'",
      [targetUserId],
    );
    if (rows.length === 0) throw new NotFoundException('Usuario no encontrado o inactivo');
    if (rows[0].role === 'admin') throw new ForbiddenException('No podés impersonar a otro administrador');

    await this.logAction(adminId, 'admin.impersonate', 'user', targetUserId);
    // Returns a token for the target user — handled by AuthService
    return { userId: targetUserId, email: rows[0].email, impersonatedBy: adminId };
  }

  async resetUserPassword(adminId: string, userId: string) {
    const { rows } = await this.db.query('SELECT email, full_name FROM users WHERE id = $1', [userId]);
    if (rows.length === 0) throw new NotFoundException('Usuario no encontrado');

    const tempPassword = Math.random().toString(36).slice(-10) + 'A1!';
    const hash = await bcrypt.hash(tempPassword, 12);
    await this.db.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [hash, userId]);
    await this.emailService.sendPasswordResetAdmin(rows[0].email, rows[0].full_name, tempPassword);
    await this.logAction(adminId, 'admin.reset_password', 'user', userId);
    return { message: 'Contraseña reseteada y enviada por email' };
  }

  async overridePlan(adminId: string, userId: string, planName: string) {
    const planResult = await this.db.query('SELECT id FROM plans WHERE name = $1', [planName]);
    if (planResult.rows.length === 0) throw new NotFoundException('Plan no encontrado');

    // Find existing active subscription and update it; insert if none exists
    const existing = await this.db.query(
      `SELECT id FROM subscriptions WHERE user_id = $1 AND status IN ('active','trialing')
       ORDER BY created_at DESC LIMIT 1`,
      [userId],
    );

    if (existing.rows.length > 0) {
      await this.db.query(
        'UPDATE subscriptions SET plan_id = $1, updated_at = NOW() WHERE id = $2',
        [planResult.rows[0].id, existing.rows[0].id],
      );
    } else {
      await this.db.query(
        `INSERT INTO subscriptions (user_id, plan_id, status) VALUES ($1, $2, 'active')`,
        [userId, planResult.rows[0].id],
      );
    }

    await this.logAction(adminId, 'admin.override_plan', 'user', userId, { plan: planName });
    return { message: `Plan cambiado a ${planName}` };
  }

  async setUserPermissions(adminId: string, userId: string, permissions: string[]) {
    await this.db.query(
      'UPDATE users SET extra_permissions = $1, updated_at = NOW() WHERE id = $2',
      [JSON.stringify(permissions), userId],
    );
    await this.logAction(adminId, 'admin.set_permissions', 'user', userId, { permissions });
    return { message: 'Permisos actualizados' };
  }

  // ── Feature flags ─────────────────────────────────────────────────────────

  async getFeatureFlags() {
    const { rows } = await this.db.query('SELECT * FROM feature_flags ORDER BY name');
    return rows;
  }

  async toggleFeatureFlag(adminId: string, flagId: string, enabled: boolean) {
    await this.db.query(
      'UPDATE feature_flags SET enabled = $1, updated_at = NOW() WHERE id = $2',
      [enabled, flagId],
    );
    await this.logAction(adminId, 'admin.toggle_feature', 'feature_flag', flagId, { enabled });
    return { message: `Feature flag ${enabled ? 'activada' : 'desactivada'}` };
  }

  // ── Plans management ──────────────────────────────────────────────────────

  async updatePlanPrice(adminId: string, planName: string, priceCents: number) {
    const { rows } = await this.db.query(
      'UPDATE plans SET price_usd_cents = $1, updated_at = NOW() WHERE name = $2 RETURNING *',
      [priceCents, planName],
    );
    if (rows.length === 0) throw new NotFoundException('Plan no encontrado');
    await this.logAction(adminId, 'admin.update_plan_price', 'plan', rows[0].id, { price: priceCents });
    return rows[0];
  }

  // ── Audit log ─────────────────────────────────────────────────────────────

  async getAuditLog(filters: { userId?: string; action?: string; page?: number; limit?: number }) {
    const { userId, action, page = 1, limit = 50 } = filters;
    const conditions: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (userId) { conditions.push(`al.user_id = $${idx++}`); params.push(userId); }
    if (action) { conditions.push(`al.action ILIKE $${idx++}`); params.push(`%${action}%`); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const offset = (page - 1) * limit;

    const { rows } = await this.db.query(
      `SELECT al.*, u.full_name, u.email
       FROM audit_logs al
       LEFT JOIN users u ON u.id = al.user_id
       ${where}
       ORDER BY al.created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset],
    );

    return rows;
  }

  // ── Announcements ─────────────────────────────────────────────────────────

  async sendAnnouncement(adminId: string, dto: {
    subject: string; body: string;
    target: 'all' | 'plan' | 'user';
    targetValue?: string;
  }) {
    let emails: { email: string; name: string }[] = [];

    if (dto.target === 'all') {
      const { rows } = await this.db.query(
        "SELECT email, full_name AS name FROM users WHERE status = 'active' AND role != 'admin'",
      );
      emails = rows;
    } else if (dto.target === 'plan' && dto.targetValue) {
      const { rows } = await this.db.query(
        `SELECT u.email, u.full_name AS name FROM users u
         JOIN subscriptions s ON s.user_id = u.id
         JOIN plans p ON p.id = s.plan_id
         WHERE p.name = $1 AND s.status = 'active' AND u.status = 'active'`,
        [dto.targetValue],
      );
      emails = rows;
    } else if (dto.target === 'user' && dto.targetValue) {
      const { rows } = await this.db.query(
        'SELECT email, full_name AS name FROM users WHERE id = $1',
        [dto.targetValue],
      );
      emails = rows;
    }

    let sent = 0;
    for (const recipient of emails) {
      try {
        await this.emailService.sendAnnouncement(recipient.email, recipient.name, dto.subject, dto.body);
        sent++;
      } catch (err: any) {
        this.logger.error(`Failed to send to ${recipient.email}: ${err.message}`);
      }
    }

    await this.logAction(adminId, 'admin.send_announcement', undefined, undefined, {
      subject: dto.subject, target: dto.target, sent,
    });

    return { sent, total: emails.length };
  }

  // ── Global stats ──────────────────────────────────────────────────────────

  async getGlobalStats() {
    const [revenue, growth, topUsers] = await Promise.all([
      this.db.query(`SELECT
        SUM(p.price_usd_cents) FILTER (WHERE s.status = 'active') / 100.0 AS mrr,
        SUM(p.price_usd_cents) FILTER (WHERE s.status = 'active' AND s.created_at >= NOW() - INTERVAL '30 days') / 100.0 AS new_mrr,
        COUNT(s.id) FILTER (WHERE s.status = 'canceled') AS churned_30d
        FROM subscriptions s JOIN plans p ON p.id = s.plan_id
        WHERE s.created_at >= NOW() - INTERVAL '30 days'`),
      this.db.query(`SELECT DATE_TRUNC('day', created_at) AS day, COUNT(*) AS count
        FROM users WHERE created_at >= NOW() - INTERVAL '30 days' GROUP BY day ORDER BY day`),
      this.db.query(`SELECT u.full_name, u.email, p.name AS plan,
        COUNT(DISTINCT c.id) AS campaigns,
        SUM(c.leads) AS leads, SUM(c.total_spent_cents)/100.0 AS spent
        FROM users u
        JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active'
        JOIN plans p ON p.id = s.plan_id
        LEFT JOIN campaigns c ON c.user_id = u.id
        GROUP BY u.id, p.name
        ORDER BY leads DESC NULLS LAST LIMIT 10`),
    ]);

    return {
      revenue: revenue.rows[0],
      userGrowth: growth.rows,
      topUsers: topUsers.rows,
    };
  }

  // ── Roles management ─────────────────────────────────────────────────────

  async getRoles() {
    const { rows } = await this.db.query(
      'SELECT * FROM custom_roles WHERE is_active = TRUE ORDER BY created_at ASC',
    );
    return rows;
  }

  async createRole(adminId: string, dto: CreateRoleDto) {
    const { rows } = await this.db.query(
      `INSERT INTO custom_roles (name, display_name, description, permissions, color, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        dto.name.toLowerCase().replace(/\s+/g, '_'),
        dto.displayName,
        dto.description ?? null,
        JSON.stringify(dto.permissions),
        dto.color ?? '#7c5cfc',
        adminId,
      ],
    );
    await this.logAction(adminId, 'admin.create_role', 'custom_role', rows[0].id, { name: dto.name });
    return rows[0];
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private async logAction(userId: string, action: string, entity?: string, entityId?: string, payload?: any) {
    await this.db.query(
      `INSERT INTO audit_logs (user_id, action, entity, entity_id, payload)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, action, entity ?? null, entityId ?? null, payload ? JSON.stringify(payload) : null],
    );
  }
}
