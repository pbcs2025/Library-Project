import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUser, isAuthenticated } from '../utils/auth';

const ProtectedRoute = ({ children, allowedRoles }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  const user = getUser();
  
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
