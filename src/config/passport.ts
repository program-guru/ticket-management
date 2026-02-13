import { Strategy } from 'passport-jwt';
import type { StrategyOptions, VerifyCallback } from 'passport-jwt';
import type { Request } from 'express';
import User from '../models/user.model.ts';

// Custom Extractor: Read the token from the 'accessToken' cookie
const cookieExtractor = (req: Request) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['accessToken'];
  }
  return token;
};

// Configuration Options
const options: StrategyOptions = {
  // Custom extractor
  jwtFromRequest: cookieExtractor,
  // The secret key to verify the signature
  secretOrKey: process.env.JWT_ACCESS_SECRET as string,
};

// Verify Function
// This runs AFTER the token is successfully verified.
// payload = the decoded data inside the token (e.g., { id: '...' })
const verifyUser: VerifyCallback = async (payload, done) => {
  try {
    // Find the user specified in the token
    const user = await User.findById(payload.id);

    if (user) {
      // Success: Attach user to req.user
      return done(null, user);
    } else {
      // Fail: User deleted or invalid ID
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
};

// Export the configured strategy
export const jwtStrategy = new Strategy(options, verifyUser);