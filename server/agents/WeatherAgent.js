const { runAgentPrompt } = require('../services/geminiService');
const { fetchRealTimeWeather } = require('../services/liveDataService');

const SYSTEM_PROMPT = `You are the Weather Agent in RESQ EOC.
Analyze real-time meteorological telemetry including temperature, wind speed, wind direction, and weather codes.
Predict how weather changes will impact tactical rescue operations and hazard escalation.
Respond strictly in JSON adhering to standard agent format.`;

async function process(incidentData) {
  let liveWeather = null;
  if (incidentData.latitude && incidentData.longitude) {
    liveWeather = await fetchRealTimeWeather(incidentData.latitude, incidentData.longitude);
  }
  const payload = { ...incidentData, liveWeather: liveWeather || 'Realtime weather sensor query active' };
  return await runAgentPrompt('Weather Agent', SYSTEM_PROMPT, payload);
}

module.exports = { process };
