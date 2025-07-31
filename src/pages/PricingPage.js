import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaLock, FaShieldAlt, FaMoneyBillWave, FaCheckCircle } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import MobileNavbar from '../components/MobileNavbar';
import { Footer } from '../components/footer';
import './PricingPage.css';

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [activeTab, setActiveTab] = useState('engineers');
  const [windowWidth, setWindowWidth] = useState(1200);
  const [teamMembers, setTeamMembers] = useState([]);
  const [requestedFeature, setRequestedFeature] = useState('');
  const [conversionSource, setConversionSource] = useState('');

    useEffect(() => {
        if (typeof window !== "undefined") {
      const handleResize = () => setWindowWidth(window.innerWidth);
      setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Add useEffect to scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check URL parameters for feature-specific marketing
    const urlParams = new URLSearchParams(window.location.search);
    const feature = urlParams.get('feature');
    const source = urlParams.get('source');
    
    if (feature) {
      setRequestedFeature(feature);
      setConversionSource(source || 'direct');
    }
    
    // Check localStorage for conversion tracking
    const storedFeature = localStorage.getItem('requested_feature');
    const storedSource = localStorage.getItem('conversion_source');
    
    // Only set if it's a valid feature
    if (storedFeature && ['ad-blocker', 'vpn', 'live-reports'].includes(storedFeature)) {
      setRequestedFeature(storedFeature);
      setConversionSource(storedSource || 'direct');
    } else {
      // Clear invalid stored features
      localStorage.removeItem('requested_feature');
      localStorage.removeItem('conversion_source');
    }
  }, []);

  useEffect(() => {
    // Fetch team members data
    const fetchTeamMembers = async () => {
      try {
        // This would be replaced with your actual API call
        const mockTeamData = {
          engineers: [
            {
              id: 1,
              name: "Sophia Turner",
              role: "Privacy Protection Specialist",
              image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            },
            {
              id: 2,
              name: "Michael Chen",
              role: "Data Removal Expert",
              image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            }
          ],
          designers: [
            {
              id: 3,
              name: "Emily Rodriguez",
              role: "Privacy Research Analyst",
              image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            },
            {
              id: 4,
              name: "David Kim",
              role: "Data Broker Relations Manager",
              image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            }
          ]
        };
        setTeamMembers(mockTeamData[activeTab] || []);
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    };

    fetchTeamMembers();
  }, [activeTab]);

  // Animated lines background
  const renderAnimatedLines = () => {
    const lines = [];
    for (let i = 0; i < 20; i++) {
      const delay = Math.random() * 8;
      const left = Math.random() * 100;
      lines.push(
        <motion.div
          key={i}
          className="line"
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ 
            y: '100%', 
            opacity: [0, 0.15, 0],
          }}
          transition={{
            duration: 8,
            delay,
            repeat: Infinity,
            ease: 'linear'
          }}
          style={{
            left: `${left}%`,
          }}
        />
      );
    }
    return lines;
  };

  const features = [
    'Remove your data from 200+ data broker sites',
    '24/7 monitoring for new exposures',
    'Unlimited removal requests',
    'Priority customer support',
    'Monthly privacy reports'
  ];

  const benefits = [
    'Stop spam calls and unwanted mail',
    'Protect yourself from identity theft',
    'Keep your family safe online',
    'Reduce your digital footprint',
    'Get peace of mind back'
  ];

  const handleBillingToggle = () => {
    setIsAnnual((prev) => !prev);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleStartTrial = () => {
    // Clear the conversion tracking data when starting trial
    localStorage.removeItem('requested_feature');
    localStorage.removeItem('conversion_source');
    
    // Track the conversion for analytics
    if (requestedFeature && conversionSource) {
      // Here you would send analytics data to your tracking service
      console.log('Conversion tracked:', {
        feature: requestedFeature,
        source: conversionSource,
        plan: isAnnual ? 'annual' : 'monthly'
      });
    }
    
    window.location.href = isAnnual 
      ? "https://buy.stripe.com/14kcNQafGcpE9HOaEE"
      : "https://buy.stripe.com/fZeg02fA0exMaLS8wA";
  };

  const mainColor = "#4A90E2";
  const hoverColor = "#357ABD";
  const isMobile = windowWidth <= 768;

    return (
    <div className="pricing-page">
      <div className="animated-lines" style={{display: 'none'}}>
        {renderAnimatedLines()}
      </div>

      {isMobile ? <MobileNavbar /> : <Navbar />}
      
      <div className="pricing-container">
        <motion.div 
          className="pricing-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>
            Get Your Privacy Back with <span className="highlight">CyberForget</span>
          </h1>
          <p className="subtitle">
            We find and remove your personal information from data broker websites that sell your data to scammers, 
            marketers, and identity thieves. Join over 50,000 people who've taken control of their privacy.
          </p>
        </motion.div>

        {/* Feature-specific marketing message */}
        {requestedFeature && (requestedFeature === 'ad-blocker' || requestedFeature === 'vpn' || requestedFeature === 'live-reports') && (
          <motion.div 
            className="feature-specific-banner"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="feature-banner-content">
              <div className="feature-icon">
                {requestedFeature === 'ad-blocker' && '🛡️'}
                {requestedFeature === 'vpn' && '🔒'}
                {requestedFeature === 'live-reports' && '📊'}
              </div>
              <div className="feature-text">
                <h3>
                  {requestedFeature === 'ad-blocker' && 'You wanted Ad Blocker - Get it FREE with Premium!'}
                  {requestedFeature === 'vpn' && 'You wanted VPN - Get it FREE with Premium!'}
                  {requestedFeature === 'live-reports' && 'You wanted Live Reports - Get it FREE with Premium!'}
                </h3>
                <p>
                  {requestedFeature === 'ad-blocker' && 'Block 99.9% of ads and malicious trackers while protecting your privacy!'}
                  {requestedFeature === 'vpn' && 'Secure your connection with military-grade encryption!'}
                  {requestedFeature === 'live-reports' && 'Get real-time threat alerts and comprehensive privacy reports!'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div 
          className="protect-privacy"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>Start Protecting Your Privacy Today</h2>
          <p>Try CyberForget risk-free for 5 days. Cancel anytime.</p>
          <motion.button
            className="start-trial-button"
            whileHover={{ scale: 1.05, backgroundColor: hoverColor }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartTrial}
          >
            Start My Free Trial
          </motion.button>
        </motion.div>

        <div className="pricing-cards-container">
                <motion.div
            className="pricing-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
                    whileHover={{
                        scale: 1.02,
              boxShadow: "0 12px 24px rgba(216, 255, 96, 0.2)",
                    }}
                >
                    <motion.div
              className="free-trial-badge"
              initial={{ rotate: -10, y: -20 }}
              animate={{ rotate: -10, y: -20 }}
            >
              🎉 5-Day Free Trial
                    </motion.div>

            <h2>CyberForget Pro</h2>
            <div className="price">
              <span className="currency">$</span>
              {isAnnual ? '11' : '15'}
              <span className="period">/mo</span>
            </div>
            <p className="billing-text">
              {isAnnual ? '$127 billed annually (Save $53!)' : 'Billed monthly • Cancel anytime'}
            </p>

            <div
              className="billing-toggle-ios"
              role="switch"
              aria-checked={isAnnual}
              tabIndex={0}
              onClick={handleBillingToggle}
              onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && handleBillingToggle()}
            >
              <span className={!isAnnual ? 'label active' : 'label'}>Monthly</span>
              <span className={isAnnual ? 'label active' : 'label'}>Annually <span className="save-badge">Save 30%</span></span>
              {/* <span className={`slider-knob${isAnnual ? ' right' : ''}`}></span> */}
            </div>

                    <motion.button
              className="start-trial-button"
                        whileHover={{
                            scale: 1.05,
                            backgroundColor: hoverColor,
                        }}
                        whileTap={{ scale: 0.95 }}
              onClick={handleStartTrial}
                    >
              Start My Free Trial
                    </motion.button>

            <ul className="feature-list">
              {features.map((feature, index) => (
                <motion.li 
                                key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.1 * index,
                  }}
                >
                  <FaCheckCircle color={mainColor} />
                                <span>{feature}</span>
                </motion.li>
                        ))}
                    </ul>

            <div className="security-features">
              {[
                { icon: FaLock, text: 'Secure Checkout' },
                { icon: FaMoneyBillWave, text: '30-Day Money Back' },
                { icon: FaShieldAlt, text: '50,000+ Happy Customers' }
              ].map((badge, index) => (
                        <motion.div
                  key={index}
                  className="security-feature"
                  whileHover={{ scale: 1.1, rotate: index % 2 === 0 ? 2 : -2 }}
                >
                  <badge.icon size={24} />
                  <span>{badge.text}</span>
                        </motion.div>
              ))}
                    </div>
                </motion.div>

                <motion.div
            className="why-choose"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
                    whileHover={{
                        scale: 1.02,
              boxShadow: "0 12px 24px rgba(216, 255, 96, 0.2)",
            }}
          >
            <h3>Why Choose CyberForget?</h3>
            <ul className="feature-list">
              {benefits.map((benefit, index) => (
                <motion.li 
                                key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.1 * index,
                  }}
                >
                  <FaCheckCircle color={mainColor} />
                                <span>{benefit}</span>
                </motion.li>
                        ))}
                    </ul>

                    <motion.button
              className="start-trial-button"
                        whileHover={{
                            scale: 1.05,
                            backgroundColor: hoverColor,
                        }}
                        whileTap={{ scale: 0.95 }}
              onClick={handleStartTrial}
                    >
              Start My Free Trial
                    </motion.button>

            <div className="testimonial">
              <p>"I was getting 10+ spam calls daily. After using CyberForget for 2 months, I barely get any. My information was everywhere and now it's not. Worth every penny!"</p>
              <p className="testimonial-author">- Sarah M., Teacher</p>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="team-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="team-header">Meet Our Privacy Protection Team</h2>
          <div className="team-tabs">
            <button 
              className={`team-tab ${activeTab === 'engineers' ? 'active' : ''}`}
              onClick={() => handleTabChange('engineers')}
            >
              Privacy Experts
            </button>
            <button 
              className={`team-tab ${activeTab === 'designers' ? 'active' : ''}`}
              onClick={() => handleTabChange('designers')}
            >
              Data Specialists
            </button>
          </div>

          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={member.id} 
                className="team-member"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <img src={member.image} alt={member.name} />
                <div className="team-member-info">
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="join-team-card">
            <h3>Join Our Privacy Team</h3>
            <p>
              Help us protect people's privacy and give them control over their personal data.
              Make a real difference in people's lives every day.
            </p>
            <button className="apply-button start-trial-button">
              View Open Positions
            </button>
          </div>
        </motion.div>

        <motion.div 
          className="trust-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <h2>Protecting Privacy Since 2020</h2>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default PricingPage;