import { Router } from 'express';
import requireAdmin from '../middlewares/requireAdmin';

import ctrl from '../controllers/productController'
import multer from 'multer';

const router = Router();

const upload = multer({ storage: multer.memoryStorage(),  limits: { fileSize: 5 * 1024 * 1024 } })
router.post('/products', requireAdmin, upload.single('img'), ctrl.add);

export default router