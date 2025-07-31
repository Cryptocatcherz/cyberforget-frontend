import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuthUtils';
import api from '../services/apiService';
import PremiumModal from './PremiumModal';
import LoadingSpinner from './LoadingSpinner';
import './FeatureGate.css';

const FeatureGate = ({ 
  children, 
  feature, 
  fallback, 
  showUpgradeModal = true,
  customUpgradeContent = null 
}) => {
  const { user } = useAuth();
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (user) {
      checkFeatureAccess();
    }
  }, [user, feature]);

  const checkFeatureAccess = async () => {
    try {
      setLoading(true);
      
      // Get current plan information
      const planResponse = await api.get('/plans/current');
      const currentPlan = planResponse.data.data;
      setPlanData(currentPlan);

      // Check specific feature access
      if (feature) {
        const featureResponse = await api.get(`/plans/feature/${feature}/access`);
        setHasAccess(featureResponse.data.data.hasAccess);
      } else {
        // If no specific feature, check if user has premium access
        setHasAccess(currentPlan.accessControl.canAccessPremiumFeatures);
      }

    } catch (error) {
      console.error('Error checking feature access:', error);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeClick = () => {
    if (showUpgradeModal) {
      setShowModal(true);
    } else {
      // Redirect to pricing page
      window.location.href = '/pricing';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="feature-gate-login">
        <div className="feature-gate-content">
          <h3>Sign In Required</h3>
          <p>Please sign in to access this feature.</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/login'}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    // Check if user needs to complete profile
    if (planData?.accessControl?.redirectToEditInfo) {
      return (
        <div className="feature-gate-profile">
          <div className="feature-gate-content">
            <h3>Complete Your Profile</h3>
            <p>Please complete your profile information to start using this feature.</p>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.href = '/edit-info'}
            >
              Complete Profile
            </button>
          </div>
        </div>
      );
    }

    // Show upgrade prompt
    if (fallback) {
      return fallback;
    }

    return (
      <div className="feature-gate-upgrade">
        <div className="feature-gate-content">
          {customUpgradeContent || (
            <>
              <div className="feature-gate-icon">🔒</div>
              <h3>Premium Feature</h3>
              <p>
                This feature is available on our Premium and Enterprise plans. 
                Upgrade now to unlock advanced security features.
              </p>
              <div className="feature-gate-benefits">
                <div className="benefit-item">
                  <span className="benefit-icon">✅</span>
                  <span>500+ Data Broker Sites</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">✅</span>
                  <span>Automated Hourly Scans</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">✅</span>
                  <span>Real-time Alerts</span>
                </div>
                {feature === 'adBlocker' && (
                  <div className="benefit-item">
                    <span className="benefit-icon">✅</span>
                    <span>Ad Blocker & Tracker Protection</span>
                  </div>
                )}
                {feature === 'vpn' && (
                  <div className="benefit-item">
                    <span className="benefit-icon">✅</span>
                    <span>Secure VPN Connection</span>
                  </div>
                )}
                {feature === 'liveReports' && (
                  <div className="benefit-item">
                    <span className="benefit-icon">✅</span>
                    <span>Live Security Reports</span>
                  </div>
                )}
                {feature === 'dataRemoval' && (
                  <div className="benefit-item">
                    <span className="benefit-icon">✅</span>
                    <span>Data Removal Dashboard</span>
                  </div>
                )}
              </div>
              <button 
                className="btn btn-premium"
                onClick={handleUpgradeClick}
              >
                Upgrade to Premium
              </button>
              {planData?.plan?.isTrialExpired && (
                <p className="trial-expired-note">
                  Your trial has expired. Upgrade to continue using premium features.
                </p>
              )}
            </>
          )}
        </div>
        
        {showModal && (
          <PremiumModal 
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            feature={feature}
            currentPlan={planData?.plan?.current}
          />
        )}
      </div>
    );
  }

  // User has access, render children
  return children;
};

export default FeatureGate;