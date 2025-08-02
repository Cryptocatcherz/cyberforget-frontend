# CyberForget Frontend - Deployment Instructions

## 🏗️ Architecture Overview

**Frontend**: React.js 18.2 application
- **Repository**: CyberForget/frontendv2
- **Deployment**: Netlify (automatically deploys from GitHub)
- **Domain**: app.cyberforget.com (via Netlify)
- **Framework**: React 18.2 with React Router v6
- **UI Library**: Material-UI + Custom Components
- **Authentication**: Clerk

**Backend**: Node.js/Express API
- **Repository**: CyberForget/cyberforget-backend
- **Deployment**: Heroku
- **Database**: Supabase PostgreSQL
- **Real-time**: Socket.io for WebSocket connections

## 📁 Project Structure

```
/Users/luke/Desktop/CyberForget/
├── frontendv2/                  # Frontend repository
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── chat/            # Chat system components
│   │   │   │   ├── ChatHeader.js
│   │   │   │   ├── SeamlessChatMessages.js
│   │   │   │   ├── WelcomeMessage.js
│   │   │   │   ├── ThinkingIndicator.js
│   │   │   │   └── tools/        # Embedded security tools
│   │   │   │       ├── DataBrokerScanTool.js/.css
│   │   │   │       ├── EmailScanTool.js
│   │   │   │       └── PasswordCheckTool.js
│   │   │   ├── Navbar.js        # Desktop navigation
│   │   │   ├── MobileNavbar.js/.css # Mobile navigation
│   │   │   └── SecurityTools.js
│   │   ├── pages/               # Route-level pages
│   │   │   ├── ChatPage.js/.css # Main AI assistant interface
│   │   │   ├── Dashboard.js     # User dashboard
│   │   │   ├── PricingPage.js   # Subscription plans
│   │   │   └── ScanningPage.js  # Full-page scanning
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useSeamlessChat.js    # Main chat logic
│   │   │   ├── useAuthUtils.js       # Authentication
│   │   │   └── useWindowSize.js      # Responsive design
│   │   ├── services/            # API and business logic
│   │   │   ├── api.js           # API client
│   │   │   ├── breachService.js # HIBP integration
│   │   │   ├── geminiService.js # Google Gemini AI
│   │   │   └── socketService.js # WebSocket management
│   │   ├── config/              # Configuration files
│   │   │   ├── environment.js   # Environment detection
│   │   │   ├── api.js           # API endpoints
│   │   │   └── chatConstants.js # Chat configuration
│   │   └── utils/               # Helper functions
│   ├── public/                  # Static assets
│   └── build/                   # Production build output
└── cyberforget-backend/         # Backend repository
    ├── src/
    │   ├── routes/              # API endpoints
    │   ├── services/            # Business logic
    │   ├── middleware/          # Express middleware
    │   └── websocket/           # Socket.io server
    └── prisma/                  # Database schema
```

## 🚀 Deployment Process

### Frontend (Netlify)
1. **Automatic Deployment**: Push to GitHub main branch
2. **Command**: `git push origin main`
3. **Netlify**: Automatically builds and deploys
4. **Build Command**: `npm run build`
5. **Publish Directory**: `build`

### Backend (Heroku)
1. **Manual Deployment**: From cyberforget-backend folder
2. **Commands**:
   ```bash
   cd ../cyberforget-backend
   git add .
   git commit -m "Update message"
   git push heroku main
   ```

### Development Environment Setup

**⚠️ IMPORTANT: ALWAYS use the automated startup script for development**

**Quick Start Script (REQUIRED)**:
```bash
# From frontend project directory
cd /Volumes/SSD/CyberForget/frontendv2
./start-dev.sh
```

**What the script does**:
- ✅ Kills any existing processes on ports 3000 and 5002
- ✅ Starts backend on port 5002 with proper environment
- ✅ Starts frontend on port 3000 with development server
- ✅ Health checks both services
- ✅ Tests temp email API functionality
- ✅ Provides comprehensive status and error reporting

**Manual Setup (NOT RECOMMENDED)**:
```bash
# Only use if script fails - Terminal 1 - Backend (port 5002)
cd /Volumes/SSD/CyberForget/cyberforget-backend
PORT=5002 npm run dev

# Only use if script fails - Terminal 2 - Frontend (port 3000)  
cd /Volumes/SSD/CyberForget/frontendv2
npm run dev
```

**Health Check URLs**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5002/health
- Temp Email: http://localhost:3000/temp-email

## 🔧 Environment Variables

