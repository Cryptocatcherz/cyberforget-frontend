import React, { createContext, useContext, useState } from 'react';

const MockAuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(MockAuthContext);
    if (!context) {
        throw new Error('useAuth must be used within a MockAuthProvider');
    }
    return context;
};

export const MockAuthProvider = ({ children }) => {
    const [user, setUser] = useState({
        email: "dev@example.com",
        firstName: "Dev",
        lastName: "User",
        memberSince: new Date().toISOString(),
        subscriptionStatus: 'Trial'
    });

    const [isAuthenticated, setIsAuthenticated] = useState(true);

    const getToken = async () => {
        return "mock-jwt-token-for-development";
    };

    const logout = async () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        window.location.href = 'https://cleandata.me';
    };

    const value = {
        user,
        getToken,
        isAuthenticated,
        logout,
    };

    return (
        <MockAuthContext.Provider value={value}>
            {children}
        </MockAuthContext.Provider>
    );
};
