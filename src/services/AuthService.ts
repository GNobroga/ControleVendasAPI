import { Op } from "sequelize";
import { IUser, User } from "../entities/User";
import { User as userRespository } from "../entities/User";
import HandleError from "../shared/errors/HandleError";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import jwtConfig from '../config/jwtConfig';

export default class AuthService {

  public async authenticate(record: IUser) {
    const findUser = await userRespository.findAll({
      where: { email: record.email, },
    });
    if (!findUser.length) {
      throw new HandleError('Email or password are incorrect.', 401);
    }

    const user = findUser[0].get() as IUser;

    const passDecoded = bcrypt.compareSync(record.password, user.password);

    if (!passDecoded) {
      throw new HandleError('Email or password are incorrect.', 401);
    }

    const userFiltered = (await userRespository.findByPk(user.id, { attributes: ['id', 'email']}))?.get();

    return { ...userFiltered, token: this.generateToken(user.id!) };
  }


  public generateToken(id: string) {
    return jwt.sign({}, jwtConfig.jwt.secret, {
      subject: id,
      expiresIn: jwtConfig.jwt.expiresIn,
    });
  }

  public static getSubject(token: string) {
    try {
      const decoded = jwt.verify(token, jwtConfig.jwt.secret);
      const { sub } = decoded;
      return sub;
    } catch (e) {
      throw new HandleError('An error occurred at generated token service.', 401);
    }
  }
}