### Frontend (.env.production)
```
# Production mode
REACT_APP_PRODUCTION_MODE=true

# API URLs
REACT_APP_HEROKU_API_URL=https://cyberforget-api-961214fcb16c.herokuapp.com
REACT_APP_API_BASE_URL=https://cyberforget-api-961214fcb16c.herokuapp.com
REACT_APP_SUPABASE_URL=https://vprcocxfjfbmiblyirml.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwcmNvY3hmamZibWlibHlpcm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNjIxOTMsImV4cCI6MjA2NzgzODE5M30.-McryxBqqdP1wXqYpD1YLHRb1TtNvO7vqzU1Oh7_jZM

# Features
REACT_APP_ANALYTICS=true
REACT_APP_ERROR_REPORTING=true
REACT_APP_AUTO_SCAN_ENABLED=true

# Google APIs
REACT_APP_GOOGLE_API_KEY=AIzaSyBSA7Mcs-gxNRIUmt7z0w2WQf3D6tGDlwI
```

### Frontend (.env.development)
```
# Development mode
REACT_APP_PRODUCTION_MODE=false

# Local API
REACT_APP_API_BASE_URL=http://localhost:5002

# Debug features
REACT_APP_DEBUG=true
REACT_APP_LOG_LEVEL=debug
REACT_APP_LOG_API_CALLS=true
REACT_APP_SHOW_DEBUG_PROFILE=true
```

### Backend (Heroku Config Vars)
```
DATABASE_URL=postgresql://postgres:dYjso3-mytxuv-dudnuw@db.vprcocxfjfbmiblyirml.supabase.co:5432/postgres
SUPABASE_URL=https://vprcocxfjfbmiblyirml.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ENCRYPTION_KEY=cyberforget_enc_key_123456789012
HIBP_API_KEY=c9f13508df6e4f3ca64731f0d06474db1
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
```

## 📊 Key Features

### AI-Powered Chat System
- **Main Interface**: ChatPage as primary landing page
- **Gemini Integration**: Google's Generative AI for conversational assistance
- **Smart Starters**: 10 optimized security questions for quick actions
- **Security Tools**: Seamlessly integrated tool recommendations and execution
- **Mobile-First Design**: Responsive layout optimized for all screen sizes

### Enhanced Security Tools (11 Total)
**IMPORTANT**: Each tool is professionally designed with enterprise-grade features and mobile optimization:

#### **1. 🧠 AI Cyber Intelligence Scanner** (`data_broker_scan`)
- **Premade Question**: "Analyze my digital footprint and security posture"
- **Features**: Dual-mode scanning (Quick 50+ sites vs Premium 500+ sites)
- **Trust Indicators**: Horizontal bar - "🔒 Safe", "✓ 2M+", "⚡ Fast"
- **Input**: First name, last name (mobile-optimized with proper icon spacing)
- **Quick Scan**: 60 seconds, 50+ sites, basic analysis
- **Premium Scan**: 2-3 minutes, 500+ sites, deep analysis + removal assistance
- **Mobile Enhancements**: Responsive trust indicators, proper input padding (65px-75px)

#### **2. 🛡️ Comprehensive Security Assessment** (`comprehensive_security`)
- **Premade Question**: "Perform comprehensive security assessment"
- **Features**: Multi-vector security analysis combining all tools
- **No Input Required**: Automated comprehensive threat analysis

#### **3. 🔍 AI Email Security Scanner** (`email_breach`)
- **Premade Question**: "Scan my email for data breaches and compromises"
- **Enhanced Features**: 
  - Progressive 6-stage scanning process
  - Visual risk scoring with circular indicators
  - AI-powered insights panel (Threat Level, Domain Reputation, Exposure Level)
  - Detailed breach timeline with severity indicators
  - Priority-based security recommendations (Critical/High/Medium)
  - Dark web monitoring integration
- **Input**: Email address with auto-save functionality
- **Mobile Optimized**: Stacked layout, responsive risk indicators

#### **4. 🔐 Password Security Checker** (`password_checker`)
- **Premade Question**: "Evaluate my password security and vulnerabilities"
- **Features**: Cryptographic analysis, breach status, strength assessment
- **Input**: Password with security analysis

#### **5. 📄 File Security Scanner** (`file_scan`)
- **Premade Question**: "Scan files for malware and security threats"
- **Features**: Multi-engine antivirus scanning with AI-powered threat detection
- **Input**: File upload

#### **6. 🗑️ Account Deletion Assistant** (`account_deleter`)
- **Premade Question**: "Help me delete online accounts and reduce my digital footprint"
- **Features**: Step-by-step guidance for removing accounts from 1000+ platforms
- **No Input Required**: Platform selection interface

