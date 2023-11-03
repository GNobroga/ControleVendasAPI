import { Request, Response, NextFunction } from 'express';
import SendForgotPasswordEmailService from '../services/SendForgotPasswordEmailService';

export default abstract class ForgotPasswordController {

  private static _service = new SendForgotPasswordEmailService();

  public static async create(req: Request, res: Response, next: NextFunction) {
    
    ForgotPasswordController._service.execute(req.body);

    return res.status(204).json();
  }
}