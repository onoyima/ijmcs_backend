const pool = require('../config/db');

const reviewController = {
  // GET /api/reviews/pending
  getPendingReviews: async (req, res, next) => {
    try {
      const [rows] = await pool.query(
        `SELECT r.*, s.title, s.discipline, s.abstract 
         FROM reviews r
         JOIN submissions s ON r.submission_id = s.id
         WHERE r.reviewer_id = ? AND r.status = 'pending'`,
        [req.user.id]
      );
      res.json(rows);
    } catch (err) { next(err); }
  },

  // POST /api/reviews/:id/submit
  submitReview: async (req, res, next) => {
    try {
      const { recommendation, comments_to_author, comments_to_editor, scores_json } = req.body;
      const [result] = await pool.query(
        `UPDATE reviews 
         SET recommendation = ?, comments_to_author = ?, comments_to_editor = ?, scores_json = ?, status = 'completed', completed_at = NOW()
         WHERE id = ? AND reviewer_id = ?`,
        [recommendation, comments_to_author, comments_to_editor, JSON.stringify(scores_json || {}), req.params.id, req.user.id]
      );
      
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Review assignment not found' });
      
      res.json({ message: 'Review submitted successfully' });
    } catch (err) { next(err); }
  },

  // Editor Only: GET /api/reviews/all-submissions
  getAllForEditor: async (req, res, next) => {
    try {
      const [rows] = await pool.query(
        `SELECT s.*, u.first_name as author_first, u.last_name as author_last 
         FROM submissions s
         JOIN users u ON s.author_id = u.id
         ORDER BY s.submitted_at DESC`
      );
      res.json(rows);
    } catch (err) { next(err); }
  },

  // Editor Only: POST /api/reviews/assign
  assignReviewer: async (req, res, next) => {
    try {
      const { submission_id, reviewer_id, due_date } = req.body;
      await pool.query(
        'INSERT INTO reviews (submission_id, reviewer_id, status, assigned_at, due_date) VALUES (?, ?, "pending", NOW(), ?)',
        [submission_id, reviewer_id, due_date]
      );
      
      // Update submission status
      await pool.query('UPDATE submissions SET status = "under_review" WHERE id = ?', [submission_id]);
      
      res.json({ message: 'Reviewer assigned successfully' });
    } catch (err) { next(err); }
  }
};

module.exports = reviewController;
