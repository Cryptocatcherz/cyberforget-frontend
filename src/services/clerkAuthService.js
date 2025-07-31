import { ClerkProvider, useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from '../config/endpoints';
import { environment } from '../config/environment';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
    timeout: environment.api.timeout
});

class ClerkAuthService {
    constructor() {
        this.isInitialized = false;
        this.clerkUser = null;
        this.backendUser = null;
    }

    // Initialize auth service with Clerk
    async initialize(clerkAuth) {
        try {
            this.clerkAuth = clerkAuth;
            
            if (clerkAuth.isSignedIn && clerkAuth.getToken) {
                const token = await clerkAuth.getToken();
                this.setAuthToken(token);
                
                // Fetch backend user data
                await this.syncBackendUser();
                
                if (process.env.NODE_ENV !== 'production') {
                    console.log('[ClerkAuthService] Initialized successfully');
                }
                
                this.isInitialized = true;
                return true;
            }
            
            this.isInitialized = true;
            return false;
        } catch (error) {
            console.error('[ClerkAuthService] Initialization failed:', error);
            this.isInitialized = true;
            return false;
        }
    }

    // Set authentication token for API requests
    setAuthToken(token) {
        if (token) {
            const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
            api.defaults.headers.common['Authorization'] = `Bearer ${cleanToken}`;
        } else {
            delete api.defaults.headers.common['Authorization'];
        }
    }

    // Sync user data with backend
    async syncBackendUser() {
        try {
            if (!this.clerkAuth?.isSignedIn) {
                return null;
            }

            const token = await this.clerkAuth.getToken();
            this.setAuthToken(token);

            const response = await api.get(ENDPOINTS.AUTH.ME);
            
            if (response.data.success) {
                this.backendUser = response.data.user;
                return this.backendUser;
            }
            
            return null;
        } catch (error) {
            console.error('[ClerkAuthService] Failed to sync backend user:', error);
            
            // If user doesn't exist in backend, we might need to create them
            if (error.response?.status === 404) {
                return await this.createBackendUser();
            }
            
            return null;
        }
    }

    // Create user in backend (called by Clerk webhook or on first login)
    async createBackendUser() {
        try {
            if (!this.clerkAuth?.user) {
                throw new Error('No Clerk user available');
            }

            const clerkUser = this.clerkAuth.user;
            const userData = {
                clerkId: clerkUser.id,
                email: clerkUser.primaryEmailAddress?.emailAddress,
                firstName: clerkUser.firstName,
                lastName: clerkUser.lastName,
                emailVerified: clerkUser.primaryEmailAddress?.verification?.status === 'verified'
            };

            // This would typically be handled by the Clerk webhook
            // But we can trigger it manually if needed
            console.log('[ClerkAuthService] Backend user creation should be handled by webhook');
            return null;
        } catch (error) {
            console.error('[ClerkAuthService] Failed to create backend user:', error);
            return null;
        }
    }

    // Refresh authentication
    async refreshAuth() {
        try {
            if (!this.clerkAuth?.isSignedIn) {
                return false;
            }

            const token = await this.clerkAuth.getToken({ template: 'default' });
            this.setAuthToken(token);
            
            // Refresh backend user data
            await this.syncBackendUser();
            
            return true;
        } catch (error) {
            console.error('[ClerkAuthService] Auth refresh failed:', error);
            return false;
        }
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.clerkAuth?.isSignedIn || false;
    }

    // Get current user (combines Clerk and backend data)
    getUser() {
        if (!this.clerkAuth?.user) {
            return null;
        }

        return {
            // Clerk data
            id: this.clerkAuth.user.id,
            email: this.clerkAuth.user.primaryEmailAddress?.emailAddress,
            firstName: this.clerkAuth.user.firstName,
            lastName: this.clerkAuth.user.lastName,
            imageUrl: this.clerkAuth.user.imageUrl,
            
            // Backend data (if available)
            ...(this.backendUser || {}),
            
            // Computed fields
            fullName: `${this.clerkAuth.user.firstName || ''} ${this.clerkAuth.user.lastName || ''}`.trim(),
            initials: `${this.clerkAuth.user.firstName?.[0] || ''}${this.clerkAuth.user.lastName?.[0] || ''}`.toUpperCase()
        };
    }

    // Get authentication token
    async getToken() {
        try {
            if (!this.clerkAuth?.isSignedIn) {
                return null;
            }
            return await this.clerkAuth.getToken();
        } catch (error) {
            console.error('[ClerkAuthService] Failed to get token:', error);
            return null;
        }
    }

    // Get auth headers for API requests
    async getAuthHeaders() {
        const token = await this.getToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    // Update user profile (backend)
    async updateProfile(profileData) {
        try {
            const response = await api.patch(ENDPOINTS.USERS.PROFILE, profileData);
            
            if (response.data.success) {
                this.backendUser = { ...this.backendUser, ...response.data.user };
                return response.data.user;
            }
            
            throw new Error('Failed to update profile');
        } catch (error) {
            console.error('[ClerkAuthService] Update profile failed:', error);
            throw error;
        }
    }

    // Get user statistics
    async getUserStats() {
        try {
            const response = await api.get(ENDPOINTS.USERS.STATS);
            return response.data.success ? response.data.stats : null;
        } catch (error) {
            console.error('[ClerkAuthService] Get user stats failed:', error);
            return null;
        }
    }

    // Sign out
    async signOut() {
        try {
            if (this.clerkAuth?.signOut) {
                await this.clerkAuth.signOut();
            }
            
            // Clear API headers
            this.setAuthToken(null);
            this.backendUser = null;
            
            if (process.env.NODE_ENV !== 'production') {
                console.log('[ClerkAuthService] Signed out successfully');
            }
        } catch (error) {
            console.error('[ClerkAuthService] Sign out failed:', error);
        }
    }

    // Get subscription status
    getSubscriptionStatus() {
        return this.backendUser?.subscriptionStatus || 'FREE';
    }

    // Get user role
    getUserRole() {
        return this.backendUser?.role || 'USER';
    }

    // Check if user has premium access
    hasPremiumAccess() {
        const status = this.getSubscriptionStatus();
        return ['PREMIUM', 'ENTERPRISE'].includes(status);
    }

    // Check if user is admin
    isAdmin() {
        const role = this.getUserRole();
        return ['ADMIN', 'SUPER_ADMIN'].includes(role);
    }
}

// Create singleton instance
const clerkAuthService = new ClerkAuthService();

// Request interceptor to add auth token
api.interceptors.request.use(
    async (config) => {
        // Skip auth for public endpoints
        const publicEndpoints = [
            ENDPOINTS.AUTH.SESSION_INFO,
            ENDPOINTS.WEBHOOKS.CLERK,
            ENDPOINTS.HEALTH.BASIC
        ];
        
        if (!publicEndpoints.some(endpoint => config.url?.includes(endpoint))) {
            const token = await clerkAuthService.getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        if (environment.debug.enableApiLogs) {
            console.log('[ClerkAuthService] Request:', config.method?.toUpperCase(), config.url);
        }
        
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token might be expired, try to refresh
            const refreshed = await clerkAuthService.refreshAuth();
            
            if (refreshed && error.config && !error.config._retry) {
                error.config._retry = true;
                const token = await clerkAuthService.getToken();
                if (token) {
                    error.config.headers.Authorization = `Bearer ${token}`;
                    return api.request(error.config);
                }
            } else {
                // Refresh failed, sign out
                await clerkAuthService.signOut();
            }
        }
        
        return Promise.reject(error);
    }
);

// Export the API instance and service
export { api };
export default clerkAuthService;