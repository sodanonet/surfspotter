import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import weatherRouter from './routes/weather';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.use('/api/weather', weatherRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Weather Proxy is running' });
});

app.listen(PORT, () => {
  console.log(`🌤️  Weather Proxy running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api/weather`);
});
