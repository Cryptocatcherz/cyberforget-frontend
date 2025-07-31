# CyberForget Frontend

A React-based identity protection and privacy management platform that provides comprehensive security features including AI-powered assistance, automated scanning, breach detection, and data removal services. The frontend integrates with the CyberForget backend API to deliver a seamless user experience for protecting personal information online.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+ or yarn
- Backend API server running (see cyberforget-backend)

### Installation
```bash
git clone <repository>
cd frontendv2
npm install --legacy-peer-deps  # Required due to React 18 peer dependency conflicts
cp .env.example .env
# Configure your .env file (see Environment Variables section)
npm run dev
```

### Available Scripts
```bash
npm run dev          # Start development server (port 3000)
npm run build        # Build for production
npm run build:prod   # Build with production environment
npm run mode:dev     # Switch to development mode
npm run mode:prod    # Switch to production mode
npm run mode:check   # Check current environment mode
npm test             # Run tests
npm run analyze      # Analyze bundle size
```

## 🏗️ Architecture

### Core Technologies
- **React 18.2** - Frontend framework
- **React Router v6** - Client-side routing
- **Clerk** - Authentication and user management
- **Axios** - HTTP client for API communication
- **Socket.io Client** - Real-time communication for scanning progress
- **Material-UI** - Component library and styling
- **Emotion/Styled Components** - CSS-in-JS styling solutions
- **Google Generative AI** - AI-powered chat assistance
- **Stripe** - Payment processing
- **Supabase** - Database and real-time subscriptions
- **React Helmet** - SEO and meta tag management
- **Framer Motion** - Animation library

### Key Features
- ✅ **AI-Powered Security Assistant** - Gemini AI chat interface as primary user interaction
- ✅ **Unified Environment System** - One-command production/development switching
- ✅ **Real-time Scanning** - WebSocket-based progress updates with live visualization
- ✅ **Automated Hourly Scans** - Background scanning with configurable intervals
- ✅ **HIBP Integration** - Email and password breach checking
- ✅ **Data Broker Removal** - Track and manage data removal from 200+ sites
- ✅ **Document Scanning** - Analyze files for sensitive information
- ✅ **Delete Account Assistant** - Help users delete accounts across platforms
- ✅ **Doorstep Protection** - Physical address privacy protection
- ✅ **Subscription Management** - Trial tracking, plan changes, and reactivation
- ✅ **Secure Authentication** - Clerk-based auth with JWT tokens
- ✅ **Payment Integration** - Stripe checkout and subscription handling
- ✅ **Admin Dashboard** - User management and threat monitoring
- ✅ **Responsive Design** - Mobile-first with dedicated mobile components
- ✅ **SEO Optimized** - Area code pages and location-based content
- ✅ **Performance Monitoring** - Built-in analytics and error tracking

## 🌍 Environment Configuration

### Unified Environment System

The frontend uses a unified environment configuration system that automatically switches between production and development modes:

**File:** `/src/config/environment.js`

### Environment Detection
```javascript
// Automatic mode detection
const isProduction = process.env.REACT_APP_PRODUCTION_MODE === 'true' || 
                     process.env.NODE_ENV === 'production' ||
                     window.location.hostname === 'app.cyberforget.com' ||
                     window.location.hostname.includes('netlify.app');

const isNetlify = process.env.NETLIFY === 'true' || window.location.hostname.includes('netlify.app');

// API URL configuration
const getBaseApiUrl = () => {
  // Production: Netlify frontend -> Heroku backend
  if (isProduction) {
    return process.env.REACT_APP_HEROKU_API_URL || 'https://cyberforget-api-961214fcb16c.herokuapp.com';
  }
  
  // Development: Local frontend -> Local backend
  return process.env.REACT_APP_API_BASE_URL || 'http://localhost:5002';
};
```

### Environment Variables

#### Production (.env.production)
```env
# Production mode flag
REACT_APP_PRODUCTION_MODE=true

# Heroku backend URL
REACT_APP_HEROKU_API_URL=https://cleandata-test-app-961214fcb16c.herokuapp.com

# Feature toggles
REACT_APP_ANALYTICS=true
REACT_APP_ERROR_REPORTING=true
REACT_APP_AUTO_SCAN_ENABLED=true
```

