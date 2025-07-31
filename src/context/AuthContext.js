// javascript:src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config/endpoints';
import clerkAuthService from '../services/clerkAuthService';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const persistLog = (message, data = {}) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        message,
        data
    };
    
    // Store in localStorage for persistence
    const logs = JSON.parse(localStorage.getItem('auth_debug_logs') || '[]');
    logs.push(logEntry);
    localStorage.setItem('auth_debug_logs', JSON.stringify(logs.slice(-50))); // Keep last 50 logs
    
    // Also log to console
    console.log(`[AuthContext] ${message}`, data);
};

export const AuthProvider = ({ children }) => {
    const clerkAuth = useClerkAuth();
    const { user: clerkUser } = useUser();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const [error, setError] = useState(null);
    const [backendSynced, setBackendSynced] = useState(false);
    const socketReconnectTimeoutRef = useRef(null);

    // Initialize auth service and sync with backend
    useEffect(() => {
        if (!clerkAuth.isLoaded) {
            persistLog('Clerk not yet loaded, waiting...');
            return;
        }

        const initializeAuth = async () => {
            try {
                setLoading(true);
                
                if (clerkAuth.isSignedIn && clerkUser) {
                    persistLog('Clerk user authenticated, syncing with backend', { userId: clerkUser.id });
                    
                    // Initialize auth service with Clerk
                    const initialized = await clerkAuthService.initialize(clerkAuth);
                    
                    if (initialized) {
                        // Get combined user data from auth service
                        const combinedUser = clerkAuthService.getUser();
                        setUser(combinedUser);
                        setBackendSynced(true);
                        setError(null);
                        persistLog('Backend sync successful', { user: combinedUser });
                    } else {
                        // Fallback to Clerk-only data
                        const fallbackUser = {
                            id: clerkUser.id,
                            email: clerkUser.primaryEmailAddress?.emailAddress || '',
                            firstName: clerkUser.firstName || '',
                            lastName: clerkUser.lastName || '',
                            fullName: clerkUser.fullName || '',
                            imageUrl: clerkUser.imageUrl,
                            role: 'USER',
                            subscriptionStatus: 'FREE'
                        };
                        setUser(fallbackUser);
                        setBackendSynced(false);
                        persistLog('Using Clerk-only data, backend sync failed');
                    }
                } else {
                    persistLog('User not authenticated');
                    setUser(null);
                    setBackendSynced(false);
                }
            } catch (error) {
                persistLog('Auth initialization error', { error: error.message });
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, [clerkAuth.isLoaded, clerkAuth.isSignedIn, clerkUser]);

    // Socket connection management
    useEffect(() => {
        if (!clerkAuth.isSignedIn || !user) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        // Initialize socket connection for authenticated users
        const initializeSocket = async () => {
            try {
                const token = await clerkAuthService.getToken();
                
                const newSocket = io(SOCKET_URL, {
                    auth: { 
                        userId: user.id,
                        token: token
                    },
                    reconnection: true,
                    reconnectionAttempts: 5,
                    reconnectionDelay: 1000,
                });

                newSocket.on('connect', () => {
                    persistLog('Socket connected', { socketId: newSocket.id });
                });

                newSocket.on('disconnect', (reason) => {
                    persistLog('Socket disconnected', { reason });
                });

                newSocket.on('auth_error', (error) => {
                    persistLog('Socket auth error', { error });
                    setError('Socket authentication failed');
                });

                setSocket(newSocket);
            } catch (error) {
                persistLog('Socket initialization failed', { error: error.message });
                setError('Failed to initialize socket connection');
            }
        };

        initializeSocket();

        return () => {
            if (socketReconnectTimeoutRef.current) {
                clearTimeout(socketReconnectTimeoutRef.current);
            }
            if (socket) {
                socket.disconnect();
            }
        };
    }, [clerkAuth.isSignedIn, user]);

    // Handle logout
    const handleLogout = useCallback(async () => {
        persistLog('Logout called');
        try {
            // Clean up socket
            if (socket) {
                socket.disconnect();
            }
            
            // Sign out from auth service
            await clerkAuthService.signOut();
            
            // Clean up state
            setSocket(null);
            setUser(null);
            setError(null);
            setBackendSynced(false);
            
            persistLog('Logout completed');
        } catch (error) {
            persistLog('Logout error', { error: error.message });
        }
    }, [socket]);

    // Refresh user data from backend
    const refreshUser = useCallback(async () => {
        if (!clerkAuth.isSignedIn) return false;
        
        try {
            const combinedUser = await clerkAuthService.syncBackendUser();
            if (combinedUser) {
                setUser(clerkAuthService.getUser());
                setBackendSynced(true);
                return true;
            }
            return false;
        } catch (error) {
            persistLog('User refresh failed', { error: error.message });
            setError(error.message);
            return false;
        }
    }, [clerkAuth.isSignedIn]);

    // Update profile
    const updateProfile = useCallback(async (profileData) => {
        try {
            const updatedUser = await clerkAuthService.updateProfile(profileData);
            if (updatedUser) {
                setUser(clerkAuthService.getUser());
                return { success: true, user: updatedUser };
            }
            return { success: false, error: 'Failed to update profile' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }, []);

    const value = {
        isAuthenticated: clerkAuth.isSignedIn || false,
        user,
        setUser,
        loading: !clerkAuth.isLoaded || loading,
        error,
        backendSynced,
        refreshUser,
        updateProfile,
        logout: handleLogout,
        isAdmin: clerkAuthService.isAdmin(),
        hasPremiumAccess: clerkAuthService.hasPremiumAccess(),
        subscriptionStatus: clerkAuthService.getSubscriptionStatus(),
        userRole: clerkAuthService.getUserRole(),
        socket,
        authService: clerkAuthService
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};


export default AuthContext;