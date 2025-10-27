import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3000';
const TIDE_API = process.env.REACT_APP_TIDE_API || 'http://localhost:3001';
const WEATHER_API = process.env.REACT_APP_WEATHER_API || 'http://localhost:3002';
const SCORE_API = process.env.REACT_APP_SCORE_API || 'http://localhost:3003';

export interface Spot {
  _id: string;
  name: string;
  location: {
    coordinates: [number, number];
  };
  difficulty: string;
  tags: string[];
  description?: string;
}

export interface TideData {
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

export interface WeatherData {
  current: {
    waveHeight: number;
    waveDirection: number;
    wavePeriod: number;
    windSpeed: number;
    windDirection: number;
  };
  hourly: Array<{
    time: string;
    waveHeight: number;
    windSpeed: number;
  }>;
}

export interface ScoreData {
  score: number;
  summary: string;
  recommendation: string;
  factors: {
    waveHeight: number;
    wavePeriod: number;
    windSpeed: number;
    difficulty: string;
  };
}

export const api = {
  async getSpot(spotId: string): Promise<Spot> {
    const response = await axios.get(`${API_BASE}/api/spots/${spotId}`);
    return response.data;
  },

  async getTideData(lat: number, lng: number, spotId: string): Promise<TideData> {
    const response = await axios.get(`${TIDE_API}/api/tide`, {
      params: { lat, lng, spotId },
    });
    return response.data;
  },

  async getWeatherData(lat: number, lng: number): Promise<WeatherData> {
    const response = await axios.get(`${WEATHER_API}/api/weather`, {
      params: { lat, lng },
    });
    return response.data;
  },

  async getScore(spotId: string): Promise<ScoreData> {
    const response = await axios.get(`${SCORE_API}/api/score`, {
      params: { spotId },
    });
    return response.data;
  },
};
