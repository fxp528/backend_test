import { Router } from 'express';
import { importDatas, fetchList, fetchCount } from '../services/index.js';
import multer from 'multer';
const router = Router();
const upload = multer();

// router.post('/import', async (req, res, next) => {
router.post('/import', upload.single('excelFile'), async (req, res, next) => {
    // 從請求中獲取Excel文件的Buffer
    const buffer = req.file ? req.file.buffer : null;
    if (buffer) {
        try {
            const result = await importDatas(buffer);
            return res.json(result);
        } catch (error) {
            return next(error);
        }
    } else {
        return res.status(404).send('The file was not found.');
    }
});
router.post('/count', async (req, res) => {
  try {    
    const result = await fetchCount(req.body);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
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