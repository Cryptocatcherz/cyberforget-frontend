import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuthUtils';
import useSubscription from '../hooks/useSubscription';
import api from '../services/apiService';
import './AccountBilling.css';

const AccountBilling = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { 
    isPremium, 
    isTrial, 
    isTrialCancelled,
    isPastDue,
    daysRemaining,
    trialEndsAt,
    status 
  } = useSubscription();
  
  const [loading, setLoading] = useState(false);
  const [billingPortalUrl, setBillingPortalUrl] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [invoices, setInvoices] = useState([]);
  
  const action = searchParams.get('action');

  useEffect(() => {
    if (action === 'reactivate' && isTrialCancelled) {
      handleReactivateTrial();
    }
  }, [action, isTrialCancelled]);

  useEffect(() => {
    loadBillingInfo();
  }, [user]);

  const loadBillingInfo = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Get billing portal URL
      const portalResponse = await api.post('/payments/create-billing-portal', {
        returnUrl: window.location.href
      });
      setBillingPortalUrl(portalResponse.data.url);
      
      // Get payment methods
      const methodsResponse = await api.get('/payments/payment-methods');
      setPaymentMethods(methodsResponse.data.paymentMethods || []);
      
      // Get recent invoices
      const invoicesResponse = await api.get('/payments/invoices');
      setInvoices(invoicesResponse.data.invoices || []);
      
    } catch (error) {
      console.error('Error loading billing info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReactivateTrial = async () => {
    try {
      setLoading(true);
      await api.post('/payments/reactivate-trial');
      window.location.reload(); // Refresh to update subscription status
    } catch (error) {
      console.error('Error reactivating trial:', error);
      alert('Failed to reactivate trial. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaymentMethod = async () => {
    try {
      setLoading(true);
      
      // Create checkout session for adding payment method
      const response = await api.post('/payments/create-checkout-session', {
        mode: 'setup', // Setup mode for adding payment method without charging
        successUrl: `${window.location.origin}/account/billing?success=true`,
        cancelUrl: `${window.location.origin}/account/billing?cancelled=true`
      });
      
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start payment setup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = () => {
    if (billingPortalUrl) {
      window.location.href = billingPortalUrl;
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription?')) {
      return;
    }
    
    try {
      setLoading(true);
      await api.post('/payments/cancel-subscription');
      window.location.reload();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Failed to cancel subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="account-billing-page">
      <div className="billing-container">
        <div className="billing-header">
          <h1>Billing & Subscription</h1>
          <button 
            className="back-button"
            onClick={() => navigate('/dashboard')}
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Subscription Status Card */}
        <div className={`subscription-status-card ${status}`}>
          <div className="status-header">
            <h2>Current Plan</h2>
            <span className={`status-badge ${status}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
          
          <div className="status-details">
            {isTrial && (
              <>
                <p>You're in your free trial period.</p>
                <p className="trial-info">
                  {isTrialCancelled 
                    ? `Trial cancelled - Access ends ${formatDate(trialEndsAt)}`
                    : `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`
                  }
                </p>
              </>
            )}
            
            {isPremium && (
              <>
                <p>You have full access to all premium features.</p>
                <p className="next-billing">
                  Next billing date: {/* Add from subscription data */}
                </p>
              </>
            )}
            
            {isPastDue && (
              <p className="payment-warning">
                ⚠️ Your payment failed. Please update your payment method.
              </p>
            )}
            
            {!isTrial && !isPremium && (
              <p>You're on the free plan with limited features.</p>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="billing-section">
          <h2>Payment Methods</h2>
          {paymentMethods.length > 0 ? (
            <div className="payment-methods">
              {paymentMethods.map((method) => (
                <div key={method.id} className="payment-method">
                  <div className="method-info">
                    <span className="card-brand">{method.brand}</span>
                    <span className="card-last4">•••• {method.last4}</span>
                    <span className="card-expiry">
                      Expires {method.exp_month}/{method.exp_year}
                    </span>
                  </div>
                  {method.isDefault && (
                    <span className="default-badge">Default</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-payment-method">
              <p>No payment method on file.</p>
              {(isTrial || !isPremium) && (
                <button 
                  className="add-payment-button"
                  onClick={handleAddPaymentMethod}
                  disabled={loading}
                >
                  Add Payment Method
                </button>
              )}
            </div>
          )}
        </div>

        {/* Billing Actions */}
        <div className="billing-actions">
          {isPremium && billingPortalUrl && (
            <button 
              className="manage-billing-button"
              onClick={handleManageBilling}
              disabled={loading}
            >
              Manage Billing in Stripe
            </button>
          )}
          
          {isTrialCancelled && (
            <button 
              className="reactivate-button"
              onClick={handleReactivateTrial}
              disabled={loading}
            >
              Reactivate Trial
            </button>
          )}
          
          {(isPremium || (isTrial && !isTrialCancelled)) && (
            <button 
              className="cancel-button"
              onClick={handleCancelSubscription}
              disabled={loading}
            >
              Cancel Subscription
            </button>
          )}
          
          {!isPremium && !isTrial && (
            <button 
              className="upgrade-button"
              onClick={() => navigate('/pricing')}
            >
              View Pricing Plans
            </button>
          )}
        </div>

        {/* Recent Invoices */}
        {invoices.length > 0 && (
          <div className="billing-section">
            <h2>Billing History</h2>
            <div className="invoices-list">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="invoice-item">
                  <div className="invoice-date">
                    {formatDate(invoice.created * 1000)}
                  </div>
                  <div className="invoice-amount">
                    ${(invoice.amount_paid / 100).toFixed(2)}
                  </div>
                  <div className="invoice-status">
                    {invoice.status}
                  </div>
                  <a 
                    href={invoice.invoice_pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="invoice-download"
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountBilling;