import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import connection from '../config/db/connection';
import { v4 as uuidv4 } from 'uuid';


export class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare price: CreationOptional<number>;
  declare inventory: CreationOptional<number>;
 };

Product.init({
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    allowNull: false,
    defaultValue: () => uuidv4(),
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  inventory: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
  },
}, {
  sequelize: connection,
  tableName: 'products',
  modelName: 'Product',
});

