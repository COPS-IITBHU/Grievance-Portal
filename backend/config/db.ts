import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not found');
    }
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

export default connectDB;
