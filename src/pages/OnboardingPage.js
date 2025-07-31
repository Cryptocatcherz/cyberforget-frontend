import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuthUtils';
import { 
  FaShieldAlt, 
  FaBuilding, 
  FaUser, 
  FaUsers, 
  FaLock, 
  FaChartLine, 
  FaArrowRight, 
  FaArrowLeft,
  FaGoogle,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaReddit,
  FaNewspaper,
  FaUserFriends,
  FaCheck
} from 'react-icons/fa';
import './OnboardingPage.css';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);

  // Debug: Log mapped user object from useAuthUtils
  console.log('Mapped user object:', user);

  const scrollToTop = () => {
    // Use requestAnimationFrame to ensure DOM is updated first
    requestAnimationFrame(() => {
      // Multiple scroll approaches to ensure it works in all scenarios
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Fallback for older browsers
      if (document.documentElement.scrollTop !== 0) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body.scrollTop !== 0) {
        document.body.scrollTop = 0;
      }
      
      // Also try to scroll to the onboarding container after a short delay
      setTimeout(() => {
        const onboardingContainer = document.querySelector('.onboarding-page');
        if (onboardingContainer) {
          onboardingContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    });
  };

  // Scroll to top when step changes
  useEffect(() => {
    scrollToTop();
  }, [currentStep]);

  const [formData, setFormData] = useState({
    referralSource: '',
    customReferral: '',
    userType: '',
    businessSize: '',
    primaryConcern: '',
    techLevel: '',
    goals: [],
    currentTools: []
  });

  const totalSteps = 6;

  const referralSources = [
    { id: 'google', label: 'Google Search', icon: FaGoogle },
    { id: 'social_media', label: 'Social Media', icon: FaFacebook },
    { id: 'youtube', label: 'YouTube', icon: FaYoutube },
    { id: 'reddit', label: 'Reddit', icon: FaReddit },
    { id: 'news', label: 'News/Blog Article', icon: FaNewspaper },
    { id: 'friend', label: 'Friend/Colleague', icon: FaUserFriends },
    { id: 'linkedin', label: 'LinkedIn', icon: FaLinkedin },
    { id: 'other', label: 'Other', icon: FaChartLine }
  ];

  const businessSizes = [
    { id: '1', label: 'Just me (1 person)' },
    { id: '2-10', label: '2-10 employees' },
    { id: '11-50', label: '11-50 employees' },
    { id: '51-200', label: '51-200 employees' },
    { id: '201-1000', label: '201-1000 employees' },
    { id: '1000+', label: '1000+ employees' }
  ];

  const primaryConcerns = [
    { id: 'data_breaches', label: 'Data Breaches & Identity Theft', icon: '🔓' },
    { id: 'privacy', label: 'Online Privacy & Tracking', icon: '👁️' },
    { id: 'data_brokers', label: 'Data Brokers Selling My Info', icon: '💰' },
    { id: 'passwords', label: 'Weak Password Security', icon: '🔑' },
    { id: 'phishing', label: 'Phishing & Scam Emails', icon: '🎣' },
    { id: 'malware', label: 'Malware & Viruses', icon: '🦠' },
    { id: 'compliance', label: 'Business Compliance & Security', icon: '📋' },
    { id: 'general', label: 'General Cybersecurity', icon: '🛡️' }
  ];

  const techLevels = [
    { id: 'beginner', label: 'Beginner', desc: 'New to cybersecurity tools' },
    { id: 'intermediate', label: 'Intermediate', desc: 'Some experience with security' },
    { id: 'advanced', label: 'Advanced', desc: 'Very familiar with security tools' },
    { id: 'expert', label: 'Expert', desc: 'IT/Security professional' }
  ];

  const goalOptions = [
    { id: 'protect_identity', label: 'Protect my identity from theft' },
    { id: 'remove_data', label: 'Remove my data from data brokers' },
    { id: 'password_security', label: 'Improve password security' },
    { id: 'browse_privately', label: 'Browse the internet privately' },
    { id: 'monitor_threats', label: 'Monitor for security threats' },
    { id: 'business_security', label: 'Secure my business' },
    { id: 'family_protection', label: 'Protect my family online' },
    { id: 'compliance', label: 'Meet compliance requirements' }
  ];

  const currentToolOptions = [
    { id: 'none', label: 'None - I\'m just getting started' },
    { id: 'antivirus', label: 'Antivirus software' },
    { id: 'password_manager', label: 'Password manager' },
    { id: 'vpn', label: 'VPN service' },
    { id: 'backup', label: 'Backup solutions' },
    { id: 'firewall', label: 'Firewall' },
    { id: 'other_security', label: 'Other security tools' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      // Here you would save the onboarding data to your backend
      console.log('Onboarding data:', formData);
      
      // For now, just navigate to edit-info
      navigate('/edit-info');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return true; // Welcome step
      case 2: return formData.referralSource !== '';
      case 3: return formData.userType !== '';
      case 4: return formData.userType === 'individual' || formData.businessSize !== '';
      case 5: return formData.primaryConcern !== '' && formData.techLevel !== '';
      case 6: return formData.goals.length > 0;
      default: return false;
    }
  };

  const renderProgressBar = () => (
    <div className="progress-container">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
      <span className="progress-text">Step {currentStep} of {totalSteps}</span>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <div className="welcome-header">
              <FaShieldAlt className="welcome-icon" />
              <h2>Welcome to CyberForget!</h2>
              <p>Let's get your account set up in just a few quick steps. This will help us personalize your security experience.</p>
            </div>
            <div className="user-info">
              <div className="user-card">
                <div className="user-avatar">
                  {user?.firstName?.charAt(0)?.toUpperCase() || 
                   user?.fullName?.charAt(0)?.toUpperCase() || 
                   user?.email?.charAt(0)?.toUpperCase() || 
                   'U'}
                </div>
                <div className="user-details">
                  <h3>{user?.firstName || user?.fullName?.split(' ')[0] || 'User'}</h3>
                  <p>{user?.email || 'Welcome to CyberForget!'}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h2>How did you hear about CyberForget?</h2>
            <p>This helps us understand which channels work best for reaching people like you.</p>
            
            <div className="options-grid">
              {referralSources.map(source => {
                const IconComponent = source.icon;
                return (
                  <button
                    key={source.id}
                    className={`option-card ${formData.referralSource === source.id ? 'selected' : ''}`}
                    onClick={() => handleInputChange('referralSource', source.id)}
                  >
                    <IconComponent className="option-icon" />
                    <span>{source.label}</span>
                  </button>
                );
              })}
            </div>

            {formData.referralSource === 'other' && (
              <div className="custom-input">
                <input
                  type="text"
                  placeholder="Please specify..."
                  value={formData.customReferral}
                  onChange={(e) => handleInputChange('customReferral', e.target.value)}
                  className="form-input"
                />
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h2>Are you signing up as an individual or business?</h2>
            <p>This helps us tailor your experience and recommend the right features.</p>
            
            <div className="user-type-options">
              <button
                className={`user-type-card ${formData.userType === 'individual' ? 'selected' : ''}`}
                onClick={() => handleInputChange('userType', 'individual')}
              >
                <FaUser className="type-icon" />
                <h3>Individual</h3>
                <p>Personal cybersecurity protection</p>
              </button>
              
              <button
                className={`user-type-card ${formData.userType === 'business' ? 'selected' : ''}`}
                onClick={() => handleInputChange('userType', 'business')}
              >
                <FaBuilding className="type-icon" />
                <h3>Business</h3>
                <p>Team and enterprise security</p>
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            {formData.userType === 'business' ? (
              <>
                <h2>How many people are in your organization?</h2>
                <p>This helps us recommend the right plan and features for your team size.</p>
                
                <div className="size-options">
                  {businessSizes.map(size => (
                    <button
                      key={size.id}
                      className={`size-option ${formData.businessSize === size.id ? 'selected' : ''}`}
                      onClick={() => handleInputChange('businessSize', size.id)}
                    >
                      <FaUsers className="size-icon" />
                      {size.label}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2>Great! Let's personalize your individual experience.</h2>
                <p>We'll set you up with the best personal cybersecurity features.</p>
                <div className="individual-info">
                  <FaUser className="info-icon" />
                  <h3>Individual Account</h3>
                  <p>You'll get access to all personal security features including password management, data removal, and privacy protection.</p>
                </div>
              </>
            )}
          </div>
        );

      case 5:
        return (
          <div className="step-content">
            <h2>What's your biggest security concern?</h2>
            <p>Select your primary concern so we can prioritize the right features for you.</p>
            
            <div className="concerns-grid">
              {primaryConcerns.map(concern => (
                <button
                  key={concern.id}
                  className={`concern-card ${formData.primaryConcern === concern.id ? 'selected' : ''}`}
                  onClick={() => handleInputChange('primaryConcern', concern.id)}
                >
                  <span className="concern-emoji">{concern.icon}</span>
                  <span className="concern-label">{concern.label}</span>
                </button>
              ))}
            </div>

            <div className="tech-level-section">
              <h3>How would you describe your technical experience?</h3>
              <div className="tech-levels">
                {techLevels.map(level => (
                  <button
                    key={level.id}
                    className={`tech-level ${formData.techLevel === level.id ? 'selected' : ''}`}
                    onClick={() => handleInputChange('techLevel', level.id)}
                  >
                    <strong>{level.label}</strong>
                    <span>{level.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="step-content">
            <h2>What are your main goals with CyberForget?</h2>
            <p>Select all that apply - this helps us show you the most relevant features first.</p>
            
            <div className="goals-grid">
              {goalOptions.map(goal => (
                <button
                  key={goal.id}
                  className={`goal-option ${formData.goals.includes(goal.id) ? 'selected' : ''}`}
                  onClick={() => handleMultiSelect('goals', goal.id)}
                >
                  <FaCheck className={`check-icon ${formData.goals.includes(goal.id) ? 'visible' : ''}`} />
                  {goal.label}
                </button>
              ))}
            </div>

            <div className="current-tools-section">
              <h3>What security tools do you currently use? (Optional)</h3>
              <div className="tools-grid">
                {currentToolOptions.map(tool => (
                  <button
                    key={tool.id}
                    className={`tool-option ${formData.currentTools.includes(tool.id) ? 'selected' : ''}`}
                    onClick={() => handleMultiSelect('currentTools', tool.id)}
                  >
                    <FaCheck className={`check-icon ${formData.currentTools.includes(tool.id) ? 'visible' : ''}`} />
                    {tool.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        <div className="onboarding-header">
          <div className="logo-section">
            <FaShieldAlt className="logo-icon" />
            <span className="logo-text">CyberForget</span>
          </div>
          {renderProgressBar()}
        </div>

        <div className="onboarding-content">
          {renderStep()}
        </div>

        <div className="onboarding-footer">
          <div className="step-navigation">
            {currentStep > 1 && (
              <button 
                className="nav-btn prev-btn"
                onClick={prevStep}
              >
                <FaArrowLeft /> Previous
              </button>
            )}
            
            <div className="nav-spacer" />
            
            {currentStep < totalSteps ? (
              <button 
                className={`nav-btn next-btn ${!isStepValid() ? 'disabled' : ''}`}
                onClick={nextStep}
                disabled={!isStepValid()}
              >
                Next <FaArrowRight />
              </button>
            ) : (
              <button 
                className={`nav-btn complete-btn ${!isStepValid() ? 'disabled' : ''}`}
                onClick={handleComplete}
                disabled={!isStepValid()}
              >
                Complete Setup <FaArrowRight />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;