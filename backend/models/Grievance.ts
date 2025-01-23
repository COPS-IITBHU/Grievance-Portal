import mongoose, { Document, Schema, Model } from 'mongoose';
import { IUser } from './User';
interface IGrievance extends Document {
  heading: string;
  content: string;
  tags: string[];
  related_images: string[];
  progress_images: string[];
  upvote_count: number;
  isPending: boolean;
  isComplete: boolean;
  isRejected: boolean;
  user: IUser['_id'];
  name: string;
  phoneNumber: string;
  roomNumber: string;
  created_at: Date;
  updated_at: Date;
}

const GrievanceSchema: Schema<IGrievance> = new Schema({
  heading: { type: String, required: true },
  content: { type: String, required: true },
  tags: [String],
  related_images: [String],
  progress_images: [String],
  upvote_count: { type: Number, default: 0 },
  isPending: { type: Boolean, default: true },
  isComplete: { type: Boolean, default: false },
  isRejected: { type: Boolean, default: false },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  roomNumber: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Grievance: Model<IGrievance> = mongoose.model<IGrievance>('Grievance', GrievanceSchema);

export { Grievance, IGrievance };