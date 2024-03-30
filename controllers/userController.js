import { PrismaClient } from '@prisma/client';
import { bigIntToString } from '../helpers/prismaHelper.js';
const prisma = new PrismaClient();

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { user_playlist: {
        include: { playlist: true } 
      }
    }
    });
    res.send(JSON.stringify(user, bigIntToString));
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
};
