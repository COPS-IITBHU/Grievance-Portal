const mongoose = require('mongoose');

const GrievanceSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  content: { type: String, required: true },
  tags: [String],
  related_images: [String],
  progress_images: [String],
  upvote_count: { type: Number, default: 0 },
  isPending: { type: Boolean, default: true },
  isComplete: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Grievance', GrievanceSchema);
