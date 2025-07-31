# CyberForget Frontend - Technical Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Key Components](#key-components)
5. [Services Layer](#services-layer)
6. [State Management](#state-management)
7. [Routing System](#routing-system)
8. [API Integration](#api-integration)
9. [Real-time Features](#real-time-features)
10. [Security Implementation](#security-implementation)
11. [Performance Optimizations](#performance-optimizations)
12. [Testing Strategy](#testing-strategy)
13. [Deployment Guide](#deployment-guide)

## Architecture Overview

CyberForget Frontend is a React-based single-page application (SPA) that serves as a comprehensive identity protection and privacy management platform. The architecture follows a component-based design with clear separation of concerns.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                        │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Pages     │  │  Components  │  │    Hooks     │   │
│  └──────┬──────┘  └──────┬───────┘  └──────┬───────┘   │
│         └─────────────────┴─────────────────┘           │
│                           │                              │
│  ┌────────────────────────┴────────────────────────┐    │
│  │                  Services Layer                  │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │    │
│  │  │   Auth   │  │   API    │  │   Features   │  │    │
│  │  └──────────┘  └──────────┘  └──────────────┘  │    │
│  └──────────────────────┬──────────────────────────┘    │
│                         │                                │
│  ┌──────────────────────┴──────────────────────────┐    │
│  │              External Services                   │    │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌──────┐  │    │
│  │  │ Clerk  │  │Supabase│  │ Stripe │  │Gemini│  │    │
│  │  └────────┘  └────────┘  └────────┘  └──────┘  │    │
│  └──────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## Technology Stack

### Core Dependencies
- **React 18.2.0** - UI framework
- **React Router 6.25.1** - Client-side routing
- **Clerk 5.32.4** - Authentication provider
- **Socket.io Client 4.8.0** - Real-time communication
- **Axios 1.7.7** - HTTP client
- **Material-UI 5.15.11** - UI component library
- **Emotion 11.13** - CSS-in-JS styling
- **Styled Components 6.1.12** - Component styling

### AI & Analytics
- **Google Generative AI 0.21.0** - AI chat integration
- **React GA4 2.1.0** - Google Analytics
- **Sentry React 7.0.0** - Error tracking

### Payment & Database
- **Stripe.js 1.29.0** - Payment processing
- **Supabase JS 2.45.0** - Backend as a Service

### Development Tools
- **React Scripts 5.0.1** - Build tooling
- **Concurrently 9.1.2** - Process management
- **Source Map Explorer 2.5.3** - Bundle analysis

## Project Structure

### Directory Organization

```
frontendv2/
├── public/                 # Static assets
│   ├── index.html         # Main HTML template
│   ├── images/            # Static images
│   └── _redirects         # Netlify redirects
├── src/
│   ├── app.js             # Main application component
│   ├── index.js           # Application entry point
│   ├── components/        # Reusable components
│   ├── pages/             # Route-level components
│   ├── services/          # Business logic
│   ├── hooks/             # Custom React hooks
│   ├── config/            # Configuration files
│   ├── context/           # React Context providers
│   ├── utils/             # Utility functions
│   ├── styles/            # Global styles
│   └── data/              # Static data files
├── scripts/               # Build and utility scripts
├── supabase/              # Supabase functions
└── build/                 # Production build output
```

## Key Components

### Authentication Components

#### AuthNavigationHandler
Manages navigation based on authentication state:
```javascript
// Handles redirect after login
// Manages trial user detection
// Controls access to protected routes
```

#### PrivateRoute
Protects routes requiring authentication:
```javascript
// Wraps protected components
// Redirects to login if unauthenticated
// Preserves intended destination
```

### Dashboard Components

#### DashboardComponent
Main dashboard interface featuring:
- Real-time scan progress
- Threat statistics
- Data broker removal tracking
- Quick action buttons

#### RemovalDashboard
Tracks data removal progress:
- Visual progress indicators
- Site-by-site status
- Automated removal timeline

### AI Chat System

#### ChatPage (Main Landing)
Primary user interface featuring:
- AI-powered security assistant
- Smart starter suggestions
- Quick tool access
- Conversation history

#### Chat Components
- **ChatMessages** - Message display with markdown support
- **ChatInput** - User input with auto-suggestions
- **ThinkingIndicator** - AI processing visualization
- **SecurityTools** - Integrated security tool cards

### Scanning Features

#### HourlyScansComponent
Automated scanning system:
- Configurable scan intervals
- Real-time progress tracking
- WebSocket-based updates
- Manual scan triggers

#### ScanningOverlay
Visual scanning experience:
- Animated progress indicators
- Site-by-site scanning display
- Threat detection alerts
- Result summaries

## Services Layer

### Core Services

#### authService.js
Authentication management:
```javascript
class AuthService {
  login(email, password, remember)
  logout()
  getToken()
  isAuthenticated()
  refreshToken()
  getUserProfile()
}
```

#### apiService.js
HTTP communication layer:
```javascript
// Axios instance configuration
// Request/response interceptors
// Error handling
// Token attachment
```

### Feature Services

#### scanService.js
Scanning operations:
```javascript
// Initiate scans
// Track progress
// Retrieve results
// Handle scan types
```

#### breachService.js
Data breach checking:
```javascript
// HIBP API integration
// Email breach lookup
// Password checking
// Breach details retrieval
```

#### dashboardService.js
Dashboard data management:
```javascript
// Fetch user statistics
// Update dashboard metrics
// Cache management
// Real-time updates
```

## State Management

### Context Providers

#### AuthContext
Global authentication state:
```javascript
const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  loading: false
});
```

#### SocketContext
WebSocket connection management:
```javascript
const SocketContext = createContext({
  socket: null,
  connected: false,
  emit: () => {},
  on: () => {},
  off: () => {}
});
```

### Local State Management
- Component-level state with useState
- Complex state with useReducer
- Side effects with useEffect
- Memoization with useMemo/useCallback

## Routing System

### Route Structure
```javascript
<Routes>
  {/* Public Routes */}
  <Route path="/" element={<ChatPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/signup" element={<SignupPage />} />
  <Route path="/pricing" element={<PricingPage />} />
  
  {/* Protected Routes */}
  <Route element={<PrivateRoute />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/edit-info" element={<EditInfoPage />} />
    <Route path="/data-removals" element={<DataRemovalsPage />} />
  </Route>
  
  {/* Admin Routes */}
  <Route element={<AdminRoute />}>
    <Route path="/admin" element={<AdminDashboard />} />
  </Route>
</Routes>
```

### Navigation Guards
- Authentication checks
- Subscription status validation
- Role-based access control
- Redirect management

## API Integration

### Endpoint Configuration
```javascript
// environment.js
const API_BASE_URL = isProduction 
  ? 'https://cyberforget-api.herokuapp.com'
  : 'http://localhost:5002';

// endpoints.js
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/users/login',
    PROFILE: '/api/users/profile'
  },
  SCANS: {
    START: '/api/scans/start',
    STATUS: '/api/scans/status'
  }
};
```

### Request Handling
```javascript
// API interceptor example
axios.interceptors.request.use(
  config => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);
```

## Real-time Features

### WebSocket Integration
```javascript
// Socket connection setup
const socket = io(SOCKET_URL, {
  auth: { token: authService.getToken() },
  transports: ['websocket', 'polling']
});

// Event listeners
socket.on('scan_progress', handleScanProgress);
socket.on('scan_complete', handleScanComplete);
socket.on('threat_detected', handleThreatDetected);
```

### Real-time Updates
- Scan progress tracking
- Live threat notifications
- User activity updates
- System notifications

## Security Implementation

### Client-Side Security
1. **XSS Protection**
   - React's automatic escaping
   - Content Security Policy headers
   - Input sanitization

2. **Authentication Security**
   - JWT token storage (httpOnly cookies preferred)
   - Automatic token refresh
   - Session timeout handling

3. **API Security**
   - HTTPS enforcement
   - CORS configuration
   - Request signing

### Data Protection
- No sensitive data in localStorage
- Encrypted communication
- PII handling compliance
- Secure form submissions

## Performance Optimizations

### Code Splitting
```javascript
// Lazy loading routes
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminPanel = lazy(() => import('./pages/AdminDashboard'));
```

### Bundle Optimization
- Tree shaking enabled
- Minification in production
- Source map generation
- Asset optimization

### Caching Strategy
- API response caching
- Static asset caching
- Service worker for offline support
- CDN integration

### Performance Monitoring
- Core Web Vitals tracking
- Bundle size analysis
- Runtime performance metrics
- Error rate monitoring

## Testing Strategy

### Unit Testing
```javascript
// Component testing example
describe('DashboardComponent', () => {
  it('renders user statistics', () => {
    render(<DashboardComponent />);
    expect(screen.getByText('Total Threats')).toBeInTheDocument();
  });
});
```

### Integration Testing
- API integration tests
- Route navigation tests
- Authentication flow tests
- Payment flow tests

### E2E Testing Scenarios
- User registration flow
- Scanning process
- Payment subscription
- Data removal requests

## Deployment Guide

### Production Build
```bash
# Build for production
npm run build:prod

# Analyze bundle size
npm run analyze

# Test production build locally
npm run start
```

### Environment Configuration
```bash
# Production variables (Netlify)
REACT_APP_PRODUCTION_MODE=true
REACT_APP_HEROKU_API_URL=https://cyberforget-api.herokuapp.com
REACT_APP_ANALYTICS=true

# Development variables
REACT_APP_PRODUCTION_MODE=false
REACT_APP_API_BASE_URL=http://localhost:5002
REACT_APP_DEBUG=true
```

### Deployment Process
1. **Netlify Deployment**
   - Push to main branch
   - Automatic build trigger
   - Environment variables set in Netlify dashboard
   - Custom domain configuration

2. **Pre-deployment Checklist**
   - [ ] Run tests locally
   - [ ] Check bundle size
   - [ ] Verify environment variables
   - [ ] Test payment flows
   - [ ] Validate API endpoints
   - [ ] Check mobile responsiveness

3. **Post-deployment Verification**
   - [ ] Test authentication flow
   - [ ] Verify API connections
   - [ ] Check analytics tracking
   - [ ] Monitor error rates
   - [ ] Validate payment processing

### Monitoring & Maintenance
- Sentry error tracking
- Google Analytics monitoring
- Performance metrics dashboard
- User feedback collection

---

## Contributing Guidelines

1. **Code Style**
   - Follow ESLint configuration
   - Use functional components
   - Implement proper error handling
   - Add meaningful comments

2. **Git Workflow**
   - Feature branches from main
   - Descriptive commit messages
   - PR reviews required
   - CI/CD checks must pass

3. **Documentation**
   - Update README for new features
   - Document API changes
   - Add JSDoc comments
   - Update this technical documentation

---

**Version:** 1.0.0  
**Last Updated:** July 2025  
**Maintained By:** CyberForget Development Team