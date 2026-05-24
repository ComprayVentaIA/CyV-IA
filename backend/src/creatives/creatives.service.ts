import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL } from '../database/database.module';

@Injectable()
export class CreativesService {
  constructor(@Inject(DATABASE_POOL) private readonly db: Pool) {}

  async findAll(userId: string, campaignId?: string) {
    const conditions = ['user_id = $1'];
    const params: any[] = [userId];
    if (campaignId) {
      conditions.push('campaign_id = $2');
      params.push(campaignId);
    }
    const { rows } = await this.db.query(
      `SELECT * FROM creatives WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC`,
      params,
    );
    return rows;
  }

  async findOne(id: string, userId: string) {
    const { rows } = await this.db.query(
      'SELECT * FROM creatives WHERE id = $1 AND user_id = $2',
      [id, userId],
    );
    if (!rows.length) throw new NotFoundException('Creativo no encontrado');
    return rows[0];
  }

  async create(userId: string, dto: {
    campaignId?: string;
    name: string;
    type?: string;
    format?: string;
    aiPrompt?: string;
  }) {
    const { rows } = await this.db.query(
      `INSERT INTO creatives (user_id, campaign_id, name, type, format, ai_prompt, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING *`,
      [
        userId,
        dto.campaignId ?? null,
        dto.name,
        dto.type ?? 'video',
        dto.format ?? '9_16',
        dto.aiPrompt ?? null,
      ],
    );
    return rows[0];
  }

  async remove(id: string, userId: string) {
    const { rows } = await this.db.query(
      'DELETE FROM creatives WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId],
    );
    if (!rows.length) throw new NotFoundException('Creativo no encontrado');
  }
}
