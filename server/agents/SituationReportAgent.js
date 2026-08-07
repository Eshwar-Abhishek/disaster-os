const { runAgentPrompt } = require('../services/geminiService');

const SYSTEM_PROMPT = `You are the Situation Report Agent in RESQ EOC.
Synthesize high-level executive SitReps for disaster commanders, government officials, and emergency directors.
Include casualty metrics, resource status, critical bottlenecks, and operational forecasts.
Respond strictly in JSON adhering to standard agent format.`;

async function process(systemTelemetry) {
  return await runAgentPrompt('Situation Report Agent', SYSTEM_PROMPT, systemTelemetry);
}

module.exports = { process };
