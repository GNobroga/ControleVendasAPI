import { Router } from "express";
import ProductRoutes from '../../routes/ProductRoutes';
import UserRoutes from '../../routes/UserRoutes';
import AuthRoutes from '../../routes/AuthRoutes';
import PasswordRoutes from '../../routes/PasswordRoutes';
import CustomerRoutes from '../../routes/CustomerRoutes';
import OrderRoutes from '../../routes/OrderRoutes';
import AuthMiddleware from "../../middlewares/AuthMiddleware";

const routes = Router();

routes.use('/users', UserRoutes);
routes.use('/products', ProductRoutes);
routes.use('/auth', AuthRoutes);
routes.use('/forgot', PasswordRoutes);
routes.use('/customers', CustomerRoutes);
routes.use('/orders', OrderRoutes);

export default routes; 