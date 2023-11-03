import 'reflect-metadata';
import { IUser, User, User as repository } from "../entities/User";
import { Op } from "sequelize";
import HandleError from "../shared/errors/HandleError";
import path from "path";
import fs from 'fs/promises';
import bcrypt from 'bcryptjs';


interface IRequest {
  user_id: string;
}

interface IUpdateProfileRequest {
  user_id: string;
  name?: string;
  email?: string;
  password?: string;
  old_password?: string;
}

export default class UserService {


  public async create(record: Omit<IUser, 'id'>) {
    if (await this.existsEmail(record)) {
      throw new HandleError('There is a similar email with this value.');
    }

    return (await repository.create(record))?.get();
  }

  public async getAll() {
    const users = await repository.findAll({ attributes: { exclude: ['password', 'createdAt', 'updatedAt']}});
    return users;
  } 

  public async getOne(id: string) {
    if (await this.existsObj(id)) {
      return (await repository.findByPk(id))?.get();
    }
    throw new HandleError('We did not find a user with this id.');
  }

  public async update(id: string, record: IUser) {
    if (await this.existsObj(id)) {
      const user = (await repository.findByPk(id)) as any;
      if (await this.existsEmail(record) && user.email !== record.email) {
        throw new HandleError('The new email address has already been registered.');
      }
      user.email = record.email;
      user.password = record.password;
      user.avatar = record.avatar;
      return (await user.save())?.get();
    }

    throw new HandleError('We did not find a user with this email.');
  }

  public async delete(id: string) {
    if (await this.existsObj(id)) {
      const deleted = await repository.destroy({ where: { id }});
      return deleted > 0;
    }
    return false;
  }

  public async setAvatar(id: string, avatar: string) {
    if (await this.existsObj(id)) {
      const user = (await repository.findByPk(id)) as User;
      const hasAvatar = user.get().avatar;
      if (hasAvatar) {
        const pathOldAvatar = path.resolve('public', 'uploads', hasAvatar);
        await fs.stat(pathOldAvatar);
        await fs.unlink(pathOldAvatar);
      }
      user.avatar = avatar;
      return (await (user.save())).get();
    } else {
      throw new HandleError('User not found', 404);
    }
  }

  // Vai tratar um usuario especifico
  public async showProfile({ user_id }: IRequest) {

    const user = await repository.findByPk(user_id);
      
    if (!user) {
      throw new HandleError(`The user with id ${user_id} does not exist.`);
    }

    return user.dataValues;
  }

  // Vai tratar um usuario especifico
  public async updateProfile({ 
      user_id, 
      name, 
      email,
      password, 
      old_password }: IUpdateProfileRequest) {

    if (await this.existsObj(user_id)) {

      const user = (await repository.findByPk(user_id));

      if (!user) {
        throw new HandleError('The user was not found.')
      }
      
      const existsEmail = (await repository.findAll({ where: { email }})).length > 0;

      if (existsEmail && user.email !== email) { // Lanca erro
        throw new HandleError(`There is already a user with this email.`);
      }

      if (password && !old_password) {
        throw new HandleError('Old password is not included.');
      }
      
      if (old_password && !bcrypt.compareSync(old_password, user.password)) {
        throw new HandleError('The old password does not match with saved password in the database.');
      } 

      if (name) user.name = name;
      if (email) user.email = email;
      if (password) user.password = password;

      return await user.save();
    }

    throw new HandleError(`The user with id ${user_id} does not exist.`);
  }

  private async existsEmail(record: IUser) {
    const users = await repository.findAll({ where: { email: { [Op.eq]: record.email }}});
    return users.length > 0;
  }

  private async existsObj(id: string) {
    const users = await repository.findAll({ where: { id: { [Op.eq]: id }}});
    return users.length > 0;
  }

}