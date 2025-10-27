import mongoose, { Schema, Document } from 'mongoose';

export interface IScore extends Document {
  spotId: string;
  timestamp: Date;
  score: number;
  factors: {
    waveHeight: number;
    waveDirection: number;
    wavePeriod: number;
    tideHeight: number;
    tidePhase: 'rising' | 'falling' | 'high' | 'low';
    windSpeed: number;
    windDirection: number;
    userRating?: number;
    difficulty: string;
  };
  summary: string;
  recommendation: string;
  expiresAt: Date;
}

const ScoreSchema = new Schema<IScore>(
  {
    spotId: { type: String, required: true, index: true },
    timestamp: { type: Date, required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    factors: {
      waveHeight: Number,
      waveDirection: Number,
      wavePeriod: Number,
      tideHeight: Number,
      tidePhase: { type: String, enum: ['rising', 'falling', 'high', 'low'] },
      windSpeed: Number,
      windDirection: Number,
      userRating: Number,
      difficulty: String,
    },
    summary: { type: String, required: true },
    recommendation: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

// TTL index - MongoDB will automatically delete expired documents
ScoreSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Score = mongoose.model<IScore>('Score', ScoreSchema);
