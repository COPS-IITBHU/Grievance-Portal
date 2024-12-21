import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User, IUser } from '../models/User';

export const configurePassport = () => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('Google OAuth credentials not found in environment variables');
  }

  passport.serializeUser((user: IUser, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          if (!profile.emails || !profile.emails[0].value) {
            return done(null, false, { message: 'Unauthorized' });
          }
          const email = profile.emails[0].value;
          if (!email.endsWith('@itbhu.ac.in') && !email.endsWith('@iitbhu.ac.in')) {
            return done(null, false, { message: 'Unauthorized email domain' });
          }

          let user = await User.findOne({ email });
          if (!user) {
            user = await User.create({ name: profile.displayName, email });
          }
          done(null, user);
        } catch (error) {
          done(error, false);
        }
      }
    )
  );
};
