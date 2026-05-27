import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

export const DATABASE_POOL = 'DATABASE_POOL';

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_POOL,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        // Railway injects DATABASE_URL; fallback to individual vars for local dev
        const databaseUrl = process.env.DATABASE_URL;
        const isProd = config.get('nodeEnv') === 'production';

        const pool = databaseUrl
          ? new Pool({
              connectionString: databaseUrl,
              max: 20,
              idleTimeoutMillis: 30_000,
              connectionTimeoutMillis: 5_000,
              ssl: isProd ? { rejectUnauthorized: false } : false,
            })
          : new Pool({
              host: config.get('database.host'),
              port: config.get('database.port'),
              database: config.get('database.name'),
              user: config.get('database.user'),
              password: config.get('database.password'),
              max: 20,
              idleTimeoutMillis: 30_000,
              connectionTimeoutMillis: 5_000,
              ssl: isProd ? { rejectUnauthorized: false } : false,
            });

        pool.on('error', (err) => {
          console.error('Unexpected error on idle DB client', err);
        });

        // Verify connection — non-fatal so the app starts even if DB is momentarily unreachable
        try {
          const client = await pool.connect();
          console.log('✅ PostgreSQL connected');
          client.release();
        } catch (err: any) {
          console.error('⚠️  PostgreSQL initial ping failed (will retry on first request):', err.message);
        }

        return pool;
      },
    },
  ],
  exports: [DATABASE_POOL],
})
export class DatabaseModule {}
