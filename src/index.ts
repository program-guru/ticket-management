import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import authRoutes from './routes/auth.routes.ts';
import connectDB from './config/database.ts';

import { notFoundHandler, globalErrorHandler } from './middlewares/error.middleware.ts';
import { jwtStrategy } from './config/passport.ts';

// Connect to the database
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());
passport.use(jwtStrategy);



// Routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(globalErrorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

