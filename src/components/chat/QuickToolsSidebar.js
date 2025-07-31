import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTools, FaTimes, FaBolt, FaArrowRight } from 'react-icons/fa';
import { SECURITY_TOOLS } from '../../config/constants';

const QuickToolsSidebar = ({ isOpen, onClose, onToolClick }) => {
    const [hoveredTool, setHoveredTool] = useState(null);

    const toolCategories = {
        immediate: {
            title: "🚨 Immediate Help",
            tools: ['email_wiper', 'location_scan', 'scamai'],
            description: "Get instant security analysis"
        },
        protection: {
            title: "🛡️ Protection Tools", 
            tools: ['password_check', 'file_scan', 'area_codes'],
            description: "Secure your accounts and files"
        },
        cleanup: {
            title: "🧹 Privacy Cleanup",
            tools: ['delete_account', 'data_broker_scan'],
            description: "Remove your digital footprint"
        }
    };

    const handleToolClick = (toolKey) => {
        const tool = SECURITY_TOOLS[toolKey];
        if (tool && tool.url) {
            if (onToolClick) {
                onToolClick(tool.url, tool.name);
            } else {
                window.open(tool.url, '_blank');
            }
        }
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="quick-tools-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    
                    {/* Sidebar */}
                    <motion.div
                        className="quick-tools-sidebar"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    >
                        <div className="sidebar-header">
                            <div className="header-content">
                                <FaTools />
                                <div>
                                    <h3>Quick Tools</h3>
                                    <p>Instant security analysis</p>
                                </div>
                            </div>
                            <button 
                                className="close-button"
                                onClick={onClose}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="sidebar-content">
                            {Object.entries(toolCategories).map(([categoryKey, category]) => (
                                <div key={categoryKey} className="tool-category">
                                    <div className="category-header">
                                        <h4>{category.title}</h4>
                                        <p>{category.description}</p>
                                    </div>
                                    
                                    <div className="tools-list">
                                        {category.tools.map(toolKey => {
                                            const tool = SECURITY_TOOLS[toolKey];
                                            if (!tool) return null;
                                            
                                            return (
                                                <motion.button
                                                    key={toolKey}
                                                    className={`tool-item ${hoveredTool === toolKey ? 'hovered' : ''}`}
                                                    onClick={() => handleToolClick(toolKey)}
                                                    onHoverStart={() => setHoveredTool(toolKey)}
                                                    onHoverEnd={() => setHoveredTool(null)}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <div className="tool-icon">
                                                        {tool.icon}
                                                    </div>
                                                    <div className="tool-content">
                                                        <h5>{tool.name}</h5>
                                                        <p>{tool.description}</p>
                                                    </div>
                                                    <div className="tool-arrow">
                                                        <FaArrowRight />
                                                    </div>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="sidebar-footer">
                            <div className="footer-tip">
                                <FaBolt />
                                <div>
                                    <strong>Pro Tip:</strong>
                                    <p>Start with an email scan - it's our most popular tool!</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default QuickToolsSidebar;