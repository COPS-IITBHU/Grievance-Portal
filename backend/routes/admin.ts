import express from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import { Grievance } from '../models/Grievance';

const adminRouter = express.Router();

adminRouter.put('/:id/verify', authMiddleware, async (req, res) => {
  const grievance = await Grievance.findById(req.params.id);
  if (!grievance) {
    return res.status(404).json({ message: 'Grievance not found' });
  }
  grievance.isPending = false;
  grievance.tags = req.body.tags || grievance.tags;
  await grievance.save();
  res.json(grievance);
});

adminRouter.put('/:id/progress', authMiddleware, async (req, res) => {
  const grievance = await Grievance.findById(req.params.id);
  if (!grievance) {
    return res.status(404).json({ message: 'Grievance not found' });
  }
  grievance.progress_images.push(req.body.image);
  await grievance.save();
  res.json(grievance);
});

export default adminRouter;