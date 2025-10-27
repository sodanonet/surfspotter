import axios from 'axios';
import NodeCache from 'node-cache';
import { TideData } from '../models/TideData';

const cache = new NodeCache({ stdTTL: parseInt(process.env.CACHE_TTL || '3600') });

interface TideResponse {
  extremes: Array<{
    dt: number;
    date: string;
    height: number;
    type: 'High' | 'Low';
  }>;
  heights: Array<{
    dt: number;
    date: string;
    height: number;
  }>;
}

export class TideService {
  private apiKey: string;
  private baseUrl = 'https://www.worldtides.info/api/v3';

  constructor() {
    this.apiKey = process.env.WORLDTIDES_API_KEY || '';
    if (!this.apiKey) {
      console.warn('⚠️  WORLDTIDES_API_KEY not set - using mock tide data');
    }
  }

  async getTideData(lat: number, lng: number, spotId?: string): Promise<TideResponse> {
    const cacheKey = `tide_${lat}_${lng}`;

    // Check memory cache
    const cached = cache.get<TideResponse>(cacheKey);
    if (cached) {
      console.log('📦 Returning tide data from memory cache');
      return cached;
    }

    // Check database cache if spotId provided
    if (spotId) {
      const dbCached = await TideData.findOne({
        spotId,
        expiresAt: { $gt: new Date() },
      }).sort({ timestamp: -1 });

      if (dbCached) {
        console.log('💾 Returning tide data from database cache');
        cache.set(cacheKey, dbCached.data);
        return dbCached.data;
      }
    }

    // Fetch from API or generate mock data
    console.log(this.apiKey ? '🌊 Fetching tide data from WorldTides API' : '🎭 Generating mock tide data');
    const response = this.apiKey
      ? await this.fetchFromAPI(lat, lng)
      : this.generateMockTideData();

    // Cache in memory
    cache.set(cacheKey, response);

    // Cache in database if spotId provided
    if (spotId) {
      await TideData.create({
        spotId,
        lat,
        lng,
        timestamp: new Date(),
        data: response,
        expiresAt: new Date(Date.now() + parseInt(process.env.CACHE_TTL || '3600') * 1000),
      });
    }

    return response;
  }

  private async fetchFromAPI(lat: number, lng: number): Promise<TideResponse> {
    try {
      const start = Math.floor(Date.now() / 1000);

      const response = await axios.get<any>(this.baseUrl, {
        params: {
          extremes: true,
          heights: true,
          lat,
          lon: lng,
          key: this.apiKey,
          start,
          length: 259200, // 3 days in seconds
        },
        timeout: 10000,
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      return {
        extremes: response.data.extremes || [],
        heights: response.data.heights || [],
      };
    } catch (error: any) {
      if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded');
      }
      if (error.message) {
        throw new Error(`WorldTides API error: ${error.message}`);
      }
      throw error;
    }
  }

  private generateMockTideData(): TideResponse {
    const now = Date.now() / 1000;
    const extremes: TideResponse['extremes'] = [];
    const heights: TideResponse['heights'] = [];

    // Generate tide extremes (high/low every ~6.2 hours)
    let currentTime = now;
    let isHigh = true;
    const baseHeight = 1.5; // meters
    const range = 0.8;

    for (let i = 0; i < 12; i++) {
      const height = isHigh
        ? baseHeight + range + Math.random() * 0.3
        : baseHeight - range - Math.random() * 0.3;

      extremes.push({
        dt: Math.floor(currentTime),
        date: new Date(currentTime * 1000).toISOString(),
        height: parseFloat(height.toFixed(2)),
        type: isHigh ? 'High' : 'Low',
      });

      currentTime += 6.2 * 3600; // ~6.2 hours
      isHigh = !isHigh;
    }

    // Generate height readings every 30 minutes for 3 days
    currentTime = now;
    for (let i = 0; i < 144; i++) { // 3 days * 48 readings per day
      // Create sinusoidal tide pattern
      const hoursSinceStart = (currentTime - now) / 3600;
      const tidePhase = (hoursSinceStart / 6.2) * Math.PI;
      const height = baseHeight + Math.sin(tidePhase) * range;

      heights.push({
        dt: Math.floor(currentTime),
        date: new Date(currentTime * 1000).toISOString(),
        height: parseFloat(height.toFixed(2)),
      });

      currentTime += 1800; // 30 minutes
    }

    return { extremes, heights };
  }
}
