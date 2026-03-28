/**
 * IJMCS Admin Seeder Script
 * Usage: node src/config/make-admin.js <email>
 * 
 * Promotes an existing registered user to 'admin' role.
 * Example: node src/config/make-admin.js editor@example.com
 */
require('dotenv').config();
const pool = require('./db');
const bcrypt = require('bcrypt');

const args = process.argv.slice(2);
const email = args[0];

const run = async () => {
  if (!email) {
    // If no email passed, create a default admin account
    const password = 'Admin@ijmcs2024';
    const hash = await bcrypt.hash(password, 10);

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', ['admin@ijmcs.ng']);
    if (existing.length) {
      await pool.query('UPDATE users SET role = "admin", is_verified = 1 WHERE email = ?', ['admin@ijmcs.ng']);
      console.log('\n✅ Existing admin@ijmcs.ng promoted to admin role.');
    } else {
      await pool.query(
        'INSERT INTO users (first_name, last_name, email, password_hash, role, is_verified, is_active) VALUES (?, ?, ?, ?, "admin", 1, 1)',
        ['IJMCS', 'Administrator', 'admin@ijmcs.ng', hash]
      );
      console.log('\n✅ Admin account created!');
      console.log('   Email:    admin@ijmcs.ng');
      console.log('   Password: Admin@ijmcs2024');
      console.log('\n⚠️  IMPORTANT: Change this password immediately after first login!\n');
    }
  } else {
    // Promote specified email to admin
    const [rows] = await pool.query('SELECT id, first_name, last_name FROM users WHERE email = ?', [email]);
    if (!rows.length) {
      console.error(`\n❌ No user found with email: ${email}`);
      console.error('   Make sure the user has registered first.\n');
      process.exit(1);
    }
    const user = rows[0];
    await pool.query('UPDATE users SET role = "admin", is_verified = 1 WHERE email = ?', [email]);
    console.log(`\n✅ ${user.first_name} ${user.last_name} (${email}) promoted to admin!`);
    console.log('   They can now log in and access /admin\n');
  }

  process.exit(0);
};

run().catch(err => {
  console.error('❌ Script error:', err.message);
  process.exit(1);
});
