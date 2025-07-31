import React from 'react';
import { motion } from 'framer-motion';
import { iconComponents } from '../../config/chatConstants';

const MultipleChoiceAnswers = ({ options, onOptionClick }) => {
    if (!options || options.length === 0) return null;

    return (
        <motion.div 
            className="answer-buttons"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {options.map((option, idx) => {
                const IconComponent = option.iconName ? iconComponents[option.iconName] : null;
                return (
                    <motion.button
                        key={idx}
                        className="answer-option"
                        onClick={() => onOptionClick(option.text)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ 
                            opacity: 1, 
                            x: 0,
                            transition: {
                                delay: 0.1 * idx,
                                duration: 0.3
                            }
                        }}
                        whileHover={{ x: 5, transition: { duration: 0.2 } }}
                    >
                        <div className="option-content">
                            {IconComponent ? <IconComponent className="option-icon" /> : <span className="option-icon">{option.icon}</span>}
                            <span className="option-text">{option.text}</span>
                        </div>
                    </motion.button>
                );
            })}
            <motion.div 
                className="custom-response-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                Or type your own response...
            </motion.div>
        </motion.div>
    );
};

export default MultipleChoiceAnswers; 