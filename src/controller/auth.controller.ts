import type { Request, Response, NextFunction } from 'express';
import { registerService, loginService, logoutService, refreshTokenService } from '../services/auth.service.ts';
import AppError from '../utils/app.error.ts';

// Helper for setting cookies for access and refresh tokens
function setCookies(res: Response, accessToken: string, refreshToken: string) {
  // Access Token Cookie (Short lived: 15m)
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, 
  });

  // Refresh Token Cookie (Long lived: 7d)
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { user, accessToken, refreshToken } = await registerService(req.body);
    
    // Set Cookies
    setCookies(res, accessToken, refreshToken);

    // Send only user data 
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { user, accessToken, refreshToken } = await loginService(req.body);

    // Set Cookies
    setCookies(res, accessToken, refreshToken);

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    // Get token from cookie
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await logoutService(refreshToken);
    }

    // Clear cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    // Get the refresh token from the cookie
    const incomingRefreshToken = req.cookies.refreshToken;

    if (!incomingRefreshToken) {
      throw new AppError('No refresh token provided', 401);
    }

    // Call the service
    const { accessToken, refreshToken } = await refreshTokenService(incomingRefreshToken);

    // Set new cookies
    setCookies(res, accessToken, refreshToken);

    res.status(200).json({ success: true, message: 'Access token refreshed' });
  } catch (error) {
    next(error);
  }
}