import { Router } from 'express';
import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} from '../controller/comment.controller.ts';
import {
  createCommentValidator,
  updateCommentValidator,
} from '../validators/comment.validator.ts';
import { validateRequest } from '../middlewares/validate.middleware.ts';
import { authenticate, authorize } from '../middlewares/auth.middleware.ts';

const router = Router();

router.use(authenticate);

router.post('/', createCommentValidator, validateRequest, createComment);
router.get('/', getComments);
router.put('/:id', updateCommentValidator, validateRequest, updateComment);
router.delete('/:id', deleteComment);

export default router;
