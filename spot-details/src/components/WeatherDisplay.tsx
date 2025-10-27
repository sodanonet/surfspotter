import React from 'react';

interface WeatherDisplayProps {
  current: {
    waveHeight: number;
    waveDirection: number;
    wavePeriod: number;
    windSpeed: number;
    windDirection: number;
  };
}

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ current }) => {
  const getDirectionLabel = (degrees: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  return (
    <div className="card bg-base-100 shadow-xl mb-4">
      <div className="card-body p-3 sm:p-6">
        <h3 className="card-title text-base sm:text-lg mb-3">
          <span className="text-wave-500">🌤️</span> Current Conditions
        </h3>

        {/* Responsive Grid - 2 columns on mobile, 3 on tablet, 5 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-gradient-to-br from-ocean-50 to-ocean-100 p-3 sm:p-4 rounded-lg text-center">
            <div className="text-2xl sm:text-3xl mb-2">🌊</div>
            <div className="text-xs text-ocean-600 font-semibold mb-1">Wave Height</div>
            <div className="text-lg sm:text-xl font-bold text-ocean-900">
              {current.waveHeight.toFixed(1)}m
            </div>
            <div className="text-xs text-ocean-500 mt-1">
              ({(current.waveHeight * 3.28).toFixed(1)} ft)
            </div>
          </div>

          <div className="bg-gradient-to-br from-wave-50 to-wave-100 p-3 sm:p-4 rounded-lg text-center">
            <div className="text-2xl sm:text-3xl mb-2">⏱️</div>
            <div className="text-xs text-wave-600 font-semibold mb-1">Wave Period</div>
            <div className="text-lg sm:text-xl font-bold text-wave-900">
              {current.wavePeriod.toFixed(0)}s
            </div>
          </div>

          <div className="bg-gradient-to-br from-sky-50 to-sky-100 p-3 sm:p-4 rounded-lg text-center">
            <div className="text-2xl sm:text-3xl mb-2">🧭</div>
            <div className="text-xs text-sky-600 font-semibold mb-1">Wave Direction</div>
            <div className="text-lg sm:text-xl font-bold text-sky-900">
              {getDirectionLabel(current.waveDirection)}
            </div>
            <div className="text-xs text-sky-500 mt-1">({current.waveDirection}°)</div>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-3 sm:p-4 rounded-lg text-center">
            <div className="text-2xl sm:text-3xl mb-2">💨</div>
            <div className="text-xs text-cyan-600 font-semibold mb-1">Wind Speed</div>
            <div className="text-lg sm:text-xl font-bold text-cyan-900">
              {current.windSpeed.toFixed(1)} m/s
            </div>
            <div className="text-xs text-cyan-500 mt-1">
              ({(current.windSpeed * 2.237).toFixed(1)} mph)
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-3 sm:p-4 rounded-lg text-center col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="text-2xl sm:text-3xl mb-2">➡️</div>
            <div className="text-xs text-teal-600 font-semibold mb-1">Wind Direction</div>
            <div className="text-lg sm:text-xl font-bold text-teal-900">
              {getDirectionLabel(current.windDirection)}
            </div>
            <div className="text-xs text-teal-500 mt-1">({current.windDirection}°)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
