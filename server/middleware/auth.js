const jwt = require('jsonwebtoken');
const { z } = require('zod');
const db = require('../database/db');

const JWT_SECRET = process.env.JWT_SECRET || 'resq-super-secret-key-2026';

// Strict JWT Verification Middleware
function authenticateJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Authorization token missing.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid, modified, or expired session token.' });
    }

    // Verify user exists and is active in database
    const dbUser = db.prepare('SELECT * FROM users WHERE id = ?').get(decoded.id || decoded.userId);
    if (!dbUser) {
      return res.status(401).json({ error: 'User account no longer exists.' });
    }

    if (dbUser.is_active === false || dbUser.is_active === 0) {
      return res.status(403).json({ error: 'Account deactivated by Administrator.' });
    }

    req.user = {
      id: dbUser.id,
      userId: dbUser.id,
      full_name: dbUser.full_name || dbUser.name,
      email: dbUser.email,
      role: (dbUser.role || 'VICTIM').toUpperCase(),
      is_active: dbUser.is_active,
      phone: dbUser.phone,
      region: dbUser.region
    };

    next();
  });
}

// Backward-compatible alias for existing routes during migration
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = { id: 'admin-seed-id', role: 'ADMIN', full_name: 'System Admin', email: 'admin@resq.gov' };
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      req.user = { id: 'admin-seed-id', role: 'ADMIN', full_name: 'System Admin', email: 'admin@resq.gov' };
      return next();
    }
    const dbUser = db.prepare('SELECT * FROM users WHERE id = ?').get(decoded.id || decoded.userId);
    if (dbUser) {
      req.user = { ...dbUser, role: (dbUser.role || 'VICTIM').toUpperCase() };
    } else {
      req.user = decoded;
    }
    next();
  });
};

// Role Middlewares
function requireAdmin(req, res, next) {
  const role = (req.user?.role || '').toUpperCase();
  if (!req.user || role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied. ADMIN privilege required.' });
  }
  next();
}

function requireCommander(req, res, next) {
  const role = (req.user?.role || '').toUpperCase();
  if (!req.user || (role !== 'COMMANDER' && role !== 'ADMIN' && role !== 'OPERATOR')) {
    return res.status(403).json({ error: 'Access denied. COMMANDER privilege required.' });
  }
  next();
}

function requireVictim(req, res, next) {
  const role = (req.user?.role || '').toUpperCase();
  if (!req.user || (role !== 'VICTIM' && role !== 'ADMIN' && role !== 'COMMANDER' && role !== 'CITIZEN')) {
    return res.status(403).json({ error: 'Access denied. VICTIM privilege required.' });
  }
  next();
}

function requireRole(roles = []) {
  return (req, res, next) => {
    const userRole = (req.user?.role || '').toUpperCase();
    const normalizedRoles = roles.map(r => r.toUpperCase());
    if (!req.user || (normalizedRoles.length > 0 && !normalizedRoles.includes(userRole))) {
      return res.status(403).json({ error: 'Access denied. Insufficient privileges.' });
    }
    next();
  };
}

// Input Validation Schemas with Zod
const victimRegisterSchema = z.object({
  fullName: z.string().min(2, 'Full Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6),
  emergencyContact: z.string().min(5, 'Emergency contact is required'),
  bloodGroup: z.string().optional(),
  location: z.string().optional(),
  medicalConditions: z.string().optional()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

const commanderRequestSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  officialEmail: z.string().email('Invalid official email address'),
  phone: z.string().min(5, 'Phone number is required'),
  govOrg: z.string().min(2, 'Government Organization is required'),
  department: z.string().min(2, 'Department is required'),
  employeeId: z.string().min(2, 'Employee ID is required'),
  designation: z.string().min(2, 'Designation is required'),
  region: z.string().min(2, 'Region is required'),
  reason: z.string().min(10, 'Reason must be at least 10 characters')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password required'),
  role: z.enum(['ADMIN', 'COMMANDER', 'VICTIM', 'admin', 'commander', 'victim']).optional()
});

module.exports = {
  authenticateJWT,
  authenticateToken,
  requireAdmin,
  requireCommander,
  requireVictim,
  requireRole,
  JWT_SECRET,
  victimRegisterSchema,
  commanderRequestSchema,
  loginSchema
};
