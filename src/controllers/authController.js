const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const crypto = require('crypto');
const pool   = require('../config/db');
const env    = require('../config/env');

// Helper to generate access and refresh tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES }
  );
  const refreshToken = crypto.randomBytes(64).toString('hex');
  return { accessToken, refreshToken };
};

const authController = {
  // POST /api/auth/register
  register: async (req, res, next) => {
    try {
      const { first_name, last_name, email, password, institution, country } = req.body;

      // Check if user exists
      const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
      if (existing.length) return res.status(409).json({ message: 'Email already registered' });

      // Hash password
      const password_hash = await bcrypt.hash(password, 12);
      const verify_token  = crypto.randomBytes(32).toString('hex');

      await pool.query(
        `INSERT INTO users (first_name, last_name, email, password_hash, institution, country, verify_token) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [first_name, last_name, email, password_hash, institution, country, verify_token]
      );

      // Send verification email
      const verifyLink = `${env.CLIENT_URL}/verify-email?token=${verify_token}`;
      
      const generateEmailTemplate = require('../utils/emailTemplate');
      const emailHtml = generateEmailTemplate({
        title: 'Welcome to IJMCS',
        recipientName: `${first_name} ${last_name}`,
        bodyHtml: `
          <p>Thank you for registering an account with the <strong>Igniting Journal of Multidisciplinary and Contemporary Studies (IJMCS)</strong>.</p>
          <p>To finalize your registration and activate your account, please verify your email address. This ensures you can seamlessly submit manuscripts, track your publications, or participate in the peer-review process.</p>
        `,
        buttonText: 'Verify Email Address',
        buttonUrl: verifyLink
      });

      const sendEmail = require('../utils/sendEmail');
      await sendEmail({
        to: email,
        subject: 'Verify your IJMCS Account',
        html: emailHtml
      });

      console.log(`Verification Token for ${email}: ${verify_token}`);

      res.status(201).json({ message: 'Registration successful. Please verify your email.' });
    } catch (err) { next(err); }
  },

  // POST /api/auth/login
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      const user = users[0];

      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      if (!user.is_verified) {
        return res.status(403).json({ message: 'Please verify your email first' });
      }

      const { accessToken, refreshToken } = generateTokens(user);
      const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      await pool.query(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        [user.id, refreshToken, expires_at]
      );

      res.json({
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role,
          avatar_url: user.avatar_url
        }
      });
    } catch (err) { next(err); }
  },

  // POST /api/auth/refresh-token
  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });

      const [tokens] = await pool.query(
        'SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > NOW()',
        [refreshToken]
      );
      if (!tokens.length) return res.status(401).json({ message: 'Invalid or expired refresh token' });

      const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [tokens[0].user_id]);
      const user = users[0];

      const { accessToken } = generateTokens(user);
      res.json({ accessToken });
    } catch (err) { next(err); }
  },

  // POST /api/auth/logout
  logout: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      await pool.query('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
      res.json({ message: 'Logged out successfully' });
    } catch (err) { next(err); }
  },

  // GET /api/auth/verify-email
  verifyEmail: async (req, res, next) => {
    try {
      const { token } = req.query;
      const [rows] = await pool.query('SELECT id FROM users WHERE verify_token = ?', [token]);
      if (!rows.length) return res.status(400).json({ message: 'Invalid or expired verification token' });

      await pool.query('UPDATE users SET is_verified = 1, verify_token = NULL WHERE id = ?', [rows[0].id]);
      res.json({ message: 'Email verified successfully. You can now login.' });
    } catch (err) { next(err); }
  }
};

module.exports = authController;
