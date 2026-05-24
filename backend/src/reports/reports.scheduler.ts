import { Injectable, Inject, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Pool } from 'pg';
import { DATABASE_POOL } from '../database/database.module';
import { AiService } from '../ai/ai.service';
import { EmailService } from '../common/services/email.service';

@Injectable()
export class ReportsScheduler {
  private readonly logger = new Logger(ReportsScheduler.name);

  constructor(
    @Inject(DATABASE_POOL) private readonly db: Pool,
    private readonly aiService: AiService,
    private readonly emailService: EmailService,
  ) {}

  // ── Daily 8 PM report (Argentina time = UTC-3 → 23:00 UTC) ───────────────
  @Cron('0 23 * * *', { timeZone: 'America/Argentina/Buenos_Aires' })
  async generateDailyReports() {
    this.logger.log('🕗 Iniciando generación de informes diarios 20:00...');

    // Get all active users with active subscriptions
    const { rows: users } = await this.db.query(
      `SELECT DISTINCT u.id, u.email, u.full_name
       FROM users u
       JOIN subscriptions s ON s.user_id = u.id
       WHERE s.status IN ('active','trialing') AND u.status = 'active'`,
    );

    this.logger.log(`Generando reportes para ${users.length} usuarios...`);

    for (const user of users) {
      try {
        await this.generateReportForUser(user);
      } catch (err: any) {
        this.logger.error(`Failed report for user ${user.id}: ${err.message}`);
      }
    }

    this.logger.log('✅ Informes diarios completados');
  }

  async generateReportForUser(user: { id: string; email: string; full_name: string }) {
    // Fetch campaign data
    const { rows: campaigns } = await this.db.query(
      `SELECT name, status, impressions, clicks, ctr, cpc_cents,
              total_spent_cents, leads, roas, daily_budget_cents
       FROM campaigns
       WHERE user_id = $1 AND status IN ('active','paused','optimizing')`,
      [user.id],
    );

    if (campaigns.length === 0) return;

    const summary = {
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.filter((c) => c.status === 'active').length,
      totalSpent: campaigns.reduce((s, c) => s + (c.total_spent_cents ?? 0), 0),
      totalLeads: campaigns.reduce((s, c) => s + (c.leads ?? 0), 0),
      avgCtr: campaigns.reduce((s, c) => s + parseFloat(c.ctr ?? 0), 0) / campaigns.length,
      avgRoas: campaigns.reduce((s, c) => s + parseFloat(c.roas ?? 0), 0) / campaigns.length,
      bestCampaign: campaigns.sort((a, b) => b.roas - a.roas)[0]?.name ?? null,
      worstCampaign: campaigns.sort((a, b) => a.roas - b.roas)[0]?.name ?? null,
    };

    // Generate AI insights
    const insights = await this.aiService.generateReportInsights(campaigns, user.id);

    // Save report to DB
    const today = new Date().toISOString().split('T')[0];
    const { rows: reportRows } = await this.db.query(
      `INSERT INTO reports (user_id, type, period_start, period_end, summary, insights)
       VALUES ($1, 'daily', $2, $2, $3, $4)
       RETURNING id`,
      [user.id, today, JSON.stringify(summary), JSON.stringify(insights)],
    );

    // Send email
    await this.emailService.sendDailyReport(
      user.email,
      user.full_name,
      summary,
      insights,
      reportRows[0].id,
    );

    this.logger.log(`📧 Report sent to ${user.email}`);
  }

  async getUserReports(userId: string, page: number, limit: number) {
    const offset = (page - 1) * limit;
    const { rows } = await this.db.query(
      `SELECT id, type, period_start, period_end, summary, insights, pdf_url, created_at
       FROM reports WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset],
    );
    const { rows: count } = await this.db.query(
      'SELECT COUNT(*) AS total FROM reports WHERE user_id = $1',
      [userId],
    );
    return { reports: rows, total: parseInt(count[0].total), page, limit };
  }
}
