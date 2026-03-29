const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// Ensure upload directories exist
const uploadDir = path.join(__dirname, '../../uploads/submissions');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.docx', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only .docx and .pdf manuscripts are accepted.'), false);
  }
};

// No file size limit — manuscripts can be large
const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

module.exports = upload;
