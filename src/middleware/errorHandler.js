const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.url}:`, err.message);

  // Validation errors
  if (err.type === 'validation')
    return res.status(422).json({ message: 'Validation failed', errors: err.errors });

  // MySQL duplicate entry
  if (err.code === 'ER_DUP_ENTRY')
    return res.status(409).json({ message: 'Record already exists' });

  // JWT errors
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
