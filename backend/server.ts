import express from 'express';
import connectDB from './config/db';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { configurePassport } from './config/passport';

import authRouter from './routes/auth';
import grievanceRouter from './routes/grievance';
import adminRouter from './routes/admin';

dotenv.config();

// Validate environment variables first
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URL', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Required environment variable ${envVar} not found`);
    process.exit(1);
  }
}

connectDB();  // MongoDB connection
configurePassport();  // Passport configuration

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({
  secret: process.env.JWT_SECRET as string,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URL as string, // Use your MongoDB URL from environment variables
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60, // Session TTL in seconds (14 days)
  }),
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('API is running');
});

// Routes
app.use('/auth', authRouter);
app.use('/grievance', grievanceRouter);
app.use('/admin', adminRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
