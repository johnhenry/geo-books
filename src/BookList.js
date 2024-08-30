import React from 'react';

function BookList({ books }) {
  return (
    <div style={{ width: '30%', height: '100%', overflowY: 'auto', padding: '20px', boxSizing: 'border-box' }}>
      <h2>Books in this location</h2>
      {books.length === 0 ? (
        <p>No books found for this location.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {books.map((book) => (
            <li key={book.id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
              <h3>{book.title}</h3>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Location:</strong> {book.location}</p>
              <p>{book.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BookList;