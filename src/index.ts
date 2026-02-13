import express from 'express';
import cookieParser from 'cookie-parser'; 
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(express.json());
app.use(cookieParser()); 

app.use('/api/auth', authRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});

