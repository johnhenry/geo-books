import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import morgan from 'morgan';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Open SQLite database connection
const dbPromise = open({
  filename: process.env.DB_PATH || path.join(__dirname, 'database.sqlite'),
  driver: sqlite3.Database
});

app.use(express.json());
app.use(cors());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'An unexpected error occurred' });
});

function getCloseLocations(coordinates, distance) {
  const { latitude, longitude } = coordinates;
  const latDiff = distance / 111; // Approximately 1 degree of latitude = 111 km
  const lonDiff = distance / (111 * Math.cos(latitude * Math.PI / 180));

  return {
    minLat: latitude - latDiff,
    maxLat: latitude + latDiff,
    minLon: longitude - lonDiff,
    maxLon: longitude + lonDiff
  };
}

async function getBooksByLocation(db, coordinates, distance) {
  const { minLat, maxLat, minLon, maxLon } = getCloseLocations(coordinates, distance);
  
  const books = await db.all(`
    SELECT * FROM books
    WHERE latitude BETWEEN ? AND ?
    AND longitude BETWEEN ? AND ?
  `, [minLat, maxLat, minLon, maxLon]);

  return books;
}

// API endpoint to get books by location
app.get('/api/books', async (req, res, next) => {
  const { lat, lon, distance = 10 } = req.query;
  try {
    const db = await dbPromise;
    const books = await getBooksByLocation(db, { latitude: parseFloat(lat), longitude: parseFloat(lon) }, parseFloat(distance));
    res.json(books);
  } catch (err) {
    next(err);
  }
});

// API endpoint to get all locations
app.get('/api/locations', async (req, res, next) => {
  try {
    const db = await dbPromise;
    const locations = await db.all('SELECT DISTINCT location, latitude, longitude FROM books');
    res.json(locations);
  } catch (err) {
    next(err);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});