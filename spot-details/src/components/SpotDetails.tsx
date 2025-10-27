import React, { useEffect, useState } from 'react';
import { api, Spot, ScoreData } from '../services/api';
import { ScoreDisplay } from './ScoreDisplay';
import './SpotDetails.css';

interface SpotDetailsProps {
  spotId: string;
}

export const SpotDetails: React.FC<SpotDetailsProps> = ({ spotId }) => {
  const [spot, setSpot] = useState<Spot | null>(null);
  const [score, setScore] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (spotId) {
      loadSpotData();
    }
  }, [spotId]);

  const loadSpotData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch spot details
      const spotData = await api.getSpot(spotId);
      setSpot(spotData);

      // Fetch score data
      const scoreData = await api.getScore(spotId);
      setScore(scoreData);

      // TODO: Fetch tide and weather data when services are available
      // const [lng, lat] = spotData.location.coordinates;
      // const [tideData, weatherData] = await Promise.all([
      //   api.getTideData(lat, lng, spotId),
      //   api.getWeatherData(lat, lng),
      // ]);
      // setTide(tideData);
      // setWeather(weatherData);

    } catch (err: any) {
      console.error('Error loading spot data:', err);
      setError(err.message || 'Failed to load spot data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="spot-details-container">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-base-content text-sm sm:text-base">Loading spot details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="spot-details-container">
        <div className="alert alert-error shadow-lg">
          <div className="flex flex-col gap-3 w-full">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-bold">Error loading spot data</span>
            </div>
            <p className="text-sm">{error}</p>
            <button className="btn btn-sm btn-outline" onClick={loadSpotData}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!spot || !score) {
    return (
      <div className="spot-details-container">
        <div className="alert alert-warning shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>No data available for this spot</span>
        </div>
      </div>
    );
  }

  return (
    <div className="spot-details-container">
      {/* Spot Header */}
      <div className="card bg-base-100 shadow-xl mb-4">
        <div className="card-body p-3 sm:p-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-base-content mb-3">
            {spot.name}
          </h1>

          <div className="flex flex-wrap gap-2 mb-3">
            <div className={`badge badge-lg ${
              spot.difficulty === 'beginner' ? 'badge-success' :
              spot.difficulty === 'intermediate' ? 'badge-warning' :
              spot.difficulty === 'advanced' ? 'badge-error' :
              'badge-error'
            }`}>
              {spot.difficulty.charAt(0).toUpperCase() + spot.difficulty.slice(1)}
            </div>

            {spot.tags.map((tag, index) => (
              <div key={index} className="badge badge-outline badge-primary">
                {tag}
              </div>
            ))}
          </div>

          {spot.description && (
            <p className="text-sm sm:text-base text-base-content opacity-80 leading-relaxed">
              {spot.description}
            </p>
          )}
        </div>
      </div>

      {/* AI Score */}
      <ScoreDisplay
        score={score.score}
        summary={score.summary}
        recommendation={score.recommendation}
      />

      {/* Placeholder for Tide and Weather - Coming Soon */}
      <div className="card bg-base-200 shadow-xl mb-4">
        <div className="card-body p-3 sm:p-6">
          <h3 className="card-title text-base sm:text-lg mb-2">
            <span>🌊</span> Tide & Weather Data
          </h3>
          <p className="text-sm text-base-content opacity-70">
            Tide and weather services coming soon! Once implemented, you'll see:
          </p>
          <ul className="list-disc list-inside text-xs sm:text-sm text-base-content opacity-70 mt-2 space-y-1">
            <li>24-hour tide chart with high/low predictions</li>
            <li>Current wave height, period, and direction</li>
            <li>Wind speed and direction</li>
            <li>Hourly forecast trends</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
