const pool = require('../config/db');

const issueController = {
  // GET /api/issues (All published issues)
  getAll: async (req, res, next) => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM issues WHERE is_published = 1 ORDER BY year DESC, volume DESC, number DESC'
      );
      res.json(rows);
    } catch (err) { next(err); }
  },

  // GET /api/issues/current
  getCurrent: async (req, res, next) => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM issues WHERE is_published = 1 ORDER BY year DESC, volume DESC, number DESC LIMIT 1'
      );
      if (!rows.length) return res.status(404).json({ message: 'No published issues found' });
      res.json(rows[0]);
    } catch (err) { next(err); }
  },

  // GET /api/issues/:id/articles
  getArticles: async (req, res, next) => {
    try {
      const [rows] = await pool.query(
        `SELECT a.*, u.first_name, u.last_name 
         FROM articles a
         JOIN submissions s ON a.submission_id = s.id
         JOIN users u ON s.author_id = u.id
         WHERE a.issue_id = ?
         ORDER BY a.page_start ASC`,
        [req.params.id]
      );
      res.json(rows);
    } catch (err) { next(err); }
  },

  // Editor Only: POST /api/issues
  createIssue: async (req, res, next) => {
    try {
      const { volume, number, year, title, description, cover_image } = req.body;
      const [result] = await pool.query(
        'INSERT INTO issues (volume, number, year, title, description, cover_image, is_published) VALUES (?, ?, ?, ?, ?, ?, 0)',
        [volume, number, year, title, description, cover_image]
      );
      res.status(201).json({ message: 'Issue draft created', issue_id: result.insertId });
    } catch (err) { next(err); }
  },

  // Editor Only: POST /api/issues/:id/publish
  publishIssue: async (req, res, next) => {
    try {
      await pool.query('UPDATE issues SET is_published = 1, published_at = NOW() WHERE id = ?', [req.params.id]);
      res.json({ message: 'Issue published successfully' });
    } catch (err) { next(err); }
  }
};

module.exports = issueController;
