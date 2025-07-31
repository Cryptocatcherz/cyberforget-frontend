import axios from 'axios';
import { environment, getApiUrl } from '../config/environment.js';
import clerkAuthService from './clerkAuthService.js';

const API_BASE_URL = getApiUrl('/api/v1');

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Add request interceptor for Clerk auth
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await clerkAuthService.getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.warn('[ApiService] Failed to get auth token:', error);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor for better error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Skip auth redirects in development mode
            if (process.env.NODE_ENV === 'development') {
                console.log('[Development] Skipping auth redirect for 401 error');
                return Promise.reject(error);
            }
            
            // Try to refresh auth, if that fails, sign out
            const refreshed = await clerkAuthService.refreshAuth();
            if (!refreshed) {
                await clerkAuthService.signOut();
                window.location.href = '/login'; // Changed from /sign-in to /login
            }
        }
        return Promise.reject(error);
    }
);

export default api; 