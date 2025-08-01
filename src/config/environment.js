// Unified Environment Configuration System
// Single source of truth for production/development mode switching

// Environment detection - more reliable detection for production
const isProduction = process.env.REACT_APP_PRODUCTION_MODE === 'true' || 
                     process.env.NODE_ENV === 'production' ||
                     window.location.hostname === 'cyberforget.com' ||
                     window.location.hostname === 'www.cyberforget.com' ||
                     window.location.hostname.includes('netlify.app');
const isDevelopment = !isProduction;

// Deployment platform detection
const isNetlify = process.env.NETLIFY === 'true' || window.location.hostname.includes('netlify.app');
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// API URL configuration - Updated for cyberforget.com domain
const getBaseApiUrl = () => {
  // Production: cyberforget.com frontend -> Heroku backend
  if (isProduction) {
    return process.env.REACT_APP_HEROKU_API_URL || process.env.REACT_APP_API_BASE_URL || 'https://cyberforget-api-961214fcb16c.herokuapp.com';
  }
  
  // Development: Local frontend -> Local backend (CyberForget backend)
  return process.env.REACT_APP_API_BASE_URL || 'http://localhost:5002';
};

// VPN API URL configuration
const getVPNApiUrl = () => {
  // Production VPN API
  if (isProduction) {
    return process.env.REACT_APP_VPN_API_URL || 'https://vpn.cyberforget.com/api/v1';
  }
  
  // Development VPN API (can be same as main API for now)
  return process.env.REACT_APP_VPN_API_URL || 'http://localhost:3001/api/v1';
};

// WebSocket URL configuration
const buildSocketUrl = () => {
  const apiUrl = getBaseApiUrl();
  return apiUrl.replace('http://', 'ws://').replace('https://', 'wss://');
};

// Main environment configuration
export const environment = {
  // Google API
  googleApiKey: 'AIzaSyBSA7Mcs-gxNRIUmt7z0w2WQf3D6tGDlwI',
  
  // Mode detection
  PRODUCTION_MODE: isProduction,
  DEVELOPMENT_MODE: isDevelopment,
  
  // Platform detection
  IS_NETLIFY: isNetlify,
  IS_LOCALHOST: isLocalhost,
  
  // Debug features (disabled for production-like experience)
  debug: {
    enabled: false,
    logLevel: process.env.REACT_APP_LOG_LEVEL || 'error',
    showUserProfile: false,
    showHourlyScansTest: false,
    showFeatureToggles: false,
    enableApiLogs: false
  },
  
  // Feature toggles
  features: {
    analytics: isProduction && process.env.REACT_APP_ANALYTICS !== 'false',
    errorReporting: isProduction && process.env.REACT_APP_ERROR_REPORTING !== 'false',
    autoScroll: process.env.REACT_APP_ENABLE_AUTO_SCROLL !== 'false',
    autoScan: process.env.REACT_APP_AUTO_SCAN_ENABLED !== 'false',
    autoSiteScanning: process.env.REACT_APP_AUTO_SCAN_ENABLED !== 'false', // For Dashboard compatibility
    performanceMonitoring: isProduction
  },
  
  // API configuration
  api: {
    baseUrl: getBaseApiUrl(),
    vpnUrl: getVPNApiUrl(),
    socketUrl: buildSocketUrl(),
    timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || (isProduction ? 30000 : 10000),
    retries: parseInt(process.env.REACT_APP_API_RETRIES) || (isProduction ? 3 : 1)
  },
  
  // Auto-scan configuration
  autoScan: {
    enabled: process.env.REACT_APP_AUTO_SCAN_ENABLED !== 'false',
    interval: parseInt(process.env.REACT_APP_AUTO_SCAN_INTERVAL) || (isProduction ? 3600000 : 360000), // 1 hour prod, 6 min dev
    maxConcurrentScans: parseInt(process.env.REACT_APP_MAX_CONCURRENT_SCANS) || 3
  },
  
  // Performance settings
  performance: {
    enableAnalytics: isProduction,
    enableErrorReporting: isProduction,
    cacheTimeout: isProduction ? 300000 : 60000 // 5 min prod, 1 min dev
  },
  
  // Legacy compatibility
  apiUrl: getBaseApiUrl(),
  isDevelopment,
  isProduction,
  endpoints: {
    sites: '/api/sites',
    scan: '/api/scan',
    hourlyScans: '/api/hourly-scans'
  }
};

// Helper functions
export const getApiUrl = (endpoint = '') => {
  const url = `${environment.api.baseUrl}${endpoint}`;
  if (environment.debug.enableApiLogs && process.env.NODE_ENV !== 'production') {
    console.log(`[API] ${endpoint} -> ${url}`);
  }
  return url;
};

export const getSocketUrl = () => {
  return environment.api.socketUrl;
};

export const isProductionMode = () => environment.PRODUCTION_MODE;
export const isDevelopmentMode = () => environment.DEVELOPMENT_MODE;

export const shouldShowComponent = (component) => {
  switch (component) {
    case 'userProfile':
    case 'debugProfile':
      return environment.debug.showUserProfile;
    case 'hourlyScansTest':
      return environment.debug.showHourlyScansTest;
    case 'featureToggles':
      return environment.debug.showFeatureToggles;
    default:
      return true;
  }
};

export const shouldShowDebugComponents = () => environment.debug.enabled;

// Legacy compatibility functions
export const getGoogleMapsConfig = () => ({
  key: environment.googleApiKey,
  libraries: ['places', 'geometry'],
  version: 'weekly'
});

export const devLog = (...args) => {
  if (environment.debug.enabled) {
    console.log('[DEV]', ...args);
  }
};

export const prodLog = (...args) => {
  // Remove production logging for security
  if (isProductionMode() && process.env.NODE_ENV !== 'production') {
    console.log('[PROD]', ...args);
  }
};

// Mode switching helpers for testing
export const logCurrentMode = () => {
  if (process.env.NODE_ENV !== 'production') {
    const mode = isProductionMode() ? 'PRODUCTION' : 'DEVELOPMENT';
    const platform = environment.IS_NETLIFY ? 'Netlify' : 'Local';
    
    console.log(`🌍 Environment: ${mode} (${platform})`);
    console.log(`🔗 API URL: ${environment.api.baseUrl}`);
    console.log(`🔌 Socket URL: ${environment.api.socketUrl}`);
    console.log(`🎛️ Debug Features:`, environment.debug);
    console.log(`⚡ Features:`, environment.features);
  }
};

// Auto-log environment on load (only in development)
if (environment.debug.enabled) {
  logCurrentMode();
}

export default environment;