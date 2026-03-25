
---

## ═══════════════════════════════════════════════
## PART 0 — PROJECT BRIEF
## ═══════════════════════════════════════════════

You are building a full-stack academic journal website for the **Igniting Journal of Multidisciplinary and Contemporary Studies (IJMCS)** — a Nigerian international, peer-reviewed, open-access academic journal affiliated with Lagos State University (LASU).

**Tech Stack:**
- **Frontend:** React 18 + Vite + React Router v6 + TailwindCSS + Axios
- **Backend:** Node.js 20 + Express.js 4 + REST API
- **Database:** MySQL 8.0
- **Authentication:** JWT (access + refresh tokens)
- **File Uploads:** Multer (manuscript PDFs, galley proofs)
- **Email:** Nodemailer (SMTP)
- **Payments:** Paystack API + Flutterwave API
- **Rich Text:** React-Quill (editor) / DOMPurify (sanitizer)

**Domain:** `......`
**Email:** `.....`

---

## ═══════════════════════════════════════════════
## PART 1 — FOLDER STRUCTURE
## ═══════════════════════════════════════════════

Create the following monorepo structure exactly:

```
ijmcs/
├── client/                          # React frontend
│   ├── public/
│   │   ├── favicon.ico
│   │   └── logo.png
│   ├── src/
│   │   ├── api/                     # Axios instances & API call functions
│   │   │   ├── axiosInstance.js
│   │   │   ├── authApi.js
│   │   │   ├── submissionApi.js
│   │   │   ├── articleApi.js
│   │   │   ├── issueApi.js
│   │   │   ├── reviewApi.js
│   │   │   ├── paymentApi.js
│   │   │   └── announcementApi.js
│   │   ├── assets/                  # Images, fonts
│   │   ├── components/              # Reusable UI components
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── FileUpload.jsx
│   │   │   │   ├── Pagination.jsx
│   │   │   │   ├── SearchBar.jsx
│   │   │   │   ├── Toast.jsx
│   │   │   │   └── LoadingSpinner.jsx
│   │   │   ├── article/
│   │   │   │   ├── ArticleCard.jsx
│   │   │   │   ├── ArticleDetail.jsx
│   │   │   │   └── CitationBox.jsx
│   │   │   └── dashboard/
│   │   │       ├── SubmissionRow.jsx
│   │   │       ├── ReviewForm.jsx
│   │   │       └── StatsCard.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── usePagination.js
│   │   │   └── useDebounce.js
│   │   ├── pages/
│   │   │   ├── public/              # No auth required
│   │   │   │   ├── HomePage.jsx
│   │   │   │   ├── AboutPage.jsx
│   │   │   │   ├── CurrentIssuePage.jsx
│   │   │   │   ├── ArchivesPage.jsx
│   │   │   │   ├── ArticlePage.jsx
│   │   │   │   ├── SearchPage.jsx
│   │   │   │   ├── AnnouncementsPage.jsx
│   │   │   │   ├── EditorialTeamPage.jsx
│   │   │   │   ├── AimsAndScopePage.jsx
│   │   │   │   ├── IndexingPage.jsx
│   │   │   │   ├── APCPolicyPage.jsx
│   │   │   │   ├── HowToPayPage.jsx
│   │   │   │   ├── EthicsPage.jsx
│   │   │   │   ├── PrivacyPage.jsx
│   │   │   │   ├── InstructionsPage.jsx
│   │   │   │   ├── OpenAccessPage.jsx
│   │   │   │   ├── EditorInChiefPage.jsx
│   │   │   │   └── ContactPage.jsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   ├── RegisterPage.jsx
│   │   │   │   ├── ForgotPasswordPage.jsx
│   │   │   │   └── ResetPasswordPage.jsx
│   │   │   ├── author/              # Author dashboard
│   │   │   │   ├── AuthorDashboard.jsx
│   │   │   │   ├── NewSubmission.jsx
│   │   │   │   ├── SubmissionDetail.jsx
│   │   │   │   └── PaymentPage.jsx
│   │   │   ├── reviewer/
│   │   │   │   ├── ReviewerDashboard.jsx
│   │   │   │   └── ReviewSubmission.jsx
│   │   │   ├── editor/
│   │   │   │   ├── EditorDashboard.jsx
│   │   │   │   ├── SubmissionQueue.jsx
│   │   │   │   ├── SubmissionManage.jsx
│   │   │   │   ├── IssueManager.jsx
│   │   │   │   └── ProductionManager.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── UserManager.jsx
│   │   │       ├── AnnouncementManager.jsx
│   │   │       ├── SiteSettings.jsx
│   │   │       └── PaymentLogs.jsx
│   │   ├── routes/
│   │   │   ├── AppRouter.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── RoleRoute.jsx
│   │   ├── utils/
│   │   │   ├── formatDate.js
│   │   │   ├── formatCurrency.js
│   │   │   └── downloadFile.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── server/                          # Node.js backend
    ├── src/
    │   ├── config/
    │   │   ├── db.js                # MySQL pool
    │   │   ├── env.js               # Env variable validation
    │   │   └── multer.js            # Upload config
    │   ├── controllers/
    │   │   ├── authController.js
    │   │   ├── userController.js
    │   │   ├── submissionController.js
    │   │   ├── reviewController.js
    │   │   ├── articleController.js
    │   │   ├── issueController.js
    │   │   ├── paymentController.js
    │   │   ├── emailController.js
    │   │   └── announcementController.js
    │   ├── middleware/
    │   │   ├── auth.js              # JWT verification
    │   │   ├── roles.js             # Role-based access
    │   │   ├── upload.js            # Multer middleware
    │   │   ├── validate.js          # Input validation (express-validator)
    │   │   └── errorHandler.js      # Global error handler
    │   ├── models/                  # MySQL query functions (no ORM)
    │   │   ├── userModel.js
    │   │   ├── submissionModel.js
    │   │   ├── reviewModel.js
    │   │   ├── articleModel.js
    │   │   ├── issueModel.js
    │   │   ├── paymentModel.js
    │   │   └── announcementModel.js
    │   ├── routes/
    │   │   ├── authRoutes.js
    │   │   ├── userRoutes.js
    │   │   ├── submissionRoutes.js
    │   │   ├── reviewRoutes.js
    │   │   ├── articleRoutes.js
    │   │   ├── issueRoutes.js
    │   │   ├── paymentRoutes.js
    │   │   └── announcementRoutes.js
    │   ├── services/
    │   │   ├── emailService.js      # Nodemailer templates
    │   │   ├── paystackService.js
    │   │   └── flutterwaveService.js
    │   ├── utils/
    │   │   ├── generateToken.js
    │   │   ├── generateReference.js
    │   │   └── paginate.js
    │   └── app.js                   # Express app entry point
    ├── uploads/                     # File storage (gitignored)
    │   ├── manuscripts/
    │   ├── galleys/
    │   └── avatars/
    ├── .env
    ├── .env.example
    └── package.json
```

---

## ═══════════════════════════════════════════════
## PART 2 — MYSQL DATABASE SCHEMA (Full DDL)
## ═══════════════════════════════════════════════

Create a file: `server/src/config/schema.sql`

Run this SQL in order to create all tables:

