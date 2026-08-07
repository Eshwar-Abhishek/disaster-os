const { runAgentPrompt } = require('../services/geminiService');

const SYSTEM_PROMPT = `You are the Route Planning Agent in RESQ EOC.
Calculate safe evacuation and rescue corridors. Avoid flooded streets, collapsed bridges, fire perimeters, and gas plumes.
Ensure dynamic rerouting when real-time hazards block standard paths.
Respond strictly in JSON adhering to standard agent format.`;

async function process(incidentData, hazardReports) {
  const payload = { ...incidentData, hazardReports };
  return await runAgentPrompt('Route Planning Agent', SYSTEM_PROMPT, payload);
}

module.exports = { process };
