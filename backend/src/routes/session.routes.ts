import { Router } from 'express';
import { sessionController } from '../controllers/session.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { sendMessageSchema, sessionParamsSchema, sessionsQuerySchema } from '@shared/schemas/session.schema';

const router = Router();

router.post('/', authMiddleware, sessionController.create);

router.get('/', authMiddleware, validate(sessionsQuerySchema, 'query'), sessionController.list);

router.get('/:id', authMiddleware, validate(sessionParamsSchema, 'params'), sessionController.getById);

router.post(
  '/:id/messages',
  authMiddleware,
  validate(sessionParamsSchema, 'params'),
  validate(sendMessageSchema),
  sessionController.sendMessage
);

export default router;
