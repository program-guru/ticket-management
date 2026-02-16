import { Router } from 'express';
import { validateRequest } from '../middlewares/validate.middleware.ts';
import { authenticate, authorize } from '../middlewares/auth.middleware.ts';
import { users, user, profile } from '../controller/user.controller.ts';

const router = Router();

router.use(authenticate); 
router.use(validateRequest); 

router.get('/', authorize('Admin'), users);
router.get('/profile', profile);
router.get('/:id', authorize('Admin'), user);

export default router;