const { runAgentPrompt } = require('../services/geminiService');

const SYSTEM_PROMPT = `You are the Mission Planner Agent in RESQ EOC.
Formulate tactical search & rescue phase plans, priority objectives, containment milestones, and field command staging.
Respond strictly in JSON adhering to standard agent format.`;

async function process(incidentData) {
  return await runAgentPrompt('Mission Planner Agent', SYSTEM_PROMPT, incidentData);
}

module.exports = { process };
