import bcrypt from 'bcryptjs';
import User from '../models/user.model.ts';
import type { IUser } from '../models/user.model.ts';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.ts';
import AppError from '../utils/app.error.ts';

export async function registerService(userData: Partial<IUser>) {
  if (!userData.name || !userData.email || !userData.password) {
    throw new AppError('Please provide name, email, and password', 400);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password!, salt);

  const user = await User.create({
    ...userData,
    password: hashedPassword,
    role: userData.role || 'Customer',
  });

  const accessToken: string = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return { user, accessToken, refreshToken };
}

export async function loginService(loginData: Partial<IUser>) {
  const { email, password } = loginData;

  if (!email || !password) {
    throw new AppError('Please provide email and password', 400);
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('Invalid email or password', 401);
  }

  const accessToken: string = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return { user, accessToken, refreshToken };
}

export async function logoutService(refreshToken: string) {
  if (!refreshToken) {
    throw new AppError('Refresh token is required for logout', 400);
  }
}

export async function refreshTokenService(incomingToken: string) {
  if (!incomingToken) {
    throw new AppError('Refresh Token is required', 400);
  }

  // Verify the signature of the token
  // If invalid/expired, verifyRefreshToken usually throws an error
  const decoded = verifyRefreshToken(incomingToken);

  // Check if user still exists
  const user = await User.findById(decoded.id);

  if (!user) {
    throw new AppError('The user belonging to this token does no longer exist.', 401);
  }

  // Generate a NEW Access Token
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return { accessToken, refreshToken };
}