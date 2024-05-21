import express from 'express';
import pool from './config/db';
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = 4000;

app.get('/test', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT $1::text as message', ['Database connected successfully']);
    res.json(result.rows[0].message);
    client.release();
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'An error occurred while executing query' });
  }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
