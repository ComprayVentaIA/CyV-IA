import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL } from '../database/database.module';

@Injectable()
export class UsersService {
  constructor(@Inject(DATABASE_POOL) private readonly db: Pool) {}

  async findById(id: string) {
    const { rows } = await this.db.query(
      `SELECT id, email, full_name, role, status, email_verified,
              avatar_url, last_login_at, created_at
       FROM users WHERE id = $1`,
      [id],
    );
    if (!rows.length) throw new NotFoundException('Usuario no encontrado');
    return rows[0];
  }

  async findByEmail(email: string) {
    const { rows } = await this.db.query(
      'SELECT id, email, full_name, role, status FROM users WHERE email = $1',
      [email.toLowerCase()],
    );
    return rows[0] ?? null;
  }
}
