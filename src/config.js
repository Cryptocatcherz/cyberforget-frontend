// Import unified environment configuration
import { environment } from './config/environment.js';

// API Configuration from unified environment system
export const API_BASE_URL = environment.api.baseUrl;

// Socket.IO configuration
export const SOCKET_CONFIG = {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 10000
};

// Other configuration constants
export const DEFAULT_PAGINATION = {
    limit: 10,
    page: 1
};

export const REFRESH_INTERVALS = {
    stats: 60000, // 1 minute in production
    userList: 60000, // 1 minute in production
    scanStatus: 10000 // 10 seconds in production
}; 