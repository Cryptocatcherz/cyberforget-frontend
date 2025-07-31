import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faQuestionCircle,
    faPhone,
    faEnvelope,
    faShieldAlt,
    faTrash,
    faEye,
    faRocket,
    faBan,
    faUserSecret,
    faChartLine,
    faUsers,
    faClock,
    faCheck,
    faChevronDown,
    faChevronUp,
    faBolt,
    faLock,
    faSearch,
    faGlobe,
    faHeadset
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from "../hooks/useAuthUtils";
import { motion } from 'framer-motion';
import './SupportPage.css';

const SupportPage = () => {
    const { isAuthenticated } = useAuth();
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const faqData = [
        {
            question: "What is CyberForget and how does it protect me?",
            answer: "CyberForget is a professional data removal service that automatically finds and removes your personal information from 200+ data broker websites. We continuously monitor for new exposures and handle all removal requests on your behalf, keeping your personal data private and secure."
        },
        {
            question: "How does the data removal process work?",
            answer: "Our AI-powered system scans data broker sites to find your personal information, then automatically submits removal requests. We handle all the paperwork and follow-ups. Most removals complete within 7-30 days, and we provide detailed progress reports and proof of removal."
        },
        {
            question: "What data brokers do you remove information from?",
            answer: "We monitor and remove data from 200+ major data broker sites including Spokeo, Whitepages, Intelius, BeenVerified, PeopleFinder, TruePeopleSearch, and many others. Our list is constantly updated as new data brokers emerge."
        },
        {
            question: "How often do you check for new data exposures?",
            answer: "Pro users get weekly monitoring and instant removal requests. We continuously scan for your information reappearing on data broker sites and automatically handle re-removal. You'll receive real-time alerts when new exposures are found."
        },
        {
            question: "What's included with the bonus VPN and Ad Blocker?",
            answer: "Pro subscribers get free access to our premium VPN with 50+ global locations and military-grade encryption, plus an advanced ad blocker that speeds up browsing by up to 50% and blocks tracking. These are bonus features included with your data removal plan."
        },
        {
            question: "How do I know the removals are working?",
            answer: "You'll receive detailed progress reports showing exactly which sites we've contacted, removal status, and proof screenshots. Our dashboard provides real-time tracking of all removal requests and their current status."
        },
        {
            question: "Can you remove court records or mugshots?",
            answer: "We focus on removing personal information from commercial data broker sites. Court records and government databases are public information that typically cannot be removed. However, we can often remove copies of this information from third-party sites that republish it."
        },
        {
            question: "What information do you need from me?",
            answer: "To accurately identify and remove your data, we typically need your full name, current address, phone number, and email address. We may request additional details like previous addresses to ensure comprehensive removal. All information is encrypted and kept secure."
        },
        {
            question: "How long does it take to see results?",
            answer: "Most data broker removals complete within 7-30 days. Some sites respond faster than others. You'll start seeing removals within the first week, with the majority completed within 30 days. We continue monitoring and removing as needed."
        },
        {
            question: "Can I cancel my subscription anytime?",
            answer: "Yes, you can cancel your subscription at any time through your account settings or by contacting our support team. There are no long-term contracts or cancellation fees. Your protection remains active until the end of your current billing period."
        },
        {
            question: "Do you offer family protection plans?",
            answer: "Yes! Our Enterprise plan covers up to 5 family members with comprehensive data removal, monitoring, and all bonus features. It's perfect for protecting your entire family's privacy at a significant discount per person."
        },
        {
            question: "Is my personal information safe with CyberForget?",
            answer: "Absolutely. We use bank-level encryption to protect your data, and we never sell or share your information. Our systems are SOC 2 compliant and regularly audited for security. Your privacy is our top priority."
        }
    ];

    const features = [
        {
            icon: faTrash,
            title: "Professional Data Removal",
            description: "We find and remove your personal information from 200+ data broker websites that sell your data to scammers and marketers."
        },
        {
            icon: faEye,
            title: "24/7 Monitoring",
            description: "Continuous monitoring for new data exposures with automatic re-removal when your information reappears online."
        },
        {
            icon: faChartLine,
            title: "Detailed Reports",
            description: "Real-time progress tracking with detailed removal reports and proof screenshots of successful removals."
        },
        {
            icon: faBan,
            title: "Premium Ad Blocker",
            description: "Bonus feature: Advanced ad blocking that speeds up browsing by 50% and blocks tracking across all websites."
        },
        {
            icon: faUserSecret,
            title: "VPN Access",
            description: "Bonus feature: Premium VPN with 50+ global locations and military-grade encryption for complete online privacy."
        },
        {
            icon: faHeadset,
            title: "Priority Support",
            description: "24/7 customer support with priority assistance for all your privacy protection needs and questions."
        }
    ];

    const steps = [
        {
            number: "01",
            title: "Sign Up & Verify",
            description: "Create your account and provide the information needed to identify your data across broker sites."
        },
        {
            number: "02",
            title: "We Find Your Data",
            description: "Our AI scans 200+ data broker sites to locate all instances of your personal information."
        },
        {
            number: "03",
            title: "Automatic Removal",
            description: "We handle all removal requests, paperwork, and follow-ups on your behalf."
        },
        {
            number: "04",
            title: "Ongoing Protection",
            description: "Continuous monitoring and re-removal ensures your data stays private long-term."
        }
    ];

    return (
        <div className="cyberforget-support-page">
            <motion.div 
                className="support-content-wrapper"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <div className="support-container">
                    {/* HERO SECTION */}
                    <motion.section className="support-hero pro-hero" variants={cardVariants}>
                        <div className="hero-content pro-hero-content">
                            <div className="hero-icon pro-hero-icon">
                                <FontAwesomeIcon icon={faShieldAlt} />
                            </div>
                            <h1 className="hero-title pro-hero-title">
                                <span className="brand-gradient">CyberForget</span> <span className="highlight">Support Center</span>
                            </h1>
                            <p className="hero-subtitle pro-hero-subtitle">
                                Professional data removal & privacy protection, powered by AI and real experts.
                            </p>
                            <div className="hero-stats pro-hero-stats">
                                <div className="stat"><span className="stat-number">200+</span><span className="stat-label">Sites Monitored</span></div>
                                <div className="stat"><span className="stat-number">99%</span><span className="stat-label">Success Rate</span></div>
                                <div className="stat"><span className="stat-number">24/7</span><span className="stat-label">Monitoring</span></div>
                            </div>
                        </div>
                    </motion.section>

                    {/* FEATURES SECTION */}
                    <motion.section className="what-we-do pro-features-section" variants={cardVariants}>
                        <div className="section-header pro-section-header">
                            <h2 className="brand-gradient">What CyberForget Does</h2>
                            <p>Comprehensive data removal, monitoring, and premium privacy tools.</p>
                        </div>
                        <div className="features-grid pro-features-grid">
                            {features.map((feature, index) => (
                                <motion.div 
                                    key={index} 
                                    className="feature-card pro-feature-card"
                                    variants={cardVariants}
                                    whileHover={{ y: -5, transition: { duration: 0.3 } }}
                                >
                                    <div className="feature-icon pro-feature-icon">
                                        <FontAwesomeIcon icon={feature.icon} />
                                    </div>
                                    <h3 className="pro-feature-title">{feature.title}</h3>
                                    <p className="pro-feature-desc">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* HOW IT WORKS SECTION */}
                    <motion.section className="how-it-works pro-how-section" variants={cardVariants}>
                        <div className="section-header pro-section-header">
                            <h2 className="brand-gradient">How CyberForget Works</h2>
                            <p>Simple, secure, and effective privacy protection in 4 steps.</p>
                        </div>
                        <div className="steps-row pro-steps-row">
                            {steps.map((step, index) => (
                                <motion.div 
                                    key={index} 
                                    className="step-card pro-step-card"
                                    variants={cardVariants}
                                >
                                    <div className="step-number pro-step-number">{step.number}</div>
                                    <h3 className="pro-step-title">{step.title}</h3>
                                    <p className="pro-step-desc">{step.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* FAQ SECTION */}
                    <motion.section className="faq-section pro-faq-section" variants={cardVariants}>
                        <div className="section-header pro-section-header">
                            <h2 className="brand-gradient">Frequently Asked Questions</h2>
                            <p>Everything you need to know about CyberForget’s privacy services.</p>
                        </div>
                        <div className="faq-container pro-faq-container">
                            {faqData.map((faq, index) => (
                                <motion.div 
                                    key={index} 
                                    className={`faq-item pro-faq-item ${activeIndex === index ? 'active' : ''}`}
                                    variants={cardVariants}
                                >
                                    <div 
                                        className="faq-question pro-faq-question" 
                                        onClick={() => toggleFAQ(index)}
                                    >
                                        <h3>{faq.question}</h3>
                                        <FontAwesomeIcon 
                                            icon={activeIndex === index ? faChevronUp : faChevronDown} 
                                            className="faq-icon pro-faq-icon"
                                        />
                                    </div>
                                    {activeIndex === index && (
                                        <motion.div 
                                            className="faq-answer pro-faq-answer"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <p>{faq.answer}</p>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* CONTACT SECTION */}
                    <motion.section className="contact-section pro-contact-section" variants={cardVariants}>
                        <div className="section-header pro-section-header">
                            <h2 className="brand-gradient">Get Personal Support</h2>
                            <p>Our privacy experts are here to help you 24/7.</p>
                        </div>
                        <div className="contact-grid pro-contact-grid">
                            <motion.div 
                                className="contact-card pro-contact-card"
                                variants={cardVariants}
                                whileHover={{ y: -5, transition: { duration: 0.3 } }}
                            >
                                <div className="contact-icon pro-contact-icon">
                                    <FontAwesomeIcon icon={faPhone} />
                                </div>
                                <h3>Call Us</h3>
                                <p>Speak directly with our privacy experts</p>
                                <a href="tel:+14242169253" className="contact-link pro-contact-link">
                                    +1 (424) 216-9253
                                </a>
                            </motion.div>
                            <motion.div 
                                className="contact-card pro-contact-card"
                                variants={cardVariants}
                                whileHover={{ y: -5, transition: { duration: 0.3 } }}
                            >
                                <div className="contact-icon pro-contact-icon">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </div>
                                <h3>Email Support</h3>
                                <p>Get detailed help via email</p>
                                <a href="mailto:support@cyberforget.com" className="contact-link pro-contact-link">
                                    support@cyberforget.com
                                </a>
                            </motion.div>
                        </div>
                        <div className="support-hours pro-support-hours">
                            <FontAwesomeIcon icon={faClock} />
                            <span>Support Hours: Monday - Friday, 9 AM - 6 PM PST</span>
                        </div>
                    </motion.section>
                </div>
            </motion.div>
        </div>
    );
};

export default SupportPage;
