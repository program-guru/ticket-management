import { Router } from 'express';
import { validateRequest } from '../middlewares/validate.middleware.ts';
import { authenticate, authorize } from '../middlewares/auth.middleware.ts';
import { users, user, profile } from '../controller/user.controller.ts';

const router = Router();

router.get('/users', validateRequest, authenticate, authorize('Admin'), users);
router.get('/user/:id', validateRequest, authenticate, authorize('Admin'), user);
router.get('/profile', validateRequest, authenticate, profile);

export default router;