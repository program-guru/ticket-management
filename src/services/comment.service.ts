import Comment from '../models/comment.model.ts';
import Ticket from '../models/ticket.model.ts';
import type { IComment } from '../models/comment.model.ts';
import type { IUser } from '../models/user.model.ts';
import AppError from '../utils/app.error.ts';

export async function createCommentService(content: string, ticketId: string, user: IUser): Promise<IComment> {
  // Check if ticket exists
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new AppError('Ticket not found', 404);
  }

    // Access control
  if (user.role === 'Customer' && ticket.customer.toString() !== user._id.toString()) {
    throw new AppError('You are not authorized to create comments for this ticket', 403);
  }

  if (user.role === 'Agent') {
    if (!ticket.assignedTo || ticket.assignedTo.toString() !== user._id.toString()) {
      throw new AppError('You are not authorized to create comments for this ticket', 403);
    }
  }

  // Create comment
  const comment = await Comment.create({
    content,
    ticket: ticketId,
    author: user._id,
  });

  return comment;
}

export async function getCommentsService(ticketId: string, user: IUser): Promise<IComment[]> {
  if(ticketId) {
    // Check if ticket exists
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new AppError('Ticket not found', 404);
    }
  
    // Access control
    if (user.role === 'Customer' && ticket.customer.toString() !== user._id.toString()) {
      throw new AppError('You are not authorized to view comments for this ticket', 403);
    }
  
    if (user.role === 'Agent') {
      if (!ticket.assignedTo || ticket.assignedTo.toString() !== user._id.toString()) {
        throw new AppError('You are not authorized to view comments for this ticket', 403);
      }
    }
  
    const comments = await Comment.find({ ticket: ticketId })
      .populate('author', 'name email role')
      .sort({ createdAt: -1 });
  
    return comments;
  }

  // If no ticketId provided, return all comments user has access to
  let comments: IComment[] = [];
  if (user.role === 'Admin') {
    comments = await Comment.find()
      .populate('author', 'name email role')
      .sort({ createdAt: -1 });
  } 
  else if (user.role === 'Agent') {
    const tickets = await Ticket.find({ assignedTo: user._id });

    const ticketIds = tickets.map(ticket => ticket._id);
      comments = await Comment.find({ ticket: { $in: ticketIds } })
      .populate('author', 'name email role')
      .sort({ createdAt: -1 });
  } 
  else if (user.role === 'Customer') {
    const tickets = await Ticket.find({ customer: user._id });

    const ticketIds = tickets.map(ticket => ticket._id);
    comments = await Comment.find({ ticket: { $in: ticketIds } })
      .populate('author', 'name email role')
      .sort({ createdAt: -1 });
  }

  return comments;
}

export async function updateCommentService(commentId: string, content: string, user: IUser): Promise<IComment> {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new AppError('Comment not found', 404);
  }

  // Check authorization: only author or admin
  if (comment.author.toString() !== user._id.toString() && user.role !== 'Admin') {
    throw new AppError('You are not authorized to update this comment', 403);
  }

  comment.content = content;
  await comment.save();

  return comment;
}

export async function deleteCommentService(commentId: string, user: IUser): Promise<void> {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new AppError('Comment not found', 404);
  }

  // Check authorization: only author or admin
  if (comment.author.toString() !== user._id.toString() && user.role !== 'Admin') {
    throw new AppError('You are not authorized to delete this comment', 403);
  }

  await comment.deleteOne();
}
