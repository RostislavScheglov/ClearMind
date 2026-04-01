import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { catchAsync } from '../utils/catchAsync';

export const authController = {
  googleCallback: catchAsync(async (req: Request, res: Response) => {
    const user = req.user!;
    const token = authService.issueToken(user);
    const { FRONTEND_URL } = await import('../utils/env').then((m) => m.env);
    res.redirect(`${FRONTEND_URL}/oauth/callback?token=${token}`);
  }),

  getMe: catchAsync(async (req: Request, res: Response) => {
    const data = await authService.getMe(req.user!.id);
    res.json(data);
  }),
};
