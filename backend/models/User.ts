import mongoose, { Document, Schema, Model } from 'mongoose';
import { IGrievance } from './Grievance';
import { v4 as uuidv4 } from 'uuid';

interface IUser extends Document {
  id: string;
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
  id: { type: String, default: uuidv4, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: { type: String },
  branch: { type: String, required: true },
  gender: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  program: { type: String, required: true },
  yearOfStudy: { type: String, required: true },
  hostel: { type: String, required: true },
  grievances: [{ type: Schema.Types.ObjectId, ref: 'Grievance' }],
  created_at: { type: Date, default: Date.now },
});

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export { User, IUser };