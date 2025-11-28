import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { getUser, clearAuth } from '../utils/auth';

const StudentDashboard = () => {
  const [books, setBooks] = useState([]);
  const [myTransactions, setMyTransactions] = useState([]);
  const user = getUser();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
    fetchMyTransactions();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data } = await API.get('/books');
      setBooks(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyTransactions = async () => {
    try {
      const { data } = await API.get('/transactions/my');
      setMyTransactions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleIssueBook = async (bookId) => {
    try {
      await API.post(`/transactions/issue/${bookId}`);
      alert('Book issued successfully!');
      fetchBooks();
      fetchMyTransactions();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to issue book');
    }
  };

  const handleReturnBook = async (transactionId) => {
    try {
      await API.post(`/transactions/return/${transactionId}`);
      alert('Book returned successfully!');
      fetchBooks();
      fetchMyTransactions();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to return book');
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const myIssuedBooks = myTransactions.filter(t => t.status === 'issued').length;
  const myReturnedBooks = myTransactions.filter(t => t.status === 'returned').length;
  const availableBooksCount = books.filter(b => b.available > 0).length;

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h1>🎓 Student Dashboard</h1>
        <div className="navbar-right">
          <span className="user-info">👋 Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card stat-blue">
            <div className="stat-icon">📚</div>
            <div className="stat-info">
              <h3>{availableBooksCount}</h3>
              <p>Books Available</p>
            </div>
          </div>
          <div className="stat-card stat-orange">
            <div className="stat-icon">📖</div>
            <div className="stat-info">
              <h3>{myIssuedBooks}</h3>
              <p>Currently Borrowed</p>
            </div>
          </div>
          <div className="stat-card stat-green">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{myReturnedBooks}</h3>
              <p>Books Returned</p>
            </div>
          </div>
          <div className="stat-card stat-purple">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>{myTransactions.length}</h3>
              <p>Total Transactions</p>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>📚 Browse Books</h2>
          <div className="book-grid">
            {books.map((book) => (
              <div key={book._id} className={`book-card ${book.available === 0 ? 'book-unavailable' : ''}`}>
                <div className="book-icon">{book.available > 0 ? '📗' : '📕'}</div>
                <h3>{book.title}</h3>
                <p>✍️ <strong>Author:</strong> {book.author}</p>
                <p>🔖 <strong>ISBN:</strong> {book.ISBN}</p>
                <p>📊 <strong>Available:</strong> {book.available}/{book.quantity}</p>
                {book.available > 0 && (
                  <button 
                    onClick={() => handleIssueBook(book._id)} 
                    className="btn btn-primary btn-small"
                  >
                    📖 Borrow Book
                  </button>
                )}
                {book.available === 0 && (
                  <button className="btn btn-small" disabled style={{background: '#95a5a6', cursor: 'not-allowed'}}>
                    ❌ Not Available
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h2>📋 My Transactions</h2>
          <table>
            <thead>
              <tr>
                <th>Book</th>
                <th>Author</th>
                <th>Issue Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {myTransactions.map((t) => (
                <tr key={t._id}>
                  <td>{t.bookId?.title || 'N/A'}</td>
                  <td>{t.bookId?.author || 'N/A'}</td>
                  <td>{new Date(t.issueDate).toLocaleDateString()}</td>
                  <td>{t.returnDate ? new Date(t.returnDate).toLocaleDateString() : '-'}</td>
                  <td>
                    <span className={`status-badge status-${t.status}`}>
                      {t.status}
                    </span>
                  </td>
                  <td>
                    {t.status === 'issued' && (
                      <button 
                        onClick={() => handleReturnBook(t._id)} 
                        className="btn btn-success btn-small"
                      >
                        ↩️ Return
                      </button>
                    )}
                    {t.status === 'returned' && (
                      <span style={{color: '#27ae60', fontWeight: 'bold'}}>✓ Completed</span>
                    )}
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

export default StudentDashboard;
