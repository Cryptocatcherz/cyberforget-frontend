import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthNavigationHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isInitialMount = useRef(true);

    useEffect(() => {
        const handleAuthLogout = () => {
            // Skip navigation during initial mount
            if (isInitialMount.current) {
                isInitialMount.current = false;
                return;
            }

            // Get current path
            const currentPath = location.pathname;
            
            // Define public routes that don't need redirection
            const publicRoutes = ['/login', '/register', '/setup-password', '/', '/pricing'];
            
            // Only navigate if we're not already on a public route
            if (!publicRoutes.some(route => currentPath.startsWith(route))) {
                try {
                    // Store the current location as the return URL, but only if it's not a public route
                    const returnUrl = encodeURIComponent(currentPath);
                    
                    // Use replace to prevent adding to history stack
                    window.history.replaceState(
                        { returnUrl }, 
                        '', 
                        `/login?from=${returnUrl}`
                    );
                    
                    // Navigate using window.location to ensure clean state
                    window.location.href = '/login';
                } catch (error) {
                    console.error('Navigation error:', error);
                    // Ultimate fallback
                    window.location.href = '/login';
                }
            }
        };

        window.addEventListener('auth-logout', handleAuthLogout);
        return () => window.removeEventListener('auth-logout', handleAuthLogout);
    }, [navigate, location]);

    return null;
};

export default AuthNavigationHandler; 