import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { getUser, clearAuth } from '../utils/auth';

const LibrarianDashboard = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: '', author: '', ISBN: '', quantity: '', available: ''
  });
  const user = getUser();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data } = await API.get('/books');
      setBooks(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await API.post('/books', newBook);
      setNewBook({ title: '', author: '', ISBN: '', quantity: '', available: '' });
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add book');
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const totalBooks = books.reduce((sum, book) => sum + book.quantity, 0);
  const availableBooks = books.reduce((sum, book) => sum + book.available, 0);

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h1>📖 Librarian Dashboard</h1>
        <div className="navbar-right">
          <span className="user-info">👋 Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card stat-purple">
            <div className="stat-icon">📚</div>
            <div className="stat-info">
              <h3>{books.length}</h3>
              <p>Book Titles</p>
            </div>
          </div>
          <div className="stat-card stat-blue">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>{totalBooks}</h3>
              <p>Total Copies</p>
            </div>
          </div>
          <div className="stat-card stat-green">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{availableBooks}</h3>
              <p>Available Now</p>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>➕ Add New Book</h2>
          <form onSubmit={handleAddBook}>
            <div className="form-inline">
              <input
                type="text"
                placeholder="Title"
                value={newBook.title}
                onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Author"
                value={newBook.author}
                onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="ISBN"
                value={newBook.ISBN}
                onChange={(e) => setNewBook({...newBook, ISBN: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Quantity"
                value={newBook.quantity}
                onChange={(e) => setNewBook({...newBook, quantity: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Available"
                value={newBook.available}
                onChange={(e) => setNewBook({...newBook, available: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="btn btn-success">Add Book</button>
          </form>
        </div>

        <div className="section">
          <h2>📚 Library Collection ({books.length} titles)</h2>
          <div className="book-grid">
            {books.map((book) => (
              <div key={book._id} className="book-card">
                <div className="book-icon">📘</div>
                <h3>{book.title}</h3>
                <p>✍️ <strong>Author:</strong> {book.author}</p>
                <p>🔖 <strong>ISBN:</strong> {book.ISBN}</p>
                <p>📊 <strong>Available:</strong> {book.available}/{book.quantity}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibrarianDashboard;
