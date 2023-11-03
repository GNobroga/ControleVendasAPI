import { 
  CreationOptional, 
  DataTypes, 
  BelongsToSetAssociationMixin, 
  InferAttributes,
  InferCreationAttributes, 
  Model,
  BelongsToManyAddAssociationMixin,

} from "sequelize";
import sequelize from "../config/db/connection";
import { v4 as uuid4 } from 'uuid';
import { Product } from "./Product";
import Customer from "./Customer";

export default class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {

  declare id: CreationOptional<string>;
  declare customer_id: CreationOptional<string>;
  declare quantity: CreationOptional<number>;

  declare setCustomer: BelongsToSetAssociationMixin<Customer, string>;
  declare addProducts: BelongsToManyAddAssociationMixin<Product, string>;
}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuid4(),
    },
    customer_id: {
      type: DataTypes.UUID,
      references: {
        model: Customer,
        key: 'id',
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    }
  },
  {
    tableName: 'orders',
    sequelize,
    timestamps: true,
  }
);

Order.belongsTo(Customer, {
  foreignKey: 'customer_id',
});

Customer.hasMany(Order, {
  foreignKey: 'customer_id',
});

Order.belongsToMany(Product, {
  through: 'order_products',
  foreignKey: {
    name: 'order_id',
    allowNull: false,
  },
  otherKey: {
    name: 'product_id',
    allowNull: false,
  },

});

