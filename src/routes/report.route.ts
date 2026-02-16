import { Router } from 'express';
import { getReports } from '../controller/report.controller.ts';
import { authenticate, authorize } from '../middlewares/auth.middleware.ts';

const router = Router();

router.use(authenticate);

router.get('/', authorize('Admin'), getReports);

export default router;