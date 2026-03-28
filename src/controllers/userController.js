const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const userController = {
  // GET /api/users/profile
  getProfile: async (req, res, next) => {
    try {
      const [rows] = await pool.query(
        'SELECT id, first_name, last_name, email, role, institution, country, orcid, bio, avatar_url FROM users WHERE id = ?',
        [req.user.id]
      );
      if (!rows.length) return res.status(404).json({ message: 'User not found' });
      res.json(rows[0]);
    } catch (err) { next(err); }
  },

  // PATCH /api/users/profile
  updateProfile: async (req, res, next) => {
    try {
      const { first_name, last_name, institution, country, orcid, bio } = req.body;
      
      // ORCID Validation (Simple Regex for 16-digit format with hyphens)
      if (orcid && !/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(orcid)) {
        return res.status(400).json({ message: 'Invalid ORCID format. Example: 0000-0002-1825-0097' });
      }

      await pool.query(
        `UPDATE users SET first_name = ?, last_name = ?, institution = ?, country = ?, orcid = ?, bio = ? WHERE id = ?`,
        [first_name, last_name, institution, country, orcid, bio, req.user.id]
      );

      res.json({ message: 'Profile updated successfully' });
    } catch (err) { next(err); }
  },

  // POST /api/users/password
  updatePassword: async (req, res, next) => {
    try {
      const { current_password, new_password } = req.body;
      
      const [users] = await pool.query('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
      const user = users[0];

      const isMatch = await bcrypt.compare(current_password, user.password_hash);
      if (!isMatch) return res.status(401).json({ message: 'Current password incorrect' });

      const new_hash = await bcrypt.hash(new_password, 12);
      await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [new_hash, req.user.id]);
      
      // Logout other sessions by clearing refresh tokens
      await pool.query('DELETE FROM refresh_tokens WHERE user_id = ?', [req.user.id]);

      res.json({ message: 'Password updated successfully' });
    } catch (err) { next(err); }
  }
};

module.exports = userController;
