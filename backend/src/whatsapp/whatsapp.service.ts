import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import axios from 'axios';
import { DATABASE_POOL } from '../database/database.module';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private readonly baseUrl = 'https://graph.facebook.com/v19.0';

  constructor(
    @Inject(DATABASE_POOL) private readonly db: Pool,
    private readonly config: ConfigService,
  ) {}

  // ── Handle incoming webhook (lead clicked WA button) ──────────────────────

  async handleWebhook(body: any) {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (!value?.messages?.length) return;

    const msg = value.messages[0];
    const phoneNumber = msg.from; // lead's phone
    const businessPhoneId = value.metadata?.phone_number_id;
    const text = msg.text?.body || '';

    this.logger.log(`📱 New WA message from ${phoneNumber}: "${text.slice(0, 50)}"`);

    // Find user by phone number ID
    const accountResult = await this.db.query(
      `SELECT ma.user_id, c.id AS campaign_id
       FROM meta_accounts ma
       LEFT JOIN campaigns c ON c.user_id = ma.user_id AND c.status = 'active'
       WHERE ma.whatsapp_number = $1
       LIMIT 1`,
      [businessPhoneId],
    );

    if (!accountResult.rows.length) return;
    const { user_id, campaign_id } = accountResult.rows[0];

    // Upsert lead
    await this.db.query(
      `INSERT INTO leads (user_id, campaign_id, whatsapp_number, status, first_contact_at)
       VALUES ($1, $2, $3, 'new', NOW())
       ON CONFLICT (whatsapp_number, user_id) DO UPDATE SET
         status = CASE WHEN leads.status = 'new' THEN 'new' ELSE leads.status END,
         updated_at = NOW()`,
      [user_id, campaign_id ?? null, phoneNumber],
    );

    this.logger.log(`✅ Lead registrado: ${phoneNumber}`);
  }

  // ── Verify webhook (Meta requires GET verification) ───────────────────────

  verifyWebhook(mode: string, token: string, challenge: string): string | null {
    const verifyToken = this.config.get<string>('meta.webhookVerifyToken');
    if (mode === 'subscribe' && token === verifyToken) return challenge;
    return null;
  }

  // ── Get leads for user ────────────────────────────────────────────────────

  async getLeads(userId: string, filters: { status?: string; campaignId?: string; page?: number; limit?: number }) {
    const { status, campaignId, page = 1, limit = 50 } = filters;
    const offset = (page - 1) * limit;
    const conditions = ['l.user_id = $1'];
    const params: any[] = [userId];
    let idx = 2;

    if (status) { conditions.push(`l.status = $${idx++}`); params.push(status); }
    if (campaignId) { conditions.push(`l.campaign_id = $${idx++}`); params.push(campaignId); }

    const { rows } = await this.db.query(
      `SELECT l.*, c.name AS campaign_name
       FROM leads l
       LEFT JOIN campaigns c ON c.id = l.campaign_id
       WHERE ${conditions.join(' AND ')}
       ORDER BY l.created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset],
    );

    return rows;
  }

  // ── Update lead status ────────────────────────────────────────────────────

  async updateLeadStatus(leadId: string, userId: string, status: string, notes?: string) {
    const sets = ['status = $1', 'updated_at = NOW()'];
    const params: any[] = [status];
    let idx = 2;

    if (notes) { sets.push(`notes = $${idx++}`); params.push(notes); }
    if (status === 'converted') { sets.push(`converted_at = NOW()`); }

    params.push(leadId, userId);
    await this.db.query(
      `UPDATE leads SET ${sets.join(', ')}
       WHERE id = $${idx} AND user_id = $${idx + 1}`,
      params,
    );
  }

  // ── Lead metrics summary ──────────────────────────────────────────────────

  async getLeadMetrics(userId: string) {
    const { rows } = await this.db.query(
      `SELECT
         COUNT(*) AS total,
         COUNT(*) FILTER (WHERE status = 'new') AS new_leads,
         COUNT(*) FILTER (WHERE status = 'contacted') AS contacted,
         COUNT(*) FILTER (WHERE status = 'converted') AS converted,
         COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) AS today,
         COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') AS last_7d,
         ROUND(COUNT(*) FILTER (WHERE status = 'converted')::numeric / NULLIF(COUNT(*),0) * 100, 1) AS conversion_rate
       FROM leads WHERE user_id = $1`,
      [userId],
    );
    return rows[0];
  }
}
