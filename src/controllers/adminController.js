const pool = require('../config/db');

const adminController = {
  // GET /api/admin/stats
  getStats: async (req, res, next) => {
    try {
      const [[{ totalSubmissions }]] = await pool.query('SELECT COUNT(*) as totalSubmissions FROM submissions');
      const [[{ publishedArticles }]] = await pool.query('SELECT COUNT(*) as publishedArticles FROM articles');
      const [[{ totalUsers }]]        = await pool.query('SELECT COUNT(*) as totalUsers FROM users');
      const [[{ pendingPayments }]]   = await pool.query("SELECT COUNT(*) as pendingPayments FROM submissions WHERE status = 'pending_payment'");
      const [[{ totalRevenue }]]      = await pool.query("SELECT COALESCE(SUM(amount),0) as totalRevenue FROM payments WHERE status IN ('completed','success')");
      
      res.json({
        totalSubmissions,
        publishedArticles,
        totalUsers,
        pendingPayments,
        totalRevenue
      });
    } catch (err) { next(err); }
  },

  // GET /api/admin/users
  getAllUsers: async (req, res, next) => {
    try {
      const [rows] = await pool.query('SELECT id, first_name, last_name, email, role, created_at FROM users ORDER BY created_at DESC');
      res.json(rows);
    } catch (err) { next(err); }
  },

  // PATCH /api/admin/users/:id/role
  updateUserRole: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const validRoles = ['admin', 'editor', 'reviewer', 'author'];
      
      if (!validRoles.includes(role)) return res.status(400).json({ message: 'Invalid role selection' });

      // Get current role for auditing
      const [current] = await pool.query('SELECT role, email FROM users WHERE id = ?', [id]);
      if (!current.length) return res.status(404).json({ message: 'User not found' });

      await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);

      // Audit Log
      await pool.query(
        'INSERT INTO audit_logs (user_id, action, target_type, target_id, details) VALUES (?, ?, ?, ?, ?)',
        [req.user.id, 'ROLE_CHANGE', 'user', id, `Changed ${current[0].email} from ${current[0].role} to ${role}`]
      );

      res.json({ message: `Role successfully updated to ${role}` });
    } catch (err) { next(err); }
  },

  // GET /api/admin/payments
  getPayments: async (req, res, next) => {
    try {
      const [rows] = await pool.query(`
        SELECT p.*, u.first_name, u.last_name, s.title as submission_title 
        FROM payments p
        JOIN users u ON p.user_id = u.id
        LEFT JOIN submissions s ON p.submission_id = s.id
        ORDER BY p.created_at DESC
      `);
      res.json(rows);
    } catch (err) { next(err); }
  },

  // GET /api/admin/audit-logs
  getAuditLogs: async (req, res, next) => {
    try {
      const [rows] = await pool.query(`
        SELECT a.*, u.first_name, u.last_name 
        FROM audit_logs a
        JOIN users u ON a.user_id = u.id
        ORDER BY a.created_at DESC
        LIMIT 200
      `);
      res.json(rows);
    } catch (err) { next(err); }
  },

  // GET /api/admin/contacts (Inbox)
  getContacts: async (req, res, next) => {
    try {
      const [rows] = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
      res.json(rows);
    } catch (err) { next(err); }
  },

  // PATCH /api/admin/settings/:key
  updateGlobalSetting: async (req, res, next) => {
    try {
      const { key } = req.params;
      const { value } = req.body;
      
      await pool.query('UPDATE site_settings SET setting_value = ? WHERE setting_key = ?', [value, key]);
      
      // Audit Log
      await pool.query(
        'INSERT INTO audit_logs (user_id, action, target_type, details) VALUES (?, ?, ?, ?)',
        [req.user.id, 'SETTING_CHANGE', 'system', `Updated ${key} to ${value}`]
      );

      res.json({ message: `Setting ${key} updated successfully` });
    } catch (err) { next(err); }
  },

  // PATCH /api/admin/settings
  updateSettings: async (req, res, next) => {
    try {
      const { key, value } = req.body;
      await pool.query(
        'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?', 
        [key, value, value]
      );
      res.json({ message: 'Settings updated' });
    } catch (err) { next(err); }
  }
};

module.exports = adminController;
