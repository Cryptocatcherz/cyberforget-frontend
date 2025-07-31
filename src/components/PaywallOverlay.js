/**
 * Paywall Overlay Component
 * Shows upgrade prompts and trial information
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaLock, 
  FaCrown, 
  FaRocket, 
  FaShieldAlt, 
  FaChartLine,
  FaClock,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import useSubscription from '../hooks/useSubscription';
import PremiumModal from './PremiumModal';
import './PaywallOverlay.css';

const PaywallOverlay = ({ 
  feature, 
  title, 
  description, 
  children,
  showBlur = true,
  variant = 'overlay' // 'overlay', 'modal', 'inline'
}) => {
  const { 
    shouldShowPaywall, 
    getUpgradeMessage, 
    isPremium, 
    isTrial, 
    daysRemaining,
    trialUsage,
    isTrialLimitExceeded
  } = useSubscription();
  
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Don't show paywall if user has access
  if (!shouldShowPaywall(feature)) {
    return children;
  }

  const handleStartTrial = (plan) => {
    // This would integrate with your payment service
    console.log('Starting trial:', plan);
    // For now, just close the modal
    setShowPremiumModal(false);
  };

  const getFeatureIcon = (feature) => {
    switch (feature) {
      case 'ADVANCED_SCAN': return FaRocket;
      case 'DATA_REMOVAL': return FaShieldAlt;
      case 'LIVE_MONITORING': return FaChartLine;
      case 'CUSTOM_REPORTS': return FaChartLine;
      default: return FaCrown;
    }
  };

  const getTrialStatusMessage = () => {
    if (isTrial && daysRemaining > 0) {
      return (
        <div className="trial-status active">
          <FaClock className="trial-icon" />
          <span>{daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left in trial</span>
        </div>
      );
    } else if (isTrial && daysRemaining === 0) {
      return (
        <div className="trial-status expired">
          <FaTimes className="trial-icon" />
          <span>Trial expired</span>
        </div>
      );
    } else {
      return (
        <div className="trial-status none">
          <FaRocket className="trial-icon" />
          <span>Start your free trial</span>
        </div>
      );
    }
  };

  const getTrialUsageInfo = () => {
    if (!isTrial) return null;

    return (
      <div className="trial-usage">
        <div className="usage-item">
          <span>Scans used:</span>
          <span>{trialUsage.scansUsed}/{trialUsage.maxScans}</span>
        </div>
        <div className="usage-item">
          <span>Reports:</span>
          <span>{trialUsage.reportsGenerated}/{trialUsage.maxReports}</span>
        </div>
      </div>
    );
  };

  const FeatureIcon = getFeatureIcon(feature);

  // Inline variant for smaller components
  if (variant === 'inline') {
    return (
      <div className="paywall-inline">
        <div className="paywall-content-small">
          <FaLock className="lock-icon" />
          <div className="paywall-text">
            <h4>{title || 'Premium Feature'}</h4>
            <p>{description || getUpgradeMessage(feature)}</p>
          </div>
          <button 
            className="upgrade-btn-small"
            onClick={() => setShowPremiumModal(true)}
          >
            Upgrade
          </button>
        </div>
        
        <PremiumModal 
          isOpen={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          // Always use the new seamless modal, ignore requestedFeature
          onStartTrial={handleStartTrial}
        />
      </div>
    );
  }

  // Modal variant
  if (variant === 'modal') {
    return (
      <>
        {children}
        <AnimatePresence>
          {shouldShowPaywall(feature) && (
            <motion.div
              className="paywall-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="paywall-modal"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="paywall-modal-content">
                  <FeatureIcon className="feature-icon-large" />
                  <h2>{title || 'Premium Feature Required'}</h2>
                  <p>{description || getUpgradeMessage(feature)}</p>
                  
                  {getTrialStatusMessage()}
                  {getTrialUsageInfo()}
                  
                  <div className="paywall-actions">
                    <button 
                      className="btn-upgrade-primary"
                      onClick={() => setShowPremiumModal(true)}
                    >
                      {isTrial ? 'Upgrade Now' : 'Start Free Trial'}
                    </button>
                    <button 
                      className="btn-upgrade-secondary"
                      onClick={() => window.history.back()}
                    >
                      Go Back
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <PremiumModal 
          isOpen={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          // Always use the new seamless modal, ignore requestedFeature
          onStartTrial={handleStartTrial}
        />
      </>
    );
  }

  // Default overlay variant
  return (
    <div className="paywall-wrapper">
      {/* Content with blur effect */}
      <div className={`paywall-children ${showBlur ? 'blurred' : ''}`}>
        {children}
      </div>
      
      {/* Overlay */}
      <div className="paywall-overlay">
        <motion.div 
          className="paywall-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="paywall-header">
            <FeatureIcon className="feature-icon" />
            <h2>{title || 'Premium Feature'}</h2>
            <p>{description || getUpgradeMessage(feature)}</p>
          </div>

          {getTrialStatusMessage()}
          {getTrialUsageInfo()}

          <div className="premium-benefits">
            <h3>
              <FaCrown className="crown-icon" />
              Premium Benefits
            </h3>
            <ul>
              <li><FaCheck /> Remove data from 200+ sites</li>
              <li><FaCheck /> 24/7 real-time monitoring</li>
              <li><FaCheck /> Advanced threat detection</li>
              <li><FaCheck /> Priority customer support</li>
            </ul>
          </div>

          <div className="paywall-actions">
            <button 
              className="btn-upgrade-primary"
              onClick={() => setShowPremiumModal(true)}
            >
              {isTrial && daysRemaining > 0 ? 'Upgrade Now' : 'Start Free Trial'}
            </button>
          </div>
        </motion.div>
      </div>

      <PremiumModal 
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        // Always use the new seamless modal, ignore requestedFeature
        onStartTrial={handleStartTrial}
      />
    </div>
  );
};

export default PaywallOverlay;