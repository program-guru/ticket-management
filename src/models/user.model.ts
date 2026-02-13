import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; 
  role: 'Admin' | 'Agent' | 'Customer';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [20, "Name cannot exceed 20 characters"],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Email is not valid',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, 
    },
    role: {
      type: String,
      enum: ['Admin', 'Agent', 'Customer'],
      default: 'Customer',
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

const User = mongoose.model<IUser>('User', userSchema);

export default User;