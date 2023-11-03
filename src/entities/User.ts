import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../config/db/connection";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';


export interface IUser {
  id?: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
}
 
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare email: string;
  declare password: string;
  declare avatar: CreationOptional<string>;
};

User.init({

 id: {
  primaryKey: true,
  type: DataTypes.UUID,
  allowNull: false,
  defaultValue: () => uuidv4(),
 },
 name: {
  type: DataTypes.STRING,
  allowNull: false,
 },
 email: {
  type: DataTypes.STRING,
  unique: true,
  allowNull: false,
 },
 password: {
  type: DataTypes.STRING,
  allowNull: false,
  set (v: string) {
    const passEncoded = bcrypt.hashSync(v, 8); 
    this.setDataValue('password', passEncoded);
  },
 },
 avatar: {
  type: DataTypes.STRING,
 },
}, { sequelize, tableName: 'users' });