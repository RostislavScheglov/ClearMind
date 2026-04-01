import { Router } from 'express';
import { onboardingController } from '../controllers/onboarding.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { onboardingSchema } from '@shared/schemas/onboarding.schema';

const router = Router();

router.post('/', authMiddleware, validate(onboardingSchema), onboardingController.complete);

export default router;
