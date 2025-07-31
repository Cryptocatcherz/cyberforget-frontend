import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../hooks/useAuthUtils";
import useSubscription from '../hooks/useSubscription';
import PremiumDashboard from './PremiumDashboard';
import './NewDashboard.css';

const NewDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { shouldShowPaywall, isPremium, isTrial, daysRemaining } = useSubscription();
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [activeToggle, setActiveToggle] = useState(null);
    
    // DEBUG MODE: Uncomment the line below to force premium dashboard view
    // const DEBUG_FORCE_PREMIUM = true;

    // Feature toggles data
    const features = [
        {
            id: 'dark-web',
            title: 'Dark Web Protection',
            description: 'Monitor your data on the dark web and get instant alerts',
            icon: '🕵️',
            enabled: false,
            premium: true
        },
        {
            id: 'vpn',
            title: 'Military-Grade VPN',
            description: '50+ server locations with AES-256 encryption',
            icon: '🔐',
            enabled: false,
            premium: true
        },
        {
            id: 'password-manager',
            title: 'Password Manager',
            description: 'Generate and store unlimited secure passwords',
            icon: '🔑',
            enabled: false,
            premium: true
        },
        {
            id: 'data-removal',
            title: 'Automated Data Removal',
            description: 'Remove your data from 400+ broker sites automatically',
            icon: '🗑️',
            enabled: false,
            premium: true
        },
        {
            id: 'identity-monitoring',
            title: '24/7 Identity Monitoring',
            description: 'Real-time alerts for identity theft and breaches',
            icon: '🛡️',
            enabled: false,
            premium: true
        },
        {
            id: 'ad-blocker',
            title: 'Advanced Ad Blocker',
            description: 'Block ads, trackers, and malicious websites',
            icon: '🚫',
            enabled: false,
            premium: true
        }
    ];

    const handleToggleClick = (featureId) => {
        setActiveToggle(featureId);
        setShowSignupModal(true);
    };

    const closeSignupModal = () => {
        setShowSignupModal(false);
        setActiveToggle(null);
    };

    const handleStartTrial = () => {
        navigate('/pricing');
    };

    // Debug logging
    console.log('NewDashboard Debug:', { isTrial, isPremium, daysRemaining, shouldShowPaywall });

    // Show premium dashboard for trial/premium users
    if (isTrial || isPremium || daysRemaining > 0 /* || DEBUG_FORCE_PREMIUM */) {
        return <PremiumDashboard />;
    }

    // Free user dashboard with interactive toggles
    return (
        <div className="new-dashboard free-dashboard" data-debug="newdashboard-instance">
            <div className="dashboard-container">
                {/* Hero Section */}
                <div className="dashboard-header">
                    <div className="hero-content-left">
                        <div className="hero-badge">🚀 5-Day Free Trial</div>
                        <h1>Unlock Your Complete Cyber Security Suite</h1>
                    </div>
                    <div className="hero-content-right">
                        <p>Protect your digital identity with military-grade security tools used by 2.3M+ users worldwide</p>
                        <button className="cta-button primary" onClick={handleStartTrial}>
                            Start Free Trial - No Credit Card Required
                        </button>
                    </div>
                </div>

                {/* Interactive Feature Toggles */}
                <div className="features-section">
                    <h2>🔓 Try Premium Features</h2>
                    <p className="features-subtitle">Toggle any feature below to start your free trial</p>
                    
                    <div className="features-grid">
                        {features.map((feature) => (
                            <div key={feature.id} className="feature-card locked">
                                <div className="feature-header">
                                    <div className="feature-icon">{feature.icon}</div>
                                    <div className="feature-status locked">🔒 PREMIUM</div>
                                </div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                                <div 
                                    className="toggle-switch locked" 
                                    onClick={() => handleToggleClick(feature.id)}
                                >
                                    <div className="toggle-slider"></div>
                                </div>
                                <div className="feature-overlay" onClick={() => handleToggleClick(feature.id)}>
                                    <div className="overlay-content">
                                        <div className="lock-icon">🔒</div>
                                        <span>Click to Unlock</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Value Proposition */}
                <div className="value-section">
                    <h2>💎 Everything You Need - One Low Price</h2>
                    <div className="value-comparison">
                        <div className="competitor-pricing">
                            <h3>Buying Separately</h3>
                            <div className="price-breakdown">
                                <div className="price-item">
                                    <span>Data Removal Service</span>
                                    <span>$99/mo</span>
                                </div>
                                <div className="price-item">
                                    <span>Premium VPN</span>
                                    <span>$12.95/mo</span>
                                </div>
                                <div className="price-item">
                                    <span>Password Manager</span>
                                    <span>$7.99/mo</span>
                                </div>
                                <div className="price-item">
                                    <span>Identity Monitoring</span>
                                    <span>$29.99/mo</span>
                                </div>
                                <div className="price-item">
                                    <span>Ad Blocker Pro</span>
                                    <span>$5.99/mo</span>
                                </div>
                                <div className="price-total">
                                    <span><strong>Total</strong></span>
                                    <span><strong>$155.92/mo</strong></span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="vs-divider">VS</div>
                        
                        <div className="our-pricing">
                            <h3>CyberForget All-in-One</h3>
                            <div className="price-hero">
                                <div className="price-main">$15<span>/month</span></div>
                                <div className="price-annual">or $10/month billed annually</div>
                            </div>
                            <div className="savings-badge">
                                Save $140+/month!
                            </div>
                            <button className="cta-button primary large" onClick={handleStartTrial}>
                                Start 5-Day Free Trial
                            </button>
                        </div>
                    </div>
                </div>

                {/* Social Proof */}
                <div className="social-proof">
                    <div className="testimonials">
                        <div className="testimonial">
                            <p>"CyberForget removed my data from 47 broker sites in just 2 weeks!"</p>
                            <span>- Sarah M., Software Engineer</span>
                        </div>
                        <div className="testimonial">
                            <p>"The VPN is lightning fast and the password manager is incredibly secure."</p>
                            <span>- Michael R., Cybersecurity Expert</span>
                        </div>
                        <div className="testimonial">
                            <p>"Best investment I've made for my digital privacy. Highly recommend!"</p>
                            <span>- Jennifer L., Marketing Director</span>
                        </div>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="final-cta">
                    <h2>🔥 Limited Time: 5 Days Completely FREE</h2>
                    <p>Join 2.3M+ users protecting their digital identity</p>
                    <div className="cta-buttons">
                        <button className="cta-button primary extra-large" onClick={handleStartTrial}>
                            Start Free Trial Now
                        </button>
                        <button className="cta-button secondary" onClick={() => navigate('/chat')}>
                            Try Free Scan First
                        </button>
                    </div>
                    <p className="guarantee">💯 30-day money-back guarantee • Cancel anytime</p>
                </div>
            </div>

            {/* Signup Modal */}
            {showSignupModal && (
                <div className="modal-overlay" onClick={closeSignupModal}>
                    <div className="signup-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeSignupModal}>×</button>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2>🔓 Unlock {features.find(f => f.id === activeToggle)?.title}</h2>
                                <p>Start your 5-day free trial to access all premium features</p>
                            </div>
                            <div className="feature-preview">
                                <div className="feature-icon large">
                                    {features.find(f => f.id === activeToggle)?.icon}
                                </div>
                                <h3>{features.find(f => f.id === activeToggle)?.title}</h3>
                                <p>{features.find(f => f.id === activeToggle)?.description}</p>
                            </div>
                            <div className="trial-benefits">
                                <h4>Your 5-Day Free Trial Includes:</h4>
                                <ul>
                                    <li>✓ Full access to all premium features</li>
                                    <li>✓ Unlimited data broker removal</li>
                                    <li>✓ Military-grade VPN with 50+ servers</li>
                                    <li>✓ Advanced password manager</li>
                                    <li>✓ 24/7 identity monitoring</li>
                                    <li>✓ No credit card required</li>
                                </ul>
                            </div>
                            <button className="cta-button primary full-width" onClick={handleStartTrial}>
                                Start My Free Trial
                            </button>
                            <p className="modal-guarantee">30-day money-back guarantee</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewDashboard;