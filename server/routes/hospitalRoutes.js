const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

router.get('/', (req, res) => {
  try {
    const hospitals = db.prepare('SELECT * FROM hospitals ORDER BY available_beds DESC').all();
    res.json({ hospitals });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { available_beds, icu_beds, status } = req.body;
    db.prepare(`
      UPDATE hospitals
      SET available_beds = COALESCE(?, available_beds),
          icu_beds = COALESCE(?, icu_beds),
          status = COALESCE(?, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(available_beds, icu_beds, status, req.params.id);

    const updated = db.prepare('SELECT * FROM hospitals WHERE id = ?').get(req.params.id);
    res.json({ message: 'Hospital capacity updated', hospital: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
