import express, { Request, Response } from 'express';
import { WeatherService } from '../services/weatherService';

const router = express.Router();
const weatherService = new WeatherService();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng are required' });
    }

    const data = await weatherService.getMarineWeather(
      parseFloat(lat as string),
      parseFloat(lng as string)
    );

    res.json(data);
  } catch (error: any) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
