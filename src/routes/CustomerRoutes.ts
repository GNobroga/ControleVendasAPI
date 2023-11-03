import { Router } from 'express';
import CustomController from '../controllers/CustomerController';
import { Segments, celebrate } from 'celebrate';
import Joi from 'joi';

const routes = Router();

routes.get('/', CustomController.index);
routes.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    }
  }), 
  CustomController.show);
routes.post('/', 
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().optional(),
      email: Joi.string().email().required(),
    },
  }), 
CustomController.create);
routes.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      name: Joi.string().optional(),
      email: Joi.string().email().required(),
    },
  }), 
 CustomController.update);
routes.delete(
  '/:id', 
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    }
  }), 
  CustomController.delete);

export default routes;