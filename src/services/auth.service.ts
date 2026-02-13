import bcrypt from 'bcryptjs';
import User from '../models/user.model.ts';
import type { IUser } from '../models/user.model.ts';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.ts';
import { RefreshToken } from '../models/refreshToken.model.ts';
import AppError from '../utils/app.error.ts';

// Helper to create and store refresh token in DB
async function createAndStoreRefreshToken(userId: string) {
  const token = generateRefreshToken(userId);
  // Calculate expiry date (7 days from now)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await RefreshToken.findOneAndUpdate(
    { user: userId },
    { token, user: userId, expiresAt },
    { upsert: true, new: true }
  );
  return token;
}

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
  const refreshToken = await createAndStoreRefreshToken(user.id);

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
  const refreshToken = await createAndStoreRefreshToken(user.id);

  return { user, accessToken, refreshToken };
}

export async function logoutService(refreshToken: string) {
  if (!refreshToken) {
    throw new AppError('Refresh token is required for logout', 400);
  }

  const deletedToken = await RefreshToken.findOneAndDelete({ token: refreshToken })

  if (!deletedToken) {
    throw new AppError('Invalid refresh token', 400);
  }
}

export async function refreshTokenService(incomingToken: string) {
  if (!incomingToken) {
    throw new AppError('Refresh Token is required', 400);
  }

  // Verify the signature of the token
  // If invalid/expired, verifyRefreshToken usually throws an error
  const decoded = verifyRefreshToken(incomingToken);

  // Check if this token exists in the DB and hasn't been revoked
  const tokenRecord = await RefreshToken.findOne({
    token: incomingToken,
    user: decoded.id
  });

  if (!tokenRecord) {
    throw new AppError('Invalid Refresh Token (not found in DB)', 403);
  }

  // Check if expired
  if (tokenRecord.expiresAt.getTime() < Date.now()) {
    await RefreshToken.deleteOne({ _id: tokenRecord._id });
    throw new AppError('Refresh Token expired', 403);
  }

  // Generate a NEW Access Token
  const accessToken = generateAccessToken(decoded.id);
  const refreshToken = await createAndStoreRefreshToken(decoded.id);

  return { accessToken, refreshToken };
}