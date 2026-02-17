import cron from 'node-cron';
import Ticket from '../models/ticket.model.ts';
import { findLeastBusyAgent } from '../services/ticket.service.ts';
import { notifyTicketUpdate } from '../services/email.service.ts';
import type { IUser } from '../models/user.model.ts';

// Run every minute
export const ticketAssignmentJob = cron.schedule('0 * * * * *', async () => {
  console.log('--- Running Ticket Assignment Job ---');

  try {
    // Find all 'Open' tickets that are unassigned
    // Limit to a batch size (e.g., 10) to prevent long-running jobs blocking the event loop
    const openTickets = await Ticket.find({
      status: 'Open',
      assignedTo: null,
    })
      .populate('customer')
      .limit(10);

    if (openTickets.length === 0) {
      console.log('No open tickets to assign.');
      return;
    }

    console.log(`Found ${openTickets.length} unassigned tickets.`);

    // Process each ticket explicitly one by one
    for (const ticket of openTickets) {
      // Find the best agent dynamically
      // We call this INSIDE the loop so it sees the updated load from the previous iteration
      const bestAgent = await findLeastBusyAgent();

      if (!bestAgent) {
        console.log('No agents available for assignment.');
        break; 
      }

      // Assign the ticket
      ticket.assignedTo = bestAgent._id; 
      ticket.status = 'In Progress';
      ticket.updatedAt = new Date(); 

      await ticket.save();

      notifyTicketUpdate(ticket.customer as IUser, ticket);

      console.log(`Assigned Ticket "${ticket.title}" to Agent ${bestAgent.name}`);
    }
  } catch (error) {
    console.error('Error in Ticket Assignment Job:', error);
  }
});