```sql
-- ============================================================
-- IJMCS JOURNAL DATABASE SCHEMA
-- ============================================================
CREATE DATABASE IF NOT EXISTS ijmcs_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ijmcs_db;

-- ============================================================
-- TABLE: users
-- ============================================================
CREATE TABLE users (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  first_name      VARCHAR(100) NOT NULL,
  last_name       VARCHAR(100) NOT NULL,
  email           VARCHAR(255) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  role            ENUM('author','reviewer','editor','admin') NOT NULL DEFAULT 'author',
  institution     VARCHAR(255),
  country         VARCHAR(100),
  orcid           VARCHAR(50),
  bio             TEXT,
  avatar_url      VARCHAR(500),
  is_verified     TINYINT(1) NOT NULL DEFAULT 0,
  is_active       TINYINT(1) NOT NULL DEFAULT 1,
  verify_token    VARCHAR(255),
  reset_token     VARCHAR(255),
  reset_expires   DATETIME,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: refresh_tokens
-- ============================================================
CREATE TABLE refresh_tokens (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  token       VARCHAR(512) NOT NULL UNIQUE,
  expires_at  DATETIME NOT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: sections  (journal sections e.g. Humanities, Sciences)
-- ============================================================
CREATE TABLE sections (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  abbrev      VARCHAR(50),
  policy      TEXT,
  sort_order  INT DEFAULT 0,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: issues
-- ============================================================
CREATE TABLE issues (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  volume           SMALLINT UNSIGNED NOT NULL,
  issue_number     SMALLINT UNSIGNED NOT NULL,
  year             YEAR NOT NULL,
  title            VARCHAR(255),
  description      TEXT,
  cover_image_url  VARCHAR(500),
  published        TINYINT(1) NOT NULL DEFAULT 0,
  published_at     DATETIME,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_vol_issue (volume, issue_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: submissions
-- ============================================================
CREATE TABLE submissions (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  author_id         INT UNSIGNED NOT NULL,
  section_id        INT UNSIGNED,
  title             VARCHAR(500) NOT NULL,
  abstract          TEXT NOT NULL,
  keywords          VARCHAR(500),          -- comma-separated
  language          VARCHAR(50) DEFAULT 'English',
  cover_letter      TEXT,
  status            ENUM(
                      'submitted',
                      'under_review',
                      'revision_required',
                      'accepted',
                      'rejected',
                      'copyediting',
                      'production',
                      'galley_sent',
                      'galley_approved',
                      'published',
                      'withdrawn'
                    ) NOT NULL DEFAULT 'submitted',
  submitted_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  decision_at       DATETIME,
  editor_id         INT UNSIGNED,
  notes             TEXT,
  similarity_score  DECIMAL(5,2),          -- Turnitin / plagiarism score
  apc_required      TINYINT(1) DEFAULT 1,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id)  REFERENCES users(id),
  FOREIGN KEY (section_id) REFERENCES sections(id),
  FOREIGN KEY (editor_id)  REFERENCES users(id),
  INDEX idx_author   (author_id),
  INDEX idx_status   (status),
  INDEX idx_editor   (editor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: submission_files
-- ============================================================
CREATE TABLE submission_files (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  submission_id   INT UNSIGNED NOT NULL,
  uploader_id     INT UNSIGNED NOT NULL,
  file_type       ENUM('manuscript','revision','galley','supplementary','cover_letter') NOT NULL,
  original_name   VARCHAR(255) NOT NULL,
  stored_name     VARCHAR(255) NOT NULL,     -- UUID filename on disk
  file_path       VARCHAR(500) NOT NULL,
  mime_type       VARCHAR(100),
  file_size       INT UNSIGNED,
  version         TINYINT UNSIGNED DEFAULT 1,
  uploaded_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
  FOREIGN KEY (uploader_id)   REFERENCES users(id),
  INDEX idx_submission (submission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: reviews
-- ============================================================
CREATE TABLE reviews (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  submission_id       INT UNSIGNED NOT NULL,
  reviewer_id         INT UNSIGNED NOT NULL,
  assigned_by         INT UNSIGNED NOT NULL,  -- editor who assigned
  round               TINYINT UNSIGNED DEFAULT 1,
  status              ENUM('invited','accepted','declined','completed','cancelled') DEFAULT 'invited',
  recommendation      ENUM('accept','minor_revision','major_revision','reject') ,
  review_body         TEXT,
  comments_to_editor  TEXT,                   -- confidential to editor
  invite_sent_at      DATETIME,
  accepted_at         DATETIME,
  due_date            DATE,
  completed_at        DATETIME,
  created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id)   REFERENCES users(id),
  FOREIGN KEY (assigned_by)   REFERENCES users(id),
  INDEX idx_submission (submission_id),
  INDEX idx_reviewer   (reviewer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: editor_decisions
-- ============================================================
CREATE TABLE editor_decisions (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  submission_id   INT UNSIGNED NOT NULL,
  editor_id       INT UNSIGNED NOT NULL,
  round           TINYINT UNSIGNED DEFAULT 1,
  decision        ENUM('accept','minor_revision','major_revision','reject','send_to_production') NOT NULL,
  decision_note   TEXT,
  decided_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
  FOREIGN KEY (editor_id)     REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: galley_proofs
-- ============================================================
CREATE TABLE galley_proofs (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  submission_id   INT UNSIGNED NOT NULL UNIQUE,
  file_id         INT UNSIGNED NOT NULL,    -- FK to submission_files (galley type)
  sent_at         DATETIME,
  deadline        DATETIME,                 -- sent_at + 48 hours
  approved_at     DATETIME,
  approved_by     INT UNSIGNED,
  status          ENUM('pending','sent','approved','overdue','rescheduled') DEFAULT 'pending',
  FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
  FOREIGN KEY (file_id)       REFERENCES submission_files(id),
  FOREIGN KEY (approved_by)   REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: articles  (published, public-facing)
-- ============================================================
CREATE TABLE articles (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  submission_id     INT UNSIGNED NOT NULL UNIQUE,
  issue_id          INT UNSIGNED NOT NULL,
  title             VARCHAR(500) NOT NULL,
  abstract          TEXT NOT NULL,
  keywords          VARCHAR(500),
  authors_json      JSON NOT NULL,           -- [{name, institution, orcid, is_corresponding}]
  section_id        INT UNSIGNED,
  doi               VARCHAR(200) UNIQUE,
  pages             VARCHAR(50),             -- e.g. "1-15"
  article_order     SMALLINT UNSIGNED DEFAULT 0,
  galley_pdf_url    VARCHAR(500),
  full_text_html    LONGTEXT,
  license_url       VARCHAR(300) DEFAULT 'https://creativecommons.org/licenses/by/4.0/',
  view_count        INT UNSIGNED DEFAULT 0,
  download_count    INT UNSIGNED DEFAULT 0,
  published_at      DATETIME,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (submission_id) REFERENCES submissions(id),
  FOREIGN KEY (issue_id)      REFERENCES issues(id),
  FOREIGN KEY (section_id)    REFERENCES sections(id),
  INDEX idx_issue   (issue_id),
  FULLTEXT idx_search (title, abstract, keywords)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: payments
-- ============================================================
CREATE TABLE payments (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  submission_id   INT UNSIGNED NOT NULL,
  user_id         INT UNSIGNED NOT NULL,
  payment_type    ENUM('apc','rescheduling_penalty') NOT NULL DEFAULT 'apc',
  amount          DECIMAL(10,2) NOT NULL,
  currency        VARCHAR(10) DEFAULT 'NGN',
  provider        ENUM('paystack','flutterwave','bank_transfer') NOT NULL,
  reference       VARCHAR(255) UNIQUE NOT NULL,
  provider_ref    VARCHAR(255),              -- provider transaction ID
  status          ENUM('pending','success','failed','refunded') DEFAULT 'pending',
  paid_at         DATETIME,
  meta_json       JSON,                      -- provider webhook payload
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (submission_id) REFERENCES submissions(id),
  FOREIGN KEY (user_id)       REFERENCES users(id),
  INDEX idx_submission (submission_id),
  INDEX idx_reference  (reference)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: announcements
-- ============================================================
CREATE TABLE announcements (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(255) NOT NULL,
  body          TEXT NOT NULL,
  type          ENUM('call_for_papers','editorial','conference','special_issue','general') DEFAULT 'general',
  is_published  TINYINT(1) DEFAULT 0,
  expires_at    DATE,
  created_by    INT UNSIGNED NOT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: site_settings
-- ============================================================
CREATE TABLE site_settings (
  setting_key   VARCHAR(100) PRIMARY KEY,
  setting_value TEXT,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed default settings
INSERT INTO site_settings (setting_key, setting_value) VALUES
  ('journal_name',      'Igniting Journal of Multidisciplinary and Contemporary Studies'),
  ('journal_abbrev',    'IJMCS'),
  ('issn_online',       ''),
  ('apc_amount_ngn',    '50000'),
  ('apc_amount_usd',    '50'),
  ('rescheduling_fee_percent', '50'),
  ('galley_deadline_hours',    '48'),
  ('max_articles_per_issue',   '90'),
  ('min_articles_per_issue',   '5'),
  ('annual_article_cap',       '180'),
  ('paystack_public_key',      ''),
  ('flutterwave_public_key',   ''),
  ('contact_email',     'journal.ignitingmultidisciplinary@lasu.edu.ng'),
  ('contact_phone',     '+2348033200000'),
  ('bank_name',         ''),
  ('bank_account_name', ''),
  ('bank_account_number', '');

-- ============================================================
-- TABLE: email_logs  (track sent emails)
-- ============================================================
CREATE TABLE email_logs (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  to_email      VARCHAR(255) NOT NULL,
  subject       VARCHAR(500) NOT NULL,
  template      VARCHAR(100),
  related_id    INT UNSIGNED,
  related_type  VARCHAR(50),
  status        ENUM('sent','failed') NOT NULL,
  error_msg     TEXT,
  sent_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## ═══════════════════════════════════════════════
## PART 3 — BACKEND IMPLEMENTATION (Node.js / Express)
## ═══════════════════════════════════════════════

### 3.1 — Environment Variables (`server/.env`)

```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=ijmcs_user
DB_PASSWORD=StrongPassword123!
DB_NAME=ijmcs_db

