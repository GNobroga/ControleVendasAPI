import { Segments, celebrate } from "celebrate";
import { Router } from "express";
import Joi from "joi";
import OrderController from "../controllers/OrderController";

const routes = Router();

routes.post(
  '/', 
  celebrate({
    [Segments.BODY]: {
      customer_id: Joi.string().uuid().required(),
      products: Joi.required(),
    },
  }),
  OrderController.create,
)

routes.get(
  '/:id', 
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  OrderController.show,
)

export default routes;