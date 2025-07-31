import api from './apiService';

class PlanService {
  constructor() {
    this.planData = null;
    this.lastFetch = null;
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Get current user's plan information
   */
  async getCurrentPlan(forceRefresh = false) {
    try {
      // Use cached data if available and fresh
      if (!forceRefresh && this.planData && this.lastFetch && 
          (Date.now() - this.lastFetch < this.cacheTimeout)) {
        return this.planData;
      }

      const response = await api.get('/plans/current');
      this.planData = response.data.data;
      this.lastFetch = Date.now();
      
      return this.planData;
    } catch (error) {
      console.error('Error fetching current plan:', error);
      throw error;
    }
  }

  /**
   * Check if user has access to a specific feature
   */
  async checkFeatureAccess(feature) {
    try {
      const response = await api.get(`/plans/feature/${feature}/access`);
      return response.data.data;
    } catch (error) {
      console.error(`Error checking access for feature ${feature}:`, error);
      return { hasAccess: false, upgradeRequired: true };
    }
  }

  /**
   * Check trial eligibility
   */
  async checkTrialEligibility() {
    try {
      const response = await api.post('/plans/trial/check-eligibility');
      return response.data.data;
    } catch (error) {
      console.error('Error checking trial eligibility:', error);
      throw error;
    }
  }

  /**
   * Get all available plans
   */
  async getAvailablePlans() {
    try {
      const response = await api.get('/plans/available');
      return response.data.data.plans;
    } catch (error) {
      console.error('Error fetching available plans:', error);
      throw error;
    }
  }

  /**
   * Check if user needs to complete profile for plan access
   */
  async checkProfileRequirement() {
    try {
      const planData = await this.getCurrentPlan();
      return {
        needsCompletion: planData.accessControl.redirectToEditInfo,
        completion: planData.profile.completion
      };
    } catch (error) {
      console.error('Error checking profile requirement:', error);
      return { needsCompletion: false, completion: null };
    }
  }

  /**
   * Get upgrade suggestions based on current plan
   */
  getUpgradeSuggestions(currentPlan) {
    const suggestions = {
      FREE: [
        'Upgrade to Premium for 500+ data broker sites',
        'Get automated hourly scans',
        'Access real-time threat alerts',
        'Unlock ad blocker and VPN features'
      ],
      TRIAL: [
        'Continue with Premium to keep all features',
        'Maintain access to 500+ data broker sites',
        'Keep automated scanning active',
        'Retain ad blocker and VPN access'
      ],
      EXPIRED: [
        'Reactivate Premium to restore all features',
        'Resume automated security monitoring',
        'Get back your ad blocker and VPN',
        'Continue protection from 500+ sites'
      ]
    };

    return suggestions[currentPlan] || suggestions.FREE;
  }

  /**
   * Get plan-specific feature list
   */
  getPlanFeatures(planType) {
    const features = {
      FREE: [
        'Basic email breach check',
        '50+ data broker sites',
        'Password security check',
        'Manual scans only'
      ],
      TRIAL: [
        'All premium features for 7 days',
        '500+ data broker sites',
        'Automated hourly scans',
        'Dark web monitoring',
        'Real-time alerts',
        'Ad blocker & tracker protection',
        'Secure VPN connection',
        'Live security reports'
      ],
      PREMIUM: [
        'All trial features permanently',
        'Priority customer support',
        'Unlimited scans',
        'Advanced threat detection',
        'Custom security reports'
      ],
      ENTERPRISE: [
        'All premium features',
        'API access',
        '1000+ data broker sites',
        'Multi-user support',
        'Custom integrations',
        'Dedicated account manager'
      ]
    };

    return features[planType] || features.FREE;
  }

  /**
   * Check if user should see upgrade prompts
   */
  shouldShowUpgradePrompts(planData) {
    if (!planData) return true;
    
    return planData.accessControl.showUpgradePrompts;
  }

  /**
   * Get days remaining in trial
   */
  getTrialDaysRemaining(planData) {
    if (!planData || !planData.plan.trialEndsAt) return null;
    
    const trialEnd = new Date(planData.plan.trialEndsAt);
    const now = new Date();
    const diffTime = trialEnd - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  }

  /**
   * Clear cached plan data
   */
  clearCache() {
    this.planData = null;
    this.lastFetch = null;
  }

  /**
   * Check if feature is premium-only
   */
  isPremiumFeature(feature) {
    const premiumFeatures = [
      'automatedScans',
      'darkWebMonitoring',
      'realTimeAlerts',
      'adBlocker',
      'vpn',
      'liveReports',
      'prioritySupport',
      'apiAccess'
    ];
    
    return premiumFeatures.includes(feature);
  }

  /**
   * Get plan status badge info
   */
  getPlanBadge(planType, isTrialExpired = false) {
    if (isTrialExpired) {
      return {
        text: 'Trial Expired',
        class: 'badge-expired',
        color: '#e74c3c'
      };
    }

    const badges = {
      FREE: { text: 'Free', class: 'badge-free', color: '#95a5a6' },
      TRIAL: { text: 'Trial', class: 'badge-trial', color: '#f39c12' },
      PREMIUM: { text: 'Premium', class: 'badge-premium', color: '#9b59b6' },
      ENTERPRISE: { text: 'Enterprise', class: 'badge-enterprise', color: '#2c3e50' }
    };

    return badges[planType] || badges.FREE;
  }
}

export default new PlanService();