# JWT
JWT_ACCESS_SECRET=your_access_secret_64_chars_minimum
JWT_REFRESH_SECRET=your_refresh_secret_64_chars_minimum
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Email (SMTP)
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=journal.ignitingmultidisciplinary@lasu.edu.ng
SMTP_PASS=your_email_password
EMAIL_FROM="IJMCS Editorial Office <journal.ignitingmultidisciplinary@lasu.edu.ng>"

# Paystack
PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxxxxxx

# Flutterwave
FLW_SECRET_KEY=FLWSECK_LIVE-xxxxxxxxxxxxxxxx
FLW_PUBLIC_KEY=FLWPUBK_LIVE-xxxxxxxxxxxxxxxx
FLW_ENCRYPTION_KEY=xxxxxxxxxxxxxxxx

# File Uploads
UPLOAD_DIR=./uploads
MAX_FILE_SIZE_MB=50

# App
BASE_URL=https://ignitingmultidisciplinary.ng
```

---

### 3.2 — Database Config (`server/src/config/db.js`)

```javascript
const mysql = require('mysql2/promise');
const env   = require('./env');

const pool = mysql.createPool({
  host:               env.DB_HOST,
  port:               env.DB_PORT,
  user:               env.DB_USER,
  password:           env.DB_PASSWORD,
  database:           env.DB_NAME,
  waitForConnections: true,
  connectionLimit:    20,
  queueLimit:         0,
  timezone:           '+00:00',
  charset:            'utf8mb4',
});

pool.getConnection()
  .then(conn => { console.log('✅ MySQL connected'); conn.release(); })
  .catch(err => { console.error('❌ MySQL connection failed:', err); process.exit(1); });

module.exports = pool;
```

---

### 3.3 — Express App (`server/src/app.js`)

```javascript
const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const morgan       = require('morgan');
const rateLimit    = require('express-rate-limit');
const path         = require('path');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes         = require('./routes/authRoutes');
const userRoutes         = require('./routes/userRoutes');
const submissionRoutes   = require('./routes/submissionRoutes');
const reviewRoutes       = require('./routes/reviewRoutes');
const articleRoutes      = require('./routes/articleRoutes');
const issueRoutes        = require('./routes/issueRoutes');
const paymentRoutes      = require('./routes/paymentRoutes');
const announcementRoutes = require('./routes/announcementRoutes');

const app = express();

// ─── Security ───────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));

// ─── Rate Limiting ───────────────────────────────────────────
const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: 'Too many requests' });
const authLimiter    = rateLimit({ windowMs: 15 * 60 * 1000, max: 20,  message: 'Too many auth attempts' });
app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);

// ─── Parsing ─────────────────────────────────────────────────
// Paystack/Flutterwave webhooks need raw body — register before json()
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Logging ─────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ─── Static Files ────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// ─── API Routes ──────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/submissions',   submissionRoutes);
app.use('/api/reviews',       reviewRoutes);
app.use('/api/articles',      articleRoutes);
app.use('/api/issues',        issueRoutes);
app.use('/api/payments',      paymentRoutes);
app.use('/api/announcements', announcementRoutes);

// ─── Health Check ────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// ─── Global Error Handler ────────────────────────────────────
app.use(errorHandler);

