import { Router } from "express";

import ctrl from '../controllers/addressController';
import checkAuth from "../middlewares/checkAuthentication";

const route = Router();

route.post('/address', checkAuth.authenticateUser, ctrl.add);
route.get('/address', checkAuth.authenticateUser, ctrl.get);
route.put('/address/:id', checkAuth.authenticateUser, ctrl.update);
route.delete('/address/:id', checkAuth.authenticateUser, ctrl.dlt);

export default route;