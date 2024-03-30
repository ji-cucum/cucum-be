import express from 'express';
import {
  createUserPlaylist,
} from '../controllers/userPlaylistController.js';

const router = express.Router();

router.post('/', createUserPlaylist);

export default router;