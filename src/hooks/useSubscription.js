/**
 * Subscription access control hook
 * Provides centralized subscription logic and feature gating
 */

import { useMemo } from 'react';
import { useAuth } from './useAuthUtils';

// Subscription plan definitions
const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  TRIAL: 'trial', 
  TRIALING: 'trialing',
  PREMIUM: 'premium',
  ACTIVE: 'active',
  PAST_DUE: 'past_due',
  CANCELLED: 'cancelled',
  UNPAID: 'unpaid',
  INCOMPLETE: 'incomplete'
};

// Feature definitions with required subscription levels
const FEATURE_ACCESS = {
  // Basic features - available to all
  CHAT: ['free', 'trial', 'trialing', 'premium', 'active'],
  BASIC_SCAN: ['trial', 'trialing', 'premium', 'active'],
  PROFILE_EDIT: ['free', 'trial', 'trialing', 'premium', 'active'],
  
  // Premium features - require active subscription or trial
  ADVANCED_SCAN: ['trial', 'trialing', 'premium', 'active'],
  DATA_REMOVAL: ['premium', 'active'],
  LIVE_MONITORING: ['trial', 'trialing', 'premium', 'active'],
  CUSTOM_REPORTS: ['trial', 'trialing', 'premium', 'active'],
  PRIORITY_SUPPORT: ['premium', 'active'],
  
  // Trial features - available during trial
  TRIAL_SCAN: ['trial', 'trialing', 'premium', 'active']
};

// Trial configuration (should match Stripe configuration)
const TRIAL_CONFIG = {
  DURATION_DAYS: 5, // Updated to match your requirement: 5 days trial
  MAX_SCANS: 3,
  MAX_REPORTS: 5
};