#### **7. 📞 Phone Number Scam Checker** (`area_code_checker`)
- **Premade Question**: "Check phone numbers for scams and fraud"
- **Features**: Real-time scam detection for phone numbers and area codes
- **Input**: Phone number

#### **8. 🧪 Security Test Suite** (`security_test_suite`)
- **Premade Question**: "Run advanced security penetration tests"
- **Features**: Professional-grade security testing suite for vulnerability assessment
- **No Input Required**: Automated testing configuration

#### **9. 🤖 AI Cyber Defense Strategist** (`ai_defense`)
- **Premade Question**: "Deploy AI-powered cyber defense strategies"
- **Features**: Personalized cybersecurity recommendations using AI
- **No Input Required**: AI-generated defense strategies

#### **10. 🌐 Network Vulnerability Scanner** (`network_scan`)
- **Premade Question**: "Analyze network vulnerabilities and exposure"
- **Features**: Network-level security vulnerabilities and exposures scanning
- **No Input Required**: Infrastructure security analysis

#### **11. 📧 Temp Email Shield** (`temp_email`) **ACTIVE**
- **Premade Question**: "Generate temporary email for secure sign-ups"
- **Features**: 
  - Real-time temporary email generation using GuerrillaMail API
  - Live inbox monitoring with WebSocket updates
  - Automatic email refresh and message retrieval
  - Email content viewing with modal display
  - Copy to clipboard functionality for email addresses
- **Chat Integration**: Embedded tool with demo mode and full-page redirect
- **Full Page Access**: Available at `/temp-email` route
- **Backend Integration**: Connected to dedicated temp email service on port 5002
- **Security Benefits**: Protects primary email from breaches and spam
- **Mobile Optimized**: Responsive design with proper touch targets

### Tool Architecture & Flow
**Tool Integration**: All tools are embedded directly in chat messages using `InlineToolRenderer.js`

**Naming Convention**: Uses underscore format (`email_breach`, `data_broker_scan`) for seamless integration

**Auto-Open Logic**: When premade question clicked → `handlePreMadeQuestionClick` → AI processes message → Tool with matching `toolType` gets `autoOpen: true` → Tool renders in chat

**Mobile Optimization**: All tools responsive with proper spacing, font scaling, and touch targets

### Mobile-First Responsive Design
- **Navigation**: Optimized mobile navbar (48px height)
- **Chat Interface**: Responsive layout with proper touch targets
- **Tool Integration**: Mobile-optimized scanning interfaces
- **Breakpoints**: 768px, 480px, 430px, 375px for comprehensive coverage

### Embedded Security Tools
- **Data Broker Scanner**: Real-time scanning with progress visualization
- **Email Breach Checker**: HIBP integration with security recommendations
- **Password Security Tool**: Strength analysis and breach detection

### Key Components
- **ChatPage**: Main AI assistant interface with embedded tools
- **SeamlessChatMessages**: Message display with proper mobile scrolling
- **DataBrokerScanTool**: Enterprise-grade scanning with mobile optimization
- **MobileNavbar**: Responsive navigation with overflow handling

## 🔗 API Integration

### Configuration
- **Backend Base URL**: Configured in `src/config/environment.js`
- **Production**: `https://cyberforget-api-961214fcb16c.herokuapp.com`
- **Development**: `http://localhost:5002`

### Communication
- **HTTP**: Axios for REST API calls
- **WebSocket**: Socket.IO for real-time updates
- **Authentication**: Clerk for user auth, JWT tokens for API

### Key Endpoints
- **Auth**: `/api/users/login`, `/api/users/profile`
- **Scans**: `/api/scans/start`, `/api/hourly-scan/trigger`
- **HIBP**: `/api/hibp/email-scan`, `/api/hibp/password-check`
- **Chat**: `/api/chat/message`
- **Payment**: `/api/payment/create-checkout-session`
- **Temp Email**: `/api/v1/temp-email/generate`, `/api/v1/temp-email/check-messages`

## 📱 Mobile Optimizations (January 2025)

### Navigation Improvements
```css
/* Mobile navbar optimization */
.navbar-header {
  height: 48px; /* Reduced from 60px */
  padding: 0 12px; /* Reduced from 20px */
}

.logo-wrapper-mobile {
  gap: 8px; /* Reduced from 12px */
  padding: 6px 8px; /* More compact */
  max-width: calc(100vw - 120px); /* Prevent overflow */
}
```

