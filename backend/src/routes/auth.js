const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, confirmPassword, organizationName } = req.body;

    if (!email || !password || !organizationName)
      return res.status(400).json({ error: 'Email, password, and organization name are required.' });

    if (password !== confirmPassword)
      return res.status(400).json({ error: 'Passwords do not match.' });

    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already registered.' });

    const org = await prisma.organization.create({
      data: { name: organizationName },
    });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash, organizationId: org.id },
    });

    const token = jwt.sign(
      { userId: user.id, organizationId: org.id, orgName: org.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, orgName: org.name, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during signup.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required.' });

    const user = await prisma.user.findUnique({
      where: { email },
      include: { organization: true },
    });

    if (!user) return res.status(401).json({ error: 'Invalid email or password.' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password.' });

    const token = jwt.sign(
      { userId: user.id, organizationId: user.organizationId, orgName: user.organization.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, orgName: user.organization.name, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

module.exports = router;
