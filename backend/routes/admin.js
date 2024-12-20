const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const Grievance = require('../models/Grievance');

const router = express.Router();

router.put('/:id/verify', authMiddleware, async (req, res) => {
  const grievance = await Grievance.findById(req.params.id);
  grievance.isPending = false;
  grievance.tags = req.body.tags || grievance.tags;
  await grievance.save();
  res.json(grievance);
});

router.put('/:id/progress', authMiddleware, async (req, res) => {
  const grievance = await Grievance.findById(req.params.id);
  grievance.progress_images.push(req.body.image);
  await grievance.save();
  res.json(grievance);
});

module.exports = router;
