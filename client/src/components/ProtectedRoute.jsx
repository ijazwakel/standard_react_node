// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const userName = localStorage.getItem('user_name'); // Retrieve user_name from local storage

    if (!userName) {
        // If user_name is not available, redirect to the login page
        return <Navigate to="/login" replace />;
    }

    return children; // If user_name is available, render the children
};

const AuthRoute = ({ children }) => {
    const userName = localStorage.getItem('user_name');

    if (userName) {
        // If user_name exists, redirect to the dashboard
        return <Navigate to="/" replace />;
    }

    return children; // If user_name is not available, render the children (login page)
};

export { ProtectedRoute, AuthRoute };
