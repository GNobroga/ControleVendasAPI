import { Request, Response, NextFunction } from 'express';
import ResetPasswordService from '../services/ResetPasswordService';

export default abstract class ResetPasswordController {

  private static _service = new ResetPasswordService();

  public static async execute(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await ResetPasswordController._service.execute(req.body);
      return res.json({ user });
    } catch (e) { next(e) };
  }
}