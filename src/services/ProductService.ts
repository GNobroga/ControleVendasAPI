import { Op } from 'sequelize';
import { Product as respository } from "../entities/Product";
import HandleError from "../shared/errors/HandleError";


interface IRequest {
  id?: string;
  name: string;
  price?: number;
  inventory?: number;
}


export default class ProductService {

  public async create(record: IRequest) {
    if (this.isEmpty(record)) {
      throw new HandleError('All fields must be filled');
    }

    const name = record.name;

    const productExists = await this.existsName(name);

    if (productExists) {
      throw new HandleError('There is already a product with this name.');
    }

    const newProduct = await respository.create({ ...record });

    return newProduct;

  }

  public async getAll(page: number, size: number) {
    return await respository.findAll({ limit: size, offset: page * size });
  }

  public async getOne(id: string) {
    const exists = await this.exists(id);
    if (exists) {
      return await respository.findByPk(id);
    } 
    throw new HandleError('We could not find a product with name in our database.');
  }

  public async update(id: string, record: IRequest) {
    const exists = await this.exists(id);
    if (exists) {
      const product = await respository.findByPk(id);

      if (!product) {
        throw new HandleError('This product does not exist.');
      }

      const name = record.name;

      if (name !== product.name && await this.existsName(name)) {
        throw new HandleError('There is already a product with this name.');
      }

      product.name = name;
      product.price = record.price ?? product.price;
      product.inventory = record.inventory ?? product.inventory;

      return (await product.save()).get();
    } 

    throw new HandleError('We could not find a product with name in our database.');
  }

  public async delete(id: string) {
    return (await respository.destroy({ where: { id }})) > 0;
  }

  private isEmpty(record: IRequest): boolean {
    return Object.values(record).some(value => value === undefined || value === null);
  }

  private async exists(id: string): Promise<boolean> {
    return await respository.findByPk(id) !== null;
  }

  private async existsName(name: string): Promise<boolean> {
    return (await respository.findAll({
      where: {
        name: { [Op.eq]: name, }
      }
    })).length > 0;
  }
}