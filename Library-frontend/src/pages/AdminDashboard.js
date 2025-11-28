import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { getUser, clearAuth } from '../utils/auth';

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [newBook, setNewBook] = useState({
    title: '', author: '', ISBN: '', quantity: '', available: ''
  });
  const user = getUser();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
    fetchTransactions();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data } = await API.get('/books');
      setBooks(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data } = await API.get('/transactions/all');
      setTransactions(data);
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

  const handleDeleteBook = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await API.delete(`/books/${id}`);
        fetchBooks();
      } catch (err) {
        alert('Failed to delete book');
      }
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const totalBooks = books.reduce((sum, book) => sum + book.quantity, 0);
  const availableBooks = books.reduce((sum, book) => sum + book.available, 0);
  const issuedBooks = transactions.filter(t => t.status === 'issued').length;

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h1>👑 Admin Dashboard</h1>
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
              <h3>{totalBooks}</h3>
              <p>Total Books</p>
            </div>
          </div>
          <div className="stat-card stat-green">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{availableBooks}</h3>
              <p>Available</p>
            </div>
          </div>
          <div className="stat-card stat-orange">
            <div className="stat-icon">📖</div>
            <div className="stat-info">
              <h3>{issuedBooks}</h3>
              <p>Issued</p>
            </div>
          </div>
          <div className="stat-card stat-blue">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>{transactions.length}</h3>
              <p>Total Transactions</p>
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
          <h2>📚 All Books ({books.length})</h2>
          <div className="book-grid">
            {books.map((book) => (
              <div key={book._id} className="book-card">
                <div className="book-icon">📕</div>
                <h3>{book.title}</h3>
                <p>✍️ <strong>Author:</strong> {book.author}</p>
                <p>🔖 <strong>ISBN:</strong> {book.ISBN}</p>
                <p>📊 <strong>Available:</strong> {book.available}/{book.quantity}</p>
                <button 
                  onClick={() => handleDeleteBook(book._id)} 
                  className="btn btn-danger btn-small"
                >
                  🗑️ Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h2>📋 All Transactions</h2>
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Book</th>
                <th>Issue Date</th>
                <th>Return Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id}>
                  <td>{t.studentId?.name || 'N/A'}</td>
                  <td>{t.bookId?.title || 'N/A'}</td>
                  <td>{new Date(t.issueDate).toLocaleDateString()}</td>
                  <td>{t.returnDate ? new Date(t.returnDate).toLocaleDateString() : '-'}</td>
                  <td>
                    <span className={`status-badge status-${t.status}`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
