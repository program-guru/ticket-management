import type { Request, Response, NextFunction } from 'express';
import AppError from '../utils/app.error.ts';
import { getUsersService } from '../services/user.service.ts';

export async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.params.id as string | undefined;
    const data = await getUsersService(userId);

    res.status(200).json({ success: true, data });
  } catch (error) {
    if (req.timedout) return;
    next(error);
  }
}

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user; // This is set by the authenticate middleware

    if (!user) {
      throw new AppError('User not authenticated', 401);
    }

    // Send only user data 
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    if (req.timedout) return;
    next(error);
  }
}