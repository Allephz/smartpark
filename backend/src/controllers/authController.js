
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { Op } = require('sequelize');

const register = async (req, res) => {
  try {

    // Ambil email dan password dari request
    const { email, password } = req.body;
    const username = email; // username diisi sama dengan email

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const user = await User.create({
      username,
      email,
      password
    });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

const login = async (req, res) => {
  try {
    // Accept either username or email in the same field (frontend sends 'username')
  const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username/email and password are required' });
    }

    // Try to find user by username OR email
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username },
          { email: username }
        ]
      }
    });

    // Validasi role jika dikirim dari frontend
    if (role && user && user.role !== role) {
      return res.status(403).json({ message: `Akun dengan role ${user.role} tidak bisa login sebagai ${role}` });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordOk = await user.checkPassword(password);
    if (!passwordOk) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

module.exports = {
  register,
  login
};