const express = require('express');
const router = express.Router();
const IncidentDetectionAgent = require('../agents/IncidentDetectionAgent');
const RiskAssessmentAgent = require('../agents/RiskAssessmentAgent');
const MissionPlannerAgent = require('../agents/MissionPlannerAgent');
const ResourceAllocationAgent = require('../agents/ResourceAllocationAgent');
const RoutePlanningAgent = require('../agents/RoutePlanningAgent');
const HospitalAvailabilityAgent = require('../agents/HospitalAvailabilityAgent');
const CitizenCommunicationAgent = require('../agents/CitizenCommunicationAgent');
const SituationReportAgent = require('../agents/SituationReportAgent');
const CommanderAgent = require('../agents/CommanderAgent');
const ShelterRecommendationAgent = require('../agents/ShelterRecommendationAgent');
const db = require('../database/db');

router.post('/detect', async (req, res) => {
  try {
    const result = await IncidentDetectionAgent.process(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/risk', async (req, res) => {
  try {
    const result = await RiskAssessmentAgent.process(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/plan', async (req, res) => {
  try {
    const result = await MissionPlannerAgent.process(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/resources', async (req, res) => {
  try {
    const availableResources = db.prepare("SELECT * FROM resources WHERE status = 'Available'").all();
    const result = await ResourceAllocationAgent.process(req.body, availableResources);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/routes', async (req, res) => {
  try {
    const hazardReports = db.prepare("SELECT * FROM hazard_reports").all();
    const result = await RoutePlanningAgent.process(req.body, hazardReports);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/hospital', async (req, res) => {
  try {
    const hospitalData = db.prepare("SELECT * FROM hospitals").all();
    const result = await HospitalAvailabilityAgent.process(req.body, hospitalData);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/shelter', async (req, res) => {
  try {
    const sheltersList = db.prepare("SELECT * FROM shelters").all();
    const result = await ShelterRecommendationAgent.process(req.body, sheltersList);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/notify', async (req, res) => {
  try {
    const result = await CitizenCommunicationAgent.process(req.body, req.body.languages || ['en', 'hi', 'te']);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/report', async (req, res) => {
  try {
    const telemetry = {
      incidents: db.prepare("SELECT COUNT(*) as cnt FROM incidents").get().cnt,
      resources: db.prepare("SELECT COUNT(*) as cnt FROM resources").get().cnt,
      hospitals: db.prepare("SELECT COUNT(*) as cnt FROM hospitals").get().cnt,
      shelters: db.prepare("SELECT COUNT(*) as cnt FROM shelters").get().cnt
    };
    const result = await SituationReportAgent.process(telemetry);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/command', async (req, res) => {
  try {
    const incidentData = req.body.incident || req.body;
    const orchestration = await CommanderAgent.orchestrate(incidentData, req.body.triggerSource || 'Manual Operator Trigger');
    res.json(orchestration);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function safeJsonParse(val, fallback = []) {
  if (!val) return fallback;
  if (typeof val !== 'string') return val;
  try {
    return JSON.parse(val);
  } catch (e) {
    return fallback;
  }
}

router.get('/decisions', (req, res) => {
  try {
    const decisions = db.prepare('SELECT * FROM ai_decisions ORDER BY created_at DESC LIMIT 50').all();
    const formatted = decisions.map(d => ({
      ...d,
      recommendations: safeJsonParse(d.recommendations, []),
      assigned_agents: safeJsonParse(d.assigned_agents, []),
      conflicts_resolved: safeJsonParse(d.conflicts_resolved, [])
    }));
    res.json({ decisions: formatted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
