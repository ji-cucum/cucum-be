import express from 'express';
import {
  getAllMusics,
  getMusic,
  createMusic,
  updateMusic,
  deleteMusic
} from '../controllers/musicController.js';

const router = express.Router();

router.post('/', getAllMusics);
router.get('/:id', getMusic);
router.post('/', createMusic);
router.put('/:id', updateMusic);
router.delete('/:id', deleteMusic);

export default router;