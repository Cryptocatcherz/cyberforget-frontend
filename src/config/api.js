import { getApiUrl, getSocketUrl } from './environment';

// Base URLs for different services
export const API_BASE_URL = getApiUrl();
export const SOCKET_URL = getSocketUrl();

// API Endpoints Configuration (for private-chat compatibility)
export const API_ENDPOINTS = {
    // Gemini API
    GEMINI: getApiUrl('/api/v1/chat'),
    
    // HIBP Endpoints
    HIBP: {
        EMAIL: getApiUrl('/api/v1/hibp/email'),
        PASSWORD: getApiUrl('/api/v1/hibp/password')
    },
    
    // Chat Tools
    CHAT: {
        EMAIL_SCAN: getApiUrl('/api/v1/chat/email-scan'),
        LOCATION: getApiUrl('/api/v1/chat/location')
    },
    
    // Dashboard
    DASHBOARD: {
        STATS: getApiUrl('/api/v1/dashboard/stats'),
        THREATS: getApiUrl('/api/v1/dashboard/threats'),
        TRIGGER_SCAN: getApiUrl('/api/v1/dashboard/trigger-scan')
    },
    
    // Payments & Stripe
    PAYMENTS: {
        PLANS: getApiUrl('/api/v1/payments/plans'),
        CHECKOUT: getApiUrl('/api/v1/payments/checkout'),
        ONE_TIME: getApiUrl('/api/v1/payments/one-time'),
        PORTAL: getApiUrl('/api/v1/payments/portal'),
        SUBSCRIPTION: getApiUrl('/api/v1/payments/subscription'),
        MANAGE_SUBSCRIPTION: getApiUrl('/api/v1/payments/subscription/manage'),
        UPDATE_PLAN: getApiUrl('/api/v1/payments/subscription/update-plan'),
        PAYMENT_METHODS: getApiUrl('/api/v1/payments/payment-methods'),
        INVOICES: getApiUrl('/api/v1/payments/invoices'),
        WEBHOOK: getApiUrl('/api/v1/payments/webhook')
    },
    
    // Authentication
    AUTH: {
        ME: getApiUrl('/api/v1/users/me'),
        PROFILE: getApiUrl('/api/v1/users/profile')
    },
    
    // Scanning
    SCANS: {
        LIST: getApiUrl('/api/v1/scans'),
        CREATE: getApiUrl('/api/v1/scans'),
        STATUS: (scanId) => getApiUrl(`/api/v1/scans/${scanId}`),
        RESULTS: (scanId) => getApiUrl(`/api/v1/scans/${scanId}/results`)
    },
    
    // Feature Toggles
    FEATURES: {
        LIST: getApiUrl('/api/v1/feature-toggles'),
        UPDATE: (featureId) => getApiUrl(`/api/v1/feature-toggles/${featureId}`)
    },
    
    // Health Check
    HEALTH: getApiUrl('/api/v1/health'),
    
    // Legacy compatibility
    EMAIL_SCAN: getApiUrl('/api/v1/chat/email-scan'),
    PASSWORD_CHECK: getApiUrl('/api/v1/hibp/password')
};

// API Endpoints (Legacy structure)
export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/v1/auth/login',
        ME: '/api/v1/users/me',
        DETAILS: '/api/v1/users/details',
        PROFILE: '/api/v1/users/profile'
    },
    DASHBOARD: {
        STATS: '/api/v1/dashboard/stats',
        DATA: '/api/v1/dashboard/data',
        THREATS: '/api/v1/dashboard/threats'
    },
    SCAN: {
        STATS: '/api/v1/scans/stats',
        START: '/api/v1/scans',
        STOP: (scanId) => `/api/v1/scans/${scanId}/stop`,
        STATUS: (scanId) => `/api/v1/scans/${scanId}`,
        LIST: '/api/v1/scans'
    },
    FEATURES: {
        LIST: '/api/v1/feature-toggles',
        UPDATE: (featureId) => `/api/v1/feature-toggles/${featureId}`
    },
    PAYMENTS: {
        PLANS: '/api/v1/payments/plans',
        CHECKOUT: '/api/v1/payments/checkout',
        PORTAL: '/api/v1/payments/portal',
        SUBSCRIPTION: '/api/v1/payments/subscription'
    }
};

// Default headers
export const DEFAULT_HEADERS = {
    'Content-Type': 'application/json'
};

// Auth header formatter
export const getAuthHeader = (token) => {
    if (!token) return {};
    const cleanToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    return {
        'Authorization': cleanToken
    };
};

// Storage keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'authToken',
    REFRESH_TOKEN: 'refreshToken',
    USER_DATA: 'user'
};

const apiConfig = {
    API_BASE_URL,
    SOCKET_URL,
    ENDPOINTS,
    DEFAULT_HEADERS,
    getAuthHeader,
    STORAGE_KEYS
};

export default apiConfig; 