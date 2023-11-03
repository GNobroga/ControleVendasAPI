import { Request, Response, NextFunction } from "express";
import HandleError from "../shared/errors/HandleError";
import jwt from "jsonwebtoken";
import JwtConfig from "../config/jwtConfig";

const AuthMiddleware = {
  verify: (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = <{ authorization: string; }> req.headers;
    if (authorization && authorization.startsWith('Bearer ')) {
      const [, token] = authorization.split(' ');

      if (!token) {
        throw new HandleError('Token is not present in the \'Authorization\' header property.', 401);
      }
      
      try {
        const decoded = jwt.verify(token, JwtConfig.jwt.secret);
        const { sub } = decoded as { sub: string; };
        req.user = { id: sub, };
        return next();
      } catch (e) {}
    } 
    throw new HandleError('JWT Token is missing.', 401);
  },
}

export default AuthMiddleware;