const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  if (req.user.role !== 'admin' && !roles.includes(req.user.role))
    return res.status(403).json({ message: `Access restricted to: ${roles.join(', ')}` });
  next();
};

module.exports = { requireRole };
