# Library Management System - Frontend

React frontend for the Library Management System with role-based dashboards.

## Features

- **Authentication**: Login/Register pages
- **Admin Dashboard**: Manage books, view all transactions, delete books
- **Librarian Dashboard**: Add and manage books
- **Student Dashboard**: Browse books, issue/return books, view personal transactions
- **Protected Routes**: Role-based access control

## Setup Instructions

1. Install dependencies:
```bash
cd Library-frontend
npm install
```

2. Start the development server:
```bash
npm start
```

The app will run on `http://localhost:3000`

## Backend Connection

Make sure your backend is running on `http://localhost:5000`

## User Roles

- **Admin**: Full access to manage books and view all transactions
- **Librarian**: Can add and view books
- **Student**: Can browse books, issue and return books, view own transactions

## Default Test Users

Register new users with different roles to test the application.
