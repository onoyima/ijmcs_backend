/**
 * Comprehensive DB Patch
 */
const pool = require('./src/config/db');

async function run() {
  console.log('🚀 Running final DB sync...');
  try {
    // 1. Update submissions.status enum
    await pool.query(`
      ALTER TABLE submissions MODIFY COLUMN status ENUM(
        'pending_payment', 'submitted', 'under_review', 'revision_required', 
        'accepted', 'rejected', 'copyediting', 'production', 
        'galley_sent', 'galley_approved', 'published', 'withdrawn'
      ) NOT NULL DEFAULT 'pending_payment'
    `);
    console.log('✅ submissions.status ENUM updated');

    // 2. Ensure site_settings has apc_amount_usd
    await pool.query(`
      INSERT IGNORE INTO site_settings (setting_key, setting_value) 
      VALUES ('apc_amount_usd', '150')
    `);
    console.log('✅ apc_amount_usd setting initialized');

    // 3. Fix any existing submissions with wrong status (if any)
    await pool.query("UPDATE submissions SET status = 'pending_payment' WHERE status = '' OR status IS NULL");
    
    console.log('\n🎉 DB Sync Successful!');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ DB Sync Failed:', err.message);
    process.exit(1);
  }
}

run();
