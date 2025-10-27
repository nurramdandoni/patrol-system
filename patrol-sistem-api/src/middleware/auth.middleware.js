const jwtUtils = require('../utils/jwt');

exports.verifyAuth = (req, res, next) => {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token tidak ditemukan' });
  }

  const token = header.split(' ')[1];
  const payload = jwtUtils.verifyToken(token);

  if (!payload) {
    return res.status(403).json({ message: 'Token tidak valid atau kadaluarsa' });
  }

  req.user = payload; // inject user ke request
  next();
};
