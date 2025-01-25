import express from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import { Grievance } from '../models/Grievance';
import { User } from '../models/User';

const userRouter = express.Router();

userRouter.put('/update', authMiddleware, async (req, res) => {
    try {
        const { userId, updateData } = req.body;
        const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

userRouter.get('/profile', authMiddleware, async (req: express.Request & { user: { id: string } }, res) => {
    try {
        const userId = req.user.id;
        console.log(userId);
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

userRouter.get('/:userId/grievances', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.params;
        const grievances = await Grievance.find({ user: userId });
        if (!grievances) {
            return res.status(404).json({ message: 'No grievances found for this user' });
        }
        res.status(200).json(grievances);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

export default userRouter;