import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Open SQLite database connection
const dbPromise = open({
  filename: path.join(__dirname, 'database.sqlite'),
  driver: sqlite3.Database
});

app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// API endpoint to get books by location
app.get('/api/books', async (req, res) => {
  const { lat, lon, radius = 10 } = req.query;
  try {
    const db = await dbPromise;
    const books = await db.all(`
      SELECT b.* FROM books b
      JOIN locations l ON b.location_id = l.id
      WHERE (l.latitude BETWEEN ? AND ?)
        AND (l.longitude BETWEEN ? AND ?)
    `, [
      parseFloat(lat) - radius/111, 
      parseFloat(lat) + radius/111,
      parseFloat(lon) - radius/(111 * Math.cos(parseFloat(lat) * Math.PI/180)),
      parseFloat(lon) + radius/(111 * Math.cos(parseFloat(lat) * Math.PI/180))
    ]);
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching books' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});