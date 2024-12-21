import express from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import { Grievance } from '../models/Grievance';

const grievanceRouter = express.Router();

grievanceRouter.post('/', authMiddleware, async (req, res) => {
  try {
    const grievance = new Grievance(req.body);
    await grievance.save();
    res.status(201).json(grievance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

grievanceRouter.get('/', async (req, res) => {
  const grievances = await Grievance.find({ isPending: false });
  res.json(grievances);
});

export default grievanceRouter;