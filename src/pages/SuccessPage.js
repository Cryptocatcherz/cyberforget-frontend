import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../hooks/useAuthUtils";
import authService from '../services/authService';
import './SuccessPage.css';

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(true);
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    const fetchSessionData = async () => {
      const sessionId = new URLSearchParams(location.search).get('session_id');
      console.log('[Payment] Starting payment verification process');
      console.log('[Payment] Session ID:', sessionId);

      if (!sessionId) {
        const errorDetails = {
          type: 'SESSION_ID_MISSING',
          message: 'No session ID found in URL parameters',
          searchParams: location.search,
          timestamp: new Date().toISOString()
        };
        console.error('[Payment] Session ID Error:', errorDetails);
        setDebugInfo(errorDetails);
        setError('No session ID found. Please try again or contact support.');
        setProcessing(false);
        return;
      }

      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'https://cleandata-test-app-961214fcb16c.herokuapp.com';
        const endpoint = `/api/payment/session/${sessionId}`;
        const fullUrl = `${apiUrl}${endpoint}`;
        
        console.log('[Payment] Initiating API request to:', fullUrl);
        
        const startTime = Date.now();
        const response = await fetch(fullUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Origin': 'https://app.cleandata.me'
          },
          credentials: 'include'
        });
        const requestDuration = Date.now() - startTime;

        console.log('[Payment] Response received in', requestDuration, 'ms');
        console.log('[Payment] Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          const errorDetails = {
            type: 'API_ERROR',
            status: response.status,
            statusText: response.statusText,
            body: errorText,
            timestamp: new Date().toISOString(),
            requestDuration
          };
          console.error('[Payment] API Error:', errorDetails);
          setDebugInfo(errorDetails);
          throw new Error(`Server error: ${errorText}`);
        }

        const data = await response.json();
        console.log('[Payment] Session response validation:', {
          hasSuccess: 'success' in data,
          hasCustomerEmail: 'customer_email' in data,
          hasCustomerDetails: 'customer_details' in data,
          hasToken: 'token' in data,
          hasSetupToken: 'setupToken' in data,
          hasUserData: 'user' in data
        });

        if (data.success && data.token && data.user) {
          console.log('[Payment] Payment and user creation verified successfully');
          
          // Validate response data
          const { customer_email, customer_details, token, setupToken, user } = data;
          
          console.log('[Payment] User data validation:', {
            hasId: Boolean(user.id),
            hasEmail: Boolean(user.email),
            hasName: Boolean(user.firstName && user.lastName),
            hasRole: Boolean(user.role),
            setupTokenPresent: Boolean(setupToken)
          });

          // Store authentication data
          localStorage.setItem('token', token);
          if (setupToken) {
            localStorage.setItem('setupToken', setupToken);
          }
          console.log('[Payment] Authentication tokens stored');

          // Create user context data
          const userData = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isAuthenticated: true
          };

          // Update auth context
          setUser(userData);
          console.log('[Payment] User context updated');
          
          // Clear any existing auth cache
          authService.clearCache();
          console.log('[Payment] Auth cache cleared');

          // Navigate to edit-info with complete user data
          navigate('/edit-info', { 
            state: { 
              fromPayment: true,
              setupToken: setupToken,
              customerInfo: {
                email: customer_email,
                ...customer_details,
                userId: user.id
              }
            }
          });
          console.log('[Payment] Navigation to edit-info initiated');
          
        } else {
          const verificationError = {
            type: 'PAYMENT_VERIFICATION_ERROR',
            success: data.success,
            hasToken: Boolean(data.token),
            hasUser: Boolean(data.user),
            timestamp: new Date().toISOString()
          };
          console.error('[Payment] Payment/User verification failed:', verificationError);
          setDebugInfo(verificationError);
          throw new Error('Payment verification or user creation failed');
        }
      } catch (error) {
        const errorDetails = {
          type: error.name,
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        };
        console.error('[Payment] Error processing payment:', errorDetails);
        setDebugInfo(errorDetails);
        setError(`Payment verification failed: ${error.message}`);
      } finally {
        setProcessing(false);
      }
    };

    fetchSessionData();
  }, [location.search, navigate, setUser]);

  if (processing) {
    return (
      <div className="success-container">
        <h2 className="success-title">Setting Up Your Account</h2>
        <p className="success-message">Please wait while we verify your payment and create your account...</p>
      </div>
    );
  }

  return (
    <div className="success-container">
      {error ? (
        <>
          <h2 className="success-title">Payment Status</h2>
          <p className="error-message">{error}</p>
          {debugInfo && (
            <div className="debug-info">
              <p>Error Details (for support):</p>
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          )}
          <div className="button-container">
            <button
              onClick={() => navigate('/dashboard')}
              className="primary-button"
            >
              Return to Dashboard
            </button>
          </div>
        </>
      ) : (
        <div>
          <h2 className="success-title">Account Created Successfully!</h2>
          <p className="success-message">Setting up your profile...</p>
        </div>
      )}
    </div>
  );
};

export default SuccessPage;
