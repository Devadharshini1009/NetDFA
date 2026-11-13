import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import dnsRoutes from './routes/dnsRoutes.js';
import { getHealth } from './controllers/dnsController.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Body parsing
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or same-origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy blocked access from origin: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json({ limit: '10kb' })); // Mitigate body overflow attacks
app.use(rateLimiter); // Apply rate limiting to all requests

// Health check endpoint
app.get('/api/health', getHealth);

// Mount DNS API routes
app.use('/api/dns', dnsRoutes);

// Root informational endpoint
app.get('/', (req, res) => {
  res.json({
    project: 'Domain Name Validation and DNS Lookup Tool',
    disciplines: ['FSWD', 'Computer Networks', 'FLAT'],
    status: 'Operational',
    documentation: '/api/dns/dfa/definition',
    health: '/api/health',
  });
});

// Centralized error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize database and start listening
const startServer = async () => {
  // Connect to MongoDB (non-blocking for offline fallback)
  await connectDB();

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` NetDFA Server running on http://localhost:${PORT}`);
    console.log(` Health check: http://localhost:${PORT}/api/health`);
    console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(` Resolver: Node.js native OS resolver (node:dns/promises)`);
    console.log(`====================================================`);
  });
};

startServer();

export default app;
