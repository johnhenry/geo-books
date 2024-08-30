import test from 'node:test';
import assert from 'node:assert/strict';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to create a test database
async function createTestDb() {
  const db = await open({
    filename: ':memory:',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL
    );

    CREATE TABLE books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      location_id INTEGER,
      FOREIGN KEY (location_id) REFERENCES locations (id)
    );

    CREATE INDEX idx_locations_coords ON locations (latitude, longitude);
  `);

  return db;
}

// Test suite
test('Database operations', async (t) => {
  const db = await createTestDb();

  await t.test('Insert and retrieve a location', async () => {
    await db.run('INSERT INTO locations (name, latitude, longitude) VALUES (?, ?, ?)', 
      ['New York', 40.7128, -74.0060]);
    
    const location = await db.get('SELECT * FROM locations WHERE name = ?', ['New York']);
    assert.equal(location.name, 'New York');
    assert.equal(location.latitude, 40.7128);
    assert.equal(location.longitude, -74.0060);
  });

  await t.test('Insert and retrieve a book', async () => {
    await db.run('INSERT INTO locations (name, latitude, longitude) VALUES (?, ?, ?)', 
      ['London', 51.5074, -0.1278]);
    const location = await db.get('SELECT id FROM locations WHERE name = ?', ['London']);
    
    await db.run('INSERT INTO books (title, author, location_id) VALUES (?, ?, ?)', 
      ['1984', 'George Orwell', location.id]);
    
    const book = await db.get('SELECT * FROM books WHERE title = ?', ['1984']);
    assert.equal(book.title, '1984');
    assert.equal(book.author, 'George Orwell');
    assert.equal(book.location_id, location.id);
  });

  await t.test('Retrieve books by location', async () => {
    // Insert test data
    await db.run('INSERT INTO locations (name, latitude, longitude) VALUES (?, ?, ?)', 
      ['Paris', 48.8566, 2.3522]);
    const location = await db.get('SELECT id FROM locations WHERE name = ?', ['Paris']);
    
    await db.run('INSERT INTO books (title, author, location_id) VALUES (?, ?, ?)', 
      ['The Hunchback of Notre-Dame', 'Victor Hugo', location.id]);
    await db.run('INSERT INTO books (title, author, location_id) VALUES (?, ?, ?)', 
      ['Les Misérables', 'Victor Hugo', location.id]);

    // Test the query
    const books = await db.all(`
      SELECT b.* FROM books b
      JOIN locations l ON b.location_id = l.id
      WHERE (l.latitude BETWEEN ? AND ?)
        AND (l.longitude BETWEEN ? AND ?)
    `, [48.8566 - 0.1, 48.8566 + 0.1, 2.3522 - 0.1, 2.3522 + 0.1]);

    assert.equal(books.length, 2);
    assert.equal(books[0].title, 'The Hunchback of Notre-Dame');
    assert.equal(books[1].title, 'Les Misérables');
  });

  await db.close();
});

// You can add more test suites here for other parts of your application