#### Development (.env.development)
```env
# Development mode flag
REACT_APP_PRODUCTION_MODE=false

# Local backend URL
REACT_APP_API_BASE_URL=http://localhost:5002

# Debug features
REACT_APP_DEBUG=true
REACT_APP_LOG_LEVEL=debug
REACT_APP_LOG_API_CALLS=true
REACT_APP_SHOW_DEBUG_PROFILE=true
```

## 📡 API Integration

### Backend Communication

**Base URLs:**
- **Production:** `https://cleandata-test-app-961214fcb16c.herokuapp.com`
- **Development:** `http://localhost:5002`

### API Endpoints Configuration

**File:** `/src/config/endpoints.js`

```javascript
export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/users/login',
        DETAILS: '/api/users/details',
        PROFILE: '/api/users/profile'
    },
    PAYMENT: {
        CREATE_CHECKOUT: '/api/payment/create-checkout-session',
        VERIFY: '/api/payment/verify',
        SESSION: '/api/payment/session',
        SETUP_PASSWORD: '/api/payment/setup-password'
    },
    SUBSCRIPTION: {
        STATUS: '/api/subscription/status',
        REACTIVATE: '/api/subscription/reactivate',
        SEND_REENGAGEMENT: '/api/subscription/send-reengagement',
        SEND_TRIAL_WARNING: '/api/subscription/send-trial-warning'
    },
    HIBP: {
        EMAIL_SCAN: '/api/hibp/email-scan',
        PASSWORD_CHECK: '/api/hibp/password-check',
        BREACH_DETAILS: '/api/hibp/breach',
        ALL_BREACHES: '/api/hibp/breaches'
    },
    CHAT: {
        BASE: '/api/chat',
        MESSAGE: '/api/chat/message'
    }
};
```

## 🔐 Authentication System

### Authentication Service

**File:** `/src/services/authService.js`

```javascript
class AuthService {
    async login(email, password, remember = false) {
        const response = await api.post(ENDPOINTS.AUTH.LOGIN, {
            email, password, remember
        });
        
        if (response.data.success) {
            const { token, user, trialCancelled, shouldShowReengagement } = response.data;
            this.setAuthToken(token);
            this.user = user;
            
            // Store trial information for UI
            if (trialCancelled) {
                localStorage.setItem('trialCancelled', 'true');
                localStorage.setItem('shouldShowReengagement', shouldShowReengagement ? 'true' : 'false');
            }
        }
        
        return response.data;
    }
}
```

### Trial Cancellation Detection
The frontend automatically detects cancelled trials during login and can show re-engagement UI:

```javascript
// Check trial status
const trialCancelled = localStorage.getItem('trialCancelled') === 'true';
const shouldShowReengagement = localStorage.getItem('shouldShowReengagement') === 'true';

if (trialCancelled && shouldShowReengagement) {
    // Show re-engagement modal or banner
}
```

## 💳 Payment Integration

### Payment Service

**File:** `/src/services/paymentService.js`

```javascript
class PaymentService {
    async createCheckoutSession(email, firstName, lastName) {
        const response = await api.post(ENDPOINTS.PAYMENT.CREATE_CHECKOUT, {
            email, firstName, lastName
        });
        return response.data;
    }

    async verifyPayment(sessionId) {
        const response = await api.post(ENDPOINTS.PAYMENT.VERIFY, { sessionId });
        return response.data;
    }

    async setupPassword(setupToken, password, confirmPassword) {
        const response = await api.post(ENDPOINTS.PAYMENT.SETUP_PASSWORD, {
            setupToken, password, confirmPassword
        });
        return response.data;
    }
}
```

## 🔍 HIBP Integration

### HIBP Service Integration

The frontend integrates with the backend's HIBP service for breach checking:

```javascript
import { getApiUrl } from '../config/environment';
import { ENDPOINTS } from '../config/endpoints';

// Check email for breaches
const checkEmailBreaches = async (email) => {
    const response = await axios.post(getApiUrl(ENDPOINTS.HIBP.EMAIL_SCAN), {
        email
    });
    return response.data;
};

// Check password breach status
const checkPasswordBreach = async (password) => {
    const response = await axios.post(getApiUrl(ENDPOINTS.HIBP.PASSWORD_CHECK), {
        password
    });
    return response.data;
};
```

