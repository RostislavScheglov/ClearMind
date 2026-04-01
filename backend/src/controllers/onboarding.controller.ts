import { Request, Response } from 'express';
import { onboardingService } from '../services/onboarding.service';
import { catchAsync } from '../utils/catchAsync';

export const onboardingController = {
  complete: catchAsync(async (req: Request, res: Response) => {
    const user = await onboardingService.complete(req.user!.id, req.body);
    res.json({ success: true, user });
  }),
};
