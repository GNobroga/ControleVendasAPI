import { Router } from 'express';
import ProductController from '../controllers/ProductController';
import { celebrate, Segments } from 'celebrate';
import Joi from 'joi';
import AuthMiddleware from '../middlewares/AuthMiddleware';

const routes = Router();

routes.get(
  '/:id', 
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    }
  }), 
  ProductController.findById);

routes.get('/', ProductController.index);

routes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().max(255).required(),
      price: Joi.number().optional(),
      inventory: Joi.number().optional(),
    },
  }),
  ProductController.create);

routes.put(
  '/:id', 
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      name: Joi.string().max(255).required(),
      price: Joi.number().optional(),
      inventory: Joi.number().optional(),
    },
  }),
  ProductController.update);

routes.delete(
  '/:id', 
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    }
  }),
  ProductController.delete);

export default routes;