const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const Grievance = require('../models/Grievance');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const grievance = new Grievance(req.body);
    await grievance.save();
    res.status(201).json(grievance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  const grievances = await Grievance.find({ isPending: false });
  res.json(grievances);
});

module.exports = router;
