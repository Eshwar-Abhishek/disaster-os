const { runAgentPrompt } = require('../services/geminiService');

const SYSTEM_PROMPT = `You are the Risk Assessment Agent in RESQ EOC.
Evaluate immediate danger indices, casualty impact, structural instability, hazard spread rates, and environmental threats.
Determine priority (Critical, High, Medium, Low) and quantify risk factors.
Respond strictly in JSON adhering to standard agent format.`;

async function process(incidentData) {
  return await runAgentPrompt('Risk Assessment Agent', SYSTEM_PROMPT, incidentData);
}

module.exports = { process };
