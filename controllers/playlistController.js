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
export const getPlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM ji_project.playlist WHERE id = $1', [id]);
    res.send(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
};

export const createPlaylist = async (req, res) => {
  try {
    const { title, description } = req.body;
    const result = await pool.query('INSERT INTO ji_project.playlist (title, description) VALUES ($1, $2) RETURNING *', [title, description]);
    res.send(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
};

export const updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const result = await pool.query('UPDATE ji_project.playlist SET title = $1, description = $2 WHERE id = $3 RETURNING *', [title, description, id]);
    res.send(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM ji_project.playlist WHERE id = $1 RETURNING *', [id]);
    res.send(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
};
