import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/user.model.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import { RefreshToken } from 'models/refreshToken.mode.js';

// Helper to create and store refresh token in DB
async function createAndStoreRefreshToken(userId: string) {
  const token = generateRefreshToken(userId);
  // Calculate expiry date (7 days from now)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await RefreshToken.create({ token, user: userId, expiresAt });
  return token;
}

export async function registerService(userData: Partial<IUser>) {
  if (!userData.name || !userData.email || !userData.password) {
    throw new Error('Please provide name, email, and password');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password!, salt);

  const user = await User.create({
    ...userData,
    password: hashedPassword,
    role: userData.role || 'Customer',
  });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = await createAndStoreRefreshToken(user.id);

  return { user, accessToken, refreshToken };
}

export async function loginService(loginData: Partial<IUser>) {
  const { email, password } = loginData;

  if (!email || !password) {
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid email or password');
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = await createAndStoreRefreshToken(user.id);

  return { user, accessToken, refreshToken };
}

export async function logoutService(refreshToken: string) {
  if (!refreshToken) {
    throw new Error('Refresh token is required for logout');
  }

  const deletedToken = await RefreshToken.findOneAndDelete({ token: refreshToken })

  if (!deletedToken) {
    throw new Error('Invalid refresh token');
  }
}