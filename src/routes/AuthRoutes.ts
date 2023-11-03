import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { Joi, Segments, celebrate } from "celebrate";

const routes = Router();

routes.post(
  '/', 
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },  
  }),
  AuthController.index);

export default routes;