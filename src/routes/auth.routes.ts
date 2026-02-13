import { Router } from 'express';
import { register, login, logout, refresh } from '../controller/auth.controller.ts';
import { registerValidator, loginValidator } from '../validators/auth.validator.ts';
import { validateRequest } from '../middlewares/validate.middleware.ts';

const router = Router();

router.post('/register', registerValidator, validateRequest, register);
router.post('/login', loginValidator, validateRequest, login);
router.post('/refresh', refresh);
router.post('/logout', logout); 

export default router;