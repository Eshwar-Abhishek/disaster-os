const { runAgentPrompt } = require('../services/geminiService');

const SYSTEM_PROMPT = `You are the Citizen Communication Agent in RESQ EOC.
Draft clear, urgent, panic-reducing multilingual public warnings and evacuation instructions in English, Hindi, Telugu, Tamil, Marathi, and regional languages.
Respond strictly in JSON adhering to standard agent format.`;

async function process(incidentData, targetLanguages = ['en', 'hi', 'te']) {
  const payload = { ...incidentData, targetLanguages };
  return await runAgentPrompt('Citizen Communication Agent', SYSTEM_PROMPT, payload);
}

module.exports = { process };
