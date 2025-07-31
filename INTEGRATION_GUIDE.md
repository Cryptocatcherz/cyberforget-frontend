# CyberForget Backend Integration Guide

## Overview
This guide explains how to integrate the new CyberForget backend with the frontend components.

## Environment Configuration

### Development Mode
Set the following environment variables in your `.env` file for development:

```env
REACT_APP_PRODUCTION_MODE=false
REACT_APP_API_BASE_URL=http://localhost:5002
REACT_APP_LOG_LEVEL=debug
```

### Production Mode
For production deployment, set:

```env
REACT_APP_PRODUCTION_MODE=true
REACT_APP_API_BASE_URL=https://your-backend-url.herokuapp.com
REACT_APP_LOG_LEVEL=error
```

## Backend Integration

### 1. Fixed Import Issues
- ✅ Fixed `getApiUrl` import error in `breachService.js`
- ✅ Updated API endpoints to use `/api/v1/` prefix
- ✅ Added comprehensive Stripe payment integration

### 2. New API Endpoints Available

#### HIBP Integration
```javascript
import { API_ENDPOINTS } from '../config/api';

// Email breach check
fetch(API_ENDPOINTS.HIBP.EMAIL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@example.com' })
});

// Password safety check
fetch(API_ENDPOINTS.HIBP.PASSWORD, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'userpassword' })
});
```

#### Stripe Payments
```javascript
import { PaymentService } from '../services/paymentService';

// Get pricing plans
const plans = await PaymentService.getPricingPlans();

// Create checkout session
const checkout = await PaymentService.createCheckoutSession(token, {
    priceId: 'price_premium_monthly',
    successUrl: 'https://yoursite.com/success',
    cancelUrl: 'https://yoursite.com/pricing'
});

// Get user subscription
const subscription = await PaymentService.getSubscription(token);
```

#### Dashboard Data
```javascript
// Get dashboard statistics
fetch(API_ENDPOINTS.DASHBOARD.STATS, {
    headers: { 'Authorization': `Bearer ${token}` }
});

// Get threats data
fetch(API_ENDPOINTS.DASHBOARD.THREATS, {
    headers: { 'Authorization': `Bearer ${token}` }
});
```

### 3. New Components

#### PricingPlans Component
```javascript
import PricingPlans from '../components/PricingPlans';

function MyPage() {
    const handlePlanSelect = (plan) => {
        console.log('Selected plan:', plan);
    };

    return (
        <PricingPlans 
            onSelectPlan={handlePlanSelect}
            showTitle={true}
        />
    );
}
```

## Testing the Integration

### 1. Start the Backend
```bash
cd cyberforget-backend
npm run dev
```

### 2. Start the Frontend
```bash
cd frontendv2
npm start
```

### 3. Test API Connection
Open browser console and check for:
- Environment logs showing correct API URL
- Successful API calls to `/api/v1/health`
- Pricing plans loading correctly

## Backend Endpoints Summary

### Authentication
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/users/me` - Get current user

### HIBP Security
- `POST /api/v1/hibp/email` - Check email breaches
- `POST /api/v1/hibp/password` - Check password safety

### Chat Tools
- `POST /api/v1/chat/email-scan` - Email security scan
- `POST /api/v1/chat/location` - Location tools

### Dashboard
- `GET /api/v1/dashboard/stats` - Dashboard statistics
- `GET /api/v1/dashboard/threats` - Threat data
- `POST /api/v1/dashboard/trigger-scan` - Start scan

### Stripe Payments
- `GET /api/v1/payments/plans` - Get pricing plans
- `POST /api/v1/payments/checkout` - Create checkout session
- `POST /api/v1/payments/portal` - Customer portal
- `GET /api/v1/payments/subscription` - Get subscription
- `POST /api/v1/payments/subscription/manage` - Manage subscription

### Feature Toggles
- `GET /api/v1/feature-toggles` - List feature toggles
- `PUT /api/v1/feature-toggles/:id` - Update feature toggle

### Health Check
- `GET /api/v1/health` - API health status

## Environment Modes

The frontend automatically detects and switches between development and production modes based on:

1. `process.env.REACT_APP_PRODUCTION_MODE`
2. `process.env.NODE_ENV`
3. `window.location.hostname` (app.cyberforget.ai for production)

### Development Mode Features
- API calls to `http://localhost:5002`
- Debug logging enabled
- Shorter cache timeouts
- Enhanced error reporting

### Production Mode Features
- API calls to production backend URL
- Minimal logging
- Longer cache timeouts
- Analytics and error reporting enabled

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check backend is running on port 5002
   - Verify environment variables are set correctly
   - Check browser console for CORS errors

2. **Stripe Integration Issues**
   - Ensure Stripe keys are configured in backend `.env`
   - Check that webhook endpoints are properly set up
   - Verify pricing plan IDs match between frontend and backend

3. **Import Errors**
   - Restart development server after environment changes
   - Clear node_modules and reinstall if needed
   - Check file paths are correct

### Debug Commands

```bash
# Check environment detection
console.log(environment.DEVELOPMENT_MODE);

# Test API connection
fetch('/api/v1/health').then(r => r.json()).then(console.log);

# Check pricing plans
PaymentService.getPricingPlans().then(console.log);
```

## Next Steps

1. Configure production backend URL in environment variables
2. Set up Stripe webhook endpoints in production
3. Configure authentication with your preferred provider (Clerk recommended)
4. Test payment flows in Stripe test mode
5. Deploy both frontend and backend to production

## Support

For issues with this integration:
1. Check browser console for errors
2. Verify backend logs for API call failures
3. Test individual endpoints with curl or Postman
4. Review environment configuration