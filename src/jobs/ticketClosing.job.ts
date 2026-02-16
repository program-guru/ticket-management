import cron from 'node-cron';
import Ticket from '../models/ticket.model.ts';

// Run every day at midnight: '0 0 * * *'
export const ticketClosingJob = cron.schedule('0 0 * * *', async () => {
  console.log('--- Running Ticket Closing Job ---');

  try {
    const SEVEN_DAYS_AGO = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const query = {
      status: 'Resolved',
      resolvedAt: { $lt: SEVEN_DAYS_AGO }, 
    };

    const result = await Ticket.updateMany(query, {
      $set: { status: 'Closed' },
    });

    if (result.modifiedCount > 0) {
      console.log(`Auto-Closed ${result.modifiedCount} tickets due to inactivity.`);
    } else {
      console.log('No tickets to close today.');
    }
  } catch (error) {
    console.error('Error in Ticket Closing Job:', error);
  }
});