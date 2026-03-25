const pool = require('../config/db');

const submissionController = {
  // POST /api/submissions (Create initial submission)
  create: async (req, res, next) => {
    try {
      const { title, abstract, keywords, discipline } = req.body;
      const author_id = req.user.id;
      
      const [result] = await pool.query(
        'INSERT INTO submissions (author_id, title, abstract, keywords, discipline, status) VALUES (?, ?, ?, ?, ?, "draft")',
        [author_id, title, abstract, keywords, discipline]
      );
      
      res.status(201).json({ 
        message: 'Submission draft created', 
        submission_id: result.insertId 
      });
    } catch (err) { next(err); }
  },

  // POST /api/submissions/:id/upload
  uploadFile: async (req, res, next) => {
    try {
      if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
      
      const file_path = `/uploads/submissions/${req.file.filename}`;
      
      // Update the submission status to 'submitted'
      await pool.query(
        'UPDATE submissions SET status = "submitted", submitted_at = NOW() WHERE id = ? AND author_id = ?',
        [req.params.id, req.user.id]
      );

      // Insert the actual file record into submission_files
      await pool.query(
        'INSERT INTO submission_files (submission_id, uploader_id, file_type, original_name, stored_name, file_path, file_size) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [req.params.id, req.user.id, 'manuscript', req.file.originalname, req.file.filename, file_path, req.file.size || 0]
      );
      
      res.json({ message: 'File uploaded and submission finalized', file_path });
    } catch (err) { next(err); }
  },

  // GET /api/submissions/my-submissions
  getMySubmissions: async (req, res, next) => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM submissions WHERE author_id = ? ORDER BY created_at DESC',
        [req.user.id]
      );
      res.json(rows);
    } catch (err) { next(err); }
  }
};

module.exports = submissionController;
