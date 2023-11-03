import { Request, Response, NextFunction } from 'express';
import CustomerService from "../services/CustomerService";

export default abstract class CustomController {

  private static readonly service = new CustomerService();

  public static async index(req: Request, res: Response, next: NextFunction) {
    const customers = await CustomController.service.findAll();
    return res.json({ customers });
  }

  public static async show(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = await CustomController.service.findOne(req.params.id);
      return res.json({ customer });
    } catch (e) {
      next(e);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = await CustomController.service.create(req.body);
      return res.json({ customer });
    } catch (e) {
      next(e);
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = await CustomController.service.update(req.params.id, req.body);
      return res.json({ customer });
    } catch (e) {
      next(e);
    }
  }

  public static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await CustomController.service.delete(req.params.id);
      return res.json({ deleted });
    } catch (e) {
      next(e);
    }
  }

}