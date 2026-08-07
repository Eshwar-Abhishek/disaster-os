const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');
const db = require('../database/db');
const { authenticateJWT, requireAdmin } = require('../middleware/auth');

// Protect all admin routes with JWT and Admin role
router.use(authenticateJWT, requireAdmin);

// GET /api/admin/commander-requests
router.get('/commander-requests', (req, res) => {
  try {
    const requests = db.prepare('SELECT * FROM commander_requests').all();
    res.json({ requests: requests || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/commander-requests/:id/approve
router.post('/commander-requests/:id/approve', (req, res) => {
  try {
    const { id } = req.params;
    const reqObj = db.prepare('SELECT * FROM commander_requests WHERE id = ?').get(id);
    if (!reqObj) {
      return res.status(404).json({ error: 'Commander request not found.' });
    }

    if (reqObj.status === 'Approved') {
      return res.status(400).json({ error: 'Request already approved.' });
    }

    // Check if user already exists
    const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(reqObj.email);
    let userId = existing ? existing.id : randomUUID();

    if (!existing) {
      // Default initial temp password for approved commander
      const tempPass = req.body.initialPassword || 'commander123';
      const password_hash = bcrypt.hashSync(tempPass, 10);

      db.prepare(`
        INSERT INTO users (id, full_name, name, email, password_hash, role, phone, is_active, region)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(userId, reqObj.name, reqObj.name, reqObj.email, password_hash, 'COMMANDER', reqObj.phone, 1, reqObj.region || 'Central');
    } else {
      // Update role to COMMANDER
      db.prepare('UPDATE users SET role = ? WHERE id = ?').run('COMMANDER', userId);
    }

    // Mark request as Approved
    db.prepare('UPDATE commander_requests SET status = ? WHERE id = ?').run('Approved', id);

    // Audit log
    db.prepare('INSERT INTO audit_logs (id, action, performed_by, details) VALUES (?, ?, ?, ?)')
      .run(randomUUID(), 'COMMANDER_APPROVED', req.user.full_name || req.user.email, `Approved Commander access for ${reqObj.name} (${reqObj.email}).`);

    res.json({
      message: `Commander request approved successfully. Account generated for ${reqObj.name}.`,
      userEmail: reqObj.email
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/commander-requests/:id/reject
router.post('/commander-requests/:id/reject', (req, res) => {
  try {
    const { id } = req.params;
    const reqObj = db.prepare('SELECT * FROM commander_requests WHERE id = ?').get(id);
    if (!reqObj) {
      return res.status(404).json({ error: 'Commander request not found.' });
    }

    db.prepare('UPDATE commander_requests SET status = ? WHERE id = ?').run('Rejected', id);

    db.prepare('INSERT INTO audit_logs (id, action, performed_by, details) VALUES (?, ?, ?, ?)')
      .run(randomUUID(), 'COMMANDER_REJECTED', req.user.full_name || req.user.email, `Rejected Commander request for ${reqObj.name} (${reqObj.email}).`);

    res.json({ message: `Commander request for ${reqObj.name} rejected.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/users
router.get('/users', (req, res) => {
  try {
    const users = db.prepare('SELECT id, full_name, name, email, role, phone, is_active, created_at, last_login, region FROM users').all();
    res.json({ users: users || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/admin/users/:id/toggle-active
router.patch('/users/:id/toggle-active', (req, res) => {
  try {
    const { id } = req.params;
    const targetUser = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (targetUser.email === 'admin@resq.gov' || targetUser.role === 'ADMIN') {
      return res.status(403).json({ error: 'Root System Admin account cannot be deactivated.' });
    }

    const newActiveState = targetUser.is_active ? 0 : 1;
    db.prepare('UPDATE users SET is_active = ? WHERE id = ?').run(newActiveState, id);

    const actionText = newActiveState ? 'USER_ACTIVATED' : 'USER_DEACTIVATED';
    db.prepare('INSERT INTO audit_logs (id, action, performed_by, details) VALUES (?, ?, ?, ?)')
      .run(randomUUID(), actionText, req.user.full_name || req.user.email, `Toggled active state for ${targetUser.email} to ${newActiveState}.`);

    res.json({
      message: `User ${targetUser.email} status updated to ${newActiveState ? 'Active' : 'Deactivated'}.`,
      is_active: Boolean(newActiveState)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const targetUser = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (targetUser.email === 'admin@resq.gov') {
      return res.status(403).json({ error: 'Root System Admin account cannot be deleted.' });
    }

    db.prepare('DELETE FROM users WHERE id = ?').run(id);

    db.prepare('INSERT INTO audit_logs (id, action, performed_by, details) VALUES (?, ?, ?, ?)')
      .run(randomUUID(), 'USER_DELETED', req.user.full_name || req.user.email, `Deleted user account ${targetUser.email}.`);

    res.json({ message: `User account ${targetUser.email} permanently deleted.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/security-logs
router.get('/security-logs', (req, res) => {
  try {
    const logs = db.prepare('SELECT * FROM security_logs').all();
    res.json({ logs: logs || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/audit-logs
router.get('/audit-logs', (req, res) => {
  try {
    const logs = db.prepare('SELECT * FROM audit_logs').all();
    res.json({ logs: logs || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/system-health
router.get('/system-health', (req, res) => {
  try {
    const mongoose = require('mongoose');
    const isMongoConnected = mongoose.connection.readyState === 1;

    const userCount = db.prepare('SELECT count(*) as cnt FROM users').get().cnt;
    const incidentCount = db.prepare('SELECT count(*) as cnt FROM incidents').get().cnt;
    const pendingRequests = db.prepare("SELECT count(*) as cnt FROM commander_requests WHERE status = 'Pending'").get().cnt;

    res.json({
      health: 'OPTIMAL',
      uptime: process.uptime(),
      database: isMongoConnected ? 'MongoDB Atlas Cluster0 (CONNECTED & LIVE)' : 'In-Memory JSON Store (Synced)',
      mongo_atlas_connected: isMongoConnected,
      active_connections: 1,
      total_registered_users: userCount,
      total_incidents: incidentCount,
      pending_commander_requests: pendingRequests,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
