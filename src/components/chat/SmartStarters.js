import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLightbulb, FaRandom, FaFire } from 'react-icons/fa';

const SmartStarters = ({ onQuestionClick, userContext = {} }) => {
    const [currentCategory, setCurrentCategory] = useState('trending');
    const [suggestions, setSuggestions] = useState([]);

    const categories = {
        trending: {
            icon: <FaFire />,
            title: "Trending Now",
            color: "#ff6b6b"
        },
        personalized: {
            icon: <FaLightbulb />,
            title: "For You",
            color: "#4ecdc4"
        },
        random: {
            icon: <FaRandom />,
            title: "Explore",
            color: "#45b7d1"
        }
    };

    const questionSets = {
        trending: [
            {
                text: "Are AI voice clones being used in phone scams?",
                category: "AI Scams",
                urgency: "high",
                icon: "🤖"
            },
            {
                text: "How do I know if my Social Security number is on the dark web?",
                category: "Identity Theft",
                urgency: "high",
                icon: "🆔"
            },
            {
                text: "What should I do if I got a fake PayPal email?",
                category: "Phishing",
                urgency: "medium",
                icon: "💳"
            },
            {
                text: "Are QR code restaurant menus safe to scan?",
                category: "QR Scams",
                urgency: "medium",
                icon: "📱"
            },
            {
                text: "Someone called saying my car warranty expired - is this real?",
                category: "Phone Scams",
                urgency: "low",
                icon: "🚗"
            }
        ],
        personalized: [
            {
                text: "Analyze my digital footprint and security posture",
                category: "AI Cyber Intelligence",
                urgency: "high",
                icon: "🧠",
                toolType: "data_broker_scan"
            },
            {
                text: "Scan my email for data breaches and compromises",
                category: "Email Security",
                urgency: "high",
                icon: "📧",
                toolType: "email_breach"
            },
            {
                text: "Perform comprehensive security assessment",
                category: "Security Assessment",
                urgency: "high",
                icon: "🛡️",
                toolType: "comprehensive_security"
            },
            {
                text: "Deploy AI-powered cyber defense strategies",
                category: "AI Defense",
                urgency: "medium",
                icon: "🤖",
                toolType: "ai_defense"
            },
            {
                text: "Evaluate my password security and vulnerabilities",
                category: "Password Security",
                urgency: "medium",
                icon: "🔐",
                toolType: "password_checker"
            }
        ],
        random: [
            {
                text: "Run advanced security penetration tests",
                category: "Security Testing",
                urgency: "high",
                icon: "🧪",
                toolType: "security_test_suite"
            },
            {
                text: "Analyze network vulnerabilities and exposure",
                category: "Network Security",
                urgency: "medium",
                icon: "🌐",
                toolType: "network_scan"
            },
            {
                text: "Scan files for malware and security threats",
                category: "File Security",
                urgency: "medium",
                icon: "📄",
                toolType: "file_scan"
            },
            {
                text: "Help me delete online accounts and reduce my digital footprint",
                category: "Account Management",
                urgency: "low",
                icon: "🗑️",
                toolType: "account_deleter"
            },
            {
                text: "Check phone numbers for scams and fraud",
                category: "Phone Security",
                urgency: "medium",
                icon: "📞",
                toolType: "area_code_checker"
            }
        ]
    };

    useEffect(() => {
        // Shuffle and select questions for current category
        const categoryQuestions = questionSets[currentCategory] || [];
        const shuffled = [...categoryQuestions].sort(() => Math.random() - 0.5);
        setSuggestions(shuffled.slice(0, 4));
    }, [currentCategory]);

    const getUrgencyColor = (urgency) => {
        switch (urgency) {
            case 'high': return '#ff6b6b';
            case 'medium': return '#ffa726';
            case 'low': return '#66bb6a';
            default: return '#64748b';
        }
    };

    return (
        <motion.div 
            className="smart-starters"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="starters-header">
                <h3>💡 Need inspiration? Try asking about:</h3>
                
                <div className="category-tabs">
                    {Object.entries(categories).map(([key, category]) => (
                        <button
                            key={key}
                            className={`category-tab ${currentCategory === key ? 'active' : ''}`}
                            onClick={() => setCurrentCategory(key)}
                            style={{ '--accent-color': category.color }}
                        >
                            {category.icon}
                            <span>{category.title}</span>
                        </button>
                    ))}
                </div>
            </div>

            <motion.div 
                className="suggestions-grid"
                key={currentCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
            >
                {suggestions.map((suggestion, index) => (
                    <motion.button
                        key={index}
                        className="suggestion-card"
                        onClick={() => onQuestionClick(suggestion.text, { toolType: suggestion.toolType })}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="suggestion-header">
                            <span className="suggestion-icon">{suggestion.icon}</span>
                            <div className="suggestion-meta">
                                <span className="suggestion-category">{suggestion.category}</span>
                                <span 
                                    className="urgency-indicator"
                                    style={{ backgroundColor: getUrgencyColor(suggestion.urgency) }}
                                >
                                    {suggestion.urgency}
                                </span>
                            </div>
                        </div>
                        <p className="suggestion-text">{suggestion.text}</p>
                        <div className="suggestion-arrow">→</div>
                    </motion.button>
                ))}
            </motion.div>

            <div className="starters-footer">
                <p>
                    <strong>Pro tip:</strong> Be specific! Instead of "help with scam," 
                    try "I got a text saying I won $1000, is this real?"
                </p>
            </div>
        </motion.div>
    );
};

export default SmartStarters;