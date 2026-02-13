import express from 'express';
import cookieParser from 'cookie-parser'; 
import authRoutes from './routes/auth.routes.ts';
import { notFoundHandler, globalErrorHandler } from './middlewares/error.middleware.ts';

const app = express();

app.use(express.json());
app.use(cookieParser()); 

app.use('/api/auth', authRoutes);

app.all('*', notFoundHandler);
app.use(globalErrorHandler);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});

