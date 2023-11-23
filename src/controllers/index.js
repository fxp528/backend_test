import { Router } from 'express';
import { importDatas, fetchList, fetchCount } from '../services/index.js';
const router = Router();

router.post('/import', async (req, res, next) => {
    try {
        const result = await importDatas(req.body);
        return res.json(result);
    } catch (error) {
        return next(error);
    }
});
router.post('/count', async (req, res) => {
  try {    
    const result = await fetchCount(req.body);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ msg: error });
  }
});
router.post('/list', async (req, res) => {
  try {
    const result = await fetchList(req.body);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ msg: error });
  }
});

export default router;