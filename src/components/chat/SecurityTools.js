import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt } from 'react-icons/fa';

const SecurityTools = () => {
    const tools = [
        {
            name: "Email Breach Scanner", 
            description: "Check if your email was exposed in data breaches",
            icon: "📧",
            url: "/data-leak"
        },
        {
            name: "Data Broker Scan",
            description: "Scan data brokers for your personal info",
            icon: "🔍",
            url: "/location"
        },
        {
            name: "Password Checker",
            description: "Test password strength & get secure suggestions", 
            icon: "🔐",
            url: "/password-check"
        },
        {
            name: "Phone Number Checker",
            description: "Identify suspicious phone numbers and their origin",
            icon: "📞", 
            url: "/area-codes"
        },
        {
            name: "Account Deleter",
            description: "Step-by-step guide to remove old accounts",
            icon: "🗑️",
            url: "/delete-account"
        },
        {
            name: "Virus Scanner",
            description: "Analyze suspicious files for threats",
            icon: "🛡️",
            url: "/file-scan"
        }
    ];


    return (
        <motion.div
            className="security-tools"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <div className="tools-header">
                <FaShieldAlt className="tools-icon" />
                <h2>Recommended Security Tools</h2>
            </div>
            <div className="tools-grid">
                {tools.map((tool, index) => (
                    <motion.a
                        key={`${tool.name}-${index}`}
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tool-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ 
                            opacity: 1, 
                            y: 0,
                            transition: { delay: index * 0.1 }
                        }}
                        whileHover={{ 
                            scale: 1.02,
                            backgroundColor: 'rgba(66, 255, 181, 0.15)',
                            borderColor: 'rgba(66, 255, 181, 0.4)'
                        }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="tool-icon-emoji">{tool.icon}</span>
                        <div className="tool-content">
                            <h3>{tool.name}</h3>
                            <p>{tool.description}</p>
                        </div>
                    </motion.a>
                ))}
            </div>

            <style>{`
                .security-tools {
                    margin: 24px 0;
                    padding: 20px;
                    background: rgba(28, 28, 28, 0.95);
                    border: 1px solid rgba(66, 255, 181, 0.2);
                    border-radius: 12px;
                }

                .tools-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 20px;
                }

                .tools-icon {
                    color: #42ffb5;
                    font-size: 24px;
                }

                .tools-header h2 {
                    color: #42ffb5;
                    font-size: 1.4rem;
                    margin: 0;
                }

                .tools-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 16px;
                }

                .tool-card {
                    display: flex;
                    align-items: flex-start;
                    gap: 16px;
                    padding: 16px;
                    background: rgba(66, 255, 181, 0.1);
                    border: 1px solid rgba(66, 255, 181, 0.2);
                    border-radius: 8px;
                    color: #ffffff;
                    text-decoration: none;
                    transition: all 0.2s ease;
                }

                .tool-icon-emoji {
                    font-size: 24px;
                    min-width: 24px;
                }

                .tool-content {
                    flex: 1;
                }

                .tool-content h3 {
                    margin: 0 0 8px;
                    font-size: 1.1rem;
                    color: #42ffb5;
                }

                .tool-content p {
                    margin: 0;
                    font-size: 0.9rem;
                    line-height: 1.4;
                    opacity: 0.9;
                }

                @media (max-width: 768px) {
                    .security-tools {
                        margin: 16px 0;
                        padding: 16px;
                    }

                    .tools-header h2 {
                        font-size: 1.2rem;
                    }

                    .tools-grid {
                        grid-template-columns: 1fr;
                    }

                    .tool-card {
                        padding: 12px;
                    }

                    .tool-content h3 {
                        font-size: 1rem;
                    }

                    .tool-content p {
                        font-size: 0.85rem;
                    }
                }
            `}</style>
        </motion.div>
    );
};

export default SecurityTools; 