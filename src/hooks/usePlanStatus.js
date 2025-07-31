import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuthUtils';
import planService from '../services/planService';

const usePlanStatus = () => {
  const { user } = useAuth();
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlanData = useCallback(async (forceRefresh = false) => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await planService.getCurrentPlan(forceRefresh);
      setPlanData(data);
      
    } catch (err) {
      console.error('Error fetching plan data:', err);
      setError(err.message || 'Failed to fetch plan information');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPlanData();
  }, [fetchPlanData]);

  const checkFeatureAccess = async (feature) => {
    try {
      return await planService.checkFeatureAccess(feature);
    } catch (err) {
      console.error(`Error checking feature access for ${feature}:`, err);
      return { hasAccess: false, upgradeRequired: true };
    }
  };

  const refreshPlanData = () => {
    return fetchPlanData(true);
  };

  // Computed properties for easy access
  const computedValues = planData ? {
    currentPlan: planData.plan.current,
    isTrialExpired: planData.plan.isTrialExpired,
    hasActiveSubscription: planData.plan.hasActiveSubscription,
    canAccessPremiumFeatures: planData.accessControl.canAccessPremiumFeatures,
    needsProfileCompletion: planData.accessControl.redirectToEditInfo,
    shouldShowUpgradePrompts: planData.accessControl.showUpgradePrompts,
    trialDaysRemaining: planService.getTrialDaysRemaining(planData),
    planBadge: planService.getPlanBadge(planData.plan.current, planData.plan.isTrialExpired),
    profileCompletion: planData.profile.completion
  } : {};

  return {
    // Data
    planData,
    loading,
    error,
    
    // Computed values
    ...computedValues,
    
    // Methods
    checkFeatureAccess,
    refreshPlanData,
    
    // Plan service methods for convenience
    isPremiumFeature: planService.isPremiumFeature,
    getPlanFeatures: planService.getPlanFeatures,
    getUpgradeSuggestions: planService.getUpgradeSuggestions
  };
};

export default usePlanStatus;