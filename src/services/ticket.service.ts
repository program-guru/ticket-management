import User from '../models/user.model.ts';
import Ticket from '../models/ticket.model.ts';
import type { IUser } from '../models/user.model.ts';
import type { ITicket } from '../models/ticket.model.ts';
import AppError from '../utils/app.error.ts';

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