const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const morgan       = require('morgan');
const rateLimit    = require('express-rate-limit');
const path         = require('path');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes         = require('./routes/authRoutes');
const issueRoutes        = require('./routes/issueRoutes');
const articleRoutes      = require('./routes/articleRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const submissionRoutes   = require('./routes/submissionRoutes');
const reviewRoutes       = require('./routes/reviewRoutes');
const paymentRoutes      = require('./routes/paymentRoutes');
const adminRoutes        = require('./routes/adminRoutes');

const app = express();

// ─── Security ───────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));

// ─── Rate Limiting ───────────────────────────────────────────
const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: 'Too many requests' });
app.use('/api/', generalLimiter);

// ─── Parsing ─────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Logging ─────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ─── Static Files ────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// ─── API Routes ──────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/issues',        issueRoutes);
app.use('/api/articles',      articleRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/submissions',   submissionRoutes);
app.use('/api/reviews',       reviewRoutes);
app.use('/api/payments',      paymentRoutes);
app.use('/api/admin',         adminRoutes);
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// ─── Global Error Handler ────────────────────────────────────
app.use(errorHandler);

module.exports = app;
