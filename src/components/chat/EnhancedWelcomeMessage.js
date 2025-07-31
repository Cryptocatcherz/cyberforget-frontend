import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShieldAlt, FaUserSecret, FaBolt, FaEye, FaRocket, FaSearchengin } from 'react-icons/fa';

const EnhancedWelcomeMessage = ({ onQuestionClick, onEmailScan }) => {
    const [activeDemo, setActiveDemo] = useState(0);
    const [showStats, setShowStats] = useState(false);

    const demoScenarios = [
        {
            icon: <FaUserSecret />,
            title: "Email Breach Check",
            description: "Paste any email to scan 12+ billion records instantly",
            action: "Try: john@example.com",
            color: "#ff6b6b"
        },
        {
            icon: <FaSearchengin />,
            title: "Data Broker Scan", 
            description: "Find where your personal info is being sold online",
            action: "Scan your location data",
            color: "#4ecdc4"
        },
        {
            icon: <FaShieldAlt />,
            title: "Scam Detection",
            description: "Get AI-powered analysis of suspicious messages",
            action: "Ask about any suspicious activity",
            color: "#45b7d1"
        }
    ];

    const stats = [
        { number: "12B+", label: "Records Scanned" },
        { number: "95%", label: "Removal Success" },
        { number: "200+", label: "Data Brokers" },
        { number: "24/7", label: "Protection" }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveDemo((prev) => (prev + 1) % demoScenarios.length);
        }, 3000);
        
        setTimeout(() => setShowStats(true), 1000);
        
        return () => clearInterval(timer);
    }, []);

    const quickActions = [
        {
            icon: "📧",
            text: "Check if my email was breached",
            action: () => onEmailScan(),
            gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        },
        {
            icon: "🔍", 
            text: "Find my exposed personal data",
            action: () => onQuestionClick("I want to scan for my personal information online"),
            gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
        },
        {
            icon: "🛡️",
            text: "Help me identify a potential scam",
            action: () => onQuestionClick("I received something suspicious and need help"),
            gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
        },
        {
            icon: "📱",
            text: "Check if this phone number is a scam",
            action: () => onQuestionClick("I got a call from a suspicious number"),
            gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
        }
    ];

    return (
        <motion.div 
            className="enhanced-welcome"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            {/* Hero Section */}
            <div className="welcome-hero">
                <motion.div 
                    className="hero-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                >
                    <FaBolt />
                    <span>AI-Powered Privacy Protection</span>
                </motion.div>
                
                <motion.h1 
                    className="hero-title"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    Your Personal <span className="highlight">Security Expert</span>
                </motion.h1>
                
                <motion.p 
                    className="hero-subtitle"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    Get instant AI-powered analysis of scams, breaches, and privacy threats. 
                    Start by asking me anything or try one of these powerful tools:
                </motion.p>
            </div>

            {/* Interactive Demo Section */}
            <motion.div 
                className="demo-showcase"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
            >
                <div className="demo-header">
                    <FaEye />
                    <span>See What I Can Do</span>
                </div>
                
                <div className="demo-cards">
                    {demoScenarios.map((demo, index) => (
                        <motion.div
                            key={index}
                            className={`demo-card ${index === activeDemo ? 'active' : ''}`}
                            style={{ '--accent-color': demo.color }}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setActiveDemo(index)}
                        >
                            <div className="demo-icon">{demo.icon}</div>
                            <h3>{demo.title}</h3>
                            <p>{demo.description}</p>
                            <div className="demo-action">{demo.action}</div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
                className="quick-actions-grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
            >
                <h2 className="section-title">
                    <FaRocket />
                    Get Started Instantly
                </h2>
                
                <div className="actions-grid">
                    {quickActions.map((action, index) => (
                        <motion.button
                            key={index}
                            className="action-card"
                            style={{ background: action.gradient }}
                            onClick={action.action}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 + index * 0.1 }}
                        >
                            <span className="action-icon">{action.icon}</span>
                            <span className="action-text">{action.text}</span>
                            <div className="action-shine"></div>
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Stats Section */}
            <AnimatePresence>
                {showStats && (
                    <motion.div 
                        className="stats-section"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.6 }}
                    >
                        <div className="stats-grid">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    className="stat-item"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 1.2 + index * 0.1, type: "spring" }}
                                >
                                    <div className="stat-number">{stat.number}</div>
                                    <div className="stat-label">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom CTA */}
            <motion.div 
                className="bottom-cta"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
            >
                <div className="cta-content">
                    <h3>Ready to secure your digital life?</h3>
                    <p>Just type your question below or click any option above</p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default EnhancedWelcomeMessage;