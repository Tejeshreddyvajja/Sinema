import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import webhookRoutes from './routes/webhookRoutes.js';
import friendRequestRoutes from './routes/friendRequestRoutes.js';
import userRoutes from './routes/userRoutes.js';  // Updated import to use correctly named file

// Configure dotenv with the correct path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS - allow requests from frontend
app.use(cors({
  origin: 'http://localhost:5173', // Vite's default port
  credentials: true
}));

// Important: Register the webhook route BEFORE the JSON parsing middleware
// because webhook verification needs the raw body
app.use('/api/webhooks', webhookRoutes);

// Body parsing middleware - make sure it's properly configured
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  // Log body for non-GET requests
  if (req.method !== 'GET') {
    console.log('Request body:', req.body);
  }
  next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Test Route
app.get('/', (req, res) => {
  res.send('Server is running and connected to MongoDB!');
});

// API Routes
app.use('/api/friend-requests', friendRequestRoutes);
app.use('/api/users', userRoutes);  // Add user routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    message: 'Internal server error', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred' 
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

