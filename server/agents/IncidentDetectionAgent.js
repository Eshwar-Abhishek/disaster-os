const { runAgentPrompt } = require('../services/geminiService');

const SYSTEM_PROMPT = `You are the Incident Detection Agent in RESQ EOC.
Your duty is to verify, classify, and extract structured crisis data from citizen reports, sensors, and media.
Assess report credibility, determine exact disaster type, and estimate initial casualty risks.
Respond strictly in JSON adhering to standard agent format.`;

async function process(incidentData) {
  return await runAgentPrompt('Incident Detection Agent', SYSTEM_PROMPT, incidentData);
}

module.exports = { process };
