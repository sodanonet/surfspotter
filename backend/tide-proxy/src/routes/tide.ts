import express, { Request, Response } from 'express';
import { TideService } from '../services/tideService';

const router = express.Router();
const tideService = new TideService();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { lat, lng, spotId } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng are required' });
    }

    const data = await tideService.getTideData(
      parseFloat(lat as string),
      parseFloat(lng as string),
      spotId as string | undefined
    );

    res.json(data);
  } catch (error: any) {
    console.error('Error fetching tide data:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch tide data' });
  }
});

export default router;
