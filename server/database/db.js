const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const mongoose = require('mongoose');

const dbFile = path.join(__dirname, 'resq_store.json');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://eshwar0309_db_user:o8dfRwRbyPqB1aNS@cluster0.drnvdwk.mongodb.net/resq_db?retryWrites=true&w=majority&appName=Cluster0';

const resqStoreSchema = new mongoose.Schema({
  _id: { type: String, default: 'resq_global_store' },
  users: Array,
  commander_requests: Array,
  security_logs: Array,
  audit_logs: Array,
  incidents: Array,
  hospitals: Array,
  resources: Array,
  shelters: Array,
  routes: Array,
  notifications: Array,
  ai_decisions: Array,
  situation_reports: Array,
  missing_persons: Array,
  supply_requests: Array,
  hazard_reports: Array
}, { timestamps: true, strict: false });

const ResqStoreModel = mongoose.model('ResqStore', resqStoreSchema);

mongoose.connect(MONGODB_URI, { family: 4, serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    console.log('🍃 MongoDB Atlas Connected: cluster0.drnvdwk.mongodb.net/resq_db');
    try {
      const dbDoc = await ResqStoreModel.findById('resq_global_store');
      if (dbDoc) {
        const remoteData = dbDoc.toObject();
        store = { ...store, ...remoteData };
        console.log('⚡ Synchronized local store with MongoDB Atlas records.');
      } else {
        await ResqStoreModel.create({ _id: 'resq_global_store', ...store });
        console.log('🌱 Initialized global store document in MongoDB Atlas.');
      }
    } catch (e) {
      console.warn('MongoDB Atlas store sync note:', e.message);
    }
  })
  .catch(err => {
    console.warn('MongoDB Atlas Connection Notice:', err.message, '(System seamlessly operating with persistent local store fallback)');
  });

// In-Memory DB state with auto-persistence to disk and MongoDB Atlas
let store = {
  users: [],
  commander_requests: [],
  security_logs: [],
  audit_logs: [],
  incidents: [],
  hospitals: [],
  resources: [],
  shelters: [],
  routes: [],
  notifications: [],
  ai_decisions: [],
  situation_reports: [],
  missing_persons: [],
  supply_requests: [],
  hazard_reports: []
};

// Load existing data if file exists
if (fs.existsSync(dbFile)) {
  try {
    const raw = fs.readFileSync(dbFile, 'utf8');
    store = { ...store, ...JSON.parse(raw) };
    if (!store.commander_requests) store.commander_requests = [];
    if (!store.security_logs) store.security_logs = [];
    if (!store.audit_logs) store.audit_logs = [];
// Ensure seeded system accounts exist and are active
ensureSeededUsers();
saveStore();

function ensureSeededUsers() {
  if (!store.users) store.users = [];
  const adminPass = bcrypt.hashSync('admin123', 10);
  const opPass = bcrypt.hashSync('operator123', 10);
  const citPass = bcrypt.hashSync('citizen123', 10);

  const seeded = [
    { id: 'admin-seed-id', full_name: 'System Admin', name: 'System Admin', email: 'admin@resq.gov', password_hash: adminPass, role: 'ADMIN', is_active: true, region: 'Central Command', phone: '+1-800-555-RESQ' },
    { id: 'commander-seed-id', full_name: 'Commander Sarah Vance', name: 'Commander Sarah Vance', email: 'commander@resq.gov', password_hash: opPass, role: 'COMMANDER', is_active: true, region: 'Sector 4 - Urban', phone: '+1-800-555-0199' },
    { id: 'operator-seed-id', full_name: 'Commander Sarah Vance', name: 'Commander Sarah Vance', email: 'operator@resq.gov', password_hash: opPass, role: 'COMMANDER', is_active: true, region: 'Sector 4 - Urban', phone: '+1-800-555-0199' },
    { id: 'victim-seed-id', full_name: 'John Citizen', name: 'John Citizen', email: 'victim@resq.gov', password_hash: citPass, role: 'VICTIM', is_active: true, region: 'Downtown District', phone: '+1-800-555-0888' },
    { id: 'citizen-seed-id', full_name: 'John Citizen', name: 'John Citizen', email: 'citizen@resq.gov', password_hash: citPass, role: 'VICTIM', is_active: true, region: 'Downtown District', phone: '+1-800-555-0888' }
  ];

  seeded.forEach(account => {
    const idx = store.users.findIndex(u => u.email === account.email);
    if (idx === -1) {
      store.users.push({
        ...account,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      });
    } else {
      store.users[idx].password_hash = account.password_hash;
      store.users[idx].is_active = true;
      store.users[idx].role = account.role;
    }
  });
}
  } catch (err) {
    console.error('Failed to parse database file, re-initializing store:', err.message);
  }
} else {
  seedInitialData();
  saveStore();
}

