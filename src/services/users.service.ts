import type { IUser } from '../models/user.model.ts';
import AppError from '../utils/app.error.ts';
import User from '../models/user.model.ts';

export async function getAllUsersService() : Promise<{ users: IUser[] }> {
  const users: IUser[] = await User.find();

  return { users };
}

export async function getUserByIdService(userId: string) : Promise<{ user: IUser }> {
  const user: IUser | null = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return { user };
}