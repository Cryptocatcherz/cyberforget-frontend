import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuthUtils';
import planService from '../services/planService';
import './OnboardingBanner.css';

const OnboardingBanner = () => {
  const { user } = useAuth();
  const [showBanner, setShowBanner] = useState(false);
  const [planData, setPlanData] = useState(null);
  const [profileCompletion, setProfileCompletion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkOnboardingStatus();
    }
  }, [user]);

  const checkOnboardingStatus = async () => {
    try {
      setLoading(true);
      
      // Get current plan and profile status
      const currentPlan = await planService.getCurrentPlan();
      setPlanData(currentPlan);
      
      // Check if user needs to complete profile for trial/premium access
      const needsProfileCompletion = currentPlan.accessControl.redirectToEditInfo;
      const isTrialOrPremium = ['TRIAL', 'PREMIUM', 'ENTERPRISE'].includes(currentPlan.plan.current);
      
      // Show banner if user is on trial/premium but hasn't completed profile
      if (needsProfileCompletion && isTrialOrPremium) {
        setShowBanner(true);
        setProfileCompletion(currentPlan.profile.completion);
      }
      
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProfile = () => {
    window.location.href = '/edit-info';
  };

  const handleDismiss = () => {
    setShowBanner(false);
    // Set a temporary dismiss flag (you might want to persist this)
    sessionStorage.setItem('onboarding-banner-dismissed', 'true');
  };

  // Don't show if loading, no user, or banner was dismissed
  if (loading || !user || !showBanner) {
    return null;
  }

  // Check if banner was dismissed this session
  if (sessionStorage.getItem('onboarding-banner-dismissed')) {
    return null;
  }

  const completionPercentage = profileCompletion?.completionPercentage || 0;
  const trialDaysRemaining = planService.getTrialDaysRemaining(planData);

  return (
    <div className="onboarding-banner">
      <div className="banner-content">
        <div className="banner-icon">
          <div className="profile-icon">👤</div>
          <div className="completion-badge">{completionPercentage}%</div>
        </div>
        
        <div className="banner-message">
          <h4>Complete Your Profile to Start Scanning</h4>
          <p>
            {planData.plan.current === 'TRIAL' && trialDaysRemaining > 0 ? (
              <>Your {trialDaysRemaining}-day trial is active! Complete your profile to start scanning 500+ data broker sites.</>
            ) : planData.plan.current === 'PREMIUM' ? (
              <>Your Premium subscription is active! Complete your profile to access all features.</>
            ) : (
              <>Complete your profile information to start using all available features.</>
            )}
          </p>
          
          {profileCompletion && (
            <div className="completion-details">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <div className="missing-fields">
                {profileCompletion.missingRequired.length > 0 && (
                  <span className="required-fields">
                    Missing required: {profileCompletion.missingRequired.join(', ')}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="banner-actions">
          <button 
            className="btn btn-primary"
            onClick={handleCompleteProfile}
          >
            Complete Profile
          </button>
          <button 
            className="btn btn-ghost"
            onClick={handleDismiss}
          >
            Dismiss
          </button>
        </div>
      </div>
      
      {planData.plan.current === 'TRIAL' && trialDaysRemaining > 0 && (
        <div className="trial-indicator">
          <span className="trial-badge">
            {trialDaysRemaining} day{trialDaysRemaining !== 1 ? 's' : ''} left in trial
          </span>
        </div>
      )}
    </div>
  );
};

export default OnboardingBanner;