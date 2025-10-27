import React from 'react';

interface ScoreDisplayProps {
  score: number;
  summary: string;
  recommendation: string;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, summary, recommendation }) => {
  const getScoreColor = (score: number): string => {
    if (score >= 75) return '#4CAF50'; // Green
    if (score >= 50) return '#FFC107'; // Yellow
    if (score >= 25) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 75) return 'Excellent';
    if (score >= 50) return 'Good';
    if (score >= 25) return 'Fair';
    return 'Poor';
  };

  const getScoreBgClass = (score: number): string => {
    if (score >= 75) return 'bg-gradient-to-br from-green-50 to-green-100 border-green-300';
    if (score >= 50) return 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300';
    if (score >= 25) return 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300';
    return 'bg-gradient-to-br from-red-50 to-red-100 border-red-300';
  };

  return (
    <div className="card bg-base-100 shadow-xl mb-4">
      <div className="card-body p-3 sm:p-6">
        <h3 className="card-title text-base sm:text-lg mb-3">
          <span className="text-sunset-500">🤖</span> AI Surf Score
        </h3>

        {/* Mobile-first layout: Stack on mobile, side-by-side on tablet+ */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Score Circle */}
          <div className="flex-shrink-0 flex justify-center">
            <div
              className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center"
              style={{
                background: `conic-gradient(${getScoreColor(score)} ${score * 3.6}deg, #e0e0e0 0deg)`,
              }}
            >
              <div className="absolute inset-2 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                <div className="text-3xl sm:text-4xl font-bold" style={{ color: getScoreColor(score) }}>
                  {score}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 font-semibold">
                  {getScoreLabel(score)}
                </div>
              </div>
            </div>
          </div>

          {/* Score Details */}
          <div className="flex-1 space-y-3 sm:space-y-4">
            <div className={`p-3 sm:p-4 rounded-lg border-2 ${getScoreBgClass(score)}`}>
              <h4 className="text-sm sm:text-base font-bold mb-2 flex items-center gap-2">
                <span>📝</span> Summary
              </h4>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{summary}</p>
            </div>

            <div className={`p-3 sm:p-4 rounded-lg border-2 ${getScoreBgClass(score)}`}>
              <h4 className="text-sm sm:text-base font-bold mb-2 flex items-center gap-2">
                <span>💡</span> Recommendation
              </h4>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">{recommendation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
