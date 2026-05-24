import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL } from '../database/database.module';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@Injectable()
export class CampaignsService {
  constructor(@Inject(DATABASE_POOL) private readonly db: Pool) {}

  async findAll(userId: string, filters: { status?: string; page: number; limit: number }) {
    const { status, page, limit } = filters;
    const offset = (page - 1) * limit;
    const conditions = ['c.user_id = $1'];
    const params: any[] = [userId];
    let idx = 2;

    if (status) { conditions.push(`c.status = $${idx++}`); params.push(status); }

    const { rows } = await this.db.query(
      `SELECT c.*,
              ma.name AS meta_account_name,
              ma.meta_ad_account_id,
              (SELECT COUNT(*) FROM creatives WHERE campaign_id = c.id) AS creative_count
       FROM campaigns c
       LEFT JOIN meta_accounts ma ON ma.id = c.meta_account_id
       WHERE ${conditions.join(' AND ')}
       ORDER BY c.created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset],
    );

    const { rows: count } = await this.db.query(
      `SELECT COUNT(*) AS total FROM campaigns c WHERE ${conditions.join(' AND ')}`,
      params,
    );

    return { campaigns: rows, total: parseInt(count[0].total), page, limit };
  }

  async findOne(id: string, userId: string) {
    const { rows } = await this.db.query(
      `SELECT c.*,
              ma.name AS meta_account_name,
              ma.meta_ad_account_id,
              ma.whatsapp_number AS account_whatsapp,
              json_agg(DISTINCT cr.*) FILTER (WHERE cr.id IS NOT NULL) AS creatives
       FROM campaigns c
       LEFT JOIN meta_accounts ma ON ma.id = c.meta_account_id
       LEFT JOIN creatives cr ON cr.campaign_id = c.id
       WHERE c.id = $1 AND c.user_id = $2
       GROUP BY c.id, ma.id`,
      [id, userId],
    );
    if (!rows.length) throw new NotFoundException('Campaña no encontrada');
    return rows[0];
  }

  async create(userId: string, dto: CreateCampaignDto) {
    const { rows } = await this.db.query(
      `INSERT INTO campaigns
         (user_id, meta_account_id, name, objective, daily_budget_cents,
          whatsapp_number, whatsapp_message, targeting)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        userId,
        dto.metaAccountId ?? null,
        dto.name,
        dto.objective ?? 'whatsapp',
        Math.round((dto.dailyBudgetUsd ?? 25) * 100),
        dto.whatsappNumber ?? null,
        dto.whatsappMessage ?? null,
        JSON.stringify(dto.targeting ?? {}),
      ],
    );
    return rows[0];
  }

  async update(id: string, userId: string, dto: UpdateCampaignDto) {
    const sets: string[] = ['updated_at = NOW()'];
    const params: any[] = [];
    let idx = 1;

    if (dto.name) { sets.push(`name = $${idx++}`); params.push(dto.name); }
    if (dto.dailyBudgetUsd) { sets.push(`daily_budget_cents = $${idx++}`); params.push(Math.round(dto.dailyBudgetUsd * 100)); }
    if (dto.whatsappNumber) { sets.push(`whatsapp_number = $${idx++}`); params.push(dto.whatsappNumber); }
    if (dto.whatsappMessage) { sets.push(`whatsapp_message = $${idx++}`); params.push(dto.whatsappMessage); }
    if (dto.targeting) { sets.push(`targeting = $${idx++}`); params.push(JSON.stringify(dto.targeting)); }

    params.push(id, userId);
    const { rows } = await this.db.query(
      `UPDATE campaigns SET ${sets.join(', ')}
       WHERE id = $${idx} AND user_id = $${idx + 1}
       RETURNING *`,
      params,
    );
    if (!rows.length) throw new NotFoundException('Campaña no encontrada');
    return rows[0];
  }

  async remove(id: string, userId: string) {
    const { rows } = await this.db.query(
      "SELECT status FROM campaigns WHERE id = $1 AND user_id = $2",
      [id, userId],
    );
    if (!rows.length) throw new NotFoundException('Campaña no encontrada');
    if (rows[0].status === 'active') {
      throw new ForbiddenException('Pausá la campaña antes de eliminarla');
    }
    await this.db.query("DELETE FROM campaigns WHERE id = $1", [id]);
  }

  async duplicate(id: string, userId: string) {
    const original = await this.findOne(id, userId);
    const { rows } = await this.db.query(
      `INSERT INTO campaigns
         (user_id, meta_account_id, name, objective, daily_budget_cents,
          whatsapp_number, whatsapp_message, targeting,
          ai_hook, ai_copy_headline, ai_copy_body, ai_copy_cta, ai_audience_notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`,
      [
        userId, original.meta_account_id,
        `${original.name} (copia)`,
        original.objective, original.daily_budget_cents,
        original.whatsapp_number, original.whatsapp_message,
        original.targeting, original.ai_hook, original.ai_copy_headline,
        original.ai_copy_body, original.ai_copy_cta, original.ai_audience_notes,
      ],
    );
    return rows[0];
  }

  async saveAiStrategy(id: string, strategy: any) {
    const { rows } = await this.db.query(
      `UPDATE campaigns SET
         ai_hook = $1, ai_copy_headline = $2, ai_copy_body = $3,
         ai_copy_cta = $4, ai_audience_notes = $5, targeting = $6,
         updated_at = NOW()
       WHERE id = $7 RETURNING *`,
      [
        strategy.hook, strategy.headline, strategy.body,
        strategy.cta, strategy.audience?.description,
        JSON.stringify(strategy.audience || {}), id,
      ],
    );
    return { campaign: rows[0], strategy };
  }

  async getDashboardSummary(userId: string) {
    const [campaigns, metrics, leads] = await Promise.all([
      this.db.query(
        `SELECT status, COUNT(*) AS count FROM campaigns
         WHERE user_id = $1 GROUP BY status`,
        [userId],
      ),
      this.db.query(
        `SELECT
           AVG(ctr) AS avg_ctr,
           AVG(roas) AS avg_roas,
           SUM(leads) AS total_leads,
           SUM(total_spent_cents) AS total_spent,
           SUM(impressions) AS total_impressions,
           SUM(clicks) AS total_clicks
         FROM campaigns WHERE user_id = $1`,
        [userId],
      ),
      this.db.query(
        "SELECT COUNT(*) AS today FROM leads WHERE user_id = $1 AND created_at >= CURRENT_DATE",
        [userId],
      ),
    ]);

    const statusMap: Record<string, number> = {};
    campaigns.rows.forEach((r: any) => { statusMap[r.status] = parseInt(r.count); });

    return {
      campaigns: statusMap,
      metrics: metrics.rows[0],
      leadsToday: parseInt(leads.rows[0].today),
    };
  }
}
