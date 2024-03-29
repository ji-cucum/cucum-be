import { PrismaClient } from '@prisma/client';
import { bigIntToString } from '../helpers/prismaHelper.js';
const prisma = new PrismaClient();
 
export const getAllPlaylists = async (req, res) => {
  try {

    const { sort, order, offset, limit } = req.body;
    const params = {
        orderBy: {
          [sort]: order,
        },
        skip: offset,
        take: limit,
      } 
    const [ playlists, playlistCount ] = await Promise.all([
      prisma.playlist.findMany(params),
      prisma.playlist.count(),
    ]);
    res.send({ 
      items: JSON.parse(JSON.stringify(playlists, bigIntToString)), 
      meta: { total: playlistCount }
    });
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
};

export const getPlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const playlist = await prisma.playlist.findUnique({
      where: { id: Number(id) },
    });
    res.send(JSON.stringify(playlist, bigIntToString));
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
};

export const createPlaylist = async (req, res) => {
  try {
    const newPlaylist = await prisma.playlist.create({
      data: req.body,
    });
    res.send(JSON.stringify(newPlaylist, bigIntToString));
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
};

export const updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const updatedPlaylist = await prisma.playlist.update({
      where: { id: Number(id) },
      data: { title, description },
    });
    res.send(JSON.stringify(updatedPlaylist, bigIntToString));
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPlaylist = await prisma.playlist.delete({
      where: { id: Number(id) },
    });
    res.send(JSON.stringify(deletedPlaylist, bigIntToString));
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
};