import { Router } from 'express';
import { createTicket, getTickets } from '../controller/ticket.controller.ts';
import { createTicketValidator } from '../validators/ticket.validator.ts';
import { validateRequest } from '../middlewares/validate.middleware.ts';
import { authenticate, authorize } from '../middlewares/auth.middleware.ts';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorize('Customer'),
  createTicketValidator,
  validateRequest,
  createTicket
);

router.get(['/', '/:id'], validateRequest, getTickets);

export default router;