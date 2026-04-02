import { Request, Response } from 'express';
import { sessionService } from '../services/session.service';
import { catchAsync } from '../utils/catchAsync';

export const sessionController = {
  create: catchAsync(async (req: Request, res: Response) => {
    const session = await sessionService.createSession(req.user!.id);
    res.status(201).json(session);
  }),

  list: catchAsync(async (req: Request, res: Response) => {
    const { limit, offset } = req.query as unknown as { limit: number; offset: number };
    const sessions = await sessionService.listSessions(req.user!.id, limit, offset);
    res.json(sessions);
  }),

  getById: catchAsync(async (req: Request, res: Response) => {
    const session = await sessionService.getSession(req.params.id as string, req.user!.id);
    res.json(session);
  }),

  sendMessage: catchAsync(async (req: Request, res: Response) => {
    const result = await sessionService.sendMessage(
      req.params.id as string,
      req.user!.id,
      req.body.content
    );
    res.json(result);
  }),

  createPanic: catchAsync(async (req: Request, res: Response) => {
    const result = await sessionService.createPanicSession(req.user!.id);
    res.status(201).json(result);
  }),
};
