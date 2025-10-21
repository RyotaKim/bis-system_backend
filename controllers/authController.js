const User = require('../models/User');
const authService = require('../services/authService');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await authService.comparePassword(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = authService.generateToken(user._id, user.role);
    res.json({ 
      message: 'Login successful',
      token, 
      user: { id: user._id, name: user.name, role: user.role, username: user.username } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password, name, contactNumber } = req.body;

    if (!username || !password || !name) {
      return res.status(400).json({ message: 'Username, password, and name required' });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const passwordHash = await authService.hashPassword(password);
    const user = new User({ username, passwordHash, name, contactNumber, role: 'admin' });
    await user.save();

    res.status(201).json({ message: 'Admin user created', user: { id: user._id, name: user.name, username: user.username } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
