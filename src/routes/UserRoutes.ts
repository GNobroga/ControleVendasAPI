import { Router } from "express";
import UserController from "../controllers/UserController";
import { Segments, celebrate } from "celebrate";
import Joi from "joi";
import multer from "multer";
import uploadConfig from "../config/uploadConfig";

const uploadMulter = multer({ storage: uploadConfig.storage, });

const routes = Router();

routes.get('/', UserController.index);
routes.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    }
  }), 
  UserController.find);
routes.post('/', UserController.create);
routes.put(
  '/:id', 
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      id: Joi.string().uuid().optional(),
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      avatar: Joi.string().optional(),
    }
  }), 
  UserController.update);
routes.delete(
    '/:id', 
    celebrate({
      [Segments.PARAMS]: {
        id: Joi.string().uuid().required(),
      }
    }), 
    UserController.delete);

routes.post(
    '/avatar/:id', 
    uploadMulter.any(), 
    UserController.uploadAvatar);

routes.get(
  '/profile/:id', 
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }), 
  UserController.showProfile);

routes.post(
    '/profile/:id', 
    celebrate({
      [Segments.PARAMS]: {
        id: Joi.string().uuid().required(),
      },
      [Segments.BODY]: {
        name: Joi.string().optional(),
        email: Joi.string().email().required(),
        password: Joi.string().optional(),
        old_password: Joi.string().optional(),
        password_confirmation: Joi.string() 
          .valid(Joi.ref('password'))
          .when('password', {
            is: Joi.exist(),
            then: Joi.required(),
          })
      }
    }), 
    UserController.updateProfile);

export default routes;