### HIBP Response Handling
```javascript
// Handle breach check results
if (result.success) {
    if (result.status === 'compromised') {
        // Show breach warning with details
        showBreachAlert({
            count: result.count,
            riskLevel: result.riskLevel,
            breaches: result.breaches
        });
    } else {
        // Show clean status
        showCleanStatus();
    }
}
```

## 🤖 AI Chat Integration

### Chat Service

```javascript
import { getApiUrl } from '../config/environment';
import { ENDPOINTS } from '../config/endpoints';

const sendChatMessage = async (message) => {
    const response = await axios.post(getApiUrl(ENDPOINTS.CHAT.MESSAGE), {
        message
    });
    return response.data;
};

// Advanced chat with conversation context
const sendChatConversation = async (contents) => {
    const response = await axios.post(getApiUrl(ENDPOINTS.CHAT.BASE), {
        contents
    });
    return response.data;
};
```

### Chat UI Integration
```javascript
// Example chat component integration
const ChatComponent = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const handleSendMessage = async () => {
        try {
            const response = await sendChatMessage(input);
            setMessages(prev => [...prev, 
                { role: 'user', content: input },
                { role: 'assistant', content: response.candidates[0].content.parts[0].text }
            ]);
            setInput('');
        } catch (error) {
            console.error('Chat error:', error);
        }
    };
};
```

## 📊 Subscription Management

### Subscription Service

**File:** `/src/services/subscriptionService.js`

```javascript
class SubscriptionService {
    async getSubscriptionStatus(userId) {
        const response = await api.get(`${ENDPOINTS.SUBSCRIPTION.STATUS}/${userId}`);
        return response.data;
    }

    async reactivateSubscription() {
        const response = await api.post(ENDPOINTS.SUBSCRIPTION.REACTIVATE);
        return response.data;
    }

    async sendReengagementEmail(userId) {
        const response = await api.post(ENDPOINTS.SUBSCRIPTION.SEND_REENGAGEMENT, { userId });
        return response.data;
    }
}
```

## 🔄 Real-time Communication

### WebSocket Integration

```javascript
import { getSocketUrl } from '../config/environment';
import io from 'socket.io-client';

// Initialize socket connection
const socket = io(getSocketUrl(), {
    auth: {
        token: authService.getToken()
    }
});

// Listen for scan progress
socket.on('scan_progress', (data) => {
    updateScanProgress(data.progress);
});

// Listen for scan completion
socket.on('scan_complete', (data) => {
    handleScanComplete(data.results);
});
```

## 🎨 Component Structure

### Main Components

