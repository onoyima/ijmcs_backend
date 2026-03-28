/**
 * Update admin passwords to match actual credentials
 */
const pool = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function run() {
  // Hash both passwords
  const hash123456    = await bcrypt.hash('123456', 10);
  const hashWelcome   = await bcrypt.hash('Welcome@1', 10);

  // Update admin@ijmcs.ng → password: 123456
  const [r1] = await pool.query(
    "UPDATE users SET password_hash = ?, is_verified = 1 WHERE email = 'admin@ijmcs.ng'",
    [hash123456]
  );
  console.log(r1.affectedRows ? '✅ admin@ijmcs.ng    → password set to: 123456' : '⚠️ admin@ijmcs.ng not found');

  // Ensure onoyimab@veritas.edu.ng also has the correct hash (Welcome@1)
  const [r2] = await pool.query(
    "UPDATE users SET password_hash = ?, role = 'admin', is_verified = 1 WHERE email = 'onoyimab@veritas.edu.ng'",
    [hashWelcome]
  );
  console.log(r2.affectedRows ? '✅ onoyimab@veritas.edu.ng → password set to: Welcome@1' : '⚠️ onoyimab@veritas.edu.ng not found');

  // Final state
  const [all] = await pool.query("SELECT id, first_name, last_name, email, role FROM users ORDER BY role DESC, id");
  console.log('\n📋 Current user list:');
  all.forEach(u => {
    const icon = u.role === 'admin' ? '👑' : u.role === 'editor' ? '✏️' : u.role === 'reviewer' ? '🔍' : '📝';
    console.log(`  ${icon} [${u.role.toUpperCase().padEnd(8)}] ${u.first_name} ${u.last_name} <${u.email}>`);
  });

  process.exit(0);
}

run().catch(e => { console.error('Error:', e.message); process.exit(1); });
