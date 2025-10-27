import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import tideRouter from './routes/tide';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/tide', tideRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Tide Proxy is running' });
});

const startServer = async () => {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`🌊 Tide Proxy running on http://localhost:${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api/tide`);
  });
};

startServer();
