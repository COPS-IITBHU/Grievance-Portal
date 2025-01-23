import express from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import { Grievance } from '../models/Grievance';
import {uploadImages} from '../middlewares/uploadMiddleware';

const grievanceRouter = express.Router();

grievanceRouter.post('/', authMiddleware, uploadImages, async (req, res) => {
  try {
    const { userId, name, phoneNumber, roomNumber, heading, content, tags } = req.body;
    // Extract image URLs from Cloudinary response
    const imageUrls = (req.files as Express.Multer.File[]).map(file => (file as any).path);

    const grievance = new Grievance({
      name,
      phoneNumber,
      roomNumber,
      heading,
      content,
      tags: Array.isArray(tags) ? tags : [tags], // Ensure tags is an array
      related_images: imageUrls,
      user: userId // Add the user ID to the grievance
    });

    await grievance.save();
    res.status(201).json(grievance);
  } catch (err) {
    console.error('Error creating grievance:', err);
    res.status(500).json({ message: (err as Error).message });
  }
});

grievanceRouter.get('/', async (req, res) => {
  const grievances = await Grievance.find({ 
    isPending: false,
    isRejected: { $ne: true } 
  });
  res.json(grievances);
});


export default grievanceRouter;