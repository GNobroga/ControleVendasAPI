import { NextFunction, Request, Response } from "express";
import UserService from "../services/UserService";
import RedisCache from "../config/reddis/RedisCache";
import { User } from "../entities/User";

export default abstract class UserController {

  private static readonly _service = new UserService();
  private static readonly _cache = new RedisCache();

  public static async index(req: Request, res: Response, next: NextFunction) {
  
    let users = await UserController._cache.get('users');

    if (!users) {
      users = await UserController._service.getAll();
      await UserController._cache.save('users', users);
    } 

    return res.json({ users });
  
  }
 
  public static async find(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserController._service.getOne(req.params.id);
      return res.json({ user });
    } catch (e) {
      next(e);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserController._service.create(req.body);
      return res.json({ user });
    } catch (e) {
      next(e);
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserController._service.update(req.params.id, req.body);
      return res.json({ user });
    } catch (e) {
      next(e);
    }
  }

  public static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await UserController._service.delete(req.params.id);
      return res.json({ deleted });
    } catch (e) {
      next(e);
    }
  }

  public static async uploadAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const filename = (req.files as any[])[0].filename;
      const user = await UserController._service.setAvatar(req.params.id, filename);
      return res.json({ user });
    } catch (e) {
      next(e);
    }
  }

  public static async showProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserController._service.showProfile({
        user_id: req.params.id,
      });
      return res.json({ user });
    } catch (e) {
      next(e);
    }
  }


  public static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserController._service.updateProfile({
        ...req.body,
        user_id: req.params.id,
      });
      return res.json({ user });
    } catch (e) {
      next(e);
    }
  }

}