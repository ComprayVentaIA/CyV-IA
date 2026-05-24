import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { DATABASE_POOL } from '../../database/database.module';
import { CacheService } from '../../common/services/cache.service';

const USER_CACHE_TTL = 300; // 5 minutes

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(DATABASE_POOL) private readonly db: Pool,
    config: ConfigService,
    private readonly cache: CacheService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('jwt.secret'),
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    const cacheKey = `user:${payload.sub}`;

    // Try cache first — avoids DB hit on every authenticated request
    const cached = await this.cache.get<any>(cacheKey);
    if (cached) {
      // Still enforce blocked/suspended status (checked in auth service at login)
      if (cached.status === 'suspended') throw new UnauthorizedException('Cuenta suspendida');
      if (cached.status === 'blocked') throw new UnauthorizedException('Cuenta bloqueada');
      return cached;
    }

    const { rows } = await this.db.query(
      `SELECT u.id, u.email, u.full_name, u.role, u.status, u.extra_permissions,
              p.name AS plan_name, p.price_usd_cents,
              p.max_campaigns, p.max_creatives, p.features
       FROM users u
       LEFT JOIN subscriptions s ON s.user_id = u.id AND s.status IN ('active','trialing')
       LEFT JOIN plans p ON p.id = s.plan_id
       WHERE u.id = $1
       ORDER BY s.created_at DESC LIMIT 1`,
      [payload.sub],
    );

    if (!rows.length) throw new UnauthorizedException('Usuario no encontrado');
    const user = rows[0];

    if (user.status === 'suspended') throw new UnauthorizedException('Cuenta suspendida');
    if (user.status === 'blocked') throw new UnauthorizedException('Cuenta bloqueada');

    const result = {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      status: user.status,
      plan: user.plan_name,
      extraPermissions: user.extra_permissions || [],
      planFeatures: user.features || [],
      maxCampaigns: user.max_campaigns,
      maxCreatives: user.max_creatives,
    };

    await this.cache.set(cacheKey, result, USER_CACHE_TTL);
    return result;
  }
}
