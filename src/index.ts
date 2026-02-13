import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; 
import authRoutes from './routes/auth.routes.ts';
import connectDB from './config/database.ts';
import { notFoundHandler, globalErrorHandler } from './middlewares/error.middleware.ts';

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser()); 

app.use('/api/auth', authRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

