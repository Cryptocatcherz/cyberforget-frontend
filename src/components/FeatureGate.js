import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuthUtils';
import api from '../services/apiService';
import PremiumModal from './PremiumModal';
import LoadingSpinner from './LoadingSpinner';
import Navbar from './Navbar';
import MobileNavbar from './MobileNavbar';
import './FeatureGate.css';

const FeatureGate = ({ 
  children, 
  feature, 
  fallback, 
  showUpgradeModal = true,
  customUpgradeContent = null,
  showNavbar = true
}) => {
  const { user } = useAuth();
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (user) {
      checkFeatureAccess();
    } else {
      setLoading(false);
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
    const loginContent = (
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

    return showNavbar ? (
      <div className="page-container">
        {isMobile ? <MobileNavbar /> : <Navbar />}
        {loginContent}
      </div>
    ) : loginContent;
  }

  if (!hasAccess) {
    // Check if user needs to complete profile
    if (planData?.accessControl?.redirectToEditInfo) {
      const profileContent = (
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

      return showNavbar ? (
        <div className="page-container">
          {isMobile ? <MobileNavbar /> : <Navbar />}
          {profileContent}
        </div>
      ) : profileContent;
    }

    // Show upgrade prompt
    if (fallback) {
      return fallback;
    }

    const upgradeContent = (
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

    return showNavbar ? (
      <div className="page-container">
        {isMobile ? <MobileNavbar /> : <Navbar />}
        {upgradeContent}
      </div>
    ) : upgradeContent;
  }

  // User has access, render children
  return children;
};

export default FeatureGate;