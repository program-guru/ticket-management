import type { Request, Response, NextFunction } from 'express';
import AppError from '../utils/app.error.ts';
import { getAllUsersService, getUserByIdService } from '../services/users.service.ts';

export async function users(req: Request, res: Response, next: NextFunction) {
  try {
    const { users } = await getAllUsersService();
    
    // Send only user data 
    res.status(201).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
}

export async function user(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.params.id as string; 
    const { user } = await getUserByIdService(userId);
    
    // Send only user data 
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function profile(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user; // This is set by the authenticate middleware
    
    if (!user) {
      throw new AppError('User not authenticated', 401);
    }

    // Send only user data 
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}