import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ adminOnly = false }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check if user has admin role
    // Handle both string "True"/"true" and boolean true
    const isAdmin = user.isAdmin === true || 
                   user.isAdmin === "True" || 
                   user.isAdmin === "true" ||
                   user.role === 'Admin';

    // Redirect admin users to admin panel if they try to access user routes
    if (!adminOnly && isAdmin && location.pathname === '/') {
        return <Navigate to="/home-admin" replace />;
    }

    if (adminOnly) {
        if (!isAdmin) {
            return <Navigate to="/" replace />;
        }
    }

    return <Outlet />;
};

export default PrivateRoute;
