import { PrismaClient } from '@prisma/client';
import { bigIntToString } from '../helpers/prismaHelper.js';
const prisma = new PrismaClient();

export const getAllPlaylists = async (req, res) => {
  try {
    //クライアントから受けたユーザー情報
    const userId = req.user.id;

    console.log(userId)

    if(!userId){
      return res.status(401).json({nessage: "사용자 인증이 필요합니다." });
    }

    const { sort, order, offset, limit } = req.body;

      const playlists = await prisma.userPlaylist.findMany({
        where: {
          user_id: Number(userId),
        },
        include:{
          playlist: true,
        },
        orderBy: {
          [sort]: order,
        },
        skip: offset,
        take:limit,
      });
     
      const playlistCount = await prisma.playlist.count({
        where: {
          user_id: userId,
        },
      });

    res.send({ 
      items: JSON.parse(JSON.stringify(playlists, bigIntToString)), 
      meta: { total: playlistCount },
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
  const userId = req.user.id;

  console.log(userId)

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

