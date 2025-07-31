# CyberForget Frontend - Developer Guide

## Quick Start for New Developers

Welcome to the CyberForget frontend codebase! This guide will help you get up and running quickly.

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- npm 9+ or yarn
- Git
- A code editor (VS Code recommended)
- Access to the CyberForget backend repository

## Initial Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone [repository-url]
cd frontendv2

# Install dependencies (use legacy peer deps due to React 18 conflicts)
npm install --legacy-peer-deps

# Copy environment file
cp .env.example .env.local
```

### 2. Environment Configuration

Edit `.env.local` with your development settings:

```env
# Development mode
REACT_APP_PRODUCTION_MODE=false

# Local backend URL
REACT_APP_API_BASE_URL=http://localhost:5002

# Enable debug features
REACT_APP_DEBUG=true
REACT_APP_LOG_LEVEL=debug
REACT_APP_LOG_API_CALLS=true
REACT_APP_SHOW_DEBUG_PROFILE=true

# Feature flags
REACT_APP_AUTO_SCAN_ENABLED=true
REACT_APP_ANALYTICS=false
REACT_APP_ERROR_REPORTING=false
```

### 3. Start Development Server

```bash
# Start the frontend (runs on port 3000)
npm run dev

# In another terminal, start the backend
cd ../cyberforget-backend
npm run dev
```

## Key Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run mode:check       # Check current environment
npm run mode:dev         # Switch to dev mode
npm run mode:prod        # Switch to production mode

# Building
npm run build            # Build for production
npm run build:prod       # Build with production env
npm run analyze          # Analyze bundle size

# Testing
npm test                 # Run tests
npm test -- --coverage   # Run with coverage
npm test -- --watch      # Watch mode

# Code Quality
npm run lint             # Run ESLint (if configured)
```

## Understanding the Codebase

### Project Structure Overview

```
src/
├── app.js              # Main app component & routing
├── pages/              # Page-level components (routes)
├── components/         # Reusable UI components
├── services/           # Business logic & API calls
├── hooks/              # Custom React hooks
├── config/             # Configuration files
└── utils/              # Helper functions
```

### Key Files to Understand

1. **`src/app.js`**
   - Main application component
   - Route definitions
   - Layout logic

2. **`src/config/environment.js`**
   - Environment configuration
   - API URLs
   - Feature flags

3. **`src/pages/ChatPage.js`**
   - Main landing page
   - AI chat interface
   - Primary user interaction

4. **`src/services/authService.js`**
   - Authentication logic
   - Token management
   - User state

## Common Development Tasks

### Adding a New Page

1. Create page component in `src/pages/`:
```javascript
// src/pages/MyNewPage.js
import React from 'react';
import Navbar from '../components/Navbar';

const MyNewPage = () => {
  return (
    <>
      <Navbar />
      <div className="container">
        <h1>My New Page</h1>
        {/* Your content here */}
      </div>
    </>
  );
};

export default MyNewPage;
```

2. Add route in `src/app.js`:
```javascript
<Route path="/my-new-page" element={<MyNewPage />} />
```

### Creating a New Component

1. Create component in appropriate directory:
```javascript
// src/components/MyComponent.js
import React from 'react';
import './MyComponent.css';

const MyComponent = ({ title, children }) => {
  return (
    <div className="my-component">
      <h2>{title}</h2>
      {children}
    </div>
  );
};

export default MyComponent;
```

2. Import and use in pages or other components.

### Adding an API Service

1. Create service in `src/services/`:
```javascript
// src/services/myService.js
import axios from 'axios';
import { getApiUrl } from '../config/environment';
import { ENDPOINTS } from '../config/endpoints';

class MyService {
  async fetchData() {
    try {
      const response = await axios.get(
        getApiUrl(ENDPOINTS.MY_ENDPOINT)
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
}

export default new MyService();
```

### Working with the AI Chat

The AI chat is the primary interface. Key files:
- `src/pages/ChatPage.js` - Main chat page
- `src/components/chat/` - Chat components
- `src/hooks/useChat.js` - Chat logic hook

### Implementing Protected Routes

```javascript
// Use PrivateRoute wrapper for authenticated pages
<Route element={<PrivateRoute />}>
  <Route path="/protected" element={<ProtectedPage />} />
</Route>
```

## Debugging Tips

### Enable Debug Mode

In `src/config/environment.js`, set:
```javascript
debug: {
  enabled: true,
  logLevel: 'debug',
  showUserProfile: true,
  enableApiLogs: true
}
```

### Chrome DevTools

1. React Developer Tools extension
2. Network tab for API calls
3. Console for debug logs
4. Application tab for localStorage

### Common Issues

1. **Peer dependency conflicts**
   - Always use `npm install --legacy-peer-deps`

2. **WebSocket connection failed**
   - Ensure backend is running
   - Check CORS settings
   - Verify authentication token

3. **API calls failing**
   - Check environment configuration
   - Verify backend is running on correct port
   - Check network tab for errors

## Best Practices

### Component Guidelines

1. **Use Functional Components**
```javascript
// Good
const MyComponent = () => {
  const [state, setState] = useState();
  return <div>{state}</div>;
};

// Avoid class components unless necessary
```

2. **Keep Components Small**
   - Single responsibility principle
   - Extract reusable logic to hooks
   - Break down complex components

3. **Use Proper Naming**
   - PascalCase for components
   - camelCase for functions/variables
   - Descriptive names

### State Management

1. **Local State First**
   - Use useState for component state
   - Use useContext for shared state
   - Avoid prop drilling

2. **API Data Fetching**
```javascript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await apiService.getData();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);
```

### Security Considerations

1. **Never commit sensitive data**
   - Use environment variables
   - Add .env to .gitignore
   - No API keys in code

2. **Validate user input**
   - Sanitize before sending to API
   - Use proper form validation
   - Handle errors gracefully

3. **Protected routes**
   - Always use authentication guards
   - Check user permissions
   - Handle unauthorized access

## Getting Help

### Resources

1. **Documentation**
   - README.md - General overview
   - TECHNICAL_DOCUMENTATION.md - Deep technical details
   - CLAUDE.md - Deployment instructions

2. **Code Examples**
   - Look at existing components
   - Check services for API patterns
   - Review hooks for state logic

3. **Team Communication**
   - Ask questions in team chat
   - Create issues for bugs
   - Submit PRs for review

### Useful VS Code Extensions

- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens

## Next Steps

1. Explore the codebase structure
2. Run the application locally
3. Try making a small change
4. Create a test component
5. Submit your first PR!

---

**Happy Coding!** 🚀

If you have questions, don't hesitate to ask the team!