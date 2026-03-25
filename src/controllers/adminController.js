const pool = require('../config/db');

const adminController = {
  // GET /api/admin/stats
  getStats: async (req, res, next) => {
    try {
      const [submissions] = await pool.query('SELECT COUNT(*) as count FROM submissions');
      const [published]   = await pool.query('SELECT COUNT(*) as count FROM articles WHERE status = "published"');
      const [users]       = await pool.query('SELECT COUNT(*) as count FROM users');
      
      res.json({
        totalSubmissions: submissions[0].count,
        publishedArticles: published[0].count,
        totalUsers: users[0].count
      });
    } catch (err) { next(err); }
  },

  // GET /api/admin/users
  getAllUsers: async (req, res, next) => {
    try {
      const [rows] = await pool.query('SELECT id, first_name, last_name, email, role, created_at FROM users');
      res.json(rows);
    } catch (err) { next(err); }
  },

  // PATCH /api/admin/settings
  updateSettings: async (req, res, next) => {
    try {
      const { key, value } = req.body;
      await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?', [key, value, value]);
      res.json({ message: 'Settings updated' });
    } catch (err) { next(err); }
  }
};

module.exports = adminController;
