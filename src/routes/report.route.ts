import { Router } from 'express';
import { getReports } from '../controller/report.controller.ts';
import { authenticate, authorize } from '../middlewares/auth.middleware.ts';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: System reports
 */

/**
 * @swagger
 * /reports:
 *   get:
 *     summary: Get dashboard reports (Admin only)
 *     tags: [Reports]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Report data
 */
router.get('/', authorize('Admin'), getReports);

export default router;