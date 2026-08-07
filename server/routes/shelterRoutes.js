const express = require('express');
const router = express.Router();
const { randomUUID } = require('crypto');
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

router.get('/', (req, res) => {
  try {
    const shelters = db.prepare('SELECT * FROM shelters ORDER BY (capacity - occupied) DESC').all();
    res.json({ shelters });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticateToken, (req, res) => {
  try {
    const { name, capacity, occupied, latitude, longitude, address, food_available, water_available, medical_support, pet_friendly, wheelchair_accessible } = req.body;
    const id = randomUUID();

    db.prepare(`
      INSERT INTO shelters (id, name, capacity, occupied, latitude, longitude, address, food_available, water_available, medical_support, pet_friendly, wheelchair_accessible)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, capacity || 500, occupied || 0, latitude || 17.385, longitude || 78.486, address || '', food_available ? 1 : 0, water_available ? 1 : 0, medical_support ? 1 : 0, pet_friendly ? 1 : 0, wheelchair_accessible ? 1 : 0);

    const created = db.prepare('SELECT * FROM shelters WHERE id = ?').get(id);
    res.status(201).json({ message: 'Shelter registered', shelter: created });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