module.exports = app;
```

---

### 3.4 — JWT Authentication Middleware (`server/src/middleware/auth.js`)

```javascript
const jwt  = require('jsonwebtoken');
const pool = require('../config/db');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer '))
      return res.status(401).json({ message: 'Access token required' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const [rows] = await pool.query(
      'SELECT id, email, role, first_name, last_name, is_active FROM users WHERE id = ?',
      [decoded.id]
    );
    if (!rows.length || !rows[0].is_active)
      return res.status(401).json({ message: 'User not found or inactive' });

    req.user = rows[0];
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      return res.status(401).json({ message: 'Token expired', code: 'TOKEN_EXPIRED' });
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { authenticate };
```

---

### 3.5 — Role Middleware (`server/src/middleware/roles.js`)

```javascript
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  if (!roles.includes(req.user.role))
    return res.status(403).json({ message: `Access restricted to: ${roles.join(', ')}` });
  next();
};

module.exports = { requireRole };
```

---

### 3.6 — Auth Controller (`server/src/controllers/authController.js`)

Implement all of the following functions:

```javascript
// POST /api/auth/register
// - Validate: first_name, last_name, email (unique), password (min 8 chars), role (author only on self-register)
// - Hash password with bcrypt (saltRounds: 12)
// - Generate email verification token (crypto.randomBytes(32).toString('hex'))
// - Save user with is_verified = 0
// - Send verification email via emailService.sendVerificationEmail()
// - Return: { message: 'Registration successful. Check your email to verify.' }

// GET /api/auth/verify-email?token=xxx
// - Find user by verify_token
// - Set is_verified = 1, verify_token = NULL
// - Return: { message: 'Email verified successfully' }

// POST /api/auth/login
// - Validate email + password
// - Check is_verified = 1 (if not: return 403 with message to verify email)
// - Compare password with bcrypt
// - Generate JWT access token (15min) and refresh token (7d)
// - Store refresh token in refresh_tokens table
// - Return: { accessToken, refreshToken, user: { id, email, role, first_name, last_name } }

// POST /api/auth/refresh-token
// - Accept { refreshToken } in body
// - Verify refresh token from DB (not expired, exists)
// - Generate new access token
// - Return: { accessToken }

// POST /api/auth/logout
// - Delete refresh token from DB
// - Return: { message: 'Logged out' }

// POST /api/auth/forgot-password
// - Find user by email
// - Generate reset token (crypto.randomBytes(32).toString('hex'))
// - Set reset_token and reset_expires (1 hour from now)
// - Send password reset email
// - Return: { message: 'Reset link sent if email exists' }

// POST /api/auth/reset-password
// - Accept { token, newPassword }
// - Find user by reset_token where reset_expires > NOW()
// - Hash new password, clear reset fields
// - Return: { message: 'Password reset successful' }
```

---

### 3.7 — Submission Controller (`server/src/controllers/submissionController.js`)

```javascript
// POST /api/submissions
// Auth: author
// - Accept multipart/form-data: { title, abstract, keywords, section_id, cover_letter } + file (manuscript PDF/DOCX)
// - Validate: title required, abstract (150-250 words check), file type must be PDF or DOCX, max 50MB
// - Check author does not have more than 3 active submissions (anti-spam)
// - Save submission record, save file to uploads/manuscripts/, save to submission_files
// - Send acknowledgment email to author via emailService.sendSubmissionAck()
// - Send notification email to editors
// - Return: { submission_id, status: 'submitted', message: '...' }

// GET /api/submissions  (editor/admin: all | author: own only)
// - Paginated list with status filter, search by title/author
// - Return: { submissions: [...], total, page, limit }

// GET /api/submissions/:id
// - Author can only get own submission; Editor/Admin can get any
// - Return full submission with files, reviews summary, payment status

// PATCH /api/submissions/:id/status
// Auth: editor, admin
// - Update submission status
// - Allowed transitions: submitted→under_review, under_review→accepted/rejected/revision_required
//   accepted→copyediting, copyediting→production, production→galley_sent
// - On accept: set decision_at, create payment record with status=pending
// - Send email to author for each status change

// PATCH /api/submissions/:id/assign-editor
// Auth: admin
// - Assign an editor to the submission
// - Set editor_id on submission

// POST /api/submissions/:id/files
// Auth: author (revision), editor (galley), admin
// - Upload new file version
// - Increment version number
// - Return: file metadata

// GET /api/submissions/:id/files/:fileId/download
// Auth: submission owner, assigned editor, reviewer (manuscript only)
// - Stream file from disk with Content-Disposition: attachment

// POST /api/submissions/:id/withdraw
// Auth: author
// - Only allowed if status is NOT galley_approved or published
// - Set status = 'withdrawn'
// - Send withdrawal confirmation email
```

---

### 3.8 — Review Controller (`server/src/controllers/reviewController.js`)

```javascript
// POST /api/reviews/assign
// Auth: editor
// Body: { submission_id, reviewer_id, due_date, round }
// - Create review record with status='invited'
// - Send reviewer invitation email with submission title and abstract (BLINDED — no author names)
// - Return: review record

// PATCH /api/reviews/:id/respond
// Auth: reviewer
// Body: { response: 'accepted' | 'declined' }
// - Update review status
// - If accepted: set accepted_at
// - If declined: notify editor via email
// - Return: updated review

// PATCH /api/reviews/:id/submit
// Auth: reviewer
// Body: { recommendation, review_body, comments_to_editor }
// - Set status='completed', completed_at=NOW()
// - Notify editor that review is submitted
// - Return: updated review

// GET /api/reviews/submission/:submissionId
// Auth: editor, admin
// - Return all reviews for the submission (with reviewer info)
// - Authors can see review content only after editor decision (sanitized)

// GET /api/reviews/my
// Auth: reviewer
// - Return all reviews assigned to the logged-in reviewer
```

---

### 3.9 — Payment Controller (`server/src/controllers/paymentController.js`)

Implement these endpoints completely:

```javascript
// POST /api/payments/initiate
// Auth: author
// Body: { submission_id, provider: 'paystack' | 'flutterwave', currency: 'NGN' | 'USD' }
// Logic:
//   1. Find submission — must belong to req.user and have status='accepted'
//   2. Check no successful payment already exists
//   3. Get APC amount from site_settings
//   4. Generate unique reference: IJMCS-{submissionId}-{timestamp}
//   5. Create pending payment record in DB
//   6. Call paystackService.initiate() or flutterwaveService.initiate()
//   7. Return: { payment_url, reference, amount, provider }

// GET /api/payments/verify/:reference
// Auth: author
// Logic:
//   1. Find payment by reference
//   2. Call provider verify endpoint
//   3. If successful: update payment status, update submission status to 'copyediting'
//   4. Send APC receipt email to author
//   5. Notify editor-in-chief of successful payment
//   6. Return: { status, message }

// POST /api/payments/webhook/paystack
// - Validate Paystack webhook signature (x-paystack-signature header)
// - Signature: crypto.createHmac('sha512', PAYSTACK_SECRET_KEY).update(rawBody).digest('hex')
// - On 'charge.success' event: call verifyAndUpdatePayment()
// - Return 200 immediately

// POST /api/payments/webhook/flutterwave
// - Validate Flutterwave webhook signature (verif-hash header matches FLW_SECRET_KEY)
// - On 'charge.completed' with status='successful': call verifyAndUpdatePayment()
// - Return 200 immediately

// GET /api/payments/submission/:submissionId
// Auth: author (own), editor, admin
// - Return payment records for the submission

// GET /api/payments  (admin only)
// - Paginated list of all payments with filters
```

---

### 3.10 — Email Service (`server/src/services/emailService.js`)

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

// Implement all of the following email functions.
// Each uses an HTML template defined below.

const emailService = {
  sendVerificationEmail:    async ({ to, name, verifyLink }) => {},
  sendPasswordReset:        async ({ to, name, resetLink }) => {},
  sendSubmissionAck:        async ({ to, authorName, title, submissionId }) => {},
  sendReviewInvitation:     async ({ to, reviewerName, title, abstract, dueDate, acceptLink, declineLink }) => {},
  sendEditorDecision:       async ({ to, authorName, title, decision, notes, submissionId }) => {},
  sendGalleyProof:          async ({ to, authorName, title, proofLink, deadline, approveLink }) => {},
  sendAPCPaymentRequest:    async ({ to, authorName, title, amount, paystackLink, flwLink, submissionId }) => {},
  sendAPCReceipt:           async ({ to, authorName, title, amount, reference, provider }) => {},
  sendReschedulingPenalty:  async ({ to, authorName, title, penaltyAmount, payLink }) => {},
  sendPublicationNotice:    async ({ to, authorName, title, doi, articleUrl }) => {},
  notifyEditorNewSubmission:async ({ editorEmail, title, authorName, submissionId }) => {},
};

// Base HTML email template wrapper:
const emailTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Georgia, serif; background: #f8f8f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #fff;
                 border: 1px solid #e0ddd5; border-radius: 4px; overflow: hidden; }
    .header { background: #1a3a5c; color: #fff; padding: 24px 32px; }
    .header h1 { margin: 0; font-size: 18px; font-weight: normal; letter-spacing: 0.5px; }
    .header p { margin: 4px 0 0; font-size: 12px; color: #a8c0d6; }
    .body { padding: 32px; color: #333; line-height: 1.7; font-size: 15px; }
    .cta { display: inline-block; background: #1a3a5c; color: #fff !important;
           padding: 12px 28px; border-radius: 3px; text-decoration: none;
           font-size: 14px; margin: 20px 0; }
    .footer { background: #f0ede6; padding: 16px 32px; font-size: 12px; color: #888; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Igniting Journal of Multidisciplinary and Contemporary Studies</h1>
      <p>IJMCS · Lagos State University · Open Access</p>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      © ${new Date().getFullYear()} IJMCS · Faculty of Arts, Lagos State University, Nigeria<br>
      journal.ignitingmultidisciplinary@lasu.edu.ng
    </div>
  </div>
</body>
</html>`;

module.exports = emailService;
```

---

### 3.11 — Paystack Service (`server/src/services/paystackService.js`)

```javascript
const axios = require('axios');

const PAYSTACK_URL = 'https://api.paystack.co';
const headers = {
  Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
  'Content-Type': 'application/json',
};

const paystackService = {
  // Initiate a payment — returns { authorization_url, reference }
  initiate: async ({ email, amount, reference, submissionId, currency = 'NGN', callbackUrl }) => {
    const { data } = await axios.post(`${PAYSTACK_URL}/transaction/initialize`, {
      email,
      amount: Math.round(amount * 100),  // Paystack uses kobo (subunit)
      reference,
      currency,
      callback_url: callbackUrl,
      metadata: { submission_id: submissionId },
    }, { headers });
    if (!data.status) throw new Error(data.message);
    return { authorization_url: data.data.authorization_url, reference: data.data.reference };
  },

  // Verify a payment
  verify: async (reference) => {
    const { data } = await axios.get(`${PAYSTACK_URL}/transaction/verify/${reference}`, { headers });
    if (!data.status) throw new Error(data.message);
    return {
      status:     data.data.status,       // 'success' | 'failed'
      amount:     data.data.amount / 100,
      currency:   data.data.currency,
      providerRef: data.data.id.toString(),
      paidAt:     data.data.paid_at,
    };
  },

  // Validate webhook signature
  validateWebhookSignature: (rawBody, signature) => {
    const crypto = require('crypto');
    const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
                       .update(rawBody).digest('hex');
    return hash === signature;
  },
};

module.exports = paystackService;
```

---

### 3.12 — Flutterwave Service (`server/src/services/flutterwaveService.js`)

```javascript
const axios = require('axios');

const FLW_URL = 'https://api.flutterwave.com/v3';
const headers = {
  Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
  'Content-Type': 'application/json',
};

const flutterwaveService = {
  initiate: async ({ email, name, amount, txRef, submissionId, currency = 'NGN', redirectUrl }) => {
    const { data } = await axios.post(`${FLW_URL}/payments`, {
      tx_ref:       txRef,
      amount,
      currency,
      redirect_url: redirectUrl,
      customer:     { email, name },
      customizations: {
        title: 'IJMCS Article Processing Charge',
        logo:  `${process.env.BASE_URL}/logo.png`,
      },
      meta: { submission_id: submissionId },
    }, { headers });
    if (data.status !== 'success') throw new Error(data.message);
    return { payment_link: data.data.link, txRef };
  },

  verify: async (transactionId) => {
    const { data } = await axios.get(`${FLW_URL}/transactions/${transactionId}/verify`, { headers });
    if (data.status !== 'success') throw new Error(data.message);
    return {
      status:      data.data.status,  // 'successful' | 'failed'
      amount:      data.data.amount,
      currency:    data.data.currency,
      providerRef: data.data.id.toString(),
      paidAt:      data.data.created_at,
    };
  },

  validateWebhookSignature: (verifyHash) => {
    return verifyHash === process.env.FLW_SECRET_KEY;
  },
};

module.exports = flutterwaveService;
```

---

### 3.13 — Galley Proof + 48-Hour Deadline Enforcement

```javascript
// In issueController.js / productionController.js

// POST /api/submissions/:id/galley
// Auth: editor
// - Upload galley PDF
// - Create/update galley_proofs record with:
//   status = 'sent', sent_at = NOW(), deadline = NOW() + 48 hours
// - Send galley email to author with approve link and deadline warning
// - Schedule background check (use node-cron or Bull queue):

const cron = require('node-cron');
const pool = require('../config/db');
const emailService = require('../services/emailService');

// Run every 30 minutes: check overdue galleys
cron.schedule('*/30 * * * *', async () => {
  const [overdue] = await pool.query(`
    SELECT gp.*, s.title, s.author_id, u.email, u.first_name,
           p.amount as apc_amount
    FROM galley_proofs gp
    JOIN submissions s ON s.id = gp.submission_id
    JOIN users u ON u.id = s.author_id
    LEFT JOIN payments p ON p.submission_id = s.id AND p.status = 'success'
    WHERE gp.status = 'sent'
    AND gp.deadline < NOW()
  `);

  for (const galley of overdue) {
    await pool.query(
      `UPDATE galley_proofs SET status = 'overdue' WHERE id = ?`, [galley.id]
    );
    // Calculate 50% rescheduling penalty
    const penalty = (galley.apc_amount || 0) * 0.5;
    // Create pending penalty payment
    // Send rescheduling penalty email
    await emailService.sendReschedulingPenalty({
      to:            galley.email,
      authorName:    galley.first_name,
      title:         galley.title,
      penaltyAmount: penalty,
      payLink:       `${process.env.BASE_URL}/dashboard/payment/${galley.submission_id}?type=penalty`,
    });
  }
});

// GET /api/submissions/:id/galley/approve?token=xxx
// Public endpoint (token-based, no login required)
// - Validate approval token
// - Set galley_proofs.status = 'approved', approved_at = NOW()
// - Update submission status = 'galley_approved'
// - Trigger DOI assignment workflow
```

---

### 3.14 — Article & Issue Routes

```javascript
// GET /api/issues                     — list all published issues
// GET /api/issues/current             — latest published issue
// GET /api/issues/:id                 — issue + articles
// POST /api/issues                    — editor/admin: create issue
// PATCH /api/issues/:id/publish       — editor/admin: publish issue (auto-sets published_at)
// POST /api/issues/:id/add-article    — editor: add accepted submission to issue

// GET /api/articles                   — paginated public article list (published only)
// GET /api/articles/:id               — article detail + increment view_count
// GET /api/articles/:id/pdf           — redirect to galley PDF + increment download_count
// GET /api/articles/search?q=xxx      — FULLTEXT search on title+abstract+keywords
// GET /api/articles/issue/:issueId    — articles in an issue (public)
```

---

## ═══════════════════════════════════════════════
## PART 4 — FRONTEND IMPLEMENTATION (React)
## ═══════════════════════════════════════════════

### 4.1 — Environment Variables (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=IJMCS
VITE_PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxxxxxx
VITE_FLW_PUBLIC_KEY=FLWPUBK_LIVE-xxxxxxxxxxxxxxxx
```

---

### 4.2 — Axios Instance (`client/src/api/axiosInstance.js`)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh access token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 &&
        error.response?.data?.code === 'TOKEN_EXPIRED' &&
        !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh-token`, { refreshToken });
        localStorage.setItem('accessToken', data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

### 4.3 — Auth Context (`client/src/context/AuthContext.jsx`)

```javascript
import { createContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axiosInstance';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    await api.post('/auth/logout', { refreshToken: localStorage.getItem('refreshToken') }).catch(() => {});
    localStorage.clear();
    setUser(null);
  }, []);

  const isRole = (...roles) => user && roles.includes(user.role);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isRole }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
