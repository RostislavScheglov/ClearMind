import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './utils/env';
import passport from './config/passport';
import { errorMiddleware } from './middleware/error.middleware';

import authRoutes from './routes/auth.routes';
import onboardingRoutes from './routes/onboarding.routes';
import sessionRoutes from './routes/session.routes';
import moodRoutes from './routes/mood.routes';
import insightsRoutes from './routes/insights.routes';
import subscriptionRoutes from './routes/subscription.routes';

const app = express();

// Security
app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

// Rate limiting
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Stripe webhook route needs raw body — mount BEFORE express.json()
app.use('/api', subscriptionRoutes);

// Body parsing for all other routes
app.use(express.json());

// Passport
app.use(passport.initialize());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/insights', insightsRoutes);

// Global error handler
app.use(errorMiddleware);

app.listen(env.PORT, () => {
  console.log(`🚀 ClearMind API running on port ${env.PORT}`);
});

export default app;
