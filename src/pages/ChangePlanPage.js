import React, { useState, useEffect } from 'react';
import { FaCheck, FaCrown, FaRocket } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuthUtils';
import useSubscription from '../hooks/useSubscription';
import Navbar from '../components/Navbar';
import MobileNavbar from '../components/MobileNavbar';
import Sidebar from '../components/Sidebar';
import './ChangePlanPage.css';

const PLANS = [
  {
    id: 'pro-monthly',
    name: 'CyberForget Pro',
    price: 9.99,
    interval: 'month',
    description: 'Complete privacy protection with premium tools and priority support',
    features: [
      'Remove data from 200+ broker sites',
      'Weekly monitoring & instant re-removal',
      'Detailed removal reports & analytics',
      'Priority customer support',
      'Custom removal requests',
      'Premium Ad Blocker',
      'VPN Access (50+ locations)',
      'Real-time threat monitoring',
    ],
    badge: null,
  },
  {
    id: 'pro-annual',
    name: 'CyberForget Pro',
    price: 4.99,
    interval: 'year',
    description: 'Complete privacy protection with premium tools and priority support',
    features: [
      'Remove data from 200+ broker sites',
      'Weekly monitoring & instant re-removal',
      'Detailed removal reports & analytics',
      'Priority customer support',
      'Custom removal requests',
      'Premium Ad Blocker',
      'VPN Access (50+ locations)',
      'Real-time threat monitoring',
    ],
    badge: 'Most Popular',
  },
];

const TRUST_BADGES = [
  {
    icon: '🔒',
    title: 'Secure Payment',
    desc: '256-bit SSL encryption',
  },
  {
    icon: '💳',
    title: 'Flexible Billing',
    desc: 'Cancel anytime',
  },
  {
    icon: '⚡',
    title: 'Instant Activation',
    desc: 'Start protecting immediately',
  },
];

