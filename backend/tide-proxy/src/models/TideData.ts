import mongoose, { Schema, Document } from 'mongoose';

export interface ITideData extends Document {
  spotId: string;
  lat: number;
  lng: number;
  timestamp: Date;
  data: {
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
  };
  expiresAt: Date;
}

const TideDataSchema = new Schema<ITideData>(
  {
    spotId: { type: String, required: true, index: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    timestamp: { type: Date, required: true },
    data: {
      extremes: [
        {
          dt: Number,
          date: String,
          height: Number,
          type: { type: String, enum: ['High', 'Low'] },
        },
      ],
      heights: [
        {
          dt: Number,
          date: String,
          height: Number,
        },
      ],
    },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

// TTL index for automatic cleanup
TideDataSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const TideData = mongoose.model<ITideData>('TideData', TideDataSchema);
