import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('jwtToken');
  const userRole = localStorage.getItem('role');

  // If there's no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, verify the user's role matches one of them (case-insensitive)
  if (allowedRoles && allowedRoles.length > 0) {
    const hasPermission = allowedRoles.some(
      (role) => role.toLowerCase() === (userRole || '').toLowerCase()
    );

    if (!hasPermission) {
      console.warn(`Role mismatch! Expected one of: ${allowedRoles}, but got: ${userRole}`);
      return <Navigate to="/login" replace />;
    }
  }

  // If authenticated and authorized, render child routes (like dashboards)
  return <Outlet />;
};

export default ProtectedRoute;
