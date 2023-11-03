import { Request, Response, NextFunction } from 'express';
import OrderService from '../services/OrderService';

export default abstract class OrderController {

  private static readonly _service = new OrderService();

  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await OrderController._service.create(req.body);
      return res.json({ orders });
    } catch (e) { return next(e) };
  }

  public static async show(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await OrderController._service.show(req.params.id);
      return res.json({ order });
    } catch (e) { return next(e) };
  }
}