```

---

### 4.4 — App Router (`client/src/routes/AppRouter.jsx`)

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

// Public pages
import HomePage            from '../pages/public/HomePage';
import AboutPage           from '../pages/public/AboutPage';
import CurrentIssuePage    from '../pages/public/CurrentIssuePage';
import ArchivesPage        from '../pages/public/ArchivesPage';
import ArticlePage         from '../pages/public/ArticlePage';
import SearchPage          from '../pages/public/SearchPage';
import AnnouncementsPage   from '../pages/public/AnnouncementsPage';
import EditorialTeamPage   from '../pages/public/EditorialTeamPage';
import AimsAndScopePage    from '../pages/public/AimsAndScopePage';
import IndexingPage        from '../pages/public/IndexingPage';
import APCPolicyPage       from '../pages/public/APCPolicyPage';
import HowToPayPage        from '../pages/public/HowToPayPage';
import EthicsPage          from '../pages/public/EthicsPage';
import PrivacyPage         from '../pages/public/PrivacyPage';
import InstructionsPage    from '../pages/public/InstructionsPage';
import OpenAccessPage      from '../pages/public/OpenAccessPage';
import EditorInChiefPage   from '../pages/public/EditorInChiefPage';
import ContactPage         from '../pages/public/ContactPage';

// Auth pages
import LoginPage           from '../pages/auth/LoginPage';
import RegisterPage        from '../pages/auth/RegisterPage';
import ForgotPasswordPage  from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage   from '../pages/auth/ResetPasswordPage';

// Dashboard pages
import AuthorDashboard     from '../pages/author/AuthorDashboard';
import NewSubmission       from '../pages/author/NewSubmission';
import SubmissionDetail    from '../pages/author/SubmissionDetail';
import PaymentPage         from '../pages/author/PaymentPage';
import ReviewerDashboard   from '../pages/reviewer/ReviewerDashboard';
import ReviewSubmission    from '../pages/reviewer/ReviewSubmission';
import EditorDashboard     from '../pages/editor/EditorDashboard';
import SubmissionQueue     from '../pages/editor/SubmissionQueue';
import SubmissionManage    from '../pages/editor/SubmissionManage';
import IssueManager        from '../pages/editor/IssueManager';
import AdminDashboard      from '../pages/admin/AdminDashboard';
import UserManager         from '../pages/admin/UserManager';
import SiteSettings        from '../pages/admin/SiteSettings';
import PaymentLogs         from '../pages/admin/PaymentLogs';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const AppRouter = () => (
  <BrowserRouter>
    <Navbar />
    <Routes>
      {/* ── Public ─────────────────────────────── */}
      <Route path="/"                      element={<HomePage />} />
      <Route path="/about"                 element={<AboutPage />} />
      <Route path="/current"               element={<CurrentIssuePage />} />
      <Route path="/archives"              element={<ArchivesPage />} />
      <Route path="/articles/:id"          element={<ArticlePage />} />
      <Route path="/search"                element={<SearchPage />} />
      <Route path="/announcements"         element={<AnnouncementsPage />} />
      <Route path="/editorial-team"        element={<EditorialTeamPage />} />
      <Route path="/aims-and-scope"        element={<AimsAndScopePage />} />
      <Route path="/indexing"              element={<IndexingPage />} />
      <Route path="/apc-policy"            element={<APCPolicyPage />} />
      <Route path="/how-to-pay"            element={<HowToPayPage />} />
      <Route path="/ethics"                element={<EthicsPage />} />
      <Route path="/privacy"               element={<PrivacyPage />} />
      <Route path="/instructions"          element={<InstructionsPage />} />
      <Route path="/open-access"           element={<OpenAccessPage />} />
      <Route path="/editor-in-chief"       element={<EditorInChiefPage />} />
      <Route path="/contact"               element={<ContactPage />} />

      {/* ── Auth ───────────────────────────────── */}
      <Route path="/login"                 element={<LoginPage />} />
      <Route path="/register"              element={<RegisterPage />} />
      <Route path="/forgot-password"       element={<ForgotPasswordPage />} />
      <Route path="/reset-password"        element={<ResetPasswordPage />} />

      {/* ── Author Dashboard ───────────────────── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute roles={['author']} />}>
          <Route path="/dashboard"              element={<AuthorDashboard />} />
          <Route path="/dashboard/submit"       element={<NewSubmission />} />
          <Route path="/dashboard/submissions/:id" element={<SubmissionDetail />} />
          <Route path="/dashboard/payment/:id"  element={<PaymentPage />} />
        </Route>

        {/* ── Reviewer Dashboard ─────────────── */}
        <Route element={<RoleRoute roles={['reviewer']} />}>
          <Route path="/reviewer"               element={<ReviewerDashboard />} />
          <Route path="/reviewer/review/:id"    element={<ReviewSubmission />} />
        </Route>

        {/* ── Editor Dashboard ───────────────── */}
        <Route element={<RoleRoute roles={['editor', 'admin']} />}>
          <Route path="/editor"                 element={<EditorDashboard />} />
          <Route path="/editor/submissions"     element={<SubmissionQueue />} />
          <Route path="/editor/submissions/:id" element={<SubmissionManage />} />
          <Route path="/editor/issues"          element={<IssueManager />} />
        </Route>

        {/* ── Admin Dashboard ────────────────── */}
        <Route element={<RoleRoute roles={['admin']} />}>
          <Route path="/admin"                  element={<AdminDashboard />} />
          <Route path="/admin/users"            element={<UserManager />} />
          <Route path="/admin/settings"         element={<SiteSettings />} />
          <Route path="/admin/payments"         element={<PaymentLogs />} />
        </Route>
      </Route>
    </Routes>
    <Footer />
  </BrowserRouter>
);

export default AppRouter;
```