function saveStore() {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to persist database file:', err.message);
  }

  if (mongoose.connection.readyState === 1) {
    ResqStoreModel.findByIdAndUpdate('resq_global_store', store, { upsert: true }).catch(err => {
      console.warn('MongoDB sync warn:', err.message);
    });
  }
}

function seedInitialData() {
  const generateUUID = () => require('crypto').randomUUID();

  const adminPass = bcrypt.hashSync('Admin@123', 10);
  const commanderPass = bcrypt.hashSync('Commander@123', 10);
  const victimPass = bcrypt.hashSync('Victim@123', 10);

  // Users (ADMIN, COMMANDER, VICTIM)
  store.users = [
    { 
      id: generateUUID(), 
      full_name: 'System Admin', 
      name: 'System Admin', 
      email: 'admin@resq.gov', 
      password_hash: adminPass, 
      role: 'ADMIN', 
      is_active: true, 
      region: 'Central Command', 
      phone: '+1-800-555-RESQ', 
      created_at: new Date().toISOString(), 
      updated_at: new Date().toISOString(), 
      last_login: new Date().toISOString() 
    },
    { 
      id: generateUUID(), 
      full_name: 'Incident Commander', 
      name: 'Incident Commander', 
      email: 'commander@resq.gov', 
      password_hash: commanderPass, 
      role: 'COMMANDER', 
      is_active: true, 
      region: 'Sector 1 - EOC HQ', 
      phone: '+1-800-555-0100', 
      created_at: new Date().toISOString(), 
      updated_at: new Date().toISOString(), 
      last_login: new Date().toISOString() 
    },
    { 
      id: generateUUID(), 
      full_name: 'Commander Sarah Vance', 
      name: 'Commander Sarah Vance', 
      email: 'operator@resq.gov', 
      password_hash: commanderPass, 
      role: 'COMMANDER', 
      is_active: true, 
      region: 'Sector 4 - Urban', 
      phone: '+1-800-555-0199', 
      created_at: new Date().toISOString(), 
      updated_at: new Date().toISOString(), 
      last_login: new Date().toISOString() 
    },
    { 
      id: generateUUID(), 
      full_name: 'Victim Citizen', 
      name: 'Victim Citizen', 
      email: 'victim@resq.gov', 
      password_hash: victimPass, 
      role: 'VICTIM', 
      is_active: true, 
      region: 'Metro Zone', 
      phone: '+1-800-555-0777', 
      emergency_contact: '+1-800-555-9999', 
      blood_group: 'A+', 
      location: 'Sector 2', 
      medical_conditions: 'None', 
      created_at: new Date().toISOString(), 
      updated_at: new Date().toISOString(), 
      last_login: new Date().toISOString() 
    },
    { 
      id: generateUUID(), 
      full_name: 'John Citizen', 
      name: 'John Citizen', 
      email: 'citizen@resq.gov', 
      password_hash: victimPass, 
      role: 'VICTIM', 
      is_active: true, 
      region: 'Downtown District', 
      phone: '+1-800-555-0888', 
      emergency_contact: '+1-800-555-9999', 
      blood_group: 'O+', 
      location: 'Sector 4 Promenade', 
      medical_conditions: 'Asthma', 
      created_at: new Date().toISOString(), 
      updated_at: new Date().toISOString(), 
      last_login: new Date().toISOString() 
    }
  ];

  // Demo Commander Requests
  store.commander_requests = [
    {
      id: generateUUID(),
      name: 'Captain Marcus Brody',
      email: 'marcus.brody@ndma.gov',
      phone: '+1-800-555-4321',
      gov_org: 'National Disaster Management Authority',
      department: 'Rapid Rescue Operation Division',
      employee_id: 'NDMA-8842-TX',
      designation: 'Field Commander',
      region: 'Sector 4 & Urban West',
      reason: 'Assigned as Incident Commander for regional flood operations.',
      gov_id_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300',
      status: 'Pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  store.security_logs = [
    {
      id: generateUUID(),
      user_email: 'admin@resq.gov',
      action: 'INITIAL_ADMIN_SEED',
      ip: '127.0.0.1',
      timestamp: new Date().toISOString(),
      details: 'System initialized with seeded Admin account.'
    }
  ];

  store.audit_logs = [
    {
      id: generateUUID(),
      action: 'SYSTEM_INITIALIZATION',
      performed_by: 'System Admin',
      timestamp: new Date().toISOString(),
      details: 'RESQ AI Commander RBAC Store initialized.'
    }
  ];

  const inc1Id = generateUUID();
  const inc2Id = generateUUID();
  const inc3Id = generateUUID();
  const inc4Id = generateUUID();

  // Incidents Demo Data
  store.incidents = [
    {
      id: inc1Id,
      type: 'Flood',
      title: 'Flash Flood & River Breach in Sector 4',
      description: 'Heavy monsoon rains caused river banks to collapse. Water levels rising rapidly reaching 1.8 meters in commercial district. Over 40 citizens trapped on rooftop.',
      latitude: 17.3850,
      longitude: 78.4867,
      address: 'Riverfront Promenade, Sector 4, Hyderabad',
      status: 'Responding',
      severity: 'Critical',
      reported_by: 'Citizen Report #892',
      verified_by_ai: 1,
      photos: JSON.stringify(['/uploads/flood1.jpg', '/uploads/flood2.jpg']),
      videos: JSON.stringify([]),
      casualties: 12,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: inc2Id,
      type: 'Building Collapse',
      title: 'Commercial Structure Partial Collapse Following Tremor',
      description: '5-story commercial complex partially collapsed following 5.8 M earthquake tremor. Acoustic sensors picked up trapped survivors beneath eastern wing rubble.',
      latitude: 17.4399,
      longitude: 78.4983,
      address: 'Tech Park Road, Begumpet',
      status: 'Responding',
      severity: 'Critical',
      reported_by: 'Emergency Sensor Grid',
      verified_by_ai: 1,
      photos: JSON.stringify(['/uploads/collapse1.jpg']),
      videos: JSON.stringify([]),
      casualties: 28,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: inc3Id,
      type: 'Chemical Leak',
      title: 'Industrial Ammonia Leak at Chemical Depot',
      description: 'Hazardous anhydrous ammonia plume dispersing downwind toward dense residential neighborhood. Immediate evacuation and containment required.',
      latitude: 17.4065,
      longitude: 78.4772,
      address: 'Industrial Corridor 2, Karkhana',
      status: 'Reported',
      severity: 'High',
      reported_by: 'Industrial Alarm System',
      verified_by_ai: 1,
      photos: JSON.stringify([]),
      videos: JSON.stringify([]),
      casualties: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: inc4Id,
      type: 'Road Accident',
      title: 'Expressway Multi-Vehicle Collision & Fuel Spill',
      description: 'Tanker truck collision on Highway 7 Bypass causing major traffic blockade and gasoline spill risk near bridge approach.',
      latitude: 17.4120,
      longitude: 78.4680,
      address: 'Highway 7 Bypass, Mile 14',
      status: 'Responding',
      severity: 'High',
      reported_by: 'Highway Patrol Command',
      verified_by_ai: 1,
      photos: JSON.stringify([]),
      videos: JSON.stringify([]),
      casualties: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  // Hospitals Demo Data
  store.hospitals = [
    { id: generateUUID(), name: 'Metro Trauma & Emergency Center', address: '100 Medical Boulevard, City Center', latitude: 17.4100, longitude: 78.4600, total_beds: 250, available_beds: 42, icu_beds: 14, trauma_level: 'Level 1 Trauma', contact_phone: '+1-800-999-01', status: 'Operational', updated_at: new Date().toISOString() },
    { id: generateUUID(), name: 'St. Jude Memorial Hospital', address: '45 Hillside Ave, Sector 3', latitude: 17.4250, longitude: 78.5100, total_beds: 180, available_beds: 18, icu_beds: 5, trauma_level: 'Level 2 Trauma', contact_phone: '+1-800-999-02', status: 'Operational', updated_at: new Date().toISOString() },
    { id: generateUUID(), name: 'Apex General & Burn Care Unit', address: '88 Industry Way, Northern Zone', latitude: 17.4500, longitude: 78.4800, total_beds: 300, available_beds: 85, icu_beds: 28, trauma_level: 'Level 1 Trauma & Burn Center', contact_phone: '+1-800-999-03', status: 'Operational', updated_at: new Date().toISOString() },
    { id: generateUUID(), name: 'City Care Pediatric Emergency Center', address: '14 Children Park Road', latitude: 17.3950, longitude: 78.4750, total_beds: 120, available_beds: 35, icu_beds: 10, trauma_level: 'Pediatric Trauma Unit', contact_phone: '+1-800-999-04', status: 'Operational', updated_at: new Date().toISOString() }
  ];

  // Resources Demo Data
  store.resources = [
    { id: generateUUID(), type: 'Helicopter', name: 'Air Rescue Falcon-1', status: 'Deployed', capacity: 6, current_lat: 17.3900, current_lng: 78.4800, assigned_incident_id: inc1Id, operator_name: 'Capt. Marcus', updated_at: new Date().toISOString() },
    { id: generateUUID(), type: 'Boat', name: 'Amphibious SwiftBoat Alpha', status: 'Deployed', capacity: 12, current_lat: 17.3870, current_lng: 78.4880, assigned_incident_id: inc1Id, operator_name: 'Lt. Gomez', updated_at: new Date().toISOString() },
    { id: generateUUID(), type: 'Rescue Team', name: 'Urban Search & Rescue Squad 9', status: 'Deployed', capacity: 10, current_lat: 17.4400, current_lng: 78.4970, assigned_incident_id: inc2Id, operator_name: 'Cmdr. Vance', updated_at: new Date().toISOString() },
    { id: generateUUID(), type: 'Fire Engine', name: 'HazMat Engine 4', status: 'Available', capacity: 4, current_lat: 17.4100, current_lng: 78.4700, assigned_incident_id: null, operator_name: 'Capt. Reynolds', updated_at: new Date().toISOString() },
    { id: generateUUID(), type: 'Ambulance', name: 'Mobile ICU Unit 12', status: 'Available', capacity: 2, current_lat: 17.4150, current_lng: 78.4650, assigned_incident_id: null, operator_name: 'Medic Sarah', updated_at: new Date().toISOString() }
  ];

  // Shelters Demo Data
  store.shelters = [
    { id: generateUUID(), name: 'Central Stadium Relief Hub', capacity: 1500, occupied: 420, latitude: 17.4000, longitude: 78.4900, address: 'Stadium Complex, Gate 4', food_available: 1, water_available: 1, medical_support: 1, pet_friendly: 1, wheelchair_accessible: 1, status: 'Open' },
    { id: generateUUID(), name: 'High School Evacuation Camp', capacity: 600, occupied: 180, latitude: 17.4300, longitude: 78.5200, address: 'Community School, East Wing', food_available: 1, water_available: 1, medical_support: 1, pet_friendly: 0, wheelchair_accessible: 1, status: 'Open' },
    { id: generateUUID(), name: 'Civic Center Emergency Shelter', capacity: 800, occupied: 290, latitude: 17.3750, longitude: 78.4700, address: 'City Hall Grounds', food_available: 1, water_available: 1, medical_support: 1, pet_friendly: 1, wheelchair_accessible: 1, status: 'Open' },
    { id: generateUUID(), name: 'Red Cross Community Kitchen & Camp', capacity: 450, occupied: 110, latitude: 17.4180, longitude: 78.4820, address: 'Red Cross Building, Sector 2', food_available: 1, water_available: 1, medical_support: 1, pet_friendly: 1, wheelchair_accessible: 1, status: 'Open' }
  ];

  // Hazard Reports Demo Data (Bridge collapse, Chemical plume, Crowds, Barricades)
  store.hazard_reports = [
    { id: generateUUID(), reporter_name: 'Highway Patrol', hazard_type: 'Collapsed bridge', description: 'Arterial Bridge #3 over river completely collapsed. Submerged under 2 meters water.', latitude: 17.3880, longitude: 78.4850, verified: 1, created_at: new Date().toISOString() },
    { id: generateUUID(), reporter_name: 'Industrial HazMat Unit', hazard_type: 'Chemical leak', description: 'Anhydrous ammonia vapor plume dispersing 600m downwind. Wear respirators.', latitude: 17.4065, longitude: 78.4772, verified: 1, created_at: new Date().toISOString() },
    { id: generateUUID(), reporter_name: 'EOC Sensor Grid', hazard_type: 'Crowds', description: 'High-density evacuation crowd bottlenecking near Stadium Gate 2', latitude: 17.3990, longitude: 78.4910, verified: 1, created_at: new Date().toISOString() },
    { id: generateUUID(), reporter_name: 'Police Command', hazard_type: 'Police barricades', description: 'Police road barricade established to prevent traffic from entering flooded Sector 4', latitude: 17.3820, longitude: 78.4810, verified: 1, created_at: new Date().toISOString() }
  ];

  // Missing Persons Demo Data
  store.missing_persons = [
    { id: generateUUID(), name: 'Robert Vance', age: 42, gender: 'Male', photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80', last_location: 'Sector 4 Riverfront Promenade', status: 'Active Search', contact_info: '+1-800-555-0199', details: 'Wearing blue rain jacket, navy jeans', created_at: new Date().toISOString() },
    { id: generateUUID(), name: 'Priya Patel', age: 29, gender: 'Female', photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80', last_location: 'Begumpet Commercial Complex', status: 'Matched at Hospital', contact_info: '+1-800-555-0244', details: 'Carrying red shoulder bag', created_at: new Date().toISOString() }
  ];

  // Supply Requests Demo Data
  store.supply_requests = [
    { id: generateUUID(), incident_id: inc1Id, type: 'Oxygen', quantity: '10 Oxygen Cylinders', urgency: 'Critical', requester_name: 'Dr. Rivera (Field ER)', contact_info: '+1-800-555-0911', address_or_gps: 'Sector 4 Relief Camp Gate', status: 'Pending', created_at: new Date().toISOString() },
    { id: generateUUID(), incident_id: inc1Id, type: 'Water', quantity: '500 Liters Drinking Water', urgency: 'High', requester_name: 'Stadium Relief Hub', contact_info: '+1-800-555-0422', address_or_gps: 'Stadium Gate 4', status: 'Pending', created_at: new Date().toISOString() },
    { id: generateUUID(), incident_id: inc2Id, type: 'Baby formula', quantity: '20 Tins Infant Milk Powder', urgency: 'High', requester_name: 'Anita Sharma', contact_info: '+91-98765-43210', address_or_gps: 'High School Evacuation Camp', status: 'Pending', created_at: new Date().toISOString() }
  ];

  // Resource Shares Demo Data
  store.resource_shares = [
    { id: generateUUID(), item_type: 'Drinking Water', description: '500 Liters purified bottled water available for dispatch', quantity: '500 L', location: 'Red Cross Relief Hub, Sector 2', contact_name: 'Marcus (NGO Coordinator)', contact_phone: '+1-800-555-7711', status: 'Available', created_at: new Date().toISOString() },
    { id: generateUUID(), item_type: 'Blankets', description: '40 heavy wool blankets for flood victims', quantity: '40 Units', location: 'Civic Center Shelter', contact_name: 'Sarah (Community Vol)', contact_phone: '+1-800-555-7722', status: 'Available', created_at: new Date().toISOString() }
  ];

  // AI Decisions Demo Data
  store.ai_decisions = [
    {
      id: generateUUID(),
      agent_name: 'Commander Agent',
      incident_id: inc1Id,
      summary: 'Deployed SwiftBoat Alpha & Air Rescue Falcon-1 for Sector 4 flood evacuation. Rerouted ground traffic past Collapsed Bridge #3.',
      reasoning: 'Water depth exceeds 1.8 meters. Ground vehicle access impossible. Aerial rescue prioritized for rooftop survivors while boat units navigate riverfront.',
      confidence: 96,
      recommendations: JSON.stringify(['Reroute ambulance convoys via Highway 7 Bypass to avoid Collapsed Bridge #3', 'Alert Metro Trauma & City Care Pediatric Hospitals to prepare ICU beds', 'Issue multilingual evacuation warning via SMS grid']),
      next_action: 'Dispatch SwiftBoat Alpha and Falcon-1 simultaneously',
      priority: 'Critical',
      overall_plan: 'TACTICAL PLAN: 1. Contain Flood hazard zone. 2. Dispatch primary response units. 3. Monitor hospital bed capacities continuously.',
      assigned_agents: JSON.stringify(['Mission Planner', 'Resource Allocation', 'Route Planning', 'Hospital Availability']),
      conflicts_resolved: JSON.stringify(['Resolved route conflict: Bypass Collapsed Bridge #3 via Highway 7 Bypass.']),
      replan_required: 0,
      estimated_completion: '45 minutes to full containment',
      created_at: new Date().toISOString()
    }
  ];

  // Situation Reports Demo Data
  store.situation_reports = [
    {
      id: generateUUID(),
      title: 'EOC Executive Flash Situation Report #05',
      incident_count: 4,
      active_rescues: 3,
      deployed_resources: 3,
      estimated_casualties: 47,
      summary: 'Sector 4 Flash Flood and Begumpet Building Collapse active. Multi-agent AI rerouted 4 medical convoys around Collapsed Bridge #3 and Chemical Ammonia Plume.',
      executive_notes: 'All Level 1 Trauma Centers operating at 80% occupancy. 4 shelters open with food/water. Live telemetry streaming from USGS & Open-Meteo.',
      created_at: new Date().toISOString()
    }
  ];

  // Notifications Demo Data
  store.notifications = [
    { id: generateUUID(), incident_id: inc1Id, recipient_role: 'all', message: 'EVACUATION WARNING: Sector 4 Riverfront residents move to Central Stadium Relief Hub immediately.', language: 'en', type: 'Evacuation', sent_at: new Date().toISOString() }
  ];
}

/**
 * Universal Prepared Statement Abstraction providing .all(), .get(), and .run() compatibility.
 */
function prepare(sqlQuery) {
  return {
    all: () => {
      const q = sqlQuery.toLowerCase();
      if (q.includes('from users')) return store.users;
      if (q.includes('from commander_requests')) return store.commander_requests;
      if (q.includes('from security_logs')) return store.security_logs;
      if (q.includes('from audit_logs')) return store.audit_logs;
      if (q.includes('from incidents')) return store.incidents;
      if (q.includes('from hospitals')) return store.hospitals;
      if (q.includes('from resources')) return store.resources;
      if (q.includes('from shelters')) return store.shelters;
      if (q.includes('from notifications')) return store.notifications;
      if (q.includes('from ai_decisions')) return store.ai_decisions;
      if (q.includes('from situation_reports')) return store.situation_reports;
      if (q.includes('from missing_persons')) return store.missing_persons;
      if (q.includes('from supply_requests')) return store.supply_requests;
      if (q.includes('from hazard_reports')) return store.hazard_reports;
      if (q.includes('from resource_shares')) return store.resource_shares || [];
      return [];
    },
    get: (...params) => {
      const q = sqlQuery.toLowerCase();
      const paramVal = params[0];

      if (q.includes('count(*) as cnt from users')) return { cnt: store.users.length };
      if (q.includes('count(*) as cnt from incidents')) {
        if (q.includes("status in ('reported', 'responding')")) {
          return { cnt: store.incidents.filter(i => ['Reported', 'Responding'].includes(i.status)).length };
        }
        return { cnt: store.incidents.length };
      }
      if (q.includes('sum(casualties) as sum from incidents')) {
        return { sum: store.incidents.reduce((acc, i) => acc + (i.casualties || 0), 0) };
      }
      if (q.includes('count(*) as cnt from resources')) return { cnt: store.resources.length };
      if (q.includes('count(*) as cnt from hospitals')) return { cnt: store.hospitals.length };
      if (q.includes('count(*) as cnt from shelters')) return { cnt: store.shelters.length };
      if (q.includes('count(*) as cnt from commander_requests')) {
        if (q.includes("status = 'pending'")) {
          return { cnt: store.commander_requests.filter(cr => cr.status.toLowerCase() === 'pending').length };
        }
        return { cnt: store.commander_requests.length };
      }

      if (q.includes('from users where email =') || q.includes('from users where lower(email) =')) return store.users.find(u => u.email.toLowerCase() === (paramVal || '').toLowerCase()) || null;
      if (q.includes('from users where id =')) return store.users.find(u => u.id === paramVal) || null;
      if (q.includes('from commander_requests where id =')) return store.commander_requests.find(cr => cr.id === paramVal) || null;
      if (q.includes('from incidents where id =')) return store.incidents.find(i => i.id === paramVal) || null;
      if (q.includes('from incidents where description like')) {
        const pattern = (paramVal || '').replace(/%/g, '');
        return store.incidents.find(i => i.description && typeof i.description === 'string' && i.description.includes(pattern)) || null;
      }
      if (q.includes('from hospitals where id =')) return store.hospitals.find(h => h.id === paramVal) || null;
      if (q.includes('from resources where id =')) return store.resources.find(r => r.id === paramVal) || null;
      if (q.includes('from shelters where id =')) return store.shelters.find(s => s.id === paramVal) || null;
      if (q.includes('from situation_reports where id =')) return store.situation_reports.find(sr => sr.id === paramVal) || null;
      if (q.includes('from missing_persons where id =')) return store.missing_persons.find(mp => mp.id === paramVal) || null;
      if (q.includes('from supply_requests where id =')) return store.supply_requests.find(sp => sp.id === paramVal) || null;
      if (q.includes('from hazard_reports where id =')) return store.hazard_reports.find(hz => hz.id === paramVal) || null;

      return null;
    },
    run: (...params) => {
      const q = sqlQuery.toLowerCase();

      if (q.includes('insert into users')) {
        const [id, full_name, email, password_hash, role, phone, is_active, emergency_contact, blood_group, location, medical_conditions, region] = params;
        const newUser = { 
          id, 
          full_name: full_name || name, 
          name: full_name || name, 
          email, 
          password_hash, 
          role: (role || 'VICTIM').toUpperCase(), 
          phone: phone || null, 
          is_active: is_active !== undefined ? Boolean(is_active) : true, 
          emergency_contact: emergency_contact || null,
          blood_group: blood_group || null,
          location: location || null,
          medical_conditions: medical_conditions || null,
          region: region || 'Global',
          created_at: new Date().toISOString(), 
          updated_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        };
        store.users.unshift(newUser);
        saveStore();
        return { changes: 1 };
      }

      if (q.includes('update users set last_login')) {
        const [last_login, id] = params;
        const u = store.users.find(usr => usr.id === id);
        if (u) {
          u.last_login = last_login || new Date().toISOString();
          u.updated_at = new Date().toISOString();
          saveStore();
        }
        return { changes: 1 };
      }

      if (q.includes('update users set is_active')) {
        const [is_active, id] = params;
        const u = store.users.find(usr => usr.id === id);
        if (u) {
          u.is_active = Boolean(is_active);
          u.updated_at = new Date().toISOString();
          saveStore();
        }
        return { changes: 1 };
      }

      if (q.includes('delete from users where id =')) {
        const id = params[0];
        store.users = store.users.filter(u => u.id !== id);
        saveStore();
        return { changes: 1 };
      }

      if (q.includes('insert into commander_requests')) {
        const [id, name, email, phone, gov_org, department, employee_id, designation, region, reason, gov_id_url] = params;
        const newReq = {
          id,
          name,
          email,
          phone,
          gov_org,
          department,
          employee_id,
          designation,
          region,
          reason,
          gov_id_url: gov_id_url || null,
          status: 'Pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        store.commander_requests.unshift(newReq);
        saveStore();
        return { changes: 1 };
      }

      if (q.includes('update commander_requests set status')) {
        const [status, id] = params;
        const req = store.commander_requests.find(r => r.id === id);
        if (req) {
          req.status = status;
          req.updated_at = new Date().toISOString();
          saveStore();
        }
        return { changes: 1 };
      }

      if (q.includes('insert into security_logs')) {
        const [id, user_email, action, ip, details] = params;
        const newLog = {
          id: id || require('crypto').randomUUID(),
          user_email,
          action,
          ip: ip || '127.0.0.1',
          timestamp: new Date().toISOString(),
          details: details || ''
        };
        store.security_logs.unshift(newLog);
        saveStore();
        return { changes: 1 };
      }

      if (q.includes('insert into audit_logs')) {
        const [id, action, performed_by, details] = params;
        const newLog = {
          id: id || require('crypto').randomUUID(),
          action,
          performed_by,
          timestamp: new Date().toISOString(),
          details: details || ''
        };
        store.audit_logs.unshift(newLog);
        saveStore();
        return { changes: 1 };
      }

      if (q.includes('insert into incidents')) {
        const [id, type, title, description, latitude, longitude, address, status, severity, reported_by, verified_by_ai, photos, videos, casualties] = params;
        const newInc = { id, type, title, description, latitude, longitude, address, status, severity, reported_by, verified_by_ai, photos, videos, casualties, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
        store.incidents.unshift(newInc);
        saveStore();
        return { changes: 1 };
      }

      if (q.includes('update incidents')) {
        const id = params[params.length - 1];
        const inc = store.incidents.find(i => i.id === id);
        if (inc) {
          const [status, severity, casualties, description] = params;
          if (status) inc.status = status;
          if (severity) inc.severity = severity;
          if (casualties !== undefined && casualties !== null) inc.casualties = casualties;
          if (description) inc.description = description;
          inc.updated_at = new Date().toISOString();
          saveStore();
        }
        return { changes: 1 };
      }

      if (q.includes('delete from incidents where id =')) {
        const id = params[0];
        store.incidents = store.incidents.filter(i => i.id !== id);
        saveStore();
        return { changes: 1 };
      }

      if (q.includes('insert into ai_decisions')) {
        const [id, agent_name, incident_id, summary, reasoning, confidence, recommendations, next_action, priority, overall_plan, assigned_agents, conflicts_resolved, replan_required, estimated_completion] = params;
        const newDec = { id, agent_name, incident_id, summary, reasoning, confidence, recommendations, next_action, priority, overall_plan, assigned_agents, conflicts_resolved, replan_required, estimated_completion, created_at: new Date().toISOString() };
        store.ai_decisions.unshift(newDec);
        saveStore();
        return { changes: 1 };
      }

      if (q.includes('insert into notifications')) {
        const [id, incident_id, recipient_role, message, language, type] = params;
        const newNotif = { id, incident_id, recipient_role: recipient_role || 'all', message, language: language || 'en', type: type || 'Warning', sent_at: new Date().toISOString() };
        store.notifications.unshift(newNotif);
        saveStore();
        return { changes: 1 };
      }

      if (q.includes('insert into resources')) {
        const [id, type, name, status, capacity, current_lat, current_lng, operator_name] = params;
        const newRes = { id, type, name, status: status || 'Available', capacity, current_lat, current_lng, operator_name, updated_at: new Date().toISOString() };
        store.resources.unshift(newRes);
        saveStore();
        return { changes: 1 };
      }

      if (q.includes('update resources')) {
        const id = params[params.length - 1];
        const res = store.resources.find(r => r.id === id);
        if (res) {
          const [status, assigned_incident_id, current_lat, current_lng] = params;
          if (status) res.status = status;
          if (assigned_incident_id !== undefined) res.assigned_incident_id = assigned_incident_id;
          if (current_lat) res.current_lat = current_lat;
          if (current_lng) res.current_lng = current_lng;
          res.updated_at = new Date().toISOString();
          saveStore();
        }
        return { changes: 1 };
      }

      if (q.includes('update hospitals')) {
        const id = params[params.length - 1];
        const hosp = store.hospitals.find(h => h.id === id);
        if (hosp) {
          const [available_beds, icu_beds, status] = params;
          if (available_beds !== undefined && available_beds !== null) hosp.available_beds = available_beds;
          if (icu_beds !== undefined && icu_beds !== null) hosp.icu_beds = icu_beds;
          if (status) hosp.status = status;
          hosp.updated_at = new Date().toISOString();
          saveStore();
        }
        return { changes: 1 };
      }

      if (q.includes('insert into shelters')) {
        const [id, name, capacity, occupied, latitude, longitude, address, food_available, water_available, medical_support, pet_friendly, wheelchair_accessible] = params;
        const newSh = { id, name, capacity, occupied, latitude, longitude, address, food_available, water_available, medical_support, pet_friendly, wheelchair_accessible, status: 'Open' };
        store.shelters.unshift(newSh);
        saveStore();
        return { changes: 1 };
      }

      if (q.includes('insert into situation_reports')) {
        const [id, title, incident_count, active_rescues, deployed_resources, estimated_casualties, summary, executive_notes] = params;
        const newSit = { id, title, incident_count, active_rescues, deployed_resources, estimated_casualties, summary, executive_notes, created_at: new Date().toISOString() };
        store.situation_reports.unshift(newSit);
        saveStore();
        return { changes: 1 };
      }

      if (q.includes('insert into missing_persons')) {
        const [id, name, age, gender, photo_url, last_location, contact_info, details] = params;
        const newMp = { id, name, age, gender, photo_url, last_location, status: 'Missing', contact_info, details, created_at: new Date().toISOString() };
        store.missing_persons.unshift(newMp);
        saveStore();
        return { changes: 1 };
      }

      if (q.includes('insert into supply_requests')) {
        const [id, incident_id, type, quantity, urgency, requester_name, contact_info, address_or_gps, latitude, longitude] = params;
        const newSp = { 
          id, 
          incident_id, 
          type, 
          quantity, 
          urgency, 
          requester_name, 
          contact_info, 
          address_or_gps, 
          latitude: latitude || 17.3850, 
          longitude: longitude || 78.4867, 
          status: 'Pending', 
          created_at: new Date().toISOString() 
        };
        store.supply_requests.unshift(newSp);
        saveStore();
        return { changes: 1 };
      }

      if (q.includes('update supply_requests set status')) {
        const [status, id] = params;
        const item = store.supply_requests.find(sp => sp.id === id);
        if (item) {
          item.status = status;
          saveStore();
        }
        return { changes: 1 };
      }

      if (q.includes('insert into hazard_reports')) {
        const [id, reporter_name, hazard_type, description, latitude, longitude, verified] = params;
        const newHz = { id, reporter_name, hazard_type, description, latitude, longitude, verified, created_at: new Date().toISOString() };
        store.hazard_reports.unshift(newHz);
        saveStore();
        return { changes: 1 };
      }

      saveStore();
      return { changes: 1 };
    }
  };
}

module.exports = {
  prepare,
  exec: () => {}
};
