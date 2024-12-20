const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

passport.use(
  new (require('passport-google-oauth20')).Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      if (!email.endsWith('@itbhu.ac.in') && !email.endsWith('@iitbhu.ac.in')) {
        return done(null, false, { message: 'Unauthorized email domain' });
      }

      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({ name: profile.displayName, email });
      }
      done(null, user);
    }
  )
);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id, email: req.user.email }, process.env.JWT_SECRET);
    res.json({ token });
  }
);

module.exports = router;
