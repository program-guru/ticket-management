import User from '../models/user.model.ts';
import Ticket from '../models/ticket.model.ts';
import type { IUser } from '../models/user.model.ts';
import type { ITicket } from '../models/ticket.model.ts';
import AppError from '../utils/app.error.ts';

interface TicketFilters {
  status?: string;
  priority?: string;
}

// Finds the Agent with the fewest "In Progress" tickets.
export async function findLeastBusyAgent(): Promise<IUser | null> {
  const result = await User.aggregate([
    // Stage 1: Filter to get only Users who are 'Agents'
    {
      $match: {
        role: 'Agent',
      },
    },

    // Stage 2: Join with the 'tickets' collection
    // This adds an array field 'allAssignedTickets' to each agent document
    {
      $lookup: {
        from: 'tickets',
        localField: '_id',
        foreignField: 'assignedTo',
        as: 'allAssignedTickets',
      },
    },

    // Stage 3: Calculate the 'activeLoad'
    // We filter the 'allAssignedTickets' array to count only 'In Progress' tickets
    {
      $addFields: {
        activeLoad: {
          $size: {
            $filter: {
              input: '$allAssignedTickets',
              as: 'ticket',
              cond: { $eq: ['$$ticket.status', 'In Progress'] },
            },
          },
        },
      },
    },

    // Stage 4: Sort by 'activeLoad' in Ascending order (0, 1, 2...)
    {
      $sort: {
        activeLoad: 1,
      },
    },

    // Stage 5: Limit to 1 result (the winner)
    {
      $limit: 1,
    },
  ]);

  // The result is an array (even with limit 1).
  // If no agents exist, it returns empty.
  if (result.length === 0) {
    return null;
  }

  // Return the agent from the result
  return result[0] as IUser;
}

export async function createTicketService(ticketData: Partial<ITicket>) {
  if (!ticketData.title || !ticketData.description || !ticketData.priority || !ticketData.customer) {
    throw new AppError('Title, description, priority, and customer are required to create a ticket', 400);
  }

  const ticket = await Ticket.create({
    ...ticketData,
    status: 'Open',
    assignedTo: null,
  });

  return ticket;
}

export async function getTicketsService(currentUser: IUser, filters: TicketFilters = {}, ticketId?: string) {
  if (!currentUser) {
    throw new AppError('User information is required to fetch tickets', 400);
  }

  // Fetch Single Ticket (if ID provided)
  if (ticketId) {
    const ticket = await Ticket.findById(ticketId)
      .populate('customer', 'name email')
      .populate('assignedTo', 'name email');

    if (!ticket) {
      throw new AppError('Ticket not found', 404);
    }

    // Authorization check
    if (currentUser.role === 'Customer' && ticket.customer?._id.toString() !== currentUser._id.toString()) {
      throw new AppError('You are not authorized to view this ticket', 403);
    }

    if (currentUser.role === 'Agent' && ticket.assignedTo?._id.toString() !== currentUser._id.toString()) {
      throw new AppError('You are not authorized to view this ticket', 403);
    }

    return ticket;
  }

  // Fetch List of Tickets
  // Base Query Construction
  const query: any = {};

  // 2. Apply Role-Based Scoping
  // CUSTOMER: Can only see tickets they created
  if (currentUser.role === 'Customer') {
    query.customer = currentUser._id;
  }
  // AGENT: Can only see tickets assigned to them
  else if (currentUser.role === 'Agent') {
    query.assignedTo = currentUser._id;
  }
  // ADMIN: No restrictions (sees all), so we don't add an ID filter.

  // 3. Apply Optional Filters (if provided in URL query)
  if (filters.status) {
    query.status = filters.status;
  }
  if (filters.priority) {
    query.priority = filters.priority;
  }

  // 4. Execute Query
  // .populate() fills in the details for the 'customer' and 'assignedTo' IDs
  // .sort() shows newest tickets first
  const tickets = await Ticket.find(query)
    .populate('customer', 'name email')
    .populate('assignedTo', 'name email')
    .sort({ createdAt: -1 });

  return tickets;
}

export async function deleteTicketService(ticketId: string, currentUser: IUser) {
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
      throw new AppError('Ticket not found', 404);
  }

  // Admin can delete any ticket
  if (currentUser.role === 'Admin') {
      await ticket.deleteOne();
      return;
  }

  // Check if Customer owns the ticket
  if (currentUser.role === 'Customer' && ticket.customer.toString() === currentUser._id.toString()) {
      await ticket.deleteOne();
      return;
  }

  throw new AppError('You are not authorized to delete this ticket', 403);
}