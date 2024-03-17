import pool from '../db.js';

export const getAllPlaylists = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM ji_project.playlist');
        res.send(result.rows);
      } catch (err) {
        console.error(err);
        res.send("Error " + err);
      }
};
export const getPlaylist = (req, res) => { };
export const createPlaylist = (req, res) => { };
export const updatePlaylist = (req, res) => { };
export const deletePlaylist = (req, res) => { };
