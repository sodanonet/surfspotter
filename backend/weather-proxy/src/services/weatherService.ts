import axios from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: parseInt(process.env.CACHE_TTL || '1800') });

interface MarineWeatherData {
  current: {
    time: string;
    waveHeight: number;
    waveDirection: number;
    wavePeriod: number;
    windSpeed: number;
    windDirection: number;
    temperature: number;
  };
  hourly: Array<{
    time: string;
    waveHeight: number;
    waveDirection: number;
    wavePeriod: number;
    windSpeed: number;
    windDirection: number;
  }>;
}

export class WeatherService {
  private baseUrl = 'https://marine-api.open-meteo.com/v1/marine';

  async getMarineWeather(lat: number, lng: number): Promise<MarineWeatherData> {
    const cacheKey = `weather_${lat}_${lng}`;

    const cached = cache.get<MarineWeatherData>(cacheKey);
    if (cached) {
      console.log('📦 Returning weather data from cache');
      return cached;
    }

    console.log('🌤️  Fetching weather data from Open-Meteo');
    const data = await this.fetchFromAPI(lat, lng);

    cache.set(cacheKey, data);
    return data;
  }

  private async fetchFromAPI(lat: number, lng: number): Promise<MarineWeatherData> {
    try {
      const response = await axios.get<any>(this.baseUrl, {
        params: {
          latitude: lat,
          longitude: lng,
          current: 'wave_height,wave_direction,wave_period,wind_wave_height,wind_wave_direction,wind_wave_period',
          hourly: 'wave_height,wave_direction,wave_period,wind_wave_height,wind_wave_direction',
          timezone: 'auto',
          forecast_days: 3,
        },
        timeout: 10000,
      });

      const current = response.data.current;
      const hourly = response.data.hourly;

      return {
        current: {
          time: current.time,
          waveHeight: current.wave_height || 0,
          waveDirection: current.wave_direction || 0,
          wavePeriod: current.wave_period || 0,
          windSpeed: current.wind_wave_height || 0,
          windDirection: current.wind_wave_direction || 0,
          temperature: 0, // Open-Meteo marine doesn't include temp
        },
        hourly: hourly.time.slice(0, 72).map((time: string, index: number) => ({
          time,
          waveHeight: hourly.wave_height[index] || 0,
          waveDirection: hourly.wave_direction[index] || 0,
          wavePeriod: hourly.wave_period[index] || 0,
          windSpeed: hourly.wind_wave_height[index] || 0,
          windDirection: hourly.wind_wave_direction[index] || 0,
        })),
      };
    } catch (error: any) {
      if (error.message) {
        throw new Error(`Open-Meteo API error: ${error.message}`);
      }
      throw error;
    }
  }
}
