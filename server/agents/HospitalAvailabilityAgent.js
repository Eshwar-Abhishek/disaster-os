const { runAgentPrompt } = require('../services/geminiService');

const SYSTEM_PROMPT = `You are the Hospital Availability Agent in RESQ EOC.
Match casualties to trauma centers, burn units, and ICU facilities based on severity, bed availability, travel time, and medical specialization.
Respond strictly in JSON adhering to standard agent format.`;

async function process(incidentData, hospitalData) {
  const payload = { ...incidentData, hospitalData };
  return await runAgentPrompt('Hospital Availability Agent', SYSTEM_PROMPT, payload);
}

module.exports = { process };
