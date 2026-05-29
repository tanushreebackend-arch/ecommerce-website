const jwt = require('jsonwebtoken');

const authUser = (req, res, next) => {
  const token = req.cookies?.userToken || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_USER_SECRET || process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const authAdmin = (req, res, next) => {
  const token = req.cookies?.adminToken || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Admin authentication required' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET || process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired admin token' });
  }
};

const optionalAuth = (req, res, next) => {
  const token = req.cookies?.userToken || req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      req.user = jwt.verify(token, process.env.JWT_USER_SECRET || process.env.JWT_SECRET);
    } catch {
      // ignore invalid token
    }
  }
  next();
};

module.exports = { authUser, authAdmin, optionalAuth };
