import sequelize from "../config/db/connection";
import Customer from "../entities/Customer";
import Order from "../entities/Order";
import { Product } from "../entities/Product";
import HandleError from "../shared/errors/HandleError";

interface IProduct {
  id: string;
  quantity: number;
};

interface IRequest {
  customer_id: string;
  products: Array<IProduct>;
}

export default class OrderService {

  public async create({ customer_id, products }: IRequest) {
    
    const customer = await Customer.findByPk(customer_id);

    if (!customer) {
      throw new HandleError('Customer does not exist.');
    }
    
    const transaction = await sequelize.transaction();

    const orders = [];

    try {
      for (const { id, quantity } of products) {
        const product = await Product.findByPk(id);

        if (!product) throw new Error(`Could not find product ${id}.`);

        if (!(product.inventory > 0 && product.inventory >= quantity)) {
          throw new Error(`The product with id ${id} does not have enough quantity. The available quantity is ${product.inventory},and the requested quantity is ${quantity}. `);
        }

        product.inventory -= quantity;

        await product.save();

        const order = await Order.create({ quantity, }, { transaction });
        await order.setCustomer(customer, { transaction });
        console.log(order.addProducts)
        await order.addProducts(product, { transaction });
        orders.push(order);
      }

      await transaction.commit();
      return orders;
    } catch (e) {
      await transaction.rollback();
      if (e instanceof Error) {
        throw new HandleError(e.message);
      } else {
        throw new HandleError(`An error occurred during the add process order products.`);
      }
    }
  }

  public async show(id: string) {
    const order = await Order.findByPk(id);

    if (!order) throw new HandleError(`Order does not exist.`);
    
    return order;
  }


}