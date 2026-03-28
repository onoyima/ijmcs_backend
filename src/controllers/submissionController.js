const pool = require('../config/db');

const submissionController = {
  // POST /api/submissions (Create initial submission)
  create: async (req, res, next) => {
    try {
      const { title, abstract, keywords, discipline } = req.body;
      const author_id = req.user.id;
      
      const [result] = await pool.query(
        'INSERT INTO submissions (author_id, title, abstract, keywords, discipline, status) VALUES (?, ?, ?, ?, ?, "pending_payment")',
        [author_id, title, abstract, keywords, discipline]
      );
      
      res.status(201).json({ 
        message: 'Submission draft created', 
        submission_id: result.insertId 
      });
    } catch (err) { next(err); }
  },

  // PATCH /api/submissions/:id/draft — Update metadata while still in pending_payment
  updateDraft: async (req, res, next) => {
    try {
      const { title, abstract, keywords, discipline } = req.body;
      const { id } = req.params;
      const author_id = req.user.id;

      // Only allow editing if still a draft (pending_payment)
      const [rows] = await pool.query(
        'SELECT status FROM submissions WHERE id = ? AND author_id = ?',
        [id, author_id]
      );
      if (!rows.length) return res.status(404).json({ message: 'Submission not found' });
      if (rows[0].status !== 'pending_payment') {
        return res.status(403).json({ message: 'Submission can no longer be edited at this stage.' });
      }

      await pool.query(
        'UPDATE submissions SET title = ?, abstract = ?, keywords = ?, discipline = ?, updated_at = NOW() WHERE id = ? AND author_id = ?',
        [title, abstract, keywords, discipline, id, author_id]
      );

      res.json({ message: 'Draft updated successfully' });
    } catch (err) { next(err); }
  },

  // POST /api/submissions/:id/upload
  uploadFile: async (req, res, next) => {
    try {
      if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
      
      // NEW SECURITY GUARD: Verify payment Before allowing file upload
      const [submission] = await pool.query('SELECT status, is_paid FROM submissions WHERE id = ?', [req.params.id]);
      if (!submission.length || (!submission[0].is_paid && submission[0].status === 'pending_payment')) {
        return res.status(403).json({ message: 'Payment of the APC is required before uploading the manuscript.' });
      }

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
      
      // MOCK EXTERNAL SYSTEM: Turnitin / iThenticate Plagiarism Check
      const submissionId = req.params.id;
      setTimeout(async () => {
        try {
           const mockScore = Math.floor(Math.random() * 15) + 5; // Simulates 5% to 20% similarity
           await pool.query('UPDATE submissions SET similarity_score = ? WHERE id = ?', [mockScore, submissionId]);
           console.log(`[Turnitin Webhook Mock] Submission ${submissionId} Scanned. Similarity: ${mockScore}%`);
        } catch(e) {}
      }, 5000); // 5 second mock processing delay
      
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
  },

  // Editor Only: POST /api/submissions/:id/decide
  editorDecision: async (req, res, next) => {
    try {
      const { decision } = req.body; // 'accepted' or 'rejected'
      if (!['accepted', 'rejected'].includes(decision)) {
        return res.status(400).json({ message: 'Invalid decision' });
      }

      await pool.query('UPDATE submissions SET status = ?, decision_at = NOW() WHERE id = ?', [decision, req.params.id]);
      
      res.json({ message: `Submission marked as ${decision}` });
    } catch (err) { next(err); }
  },

  // Editor Only: POST /api/submissions/:id/publish
  publishArticle: async (req, res, next) => {
    try {
      const { issue_id, pages, doi } = req.body;
      const submission_id = req.params.id;

      if (!issue_id) return res.status(400).json({ message: 'A Target Issue ID is required for publication.' });

      // Ensure the submission is accepted first
      const [submissions] = await pool.query('SELECT * FROM submissions WHERE id = ?', [submission_id]);
      if (!submissions.length) return res.status(404).json({ message: 'Submission not found' });
      const sub = submissions[0];

      if (sub.status !== 'accepted' && sub.status !== 'galley_approved') {
        return res.status(400).json({ message: 'Submission must be accepted before publishing' });
      }

      // Fetch authors_json (author info)
      const [users] = await pool.query('SELECT first_name, last_name, institution, country, orcid FROM users WHERE id = ?', [sub.author_id]);
      const authorInfo = users[0];
      const authors_json = JSON.stringify([{
        name: `${authorInfo.first_name} ${authorInfo.last_name}`,
        institution: authorInfo.institution,
        orcid: authorInfo.orcid,
        is_corresponding: true
      }]);

      // Generate mock DOI if not provided
      const finalDoi = doi || `10.ijmcs/${new Date().getFullYear()}/${submission_id}`;

      // Insert into articles table
      const [result] = await pool.query(
        `INSERT INTO articles (submission_id, issue_id, title, abstract, keywords, authors_json, doi, pages, published_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [submission_id, issue_id, sub.title, sub.abstract, sub.keywords, authors_json, finalDoi, pages]
      );

      // Update submission status to published
      await pool.query('UPDATE submissions SET status = "published" WHERE id = ?', [submission_id]);
      const article_id = result.insertId;

      // Auto-Generate PDF Galley Proof
      try {
        const { generateArticlePDF } = require('../utils/pdfGenerator');
        const fileName = `ijmcs_galley_${article_id}_${Date.now()}.pdf`;
        const destPath = require('path').join(__dirname, '../../uploads/submissions', fileName);
        
        // Fetch Issue Details for PDF Header
        const [issues] = await pool.query('SELECT volume, number, year FROM issues WHERE id = ?', [issue_id]);
        const issueData = issues.length ? issues[0] : { volume: 1, number: 1, year: new Date().getFullYear() };
        
        await generateArticlePDF({
          title: sub.title,
          abstract: sub.abstract,
          keywords: sub.keywords,
          authors_json: authors_json,
          doi: finalDoi,
          issue_volume: issueData.volume,
          issue_number: issueData.number, 
          issue_year: issueData.year
        }, destPath);

        const pdfUrl = `/uploads/submissions/${fileName}`;
        await pool.query('UPDATE articles SET galley_pdf_url = ? WHERE id = ?', [pdfUrl, article_id]);
        console.log(`Auto-generated PDF Galley successfully for Article ${article_id}`);
        
        // MOCK EXTERNAL SYSTEM: Crossref API XML Payload
        const crossrefXml = `
<doi_batch xmlns="http://www.crossref.org/schema/4.4.2" version="4.4.2">
  <head><doi_batch_id>ijmcs_${article_id}_${Date.now()}</doi_batch_id><timestamp>${Date.now()}</timestamp></head>
  <body>
    <journal>
      <journal_metadata><full_title>Igniting Journal of Multidisciplinary and Contemporary Studies</full_title></journal_metadata>
      <journal_article publication_type="full_text">
        <titles><title>${sub.title}</title></titles>
        <doi_data><doi>${finalDoi}</doi><resource>https://ijmcs.org/article/${article_id}</resource></doi_data>
      </journal_article>
    </journal>
  </body>
</doi_batch>`;
        console.log(`[Crossref API Mock] Minting Official DOI payload sent to Crossref: ${finalDoi}\n${crossrefXml}`);
        
      } catch (pdfErr) {
        console.error('Galley Generation Failed:', pdfErr);
      }

      res.status(201).json({ message: 'Article Published Live with Automated PDF Galley!', article_id });
    } catch (err) { next(err); }
  }
};

module.exports = submissionController;
