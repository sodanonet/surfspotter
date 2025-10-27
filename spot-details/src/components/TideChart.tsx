import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format } from 'date-fns';

interface TideChartProps {
  data: Array<{
    dt: number;
    height: number;
  }>;
  extremes: Array<{
    dt: number;
    type: 'High' | 'Low';
    height: number;
  }>;
}

export const TideChart: React.FC<TideChartProps> = ({ data, extremes }) => {
  const chartData = data.slice(0, 48).map((point) => ({
    time: point.dt * 1000,
    height: point.height,
    formattedTime: format(new Date(point.dt * 1000), 'HH:mm'),
  }));

  const now = Date.now();

  return (
    <div className="card bg-base-100 shadow-xl mb-4">
      <div className="card-body p-3 sm:p-6">
        <h3 className="card-title text-base sm:text-lg mb-3">
          <span className="text-ocean-600">🌊</span> Tide Chart (Next 24 Hours)
        </h3>

        {/* Responsive Chart - Smaller on mobile */}
        <div className="w-full h-[200px] sm:h-[250px] md:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="formattedTime"
                interval={5}
                tick={{ fontSize: 10 }}
                stroke="#6b7280"
              />
              <YAxis
                label={{ value: 'Height (m)', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }}
                tick={{ fontSize: 10 }}
                stroke="#6b7280"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #0ea5e9',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                labelFormatter={(value) => `Time: ${value}`}
                formatter={(value: number) => [`${value.toFixed(2)}m`, 'Height']}
              />
              <ReferenceLine x={now} stroke="#f97316" strokeDasharray="3 3" label={{ value: 'Now', fill: '#f97316', fontSize: 10 }} />
              <Line
                type="monotone"
                dataKey="height"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* High/Low Tides Grid - Mobile optimized */}
        <div className="mt-4">
          <h4 className="text-sm sm:text-base font-semibold mb-3 text-base-content">High/Low Tides</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {extremes.slice(0, 6).map((extreme, index) => (
              <div
                key={index}
                className={`badge badge-lg gap-2 p-3 justify-start ${
                  extreme.type === 'High' ? 'badge-primary' : 'badge-secondary'
                }`}
              >
                <div className="flex flex-col items-start text-left">
                  <span className="text-xs font-semibold">{extreme.type}</span>
                  <span className="text-xs">{format(new Date(extreme.dt * 1000), 'HH:mm')}</span>
                  <span className="text-xs font-bold">{extreme.height.toFixed(2)}m</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
