import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const locations = [
  { name: 'London', latitude: 51.5074, longitude: -0.1278 },
  { name: 'Paris', latitude: 48.8566, longitude: 2.3522 },
  { name: 'New York', latitude: 40.7128, longitude: -74.0060 },
  { name: 'Tokyo', latitude: 35.6762, longitude: 139.6503 },
];

async function getBooksByLocation(location) {
  const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${location.name}&key=${process.env.GOOGLE_BOOKS_API_KEY}`);
  const data = await response.json();
  return data.items.slice(0, 10).map(item => ({
    title: item.volumeInfo.title,
    author: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown',
    description: item.volumeInfo.description || 'No description available',
    location: location.name,
    latitude: location.latitude,
    longitude: location.longitude,
  }));
}

async function initDb() {
  const db = await open({
    filename: process.env.DB_PATH || path.join(__dirname, '..', 'database.sqlite'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      description TEXT,
      location TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_books_location ON books (location);
    CREATE INDEX IF NOT EXISTS idx_books_coords ON books (latitude, longitude);
  `);

  for (const location of locations) {
    const books = await getBooksByLocation(location);
    for (const book of books) {
      await db.run(
        'INSERT INTO books (title, author, description, location, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)',
        [book.title, book.author, book.description, book.location, book.latitude, book.longitude]
      );
    }
  }

  console.log('Database initialized successfully with sample data');

  await db.close();
}

initDb().catch(console.error);