import { Router } from 'express';
import { insightsController } from '../controllers/insights.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authMiddleware, insightsController.getInsights);

export default router;
