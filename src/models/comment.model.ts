import mongoose, { Document, Schema } from 'mongoose';
import type { IUser } from './user.model.ts';
import type { ITicket } from './ticket.model.ts';

export interface IComment extends Document {
  content: string;
  ticket: mongoose.Types.ObjectId | ITicket;
  author: mongoose.Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
    },
    ticket: {
      type: Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'comments',
  }
);

const Comment = mongoose.model<IComment>('Comment', commentSchema);

export default Comment;