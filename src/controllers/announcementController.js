const pool = require('../config/db');

const announcementController = {
  // GET /api/announcements
  getAll: async (req, res, next) => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM announcements WHERE is_public = 1 ORDER BY created_at DESC'
      );
      res.json(rows);
    } catch (err) { next(err); }
  },

  // GET /api/announcements/:id
  getOne: async (req, res, next) => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM announcements WHERE id = ? AND is_public = 1',
        [req.params.id]
      );
      if (!rows.length) return res.status(404).json({ message: 'Announcement not found' });
      res.json(rows[0]);
    } catch (err) { next(err); }
  }
};

module.exports = announcementController;
