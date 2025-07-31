import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './SignupPage.css';
import { FaLock, FaMoneyBillWave, FaShieldAlt } from 'react-icons/fa';

const SignupPage = () => {
    const [isAnnually, setIsAnnually] = useState(true);
    const location = useLocation();
    const { matchCount } = location.state || { matchCount: 0 };

    useEffect(() => {
        window.scrollTo(0, 0);

        // Force recalculation of overflow and height
        document.body.style.overflow = 'hidden'; // Disable scrolling temporarily
        const reflow = document.body.offsetHeight; // Trigger a reflow by reading offsetHeight
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }, []);

    const handleToggle = () => {
        setIsAnnually(!isAnnually);
    };

    return (
        <div className="signup-page">
            <div className="pricing-header">
                <h1>Protect Your Privacy Now</h1>
                <p className="subtitle">
                    We found <strong>{matchCount}</strong> potential threats exposing your personal information.
                </p>
                <p className="subtitle">Take control and remove your data from over 200 data brokers.</p>
                <button className="signup-button header-button">Start Your Free Trial</button>
            </div>
            <div className="signup-container">
                <div className="signup-card">
                    <div className="sticker">🎉 5-Day Free Trial</div>
                    <h2 className="plan-title">CleanData Pro</h2>
                    <p className="plan-price">
                        ${isAnnually ? '11' : '15'}
                        <span className="plan-period">/mo</span>
                    </p>
                    <p className="plan-billed">{isAnnually ? '$127 billed annually' : 'Billed monthly'}</p>
                    {/* Reverted Toggle Switch */}
                    <div className="toggle-container">
                        <span className="toggle-label">Monthly</span>
                        <label className="toggle-switch">
                            <input type="checkbox" checked={isAnnually} onChange={handleToggle} />
                            <span className="slider round"></span>
                        </label>
                        <span className="toggle-label">
                            Annually <span className="save-tag">Save 30%</span>
                        </span>
                    </div>
                    <button className="signup-button">Get Started for Free</button>
                    <ul className="plan-features">
                        <li>Automated Data Removal from 200+ Sites</li>
                        <li>Continuous Monitoring & Updates</li>
                        <li>Unlimited Custom Removal Requests</li>
                        <li>Priority Customer Support</li>
                        <li>Comprehensive Privacy Reports</li>
                    </ul>
                    <div className="trust-badges">
                        <div className="badge">
                            <FaLock size={32} color="#00cc66" />
                            <p>Secure Checkout</p>
                        </div>
                        <div className="badge">
                            <FaMoneyBillWave size={32} color="#00cc66" />
                            <p>Money-Back Guarantee</p>
                        </div>
                        <div className="badge">
                            <FaShieldAlt size={32} color="#00cc66" />
                            <p>Trusted Service</p>
                        </div>
                    </div>
                </div>
                <div className="benefits-card">
                    <h2>Why Choose CleanData Pro?</h2>
                    <ul className="benefits-list">
                        <li>Erase Your Data from the Internet</li>
                        <li>Protect Against Identity Theft</li>
                        <li>Remove Personal Information Instantly</li>
                        <li>Stay Ahead of Data Breaches</li>
                        <li>Regain Your Peace of Mind</li>
                    </ul>
                    <button className="signup-button">Start Your Free Trial</button>
                    <div className="testimonial">
                        <p>
                            "CleanData Pro helped me remove my personal information from dozens of sites. I feel much safer now!"
                        </p>
                        <p className="customer-name">- Alex P.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
