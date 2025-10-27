import axios from 'axios';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface SurfConditions {
  waveHeight: number;
  waveDirection: number;
  wavePeriod: number;
  tideHeight: number;
  tidePhase: 'rising' | 'falling' | 'high' | 'low';
  windSpeed: number;
  windDirection: number;
  userRating?: number;
  spotName: string;
  difficulty: string;
}

interface ScoringResult {
  score: number;
  summary: string;
  recommendation: string;
  factors: SurfConditions;
}

export class ScoringService {
  /**
   * Get comprehensive surf conditions by fetching data from multiple services
   */
  async getConditions(spotId: string, lat: number, lng: number, spotName: string, difficulty: string): Promise<SurfConditions> {
    try {
      // Fetch weather data from weather proxy
      const weatherResponse = await axios.get(process.env.WEATHER_API_URL || 'http://localhost:3002/api/weather', {
        params: { lat, lng },
        timeout: 5000,
      });

      const weather = weatherResponse.data.current;

      // Fetch tide data from tide proxy
      const tideResponse = await axios.get(process.env.TIDE_API_URL || 'http://localhost:3001/api/tide', {
        params: { lat, lng, spotId },
        timeout: 5000,
      });

      const tideData = tideResponse.data;
      const currentTide = this.getCurrentTideInfo(tideData);

      // Get user rating (if available)
      const userRating = await this.getUserRating(spotId);

      return {
        waveHeight: weather.waveHeight || 0,
        waveDirection: weather.waveDirection || 0,
        wavePeriod: weather.wavePeriod || 0,
        tideHeight: currentTide.height,
        tidePhase: currentTide.phase,
        windSpeed: weather.windSpeed || 0,
        windDirection: weather.windDirection || 0,
        userRating,
        spotName,
        difficulty,
      };
    } catch (error: any) {
      console.error('Error fetching conditions:', error.message);
      // Return mock data if external APIs are unavailable
      return this.getMockConditions(spotName, difficulty);
    }
  }

  /**
   * Extract current tide information from tide data
   */
  private getCurrentTideInfo(tideData: any): { height: number; phase: 'rising' | 'falling' | 'high' | 'low' } {
    try {
      const now = Date.now() / 1000; // Convert to seconds
      const heights = tideData.heights || [];
      
      // Find closest tide height to current time
      let closestHeight = heights[0];
      let minDiff = Math.abs(heights[0].dt - now);
      
      for (const height of heights) {
        const diff = Math.abs(height.dt - now);
        if (diff < minDiff) {
          minDiff = diff;
          closestHeight = height;
        }
      }

      // Determine tide phase
      const extremes = tideData.extremes || [];
      let phase: 'rising' | 'falling' | 'high' | 'low' = 'rising';
      
      for (let i = 0; i < extremes.length - 1; i++) {
        if (extremes[i].dt <= now && now <= extremes[i + 1].dt) {
          if (extremes[i].type === 'Low' && extremes[i + 1].type === 'High') {
            phase = 'rising';
          } else if (extremes[i].type === 'High' && extremes[i + 1].type === 'Low') {
            phase = 'falling';
          }
          break;
        }
      }

      // Check if we're at an extreme
      for (const extreme of extremes) {
        if (Math.abs(extreme.dt - now) < 600) { // Within 10 minutes
          phase = extreme.type === 'High' ? 'high' : 'low';
          break;
        }
      }

      return {
        height: closestHeight?.height || 1.5,
        phase,
      };
    } catch (error) {
      console.error('Error processing tide data:', error);
      return { height: 1.5, phase: 'rising' };
    }
  }

  /**
   * Get user rating from database (stub for now)
   */
  private async getUserRating(spotId: string): Promise<number | undefined> {
    // TODO: Fetch from user-feedback service when available
    // For now, return undefined
    return undefined;
  }

  /**
   * Generate mock conditions when APIs are unavailable
   */
  private getMockConditions(spotName: string, difficulty: string): SurfConditions {
    return {
      waveHeight: this.getRandomInRange(0.5, 3.0),
      waveDirection: this.getRandomInRange(0, 360),
      wavePeriod: this.getRandomInRange(8, 16),
      tideHeight: this.getRandomInRange(0.5, 2.5),
      tidePhase: ['rising', 'falling', 'high', 'low'][Math.floor(Math.random() * 4)] as any,
      windSpeed: this.getRandomInRange(5, 25),
      windDirection: this.getRandomInRange(0, 360),
      userRating: undefined,
      spotName,
      difficulty,
    };
  }

  /**
   * Calculate surf score using AI and comprehensive conditions
   */
  async calculateScore(spotId: string, spotName: string, difficulty: string, lat: number, lng: number): Promise<ScoringResult> {
    // Get current conditions
    const conditions = await this.getConditions(spotId, lat, lng, spotName, difficulty);

    // Calculate base score (0-100)
    const baseScore = this.calculateBaseScore(conditions);

    // Generate AI summary and recommendation
    let summary: string;
    let recommendation: string;

    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
      // Use OpenAI for natural language generation
      const aiResult = await this.generateAISummary(conditions, baseScore);
      summary = aiResult.summary;
      recommendation = aiResult.recommendation;
    } else {
      // Fallback to rule-based generation
      console.log('OpenAI API key not configured, using fallback generation');
      summary = this.generateSummary(baseScore, conditions);
      recommendation = this.generateRecommendation(baseScore, conditions.difficulty);
    }

