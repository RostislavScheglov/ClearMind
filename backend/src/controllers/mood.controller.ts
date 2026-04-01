import { Request, Response } from 'express';
import { moodService } from '../services/mood.service';
import { catchAsync } from '../utils/catchAsync';

export const moodController = {
  logMood: catchAsync(async (req: Request, res: Response) => {
    const entry = await moodService.logMood(req.user!.id, req.body);
    res.status(201).json(entry);
  }),

  timeline: catchAsync(async (req: Request, res: Response) => {
    const { days } = req.query as unknown as { days: number };
    const data = await moodService.getTimeline(req.user!.id, days);
    res.json(data);
  }),
};