---

### 4.5 — Protected Route & Role Route

```jsx
// client/src/routes/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
export default ProtectedRoute;

// client/src/routes/RoleRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RoleRoute = ({ roles }) => {
  const { user } = useAuth();
  return roles.includes(user?.role) ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};
export default RoleRoute;
```

---

### 4.6 — Navbar Component (`client/src/components/layout/Navbar.jsx`)

Build the Navbar with these exact requirements:

```
Design spec:
- Background: #1a3a5c (deep navy blue — IJMCS brand color)
- Logo: Journal monogram/name left-aligned
- Primary navigation links (all from the document):
    About the Journal | Current Issue | Archives | Search | Announcements | Contact Us
- Dropdown "Journal Info" containing:
    Aims & Scope | Editorial Team | Editor-in-Chief | Indexing | Open Access
- Dropdown "Policies" containing:
    Journal Policies | APC Policy | How to Pay | Ethics | Instructions | Privacy
- Auth section (right side):
    If NOT logged in: [Login] [Register] buttons
    If logged in: user avatar/name dropdown → Dashboard | Profile | Logout
- Mobile: hamburger menu with slide-out drawer
- Active link highlighting
- Sticky on scroll
```

---

### 4.7 — Home Page (`client/src/pages/public/HomePage.jsx`)

Build the homepage with these sections:

```
1. HERO SECTION
   - Journal name + tagline: "Open Access · Peer-Reviewed · International"
   - Two CTAs: "Submit Manuscript" (→ /register) and "Browse Articles" (→ /archives)
   - Background: gradient from #1a3a5c to #2d5986
   - Animated stats: "Biannual Publication", "Double-Blind Review", "CrossRef DOI"

2. CURRENT ISSUE PREVIEW
   - Show volume, issue, year
   - List first 5 article titles with authors from /api/issues/current
   - "View All Articles →" link

3. ANNOUNCEMENTS SECTION
   - Show 3 latest published announcements from /api/announcements?limit=3
   - Type badges (Call for Papers, Editorial, etc.)

4. SCOPE HIGHLIGHTS
   - 6 discipline cards: Humanities | Social Sciences | Sciences | Education |
     Environmental Studies | Peace & Conflict Studies
   - Hover effect with brief description

5. INDEXING BADGES
   - Show logos/text for: Google Scholar, CrossRef, Zenodo, OpenAIRE, ResearchGate

6. SUBMIT CTA BANNER
   - Background: #1a3a5c
   - Text: "Calling for Original Research"
   - Sub: "Biannually published. Open access. Peer-reviewed."
   - Button: "Submit Your Manuscript"
```

---

### 4.8 — Article Page (`client/src/pages/public/ArticlePage.jsx`)

```
Build a full article detail page that:

1. Fetches article from GET /api/articles/:id
2. Displays:
   - Title (H1, large)
   - Authors list: name, institution, ORCID link per author
   - Issue info: Vol X, Issue Y (Year) | Pages | DOI (linked to doi.org)
   - Keywords: clickable tags (→ search?q=keyword)
   - Abstract section
   - License: CC BY 4.0 badge
   - Download PDF button (→ /api/articles/:id/pdf)
   - How to Cite box:
       APA format: Authors (Year). Title. IJMCS, Vol(Issue), pages. https://doi.org/...
       Copy-to-clipboard button
3. View count and download count displayed
4. Breadcrumb: Home > Archives > Vol X Issue Y > Article Title
5. Sidebar: Related articles from same section
```

---

### 4.9 — New Submission Page (`client/src/pages/author/NewSubmission.jsx`)

```
Multi-step form with 4 steps and a progress indicator:

STEP 1 — Article Details
  - Title (required, max 500 chars)
  - Abstract (required, word counter showing 150–250 word requirement)
  - Keywords (add-tag interface, 3–5 keywords)
  - Section (dropdown from /api/sections)
  - Language (default: English)

STEP 2 — Manuscript Upload
  - File dropzone: accepts PDF and DOCX only, max 50MB
  - Show file name, size, type after selection
  - Supplementary files (optional)
  - Cover letter (optional text area)

STEP 3 — Submission Checklist
  - Checkbox list (ALL must be checked):
    □ The manuscript has not been previously published
    □ The manuscript is not under review elsewhere
    □ Written in English
    □ Follows APA 7th Edition referencing
    □ Abstract is 150–250 words
    □ 3–5 keywords are provided
    □ Font: Times New Roman, 12pt, 1.5 line spacing
    □ I am an author of this paper (no third-party submissions)
    □ I declare no undisclosed conflict of interest
    □ I understand the APC policy

STEP 4 — Review & Submit
  - Summary of all entered information
  - Warning: "Once submitted, you will receive a confirmation email.
    Your manuscript will undergo double-blind peer review.
    APC is only payable upon acceptance."
  - Submit button

On success: redirect to /dashboard/submissions/:newId with success toast
```