const ChangePlanPage = () => {
  const { user } = useAuth();
  const { isPremium, isTrial, daysRemaining } = useSubscription();
  const [isAnnual, setIsAnnual] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const plan = isAnnual ? PLANS[1] : PLANS[0];

  return (
    <div className="app-layout">
      {!isMobile && <Sidebar />}
      {isMobile ? <MobileNavbar /> : <Navbar />}
      <main className="change-plan-main">
        {isPremium ? (
          <div className="change-plan-glass-container premium-dashboard">
            <section className="premium-welcome">
              <h1>Welcome, Premium Member! 🎉</h1>
              <p className="premium-subtitle">Thank you for upgrading to CyberForget Pro. Here’s how to get the most out of your membership:</p>
            </section>
            <section className="premium-quickstart">
              <h2>Quick Start Guide</h2>
              <ol className="quickstart-steps">
                <li>Connect your email and accounts for monitoring.</li>
                <li>Run your first data broker scan and review your privacy report.</li>
                <li>Set up weekly monitoring and instant re-removal.</li>
                <li>Explore premium tools: Ad Blocker, VPN, and custom removal requests.</li>
                <li>Check your dashboard for real-time threat alerts and analytics.</li>
              </ol>
            </section>
            <section className="premium-how-it-works">
              <h2>How It Works</h2>
              <ul className="howitworks-list">
                <li>We scan 200+ broker sites and remove your data automatically.</li>
                <li>Weekly monitoring keeps your privacy protected 24/7.</li>
                <li>Get instant alerts for new threats and data exposures.</li>
                <li>Priority support and custom requests are just a click away.</li>
              </ul>
            </section>
            <section className="premium-perks">
              <h2>Premium Perks</h2>
              <ul className="perks-list">
                <li>✅ Unlimited data removals</li>
                <li>✅ Premium Ad Blocker</li>
                <li>✅ Global VPN (50+ locations)</li>
                <li>✅ Priority customer support</li>
                <li>✅ Custom removal requests</li>
                <li>✅ Real-time threat monitoring</li>
              </ul>
            </section>
            <section className="premium-billing">
              <h2>Manage Billing</h2>
              <a href="https://billing.cyberforget.com" target="_blank" rel="noopener noreferrer" className="manage-billing-btn">Manage Billing</a>
              <button className="cancel-sub-btn">Cancel Subscription</button>
            </section>
          </div>
        ) : (
          <div className="change-plan-glass-container">
            {/* Hero Section */}
            <section className="change-plan-hero">
              <div className="change-plan-hero-text">
                <h1>Upgrade Your <span className="accent">Protection</span></h1>
                <p className="change-plan-subtitle">
                  Choose the perfect plan for your privacy needs. Switch anytime, cancel anytime.
                </p>
              </div>
              <div className="change-plan-toggle-hero">
                <span className={!isAnnual ? 'active' : ''}>Monthly</span>
                <label className="change-plan-toggle">
                  <input
                    type="checkbox"
                    checked={isAnnual}
                    onChange={() => setIsAnnual(!isAnnual)}
                  />
                  <span className="slider"></span>
                </label>
                <span className={isAnnual ? 'active' : ''}>
                  Annual <span className="save-badge">Save $53/year</span>
                </span>
              </div>
            </section>
            {/* Cards Row */}
            <section className="change-plan-cards-row">
              <div className="change-plan-card main-plan-card">
                {plan.badge && (
                  <div className="plan-badge"><FaCrown /> {plan.badge}</div>
                )}
                <div className="plan-icon"><FaRocket /></div>
                <h2>{plan.name}</h2>
                <p className="plan-desc">{plan.description}</p>
                <div className="plan-price-row">
                  {plan.interval === 'year' ? (
                    <>
                      <span className="plan-price">$4.99</span>
                      <span className="plan-interval">/mo <span className="plan-billed">(billed annually)</span></span>
                    </>
                  ) : (
                    <>
                      <span className="plan-price">$9.99</span>
                      <span className="plan-interval">/mo</span>
                    </>
                  )}
                </div>
                {plan.interval === 'year' && (
                  <div className="plan-savings">$59.99/year &nbsp; <span className="save-badge">Save $53/year</span></div>
                )}
                <ul className="plan-features">
                  {plan.features.map((f, i) => (
                    <li key={i}><FaCheck className="feature-check" /> {f}</li>
                  ))}
                </ul>
                <button className="change-plan-btn">{isPremium ? 'Current Plan' : 'Upgrade Now'}</button>
                {isTrial && <div className="trial-info">{daysRemaining} days left in your free trial</div>}
              </div>
              <div className="why-upgrade-card">
                <h3>Why Upgrade to Pro?</h3>
                <ul>
                  <li><strong>Unlock Total Peace of Mind:</strong> Never worry about your personal data exposure again. Pro members enjoy relentless, automated protection—so you can focus on what matters most.</li>
                  <li><strong>Stay Ahead of Threats:</strong> Our AI-powered monitoring and instant re-removal keep you one step ahead of evolving cyber risks, 24/7.</li>
                  <li><strong>VIP Support & Custom Solutions:</strong> Get priority access to our expert team and request custom removals tailored to your unique needs.</li>
                  <li><strong>Exclusive Tools:</strong> Enjoy premium features like our advanced Ad Blocker and global VPN—only for Pro members.</li>
                  <li><strong>Risk-Free Guarantee:</strong> Try Pro with a 5-day free trial and 30-day money-back promise. No commitment, cancel anytime.</li>
                </ul>
                <div className="why-upgrade-cta">Upgrade now and experience the ultimate in digital privacy and control.</div>
              </div>
            </section>
            {/* Trust Ribbon */}
            <section className="change-plan-trust-ribbon">
              <div className="trust-ribbon-row">
                {TRUST_BADGES.map((badge, i) => (
                  <div className="trust-ribbon-badge" key={i}>
                    <span className="trust-ribbon-icon">{badge.icon}</span>
                    <span className="trust-ribbon-title">{badge.title}</span>
                    <span className="trust-ribbon-desc">{badge.desc}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
        {/* Sticky CTA on mobile */}
        {isMobile && !isPremium && (
          <button className="change-plan-btn sticky-cta">Upgrade Now</button>
        )}
      </main>
    </div>
  );
};

export default ChangePlanPage;