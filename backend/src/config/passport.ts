import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { env } from '../utils/env';
import prisma from '../db/prisma';

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (_accessToken, _refreshToken, profile: Profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error('Email is required from Google profile'));
        }

        const user = await prisma.user.upsert({
          where: { googleId: profile.id },
          update: { name: profile.displayName, email },
          create: {
            googleId: profile.id,
            email,
            name: profile.displayName,
          },
        });

        done(null, user);
      } catch (err) {
        done(err as Error);
      }
    }
  )
);

export default passport;
