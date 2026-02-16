import { Router } from 'express';
import { validateRequest } from '../middlewares/validate.middleware.ts';
import { authenticate, authorize } from '../middlewares/auth.middleware.ts';
import { getUsers, getProfile } from '../controller/user.controller.ts';

const router = Router();

router.use(authenticate);
router.use(validateRequest);

router.get('/profile', getProfile);
router.get(['/', '/:id'], authorize('Admin'), getUsers);

export default router;