require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Database initialization
require('./database/db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Attach Socket.IO instance to app for routes
app.set('io', io);

// Security & Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// File Upload Config (Multer)
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/[^a-zA-Z0-9.]/g, '_'));
  }
});
const upload = multer({ storage });

app.use('/uploads', express.static(uploadDir));

// Media Upload API Endpoint
app.post('/api/upload', upload.array('files', 5), (req, res) => {
  try {
    const fileUrls = (req.files || []).map(f => `/uploads/${f.filename}`);
    res.json({ message: 'Files uploaded successfully', urls: fileUrls });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const aiRoutes = require('./routes/aiRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const shelterRoutes = require('./routes/shelterRoutes');
const reportRoutes = require('./routes/reportRoutes');
const extraRoutes = require('./routes/extraRoutes');

app.use('/api/auth', authRoutes);
app.use('/api', authRoutes);
app.use('/auth', authRoutes);
app.use('/', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/shelters', shelterRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api', extraRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ONLINE', system: 'RESQ Commander Agentic Engine', timestamp: new Date().toISOString() });
});

// Global Express JSON Error Handler Middleware (prevents HTML error pages for API requests)
app.use((err, req, res, next) => {
  console.error('Express API Error Handler caught:', err);
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    code: err.code || 'SERVER_ERROR'
  });
});

// Serve client in production build
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

// Explicit JSON 404 for unmatched API endpoints
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: `API route not found: ${req.originalUrl}` });
});

// Single Page Application (SPA) Fallback
app.get('*', (req, res) => {
  const indexPath = path.join(clientBuildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Client build files not found. Please ensure "npm run build" runs during deployment.');
  }
});

// Socket.IO Real-time Connection Handler
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Enterprise EOC Client Connected: ${socket.id}`);

  socket.on('join:room', (room) => {
    socket.join(room);
    console.log(`[Socket.IO] Client ${socket.id} joined room: ${room}`);
  });

  socket.on('victim:sos', (victimData) => {
    console.log(`[Socket.IO] Realtime Victim Beacon Received:`, victimData);
    io.emit('commander:victim_beacon', victimData);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client Disconnected: ${socket.id}`);
  });
});

const { startLiveTelemetrySync } = require('./services/liveDataService');

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 RESQ AI Disaster Response Commander Server active on port ${PORT}`);
  startLiveTelemetrySync(io);
});
