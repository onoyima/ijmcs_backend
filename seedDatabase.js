const pool = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  console.log('🌱 Starting database seeding process...');

  try {
    // 1. Seed Users (Admin, Editor, Reviewer, Author)
    const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
    let adminId, editorId, reviewerId, authorId;

    if (users[0].count === 0) {
      console.log('Seeding users...');
      const hash = await bcrypt.hash('password123', 10);
      
      const resAdmin = await pool.query('INSERT INTO users (first_name, last_name, email, password_hash, role, institution, country) VALUES (?, ?, ?, ?, ?, ?, ?)', ['Admin', 'User', 'admin@ijmcs.org', hash, 'admin', 'IJMCS', 'Global']);
      adminId = resAdmin[0].insertId;

      const resEditor = await pool.query('INSERT INTO users (first_name, last_name, email, password_hash, role, institution, country) VALUES (?, ?, ?, ?, ?, ?, ?)', ['Jane', 'Editor', 'editor@ijmcs.org', hash, 'editor', 'Oxford University', 'UK']);
      editorId = resEditor[0].insertId;

      const resReviewer = await pool.query('INSERT INTO users (first_name, last_name, email, password_hash, role, institution, country) VALUES (?, ?, ?, ?, ?, ?, ?)', ['John', 'Reviewer', 'reviewer@ijmcs.org', hash, 'reviewer', 'MIT', 'USA']);
      reviewerId = resReviewer[0].insertId;

      const resAuthor = await pool.query('INSERT INTO users (first_name, last_name, email, password_hash, role, institution, country) VALUES (?, ?, ?, ?, ?, ?, ?)', ['Alice', 'Author', 'author@ijmcs.org', hash, 'author', 'Stanford', 'USA']);
      authorId = resAuthor[0].insertId;
    } else {
      console.log('Users table already populated.');
      const [allUsers] = await pool.query('SELECT id, role FROM users');
      adminId = allUsers.find(u => u.role === 'admin')?.id || allUsers[0].id;
      editorId = allUsers.find(u => u.role === 'editor')?.id || allUsers[0].id;
      reviewerId = allUsers.find(u => u.role === 'reviewer')?.id || allUsers[0].id;
      authorId = allUsers.find(u => u.role === 'author')?.id || allUsers[0].id;
    }

    // 2. Seed Announcements
    const [announcements] = await pool.query('SELECT COUNT(*) as count FROM announcements');
    if (announcements[0].count === 0) {
      console.log('Seeding announcements...');
      await pool.query('INSERT INTO announcements (title, body, created_by, is_published) VALUES (?, ?, ?, 1)', 
        ['Call for Papers: Inaugural Issue', 'We are now accepting outstanding manuscripts for our very first Volume. Submit your multi-disciplinary research today!', adminId]);
    }

    // 3. Seed Issues
    const [issues] = await pool.query('SELECT COUNT(*) as count FROM issues');
    let issueId;
    if (issues[0].count === 0) {
      console.log('Seeding issues...');
      const resIssue = await pool.query('INSERT INTO issues (volume, issue_number, year, title, published, published_at) VALUES (?, ?, ?, ?, 1, NOW())', 
        [1, 1, new Date().getFullYear(), 'Inaugural Open Access Issue']);
      issueId = resIssue[0].insertId;
    } else {
      const [allIssues] = await pool.query('SELECT id FROM issues LIMIT 1');
      issueId = allIssues[0].id;
    }

    // 4. Seed Sections
    const [sections] = await pool.query('SELECT COUNT(*) as count FROM sections');
    if (sections[0].count === 0) {
      console.log('Seeding sections...');
      await pool.query('INSERT INTO sections (name, abbrev, policy) VALUES (?, ?, ?)', ['Original Research', 'OR', 'Full length primary research manuscripts']);
      await pool.query('INSERT INTO sections (name, abbrev, policy) VALUES (?, ?, ?)', ['Review Articles', 'RA', 'Comprehensive literature reviews']);
    }

    // 5. Seed Submissions
    const [submissions] = await pool.query('SELECT COUNT(*) as count FROM submissions');
    let submissionId;
    if (submissions[0].count === 0) {
      console.log('Seeding submissions...');
      const resSub = await pool.query('INSERT INTO submissions (author_id, title, abstract, keywords, discipline, status, similarity_score, submitted_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())', 
        [authorId, 'The Future of AI in Multi-Disciplinary Sciences', 'This paper explores how artificial intelligence serves as a bridge connecting computer science, biology, and economic modeling...', 'AI, Multi-Disciplinary, Future', 'Computer Science', 'published', 8]);
      submissionId = resSub[0].insertId;

      // Seed Submission Files
      console.log('Seeding submission files...');
      await pool.query('INSERT INTO submission_files (submission_id, uploader_id, file_type, original_name, stored_name, file_path) VALUES (?, ?, ?, ?, ?, ?)', 
        [submissionId, authorId, 'manuscript', 'manuscript.pdf', 'mock_doc_1.pdf', '/uploads/submissions/mock_doc_1.pdf']);

      // Seed Reviews
      console.log('Seeding reviews...');
      await pool.query('INSERT INTO reviews (submission_id, reviewer_id, assigned_by, status, recommendation, review_body, comments_to_editor, scores_json, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())', 
        [submissionId, reviewerId, editorId, 'completed', 'accept', 'Excellent paper mapping the AI landscape.', 'No major flaws detected across the datasets.', JSON.stringify({ originality: 9, methodology: 8, language: 10 })]);

      // Seed Editor Decisions
      console.log('Seeding editor decisions...');
      await pool.query('INSERT INTO editor_decisions (submission_id, editor_id, decision, decision_note) VALUES (?, ?, ?, ?)', 
        [submissionId, editorId, 'accept', 'Perfect fit for the inaugural issue. Proceeding to publication.']);

      // Seed Payments
      console.log('Seeding payments...');
      await pool.query('INSERT INTO payments (submission_id, user_id, amount, provider, reference, status, paid_at) VALUES (?, ?, ?, ?, ?, ?, NOW())', 
        [submissionId, authorId, 50000, 'paystack', 'mock_pay_123abc', 'completed']);

      // Seed Articles (Published)
      console.log('Seeding published articles...');
      const authorsJson = JSON.stringify([{ name: 'Alice Author', institution: 'Stanford Univ.', orcid: '0000-1111-2222-3333', is_corresponding: true }]);
      await pool.query('INSERT INTO articles (submission_id, issue_id, title, abstract, keywords, authors_json, doi, pages, section_id, view_count, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())', 
        [submissionId, issueId, 'The Future of AI in Multi-Disciplinary Sciences', 'This paper explores how artificial intelligence serves as a bridge connecting computer science, biology, and economic modeling...', 'AI, Multi-Disciplinary, Future', authorsJson, '10.ijmcs/mock-001', '1-14', 1, 142]);
    } else {
      console.log('Submissions and deep relational tables already populated.');
    }

    console.log('✅ Seeding Sequence Complete! All empty tables have been populated with mock data.');

  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    process.exit();
  }
}

seedDatabase();
