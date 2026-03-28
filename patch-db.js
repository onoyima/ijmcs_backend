/**
 * IJMCS Patch Migration
 * Adds missing audit_logs and contacts tables to the database.
 */
const pool = require('./src/config/db');

async function run() {
  console.log('🚀 Running database patch migration...');

  try {
    // 1. Create audit_logs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id       INT UNSIGNED NOT NULL,
        action        VARCHAR(100) NOT NULL,
        target_type   VARCHAR(50),
        target_id     INT UNSIGNED,
        details       TEXT,
        created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('✅ table: audit_logs verified/created');

    // 2. Create contacts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name          VARCHAR(255) NOT NULL,
        email         VARCHAR(255) NOT NULL,
        subject       VARCHAR(255),
        message       TEXT NOT NULL,
        status        ENUM('unread','read','archived') DEFAULT 'unread',
        created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('✅ table: contacts verified/created');

    console.log('\n🎉 Migration patch successful!');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Migration failed:', err.message);
    process.exit(1);
  }
}

run();
