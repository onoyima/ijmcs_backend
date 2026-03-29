const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');
const generateEmailTemplate = require('../utils/emailTemplate');

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
      const [rows] = await pool.query('SELECT id, first_name, last_name, email, role, is_verified, created_at FROM users ORDER BY created_at DESC');
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
  },

  // PATCH /api/admin/users/:id/verify
  verifyUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      
      const [user] = await pool.query('SELECT email, first_name FROM users WHERE id = ?', [id]);
      if (!user.length) return res.status(404).json({ message: 'User not found' });

      await pool.query('UPDATE users SET is_verified = 1, verify_token = NULL WHERE id = ?', [id]);

      // Audit Log
      await pool.query(
        'INSERT INTO audit_logs (user_id, action, target_type, target_id, details) VALUES (?, ?, ?, ?, ?)',
        [req.user.id, 'MANUAL_VERIFY', 'user', id, `Manually verified account: ${user[0].email}`]
      );

      res.json({ message: 'User account manually verified' });
    } catch (err) { next(err); }
  },

  updateUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { first_name, last_name, email, password } = req.body;

      const [current] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
      if (!current.length) return res.status(404).json({ message: 'User not found' });

      let query = 'UPDATE users SET first_name = ?, last_name = ?, email = ?';
      let params = [first_name, last_name, email];
      let auditDetail = `Updated details for ${current[0].email}. `;

      if (password && password.trim().length > 0) {
        const hash = await bcrypt.hash(password, 12);
        query += ', password_hash = ?';
        params.push(hash);
        auditDetail += 'Password was also reset. ';
      }

      query += ' WHERE id = ?';
      params.push(id);

      await pool.query(query, params);

      await pool.query(
        'INSERT INTO audit_logs (user_id, action, target_type, target_id, details) VALUES (?, ?, ?, ?, ?)',
        [req.user.id, 'ADMIN_USER_EDIT', 'user', id, auditDetail]
      );

      const emailHtml = generateEmailTemplate({
        title: 'Account Information Updated',
        recipientName: first_name,
        bodyHtml: `
          <p>An administrator has updated your account information on the IJMCS platform.</p>
          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <ul style="margin: 0; padding: 0; list-style: none; font-size: 14px;">
              <li style="margin-bottom: 8px;"><strong>Status:</strong> Successfully Updated</li>
              <li style="margin-bottom: 8px;"><strong>Updated Field(s):</strong> Profile Details ${password ? '& Password' : ''}</li>
            </ul>
          </div>
          <p>If you did not authorize these changes or have concerns regarding your account security, please contact the Editorial Office immediately.</p>
        `,
        buttonText: 'Login to Portal',
        buttonUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login`
      });

      await sendEmail({ to: email, subject: 'IJMCS Account Notification: Administrative Update', html: emailHtml });

      res.json({ message: 'User details updated and notification sent' });
    } catch (err) { next(err); }
  },

  // ─── ISSUE / VOLUME MANAGEMENT ───────────────────────────────────────────

  // GET /api/admin/issues — list all issues
  getIssues: async (req, res, next) => {
    try {
      const [rows] = await pool.query(`
        SELECT i.*, 
          (SELECT COUNT(*) FROM submissions s WHERE s.issue_id = i.id) as submission_count,
          (SELECT COUNT(*) FROM articles a WHERE a.issue_id = i.id) as article_count
        FROM issues i ORDER BY i.volume DESC, i.issue_number DESC
      `);
      
      const [setting] = await pool.query("SELECT setting_value FROM site_settings WHERE setting_key = 'active_issue_id'");
      const activeIssueId = setting.length ? parseInt(setting[0].setting_value, 10) : null;
      
      const issuesWithActiveFlag = rows.map(issue => ({
        ...issue,
        is_active: issue.id === activeIssueId
      }));

      res.json(issuesWithActiveFlag);
    } catch (err) { next(err); }
  },

  // POST /api/admin/issues — create new issue
  createIssue: async (req, res, next) => {
    try {
      const { volume, issue_number, year, title, description, cover_image_url } = req.body;
      if (!volume || !issue_number || !year) {
        return res.status(400).json({ message: 'Volume, Issue Number, and Year are required.' });
      }
      const [result] = await pool.query(
        'INSERT INTO issues (volume, issue_number, year, title, description, cover_image_url, published) VALUES (?, ?, ?, ?, ?, ?, 0)',
        [volume, issue_number, year, title || null, description || null, cover_image_url || null]
      );
      await pool.query(
        'INSERT INTO audit_logs (user_id, action, target_type, target_id, details) VALUES (?, ?, ?, ?, ?)',
        [req.user.id, 'CREATE_ISSUE', 'issue', result.insertId, `Created Vol.${volume} No.${issue_number} (${year})`]
      );
      res.status(201).json({ message: 'Issue created', id: result.insertId });
    } catch (err) { next(err); }
  },

  // PATCH /api/admin/issues/:id — update issue details
  updateIssue: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { volume, issue_number, year, title, description, cover_image_url } = req.body;
      await pool.query(
        'UPDATE issues SET volume = ?, issue_number = ?, year = ?, title = ?, description = ?, cover_image_url = ?, updated_at = NOW() WHERE id = ?',
        [volume, issue_number, year, title || null, description || null, cover_image_url || null, id]
      );
      res.json({ message: 'Issue updated successfully' });
    } catch (err) { next(err); }
  },

  // PATCH /api/admin/issues/:id/publish — toggle publish status
  publishIssue: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { published } = req.body; // true or false
      const publishedAt = published ? 'NOW()' : 'NULL';
      await pool.query(
        `UPDATE issues SET published = ?, published_at = ${published ? 'NOW()' : 'NULL'} WHERE id = ?`,
        [published ? 1 : 0, id]
      );
      await pool.query(
        'INSERT INTO audit_logs (user_id, action, target_type, target_id, details) VALUES (?, ?, ?, ?, ?)',
        [req.user.id, published ? 'PUBLISH_ISSUE' : 'UNPUBLISH_ISSUE', 'issue', id, `Issue ${id} ${published ? 'published' : 'unpublished'}`]
      );
      res.json({ message: `Issue ${published ? 'published' : 'unpublished'} successfully` });
    } catch (err) { next(err); }
  },

  // PATCH /api/admin/issues/:id/set-active — mark as the current active call-for-papers issue
  setActiveIssue: async (req, res, next) => {
    try {
      const { id } = req.params;
      // Deactivate all first, then set the target
      await pool.query("UPDATE site_settings SET setting_value = ? WHERE setting_key = 'active_issue_id'", [id]);
      // If the key doesn't exist yet, insert it
      await pool.query(
        "INSERT INTO site_settings (setting_key, setting_value) VALUES ('active_issue_id', ?) ON DUPLICATE KEY UPDATE setting_value = ?",
        [id, id]
      );
      await pool.query(
        'INSERT INTO audit_logs (user_id, action, target_type, target_id, details) VALUES (?, ?, ?, ?, ?)',
        [req.user.id, 'SET_ACTIVE_ISSUE', 'issue', id, `Set Issue ${id} as the active submission target`]
      );
      res.json({ message: 'Active issue updated' });
    } catch (err) { next(err); }
  },

  // DELETE /api/admin/issues/:id — only if no articles are linked
  deleteIssue: async (req, res, next) => {
    try {
      const { id } = req.params;
      const [articles] = await pool.query('SELECT COUNT(*) as count FROM articles WHERE issue_id = ?', [id]);
      if (articles[0].count > 0) {
        return res.status(400).json({ message: 'Cannot delete an issue that has published articles.' });
      }
      await pool.query('DELETE FROM issues WHERE id = ?', [id]);
      res.json({ message: 'Issue deleted' });
    } catch (err) { next(err); }
  },

  // GET /api/admin/submissions — all submissions with author info
  getAllSubmissions: async (req, res, next) => {
    try {
      const [rows] = await pool.query(`
        SELECT s.*, u.first_name, u.last_name, u.email as author_email,
          f.file_path, f.original_name as manuscript_name
        FROM submissions s
        JOIN users u ON s.author_id = u.id
        LEFT JOIN submission_files f ON s.id = f.submission_id AND f.file_type = 'manuscript'
        ORDER BY s.submitted_at DESC
      `);
      res.json(rows);
    } catch (err) { next(err); }
  }
};

module.exports = adminController;
