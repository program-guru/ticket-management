import timeout from 'connect-timeout';
import type { Request, Response, NextFunction } from 'express';

// Define timeout options
const TIMEOUT_DURATION = '5s';

// Create timeout middleware
export const requestTimeout = timeout(TIMEOUT_DURATION);

// Middleware to halt execution if request timed out
export const haltOnTimedout = (req: Request, res: Response, next: NextFunction) => {
  if (!req.timedout) {
    next();
  }
};