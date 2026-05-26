import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL } from '../database/database.module';
import { EncryptionService } from '../common/services/encryption.service';

const SENSITIVE_FIELDS = new Set(['accessToken', 'secretKey', 'webhookSecret', 'apiKey']);

@Injectable()
export class IntegrationsService {
  constructor(
    @Inject(DATABASE_POOL) private readonly db: Pool,
    private readonly encryption: EncryptionService,
  ) {}

  private encryptConfig(config: Record<string, string>): Record<string, string> {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(config)) {
      out[k] = v && SENSITIVE_FIELDS.has(k) ? this.encryption.encrypt(v) : v;
    }
    return out;
  }

  private decryptConfig(config: Record<string, string>): Record<string, string> {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(config)) {
      try {
        out[k] = v && SENSITIVE_FIELDS.has(k) ? this.encryption.decrypt(v) : v;
      } catch {
        out[k] = v;
      }
    }
    return out;
  }

  private maskConfig(config: Record<string, string>): Record<string, string> {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(config)) {
      out[k] = v && SENSITIVE_FIELDS.has(k) && v.length > 8
        ? `${v.slice(0, 4)}${'•'.repeat(8)}${v.slice(-4)}`
        : v;
    }
    return out;
  }

  async findAll(userId: string) {
    const { rows } = await this.db.query(
      'SELECT * FROM user_integrations WHERE user_id = $1 ORDER BY connected_at DESC',
      [userId],
    );
    return rows.map(r => ({
      ...r,
      config: this.maskConfig(this.decryptConfig(r.config)),
    }));
  }

  async upsert(userId: string, type: string, config: Record<string, string>) {
    const encrypted = this.encryptConfig(config);
    const { rows } = await this.db.query(
      `INSERT INTO user_integrations (user_id, type, config, status)
       VALUES ($1, $2, $3, 'connected')
       ON CONFLICT (user_id, type)
       DO UPDATE SET config = $3, status = 'connected', updated_at = NOW()
       RETURNING *`,
      [userId, type, JSON.stringify(encrypted)],
    );
    return { ...rows[0], config: this.maskConfig(config) };
  }

  async disconnect(userId: string, type: string) {
    await this.db.query(
      `UPDATE user_integrations SET status = 'disconnected', config = '{}', updated_at = NOW()
       WHERE user_id = $1 AND type = $2`,
      [userId, type],
    );
  }

  async getDecrypted(userId: string, type: string): Promise<Record<string, string> | null> {
    const { rows } = await this.db.query(
      `SELECT config FROM user_integrations WHERE user_id = $1 AND type = $2 AND status = 'connected'`,
      [userId, type],
    );
    if (!rows.length) return null;
    return this.decryptConfig(rows[0].config);
  }
}
