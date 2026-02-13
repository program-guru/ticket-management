import type { Request, Response, NextFunction } from 'express';
import AppError from '../utils/app.error.ts';

// Define a type for the error response structure
interface ErrorResponse {
  success: boolean;
  message: string;
  data: any;
}

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // 1. Handle Mongoose "CastError" (Invalid ID like '12345')
  if (err.name === 'CastError') {
    const message = `Invalid value for ${err.path}: ${err.value}`;
    error = new AppError(message, 400);
  }

  // 2. Handle Mongoose "ValidationError" (Schema validation failed)
  if (err.name === 'ValidationError') {
    const message = 'Invalid input data';
    // Map Mongoose errors to match your express-validator format
    const errors = Object.values(err.errors).map((val: any) => ({
      field: val.path,
      message: val.message,
    }));
    
    // We send the response immediately here to keep the 'data' format consistent
    return res.status(400).json({
      success: false,
      message,
      data: errors,
    });
  }

  // 3. Handle Mongoose Duplicate Key Error (e.g., Email already exists)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value entered`;
    const errors = [
      {
        field: field,
        message: `${field} '${err.keyValue[field]}' already exists.`,
      },
    ];
    
    return res.status(400).json({
      success: false,
      message,
      data: errors,
    });
  }

  // 4. Handle JWT Errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token. Please log in again!', 401);
  }
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Your token has expired! Please log in again.', 401);
  }

  // --- Default Error Response ---
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Something went wrong';

  const response: ErrorResponse = {
    success: false,
    message: message,
    data: null, 
  };

  res.status(statusCode).json(response);
};

// 404 Not Found Handler
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
  next(error);
};