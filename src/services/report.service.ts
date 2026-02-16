import Ticket from '../models/ticket.model.ts';

interface ReportMetrics {
  totalTickets: number;
  statusBreakdown: Record<string, number>;
  averageResolutionTimeHours: number;
}

export async function getReportMetricsService(range: 'daily' | 'weekly' | 'monthly'): Promise<ReportMetrics> {
  // Determine the Date Range
  const now = new Date();
  let startDate = new Date();

  switch (range) {
    case 'daily':
      startDate.setDate(now.getDate() - 1); // Last 24 hours
      break;
    case 'weekly':
      startDate.setDate(now.getDate() - 7); // Last 7 days
      break;
    case 'monthly':
      startDate.setMonth(now.getMonth() - 1); // Last 30 days
      break;
    default:
      startDate.setDate(now.getDate() - 7); // Default to weekly
  }

  // Aggregation: Status Breakdown
  // We match tickets created AFTER the startDate
  const statusStats = await Ticket.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: '$status', // Group by 'Open', 'In Progress', etc.
        count: { $sum: 1 },
      },
    },
  ]);

  // Convert array [{_id: 'Open', count: 5}, ...] to object { Open: 5, ... }
  const statusBreakdown: Record<string, number> = {};
  let totalTickets = 0;

  statusStats.forEach((stat) => {
    statusBreakdown[stat._id] = stat.count;
    totalTickets += stat.count;
  });

  // Aggregation: Average Resolution Time
  // We only look at tickets that are actually Resolved or Closed AND have a resolvedAt date
  const resolutionStats = await Ticket.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        status: { $in: ['Resolved', 'Closed'] },
        resolvedAt: { $exists: true, $ne: null },
      },
    },
    {
      $group: {
        _id: null,
        // Calculate difference in milliseconds, then average it
        avgTimeMs: { $avg: { $subtract: ['$resolvedAt', '$createdAt'] } },
      },
    },
  ]);

  // Convert ms to hours (or 0 if no tickets resolved)
  const avgTimeMs = resolutionStats.length > 0 ? resolutionStats[0].avgTimeMs : 0;
  const averageResolutionTimeHours = Math.round((avgTimeMs / (1000 * 60 * 60)) * 100) / 100;

  return {
    totalTickets,
    statusBreakdown,
    averageResolutionTimeHours,
  };
}