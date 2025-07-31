import React from 'react';
import { motion } from 'framer-motion';
import { iconComponents } from '../../config/chatConstants';

const WelcomeMessage = React.forwardRef(({ preMadeQuestions, onQuestionClick, handleEmailScanClick }, ref) => {
    return (
        <motion.div 
            className="welcome-message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            ref={ref}
        >
            <div className="welcome-header">
                <h1>Advanced Cyber Intelligence Platform</h1>
                <p>Powered by next-generation AI, CyberForget provides industry-leading cyber intelligence and threat analysis. From comprehensive digital footprint analysis to advanced threat detection - experience the future of cybersecurity today.</p>
            </div>
            
            <div className="question-buttons">
                {preMadeQuestions.map((question, index) => {
                    const IconComponent = iconComponents[question.iconName];
                    return (
                        <motion.button
                            key={index}
                            className="question-button enterprise-grade"
                            onClick={() => {
                                if (question.isEmailScan) {
                                    // Open the email scan popup
                                    if (window.openEmailScanPopup) {
                                        window.openEmailScanPopup();
                                    } else {
                                        onQuestionClick(question.text, { toolType: question.toolType });
                                    }
                                } else {
                                    onQuestionClick(question.text, { toolType: question.toolType });
                                }
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="question-button-content">
                                <div className="question-header">
                                    {IconComponent && <IconComponent className="question-icon" />}
                                    <span className="question-text">{question.text}</span>
                                </div>
                                {question.description && (
                                    <p className="question-description">{question.description}</p>
                                )}
                                {question.requiresUserInput && (
                                    <div className="input-indicator">
                                        <span className="input-type">Requires: {question.inputType.replace('_', ' ')}</span>
                                    </div>
                                )}
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </motion.div>
    );
});

WelcomeMessage.displayName = 'WelcomeMessage';

export default WelcomeMessage; 