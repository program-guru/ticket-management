import passport from 'passport';
import type { Request, Response, NextFunction } from 'express';
import AppError from '../utils/app.error.ts';
import type { IUser } from '../models/user.model.ts';

// Authenticate Middleware
// This checks if the user is logged in (valid JWT)
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: IUser, info: any) => {
    // Handle errors (e.g., DB error)
    if (err) {
      return next(err);
    }

    // Handle invalid token / no token
    if (!user) {
      // Differentiate between "No Token" and "Expired Token" for clarity
      let message = 'You are not logged in! Please log in to get access.';
      if (info && info.name === 'TokenExpiredError') {
        message = 'Your token has expired! Please log in again.';
      }
      return next(new AppError(message, 401));
    }

    // Success: Attach user to request
    req.user = user;
    next();
  })(req, res, next);
};

// Authorization Middleware (Roles)
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new AppError('User not authenticated', 401));
    }
    
    // We need to cast req.user to IUser to access the .role property
    const user = req.user as IUser;

    if (!roles.includes(user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};