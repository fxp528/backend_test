import { Router } from 'express';
import { importData, fetchList, fetchCount } from '../controllers/index.js';
const router = Router();

router.post('/import', importData);
router.post('/count', fetchCount);
router.post('/list', fetchList);

export default router;