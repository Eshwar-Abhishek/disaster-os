const express = require('express');
const router = express.Router();
const { randomUUID } = require('crypto');
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

router.get('/', (req, res) => {
  try {
    const resources = db.prepare('SELECT * FROM resources ORDER BY name ASC').all();
    res.json({ resources });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticateToken, (req, res) => {
  try {
    const { type, name, capacity, current_lat, current_lng, operator_name } = req.body;
    const id = randomUUID();
    db.prepare(`
      INSERT INTO resources (id, type, name, status, capacity, current_lat, current_lng, operator_name)
      VALUES (?, ?, ?, 'Available', ?, ?, ?, ?)
    `).run(id, type, name, capacity || 5, current_lat || 17.385, current_lng || 78.486, operator_name || 'Unit Operator');

    const created = db.prepare('SELECT * FROM resources WHERE id = ?').get(id);
    res.status(201).json({ message: 'Resource unit registered', resource: created });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { status, assigned_incident_id, current_lat, current_lng } = req.body;
    db.prepare(`
      UPDATE resources
      SET status = COALESCE(?, status),
          assigned_incident_id = ?,
          current_lat = COALESCE(?, current_lat),
          current_lng = COALESCE(?, current_lng),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, assigned_incident_id !== undefined ? assigned_incident_id : null, current_lat, current_lng, req.params.id);

    const updated = db.prepare('SELECT * FROM resources WHERE id = ?').get(req.params.id);
    res.json({ message: 'Resource status updated', resource: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