    return {
      score: baseScore,
      summary,
      recommendation,
      factors: conditions,
    };
  }

  /**
   * Calculate base score using rule-based algorithm
   */
  private calculateBaseScore(conditions: SurfConditions): number {
    let score = 50; // Start at 50

    // Wave height scoring (+/- 30 points)
    if (conditions.waveHeight >= 1.5 && conditions.waveHeight <= 2.5) {
      score += 20; // Ideal wave height
    } else if (conditions.waveHeight < 0.8 || conditions.waveHeight > 3.5) {
      score -= 15; // Too small or too large
    }

    // Wave period scoring (+/- 20 points)
    if (conditions.wavePeriod >= 12) {
      score += 15; // Good period for quality waves
    } else if (conditions.wavePeriod < 10) {
      score -= 10; // Short period, choppy conditions
    }

    // Wind speed scoring (+/- 20 points)
    if (conditions.windSpeed < 10) {
      score += 15; // Light wind, clean conditions
    } else if (conditions.windSpeed > 20) {
      score -= 15; // Strong wind, blown out
    }

    // Tide phase scoring (+/- 15 points)
    if (conditions.tidePhase === 'rising' || conditions.tidePhase === 'falling') {
      score += 10; // Moving tide is generally good
    } else if (conditions.tidePhase === 'high') {
      score += 5; // High tide can be good for some spots
    }

    // User rating bonus (+/- 10 points)
    if (conditions.userRating) {
      score += (conditions.userRating - 3) * 5; // Adjust based on rating (1-5 scale)
    }

    // Difficulty adjustment (+/- 10 points)
    const difficultyMap: Record<string, number> = {
      beginner: 5,
      intermediate: 0,
      advanced: -5,
      expert: -10,
    };
    score += difficultyMap[conditions.difficulty] || 0;

    // Clamp score between 0 and 100
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Generate AI-powered summary and recommendation using OpenAI
   */
  private async generateAISummary(conditions: SurfConditions, score: number): Promise<{ summary: string; recommendation: string }> {
    try {
      const prompt = `You are a professional surf forecaster. Analyze the following surf conditions and provide a brief summary and recommendation.

Surf Spot: ${conditions.spotName}
Difficulty Level: ${conditions.difficulty}
Overall Score: ${score}/100

Current Conditions:
- Wave Height: ${conditions.waveHeight.toFixed(1)}m (${(conditions.waveHeight * 3.28).toFixed(1)}ft)
- Wave Period: ${conditions.wavePeriod.toFixed(0)} seconds
- Wave Direction: ${this.getDirectionLabel(conditions.waveDirection)}
- Tide: ${conditions.tideHeight.toFixed(2)}m (${conditions.tidePhase})
- Wind Speed: ${conditions.windSpeed.toFixed(1)} m/s (${(conditions.windSpeed * 2.237).toFixed(1)} mph)
- Wind Direction: ${this.getDirectionLabel(conditions.windDirection)}
${conditions.userRating ? `- User Rating: ${conditions.userRating}/5 stars` : ''}

Please provide:
1. A one-sentence summary of the conditions (max 150 characters)
2. A one-sentence recommendation for surfers (max 150 characters)

Format your response as JSON:
{
  "summary": "your summary here",
  "recommendation": "your recommendation here"
}`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional surf forecaster providing brief, accurate surf condition assessments.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 200,
      });

      const responseText = completion.choices[0].message.content || '';
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return {
          summary: result.summary || this.generateSummary(score, conditions),
          recommendation: result.recommendation || this.generateRecommendation(score, conditions.difficulty),
        };
      } else {
        throw new Error('Failed to parse OpenAI response');
      }
    } catch (error: any) {
      console.error('Error generating AI summary:', error.message);
      // Fallback to rule-based generation
      return {
        summary: this.generateSummary(score, conditions),
        recommendation: this.generateRecommendation(score, conditions.difficulty),
      };
    }
  }

  /**
   * Get direction label from degrees
   */
  private getDirectionLabel(degrees: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  }

  /**
   * Fallback summary generation (rule-based)
   */
  private generateSummary(score: number, conditions: SurfConditions): string {
    if (score >= 75) {
      return `Excellent conditions! ${conditions.waveHeight.toFixed(1)}m waves with ${conditions.wavePeriod.toFixed(0)}s period and light ${conditions.windSpeed.toFixed(0)}mph winds.`;
    } else if (score >= 50) {
      return `Good surfing conditions. ${conditions.waveHeight.toFixed(1)}m waves, ${conditions.wavePeriod.toFixed(0)}s period, ${conditions.windSpeed.toFixed(0)}mph winds.`;
    } else if (score >= 25) {
      return `Fair conditions. ${conditions.waveHeight.toFixed(1)}m waves with ${conditions.windSpeed.toFixed(0)}mph winds. Conditions could be better.`;
    } else {
      return `Poor conditions. Small ${conditions.waveHeight.toFixed(1)}m waves and/or strong ${conditions.windSpeed.toFixed(0)}mph winds.`;
    }
  }

  /**
   * Fallback recommendation generation (rule-based)
   */
  private generateRecommendation(score: number, difficulty: string): string {
    if (score >= 75) {
      return `Perfect day to surf! Conditions are ideal for ${difficulty} surfers.`;
    } else if (score >= 50) {
      return `Go surf! Good conditions for ${difficulty} level.`;
    } else if (score >= 25) {
      return `Surfable but not ideal. Best for experienced ${difficulty === 'beginner' ? 'intermediate' : difficulty} surfers.`;
    } else {
      return `Consider waiting for better conditions. Not recommended for ${difficulty} surfers today.`;
    }
  }

  /**
   * Generate random number in range
   */
  private getRandomInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}
