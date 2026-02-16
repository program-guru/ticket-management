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

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comments on tickets
 */

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Add a comment to a ticket
 *     tags: [Comments]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - ticketId
 *             properties:
 *               content:
 *                 type: string
 *               ticketId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created
 */
router.post('/', createCommentValidator, validateRequest, createComment);

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get comments for a ticket
 *     tags: [Comments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of comments
 */
router.get('/', getComments);

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Update a comment
 *     tags: [Comments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated
 */
router.put('/:id', updateCommentValidator, validateRequest, updateComment);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted
 */
router.delete('/:id', deleteComment);

export default router;
