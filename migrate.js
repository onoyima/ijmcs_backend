const pool = require('./src/config/db');

async function migrate() {
  try {
    console.log('Running database migration for reviews table...');
    // Use IF NOT EXISTS equivalent for columns by ignoring the error or catching it
    await pool.query('ALTER TABLE reviews ADD COLUMN IF NOT EXISTS scores_json JSON AFTER comments_to_editor');
    console.log('Migration successful: scores_json added.');
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('Migration skipped: scores_json already exists.');
    } else {
      console.error('Migration failed:', error);
    }
  } finally {
    process.exit();
  }
}

migrate();
