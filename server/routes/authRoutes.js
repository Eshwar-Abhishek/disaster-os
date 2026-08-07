const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
const db = require('../database/db');
const { 
  JWT_SECRET, 
  authenticateJWT, 
  authenticateToken, 
  victimRegisterSchema, 
  commanderRequestSchema, 
  loginSchema 
} = require('../middleware/auth');

// Victim Registration Endpoint
router.post('/register/victim', (req, res) => {
  try {
    const parseResult = victimRegisterSchema.safeParse(req.body);
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      return res.status(400).json({ error: issue.message });
    }

    const { fullName, email, phone, password, emergencyContact, bloodGroup, location, medicalConditions } = parseResult.data;

    const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const id = randomUUID();
    const password_hash = bcrypt.hashSync(password, 10);

    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, role, phone, is_active, emergency_contact, blood_group, location, medical_conditions)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, fullName, email, password_hash, 'VICTIM', phone, 1, emergencyContact, bloodGroup || null, location || null, medicalConditions || null);

    db.prepare('INSERT INTO security_logs (id, user_email, action, ip, details) VALUES (?, ?, ?, ?, ?)')
      .run(randomUUID(), email, 'VICTIM_REGISTERED', req.ip, 'Victim account created successfully.');

    res.status(201).json({
      message: 'Victim registration successful. Please log in with your credentials.',
      redirectUrl: '/login?tab=victim'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Legacy register endpoint for backward compatibility
router.post('/register', (req, res) => {
  try {
    const { email, password, name, role, region, phone } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required.' });
    }

    const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    const id = randomUUID();
    const password_hash = bcrypt.hashSync(password, 10);
    const userRole = (role || 'VICTIM').toUpperCase();

    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, role, region, phone)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, email, password_hash, userRole, region || 'Global', phone || null);

    const token = jwt.sign({ id, email, name, role: userRole }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id, name, email, role: userRole, phone }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Commander Access Request Endpoint
router.post('/request-commander', (req, res) => {
  try {
    const parseResult = commanderRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      return res.status(400).json({ error: issue.message });
    }

    const { name, officialEmail, phone, govOrg, department, employeeId, designation, region, reason } = parseResult.data;
    const govIdUrl = req.body.govIdUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300';

    // Check if email already registered in users
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(officialEmail);
    if (existingUser) {
      return res.status(400).json({ error: 'An active user account already exists with this official email.' });
    }

    const id = randomUUID();
    db.prepare(`
      INSERT INTO commander_requests (id, name, email, phone, gov_org, department, employee_id, designation, region, reason, gov_id_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, officialEmail, phone, govOrg, department, employeeId, designation, region, reason, govIdUrl);

    db.prepare('INSERT INTO security_logs (id, user_email, action, ip, details) VALUES (?, ?, ?, ?, ?)')
      .run(randomUUID(), officialEmail, 'COMMANDER_ACCESS_REQUESTED', req.ip, `Commander request submitted for ${govOrg}.`);

    res.status(201).json({
      message: 'Commander access request submitted successfully. An Admin will review and verify your government credentials.',
      requestId: id,
      status: 'Pending'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login Endpoint (Supports ADMIN, COMMANDER, VICTIM across all path variations)
router.post(['/login', '/auth/login', '/api/login', '/api/auth/login'], (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. User not found.' });
    }

    if (user.is_active === false || user.is_active === 0) {
      return res.status(403).json({ error: 'Your account has been deactivated by the Administrator.' });
    }

    const match = bcrypt.compareSync(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials. Incorrect password.' });
    }

    const normalizedUserRole = (user.role || 'VICTIM').toUpperCase();

    // Verify requested role tab matches assigned user role if specified
    if (role) {
      const reqRole = role.toUpperCase();
      if (reqRole === 'ADMIN' && normalizedUserRole !== 'ADMIN') {
        return res.status(403).json({ error: 'Access denied. You do not have Admin privileges.' });
      }
      if (reqRole === 'COMMANDER' && (normalizedUserRole !== 'COMMANDER' && normalizedUserRole !== 'ADMIN' && normalizedUserRole !== 'OPERATOR')) {
        return res.status(403).json({ error: 'Access denied. Commander approval required for this portal.' });
      }
      if (reqRole === 'VICTIM' && (normalizedUserRole !== 'VICTIM' && normalizedUserRole !== 'CITIZEN' && normalizedUserRole !== 'ADMIN')) {
        return res.status(403).json({ error: 'Access denied. Invalid portal for this account type.' });
      }
    }

    // Update last login
    const nowIso = new Date().toISOString();
    db.prepare('UPDATE users SET last_login = ? WHERE id = ?').run(nowIso, user.id);

    db.prepare('INSERT INTO security_logs (id, user_email, action, ip, details) VALUES (?, ?, ?, ?, ?)')
      .run(randomUUID(), user.email, 'USER_LOGIN', req.ip, `Login successful as ${normalizedUserRole}`);

    const token = jwt.sign(
      { 
        id: user.id, 
        userId: user.id, 
        email: user.email, 
        full_name: user.full_name || user.name, 
        role: normalizedUserRole 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    let redirectPath = '/victim/dashboard';
    if (normalizedUserRole === 'ADMIN') redirectPath = '/admin/dashboard';
    else if (normalizedUserRole === 'COMMANDER' || normalizedUserRole === 'OPERATOR') redirectPath = '/commander/dashboard';

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        full_name: user.full_name || user.name,
        name: user.name || user.full_name,
        email: user.email,
        role: normalizedUserRole,
        phone: user.phone,
        region: user.region,
        is_active: user.is_active,
        last_login: nowIso
      },
      redirectUrl: redirectPath
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Profile / Current User Endpoint
router.get('/profile', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, full_name, name, email, role, region, phone, is_active, created_at, last_login FROM users WHERE id = ?').get(req.user.id || req.user.userId);
    if (!user) {
      return res.json({
        user: { id: 'admin-seed-id', full_name: 'System Admin', email: 'admin@resq.gov', role: 'ADMIN', region: 'Central Command' }
      });
    }
    res.json({ user: { ...user, role: (user.role || 'VICTIM').toUpperCase() } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
