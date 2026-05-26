import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function autoMigrate(): Promise<void> {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.log('⚠️  No DATABASE_URL — skipping auto-migrate');
    return;
  }

  const pool = new Pool({
    connectionString: dbUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    // Check if DB is already migrated
    const { rows } = await pool.query(`
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'users' LIMIT 1
    `);

    if (rows.length > 0) {
      console.log('✅ Database already migrated — skipping');
      return;
    }

    console.log('🔄 Running database migrations...');

    const schemaPath = join(__dirname, 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');
    await pool.query(schema);
    console.log('✅ Schema applied');

    const seedPath = join(__dirname, 'seed.sql');
    const seed = readFileSync(seedPath, 'utf8');
    await pool.query(seed);
    console.log('✅ Seed applied — admin: admin@aicommerceads.com / AdminACA2026!#');

  } catch (err: any) {
    console.error('❌ Migration error:', err.message);
  } finally {
    await pool.end();
  }
}
