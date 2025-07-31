import React, { useState, useEffect } from 'react';
import { SignUp } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import './SignUpModal.css';

const SignUpModal = ({ 
  isOpen, 
  onClose, 
  trigger = 'premium_feature',
  featureName = 'advanced security tools'
}) => {
  const [showClerkSignup, setShowClerkSignup] = useState(false);
  const [currentStep, setCurrentStep] = useState('intro'); // intro, signup, success

  useEffect(() => {
    if (isOpen) {
      setCurrentStep('intro');
      setShowClerkSignup(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleStartSignup = () => {
    setCurrentStep('signup');
    setShowClerkSignup(true);
  };

  const handleSignupSuccess = () => {
    setCurrentStep('success');
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  const getTriggerContent = () => {
    switch (trigger) {
      case 'premium_feature':
        return {
          title: 'Unlock Premium Features',
          subtitle: `Get access to ${featureName} and more`,
          benefits: [
            'Advanced threat detection',
            'Real-time monitoring',
            'Data removal assistance',
            'Priority support'
          ]
        };
      case 'data_removal':
        return {
          title: 'Start Data Removal',
          subtitle: 'Remove your personal information from 500+ sites',
          benefits: [
            'Automated data removal',
            'Monthly progress reports',
            'Legal compliance assistance',
            'Privacy protection'
          ]
        };
      case 'scan_limits':
        return {
          title: 'Unlimited Scans',
          subtitle: 'Scan as much as you need with premium access',
          benefits: [
            'Unlimited security scans',
            'Advanced threat analysis',
            'Detailed reports',
            'Custom alerts'
          ]
        };
      default:
        return {
          title: 'Join CyberForget',
          subtitle: 'Protect your digital identity',
          benefits: [
            'AI-powered security',
            'Identity protection',
            'Fraud prevention',
            '24/7 monitoring'
          ]
        };
    }
  };

  const content = getTriggerContent();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="signup-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="signup-modal-container"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="signup-modal-close" onClick={onClose}>
            <span>✕</span>
          </button>

          {currentStep === 'intro' && (
            <motion.div 
              className="signup-intro"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="signup-header">
                <div className="cyberforget-logo">
                  <span className="logo-icon">🛡️</span>
                  <div className="logo-text">
                    <h1 className="logo-title">CyberForget</h1>
                    <p className="logo-subtitle">AI-First Identity Protection</p>
                  </div>
                </div>
              </div>

              <div className="signup-content">
                <h2 className="signup-title">{content.title}</h2>
                <p className="signup-subtitle">{content.subtitle}</p>

                <div className="benefits-grid">
                  {content.benefits.map((benefit, index) => (
                    <motion.div 
                      key={index}
                      className="benefit-item"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="benefit-icon">✓</span>
                      <span className="benefit-text">{benefit}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="signup-actions">
                  <button 
                    className="signup-primary-btn"
                    onClick={handleStartSignup}
                  >
                    <span>Get Started Free</span>
                    <span className="btn-arrow">→</span>
                  </button>
                  
                  <p className="signup-note">
                    Start with a <strong>free trial</strong> • No credit card required
                  </p>
                </div>

                <div className="security-badges">
                  <div className="badge">
                    <span className="badge-icon">🔒</span>
                    <span>Enterprise Security</span>
                  </div>
                  <div className="badge">
                    <span className="badge-icon">⚡</span>
                    <span>AI-Powered</span>
                  </div>
                  <div className="badge">
                    <span className="badge-icon">🛡️</span>
                    <span>Privacy First</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 'signup' && (
            <motion.div 
              className="signup-clerk-container"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="clerk-signup-wrapper">
                <SignUp
                  appearance={{
                    elements: {
                      rootBox: "clerk-root-box",
                      card: "clerk-card",
                      headerTitle: "clerk-header-title",
                      headerSubtitle: "clerk-header-subtitle",
                      socialButtonsBlockButton: "clerk-social-button",
                      formButtonPrimary: "clerk-form-button",
                      formFieldInput: "clerk-form-input",
                      footerActionLink: "clerk-footer-link",
                      dividerLine: "clerk-divider",
                      dividerText: "clerk-divider-text",
                      alternativeMethodsBlockButton: "clerk-alt-button"
                    },
                    variables: {
                      colorPrimary: '#42ffb5',
                      colorText: '#ffffff',
                      colorTextSecondary: 'rgba(255, 255, 255, 0.7)',
                      colorBackground: 'transparent',
                      colorInputBackground: 'rgba(255, 255, 255, 0.05)',
                      colorInputText: '#ffffff',
                      fontFamily: 'inherit',
                      borderRadius: '12px'
                    }
                  }}
                  redirectUrl={window.location.origin + '/dashboard'}
                  afterSignUpUrl={window.location.origin + '/dashboard'}
                  signInUrl="/login"
                />
              </div>
              
              <div className="signup-footer">
                <p>
                  Already have an account? 
                  <button 
                    className="signup-link"
                    onClick={() => {
                      onClose();
                      // Navigate to login if needed
                    }}
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </motion.div>
          )}

          {currentStep === 'success' && (
            <motion.div 
              className="signup-success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="success-animation">
                <motion.div 
                  className="success-checkmark"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  ✓
                </motion.div>
              </div>
              
              <h2 className="success-title">Welcome to CyberForget!</h2>
              <p className="success-message">
                Your account is being set up. You'll be redirected to your dashboard shortly.
              </p>
              
              <div className="success-loading">
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SignUpModal;