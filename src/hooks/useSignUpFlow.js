import { useState, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';

const useSignUpFlow = () => {
  const { isSignedIn, isLoaded } = useUser();
  const [signUpModal, setSignUpModal] = useState({
    isOpen: false,
    trigger: 'premium_feature',
    featureName: 'advanced security tools'
  });

  // Check if user should see signup triggers
  const shouldShowSignUpTriggers = useCallback(() => {
    if (!isLoaded) return false;
    return !isSignedIn;
  }, [isSignedIn, isLoaded]);

  // Open signup modal with specific trigger
  const openSignUpModal = useCallback((trigger = 'premium_feature', featureName = 'advanced security tools') => {
    if (shouldShowSignUpTriggers()) {
      setSignUpModal({
        isOpen: true,
        trigger,
        featureName
      });
      return true;
    }
    return false;
  }, [shouldShowSignUpTriggers]);

  // Close signup modal
  const closeSignUpModal = useCallback(() => {
    setSignUpModal(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  // Check if message should trigger signup
  const checkForSignUpTriggers = useCallback((messageContent) => {
    if (!shouldShowSignUpTriggers()) return null;

    const content = messageContent.toLowerCase();
    
    // Premium feature triggers
    const premiumKeywords = [
      'premium', 'upgrade', 'advanced', 'unlimited', 'full access',
      'comprehensive scan', 'detailed report', 'priority support'
    ];
    
    // Data removal triggers
    const dataRemovalKeywords = [
      'data removal', 'remove data', 'delete information', 'data brokers',
      'opt out', 'privacy removal', 'erase data'
    ];
    
    // VPN triggers
    const vpnKeywords = [
      'vpn', 'virtual private network', 'secure connection', 'hide ip',
      'encrypted connection', 'bypass restrictions'
    ];
    
    // Monitoring triggers
    const monitoringKeywords = [
      'monitoring', 'alerts', 'notifications', '24/7', 'real-time',
      'continuous protection', 'threat detection'
    ];
    
    // Scan limit triggers
    const scanLimitKeywords = [
      'scan limit', 'more scans', 'unlimited scans', 'scan quota',
      'additional scans', 'scan more'
    ];

    // Check for matches and return appropriate trigger
    if (dataRemovalKeywords.some(keyword => content.includes(keyword))) {
      return {
        trigger: 'data_removal',
        featureName: 'data removal service'
      };
    }
    
    if (vpnKeywords.some(keyword => content.includes(keyword))) {
      return {
        trigger: 'vpn_access',
        featureName: 'VPN protection'
      };
    }
    
    if (monitoringKeywords.some(keyword => content.includes(keyword))) {
      return {
        trigger: 'monitoring',
        featureName: '24/7 identity monitoring'
      };
    }
    
    if (scanLimitKeywords.some(keyword => content.includes(keyword))) {
      return {
        trigger: 'scan_limits',
        featureName: 'unlimited scanning'
      };
    }
    
    if (premiumKeywords.some(keyword => content.includes(keyword))) {
      return {
        trigger: 'premium_feature',
        featureName: 'premium features'
      };
    }

    return null;
  }, [shouldShowSignUpTriggers]);

  // Auto-trigger signup based on message content
  const autoTriggerSignUp = useCallback((messageContent) => {
    const triggerData = checkForSignUpTriggers(messageContent);
    if (triggerData) {
      openSignUpModal(triggerData.trigger, triggerData.featureName);
      return true;
    }
    return false;
  }, [checkForSignUpTriggers, openSignUpModal]);

  // Check if specific feature requires signup
  const requiresSignUp = useCallback((feature) => {
    if (!shouldShowSignUpTriggers()) return false;

    const premiumFeatures = [
      'comprehensive_scan',
      'data_removal',
      'vpn_access',
      'monitoring',
      'unlimited_scans',
      'detailed_reports',
      'priority_support',
      'advanced_tools'
    ];

    return premiumFeatures.includes(feature);
  }, [shouldShowSignUpTriggers]);

  // Get signup trigger for specific feature
  const getFeatureSignUpTrigger = useCallback((feature) => {
    const featureMap = {
      'comprehensive_scan': { trigger: 'premium_feature', name: 'comprehensive scanning' },
      'data_removal': { trigger: 'data_removal', name: 'data removal service' },
      'vpn_access': { trigger: 'vpn_access', name: 'VPN protection' },
      'monitoring': { trigger: 'monitoring', name: '24/7 monitoring' },
      'unlimited_scans': { trigger: 'scan_limits', name: 'unlimited scans' },
      'detailed_reports': { trigger: 'premium_feature', name: 'detailed reports' },
      'priority_support': { trigger: 'premium_feature', name: 'priority support' },
      'advanced_tools': { trigger: 'premium_feature', name: 'advanced security tools' }
    };

    return featureMap[feature] || { trigger: 'premium_feature', name: 'premium features' };
  }, []);

  return {
    // State
    signUpModal,
    shouldShowSignUpTriggers: shouldShowSignUpTriggers(),
    isSignedIn,
    isLoaded,
    
    // Actions
    openSignUpModal,
    closeSignUpModal,
    autoTriggerSignUp,
    checkForSignUpTriggers,
    requiresSignUp,
    getFeatureSignUpTrigger
  };
};

export default useSignUpFlow;