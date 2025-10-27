const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

/**
 * Generate JWT token
 * @param {Object} payload - Data yang mau disimpan di token (misal: { id, username, role })
 * @returns {String} JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verify JWT token
 * @param {String} token - Token dari header
 * @returns {Object|null} Payload kalau valid, null kalau invalid
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

/**
 * Decode tanpa verifikasi (misal cuma mau baca payload)
 * @param {String} token
 * @returns {Object|null}
 */
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (err) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
};
