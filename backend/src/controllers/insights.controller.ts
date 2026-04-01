import { Request, Response } from 'express';
import { insightsService } from '../services/insights.service';
import { catchAsync } from '../utils/catchAsync';

export const insightsController = {
  getInsights: catchAsync(async (req: Request, res: Response) => {
    const data = await insightsService.getInsights(req.user!.id);
    res.json(data);
  }),
};
