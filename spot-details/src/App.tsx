import React, { useState } from 'react';
import { SpotDetails } from './components/SpotDetails';
import './App.css';

function App() {
  const [spotId, setSpotId] = useState<string>('');
  const [currentSpotId, setCurrentSpotId] = useState<string>('');

  const handleLoadSpot = () => {
    if (spotId.trim()) {
      setCurrentSpotId(spotId.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLoadSpot();
    }
  };

  return (
    <div className="App min-h-screen bg-base-200">
      {/* Header with spot ID input */}
      <div className="bg-primary text-primary-content shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            <div className="flex-shrink-0">
              <h1 className="text-lg sm:text-xl font-bold">Surf Spot Details</h1>
              <p className="text-xs opacity-80">View real-time surf conditions</p>
            </div>

            <div className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder="Enter Spot ID (e.g., 68f9f916a933cf2934c9996d)"
                value={spotId}
                onChange={(e) => setSpotId(e.target.value)}
                onKeyPress={handleKeyPress}
                className="input input-bordered flex-1 text-sm"
              />
              <button
                onClick={handleLoadSpot}
                className="btn btn-secondary btn-sm sm:btn-md"
                disabled={!spotId.trim()}
              >
                Load
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto py-4 sm:py-6">
        {currentSpotId ? (
          <SpotDetails spotId={currentSpotId} />
        ) : (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center p-6 sm:p-12">
              <div className="text-6xl mb-4">🏄</div>
              <h2 className="card-title justify-center text-xl sm:text-2xl mb-2">
                Welcome to Surf Spot Details
              </h2>
              <p className="text-base-content opacity-70 max-w-md mx-auto text-sm sm:text-base">
                Enter a spot ID above to view detailed surf conditions, AI-powered recommendations,
                and real-time data for any surf spot.
              </p>
              <div className="mt-6">
                <div className="alert alert-info text-left">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div className="text-xs sm:text-sm">
                    <p className="font-bold mb-1">Getting Started:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Make sure the backend API and AI Score Engine are running</li>
                      <li>Get a spot ID from the database (use the Map Viewer or API)</li>
                      <li>Enter the spot ID above and click "Load"</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
