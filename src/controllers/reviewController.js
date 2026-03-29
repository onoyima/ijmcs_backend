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
        `SELECT s.*, u.first_name as author_first, u.last_name as author_last, 
                f.file_path, f.original_name as manuscript_name,
                i.volume as issue_volume, i.issue_number as issue_number
         FROM submissions s
         JOIN users u ON s.author_id = u.id
         LEFT JOIN submission_files f ON s.id = f.submission_id AND f.file_type = 'manuscript'
         LEFT JOIN issues i ON s.issue_id = i.id
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
  },

  // Editor Only: GET /api/reviews/submission/:submissionId
  getSubmissionReviews: async (req, res, next) => {
    try {
      const { submissionId } = req.params;
      const [rows] = await pool.query(
        `SELECT r.*, u.first_name, u.last_name, u.email 
         FROM reviews r
         JOIN users u ON r.reviewer_id = u.id
         WHERE r.submission_id = ?`,
        [submissionId]
      );
      res.json(rows);
    } catch (err) { next(err); }
  },

  // GET /api/reviews/author/submission/:id
  getAuthorReviews: async (req, res, next) => {
    try {
      const { id } = req.params;
      const author_id = req.user.id;

      // Verify ownership
      const [submissions] = await pool.query('SELECT author_id FROM submissions WHERE id = ?', [id]);
      if (!submissions.length || submissions[0].author_id !== author_id) {
        return res.status(403).json({ message: 'Access denied' });
      }

      // Fetch only non-confidential feedback
      const [rows] = await pool.query(
        `SELECT recommendation, comments_to_author, scores_json, created_at 
         FROM reviews 
         WHERE submission_id = ? AND status = 'completed'`,
        [id]
      );
    res.json(rows);
    } catch (err) { next(err); }
  },

  // GET /api/reviews/history
  getReviewHistory: async (req, res, next) => {
    try {
      const [rows] = await pool.query(
        `SELECT r.*, s.title, s.discipline 
         FROM reviews r
         JOIN submissions s ON r.submission_id = s.id
         WHERE r.reviewer_id = ? AND r.status = 'completed'
         ORDER BY r.completed_at DESC`,
        [req.user.id]
      );
      res.json(rows);
    } catch (err) { next(err); }
  }
};

module.exports = reviewController;
