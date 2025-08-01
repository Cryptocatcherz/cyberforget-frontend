import React from 'react';
import { useNavigate } from 'react-router-dom';
import useSubscription from '../hooks/useSubscription';
import './TrialStatusCard.css';

const TrialStatusCard = () => {
  const navigate = useNavigate();
  const { 
    isTrial, 
    isTrialCancelled, 
    daysRemaining, 
    trialEndsAt,
    trialCancelledAt 
  } = useSubscription();

  // Only show for trial users
  if (!isTrial) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeAgo = (date) => {
    const hours = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'just now';
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };

  return (
    <div className={`trial-status-card ${isTrialCancelled ? 'cancelled' : 'active'}`}>
      <div className="trial-header">
        <div className="trial-badge">
          {isTrialCancelled ? '❌ Trial Cancelled' : '🚀 Free Trial'}
        </div>
        <div className="trial-days">
          {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left
        </div>
      </div>

      <div className="trial-content">
        {isTrialCancelled ? (
          <>
            <h3>Your trial has been cancelled</h3>
            <p className="trial-warning">
              You cancelled your trial {trialCancelledAt && getTimeAgo(trialCancelledAt)}.
              Premium features will be disabled on {formatDate(trialEndsAt)}.
            </p>
            <div className="trial-info">
              <div className="info-item">
                <span className="info-icon">⏰</span>
                <span>Access ends: {formatDate(trialEndsAt)}</span>
              </div>
              <div className="info-item">
                <span className="info-icon">💡</span>
                <span>You can reactivate anytime before trial ends</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <h3>You're in your free trial</h3>
            <p>
              Enjoy full access to all premium features. 
              Add payment method before {formatDate(trialEndsAt)} to continue.
            </p>
            <div className="trial-features">
              <div className="feature-item">✅ All Premium Features</div>
              <div className="feature-item">✅ No Credit Card Required</div>
              <div className="feature-item">✅ Cancel Anytime</div>
            </div>
          </>
        )}
      </div>

      <div className="trial-actions">
        {isTrialCancelled ? (
          <>
            <button 
              className="btn-primary"
              onClick={() => navigate('/account/billing?action=reactivate')}
            >
              Reactivate Trial
            </button>
            <button 
              className="btn-secondary"
              onClick={() => navigate('/pricing')}
            >
              View Plans
            </button>
          </>
        ) : (
          <>
            <button 
              className="btn-primary"
              onClick={() => navigate('/account/billing')}
            >
              Add Payment Method
            </button>
            <button 
              className="btn-secondary"
              onClick={() => navigate('/account/billing?action=cancel')}
            >
              Cancel Trial
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TrialStatusCard;