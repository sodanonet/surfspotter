import dotenv from 'dotenv';
import { connectDatabase } from '../config/database';
import { Spot } from '../models/Spot';

// Load environment variables
dotenv.config();

const surfSpots = [
  {
    name: 'Malibu',
    location: {
      type: 'Point',
      coordinates: [-118.7798, 34.0259], // [longitude, latitude]
    },
    difficulty: 'intermediate',
    tags: ['point-break', 'right-hander', 'longboard-friendly'],
    description: 'Famous point break with consistent waves, perfect for longboarding',
  },
  {
    name: 'Huntington Beach',
    location: {
      type: 'Point',
      coordinates: [-117.9988, 33.6595],
    },
    difficulty: 'beginner',
    tags: ['beach-break', 'consistent', 'contest-site'],
    description: 'Surf City USA - consistent beach break with waves for all levels',
  },
  {
    name: 'Trestles',
    location: {
      type: 'Point',
      coordinates: [-117.5931, 33.3825],
    },
    difficulty: 'intermediate',
    tags: ['point-break', 'world-class', 'cobblestone'],
    description: 'World-class cobblestone point break with multiple peaks',
  },
  {
    name: 'Rincon',
    location: {
      type: 'Point',
      coordinates: [-119.4795, 34.3733],
    },
    difficulty: 'advanced',
    tags: ['point-break', 'right-hander', 'winter-waves'],
    description: 'Queen of the Coast - long, perfect right-hand point break',
  },
  {
    name: 'Black\'s Beach',
    location: {
      type: 'Point',
      coordinates: [-117.2506, 32.8898],
    },
    difficulty: 'expert',
    tags: ['beach-break', 'powerful', 'big-waves'],
    description: 'Powerful beach break known for big winter swells and expert surfers',
  },
];

const seedDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await connectDatabase();

    console.log('Clearing existing spots...');
    await Spot.deleteMany({});

    console.log('Seeding surf spots...');
    const spots = await Spot.insertMany(surfSpots);

    console.log(`✅ Successfully seeded ${spots.length} surf spots:`);
    spots.forEach(spot => {
      console.log(`   - ${spot.name} (${spot.difficulty})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