export const useSubscription = () => {
  const { user } = useAuth();

  // Calculate subscription status and trial info
  const subscriptionInfo = useMemo(() => {
    if (!user) {
      return {
        status: SUBSCRIPTION_PLANS.FREE,
        isPremium: false,
        isTrial: false,
        isExpired: false,
        daysRemaining: 0,
        trialEndsAt: null
      };
    }

    const status = user.subscriptionStatus || SUBSCRIPTION_PLANS.FREE;
    const memberSince = user.memberSince ? new Date(user.memberSince) : new Date();
    const now = new Date();
    const daysSinceMember = Math.floor((now - memberSince) / (1000 * 60 * 60 * 24));
    
    // Check if user is in trial period
    // Consider users in trial if they have trial/trialing status from Stripe
    // OR if they have days remaining (for development/fallback)
    let isTrial = status === SUBSCRIPTION_PLANS.TRIAL || status === SUBSCRIPTION_PLANS.TRIALING;
    
    // Fallback: If user has subscriptionPeriodEnd and days remaining, consider them trial
    if (!isTrial && user.subscriptionPeriodEnd && daysSinceMember <= TRIAL_CONFIG.DURATION_DAYS) {
      const trialEndDate = new Date(user.subscriptionPeriodEnd);
      const timeRemaining = trialEndDate.getTime() - now.getTime();
      if (timeRemaining > 0) {
        isTrial = true;
      }
    }
    
    const isPremium = status === SUBSCRIPTION_PLANS.PREMIUM || status === SUBSCRIPTION_PLANS.ACTIVE;
    const isExpired = status === SUBSCRIPTION_PLANS.PAST_DUE || 
                     status === SUBSCRIPTION_PLANS.CANCELLED ||
                     status === SUBSCRIPTION_PLANS.UNPAID;
    const isPastDue = status === SUBSCRIPTION_PLANS.PAST_DUE || status === SUBSCRIPTION_PLANS.UNPAID;
    const isCancelled = status === SUBSCRIPTION_PLANS.CANCELLED;
    
    // Check if trial is cancelled (still in trial but will end)
    const isTrialCancelled = isTrial && (user.publicMetadata?.trialCancelled || user.publicMetadata?.cancelAtPeriodEnd);
    
    // Check if trial ended without payment
    const isTrialEndedUnpaid = !isTrial && !isPremium && daysSinceMember > TRIAL_CONFIG.DURATION_DAYS;
    
    // Calculate trial end date and remaining days only for actual trials
    let trialEndsAt = null;
    let daysRemaining = 0;
    
    if (isTrial) {
      if (user.subscriptionPeriodEnd) {
        // Use the actual trial end date from Stripe
        trialEndsAt = new Date(user.subscriptionPeriodEnd);
        const timeRemaining = trialEndsAt.getTime() - now.getTime();
        daysRemaining = Math.max(0, Math.ceil(timeRemaining / (1000 * 60 * 60 * 24)));
      } else {
        // Fallback: Calculate based on member since date + trial duration
        trialEndsAt = new Date(memberSince.getTime() + (TRIAL_CONFIG.DURATION_DAYS * 24 * 60 * 60 * 1000));
        const timeRemaining = trialEndsAt.getTime() - now.getTime();
        daysRemaining = Math.max(0, Math.ceil(timeRemaining / (1000 * 60 * 60 * 24)));
      }
    }

    return {
      status,
      isPremium,
      isTrial,
      isExpired,
      isPastDue,
      isCancelled,
      isTrialEndedUnpaid,
      isTrialCancelled,
      daysRemaining,
      trialEndsAt,
      daysSinceMember,
      cancelAtPeriodEnd: user.publicMetadata?.cancelAtPeriodEnd || false,
      paymentFailed: user.publicMetadata?.paymentFailed || false,
      trialCancelledAt: user.publicMetadata?.trialCancelledAt ? new Date(user.publicMetadata.trialCancelledAt) : null
    };
  }, [user]);

  // Feature access checker
  const hasFeatureAccess = (feature) => {
    const requiredPlans = FEATURE_ACCESS[feature];
    if (!requiredPlans) return false;
    
    return requiredPlans.includes(subscriptionInfo.status.toLowerCase());
  };

  // Trial usage tracking (would need backend integration)
  const trialUsage = useMemo(() => {
    // This would normally come from backend API
    // For now, using localStorage as mock
    const storedUsage = JSON.parse(localStorage.getItem(`trial_usage_${user?.id}`) || '{}');
    
    return {
      scansUsed: storedUsage.scansUsed || 0,
      reportsGenerated: storedUsage.reportsGenerated || 0,
      maxScans: TRIAL_CONFIG.MAX_SCANS,
      maxReports: TRIAL_CONFIG.MAX_REPORTS
    };
  }, [user?.id]);

  // Update trial usage
  const updateTrialUsage = (type, increment = 1) => {
    if (!user?.id || !subscriptionInfo.isTrial) return;
    
    const currentUsage = JSON.parse(localStorage.getItem(`trial_usage_${user.id}`) || '{}');
    const newUsage = {
      ...currentUsage,
      [type]: (currentUsage[type] || 0) + increment
    };
    
    localStorage.setItem(`trial_usage_${user.id}`, JSON.stringify(newUsage));
  };

  // Check if trial limits are exceeded
  const isTrialLimitExceeded = (feature) => {
    if (!subscriptionInfo.isTrial) return false;
    
    switch (feature) {
      case 'SCAN':
        return trialUsage.scansUsed >= trialUsage.maxScans;
      case 'REPORT':
        return trialUsage.reportsGenerated >= trialUsage.maxReports;
      default:
        return false;
    }
  };

  // Get upgrade prompt message based on context
  const getUpgradeMessage = (feature) => {
    // Payment failed - urgent message
    if (subscriptionInfo.isPastDue) {
      return '⚠️ Your payment failed. Please update your payment method to continue using premium features.';
    }
    
    // Trial cancelled but still active
    if (subscriptionInfo.isTrialCancelled) {
      return `⚠️ Your trial is cancelled. You have ${subscriptionInfo.daysRemaining} day(s) remaining to reactivate.`;
    }
    
    // Subscription cancelled but still active
    if (subscriptionInfo.isCancelled && subscriptionInfo.cancelAtPeriodEnd) {
      return 'Your subscription is cancelled and will end at the end of your billing period.';
    }
    
    // Trial ended without payment
    if (subscriptionInfo.isTrialEndedUnpaid) {
      return '❌ Your free trial has ended. Subscribe to continue using premium features.';
    }
    
    // Active trial
    if (subscriptionInfo.isTrial) {
      if (subscriptionInfo.daysRemaining > 0) {
        return `Your free trial expires in ${subscriptionInfo.daysRemaining} day(s). Upgrade to continue using premium features.`;
      } else {
        return 'Your free trial has expired. Upgrade to premium to continue using advanced features.';
      }
    }
    
    return 'This feature requires a premium subscription. Start your free trial to access advanced security tools.';
  };

  // Check if user should see paywall
  const shouldShowPaywall = (feature) => {
    if (!feature) {
      // General paywall check - show if not premium and trial expired
      return !subscriptionInfo.isPremium && (!subscriptionInfo.isTrial || subscriptionInfo.daysRemaining === 0);
    }
    
    // Feature-specific paywall
    return !hasFeatureAccess(feature) || isTrialLimitExceeded(feature);
  };

  return {
    // Subscription status
    ...subscriptionInfo,
    
    // Feature access
    hasFeatureAccess,
    shouldShowPaywall,
    
    // Trial management
    trialUsage,
    updateTrialUsage,
    isTrialLimitExceeded,
    
    // Utility functions
    getUpgradeMessage,
    
    // Constants
    SUBSCRIPTION_PLANS,
    FEATURE_ACCESS,
    TRIAL_CONFIG
  };
};

export default useSubscription;