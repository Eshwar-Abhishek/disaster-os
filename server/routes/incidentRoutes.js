const express = require('express');
const router = express.Router();
const { randomUUID } = require('crypto');
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');
const CommanderAgent = require('../agents/CommanderAgent');

function safeJsonParse(val, fallback = []) {
  if (!val) return fallback;
  if (typeof val !== 'string') return val;
  try {
    return JSON.parse(val);
  } catch (e) {
    return fallback;
  }
}

router.get('/', (req, res) => {
  try {
    const incidents = db.prepare('SELECT * FROM incidents ORDER BY created_at DESC').all();
    const formatted = incidents.map(inc => ({
      ...inc,
      photos: safeJsonParse(inc.photos, []),
      videos: safeJsonParse(inc.videos, []),
    }));
    res.json({ incidents: formatted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const inc = db.prepare('SELECT * FROM incidents WHERE id = ?').get(req.params.id);
    if (!inc) return res.status(404).json({ error: 'Incident not found' });
    inc.photos = safeJsonParse(inc.photos, []);
    inc.videos = safeJsonParse(inc.videos, []);
    res.json({ incident: inc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { type, title, description, latitude, longitude, address, severity, photos, videos, casualties } = req.body;

    if (!type || !description || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Missing required incident fields.' });
    }

    const id = randomUUID();
    const incTitle = title || `${type} Emergency at ${address || 'Target Location'}`;
    const incSev = severity || 'High';
    const photosJson = JSON.stringify(photos || []);
    const videosJson = JSON.stringify(videos || []);
    const reporterName = req.user ? req.user.name : 'Anonymous Citizen';

    db.prepare(`
      INSERT INTO incidents (id, type, title, description, latitude, longitude, address, status, severity, reported_by, verified_by_ai, photos, videos, casualties)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, 
      type, 
      incTitle, 
      description, 
      parseFloat(latitude), 
      parseFloat(longitude), 
      address || 'Coordinates Recorded', 
      'Reported', 
      incSev, 
      reporterName, 
      1, 
      photosJson, 
      videosJson, 
      parseInt(casualties) || 0
    );

    const createdIncident = db.prepare('SELECT * FROM incidents WHERE id = ?').get(id);
    createdIncident.photos = safeJsonParse(createdIncident.photos, []);
    createdIncident.videos = safeJsonParse(createdIncident.videos, []);

    // Trigger Autonomous Multi-Agent Commander Cycle
    const orchestrationResult = await CommanderAgent.orchestrate(createdIncident, 'Citizen Incident Report');

    // Notify connected Socket.IO clients if available
    const io = req.app.get('io');
    if (io) {
      io.emit('incident:created', { incident: createdIncident, aiDecision: orchestrationResult.commanderDecision });
      io.emit('agent:activity', { agentName: 'Commander Agent', decision: orchestrationResult.commanderDecision });
    }

    res.status(201).json({
      message: 'Incident reported and multi-agent AI pipeline executed',
      incident: createdIncident,
      aiOrchestration: orchestrationResult
    });
  } catch (err) {
    console.error('Incident Creation Error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { status, severity, casualties, description } = req.body;
    const existing = db.prepare('SELECT * FROM incidents WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Incident not found' });

    db.prepare(`
      UPDATE incidents
      SET status = COALESCE(?, status),
          severity = COALESCE(?, severity),
          casualties = COALESCE(?, casualties),
          description = COALESCE(?, description),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, severity, casualties, description, req.params.id);

    const updated = db.prepare('SELECT * FROM incidents WHERE id = ?').get(req.params.id);
    updated.photos = safeJsonParse(updated.photos, []);
    updated.videos = safeJsonParse(updated.videos, []);

    // Re-trigger Commander Replanning Cycle on status/severity update
    const orchestrationResult = await CommanderAgent.orchestrate(updated, 'Condition Change / Operator Update');

    const io = req.app.get('io');
    if (io) {
      io.emit('incident:updated', { incident: updated, aiDecision: orchestrationResult.commanderDecision });
    }

    res.json({ message: 'Incident updated & Commander replanned', incident: updated, aiOrchestration: orchestrationResult });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticateToken, (req, res) => {
  try {
    db.prepare('DELETE FROM incidents WHERE id = ?').run(req.params.id);
    res.json({ message: 'Incident deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
