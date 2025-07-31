import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from "../hooks/useAuthUtils";
import LoadingSpinner from './LoadingSpinner';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
        // Store the attempted URL for redirect after login
        const returnUrl = encodeURIComponent(location.pathname + location.search);
        return <Navigate to={`/login?returnUrl=${returnUrl}`} replace />;
    }

    return children;
};

export default PrivateRoute;
