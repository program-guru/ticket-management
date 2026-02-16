import type { IUser } from '../models/user.model.ts';
import AppError from '../utils/app.error.ts';
import User from '../models/user.model.ts';

export async function getUsersService(userId?: string) : Promise<IUser | IUser[]> {
  if (userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }
  
  const users = await User.find();
  return users;
}
