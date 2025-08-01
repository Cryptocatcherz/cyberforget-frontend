import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuthUtils';
import useSubscription from '../hooks/useSubscription';
import api from '../services/apiService';
import './ChangePlan.css';

const ChangePlan = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { 
    isPremium, 
    isTrial, 
    isTrialCancelled,
    daysRemaining,
    status 
  } = useSubscription();
  
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  
  // Check for success/cancel parameters
  const success = searchParams.get('success');
  const cancelled = searchParams.get('cancelled');

  useEffect(() => {
    loadPlans();
  }, []);

  useEffect(() => {
    if (success) {
      // Show success message for a few seconds then redirect
      setTimeout(() => {
        navigate('/dashboard?subscription=success');
      }, 3000);
    }
  }, [success, navigate]);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const response = await api.get('/payments/plans');
      setPlans(response.data.data || []);
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async (priceId, planName) => {
    if (!user) {
      navigate('/sign-in');
      return;
    }

    try {
      setLoading(true);
      
      const response = await api.post('/payments/create-checkout-session', {
        priceId,
        mode: 'subscription',
        successUrl: `${window.location.origin}/change-plan?success=true&plan=${encodeURIComponent(planName)}`,
        cancelUrl: `${window.location.origin}/change-plan?cancelled=true`,
        trialPeriodDays: isTrial ? 0 : 5 // No trial if already trialing
      });
      
      if (response.data.data.url) {
        window.location.href = response.data.data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTrial = async () => {
    if (!user) {
      navigate('/sign-in');
      return;
    }

    try {
      setLoading(true);
      
      // Start trial with the premium monthly plan
      const premiumPlan = plans.find(p => p.interval === 'month' && p.name.toLowerCase().includes('premium'));
      if (!premiumPlan) {
        alert('Premium plan not found. Please try again.');
        return;
      }

      const response = await api.post('/payments/create-checkout-session', {
        priceId: premiumPlan.stripePriceId,
        mode: 'subscription',
        successUrl: `${window.location.origin}/dashboard?trial=started`,
        cancelUrl: `${window.location.origin}/change-plan?cancelled=true`,
        trialPeriodDays: 5
      });
      
      if (response.data.data.url) {
        window.location.href = response.data.data.url;
      }
    } catch (error) {
      console.error('Error starting trial:', error);
      alert('Failed to start trial. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPlanStatus = (plan) => {
    if (!user) return null;
    
    // Check if this is their current plan
    if (isPremium && plan.interval === 'month' && plan.name.toLowerCase().includes('premium')) {
      return 'current';
    }
    if (isTrial) {
      return 'trial';
    }
    return null;
  };

  const getPlanButtonText = (plan) => {
    const planStatus = getPlanStatus(plan);
    
    if (planStatus === 'current') {
      return 'Current Plan';
    }
    if (planStatus === 'trial' && plan.name.toLowerCase().includes('premium')) {
      return `Trial (${daysRemaining} days left)`;
    }
    if (isTrial || isPremium) {
      return 'Switch to This Plan';
    }
    return 'Select Plan';
  };

  const isPlanDisabled = (plan) => {
    const planStatus = getPlanStatus(plan);
    return planStatus === 'current' || loading;
  };

  if (success) {
    return (
      <div className="change-plan-page success-page">
        <div className="success-container">
          <div className="success-icon">✅</div>
          <h1>Payment Successful!</h1>
          <p>Your subscription has been activated. Redirecting to dashboard...</p>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (cancelled) {
    return (
      <div className="change-plan-page cancelled-page">
        <div className="cancelled-container">
          <div className="cancelled-icon">❌</div>
          <h1>Payment Cancelled</h1>
          <p>No worries! You can choose a plan anytime.</p>
          <button 
            className="back-to-plans-btn"
            onClick={() => navigate('/change-plan')}
          >
            Back to Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="change-plan-page">
      <div className="plan-container">
        <div className="plan-header">
          <button 
            className="back-button"
            onClick={() => navigate('/dashboard')}
          >
            ← Back to Dashboard
          </button>
          <h1>Choose Your Plan</h1>
          <p className="plan-subtitle">
            {isTrial 
              ? `You have ${daysRemaining} days left in your trial`
              : isPremium 
                ? 'Manage your subscription'
                : 'Start protecting your digital identity today'
            }
          </p>
        </div>

        {/* Current Status Banner */}
        {user && (
          <div className={`current-status-banner ${status}`}>
            <div className="status-content">
              <span className="status-icon">
                {isTrial ? '🚀' : isPremium ? '💎' : '👤'}
              </span>
              <div className="status-text">
                <strong>
                  {isTrial 
                    ? (isTrialCancelled ? 'Trial (Cancelled)' : 'Free Trial Active')
                    : isPremium 
                      ? 'Premium Active' 
                      : 'Free Plan'
                  }
                </strong>
                <span>
                  {isTrial 
                    ? `${daysRemaining} days remaining`
                    : isPremium 
                      ? 'All features unlocked'
                      : 'Limited features'
                  }
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Free Trial CTA */}
        {!isTrial && !isPremium && (
          <div className="trial-cta">
            <h2>🎉 Start Your Free Trial</h2>
            <p>Try all premium features for 5 days - no credit card required!</p>
            <button 
              className="trial-button"
              onClick={handleStartTrial}
              disabled={loading}
            >
              {loading ? 'Starting Trial...' : 'Start 5-Day Free Trial'}
            </button>
          </div>
        )}

        {/* Plans Grid */}
        <div className="plans-grid">
          {plans.map((plan) => {
            const planStatus = getPlanStatus(plan);
            const isCurrentPlan = planStatus === 'current';
            const isTrialPlan = planStatus === 'trial';
            
            return (
              <div 
                key={plan.id} 
                className={`plan-card ${isCurrentPlan ? 'current' : ''} ${plan.popular ? 'popular' : ''}`}
              >
                {plan.popular && <div className="popular-badge">Most Popular</div>}
                {isCurrentPlan && <div className="current-badge">Current Plan</div>}
                {isTrialPlan && <div className="trial-badge">Trial Active</div>}
                
                <div className="plan-header-content">
                  <h3>{plan.name}</h3>
                  <div className="plan-price">
                    <span className="price">${plan.price}</span>
                    <span className="interval">/{plan.interval}</span>
                  </div>
                  <p className="plan-description">{plan.description}</p>
                </div>
                
                <div className="plan-features">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <span className="feature-check">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <button
                  className={`plan-button ${isCurrentPlan ? 'current' : 'primary'}`}
                  onClick={() => handleSelectPlan(plan.stripePriceId, plan.name)}
                  disabled={isPlanDisabled(plan)}
                >
                  {loading ? 'Processing...' : getPlanButtonText(plan)}
                </button>
              </div>
            );
          })}
        </div>

        {/* Billing Management */}
        {(isPremium || isTrial) && (
          <div className="billing-management">
            <h3>Need to manage your billing?</h3>
            <p>Update payment methods, view invoices, or cancel your subscription.</p>
            <button 
              className="billing-button"
              onClick={() => navigate('/account/billing')}
            >
              Manage Billing
            </button>
          </div>
        )}

        {/* Security Features Preview */}
        <div className="features-preview">
          <h2>🛡️ What You Get With Premium</h2>
          <div className="features-grid">
            <div className="feature-preview">
              <div className="feature-icon">🔍</div>
              <h4>Complete Security Scans</h4>
              <p>Scan 400+ data broker sites and remove your information</p>
            </div>
            <div className="feature-preview">
              <div className="feature-icon">👁️</div>
              <h4>24/7 Identity Monitoring</h4>
              <p>Real-time alerts when your data appears online</p>
            </div>
            <div className="feature-preview">
              <div className="feature-icon">🔐</div>
              <h4>Advanced Password Security</h4>
              <p>Monitor breaches and secure your accounts</p>
            </div>
            <div className="feature-preview">
              <div className="feature-icon">🌐</div>
              <h4>VPN Protection</h4>
              <p>Secure browsing with military-grade encryption</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePlan;