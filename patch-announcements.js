const pool = require('./src/config/db');

async function patch() {
  try {
    console.log('🚀 Starting Announcement Schema Patch...');
    
    // Check if image_url exists
    const [cols] = await pool.query('SHOW COLUMNS FROM announcements LIKE "image_url"');
    if (cols.length === 0) {
      console.log('➕ Adding image_url column...');
      await pool.query('ALTER TABLE announcements ADD COLUMN image_url VARCHAR(555) AFTER body');
    }

    // Update type enum
    console.log('🔄 Updating announcement type ENUM...');
    await pool.query("ALTER TABLE announcements MODIFY COLUMN type ENUM('call_for_papers','editorial','conference','special_issue','general','news') DEFAULT 'general'");

    console.log('✅ Patch complete! Announcements now support images and news types.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Patch failed:', err);
    process.exit(1);
  }
}

patch();
