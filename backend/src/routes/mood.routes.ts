import { Router } from 'express';
import { moodController } from '../controllers/mood.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { logMoodSchema, moodTimelineQuerySchema } from '@shared/schemas/mood.schema';

const router = Router();

router.post('/', authMiddleware, validate(logMoodSchema), moodController.logMood);

router.get('/timeline', authMiddleware, validate(moodTimelineQuerySchema, 'query'), moodController.timeline);

export default router;
