import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

const updates = {
  contact_email: 'ggjloubf@gmail.com',
  contact_phone: '+967712275038',
  support_phone: '+967777803161',
  address: 'اليمن، صنعاء، شارع هائل',
  currency: 'YER',
};

const client = await pool.connect();
try {
  await client.query('BEGIN');
  for (const [key, value] of Object.entries(updates)) {
    await client.query(
      `INSERT INTO "system_settings" ("id", "key", "value", "createdAt")
       VALUES (gen_random_uuid()::text, $1, $2, NOW())
       ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value"`,
      [key, value],
    );
  }
  await client.query('COMMIT');

  const result = await client.query(
    'SELECT "key", "value" FROM "system_settings" WHERE "key" = ANY($1::text[]) ORDER BY "key"',
    [Object.keys(updates)],
  );
  console.log(JSON.stringify({ success: true, settings: result.rows }, null, 2));
} catch (error) {
  await client.query('ROLLBACK');
  console.error(JSON.stringify({ success: false, error: error instanceof Error ? error.message : String(error) }));
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
