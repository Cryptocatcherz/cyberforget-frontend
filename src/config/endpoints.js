// Import unified environment configuration
import { environment } from './environment.js';

// API Base URLs from unified environment system
export const API_BASE_URL = environment.api.baseUrl;
export const SOCKET_URL = environment.api.socketUrl;

// Log configuration (only in development)
if (environment.debug.enableApiLogs && process.env.NODE_ENV !== 'production') {
  console.log('[endpoints.js] API_BASE_URL:', API_BASE_URL, 'SOCKET_URL:', SOCKET_URL, 'MODE:', environment.PRODUCTION_MODE ? 'PRODUCTION' : 'DEVELOPMENT');
}

// API Endpoints - Updated to match backend versioned implementation
export const ENDPOINTS = {
    AUTH: {
        ME: '/api/v1/auth/me',
        REFRESH: '/api/v1/auth/refresh',
        VALIDATE: '/api/v1/auth/validate',
        SESSION_INFO: '/api/v1/auth/session-info'
    },
    USERS: {
        PROFILE: '/api/v1/users/profile',
        STATS: '/api/v1/users/stats',
        EXPORT: '/api/v1/users/export',
        DELETE: '/api/v1/users/account'
    },
    DASHBOARD: {
        STATS: '/api/v1/dashboard/stats',
        THREATS: '/api/v1/dashboard/threats',
        SCAN_HISTORY: '/api/v1/dashboard/scan-history',
        REMOVAL_REQUESTS: '/api/v1/dashboard/removal-requests',
        TRIGGER_SCAN: '/api/v1/dashboard/trigger-scan'
    },
    SCANS: {
        CREATE: '/api/v1/scans',
        LIST: '/api/v1/scans',
        GET: '/api/v1/scans',
        CANCEL: '/api/v1/scans',
        RETRY: '/api/v1/scans',
        UPDATE_RESULT: '/api/v1/scans',
        TEST: '/api/v1/scans/test'
    },
    PAYMENTS: {
        PLANS: '/api/v1/payments/plans',
        CHECKOUT: '/api/v1/payments/checkout',
        ONE_TIME: '/api/v1/payments/one-time',
        PORTAL: '/api/v1/payments/portal',
        SUBSCRIPTION: '/api/v1/payments/subscription',
        MANAGE: '/api/v1/payments/subscription/manage',
        UPDATE_PLAN: '/api/v1/payments/subscription/update-plan',
        PAYMENT_METHODS: '/api/v1/payments/payment-methods',
        INVOICES: '/api/v1/payments/invoices',
        WEBHOOK: '/api/v1/payments/webhook'
    },
    ADMIN: {
        OVERVIEW: '/api/v1/admin/overview',
        QUEUES: '/api/v1/admin/queues',
        WEBSOCKETS: '/api/v1/admin/websockets',
        NOTIFICATIONS: '/api/v1/admin/notifications',
        LOGS: '/api/v1/admin/logs',
        AUDIT: '/api/v1/admin/audit',
        MAINTENANCE: '/api/v1/admin/maintenance'
    },
    FEATURE_TOGGLES: {
        CHECK: '/api/v1/feature-toggles',
        GET_ALL: '/api/v1/feature-toggles',
        ADMIN_GET: '/api/v1/feature-toggles/admin',
        ADMIN_CREATE: '/api/v1/feature-toggles/admin',
        ADMIN_UPDATE: '/api/v1/feature-toggles/admin',
        ADMIN_DELETE: '/api/v1/feature-toggles/admin',
        CLEAR_CACHE: '/api/v1/feature-toggles/admin/cache/clear',
        RELOAD: '/api/v1/feature-toggles/admin/reload'
    },
    HIBP: {
        EMAIL: '/api/v1/hibp/email',
        PASSWORD: '/api/v1/hibp/password',
        BREACHES: '/api/v1/hibp/breaches',
        BREACH: '/api/v1/hibp/breach'
    },
    CHAT: {
        EMAIL_SCAN: '/api/v1/chat/email-scan',
        LOCATION: '/api/v1/chat/location',
        HEALTH: '/api/v1/chat/health',
        SECURITY_TIPS: '/api/v1/chat/security-tips'
    },
    WEBHOOKS: {
        CLERK: '/api/v1/webhooks/clerk',
        LIST: '/api/v1/webhooks',
        CREATE: '/api/v1/webhooks',
        TEST: '/api/v1/webhooks',
        UPDATE: '/api/v1/webhooks',
        DELETE: '/api/v1/webhooks'
    },
    HEALTH: {
        BASIC: '/api/v1/health',
        DETAILED: '/api/v1/health/detailed',
        READY: '/api/v1/health/ready',
        LIVE: '/api/v1/health/live',
        METRICS: '/api/v1/health/metrics'
    }
};

// Helper function to get full API URL - use the one from environment.js
export { getApiUrl } from './environment.js'; 