import { body } from 'express-validator';

export const createCommentValidator = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required'),

  body('ticket')
    .trim()
    .notEmpty()
    .withMessage('Ticket ID is required')
    .isMongoId()
    .withMessage('Invalid Ticket ID'),
];

export const updateCommentValidator = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required'),
];
