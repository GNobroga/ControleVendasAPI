import { NextFunction, Request, Response } from "express";
import AuthService from "../services/AuthService";


export default abstract class AuthController {

  private static readonly service = new AuthService();

  public static async index(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthController.service.authenticate(req.body);
      return res.json({ user });
    } catch (e) {
      next(e);
    }
  }


}