import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { DATABASE_POOL } from '../database/database.module';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EmailService } from '../common/services/email.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE_POOL) private readonly db: Pool,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  // SHA-256 hash for O(1) indexed lookup of refresh tokens.
  // UUIDv4 has 122 bits of entropy — bcrypt is unnecessary overhead here.
  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  // Cryptographically secure random token (replaces uuidv4 for security tokens)
  private secureToken(): string {
    return randomBytes(32).toString('hex');
  }

  // ── Register ──────────────────────────────────────────────────────────────

  async register(dto: RegisterDto) {
    const existing = await this.db.query(
      'SELECT id FROM users WHERE email = $1',
      [dto.email.toLowerCase()],
    );
    if (existing.rows.length > 0) {
      throw new ConflictException('Este email ya está registrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const verifyToken = this.secureToken();

    const { rows } = await this.db.query(
      `INSERT INTO users (email, password_hash, full_name, email_verify_token, email_verified, status)
       VALUES ($1, $2, $3, $4, TRUE, 'active')
       RETURNING id, email, full_name, role, status`,
      [dto.email.toLowerCase(), passwordHash, dto.fullName, verifyToken],
    );

    const user = rows[0];

    const planResult = await this.db.query(
      "SELECT id FROM plans WHERE name = 'starter'",
    );
    if (planResult.rows.length > 0) {
      await this.db.query(
        `INSERT INTO subscriptions (user_id, plan_id, status)
         VALUES ($1, $2, 'active')`,
        [user.id, planResult.rows[0].id],
      );
    }

    // Send verification email if Resend is configured — non-blocking
    this.emailService.sendVerification(user.email, user.full_name, verifyToken).catch(() => {});

    return { message: 'Registro exitoso. ¡Ya podés iniciar sesión!' };
  }

  // ── Verify email ──────────────────────────────────────────────────────────

  async verifyEmail(token: string) {
    const { rows } = await this.db.query(
      `UPDATE users
       SET email_verified = TRUE, status = 'active', email_verify_token = NULL
       WHERE email_verify_token = $1
       RETURNING id`,
      [token],
    );
    if (rows.length === 0) {
      throw new BadRequestException('Token de verificación inválido o expirado');
    }
    return { message: 'Email verificado correctamente' };
  }

  // ── Validate (for LocalStrategy) ──────────────────────────────────────────

  async validateUser(email: string, password: string) {
    const { rows } = await this.db.query(
      `SELECT id, email, password_hash, full_name, role, status, email_verified
       FROM users WHERE email = $1`,
      [email.toLowerCase()],
    );
    if (rows.length === 0) return null;

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return null;

    return user;
  }

  // ── Login ─────────────────────────────────────────────────────────────────

  async login(user: any) {
    if (user.status === 'suspended') {
      throw new UnauthorizedException('Tu cuenta está suspendida. Contactá soporte.');
    }
    if (user.status === 'blocked') {
      throw new UnauthorizedException('Tu cuenta está bloqueada. Contactá soporte.');
    }

    await this.db.query(
      'UPDATE users SET last_login_at = NOW() WHERE id = $1',
      [user.id],
    );

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.secureToken();
    const refreshHash = this.hashToken(refreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await this.db.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, refreshHash, expiresAt],
    );

    const subResult = await this.db.query(
      `SELECT s.status, p.name as plan, p.display_name, p.max_campaigns, p.max_creatives
       FROM subscriptions s
       JOIN plans p ON p.id = s.plan_id
       WHERE s.user_id = $1 AND s.status IN ('active','trialing')
       ORDER BY s.created_at DESC LIMIT 1`,
      [user.id],
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        subscription: subResult.rows[0] ?? null,
      },
    };
  }

  // ── Refresh token (O(1) lookup via SHA-256 index) ──────────────────────────

  async refresh(rawToken: string) {
    const tokenHash = this.hashToken(rawToken);

    const { rows } = await this.db.query(
      `SELECT rt.id, rt.user_id, u.email, u.role
       FROM refresh_tokens rt
       JOIN users u ON u.id = rt.user_id
       WHERE rt.token_hash = $1 AND rt.revoked = FALSE AND rt.expires_at > NOW()
       LIMIT 1`,
      [tokenHash],
    );

    if (rows.length === 0) throw new UnauthorizedException('Refresh token inválido');
    const matched = rows[0];

    await this.db.query('UPDATE refresh_tokens SET revoked = TRUE WHERE id = $1', [matched.id]);

    const payload = { sub: matched.user_id, email: matched.email, role: matched.role };
    const accessToken = this.jwtService.sign(payload);
    const newRefreshToken = this.secureToken();
    const newHash = this.hashToken(newRefreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await this.db.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [matched.user_id, newHash, expiresAt],
    );

    return { accessToken, refreshToken: newRefreshToken };
  }

  // ── Forgot password ───────────────────────────────────────────────────────

  async forgotPassword(email: string) {
    const { rows } = await this.db.query(
      'SELECT id, full_name FROM users WHERE email = $1',
      [email.toLowerCase()],
    );
    if (rows.length === 0) return { message: 'Si el email existe, recibirás un enlace' };

    const token = this.secureToken();
    await this.db.query(
      `UPDATE users SET password_reset_token = $1, password_reset_at = NOW()
       WHERE id = $2`,
      [token, rows[0].id],
    );
    await this.emailService.sendPasswordReset(email, rows[0].full_name, token);
    return { message: 'Si el email existe, recibirás un enlace para resetear tu contraseña' };
  }

  // ── Reset password ────────────────────────────────────────────────────────

  async resetPassword(token: string, newPassword: string) {
    const { rows } = await this.db.query(
      `SELECT id FROM users
       WHERE password_reset_token = $1
       AND password_reset_at > NOW() - INTERVAL '2 hours'`,
      [token],
    );
    if (rows.length === 0) {
      throw new BadRequestException('Token expirado o inválido');
    }

    const hash = await bcrypt.hash(newPassword, 12);
    await this.db.query(
      `UPDATE users
       SET password_hash = $1, password_reset_token = NULL, password_reset_at = NULL
       WHERE id = $2`,
      [hash, rows[0].id],
    );

    return { message: 'Contraseña actualizada correctamente' };
  }
}
