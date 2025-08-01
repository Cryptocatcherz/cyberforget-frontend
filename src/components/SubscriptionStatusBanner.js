import React from 'react';
import { useNavigate } from 'react-router-dom';
import useSubscription from '../hooks/useSubscription';
import './SubscriptionStatusBanner.css';

const SubscriptionStatusBanner = () => {
  const navigate = useNavigate();
  const { 
    isPastDue, 
    isCancelled, 
    isTrialEndedUnpaid, 
    isTrial, 
    daysRemaining,
    cancelAtPeriodEnd 
  } = useSubscription();

  // Don't show banner for active premium users
  if (!isPastDue && !isTrialEndedUnpaid && !cancelAtPeriodEnd && (!isTrial || daysRemaining > 3)) {
    return null;
  }

  const getBannerConfig = () => {
    if (isPastDue) {
      return {
        type: 'error',
        icon: '⚠️',
        title: 'Payment Failed',
        message: 'Your subscription payment failed. Update your payment method to continue.',
        action: 'Update Payment',
        actionRoute: '/account/billing'
      };
    }

    if (isTrialEndedUnpaid) {
      return {
        type: 'warning',
        icon: '❌',
        title: 'Trial Ended',
        message: 'Your free trial has ended. Subscribe to continue using premium features.',
        action: 'Subscribe Now',
        actionRoute: '/pricing'
      };
    }

    if (cancelAtPeriodEnd) {
      return {
        type: 'info',
        icon: 'ℹ️',
        title: 'Subscription Ending',
        message: 'Your subscription will not renew at the end of your billing period.',
        action: 'Reactivate',
        actionRoute: '/account/billing'
      };
    }

    if (isTrial && daysRemaining <= 3) {
      return {
        type: 'info',
        icon: '⏰',
        title: `Trial Ending Soon`,
        message: `Your free trial expires in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}. Add payment to continue.`,
        action: 'Add Payment',
        actionRoute: '/account/billing'
      };
    }

    return null;
  };

  const config = getBannerConfig();
  if (!config) return null;

  return (
    <div className={`subscription-status-banner ${config.type}`}>
      <div className="banner-content">
        <span className="banner-icon">{config.icon}</span>
        <div className="banner-text">
          <strong>{config.title}</strong>
          <span>{config.message}</span>
        </div>
        <button 
          className="banner-action"
          onClick={() => navigate(config.actionRoute)}
        >
          {config.action}
        </button>
      </div>
    </div>
  );
};

export default SubscriptionStatusBanner;