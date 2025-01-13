export interface Grievance {
  _id: string;
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