```
src/
├── components/
│   ├── auth/
│   │   ├── AuthNavigationHandler.js
│   │   ├── LoginForm.js
│   │   ├── Login.js
│   │   ├── Signup.js
│   │   └── PrivateRoute.js
│   ├── dashboard/
│   │   ├── DashboardComponent.js
│   │   ├── DashboardHeader.js
│   │   ├── DashboardStats.js
│   │   ├── RemovalDashboard.js
│   │   ├── DataBrokerList.js
│   │   ├── DataPointsComponent.js
│   │   └── StatusBarComponent.js
│   ├── chat/
│   │   ├── ChatHeader.js
│   │   ├── ChatInput.js
│   │   ├── ChatMessages.js
│   │   ├── EnhancedWelcomeMessage.js
│   │   ├── SmartStarters.js
│   │   ├── SecurityTools.js
│   │   ├── ThinkingIndicator.js
│   │   └── QuickToolsSidebar.js
│   ├── admin/
│   │   ├── UserManagement.js
│   │   ├── ThreatManagement.js
│   │   ├── AutomatedScans.js
│   │   ├── BulkSimulationControl.js
│   │   └── Settings.js
│   ├── scanning/
│   │   ├── HourlyScansComponent.js
│   │   ├── ScanningOverlay.js
│   │   ├── SimulatedScan.js
│   │   └── EmailScanPage.js
│   ├── features/
│   │   ├── DataBrokerListComponent.js
│   │   ├── DeleteAccountList.js
│   │   ├── FeatureToggles.js
│   │   └── EnhancedReportViewer.js
│   └── common/
│       ├── Navbar.js
│       ├── MobileNavbar.js
│       ├── Sidebar.js
│       ├── Footer.js
│       ├── LoadingSpinner.js
│       ├── GalaxyButton.js
│       ├── ToggleSwitch.js
│       └── CollapsibleSection.jsx
├── pages/
│   ├── auth/
│   │   ├── LoginPage.js
│   │   ├── SignupPage.js
│   │   └── SetupPasswordPage.js
│   ├── dashboard/
│   │   ├── Dashboard.js
│   │   ├── Dashboard2.js
│   │   └── AdminDashboard.js
│   ├── features/
│   │   ├── ChatPage.js (Main Landing)
│   │   ├── DataLeakPage.js
│   │   ├── PasswordCheckPage.js
│   │   ├── FileScanPage.js
│   │   ├── DeleteAccountPage.js
│   │   └── DoorStepProtectionPage.js
│   ├── user/
│   │   ├── EditInfoPage.js
│   │   ├── ChangePlanPage.js
│   │   └── DataRemovalsPage.js
│   ├── process/
│   │   ├── ScanningPage.js
│   │   ├── ResultsPage.js
│   │   └── SuccessPage.js
│   └── static/
│       ├── PricingPage.js
│       ├── ContactPage.js
│       ├── SupportPage.js
│       ├── TOSPage.js
│       └── PrivacyPolicyPage.js
├── services/
│   ├── core/
│   │   ├── authService.js
│   │   ├── apiService.js
│   │   └── supabaseService.js
│   ├── features/
│   │   ├── scanService.js
│   │   ├── autoScanService.js
│   │   ├── breachService.js
│   │   ├── dashboardService.js
│   │   └── featureToggleService.js
│   ├── payment/
│   │   ├── paymentService.js
│   │   └── subscriptionService.js
│   └── ai/
│       ├── conversationContext.js
│       └── intelligentToolRecommendation.js
├── config/
│   ├── environment.js
│   ├── endpoints.js
│   ├── api.js
│   └── constants.js
├── hooks/
│   ├── useAuth.js
│   ├── useSocket.js
│   ├── useChat.js
│   ├── useHourlyScans.js
│   └── useBreakpoint.js
└── utils/
    ├── analytics.js
    ├── passwordUtils.js
    └── generateScreenshotUrls.js
```

## 🚀 Deployment

### Netlify Deployment

The frontend is configured for automatic Netlify deployment:

#### Build Configuration
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "build"

[build.environment]
  REACT_APP_PRODUCTION_MODE = "true"
  REACT_APP_HEROKU_API_URL = "https://cleandata-test-app-961214fcb16c.herokuapp.com"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Environment Variables in Netlify
```env
REACT_APP_PRODUCTION_MODE=true
REACT_APP_HEROKU_API_URL=https://cleandata-test-app-961214fcb16c.herokuapp.com
REACT_APP_ANALYTICS=true
REACT_APP_ERROR_REPORTING=true
```

### Local Development

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 🧪 Testing

### Test Structure
```bash
src/
├── __tests__/
│   ├── components/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── hibp/
│   │   └── chat/
│   ├── services/
│   │   ├── authService.test.js
│   │   ├── paymentService.test.js
│   │   └── hibpService.test.js
│   └── utils/
└── setupTests.js
```

### Running Tests
```bash
# Run all tests
npm test

# Run specific test suite
npm test -- --testPathPattern=authService

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage --watchAll=false
```

## 🔧 Development Features

### Debug Mode
When `REACT_APP_DEBUG=true`:
- API call logging
- Debug user profile display
- Feature toggle controls
- Enhanced error logging

### Feature Toggles
```javascript
// Access feature toggles from environment
const features = environment.features;

if (features.analytics) {
    // Initialize analytics
}

if (features.autoScan) {
    // Enable automatic scanning
}
```

### Hot Reloading
Development server supports hot reloading for:
- Component changes
- Style updates
- Environment variable changes
- Service modifications

## 🛡️ Security Considerations

### Token Management
- JWT tokens stored securely
- Automatic token refresh
- Secure logout functionality
- Trial status protection

### API Security
- All API calls include authentication headers
- CORS configuration for cross-origin requests
- Input validation on all forms
- XSS protection measures

