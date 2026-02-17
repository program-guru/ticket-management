import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.ts';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import authRoutes from './routes/auth.routes.ts';
import userRoutes from './routes/user.routes.ts';
import ticketRoutes from './routes/ticket.routes.ts';
import commentRoutes from './routes/comment.routes.ts';
import reportRoutes from './routes/report.route.ts';
import connectDB from './config/database.ts';
import rateLimiter from './config/rateLimit.ts';
import { notFoundHandler, globalErrorHandler } from './middlewares/error.middleware.ts';
import { ticketAssignmentJob } from './jobs/ticketAssignment.job.ts';
import { ticketClosingJob } from './jobs/ticketClosing.job.ts';
import { jwtStrategy } from './config/passport.ts';

// Connect to the database
connectDB();

// Start background jobs
ticketAssignmentJob.start();
ticketClosingJob.start();

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(rateLimiter);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(passport.initialize());
passport.use(jwtStrategy);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/reports', reportRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(globalErrorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

