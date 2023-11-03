import { Op } from "sequelize";
import Customer from "../entities/Customer";
import HandleError from "../shared/errors/HandleError";
import Order from "../entities/Order";

interface IRequest {
  name: string;
  email: string;
}

export default class CustomerService {

  public async findAll() {
    return await Customer.findAll();
  }

  public async findOne(id: string) {
    const customer = await Customer.findByPk(id);

    if (!customer) throw new HandleError('Customer does not exist');

    return customer;
  }

  public async create(record: IRequest) {

    const existEmail = await Customer.findAll({ where: { email: record.email, }});  

    if (existEmail.length) throw new HandleError('There is someone using the email.'); 

    return await Customer.create(record);
  }

  public async update(id: string, record: IRequest) {
    const customer = await Customer.findByPk(id);

    if (!customer) throw new HandleError('Customer does not exist');

    const existEmail = await Customer.findAll({
      where: {
        email: {
          [Op.eq]: record.email,
          [Op.ne]: customer.email,
        }
      }
    });

    if (existEmail.length) throw new HandleError('There is someone using the email.'); 

    customer.email = record.email;
    customer.name = record.name;
    return customer.save();
  } 


  public async delete(id: string) {
    const customer = await Customer.findByPk(id);

    if (customer) {
       await customer.destroy();
       return true;
    }

    throw new HandleError('Customer does not exist.');
  }

}