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
        const pool = new Pool({
          host: config.get('database.host'),
          port: config.get('database.port'),
          database: config.get('database.name'),
          user: config.get('database.user'),
          password: config.get('database.password'),
          max: 20,
          idleTimeoutMillis: 30_000,
          connectionTimeoutMillis: 5_000,
          ssl: config.get('nodeEnv') === 'production'
            ? { rejectUnauthorized: false }
            : false,
        });

        pool.on('error', (err) => {
          console.error('Unexpected error on idle DB client', err);
        });

        // Verify connection
        const client = await pool.connect();
        console.log('✅ PostgreSQL connected');
        client.release();

        return pool;
      },
    },
  ],
  exports: [DATABASE_POOL],
})
export class DatabaseModule {}
