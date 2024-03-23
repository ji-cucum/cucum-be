import express from 'express';
import {
  getAllPlaylists,
  getPlaylist,
  createPlaylist,
  updatePlaylist,
  deletePlaylist
} from '../controllers/playlistController.js';

const router = express.Router();

router.post('/', getAllPlaylists);
router.get('/:id', getPlaylist);
router.post('/', createPlaylist);
router.put('/:id', updatePlaylist);
router.delete('/:id', deletePlaylist);

export default router;