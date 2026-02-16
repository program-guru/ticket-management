import type { Request, Response, NextFunction } from 'express';
import {
  createCommentService,
  getCommentsService,
  updateCommentService,
  deleteCommentService,
} from '../services/comment.service.ts';
import type { IUser } from '../models/user.model.ts';

export async function createComment(req: Request, res: Response, next: NextFunction) {
  try {
    const { content, ticket } = req.body;
    const user = req.user as IUser;

    const comment = await createCommentService(content, ticket, user);

    res.status(201).json({
      success: true,
      data: comment,
      message: 'Comment created successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function getComments(req: Request, res: Response, next: NextFunction) {
  try {
    const ticketId = req.query.ticketId as string;
    const user = req.user as IUser;
    const comments = await getCommentsService(ticketId, user);

    res.status(200).json({
      success: true,
      message: `Found ${comments.length} comments`,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateComment(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const { content } = req.body;
    const user = req.user as IUser;

    const comment = await updateCommentService(id, content, user);

    res.status(200).json({
      success: true,
      data: comment,
      message: 'Comment updated successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteComment(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const user = req.user as IUser;

    await deleteCommentService(id, user);

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}
