const { z } = require('zod');

// Standard Agent Output Schema (Section 15 of user request)
const baseAgentOutputSchema = z.object({
  summary: z.string(),
  reasoning: z.string(),
  confidence: z.number().min(0).max(100),
  recommendations: z.array(z.string()),
  nextAction: z.string(),
  priority: z.enum(['Critical', 'High', 'Medium', 'Low']),
});

// Commander Agent Output Schema (Extends Base Schema)
const commanderAgentOutputSchema = baseAgentOutputSchema.extend({
  overallPlan: z.string(),
  assignedAgents: z.array(z.string()),
  conflictsResolved: z.array(z.string()),
  replanRequired: z.boolean(),
  estimatedCompletion: z.string(),
});

// Specific Agent Request Schemas
const incidentSchema = z.object({
  type: z.enum(['Flood', 'Earthquake', 'Fire', 'Cyclone', 'Landslide', 'Building Collapse', 'Chemical Leak', 'Road Accident']),
  description: z.string().min(5),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string(),
  photos: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
  contact: z.string().optional(),
});

const userAuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
  role: z.enum(['admin', 'operator', 'hospital_staff', 'citizen']).optional(),
});

module.exports = {
  baseAgentOutputSchema,
  commanderAgentOutputSchema,
  incidentSchema,
  userAuthSchema,
};
