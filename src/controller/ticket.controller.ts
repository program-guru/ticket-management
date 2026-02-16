import type { Request, Response, NextFunction } from 'express';
import { createTicketService } from '../services/ticket.service.ts';
import type { IUser } from '../models/user.model.ts';

export async function createTicket(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, description, priority } = req.body;
    
    // The user is attached to req by the 'authenticate' middleware
    const user = req.user as IUser;

    const ticket = await createTicketService({
      title,
      description,
      priority,
      customer: user._id, // Link ticket to the logged-in user
    });

    res.status(201).json({
      success: true,
      data: ticket,
      message: 'Ticket created successfully',
    });
  } catch (error) {
    next(error);
  }
}