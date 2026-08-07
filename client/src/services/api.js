function getApiBaseUrl() {
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' && window.location.port !== '5000') {
      return 'http://localhost:5000/api';
    }
  }
  if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL !== '/api') {
    return import.meta.env.VITE_API_URL;
  }
  if (import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL !== '/api') {
    return import.meta.env.VITE_API_BASE_URL;
  }
  return 'https://disaster-os.onrender.com/api';
}

const API_BASE = getApiBaseUrl();

function getAuthHeader() {
  const token = localStorage.getItem('resq_jwt_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const contentType = res.headers.get('content-type') || '';
    
    let data;
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error(`Backend API Endpoint Not Found (HTTP 404 at ${url}). If deploying frontend and backend separately on Render, set the VITE_API_BASE_URL environment variable on your static site to your backend URL (e.g., https://your-backend.onrender.com/api).`);
        }
        throw new Error(`Server returned HTTP ${res.status}: ${res.statusText}`);
      }
      return { text };
    }

    if (!res.ok) {
      throw new Error(data.error || `HTTP error! status: ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Auth
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  signin: (credentials) => apiRequest('/auth/signin', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  signup: (userData) => apiRequest('/auth/signup', { method: 'POST', body: JSON.stringify(userData) }),
  registerVictim: (payload) => apiRequest('/auth/register/victim', { method: 'POST', body: JSON.stringify(payload) }),
  requestCommanderAccess: (payload) => apiRequest('/auth/request-commander', { method: 'POST', body: JSON.stringify(payload) }),
  getProfile: () => apiRequest('/auth/profile'),

  // Admin Management
  getCommanderRequests: () => apiRequest('/admin/commander-requests'),
  approveCommanderRequest: (id, payload = {}) => apiRequest(`/admin/commander-requests/${id}/approve`, { method: 'POST', body: JSON.stringify(payload) }),
  rejectCommanderRequest: (id) => apiRequest(`/admin/commander-requests/${id}/reject`, { method: 'POST' }),
  getAdminUsers: () => apiRequest('/admin/users'),
  toggleUserActive: (id) => apiRequest(`/admin/users/${id}/toggle-active`, { method: 'PATCH' }),
  deleteUser: (id) => apiRequest(`/admin/users/${id}`, { method: 'DELETE' }),
  getSecurityLogs: () => apiRequest('/admin/security-logs'),
  getAuditLogs: () => apiRequest('/admin/audit-logs'),
  getSystemHealth: () => apiRequest('/admin/system-health'),

  // Incidents
  getIncidents: () => apiRequest('/incidents'),
  getIncidentById: (id) => apiRequest(`/incidents/${id}`),
  createIncident: (incidentData) => apiRequest('/incidents', { method: 'POST', body: JSON.stringify(incidentData) }),
  updateIncident: (id, updateData) => apiRequest(`/incidents/${id}`, { method: 'PUT', body: JSON.stringify(updateData) }),
  deleteIncident: (id) => apiRequest(`/incidents/${id}`, { method: 'DELETE' }),

  // Dashboard & AI
  getDashboard: () => apiRequest('/dashboard'),
  syncLiveFeeds: () => apiRequest('/dashboard/sync-live', { method: 'POST' }),
  getAIDecisions: () => apiRequest('/ai/decisions'),
  triggerCommanderCycle: (payload) => apiRequest('/ai/command', { method: 'POST', body: JSON.stringify(payload) }),
  runAgentTask: (agentEndpoint, payload) => apiRequest(`/ai/${agentEndpoint}`, { method: 'POST', body: JSON.stringify(payload) }),

  // Resources, Hospitals, Shelters
  getResources: () => apiRequest('/resources'),
  updateResource: (id, payload) => apiRequest(`/resources/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  getHospitals: () => apiRequest('/hospitals'),
  updateHospital: (id, payload) => apiRequest(`/hospitals/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  getShelters: () => apiRequest('/shelters'),
  createShelter: (payload) => apiRequest('/shelters', { method: 'POST', body: JSON.stringify(payload) }),

  // Reports
  getReports: () => apiRequest('/reports'),
  generateSitRep: () => apiRequest('/reports/sitrep', { method: 'POST' }),

  // Extra (Missing Persons, Supply Requests, Hazards, Notifications)
  getMissingPersons: () => apiRequest('/missing-persons'),
  reportMissingPerson: (payload) => apiRequest('/missing-persons', { method: 'POST', body: JSON.stringify(payload) }),
  getSupplyRequests: () => apiRequest('/supply-requests'),
  createSupplyRequest: (payload) => apiRequest('/supply-requests', { method: 'POST', body: JSON.stringify(payload) }),
  updateSupplyRequestStatus: (id, status) => apiRequest(`/supply-requests/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  getHazards: () => apiRequest('/hazards'),
  reportHazard: (payload) => apiRequest('/hazards', { method: 'POST', body: JSON.stringify(payload) }),
  getNotifications: () => apiRequest('/notifications'),
};
