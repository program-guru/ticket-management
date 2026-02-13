import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user.model.ts'; 

export interface ITicket extends Document {
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  customer: mongoose.Types.ObjectId | IUser;
  assignedTo?: mongoose.Types.ObjectId | IUser;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new Schema<ITicket>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
      default: 'Open',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: 'tickets',
  }
);

const Ticket = mongoose.model<ITicket>('Ticket', ticketSchema);

export default Ticket;