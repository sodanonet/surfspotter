import mongoose, { Schema, Document } from 'mongoose';

export interface ISpot extends Document {
  name: string;
  location: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  tags: string[];
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SpotSchema = new Schema<ISpot>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: function (coords: number[]) {
            return coords.length === 2 &&
                   coords[0] >= -180 && coords[0] <= 180 &&
                   coords[1] >= -90 && coords[1] <= 90;
          },
          message: 'Invalid coordinates',
        },
      },
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create geospatial index for location-based queries
SpotSchema.index({ location: '2dsphere' });

export const Spot = mongoose.model<ISpot>('Spot', SpotSchema);
