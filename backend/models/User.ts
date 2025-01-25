import mongoose, { Document, Schema, Model } from 'mongoose';
import { IGrievance } from './Grievance';
import { v4 as uuidv4 } from 'uuid';

interface IUser extends Document {
  _id: string; 
  name: string;
  email: string;
  role: string;
  avatar: string;
  branch: string;
  gender: string;
  rollNumber: string;
  program: string;
  yearOfStudy: string;
  hostel: string;
  grievances: IGrievance[];
  created_at: Date;
}

const UserSchema: Schema<IUser> = new Schema({
  _id: { type: String, default: uuidv4 }, 
  name: { type: String },
  email: { type: String, unique: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: { type: String },
  branch: { type: String },
  gender: { type: String },
  rollNumber: { type: String, unique: true },
  program: { type: String },
  yearOfStudy: { type: String },
  hostel: { type: String },
  grievances: [{ type: Schema.Types.ObjectId, ref: 'Grievance' }],
  created_at: { type: Date, default: Date.now },
});

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export { User, IUser };