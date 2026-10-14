import { Router } from 'express'

import ctrl from '../controllers/cartController'
import checkAuth from '../middlewares/checkAuthentication'

const route = Router();

route.post('/cart', checkAuth.authenticateUser, ctrl.add);
route.get('/cart', checkAuth.authenticateUser, ctrl.get);
route.put('/cart/:id', checkAuth.authenticateUser, ctrl.update);
route.delete('/cart/:id', checkAuth.authenticateUser, ctrl.remove);

export default route;