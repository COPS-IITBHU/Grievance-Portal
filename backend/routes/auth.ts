import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { IUser, User } from '../models/User';

const authRouter = express.Router();

authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const user = req.user as IUser;
    const token = jwt.sign({ id: user._id, email: user.email, avatar: user.avatar }, process.env.JWT_SECRET);
    if (
      !user.gender ||
      !user.rollNumber ||
      !user.program ||
      !user.yearOfStudy ||
      !user.hostel ||
      !user.branch
    ) {
      return res.redirect(`${frontendUrl}/OnboardingPage?token=${token}`);
    }
    res.redirect(`${frontendUrl}/loginPage?token=${token}`);
  }
);
authRouter.post('/onBoarding', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(401).send('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const { gender, rollNumber, program, yearOfStudy, hostel, branch } = req.body;
    if (gender) user.gender = gender;
    if (rollNumber) user.rollNumber = rollNumber;
    if (program) user.program = program;
    if (yearOfStudy) user.yearOfStudy = yearOfStudy;
    if (hostel) user.hostel = hostel;
    if (branch) user.branch = branch;

    await user.save();
    
    return res.status(200).send('User onboarding successfully updated');
  } catch (error) {
    console.error('Error in onboarding route:', error);
    return res.status(500).send('Internal Server Error');
  }
});

export default authRouter;