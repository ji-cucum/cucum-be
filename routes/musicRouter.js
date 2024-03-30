import express from 'express';
import {
  getAllMusics,
  getMusic,
  createMusic,
  updateMusic,
  deleteMusic,
  searchMusic,
  searchArtist
} from '../controllers/musicController.js';

const router = express.Router();

router.post('/search', getAllMusics);
router.get('/:id', getMusic);
router.post('/', createMusic);
router.put('/:id', updateMusic);
router.delete('/:id', deleteMusic);

router.get('/search/musics/:id', searchMusic);
router.get('/search/artists/:id', searchArtist);

export default router;