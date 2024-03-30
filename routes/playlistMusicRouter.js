import express from 'express';
import {
  createPlaylistMusic,
} from '../controllers/playlistMusicController.js';

const router = express.Router();

router.post('/', createPlaylistMusic);

export default router;