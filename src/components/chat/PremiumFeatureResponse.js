import React from 'react';
import { motion } from 'framer-motion';
import SignUpTrigger from './SignUpTrigger';
import './PremiumFeatureResponse.css';

const PremiumFeatureResponse = ({ 
  feature,
  response,
  onSignUpClick,
  className = ''
}) => {
  const getPremiumFeatureConfig = (feature) => {
    const configs = {
      'data_removal': {
        trigger: 'data_removal',
        featureName: 'data removal service',
        description: 'Our AI can help remove your personal information from 500+ data broker sites.',
        benefits: [
          'Automated removal requests',
          'Monthly progress reports',
          'Legal compliance assistance',
          'Ongoing monitoring'
        ],
        previewText: 'Here\'s what our data removal service includes:'
      },
      'vpn_access': {
        trigger: 'vpn_access',
        featureName: 'VPN protection',
        description: 'Secure your connection with military-grade encryption.',
        benefits: [
          'Hide your IP address',
          'Encrypt your traffic',
          'Access geo-blocked content',
          'Protect on public WiFi'
        ],
        previewText: 'CyberForget VPN provides:'
      },
      'comprehensive_scan': {
        trigger: 'premium_feature',
        featureName: 'comprehensive scanning',
        description: 'Get detailed insights into your digital footprint and security vulnerabilities.',
        benefits: [
          'Deep web monitoring',
          'Advanced threat detection',
          'Detailed vulnerability reports',
          'Remediation recommendations'
        ],
        previewText: 'Our comprehensive scan includes:'
      },
      'monitoring': {
        trigger: 'monitoring',
        featureName: '24/7 identity monitoring',
        description: 'Get real-time alerts when your personal information is detected online.',
        benefits: [
          'Real-time threat alerts',
          'Credit monitoring',
          'Social media monitoring',
          'Dark web surveillance'
        ],
        previewText: 'Our monitoring service watches for:'
      },
      'unlimited_scans': {
        trigger: 'scan_limits',
        featureName: 'unlimited scanning',
        description: 'Run as many security scans as you need without limits.',
        benefits: [
          'Unlimited security scans',
          'Priority processing',
          'Advanced scan options',
          'Bulk domain scanning'
        ],
        previewText: 'With unlimited scans you get:'
      }
    };

    return configs[feature] || {
      trigger: 'premium_feature',
      featureName: 'premium features',
      description: 'Unlock the full power of CyberForget\'s AI-driven security platform.',
      benefits: [
        'All premium features',
        'Priority support',
        'Advanced analytics',
        'Custom integrations'
      ],
      previewText: 'Premium features include:'
    };
  };

  const config = getPremiumFeatureConfig(feature);

  return (
    <motion.div 
      className={`premium-feature-response ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* AI Response */}
      <div className="feature-response-content">
        <p className="response-text">{response}</p>
        
        <div className="feature-preview">
          <h4 className="preview-title">{config.previewText}</h4>
          <div className="benefits-list">
            {config.benefits.map((benefit, index) => (
              <motion.div 
                key={index}
                className="benefit-item"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <span className="benefit-check">✓</span>
                <span className="benefit-text">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Signup Trigger */}
      <SignUpTrigger
        trigger={config.trigger}
        featureName={config.featureName}
        onSignUpClick={() => onSignUpClick(config.trigger, config.featureName)}
        className={`${config.trigger}-variant`}
      />
    </motion.div>
  );
};

export default PremiumFeatureResponse;