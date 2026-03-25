const pool = require('../config/db');

const articleController = {
  // GET /api/articles/search
  search: async (req, res, next) => {
    try {
      const { q } = req.query;
      const query = `%${q}%`;
      const [rows] = await pool.query(
        `SELECT a.*, u.first_name, u.last_name 
         FROM articles a
         JOIN submissions s ON a.submission_id = s.id
         JOIN users u ON s.author_id = u.id
         WHERE (a.title LIKE ? OR a.abstract LIKE ? OR a.keywords LIKE ?)
         ORDER BY a.published_at DESC`,
        [query, query, query]
      );
      res.json(rows);
    } catch (err) { next(err); }
  },

  // GET /api/articles/:id
  getOne: async (req, res, next) => {
    try {
      const [rows] = await pool.query(
        `SELECT a.*, u.first_name, u.last_name, i.volume, i.number, i.year, i.title as issue_title
         FROM articles a
         JOIN submissions s ON a.submission_id = s.id
         JOIN users u ON s.author_id = u.id
         LEFT JOIN issues i ON a.issue_id = i.id
         WHERE a.id = ?`,
        [req.params.id]
      );
      if (!rows.length) return res.status(404).json({ message: 'Article not found' });
      res.json(rows[0]);
    } catch (err) { next(err); }
  }
};

module.exports = articleController;
