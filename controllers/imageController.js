import { PrismaClient } from '@prisma/client';
import { buildImagePath }  from '../helpers/imageHelper.js';
import Client from 'ssh2-sftp-client';
import { v4 as uuidv4 } from 'uuid'
import path from 'path';
import fs from 'fs';
import dotenv from "dotenv";

const prisma = new PrismaClient();
const sftp = new Client();
 
dotenv.config();

export const createImage = async (req, res) => {
    try {
        const file = req.file;

        console.log(file)
        const image = {
            origin_name: file.originalname,
            file_name: uuidv4(),
            file_extension: path.extname(file.originalname),
            created_by: "cucum",
        }

        console.log(image);
        try {
            // upload
            await sftp.connect({
                host: process.env.SFTP_HOST,
                port: process.env.SFTP_PORT,
                username: process.env.SFTP_USER,
                password: process.env.SFTP_PASSWORD
            })
            await sftp.put(file.path, `/image-uploader/uploads/${image.file_name}${image.file_extension}`);
            // db
            await prisma.image.create({
                data: image,
            });
        } finally {
            await sftp.end();
        }

        // remove file
        fs.unlink(file.path, (err) => {
        if (err) {
            console.error(err);
        }
        });

        res.send(buildImagePath(`${image.file_name}${image.file_extension}`));
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
};