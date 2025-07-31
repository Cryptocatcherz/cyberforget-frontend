import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from '../config/endpoints';
import { environment } from '../config/environment';

if (process.env.NODE_ENV !== 'production') {
    console.log('[AuthService] Initializing with API URL:', API_BASE_URL);
    console.log('[AuthService] Environment mode:', environment.PRODUCTION_MODE ? 'PRODUCTION' : 'DEVELOPMENT');
}

// Create axios instance with base configuration
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
    timeout: environment.api.timeout
});

// Request interceptor for debugging
api.interceptors.request.use(
    (config) => {
        if (environment.debug.enableApiLogs) {
            console.log('[AuthService] Request:', config.method?.toUpperCase(), config.url);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for automatic logout on 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && !error.config?.url?.includes('/login')) {
            authService.logout();
        }
        return Promise.reject(error);
    }
);

class AuthService {
    constructor() {
        this.token = null;
        this.user = null;
        this.isInitialized = false;
    }

    // Initialize auth service with stored data
    initializeFromStorage() {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
            
            if (token && userStr) {
                this.token = token;
                this.user = JSON.parse(userStr);
                this.setAuthToken(token);
                if (process.env.NODE_ENV !== 'production') {
                    console.log('[AuthService] Initialized from storage');
                }
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('[AuthService] Error initializing from storage:', error);
            this.clearAuth();
            return false;
        }
    }

    // Set authentication token
    setAuthToken(token) {
        if (token) {
            const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
            api.defaults.headers.common['Authorization'] = `Bearer ${cleanToken}`;
            this.token = cleanToken;
        } else {
            delete api.defaults.headers.common['Authorization'];
            this.token = null;
        }
    }

    // Clear all authentication data
    clearAuth() {
        this.setAuthToken(null);
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        localStorage.removeItem('trialCancelled');
        localStorage.removeItem('shouldShowReengagement');
    }

    // Login user
    async login(email, password, remember = false) {
        try {
            if (process.env.NODE_ENV !== 'production') {
                console.log('[AuthService] Attempting login for:', email);
            }
            
            const response = await api.post(ENDPOINTS.AUTH.LOGIN, {
                email,
                password,
                remember
            });

            if (response.data.success) {
                const { token, user, trialCancelled, shouldShowReengagement } = response.data;
                
                // Set authentication
                this.setAuthToken(token);
                this.user = user;
                
                // Store in appropriate storage
                const storage = remember ? localStorage : sessionStorage;
                storage.setItem('token', token);
                storage.setItem('user', JSON.stringify(user));
                
                // Store trial information
                if (trialCancelled) {
                    localStorage.setItem('trialCancelled', 'true');
                    localStorage.setItem('shouldShowReengagement', shouldShowReengagement ? 'true' : 'false');
                } else {
                    localStorage.removeItem('trialCancelled');
                    localStorage.removeItem('shouldShowReengagement');
                }

                if (process.env.NODE_ENV !== 'production') {
                    console.log('[AuthService] Login successful');
                }
                return {
                    success: true,
                    user,
                    token,
                    trialCancelled,
                    shouldShowReengagement
                };
            }

            return {
                success: false,
                error: response.data.error || 'Login failed'
            };

        } catch (error) {
            console.error('[AuthService] Login error:', error.response?.data || error.message);
            this.clearAuth();
            
            return {
                success: false,
                error: error.response?.data?.error || 'Login failed. Please check your credentials.'
            };
        }
    }

    // Logout user
    logout() {
        if (process.env.NODE_ENV !== 'production') {
            console.log('[AuthService] Logging out');
        }
        this.clearAuth();
        window.dispatchEvent(new Event('auth-logout'));
    }

    // Check if user is authenticated
    async checkAuth() {
        try {
            if (!this.token) {
                return false;
            }

            const response = await api.get(ENDPOINTS.AUTH.ME, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            if (response.data && response.data.success && response.data.user) {
                // Update stored user data
                this.user = response.data.user;
                const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
                storage.setItem('user', JSON.stringify(response.data.user));
                return true;
            }

            return false;
        } catch (error) {
            console.error('[AuthService] Auth check failed:', error.response?.status);
            
            if (error.response?.status === 401) {
                this.logout();
            }
            
            return false;
        }
    }

    // Get user details
    async getUserDetails() {
        try {
            const response = await api.get(ENDPOINTS.AUTH.ME, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            return response.data.success ? response.data.user : response.data;
        } catch (error) {
            console.error('[AuthService] Get user details failed:', error);
            throw error;
        }
    }

    // Alias for getUserDetails to maintain compatibility
    async getUserProfile() {
        return this.getUserDetails();
    }

    // Get user by setup token (for setup flow)
    async getUserBySetupToken(setupToken) {
        try {
            // If there's no specific setup token endpoint, try to use current user data
            // This might need to be implemented on the backend
            console.warn('[AuthService] Setup token flow not fully implemented, using current user data');
            return this.getUserDetails();
        } catch (error) {
            console.error('[AuthService] Get user by setup token failed:', error);
            throw error;
        }
    }

    // Update user profile
    async updateProfile(profileData) {
        try {
            const response = await api.put('/api/users/profile', profileData);
            
            if (response.data.success) {
                this.user = { ...this.user, ...response.data.user };
                const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
                storage.setItem('user', JSON.stringify(this.user));
                return { success: true, user: response.data.user, message: response.data.message };
            }
            
            throw new Error('Failed to update profile');
        } catch (error) {
            console.error('[AuthService] Update profile failed:', error);
            return { success: false, error: error.response?.data?.error || error.message };
        }
    }

    // Submit user data (for setup flow or profile creation)
    async submitUserData(userData) {
        try {
            // Use the same endpoint as updateProfile for consistency
            const response = await api.put('/api/users/profile', userData);
            
            if (response.data.success) {
                this.user = { ...this.user, ...response.data.user };
                const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
                storage.setItem('user', JSON.stringify(this.user));
                return { success: true, user: response.data.user, message: response.data.message };
            }
            
            throw new Error('Failed to submit user data');
        } catch (error) {
            console.error('[AuthService] Submit user data failed:', error);
            return { success: false, error: error.response?.data?.error || error.message };
        }
    }

    // Password reset request
    async requestPasswordReset(email) {
        try {
            const response = await api.post('/api/reset-password/request', { email });
            return response.data;
        } catch (error) {
            console.error('[AuthService] Password reset request failed:', error);
            throw error;
        }
    }

    // Reset password with token
    async resetPassword(token, password) {
        try {
            const response = await api.post(`/api/reset-password/reset/${token}`, { password });
            return response.data;
        } catch (error) {
            console.error('[AuthService] Password reset failed:', error);
            throw error;
        }
    }

    // Get trial cancellation status
    getTrialStatus() {
        return {
            trialCancelled: localStorage.getItem('trialCancelled') === 'true',
            shouldShowReengagement: localStorage.getItem('shouldShowReengagement') === 'true'
        };
    }

    // Utility methods
    getUser() {
        if (this.user) return this.user;
        
        const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (userStr) {
            try {
                this.user = JSON.parse(userStr);
                return this.user;
            } catch (e) {
                console.error('[AuthService] Error parsing user data:', e);
                this.clearAuth();
            }
        }
        
        return null;
    }

    getToken() {
        if (!this.token) {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (token) {
                this.setAuthToken(token);
            }
        }
        return this.token;
    }

    isAuthenticated() {
        return !!this.getToken();
    }

    getAuthHeaders() {
        const token = this.getToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }
}

// Create singleton instance
const authService = new AuthService();

// Export functions and instance
export const getToken = () => authService.getToken();
export { api };
export default authService;