import express from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import { Grievance } from '../models/Grievance';
import upload from '../middlewares/uploadMiddleware';

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

adminRouter.put('/:id/reject', authMiddleware, async (req, res) => {
  const grievance = await Grievance.findById(req.params.id);
  if (!grievance) {
    return res.status(404).json({ message: 'Grievance not found' });
  }
  grievance.isPending = false;
  grievance.isRejected = true;
  grievance.tags = req.body.tags || grievance.tags;
  await grievance.save();
  res.json(grievance);
});

adminRouter.put('/:id/completed', authMiddleware, async (req, res) => {
  const grievance = await Grievance.findById(req.params.id);
  if (!grievance) {
    return res.status(404).json({ message: 'Grievance not found' });
  }
  grievance.isComplete = true;
  await grievance.save();
  res.json(grievance);
});

adminRouter.put('/:id/progress', authMiddleware, upload.array('progressImages', 5), async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    // Add new progress image URLs
    const progressImageUrls = (req.files as Express.Multer.File[]).map(file => (file as any).path);
    grievance.progress_images.push(...progressImageUrls);

    await grievance.save();
    res.status(200).json(grievance);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

adminRouter.get('/grievances', authMiddleware, async (req, res) => {
  const grievances = await Grievance.find();
  res.json(grievances);
});

export default adminRouter;