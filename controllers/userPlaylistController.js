import { PrismaClient } from '@prisma/client';
import { bigIntToString } from '../helpers/prismaHelper.js';
const prisma = new PrismaClient();
 
export const createUserPlaylist = async (req, res) => {
  try {
    const newUserPlaylist = await prisma.user_playlist.create({
      data: req.body,
    });
    res.send(JSON.stringify(newUserPlaylist, bigIntToString));
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
};

