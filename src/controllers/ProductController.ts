import { NextFunction, Request, Response } from 'express';
import ProductService from "../services/ProductService";

export default abstract class ProductController {

  private static readonly _service: ProductService = new ProductService(); 

  public static async index(req: Request, res: Response, next: NextFunction) {
    const { page = "0", size = "10" } = req.query;
    const products = await ProductController._service.getAll(parseInt(page as string), parseInt(size as string));
    return res.json({ products });
  }  

  public static async findById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const product = await ProductController._service.getOne(id);
      return res.json({ product }); 
    } catch (e) {
      next(e);
    } 
  }

  public static async create(req: Request, res: Response, next: NextFunction) {
    let vo = req.body;
    try {
      const product = await ProductController._service.create(vo);
      return res.json({ product }); 
    } catch (e) {
      next(e);
    } 
  }

  public static async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    let vo = req.body;
    try {
      const product = await ProductController._service.update(id, vo);
      return res.json({ product }); 
    } catch (e) {
      next(e);
    } 
  }

  public static async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const deleted = await ProductController._service.delete(id);
      return res.json({ deleted }); 
    } catch (e) {
      next(e);
    } 
  }
}  