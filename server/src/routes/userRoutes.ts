import { Router } from 'express';

import ctrl from '../controllers/userController'

const router = Router();

router.post('/users', ctrl.add);

export default router