### Chat Interface Enhancements
```css
/* Chat page mobile layout */
@media (max-width: 768px) {
  .chat-page {
    padding-top: 88px; /* 48px navbar + 40px header */
  }
  
  .chat-container {
    padding: 8px 4px 90px;
    max-height: calc(100vh - 88px - 90px);
  }
}
```

### Tool Mobile Optimization
```css
/* Data Broker Scanner mobile fixes */
@media (max-width: 430px) {
  .enterprise-scanning-display {
    padding: 12px 4px;
    margin: 12px 2px;
  }
  
  .scan-title h3 {
    font-size: 14px;
    word-break: break-word;
    hyphens: auto;
  }
  
  .scan-btn {
    padding: 8px 6px;
    font-size: 10px;
    letter-spacing: 0.1px;
    overflow-wrap: break-word;
  }
}
```

### Scrolling Behavior Fix
```javascript
// Fixed chat scrolling to bot response start
useEffect(() => {
  if (messages.length > 0) {
    const lastAssistantMessage = messages.slice().reverse()
      .find(msg => msg.role === 'assistant');
    if (lastAssistantMessage) {
      const messageElement = document.querySelector(
        `[data-message-id="${lastAssistantMessage.id}"]`
      );
      if (messageElement) {
        messageElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }
  }
}, [messages, isTyping]);
```

## 📝 Important Development Notes

### Deployment Process
1. **Frontend changes**: 
   - Push to GitHub main branch
   - Netlify auto-deploys within 2-3 minutes
   - Check build logs in Netlify dashboard

2. **Backend changes**: 
   - Deploy to Heroku manually from backend repo
   - `git push heroku main`
   - Monitor logs: `heroku logs --tail`

3. **Database changes**: 
   - Run migrations on Supabase
   - Update Prisma schema if needed
   - Test in staging first

### Testing Features
1. **Chat System**: 
   - Test AI responses and tool integration
   - Verify mobile scrolling behavior
   - Check pre-made question functionality

2. **Security Tools**:
   - Test data broker scanning on mobile
   - Verify email breach checking
   - Check password security analysis

3. **Mobile Experience**:
   - Test navigation on various screen sizes
   - Verify touch targets and interactions
   - Check text overflow and layout issues

### Environment Switching
```bash
# Development mode
npm start

# Production build
npm run build

# Test production build locally
npx serve -s build
```

## 🆔 Google Analytics
- **Tracking ID**: G-7L01DYHWNN
- **Location**: Added to public/index.html

## 🗄️ Key Integration Points

### Frontend-Backend Communication
- **API Client**: Configured with environment-based URLs
- **Error Handling**: Comprehensive error boundaries and fallbacks
- **Real-time Updates**: Socket.io for scan progress and threat alerts
- **Authentication**: Clerk integration with JWT token management

### Mobile-Specific Features
- **Responsive Images**: Optimized heights for mobile viewing
- **Touch Interactions**: Proper button sizing and spacing
- **Overflow Handling**: Text ellipsis and container boundaries
- **Performance**: Lazy loading and code splitting

---
## 🚨 Common Issues & Solutions

### Installation Issues
```bash
# Peer dependency conflicts
npm install --legacy-peer-deps

# Clear cache if needed
npm run clean
rm -rf node_modules package-lock.json
npm install
```

### Development Issues
1. **Port 3000 in use**: Kill existing process or change port
2. **WebSocket connection failed**: Check backend is running
3. **API calls failing**: Verify environment configuration
4. **Mobile layout issues**: Use browser dev tools mobile simulation

### Production Issues
1. **Netlify build fails**: Check environment variables in Netlify dashboard
2. **API timeout**: Verify Heroku dyno is active
3. **Mobile text overflow**: Check responsive CSS breakpoints
4. **Tool button truncation**: Verify mobile-specific button styles

### Mobile-Specific Fixes Applied
1. **Navigation overflow**: Compact logo and reduced padding
2. **Chat scrolling**: Fixed to scroll to bot response start
3. **Tool interfaces**: Optimized for small screens with proper sizing
4. **Text handling**: Added word-wrapping and ellipsis for overflow
5. **Button styling**: Fixed CSS conflicts causing invisible text on buttons
6. **Temp email interface**: Responsive design with proper touch targets

---

## 🔧 Quick Commands

### Development
```bash
# Automated startup (recommended)
./start-dev.sh              # Starts both frontend and backend with health checks

# Manual development
npm start                    # Start development server
npm run build               # Create production build
npm test                    # Run tests
npm run analyze            # Bundle size analysis
```

### Deployment
```bash
git add .
git commit -m "Update message"
git push origin main       # Auto-deploys to Netlify
```

