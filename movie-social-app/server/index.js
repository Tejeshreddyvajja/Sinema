import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import webhookRoutes from './routes/webhookRoutes.js';
import friendRequestRoutes from './routes/friendRequestRoutes.js';

// Configure dotenv with the correct path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());

// Important: Register the webhook route BEFORE the JSON parsing middleware
// because webhook verification needs the raw body
app.use('/api/webhooks', webhookRoutes);

// Standard JSON middleware for all other routes
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Test Route
app.get('/', (req, res) => {
  res.send('Server is running and connected to MongoDB!');
});

// API Routes for friend requests
app.use('/api/friend-requests', friendRequestRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

