/**
 * Quick script: Print all admin users in the DB
 * Usage: node check-admins.js
 */
const pool = require('./src/config/db');

async function run() {
  // Promote ONOYIMA to admin
  const [promo] = await pool.query(
    "UPDATE users SET role = 'admin', is_verified = 1 WHERE email = 'onoyimab@veritas.edu.ng'"
  );
  if (promo.affectedRows > 0) {
    console.log('\n✅ onoyimab@veritas.edu.ng promoted to admin!');
  }

  const [admins] = await pool.query(
    "SELECT id, first_name, last_name, email, role, is_verified, created_at FROM users WHERE role = 'admin'"
  );

  if (admins.length === 0) {
    console.log('\n⚠️  No admin users found in the database.');
    console.log('   Run: node seedDatabase.js  to seed demo data (creates admin@ijmcs.org)');
    console.log('   Or run this SQL in your DB client:');
    console.log("   UPDATE users SET role = 'admin' WHERE email = 'your@email.com';\n");
  } else {
    console.log(`\n✅ Found ${admins.length} admin user(s):\n`);
    admins.forEach(u => {
      console.log(`  ID: ${u.id}  |  Name: ${u.first_name} ${u.last_name}`);
      console.log(`  Email: ${u.email}`);
      console.log(`  Verified: ${u.is_verified ? 'Yes' : 'No'}`);
      console.log(`  Created: ${new Date(u.created_at).toLocaleString()}`);
      console.log('  ---');
    });
    console.log('');
  }

  // Also show ALL users for full picture
  const [all] = await pool.query(
    "SELECT id, first_name, last_name, email, role FROM users ORDER BY role, id"
  );
  console.log('📋 All registered users:\n');
  all.forEach(u => {
    const badge = u.role === 'admin' ? '👑' : u.role === 'editor' ? '✏️' : u.role === 'reviewer' ? '🔍' : '📝';
    console.log(`  ${badge} [${u.role.toUpperCase().padEnd(8)}] ${u.first_name} ${u.last_name} <${u.email}>`);
  });
  console.log('');
  process.exit(0);
}

run().catch(err => { console.error('Error:', err.message); process.exit(1); });
