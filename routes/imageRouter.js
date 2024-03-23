import express from 'express';
import multer from 'multer';
import {
  createImage,
} from '../controllers/imageController.js';
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post('/', upload.single('file'), createImage);

export default router;