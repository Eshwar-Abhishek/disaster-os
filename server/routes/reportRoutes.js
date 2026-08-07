const express = require('express');
const router = express.Router();
const { randomUUID } = require('crypto');
const db = require('../database/db');
const SituationReportAgent = require('../agents/SituationReportAgent');

router.get('/', (req, res) => {
  try {
    const reports = db.prepare('SELECT * FROM situation_reports ORDER BY created_at DESC').all();
    res.json({ reports });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/sitrep', async (req, res) => {
  try {
    const incident_count = db.prepare("SELECT COUNT(*) as cnt FROM incidents").get().cnt;
    const active_rescues = db.prepare("SELECT COUNT(*) as cnt FROM incidents WHERE status IN ('Reported', 'Responding')").get().cnt;
    const deployed_resources = db.prepare("SELECT COUNT(*) as cnt FROM resources WHERE status = 'Deployed'").get().cnt;
    const estimated_casualties = db.prepare("SELECT SUM(casualties) as sum FROM incidents").get().sum || 0;

    const telemetry = { incident_count, active_rescues, deployed_resources, estimated_casualties };

    const aiSitrep = await SituationReportAgent.process(telemetry);

    const id = randomUUID();
    const title = `EOC Executive Situation Report #${Math.floor(Math.random() * 900 + 100)}`;

    db.prepare(`
      INSERT INTO situation_reports (id, title, incident_count, active_rescues, deployed_resources, estimated_casualties, summary, executive_notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, title, incident_count, active_rescues, deployed_resources, estimated_casualties, aiSitrep.summary, aiSitrep.reasoning);

    const created = db.prepare('SELECT * FROM situation_reports WHERE id = ?').get(id);

    res.status(201).json({ message: 'Executive SitRep generated', report: created, aiSitrep });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