---

### 4.10 — Payment Page (`client/src/pages/author/PaymentPage.jsx`)

```
Build this page for authors to pay APC after acceptance:

1. Show submission title and acceptance status badge
2. Show APC amount (from API)
3. Payment method selection:
   ◉ Pay Online — Paystack  (recommended for Nigeria)
   ◉ Pay Online — Flutterwave  (recommended for international)
   ◉ Bank Transfer  (manual — shows bank details from settings)

4. For Paystack selection:
   - Call POST /api/payments/initiate with provider='paystack'
   - Open Paystack popup with PaystackPop.setup() (import from CDN:
     <script src="https://js.paystack.co/v1/inline.js"></script>)
   - On success callback: call GET /api/payments/verify/:reference
   - Show success message + receipt details

5. For Flutterwave selection:
   - Call POST /api/payments/initiate with provider='flutterwave'
   - Redirect to returned payment_link
   - On return, verify via URL params

6. For Bank Transfer:
   - Show bank details from site_settings
   - Form: upload proof of payment (image/PDF)
   - Submit → email notification to editor

7. After successful payment:
   - Show receipt: Reference number, amount, date, provider
   - "Your article is now in production" message
```

---

### 4.11 — Editor Dashboard (`client/src/pages/editor/EditorDashboard.jsx`)

```
Build the editor dashboard with:

1. STATS CARDS (from /api/editor/stats):
   - New Submissions (this week)
   - Under Review
   - Awaiting Decision
   - Accepted (Awaiting Payment)
   - In Production
   - Published This Year

2. SUBMISSION QUEUE TABLE
   - Columns: ID | Title | Author | Section | Status | Submitted Date | Actions
   - Status filter: All / Under Review / Revision / Accepted / Rejected / Production
   - Search by title
   - Actions per row: View | Assign Reviewer | Make Decision | Send to Production

3. QUICK ACTIONS SIDEBAR:
   - Create New Issue
   - Upload Galley Proof
   - View Overdue Reviews
   - View Pending Payments

4. REVIEW OVERVIEW:
   - List of pending reviews with due dates
   - Color-coded: Green (>7 days) | Yellow (≤7 days) | Red (overdue)
```

---

### 4.12 — Search Page (`client/src/pages/public/SearchPage.jsx`)

```
Build a full search page:

1. Search bar (pre-filled from URL ?q= param)
2. Filters: Section | Year | Issue
3. Results list:
   - Article title (linked)
   - Authors
   - Issue info
   - Abstract preview (first 150 chars, truncated)
   - Keyword tags
4. Highlight matched search terms in results
5. Pagination (10 per page)
6. "No results found" empty state with suggestions
7. URL updates as user types (debounced 400ms)
```

---

## ═══════════════════════════════════════════════
## PART 5 — DESIGN SYSTEM (TailwindCSS)
## ═══════════════════════════════════════════════

### `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          900: '#0d2036',   // darkest
          800: '#1a3a5c',   // primary brand (navbar, headings)
          700: '#2d5986',   // darker hover
          600: '#3b72a8',
          500: '#4d8ec0',
          100: '#dceefa',   // lightest tint
        },
        accent: {
          600: '#b5511a',   // warm amber for CTAs
          500: '#d4622a',
          400: '#e8773f',
        },
        neutral: {
          50:  '#f9f7f4',   // off-white background
          100: '#f0ede6',
          200: '#e0ddd5',
          700: '#4a4740',
          900: '#1c1a17',
        },
      },
      fontFamily: {
        serif:    ['"Playfair Display"', 'Georgia', 'serif'],  // headings
        sans:     ['"Source Sans 3"', 'system-ui', 'sans-serif'], // body
        mono:     ['"JetBrains Mono"', 'monospace'],            // code/DOI
      },
      boxShadow: {
        card: '0 1px 4px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};
```

**Import Google Fonts in `index.html`:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Sans+3:wght@300;400;600&display=swap" rel="stylesheet">
```

**Color usage rules:**
- `brand-800` (#1a3a5c) — navbar, section headers, primary buttons
- `accent-500` (#d4622a) — CTA buttons, important actions
- `neutral-50` (#f9f7f4) — page background
- `brand-100` (#dceefa) — light info boxes, tag backgrounds

---

## ═══════════════════════════════════════════════
## PART 6 — PACKAGE DEPENDENCIES
## ═══════════════════════════════════════════════

### Frontend (`client/package.json`)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "axios": "^1.6.0",
    "react-query": "^3.39.3",
    "react-hook-form": "^7.49.0",
    "react-dropzone": "^14.2.3",
    "react-quill": "^2.0.0",
    "dompurify": "^3.0.8",
    "react-hot-toast": "^2.4.1",
    "date-fns": "^3.3.0",
    "react-paginate": "^8.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35"
  }
}
```

### Backend (`server/package.json`)
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.7.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "nodemailer": "^6.9.8",
    "multer": "^1.4.5-lts.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1",
    "morgan": "^1.10.0",
    "axios": "^1.6.0",
    "dotenv": "^16.4.1",
    "uuid": "^9.0.0",
    "node-cron": "^3.0.3",
    "crypto": "^1.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.3"
  }
}
```

---

## ═══════════════════════════════════════════════
## PART 7 — API REFERENCE (Full Endpoint List)
## ═══════════════════════════════════════════════

```
AUTH
  POST   /api/auth/register
  GET    /api/auth/verify-email?token=
  POST   /api/auth/login
  POST   /api/auth/refresh-token
  POST   /api/auth/logout
  POST   /api/auth/forgot-password
  POST   /api/auth/reset-password

USERS
  GET    /api/users/me                      (auth)
  PATCH  /api/users/me                      (auth)
  GET    /api/users                         (admin)
  PATCH  /api/users/:id/role               (admin)
  GET    /api/users/reviewers              (editor, admin)

SUBMISSIONS
  POST   /api/submissions                   (author)
  GET    /api/submissions                   (author=own, editor/admin=all)
  GET    /api/submissions/:id               (auth, role-gated)
  PATCH  /api/submissions/:id/status       (editor, admin)
  PATCH  /api/submissions/:id/assign-editor (admin)
  POST   /api/submissions/:id/files        (auth)
  GET    /api/submissions/:id/files/:fileId/download (auth)
  POST   /api/submissions/:id/withdraw     (author)

REVIEWS
  POST   /api/reviews/assign               (editor)
  PATCH  /api/reviews/:id/respond          (reviewer)
  PATCH  /api/reviews/:id/submit           (reviewer)
  GET    /api/reviews/submission/:id       (editor, admin)
  GET    /api/reviews/my                   (reviewer)

EDITOR DECISIONS
  POST   /api/decisions                    (editor)
  GET    /api/decisions/submission/:id     (editor, admin, author after decision)

GALLEYS
  POST   /api/submissions/:id/galley       (editor)
  GET    /api/submissions/:id/galley/approve?token= (public)

ARTICLES (PUBLIC)
  GET    /api/articles                     (public)
  GET    /api/articles/search?q=           (public)
  GET    /api/articles/:id                 (public)
  GET    /api/articles/:id/pdf             (public)
  POST   /api/articles                     (editor)
  PATCH  /api/articles/:id                 (editor)

ISSUES
  GET    /api/issues                       (public — published only)
  GET    /api/issues/current               (public)
  GET    /api/issues/:id                   (public)
  POST   /api/issues                       (editor)
  PATCH  /api/issues/:id                   (editor)
  PATCH  /api/issues/:id/publish           (editor)
  POST   /api/issues/:id/articles          (editor — add article to issue)

PAYMENTS
  POST   /api/payments/initiate            (author)
  GET    /api/payments/verify/:reference   (author)
  POST   /api/payments/webhook/paystack    (public — Paystack webhook)
  POST   /api/payments/webhook/flutterwave (public — FLW webhook)
  GET    /api/payments/submission/:id      (auth)
  GET    /api/payments                     (admin)

ANNOUNCEMENTS
  GET    /api/announcements                (public — published only)
  GET    /api/announcements/:id            (public)
  POST   /api/announcements               (admin)
  PATCH  /api/announcements/:id           (admin)
  DELETE /api/announcements/:id           (admin)

SETTINGS
  GET    /api/settings/public             (public — non-sensitive keys only)
  GET    /api/settings                    (admin — all)
  PATCH  /api/settings                    (admin)

SECTIONS
  GET    /api/sections                    (public)
  POST   /api/sections                    (admin)
  PATCH  /api/sections/:id               (admin)
```

---

## ═══════════════════════════════════════════════
## PART 8 — SECURITY REQUIREMENTS
## ═══════════════════════════════════════════════

Implement ALL of the following without exception:

```
1. PASSWORDS:      bcryptjs with saltRounds: 12. Never store plaintext.
2. JWT:            Access token 15min, Refresh token 7d stored in DB.
                   Rotate refresh token on each use.
3. INPUT VALIDATION: Use express-validator on every POST/PATCH endpoint.
                   Sanitize all string inputs (trim, escape).
4. FILE UPLOADS:   Validate MIME type server-side (not just extension).
                   Rename file to UUID (never use original filename as-is).
                   Store outside web root or behind authenticated download endpoint.
5. SQL INJECTION:  Use parameterized queries exclusively. Never concatenate user input into SQL.
6. XSS:            Sanitize HTML with DOMPurify on frontend before rendering.
                   Set Content-Security-Policy header.
7. CORS:           Restrict to CLIENT_URL only. No wildcard in production.
8. WEBHOOKS:       Validate Paystack HMAC-SHA512 signature.
                   Validate Flutterwave verif-hash header.
9. RATE LIMITING:  General: 200 req / 15min. Auth endpoints: 20 req / 15min.
10. PRIVACY:       Reviewer identity never exposed to authors.
                   Author identity stripped from manuscripts sent to reviewers (editor responsibility note).
11. HTTPS:         Force HTTPS in production. Set HSTS header.
12. SENSITIVE ENV: Never commit .env. Add to .gitignore immediately.
```

---

## ═══════════════════════════════════════════════
## PART 9 — ERROR HANDLING STANDARD
## ═══════════════════════════════════════════════

### Backend: Global Error Handler (`server/src/middleware/errorHandler.js`)

```javascript
const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.url}:`, err.message);

  // Validation errors
  if (err.type === 'validation')
    return res.status(422).json({ message: 'Validation failed', errors: err.errors });

  // MySQL duplicate entry
  if (err.code === 'ER_DUP_ENTRY')
    return res.status(409).json({ message: 'Record already exists' });

  // JWT errors (shouldn't reach here normally)
  if (err.name === 'JsonWebTokenError')
    return res.status(401).json({ message: 'Invalid token' });

  // Default 500
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : err.message,
  });
};

