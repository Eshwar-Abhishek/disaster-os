const { runAgentPrompt } = require('../services/geminiService');

const SYSTEM_PROMPT = `You are the Resource Allocation Agent in RESQ EOC.
Assign rescue teams, swift boats, helicopters, fire engines, heavy equipment, and mobile ICUs to disaster incidents based on proximity, equipment match, and urgency.
Respond strictly in JSON adhering to standard agent format.`;

async function process(incidentData, availableResources) {
  const payload = { ...incidentData, availableResources };
  return await runAgentPrompt('Resource Allocation Agent', SYSTEM_PROMPT, payload);
}

module.exports = { process };
