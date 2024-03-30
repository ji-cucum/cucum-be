import { PrismaClient } from '@prisma/client';
import { bigIntToString } from '../helpers/prismaHelper.js';
const prisma = new PrismaClient();
 
export const createPlaylistMusic = async (req, res) => {
  try {
    const newPlaylistMusic = await prisma.playlist_music.create({
      data: req.body,
    });
    res.send(JSON.stringify(newPlaylistMusic, bigIntToString));
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
};

