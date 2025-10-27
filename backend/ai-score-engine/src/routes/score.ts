import express, { Request, Response } from 'express';
import axios from 'axios';
import { Score } from '../models/Score';
import { ScoringService } from '../services/scoringService';

const router = express.Router();
const scoringService = new ScoringService();

// GET /score?spotId=xxx - Get or calculate score for a spot
router.get('/', async (req: Request, res: Response) => {
  try {
    const { spotId } = req.query;

    if (!spotId) {
      return res.status(400).json({ error: 'spotId query parameter is required' });
    }

    // Check if we have a recent score (less than 1 hour old)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    let score = await Score.findOne({
      spotId: spotId as string,
      timestamp: { $gte: oneHourAgo },
    }).sort({ timestamp: -1 });

    if (score) {
      // Return cached score
      return res.json(score);
    }

    // Fetch spot details from spots API
    const spotsApiUrl = process.env.SPOTS_API_URL || 'http://localhost:3000/api/spots';
    const spotResponse = await axios.get<any>(`${spotsApiUrl}/${spotId}`);
    const spot = spotResponse.data;

    // Extract coordinates
    const [lng, lat] = spot.location.coordinates;

    // Calculate new score
    const scoringResult = await scoringService.calculateScore(
      spotId as string,
      spot.name as string,
      spot.difficulty as string,
      lat,
      lng
    );

    // Save score to database
    score = new Score({
      spotId: spotId as string,
      timestamp: new Date(),
      score: scoringResult.score,
      factors: scoringResult.factors,
      summary: scoringResult.summary,
      recommendation: scoringResult.recommendation,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // Expires in 1 hour
    });

    await score.save();

    res.json(score);
  } catch (error: any) {
    console.error('Error calculating score:', error);
    res.status(500).json({
      error: 'Failed to calculate score',
      message: error.message,
    });
  }
});

// GET /scores - Get all scores
router.get('/all', async (req: Request, res: Response) => {
  try {
    const scores = await Score.find().sort({ score: -1 });
    res.json(scores);
  } catch (error) {
    console.error('Error fetching scores:', error);
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
});

export default router;