### Troubleshooting

**⚠️ FIRST: Always try the startup script before manual troubleshooting**
```bash
cd /Volumes/SSD/CyberForget/frontendv2
./start-dev.sh
```

**Manual troubleshooting (if script fails)**:
```bash
# Kill processes on specific ports
lsof -ti:3000 | xargs kill -9    # Kill frontend
lsof -ti:5002 | xargs kill -9    # Kill backend

# Clear React cache
rm -rf node_modules/.cache
npm run dev  # NOT npm start - use npm run dev for development

# Check environment
npm run env:check

# Verify API connectivity
curl https://cyberforget-api-961214fcb16c.herokuapp.com/health   # Production
curl http://localhost:5002/health                               # Development

# Test temp email API
curl -X POST http://localhost:5002/api/v1/temp-email/generate \
  -H "Content-Type: application/json" \
  -d '{"useGuerrillaFallback": true, "prefix": "test"}'

# View real-time logs
tail -f /Volumes/SSD/CyberForget/backend.log     # Backend logs
tail -f /Volumes/SSD/CyberForget/frontend.log    # Frontend logs
```

---

## 🚀 Future Development Roadmap

### **Phase 1: Core Security Infrastructure (Q1 2025)**
1. **🔐 Built-in VPN Service** - WireGuard-based VPN with chat integration
2. **🌐 Website Security Scanner** - SSL, malware, and vulnerability scanning
3. **🔍 Dark Web Monitoring** - Real-time dark web scanning and alerts

### **Phase 2: Advanced Security Features (Q2 2025)**
4. **🔐 Multi-Factor Authentication Manager** - TOTP generator and backup codes
5. **🛡️ Real-time Threat Detection** - Behavioral analysis and anomaly detection
6. **🔒 Secure Communication Tools** - Encrypted messaging and file sharing

### **Phase 3: Enterprise & Advanced Features (Q3 2025)**
7. **🏢 Business Security Dashboard** - Multi-user management and compliance
8. **🤖 AI-Powered Incident Response** - Automated threat response
9. **🔐 Digital Identity Protection** - Identity verification and theft prevention

### **Phase 4: Cutting-Edge Innovation (Q4 2025)**
10. **🛡️ Zero Trust Network Access** - Zero trust architecture implementation
11. **🧠 Quantum-Safe Encryption** - Post-quantum cryptography
12. **🔍 Blockchain Security Audit** - Smart contract and DeFi security

**📋 Full roadmap available in**: `CYBERSECURITY_TOOLS_ROADMAP.md`

---

## 🎯 Current Development Status

### **Recently Completed**
- ✅ Temp Email Shield full integration (frontend + backend)
- ✅ GuerrillaMail API integration with session management
- ✅ CSS styling fixes for button visibility conflicts
- ✅ Automated development startup script (start-dev.sh)
- ✅ Real-time email inbox with WebSocket support
- ✅ Mobile-optimized temp email interface
- ✅ Comprehensive GitHub backup of all changes

### **In Progress**
- 🔄 VPN service infrastructure planning
- 🔄 Website security scanner development
- 🔄 Dark web monitoring research

### **Next Priorities**
1. **VPN Integration** - Core security infrastructure
2. **Website Scanner** - High user demand feature
3. **Dark Web Monitor** - Competitive advantage

## 📋 GitHub Backup Process

### Automated Backup with start-dev.sh
The development script automatically creates comprehensive commit messages when changes are made:

```bash
./start-dev.sh    # Includes automatic staging and commit suggestions
```

### Manual Backup Process
```bash
# Frontend Repository
cd /Volumes/SSD/CyberForget/frontendv2
git add .
git commit -m "Descriptive commit message with 🤖 Generated with [Claude Code]"
git push origin main

# Backend Repository  
cd /Volumes/SSD/CyberForget/cyberforget-backend
git add .
git commit -m "Descriptive commit message with 🤖 Generated with [Claude Code]"
git push origin main
```

### Recent Backup History
- **CSS Styling Fixes**: Button visibility improvements with proper color contrast
- **Temp Email Integration**: Complete frontend-backend functionality
- **Development Automation**: Startup script with health monitoring
- **Configuration Updates**: Environment and package.json optimizations

---

*Last updated: July 19, 2025*  
*Frontend Version: 2.2.0*  
*React Version: 18.2.0*  
*Security Tools: 11 Total (Temp Email now fully active)*  
*Mobile Optimization: Complete*  
*Development Setup: Automated with start-dev.sh*  
*Deployment: Netlify (app.cyberforget.com)*