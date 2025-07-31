/**
 * Simple auth utility hooks using Clerk directly
 */

import { useAuth, useUser, useClerk } from '@clerk/clerk-react';

export const useAuthUtils = () => {
    const { isLoaded, isSignedIn, userId } = useAuth();
    const { user } = useUser();
    const { signOut } = useClerk();

    const mappedUser = user ? {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        fullName: user.fullName || '',
        imageUrl: user.imageUrl,
        role: user.publicMetadata?.role || 'user',
        memberSince: user.createdAt,
        subscriptionStatus: user.publicMetadata?.subscriptionStatus || 'free'
    } : null;

    return {
        isAuthenticated: isSignedIn,
        loading: !isLoaded,
        user: mappedUser,
        setUser: () => {}, // Mock for compatibility - Clerk manages user state
        isAdmin: mappedUser?.role === 'admin',
        logout: signOut,
        login: () => Promise.resolve({ success: false, error: 'Use Clerk SignIn component' }),
        // Mock socket for compatibility (you can implement real socket later)
        socket: null
    };
};

// Backward compatibility export
export { useAuthUtils as useAuth };