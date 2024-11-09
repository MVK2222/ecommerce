// src/components/PrivateAdminRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateAdminRoute = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();

  if (!currentUser) {
    // Redirect to login if the user is not authenticated
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    // Redirect to home if the user is authenticated but not an admin
    return <Navigate to="/" />;
  }

  // Render the children components if the user is authenticated and an admin
  return children;
};

export default PrivateAdminRoute;
