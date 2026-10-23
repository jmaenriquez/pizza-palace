import { Router } from "express";

import ctrl from '../controllers/checkOutController'
import checkAuth from "../middlewares/checkAuthentication";

const route = Router();

route.post('/order', checkAuth.authenticateUser, ctrl.placeOrder);
route.get('/order/:id', checkAuth.authenticateUser, ctrl.getReceipt);
route.get('/order', checkAuth.authenticateUser, ctrl.getAllOrders);

export default route;