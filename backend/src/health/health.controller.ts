import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HealthCheckResult,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL } from '../database/database.module';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    @Inject(DATABASE_POOL) private readonly db: Pool,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Full health check (DB + dependencies)' })
  check(): Promise<HealthCheckResult> {
    return this.health.check([() => this.checkDatabase()]);
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness probe — process is running' })
  live(): { status: string } {
    return { status: 'ok' };
  }

  @Get('ready')
  @HealthCheck()
  @ApiOperation({ summary: 'Readiness probe — DB is reachable' })
  ready(): Promise<HealthCheckResult> {
    return this.health.check([() => this.checkDatabase()]);
  }

  private async checkDatabase(): Promise<HealthIndicatorResult> {
    try {
      await this.db.query('SELECT 1');
      return { database: { status: 'up' } };
    } catch {
      return { database: { status: 'down' } };
    }
  }
}