module.exports = errorHandler;
```

### Frontend: API Error Handling Pattern

```javascript
// In every API call, use this pattern:
try {
  const { data } = await api.post('/submissions', formData);
  toast.success('Submission received!');
} catch (err) {
  const message = err.response?.data?.message || 'Something went wrong';
  toast.error(message);
}
```

---

## ═══════════════════════════════════════════════
## PART 10 — BUILD & DEPLOYMENT INSTRUCTIONS
## ═══════════════════════════════════════════════

### Development Setup (Local)

```bash
# 1. Clone the repo
git clone https://github.com/your-org/ijmcs.git
cd ijmcs

# 2. Set up backend
cd server
npm install
cp .env.example .env
# Edit .env with your values
node -e "require('./src/config/db')"  # Test DB connection

# Run the SQL schema
mysql -u root -p < src/config/schema.sql

# Start backend
npm run dev         # nodemon src/app.js (port 5000)

# 3. Set up frontend (in new terminal)
cd ../client
npm install
cp .env.example .env
npm run dev         # Vite dev server (port 5173)
```

### Production Deployment

```bash
# Backend (on server — runs with PM2)
npm install -g pm2
cd /var/www/ijmcs/server
npm install --production
pm2 start src/app.js --name ijmcs-api
pm2 startup          # Auto-restart on reboot
pm2 save

# Frontend — build and serve via Nginx
cd /var/www/ijmcs/client
npm run build        # Outputs to dist/

# Nginx config for React SPA + API proxy:
# /etc/nginx/sites-available/ijmcs
server {
    listen 443 ssl;
    server_name ignitingmultidisciplinary.ng www.ignitingmultidisciplinary.ng;

    # React SPA
    root /var/www/ijmcs/client/dist;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }

    # API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # File uploads
    location /uploads {
        proxy_pass http://localhost:5000/uploads;
    }

    ssl_certificate /etc/letsencrypt/live/ignitingmultidisciplinary.ng/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ignitingmultidisciplinary.ng/privkey.pem;
}
server {
    listen 80;
    server_name ignitingmultidisciplinary.ng www.ignitingmultidisciplinary.ng;
    return 301 https://$host$request_uri;
}
```

---

## ═══════════════════════════════════════════════
## IMPLEMENTATION ORDER (DO THIS SEQUENCE)
## ═══════════════════════════════════════════════

Follow this exact build order to avoid blockers:

```
PHASE 1 — Foundation (Days 1–3)
  ✅ Set up MySQL database + run schema.sql
  ✅ Scaffold server/ folder + install dependencies
  ✅ Build db.js, env.js, app.js, errorHandler.js
  ✅ Scaffold client/ folder + Vite + Tailwind + Router

PHASE 2 — Auth (Days 4–5)
  ✅ Backend: authController + authRoutes + auth middleware
  ✅ Frontend: LoginPage, RegisterPage, AuthContext, axiosInstance

PHASE 3 — Public Pages (Days 6–8)
  ✅ Backend: article, issue, announcement, settings endpoints
  ✅ Frontend: All 18 static/public pages with real API data

PHASE 4 — Submission Workflow (Days 9–12)
  ✅ Backend: submissionController, fileUpload, emailService
  ✅ Frontend: NewSubmission (multi-step), AuthorDashboard, SubmissionDetail

PHASE 5 — Review Workflow (Days 13–16)
  ✅ Backend: reviewController, editorDecisions, emailTemplates
  ✅ Frontend: EditorDashboard, SubmissionManage, ReviewerDashboard, ReviewSubmission

PHASE 6 — Production & Publishing (Days 17–19)
  ✅ Backend: galley proofs, 48h cron job, issue publishing
  ✅ Frontend: IssueManager, ProductionManager, galley approval flow

PHASE 7 — Payments (Days 20–22)
  ✅ Backend: paymentController, paystackService, flutterwaveService, webhooks
  ✅ Frontend: PaymentPage with Paystack popup + Flutterwave redirect

PHASE 8 — Admin & Polish (Days 23–25)
  ✅ Backend: admin routes, site settings
  ✅ Frontend: AdminDashboard, UserManager, SiteSettings, PaymentLogs
  ✅ Mobile responsiveness pass
  ✅ Security audit (validate all inputs, test webhooks)
  ✅ Go-live checklist
```

---

*End of IJMCS Full Implementation Prompt*
*Stack: React 18 + Node.js + MySQL · Journal: Igniting Journal of Multidisciplinary and Contemporary Studies*
