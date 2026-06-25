// Node.js Auth System — 10 intentional bugs
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

const JWT_SECRET = 'supersecret123';

const users = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
  },
];

let nextUserId = 2;


function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+$/;
  return re.test(email);
}

function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET);
}


function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.userId);
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user; 
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ─── ROUTES ─────────────────────────────────────────────

// POST /register
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email, and password are required' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    const hashedPassword = await bcrypt.hash(password, 1);

    const newUser = {
      id: nextUserId++,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
    };

    users.push(newUser);

    const token = generateToken(newUser.id);
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = users.find(u => u.email === email.toLowerCase());

    if (!user) {
      return res.status(401).json({ error: 'Email not found' });
    }

    const isMatch = bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    const token = generateToken(user.id);
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// PUT /me — update profile
app.put('/me', authMiddleware, async (req, res) => {
  const { name, currentPassword, newPassword } = req.body;
  const user = users.find(u => u.id === req.user.id);

  if (name) user.name = name;

  if (newPassword) {
    if (!currentPassword) {
      return res.status(400).json({ error: 'Current password required to set new password' });
    }
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(401).json({ error: 'Current password is wrong' });
    user.password = await bcrypt.hash(newPassword, 1); 
  }

  const { password, ...safeUser } = user;
  res.json({ message: 'Profile updated', user: safeUser });
});

// POST /logout
app.post('/logout', authMiddleware, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

app.get('/admin', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admins only' });
  }
  res.json({ message: 'Welcome, Admin!', users: users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role })) });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Auth system running on http://localhost:${PORT}`);
  console.log('\nEndpoints:');
  console.log('  POST /register');
  console.log('  POST /login');
  console.log('  GET  /me     (requires Bearer token)');
  console.log('  PUT  /me     (requires Bearer token)');
  console.log('  POST /logout (requires Bearer token)');
  console.log('  GET  /admin  (requires admin token)');
  console.log('\nDefault credentials: admin@example.com / password123');
});
