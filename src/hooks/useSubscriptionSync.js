/**
 * Subscription Synchronization Hook
 * Handles real-time subscription status updates from Clerk
 */

import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useAuth } from './useAuthUtils';

export const useSubscriptionSync = () => {
  const { user: clerkUser, isLoaded } = useUser();
  const { user, setUser } = useAuth();
  const lastStatusRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  // Poll for subscription status changes
  useEffect(() => {
    if (!isLoaded || !clerkUser) return;

    const checkSubscriptionStatus = async () => {
      try {
        // Get fresh user data from Clerk
        await clerkUser.reload();
        
        const currentStatus = clerkUser.publicMetadata?.subscriptionStatus || 'free';
        const lastKnownStatus = lastStatusRef.current;

        // Check if subscription status has changed
        if (currentStatus !== lastKnownStatus) {
          console.log('[SubscriptionSync] Status change detected:', {
            from: lastKnownStatus,
            to: currentStatus,
            timestamp: new Date().toISOString()
          });

          // Update local user state
          if (setUser && user) {
            setUser(prevUser => ({
              ...prevUser,
              subscriptionStatus: currentStatus,
              // Also update other subscription metadata
              stripeCustomerId: clerkUser.publicMetadata?.stripeCustomerId,
              stripeSubscriptionId: clerkUser.publicMetadata?.stripeSubscriptionId,
              subscriptionPeriodEnd: clerkUser.publicMetadata?.subscriptionPeriodEnd,
              cancelAtPeriodEnd: clerkUser.publicMetadata?.cancelAtPeriodEnd
            }));
          }

          // Update last known status
          lastStatusRef.current = currentStatus;

          // Trigger any subscription change handlers
          handleSubscriptionChange(currentStatus, lastKnownStatus);
        }
      } catch (error) {
        console.error('[SubscriptionSync] Error checking subscription status:', error);
      }
    };

    // Initial status check
    const initialStatus = clerkUser.publicMetadata?.subscriptionStatus || 'free';
    lastStatusRef.current = initialStatus;

    // Start polling every 30 seconds
    pollingIntervalRef.current = setInterval(checkSubscriptionStatus, 30000);

    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [isLoaded, clerkUser, setUser, user]);

  // Handle subscription status changes
  const handleSubscriptionChange = (newStatus, oldStatus) => {
    // Show notifications for important status changes
    switch (newStatus) {
      case 'premium':
        if (oldStatus === 'trial') {
          showSubscriptionNotification(
            'success',
            'Welcome to Premium!',
            'Your trial has been successfully converted to a premium subscription.'
          );
        } else if (oldStatus === 'past_due') {
          showSubscriptionNotification(
            'success',
            'Payment Successful',
            'Your subscription has been reactivated.'
          );
        }
        break;

      case 'trial':
        if (oldStatus === 'free') {
          showSubscriptionNotification(
            'info',
            'Trial Started',
            'Your 7-day free trial has begun. Enjoy premium features!'
          );
        }
        break;

      case 'past_due':
        showSubscriptionNotification(
          'warning',
          'Payment Issue',
          'There was an issue with your payment. Please update your payment method.'
        );
        break;

      case 'cancelled':
      case 'free':
        if (oldStatus !== 'free') {
          showSubscriptionNotification(
            'info',
            'Subscription Ended',
            'Your subscription has ended. You now have access to free features.'
          );
        }
        break;
    }

    // Refresh page data if needed
    if (shouldRefreshPageData(newStatus, oldStatus)) {
      window.location.reload();
    }
  };

  // Show notification to user
  const showSubscriptionNotification = (type, title, message) => {
    // You can integrate this with your notification system
    console.log(`[SubscriptionSync] ${type.toUpperCase()}: ${title} - ${message}`);
    
    // If you have a toast notification system, use it here
    // Example: toast[type](title, message);
    
    // Fallback to browser notification for important updates
    if (type === 'warning' || type === 'error') {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
          body: message,
          icon: '/favicon.ico'
        });
      }
    }
  };

  // Determine if page should refresh based on status change
  const shouldRefreshPageData = (newStatus, oldStatus) => {
    // Refresh when transitioning between access levels
    const accessChanges = [
      ['free', 'trial'],
      ['free', 'premium'],
      ['trial', 'premium'],
      ['premium', 'free'],
      ['premium', 'past_due'],
      ['trial', 'free'],
      ['past_due', 'premium']
    ];

    return accessChanges.some(([from, to]) => 
      oldStatus === from && newStatus === to
    );
  };

  // Manual sync function for immediate checking
  const syncNow = async () => {
    if (!clerkUser) return false;

    try {
      await clerkUser.reload();
      const currentStatus = clerkUser.publicMetadata?.subscriptionStatus || 'free';
      const lastKnownStatus = lastStatusRef.current;

      if (currentStatus !== lastKnownStatus) {
        lastStatusRef.current = currentStatus;
        handleSubscriptionChange(currentStatus, lastKnownStatus);
        return true; // Status changed
      }
      return false; // No change
    } catch (error) {
      console.error('[SubscriptionSync] Error in manual sync:', error);
      return false;
    }
  };

  return {
    syncNow,
    currentStatus: lastStatusRef.current
  };
};

export default useSubscriptionSync;