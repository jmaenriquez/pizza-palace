import { Router } from 'express';
import ctrl from '../controllers/userController';
import checkAuth from '../middlewares/checkAuthentication';

const route = Router();

route.get('/user_profile', checkAuth.authenticateUser, ctrl.get );
route.put('/user_profile/:id', checkAuth.authenticateUser, ctrl.update);

export default route;