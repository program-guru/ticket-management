import type { Request, Response, NextFunction } from 'express';
import { createTicketService, getTicketsService, deleteTicketService, updateTicketService } from '../services/ticket.service.ts';
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
    const ticketId = req.params.id as string | undefined;

    // Extract filters from query string
    const filters = {
      status: req.query.status as string,
      priority: req.query.priority as string,
    };

    const data = await getTicketsService(user, filters, ticketId);

    // If getting list, return count message
    const message = Array.isArray(data)
      ? `Found ${data.length} tickets`
      : 'Ticket found';

    res.status(200).json({
      success: true,
      message,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteTicket(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user as IUser;
    const id = req.params.id as string;

    await deleteTicketService(id, user);

    res.status(200).json({
      success: true,
      message: 'Ticket deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTicket(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user as IUser;
    const id = req.params.id as string;
    const updateData = req.body;

    const ticket = await updateTicketService(id, updateData, user);

    res.status(200).json({
      success: true,
      data: ticket,
      message: 'Ticket updated successfully',
    });
  } catch (error) {
    next(error);
  }
}