import express, { Request, Response } from 'express';
import { Spot } from '../models/Spot';

const router = express.Router();

// GET /spots - Get all spots or filter by proximity
router.get('/', async (req: Request, res: Response) => {
  try {
    const { lat, lng, maxDistance } = req.query;

    let query;

    if (lat && lng) {
      // Geospatial query
      query = Spot.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lng as string), parseFloat(lat as string)],
            },
            $maxDistance: maxDistance ? parseInt(maxDistance as string) : 50000, // default 50km
          },
        },
      });
    } else {
      // Get all spots
      query = Spot.find();
    }

    const spots = await query.exec();
    res.json(spots);
  } catch (error) {
    console.error('Error fetching spots:', error);
    res.status(500).json({ error: 'Failed to fetch spots' });
  }
});

// GET /spots/:id - Get a single spot by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const spot = await Spot.findById(req.params.id);

    if (!spot) {
      return res.status(404).json({ error: 'Spot not found' });
    }

    res.json(spot);
  } catch (error) {
    console.error('Error fetching spot:', error);
    res.status(500).json({ error: 'Failed to fetch spot' });
  }
});

// POST /spots - Create a new spot
router.post('/', async (req: Request, res: Response) => {
  try {
    const spot = new Spot(req.body);
    await spot.save();
    res.status(201).json(spot);
  } catch (error) {
    console.error('Error creating spot:', error);
    res.status(400).json({ error: 'Failed to create spot' });
  }
});

export default router;
