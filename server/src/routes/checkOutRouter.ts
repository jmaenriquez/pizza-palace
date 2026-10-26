import { Router } from "express";

import ctrl from '../controllers/checkOutController'
import checkAuth from "../middlewares/checkAuthentication";
import validations from '../middlewares/checkOutValidations'

const route = Router();

// User Access
route.post('/order', validations, checkAuth.authenticateUser, ctrl.placeOrder);
route.get('/order/:id', checkAuth.authenticateUser, ctrl.getReceipt);
route.get('/order', checkAuth.authenticateUser, ctrl.getAllOrders);

// Admin access
route.get('/admin/order',  ctrl.getAllUserOrders);
route.put('/admin/order/:id', checkAuth.requireAdmin, ctrl.updateUserOrder);

export default route;