const db = require('../database/db');
const { randomUUID } = require('crypto');

/**
 * Live Data Integration Service
 * Fetches real-time seismic telemetry from USGS and real-time weather from Open-Meteo.
 */

// USGS GeoJSON Real-Time Earthquake API
const USGS_API_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=3.0&limit=10';

// Open-Meteo Real-Time Weather API
const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';

async function fetchRealTimeEarthquakes() {
  try {
    console.log('[Live Data Service] Querying USGS Real-Time Earthquake Feed...');
    const response = await fetch(USGS_API_URL);
    if (!response.ok) {
      throw new Error(`USGS HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const features = data.features || [];

    console.log(`[Live Data Service] Retrieved ${features.length} real seismic events from USGS.`);
    const newIncidents = [];

    for (const feature of features) {
      const props = feature.properties;
      const coords = feature.geometry.coordinates; // [lng, lat, depth]
      const lng = coords[0];
      const lat = coords[1];
      const mag = props.mag;
      const place = props.place || 'Unknown Location';
      const eventTime = new Date(props.time).toISOString();

      // Check if this real USGS event is already in database
      const existing = db.prepare("SELECT * FROM incidents WHERE description LIKE ?").get(`%${props.code || feature.id}%`);
      if (!existing && mag >= 3.0) {
        const id = randomUUID();
        const severity = mag >= 6.0 ? 'Critical' : mag >= 4.5 ? 'High' : 'Medium';
        const title = `M ${mag} Earthquake - ${place}`;
        const description = `[REAL USGS DATA] Seismic event registered by USGS (ID: ${feature.id}). Magnitude: ${mag} M, Depth: ${coords[2]} km. Tsunami Alert: ${props.tsunami ? 'ACTIVE' : 'NO'}. Event Time: ${eventTime}`;

        db.prepare(`
          INSERT INTO incidents (id, type, title, description, latitude, longitude, address, status, severity, reported_by, verified_by_ai, photos, videos, casualties)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          id,
          'Earthquake',
          title,
          description,
          lat,
          lng,
          place,
          'Responding',
          severity,
          'USGS Live Seismic Sensor',
          1,
          '[]',
          '[]',
          Math.floor(mag * 8)
        );

        const created = db.prepare('SELECT * FROM incidents WHERE id = ?').get(id);
        newIncidents.push(created);

        // Run Commander Multi-Agent Pipeline on Real Incident
        try {
          const CommanderAgent = require('../agents/CommanderAgent');
          if (CommanderAgent && typeof CommanderAgent.orchestrate === 'function') {
            CommanderAgent.orchestrate(created, 'USGS Real-Time Seismic Trigger').catch(err => {
              console.error('Failed commander cycle for real earthquake:', err);
            });
          }
        } catch (err) {
          console.error('Lazy load CommanderAgent error:', err);
        }
      }
    }

    return newIncidents;
  } catch (err) {
    console.error('[Live Data Service] Error fetching USGS earthquakes:', err.message);
    return [];
  }
}

async function fetchRealTimeWeather(latitude, longitude) {
  try {
    const url = `${OPEN_METEO_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data.current_weather || null;
  } catch (err) {
    console.error('[Live Data Service] Error fetching Open-Meteo weather:', err.message);
    return null;
  }
}

function startLiveTelemetrySync(io) {
  console.log('⚡ [Live Telemetry Service] Started real-time USGS & Open-Meteo sync loop.');

  // Run immediately on boot
  fetchRealTimeEarthquakes().then(newEvents => {
    if (newEvents.length > 0 && io) {
      io.emit('live:earthquakes', { count: newEvents.length, incidents: newEvents });
    }
  });

  // Sync every 45 seconds
  setInterval(async () => {
    const newEvents = await fetchRealTimeEarthquakes();
    if (newEvents.length > 0 && io) {
      io.emit('live:earthquakes', { count: newEvents.length, incidents: newEvents });
      io.emit('dashboard:refresh');
    }
  }, 45000);
}

module.exports = {
  fetchRealTimeEarthquakes,
  fetchRealTimeWeather,
  startLiveTelemetrySync
};
