import React from 'react';
import { motion } from 'framer-motion';
import './SignUpTrigger.css';

const SignUpTrigger = ({ 
  trigger = 'premium_feature',
  featureName = 'advanced security tools',
  onSignUpClick,
  className = ''
}) => {
  const getTriggerConfig = () => {
    switch (trigger) {
      case 'premium_feature':
        return {
          icon: '🔒',
          title: 'Premium Feature',
          message: `Unlock ${featureName} with CyberForget Premium`,
          buttonText: 'Upgrade Now',
          gradient: 'linear-gradient(135deg, #42ffb5 0%, #00d4aa 100%)'
        };
      case 'data_removal':
        return {
          icon: '🗑️',
          title: 'Data Removal Service',
          message: 'Remove your personal information from 500+ data broker sites',
          buttonText: 'Start Removal',
          gradient: 'linear-gradient(135deg, #9333ea 0%, #c084fc 100%)'
        };
      case 'scan_limits':
        return {
          icon: '🔍',
          title: 'Scan Limit Reached',
          message: 'Get unlimited scans with premium access',
          buttonText: 'Get Unlimited',
          gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
        };
      case 'vpn_access':
        return {
          icon: '🛡️',
          title: 'VPN Protection',
          message: 'Secure your connection with CyberForget VPN',
          buttonText: 'Get VPN',
          gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)'
        };
      case 'monitoring':
        return {
          icon: '👁️',
          title: '24/7 Monitoring',
          message: 'Get real-time alerts for identity threats',
          buttonText: 'Enable Monitoring',
          gradient: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)'
        };
      default:
        return {
          icon: '⭐',
          title: 'Premium Access',
          message: 'Unlock all CyberForget features',
          buttonText: 'Get Premium',
          gradient: 'linear-gradient(135deg, #42ffb5 0%, #00d4aa 100%)'
        };
    }
  };

  const config = getTriggerConfig();

  return (
    <motion.div 
      className={`signup-trigger ${className}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="trigger-content">
        <div className="trigger-header">
          <motion.div 
            className="trigger-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            {config.icon}
          </motion.div>
          <div className="trigger-text">
            <h4 className="trigger-title">{config.title}</h4>
            <p className="trigger-message">{config.message}</p>
          </div>
        </div>
        
        <motion.button 
          className="trigger-button"
          style={{ background: config.gradient }}
          onClick={onSignUpClick}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span>{config.buttonText}</span>
          <motion.span 
            className="button-arrow"
            initial={{ x: 0 }}
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            →
          </motion.span>
        </motion.button>
      </div>
      
      <div className="trigger-benefits">
        <motion.div 
          className="benefit-item"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <span className="benefit-icon">✓</span>
          <span>Free 7-day trial</span>
        </motion.div>
        <motion.div 
          className="benefit-item"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span className="benefit-icon">✓</span>
          <span>Cancel anytime</span>
        </motion.div>
        <motion.div 
          className="benefit-item"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <span className="benefit-icon">✓</span>
          <span>No credit card required</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SignUpTrigger;