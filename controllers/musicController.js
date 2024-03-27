import { PrismaClient } from '@prisma/client';
import { bigIntToString } from '../helpers/prismaHelper.js';
const prisma = new PrismaClient();
 
export const getAllMusics = async (req, res) => {
  try {

    const { sort, order, offset, limit } = req.body;
    const params = {
        orderBy: {
          [sort]: order,
        },
        skip: offset,
        take: limit,
      } 
    const [ musics, musicCount ] = await Promise.all([
      prisma.music.findMany(params),
      prisma.music.count(),
    ]);
    res.send({ 
      items: JSON.parse(JSON.stringify(musics, bigIntToString)), 
      meta: { total: musicCount }
    });
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
};

export const getMusic = async (req, res) => {
  try {
    const { id } = req.params;
    const music = await prisma.music.findUnique({
      where: { id: Number(id) },
    });
    res.send(JSON.stringify(music, bigIntToString));
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
};

export const createMusic = async (req, res) => {
  try {
    const newMusic = await prisma.music.create({
      data: req.body,
    });
    res.send(JSON.stringify(newMusic, bigIntToString));
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
};

export const updateMusic = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const updatedMusic = await prisma.music.update({
      where: { id: Number(id) },
      data: { title, description },
    });
    res.send(JSON.stringify(updatedMusic, bigIntToString));
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
};

export const getMusicInfo = async (req, res) => {
  try {
    const { url } = req.params;
    

    res.send(JSON.stringify(music, bigIntToString));
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

export const deleteMusic = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMusic = await prisma.music.delete({
      where: { id: Number(id) },
    });
    res.send(JSON.stringify(deletedMusic, bigIntToString));
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
};

