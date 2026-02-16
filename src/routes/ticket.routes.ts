import { Router } from 'express';
import { createTicket, getTickets, deleteTicket, updateTicket } from '../controller/ticket.controller.ts';
import { createTicketValidator, updateTicketValidator } from '../validators/ticket.validator.ts';
import { validateRequest } from '../middlewares/validate.middleware.ts';
import { authenticate, authorize } from '../middlewares/auth.middleware.ts';

const router = Router();

router.use(authenticate);

router.post('/', authorize('Customer'), createTicketValidator, validateRequest, createTicket);
router.get(['/', '/:id'], validateRequest, getTickets);
router.delete('/:id', authorize('Customer', 'Admin'), validateRequest, deleteTicket);
router.put('/:id', authorize('Customer', 'Admin'), updateTicketValidator, validateRequest, updateTicket);

export default router;