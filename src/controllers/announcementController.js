const pool = require('../config/db');

const announcementController = {
  // GET /api/announcements
  getAll: async (req, res, next) => {
    try {
      // Public view: only public ones
      // Admin/Editor view: all (if we want to use the same controller for both)
      // I'll check if the request is from an admin/editor
      const user = req.user;
      let query = 'SELECT id, title, body as content, is_published as is_public, created_at, updated_at FROM announcements WHERE is_published = 1 ORDER BY created_at DESC';
      
      if (user && (user.role === 'admin' || user.role === 'editor')) {
        query = 'SELECT id, title, body as content, is_published as is_public, created_at, updated_at FROM announcements ORDER BY created_at DESC';
      }

      const [rows] = await pool.query(query);
      res.json(rows);
    } catch (err) { next(err); }
  },

  // POST /api/announcements (Protected)
  create: async (req, res, next) => {
    try {
      const { title, content, is_public } = req.body;
      const [result] = await pool.query(
        'INSERT INTO announcements (title, body, is_published, created_by) VALUES (?, ?, ?, ?)',
        [title, content, is_public ? 1 : 0, req.user.id]
      );

      // Audit Log
      await pool.query(
        'INSERT INTO audit_logs (user_id, action, target_type, target_id, details) VALUES (?, ?, ?, ?, ?)',
        [req.user.id, 'CREATE_ANNOUNCEMENT', 'announcement', result.insertId, `Created announcement: ${title}`]
      );

      res.status(201).json({ message: 'Announcement created', id: result.insertId });
    } catch (err) { next(err); }
  },

  // PUT /api/announcements/:id (Protected)
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, content, is_public } = req.body;
      
      await pool.query(
        'UPDATE announcements SET title = ?, body = ?, is_published = ? WHERE id = ?',
        [title, content, is_public ? 1 : 0, id]
      );

      // Audit Log
      await pool.query(
        'INSERT INTO audit_logs (user_id, action, target_type, target_id, details) VALUES (?, ?, ?, ?, ?)',
        [req.user.id, 'UPDATE_ANNOUNCEMENT', 'announcement', id, `Updated announcement: ${title}`]
      );

      res.json({ message: 'Announcement updated' });
    } catch (err) { next(err); }
  },

  // DELETE /api/announcements/:id (Protected)
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      
      const [current] = await pool.query('SELECT title FROM announcements WHERE id = ?', [id]);
      if (!current.length) return res.status(404).json({ message: 'Not found' });

      await pool.query('DELETE FROM announcements WHERE id = ?', [id]);

      // Audit Log
      await pool.query(
        'INSERT INTO audit_logs (user_id, action, target_type, target_id, details) VALUES (?, ?, ?, ?, ?)',
        [req.user.id, 'DELETE_ANNOUNCEMENT', 'announcement', id, `Deleted announcement: ${current[0].title}`]
      );

      res.json({ message: 'Announcement deleted' });
    } catch (err) { next(err); }
  },

  // GET /api/announcements/:id
  getOne: async (req, res, next) => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM announcements WHERE id = ?',
        [req.params.id]
      );
      if (!rows.length) return res.status(404).json({ message: 'Announcement not found' });
      res.json(rows[0]);
    } catch (err) { next(err); }
  }
};

module.exports = announcementController;
