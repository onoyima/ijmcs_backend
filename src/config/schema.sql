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
  discipline        VARCHAR(100),
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
