import express from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import { Grievance } from '../models/Grievance';
import upload from '../middlewares/uploadMiddleware';

const grievanceRouter = express.Router();

grievanceRouter.post('/', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    const { heading, content, tags } = req.body;

    // Extract image URLs from Cloudinary response
    const imageUrls = (req.files as Express.Multer.File[]).map(file => (file as any).path);

    const grievance = new Grievance({
      heading,
      content,
      tags,
      related_images: imageUrls,
    });

    await grievance.save();
    res.status(201).json(grievance);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

grievanceRouter.get('/', async (req, res) => {
  const grievances = await Grievance.find({ isPending: false });
  res.json(grievances);
});

export default grievanceRouter;