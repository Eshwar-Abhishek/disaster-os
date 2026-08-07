const express = require('express');
const router = express.Router();
const { randomUUID } = require('crypto');
const db = require('../database/db');

// Missing Persons API
router.get('/missing-persons', (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM missing_persons ORDER BY created_at DESC').all();
    res.json({ missingPersons: list });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/missing-persons', (req, res) => {
  try {
    const { name, age, gender, photo_url, last_location, contact_info, details } = req.body;
    const id = randomUUID();
    db.prepare(`
      INSERT INTO missing_persons (id, name, age, gender, photo_url, last_location, contact_info, details)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, age || null, gender || '', photo_url || '', last_location, contact_info, details || '');

    const created = db.prepare('SELECT * FROM missing_persons WHERE id = ?').get(id);
    res.status(201).json({ message: 'Missing person report registered', person: created });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supply Requests API
router.get('/supply-requests', (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM supply_requests ORDER BY created_at DESC').all();
    res.json({ supplyRequests: list });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/supply-requests', (req, res) => {
  try {
    const { incident_id, type, quantity, urgency, requester_name, contact_info, address_or_gps, latitude, longitude } = req.body;
    const id = randomUUID();
    db.prepare(`
      INSERT INTO supply_requests (id, incident_id, type, quantity, urgency, requester_name, contact_info, address_or_gps, latitude, longitude)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, incident_id || null, type, quantity, urgency || 'High', requester_name || 'Anonymous', contact_info, address_or_gps, latitude || 17.3850, longitude || 78.4867);

    const created = db.prepare('SELECT * FROM supply_requests WHERE id = ?').get(id);
    res.status(201).json({ message: 'Supply request submitted', supplyRequest: created });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/supply-requests/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare('UPDATE supply_requests SET status = ? WHERE id = ?').run(status || 'Dispatched', id);
    res.json({ message: `Supply request status updated to ${status || 'Dispatched'}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crowd-Sourced Hazard Reports API
router.get('/hazards', (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM hazard_reports ORDER BY created_at DESC').all();
    res.json({ hazards: list });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/hazards', (req, res) => {
  try {
    const { reporter_name, hazard_type, description, latitude, longitude } = req.body;
    const id = randomUUID();
    db.prepare(`
      INSERT INTO hazard_reports (id, reporter_name, hazard_type, description, latitude, longitude, verified)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `).run(id, reporter_name || 'Citizen Reporter', hazard_type, description || '', latitude, longitude);

    const created = db.prepare('SELECT * FROM hazard_reports WHERE id = ?').get(id);
    res.status(201).json({ message: 'Hazard report recorded', hazard: created });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Notifications API
router.get('/notifications', (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM notifications ORDER BY sent_at DESC LIMIT 50').all();
    res.json({ notifications: list });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI Peer-to-Peer Resource Sharing API (Feature #22)
router.get('/resource-shares', (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM resource_shares ORDER BY created_at DESC').all();
    res.json({ resourceShares: list });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/resource-shares', (req, res) => {
  try {
    const { item_type, description, quantity, location, contact_name, contact_phone } = req.body;
    const id = randomUUID();
    db.prepare(`
      INSERT INTO resource_shares (id, item_type, description, quantity, location, contact_name, contact_phone, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Available', ?)
    `).run(id, item_type, description || '', quantity || '1', location || 'Local Area', contact_name || 'Anonymous Citizen', contact_phone || '', new Date().toISOString());

    const created = db.prepare('SELECT * FROM resource_shares WHERE id = ?').get(id);
    res.status(201).json({ message: 'Resource share registered', resourceShare: created });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
