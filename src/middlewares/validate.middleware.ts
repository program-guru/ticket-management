import type { Request, Response, NextFunction } from 'express';
import type { FieldValidationError } from 'express-validator';
import { validationResult } from 'express-validator';

export function validateRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => {
      if (err.type === 'field') {
        const fieldError = err as FieldValidationError;
        return {
          field: fieldError.path,
          message: fieldError.msg,
        };
      }
      // Fallback for global/schema errors
      return {
        field: 'global',
        message: err.msg,
      };
    });

    res.status(400).json({
      success: false,
      message: 'Validation Error',
      data: formattedErrors,
    });
    return;
  }

  next();
};