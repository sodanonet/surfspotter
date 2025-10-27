import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import scoreRouter from './routes/score';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/score', scoreRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Score Engine is running' });
});

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Start listening
    app.listen(PORT, () => {
      console.log(`AI Score Engine running on http://localhost:${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api/score`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
