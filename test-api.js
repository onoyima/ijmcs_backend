/**
 * Diagnostic: Test all Admin Dashboard endpoints
 * Run this to see exactly which API call is failing.
 */
const pool = require('./src/config/db');
const adminController = require('./src/controllers/adminController');
const announcementController = require('./src/controllers/announcementController');

async function testEndpoint(name, controllerMethod, req = {}) {
  console.log(`\n🔍 Testing: ${name}...`);
  const mockRes = {
    json: (data) => console.log(`   ✅ Success: ${data.length || Object.keys(data).length} items/keys returned.`),
    status: (code) => { 
      console.log(`   ❌ Failed with status: ${code}`);
      return { json: (d) => console.log('      Error details:', d) };
    }
  };
  const mockNext = (err) => console.log(`   ❌ Server Error (next): ${err.message}`);
  
  try {
    await controllerMethod(req, mockRes, mockNext);
  } catch (err) {
    console.log(`   ❌ Global Crash: ${err.message}`);
  }
}

async function run() {
  console.log('🚀 Starting API Diagnostic...\n');
  
  // Mock request for admin user (ID 1 - ONOYIMA)
  const [u] = await pool.query("SELECT * FROM users WHERE email = 'onoyimab@veritas.edu.ng'");
  const req = { user: u[0], params: {}, body: {} };

  await testEndpoint('Stats', adminController.getStats, req);
  await testEndpoint('Users', adminController.getAllUsers, req);
  await testEndpoint('Payments', adminController.getPayments, req);
  await testEndpoint('Audit Logs', adminController.getAuditLogs, req);
  await testEndpoint('Contacts', adminController.getContacts, req);
  await testEndpoint('Announcements', announcementController.getAll, req);

  console.log('\n🏁 Diagnostic Complete.');
  process.exit(0);
}

run();
