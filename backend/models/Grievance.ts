import mongoose, { Document, Schema, Model } from 'mongoose';

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
  created_at: Date;
  updated_at: Date;
}

const GrievanceSchema: Schema<IGrievance> = new Schema({
  heading: { type: String, required: true },
  content: { type: String, required: true },
  tags: [String],
  related_images: [String],
  progress_images: [String],
  isPending: { type: Boolean, default: true },
  isComplete: { type: Boolean, default: false },
  isRejected: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Grievance: Model<IGrievance> = mongoose.model<IGrievance>('Grievance', GrievanceSchema);

export { Grievance, IGrievance };