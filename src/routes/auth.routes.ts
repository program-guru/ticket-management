import { Router } from 'express';
import { register, login, logout } from '../controller/auth.controller.js';
import { registerValidator, loginValidator } from '../validators/auth.validator.js';
import { validateRequest } from '../middlewares/validate.js';

const router = Router();

router.post('/register', registerValidator, validateRequest, register);
router.post('/login', loginValidator, validateRequest, login);
router.post('/logout', logout); 

export default router;