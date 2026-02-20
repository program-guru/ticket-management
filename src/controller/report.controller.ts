import type { Request, Response, NextFunction } from 'express';
import { getReportMetricsService } from '../services/report.service.ts';

export async function getReports(req: Request, res: Response, next: NextFunction) {
  try {
    // Extract range from query string
    const range = req.query.range as string;

    const validRanges = ['daily', 'weekly', 'monthly'];
    const selectedRange = (validRanges.includes(range as string) ? range : 'weekly') as 'daily' | 'weekly' | 'monthly';

    const metrics = await getReportMetricsService(selectedRange);

    res.status(200).json({
      success: true,
      message: `Report metrics for the last ${selectedRange}`,
      data: metrics,
    });
  } catch (error) {
    if (req.timedout) return;
    next(error);
  }
}