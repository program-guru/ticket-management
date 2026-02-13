import jwt from 'jsonwebtoken';
import AppError from './app.error.ts';

interface TokenPayload {
  id: string;
}

export const generateAccessToken = (id: string): string => {
  if (!process.env.JWT_ACCESS_SECRET) {
    throw new AppError('JWT_ACCESS_SECRET is not defined', 500);
  }

  return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });
};

export const generateRefreshToken = (id: string): string => {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new AppError('JWT_REFRESH_SECRET is not defined', 500);
  }

  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new AppError('JWT_REFRESH_SECRET is not defined', 500);
  }
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET) as TokenPayload;
};  