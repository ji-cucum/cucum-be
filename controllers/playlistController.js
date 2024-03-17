import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
 
export const getAllPlaylists = async (req, res) => {
  try {
    const playlists = await prisma.playlist.findMany();
    res.send(playlists);
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
    res.send(playlist);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
};

export const createPlaylist = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newPlaylist = await prisma.playlist.create({
      data: { title, description },
    });
    res.send(newPlaylist);
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
    res.send(updatedPlaylist);
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
    res.send(deletedPlaylist);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
};