### Data Protection
- Sensitive data never logged in production
- Secure password handling
- Breach data displayed safely
- User privacy maintained

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
@media (min-width: 576px) { /* Small */ }
@media (min-width: 768px) { /* Medium */ }
@media (min-width: 992px) { /* Large */ }
@media (min-width: 1200px) { /* Extra Large */ }
```

### Component Responsiveness
- Adaptive layouts for all screen sizes
- Touch-friendly interface elements
- Optimized loading for mobile networks
- Progressive enhancement approach

## 🔄 State Management

### Local State Management
- React hooks for component state
- Context API for global state
- Local storage for persistence
- Session storage for temporary data

### Authentication State
```javascript
// Global auth context
const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
```

## 📈 Performance Optimization

### Code Splitting
```javascript
// Lazy loading components
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const Chat = lazy(() => import('./components/chat/ChatInterface'));
const HIBP = lazy(() => import('./components/hibp/EmailBreachChecker'));
```

### Caching Strategy
- API response caching
- Image optimization
- Bundle splitting
- Service worker for offline support

## 🐛 Troubleshooting

### Common Issues

**API Connection Problems:**
```bash
# Check backend server status
curl http://localhost:5002/health

# Verify environment configuration
npm run debug:env
```

**Authentication Issues:**
```bash
# Clear authentication data
localStorage.clear();
sessionStorage.clear();

# Check token validity
console.log(authService.getToken());
```

**Build Problems:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf build
npm run build
```

## 📞 Support

- **Documentation Issues:** Create GitHub issue
- **Development Questions:** Check troubleshooting section
- **Production Issues:** Monitor console for errors

---

## 📱 Mobile Experience

### Mobile-Specific Components
- **MobileNavbar** - Dedicated mobile navigation with hamburger menu
- **Responsive Layouts** - All components adapt to mobile screens
- **Touch-Optimized** - Larger tap targets and swipe gestures
- **Progressive Web App** - Can be installed on mobile devices

## 🔍 SEO & Marketing

### SEO Features
- **Dynamic Sitemap** - Auto-generated sitemap for all pages
- **Area Code Pages** - 300+ location-specific landing pages
- **React Helmet** - Dynamic meta tags and structured data
- **Schema.org** - Rich snippets for better search visibility
- **React Snap** - Pre-rendering for better SEO

### Analytics Integration
- **Google Analytics 4** - Tracking ID: G-7L01DYHWNN
- **Custom Events** - Track user interactions and conversions
- **Performance Monitoring** - Core Web Vitals tracking

## 🛠️ Development Tools

### Code Quality
- **ESLint** - Code linting (React App config)
- **Prettier** - Code formatting (configure in .prettierrc)
- **Source Map Explorer** - Bundle size analysis
- **React DevTools** - Component debugging

### Environment Management
```bash
# Check current environment
npm run mode:check

# Switch between environments
npm run mode:dev   # Local development
npm run mode:prod  # Production mode
```

### Debugging Features
When `debug.enabled = true` in environment.js:
- API call logging in console
- Debug user profile display
- Feature toggle controls visible
- Enhanced error messages
- Hourly scan test controls

## 🚨 Known Issues & Solutions

### Peer Dependency Conflicts
```bash
# React 18 conflicts with older packages
npm install --legacy-peer-deps
```

### WebSocket Connection Issues
- Check backend is running on correct port
- Verify CORS settings in backend
- Ensure authentication token is valid

### Build Warnings
- Multiple unused variable warnings (being addressed)
- React Hook dependency warnings (under review)
- These don't affect functionality

## 🔐 Security Best Practices

### Client-Side Security
- **No Secrets in Code** - All sensitive data in environment variables
- **XSS Protection** - React's built-in escaping
- **HTTPS Only** - Enforced in production
- **Content Security Policy** - Configured in public/index.html
- **Input Validation** - All user inputs sanitized

### Authentication Security
- **Clerk Integration** - Enterprise-grade auth
- **JWT Tokens** - Secure token management
- **Session Management** - Automatic token refresh
- **Protected Routes** - Route-level authorization

---

**Last Updated:** July 2025
**React Version:** 18.2.0
**Node.js:** 18+
**Status:** Active Development

## Change Plan Page Premium Experience

- If a user is a premium member, the Change Plan page displays a premium dashboard instead of upgrade options.
- The premium dashboard includes:
  - A welcome message
  - Quick Start Guide (step-by-step instructions)
  - How It Works (overview of the premium process)
  - Premium Perks (list of exclusive features)
  - Manage Billing section (button to billing portal and cancel subscription option)
- If the user is not premium, the page displays the upgrade cards and pricing as before.

## Branding

- All references to cyberforget.com have been updated to cyberforget.com (including in the footer and documentation).