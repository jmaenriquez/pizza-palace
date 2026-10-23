import { Router } from 'express';
import checkAuth from '../middlewares/checkAuthentication';

import ctrl from '../controllers/productController'
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(),  limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/products', checkAuth.requireAdmin, upload.single('img'), ctrl.add);
router.get('/products', ctrl.get);
router.put('/products/:id', checkAuth.requireAdmin, upload.single('img'), ctrl.update);

export default router