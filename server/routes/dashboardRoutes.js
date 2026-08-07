const express = require('express');
const router = express.Router();
const db = require('../database/db');

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
    const incidents = db.prepare('SELECT * FROM incidents ORDER BY created_at DESC LIMIT 10').all().map(i => ({
      ...i,
      photos: safeJsonParse(i.photos, []),
      videos: safeJsonParse(i.videos, [])
    }));
    const totalIncidents = db.prepare('SELECT COUNT(*) as cnt FROM incidents').get().cnt;
    const activeRescues = db.prepare("SELECT COUNT(*) as cnt FROM incidents WHERE status IN ('Reported', 'Responding')").get().cnt;
    const totalCasualties = db.prepare('SELECT SUM(casualties) as sum FROM incidents').get().sum || 0;

    const resources = db.prepare('SELECT * FROM resources').all();
    const deployedResources = resources.filter(r => r.status === 'Deployed').length;

    const hospitals = db.prepare('SELECT * FROM hospitals').all();
    const totalBeds = hospitals.reduce((acc, h) => acc + h.total_beds, 0);
    const availBeds = hospitals.reduce((acc, h) => acc + h.available_beds, 0);
    const hospitalOccupancyPct = totalBeds > 0 ? Math.round(((totalBeds - availBeds) / totalBeds) * 100) : 0;

    const shelters = db.prepare('SELECT * FROM shelters').all();
    const notifications = db.prepare('SELECT * FROM notifications ORDER BY sent_at DESC LIMIT 10').all();
    const latestDecisions = db.prepare('SELECT * FROM ai_decisions ORDER BY created_at DESC LIMIT 5').all().map(d => ({
      ...d,
      recommendations: safeJsonParse(d.recommendations, []),
      assigned_agents: safeJsonParse(d.assigned_agents, []),
      conflicts_resolved: safeJsonParse(d.conflicts_resolved, [])
    }));

    res.json({
      metrics: {
        totalIncidents,
        activeRescues,
        deployedResources,
        totalCasualties,
        hospitalOccupancyPct,
        availableBeds: availBeds,
        totalBeds
      },
      incidents,
      resources,
      hospitals,
      shelters,
      notifications,
      aiDecisions: latestDecisions
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/sync-live', async (req, res) => {
  try {
    const { fetchRealTimeEarthquakes } = require('../services/liveDataService');
    const newEvents = await fetchRealTimeEarthquakes();
    const io = req.app.get('io');
    if (io) {
      io.emit('dashboard:refresh');
    }
    res.json({ message: 'Live USGS Seismic Feed Synchronized', count: newEvents.length, newEvents });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
