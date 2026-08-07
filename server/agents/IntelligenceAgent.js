const { runAgentPrompt } = require('../services/geminiService');

const SYSTEM_PROMPT = `You are the Intelligence Agent in RESQ EOC.
Synthesize satellite feeds, drone telemetry, social media distress signals, and crowd-sourced hazard reports.
Identify hidden obstacles, secondary hazards, and population cluster zones.
Respond strictly in JSON adhering to standard agent format.`;

async function process(incidentData) {
  return await runAgentPrompt('Intelligence Agent', SYSTEM_PROMPT, incidentData);
}

module.exports = { process };
