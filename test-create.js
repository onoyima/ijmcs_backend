/**
 * Test Announcement Creation
 */
const pool = require('./src/config/db');
const announcementController = require('./src/controllers/announcementController');

async function run() {
  const [u] = await pool.query("SELECT * FROM users WHERE role = 'admin' LIMIT 1");
  const req = {
    user: u[0],
    body: { title: 'Test Fix', content: 'Testing creation after patch', is_public: true }
  };
  const mockRes = {
    status: (code) => { console.log('Status:', code); return { json: (d) => console.log('Response:', d) }; },
    json: (d) => console.log('Response:', d)
  };
  const mockNext = (e) => console.log('Error:', e.message);

  console.log('🚀 Testing Announcement Creation...');
  await announcementController.create(req, mockRes, mockNext);
  process.exit(0);
}

run();
