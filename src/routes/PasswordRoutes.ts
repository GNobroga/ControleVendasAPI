import { Router } from "express";
import ForgotPasswordController from "../controllers/ForgotPasswordController";
import { Joi, Segments, celebrate } from "celebrate";
import ResetPasswordController from "../controllers/ResetPasswordController";


// http://localhost:3333/password/forgot
const routes = Router();

routes.post(
  '/password', 
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    }
  }),
  ForgotPasswordController.create);

  routes.post(
    '/reset', 
    celebrate({
      [Segments.BODY]: {
        key: Joi.string().uuid().required(),
        password: Joi.string().required(),
      }
    }),
    ResetPasswordController.execute);

export default routes;