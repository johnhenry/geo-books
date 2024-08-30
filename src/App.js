import React, { useState } from 'react';
import Map from './Map';
import BookList from './BookList';

function App() {
  const [selectedBooks, setSelectedBooks] = useState([]);

  const handleLocationSelect = async (lat, lon) => {
    try {
      const response = await fetch(`/api/books?lat=${lat}&lon=${lon}&distance=10`);
      const books = await response.json();
      setSelectedBooks(books);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Map onLocationSelect={handleLocationSelect} />
      <BookList books={selectedBooks} />
    </div>
  );
}

export default App;