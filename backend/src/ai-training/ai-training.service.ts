import { Injectable, Inject, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL } from '../database/database.module';
import { AiService } from '../ai/ai.service';

export interface CreatePatternDto {
  source?: string;
  type?: string;
  hook: string;
  style?: string;
  platform?: string;
  tone?: string;
  visualNotes?: string;
  cta?: string;
  audience?: string;
  score?: number;
}

@Injectable()
export class AiTrainingService implements OnModuleInit {
  constructor(
    @Inject(DATABASE_POOL) private readonly db: Pool,
    private readonly aiService: AiService,
  ) {}

  async onModuleInit() {
    await this.db.query(`
      CREATE TABLE IF NOT EXISTS ai_patterns (
        id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id      UUID,
        source       VARCHAR(255) DEFAULT 'Manual',
        type         VARCHAR(20) DEFAULT 'video',
        hook         TEXT NOT NULL,
        style        TEXT,
        platform     VARCHAR(50) DEFAULT 'reels',
        tone         TEXT,
        visual_notes TEXT,
        cta          TEXT,
        audience     TEXT,
        score        INTEGER DEFAULT 80,
        active       BOOLEAN DEFAULT TRUE,
        uses         INTEGER DEFAULT 0,
        created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `).catch(() => {});
  }

  async findAll(filters?: { platform?: string; active?: boolean; search?: string }) {
    let q = 'SELECT * FROM ai_patterns WHERE 1=1';
    const params: any[] = [];

    if (filters?.platform && filters.platform !== 'all') {
      params.push(filters.platform);
      q += ` AND platform = $${params.length}`;
    }
    if (filters?.active !== undefined) {
      params.push(filters.active);
      q += ` AND active = $${params.length}`;
    }
    if (filters?.search) {
      params.push(`%${filters.search}%`);
      q += ` AND (hook ILIKE $${params.length} OR style ILIKE $${params.length} OR source ILIKE $${params.length})`;
    }

    q += ' ORDER BY score DESC, created_at DESC';
    const { rows } = await this.db.query(q, params);
    return rows;
  }

  async create(userId: string, dto: CreatePatternDto) {
    const { rows } = await this.db.query(
      `INSERT INTO ai_patterns (user_id, source, type, hook, style, platform, tone, visual_notes, cta, audience, score)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [
        userId,
        dto.source ?? 'Manual',
        dto.type ?? 'video',
        dto.hook,
        dto.style ?? null,
        dto.platform ?? 'reels',
        dto.tone ?? null,
        dto.visualNotes ?? null,
        dto.cta ?? null,
        dto.audience ?? null,
        dto.score ?? 80,
      ],
    );
    return rows[0];
  }

  async update(id: string, patch: Partial<CreatePatternDto> & { active?: boolean }) {
    const sets: string[] = [];
    const params: any[] = [];

    const map: Record<string, string> = {
      hook: 'hook', style: 'style', platform: 'platform',
      tone: 'tone', visualNotes: 'visual_notes', cta: 'cta',
      audience: 'audience', score: 'score', active: 'active', source: 'source',
    };

    for (const [key, col] of Object.entries(map)) {
      if ((patch as any)[key] !== undefined) {
        params.push((patch as any)[key]);
        sets.push(`${col} = $${params.length}`);
      }
    }

    if (!sets.length) throw new Error('Nothing to update');
    sets.push(`updated_at = NOW()`);

    params.push(id);
    const { rows } = await this.db.query(
      `UPDATE ai_patterns SET ${sets.join(', ')} WHERE id = $${params.length} RETURNING *`,
      params,
    );
    if (!rows.length) throw new NotFoundException('Patrón no encontrado');
    return rows[0];
  }

  async remove(id: string) {
    const { rows } = await this.db.query(
      'DELETE FROM ai_patterns WHERE id = $1 RETURNING id', [id],
    );
    if (!rows.length) throw new NotFoundException('Patrón no encontrado');
  }

  async incrementUses(id: string) {
    await this.db.query(
      'UPDATE ai_patterns SET uses = uses + 1, updated_at = NOW() WHERE id = $1', [id],
    );
  }

  async analyzeAndExtract(content: string, sourceUrl?: string): Promise<Partial<CreatePatternDto>> {
    const safeContent = content.slice(0, 800);
    try {
      const result = await this.aiService.analyzePattern(safeContent, sourceUrl);
      return result;
    } catch {
      return { hook: safeContent.split(/[.!\n]/)[0]?.slice(0, 60) ?? 'Hook extraído', score: 75 };
    }
  }

  async getStats() {
    const { rows } = await this.db.query(`
      SELECT
        COUNT(*) FILTER (WHERE active) AS active_count,
        COUNT(*) AS total_count,
        ROUND(AVG(score)) AS avg_score,
        SUM(uses) AS total_uses
      FROM ai_patterns
    `);
    return rows[0];
  }
}
