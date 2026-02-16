import type { Request, Response, NextFunction } from 'express';
import { createTicketService, getTicketsService } from '../services/ticket.service.ts';
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

export async function getTickets(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user as IUser;

    // Extract filters from query string
    const filters = {
      status: req.query.status as string,
      priority: req.query.priority as string,
    };

    const tickets = await getTicketsService(user, filters);

    res.status(200).json({
      success: true,
      message: `Found ${tickets.length} tickets`,
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
}