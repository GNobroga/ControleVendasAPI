import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../config/db/connection";
import { v4 as uuidv4 } from 'uuid';

export default class Customer extends Model<InferAttributes<Customer>, InferCreationAttributes<Customer>> {
  declare public id: CreationOptional<string>;
  declare public name: string;
  declare public email: string;

}

Customer.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuidv4(),
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    }
  },
  {
    tableName: 'customers',
    sequelize,
    createdAt: true,
    updatedAt: true,
  }
)