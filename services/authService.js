const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

exports.comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

exports.generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1d' });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
};
