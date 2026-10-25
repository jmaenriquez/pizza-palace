import { Router } from "express";

import ctrl from '../controllers/checkOutController'
import checkAuth from "../middlewares/checkAuthentication";
import validations from '../middlewares/checkOutValidations'

const route = Router();

route.post('/order', validations, checkAuth.authenticateUser, ctrl.placeOrder);
route.get('/order/:id', checkAuth.authenticateUser, ctrl.getReceipt);
route.get('/order', checkAuth.authenticateUser, ctrl.getAllOrders);

export default route;